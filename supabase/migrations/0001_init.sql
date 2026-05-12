-- ─────────────────────────────────────────────────────────────────────────────
-- The Round Table — M0 initial schema
--
-- Tables for the four-step signup ritual + entitlement mirror + audit trail.
-- Single-tenant: no organization_id. RLS on every table. Service-role
-- operations (entitlement writes, audit log) bypass RLS via edge functions.
-- ─────────────────────────────────────────────────────────────────────────────

-- ---- Pillar enum (canonical from docs/product-brief.md §3) ------------------
create type pillar as enum (
  'fitness',
  'investing',
  'style',
  'relationship_building',
  'time_management',
  'business_building',
  'leadership'
);

-- ---- Tier enum (mirrors lib/tiers.ts) ---------------------------------------
create type tier_id as enum ('new_member', 'knight', 'council');

-- ---- profiles ---------------------------------------------------------------
-- One row per auth user. Created lazily on first signup-ritual step.
create table profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  display_name            text,
  avatar_url              text,
  bio                     text,
  honor_code_signed_at    timestamptz,
  standards_declared_at   timestamptz,
  cohort                  text,  -- e.g. 'founding_knight_2026'
  is_admin                boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index profiles_cohort_idx on profiles(cohort);

-- ---- profile_standards ------------------------------------------------------
-- Member-declared standards. 1–5 per member, 140 chars each.
create table profile_standards (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  pillar       pillar not null,
  statement    text not null check (char_length(statement) between 1 and 140),
  created_at   timestamptz not null default now(),
  retired_at   timestamptz
);
create index profile_standards_profile_idx on profile_standards(profile_id);

-- ---- entitlements -----------------------------------------------------------
-- Mirror of RevenueCat customer state. Written by the RC webhook edge
-- function only. Client reads are read-only via RLS.
create table entitlements (
  profile_id        uuid primary key references profiles(id) on delete cascade,
  tier              tier_id not null,
  source            text not null check (source in ('stripe', 'apple', 'google', 'manual')),
  product_id        text,
  active            boolean not null default true,
  expires_at        timestamptz,
  rc_customer_id    text,
  updated_at        timestamptz not null default now()
);
create index entitlements_active_tier_idx on entitlements(active, tier);

-- ---- push_tokens ------------------------------------------------------------
create table push_tokens (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  platform    text not null check (platform in ('ios', 'android', 'web')),
  token       text not null,
  created_at  timestamptz not null default now(),
  unique (profile_id, token)
);

-- ---- audit_log --------------------------------------------------------------
-- Append-only. Server-only writes. We log honor-code agreements, tier
-- changes, account deletions, standards revisions.
create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles(id) on delete set null,
  action      text not null,
  target      text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);
create index audit_log_actor_idx on audit_log(actor_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger entitlements_updated_at before update on entitlements
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table profiles            enable row level security;
alter table profile_standards   enable row level security;
alter table entitlements        enable row level security;
alter table push_tokens         enable row level security;
alter table audit_log           enable row level security;

-- profiles: members read all (directory); only self can update self
create policy profiles_select_all on profiles
  for select using (auth.uid() is not null);
create policy profiles_insert_self on profiles
  for insert with check (auth.uid() = id);
create policy profiles_update_self on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- No delete policy — deletion goes through service-role edge function.

-- profile_standards: members read all (visible on profiles); only self mutates
create policy profile_standards_select_all on profile_standards
  for select using (auth.uid() is not null);
create policy profile_standards_insert_self on profile_standards
  for insert with check (auth.uid() = profile_id);
create policy profile_standards_update_self on profile_standards
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy profile_standards_delete_self on profile_standards
  for delete using (auth.uid() = profile_id);

-- entitlements: members read own only; writes are service-role only.
create policy entitlements_select_self on entitlements
  for select using (auth.uid() = profile_id);
-- No insert/update/delete client policies — service role bypasses RLS.

-- push_tokens: self-only.
create policy push_tokens_select_self on push_tokens
  for select using (auth.uid() = profile_id);
create policy push_tokens_insert_self on push_tokens
  for insert with check (auth.uid() = profile_id);
create policy push_tokens_delete_self on push_tokens
  for delete using (auth.uid() = profile_id);

-- audit_log: no client access at all. Service-role reads via Supabase Studio.

-- ─────────────────────────────────────────────────────────────────────────────
-- Audit triggers — log honor code + standards activity automatically
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function log_honor_code() returns trigger language plpgsql security definer as $$
begin
  if (old.honor_code_signed_at is null and new.honor_code_signed_at is not null) then
    insert into audit_log (actor_id, action, target)
    values (new.id, 'honor_code_signed', new.id::text);
  end if;
  return new;
end$$;
create trigger profiles_log_honor_code after update on profiles
  for each row execute function log_honor_code();

create or replace function log_standard_change() returns trigger language plpgsql security definer as $$
begin
  insert into audit_log (actor_id, action, target, metadata)
  values (
    coalesce(new.profile_id, old.profile_id),
    case tg_op
      when 'INSERT' then 'standard_declared'
      when 'UPDATE' then 'standard_revised'
      when 'DELETE' then 'standard_retired'
    end,
    coalesce(new.id, old.id)::text,
    jsonb_build_object(
      'pillar',    coalesce(new.pillar, old.pillar),
      'statement', coalesce(new.statement, old.statement)
    )
  );
  return coalesce(new, old);
end$$;
create trigger profile_standards_log after insert or update or delete on profile_standards
  for each row execute function log_standard_change();
