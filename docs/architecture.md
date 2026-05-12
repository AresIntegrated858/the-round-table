# Technical Architecture — The Round Table

> Stack pre-approved by user (Expo Router + React Native Web + Supabase). This document locks the decisions, names trade-offs, and pins the data model.

---

## 1. Stack decision matrix

| Stack option | iOS / Android | Web | Code reuse | Velocity | Native feel | Verdict |
|---|---|---|---|---|---|---|
| **Expo Router + React Native Web** ✅ | Native via EAS | RNW | ~90% | High | High where needed; bridge for native modules | **Chosen** |
| Next.js + Capacitor wrapper | Webview-in-shell | Native Next | ~95% | High | Low (webview lag, no real native feel) | Rejected — fails App Store Review 4.2.2 "minimum functionality" risk if it feels webview-y |
| Native iOS (Swift) + Android (Kotlin) + Next.js web | Native | Native web | ~0% | Low | Highest | Rejected — 3× build cost for a solo founder |
| Flutter | Native | Mediocre web | ~85% | Medium | High | Rejected — diverges from John's Next.js (Contract Command) stack; smaller ecosystem for RevenueCat + Supabase patterns |

**Why Expo Router wins for this product:**

- One codebase ships three apps.
- Expo SDK 51+ ships with Hermes, EAS Build, expo-router file-based routing that mirrors Next.js mental model (John already lives in Next.js).
- React Native Web maps cleanly to web for the marketing + auth'd shell.
- RevenueCat has first-class RN + RNW SDKs.
- Supabase JS works identically across web and native.
- EAS Submit handles App Store Connect + Play Console submission.
- Apple Sign-In, Google Sign-In, push notifications all have Expo modules.

> **DECISION:** Expo SDK 51+, Expo Router, React Native Web, EAS Build + Submit, TypeScript strict mode.

---

## 2. Stack summary (canonical)

| Layer | Choice | Why |
|---|---|---|
| **App framework** | Expo SDK 51+, Expo Router, React Native (latest), React Native Web | One codebase, three platforms |
| **Language** | TypeScript (strict) | Same as Contract Command, type safety at scale |
| **Styling** | NativeWind v4 (Tailwind for RN) + tokens via `tailwind.config.ts` | Reuse John's Tailwind mental model from BizCom |
| **UI primitives** | Tamagui *or* `react-native-reusables` (shadcn for RN) — pick one in scaffold | Match shadcn/Radix patterns from BizCom |
| **State** | Zustand for local UI state | Tiny, no Redux ceremony |
| **Server state** | TanStack Query (React Query) | Cache + invalidation discipline |
| **Validation** | Zod | Shared between client + server, same as BizCom |
| **Backend** | Supabase (Auth + Postgres + Storage + Realtime + Edge Functions) | User-chosen, matches Contract Command stack |
| **ORM (server)** | Drizzle ORM (Supabase Edge Functions / Next.js API route) | Prisma not chosen — Drizzle is leaner for RN/edge; postgres-only |
| **Payments — web** | Stripe Subscriptions (via RevenueCat web SDK) | Standard for SaaS |
| **Payments — iOS** | Apple StoreKit 2 via RevenueCat | Required by Apple |
| **Payments — Android** | Google Play Billing v6 via RevenueCat | Required by Google |
| **Entitlements** | RevenueCat (source of truth) | Cross-platform unified subs |
| **Auth providers** | Email magic link, Apple Sign-In (required on iOS if other 3P used), Google Sign-In | Apple guideline 4.8 |
| **Push** | Expo Push → APNs / FCM | Built-in, simple |
| **Media storage** | Supabase Storage + on-the-fly transforms via Supabase image transform | Free tier sufficient for v1 |
| **Video** | Mux (HLS, signed playback, captions) | Required for paid course content; signed URLs prevent leak |
| **Email — transactional** | Resend (same as Contract Command) | Branded |
| **Email — marketing/lifecycle** | Defer to v1.1 (Resend Broadcast or Customer.io) | Out of MVP scope |
| **Search** | Postgres FTS (tsvector) on content + member directory | Adequate to ~10K members |
| **Realtime** | Supabase Realtime (Postgres replication channels) | For feed updates + presence; chat is v1.1 |
| **Observability** | Sentry (RN + web), source-mapped | Catches store-review-blocking crashes |
| **Analytics** | PostHog (self-host or cloud) — events + funnels + session replay (web only) | Same posture as BizCom |
| **AI** | Anthropic Claude API (`claude-sonnet-4-6`) via server-side proxy | Same vendor as Contract Command; used for content moderation, post tagging, summarization. **Never** to impersonate experts. |
| **Hosting (web)** | Vercel for marketing/static + Expo Router web app | Standard; CDN edge |
| **Hosting (functions)** | Supabase Edge Functions + Vercel API routes (web) | Co-located with data |
| **CI/CD** | GitHub Actions → EAS Build + Vercel | Standard |
| **Secrets** | Doppler *or* 1Password CLI for local; Vercel/EAS for prod | Don't commit `.env` |

> **DECISION:** Drizzle over Prisma. Drizzle is faster on edge runtimes, leaner bundle, and the Round Table doesn't need Prisma Studio. (Decision logged in `decisions.md`.)

---

## 3. Repository layout

Monorepo not required for v1 — single Expo app with shared code, web + native ship from one codebase.

```
the-round-table/
├── app/                          # Expo Router routes (file-based, like Next.js app/)
│   ├── (marketing)/              # Web-only, unauthenticated
│   │   ├── index.tsx             # Landing
│   │   ├── pillars/[slug].tsx    # The 7 pillars
│   │   ├── knights/[slug].tsx    # Founding knight bios
│   │   ├── apply.tsx             # Application + paywall entry
│   │   └── _layout.tsx
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   ├── apply.tsx             # Application form
│   │   ├── paywall.tsx
│   │   └── _layout.tsx
│   ├── (app)/                    # Authenticated + entitled
│   │   ├── (tabs)/
│   │   │   ├── feed.tsx          # Primary Round Table feed
│   │   │   ├── library.tsx
│   │   │   ├── challenges.tsx
│   │   │   ├── directory.tsx
│   │   │   └── profile.tsx
│   │   ├── subsection/[slug].tsx # Fitness / Relations / Style / Investments / Entrepreneurship
│   │   ├── post/[id].tsx
│   │   ├── course/[slug].tsx
│   │   ├── lesson/[slug]/[lesson].tsx
│   │   ├── live/[id].tsx
│   │   ├── settings/
│   │   │   ├── index.tsx
│   │   │   ├── subscription.tsx
│   │   │   ├── account.tsx       # incl. account deletion (Apple 5.1.1(v))
│   │   │   └── notifications.tsx
│   │   └── _layout.tsx
│   ├── +not-found.tsx
│   └── _layout.tsx               # Root: providers, auth, RevenueCat init
├── features/                     # Feature modules (per-domain)
│   ├── auth/
│   ├── billing/                  # RevenueCat + paywall components
│   ├── feed/
│   ├── library/
│   ├── challenges/
│   ├── standards/
│   ├── directory/
│   ├── moderation/
│   └── notifications/
├── ui/                           # Shared design system primitives
│   ├── tokens.ts                 # Color, type, spacing tokens
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Insignia.tsx              # Rank badges
│   └── ...
├── server/                       # Server-side code
│   ├── db/                       # Drizzle schema + migrations
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── edge/                     # Supabase Edge Functions
│   │   ├── revenuecat-webhook/
│   │   ├── moderation/
│   │   └── ...
│   └── lib/
├── supabase/
│   ├── config.toml
│   ├── migrations/               # SQL migrations (RLS policies live here)
│   ├── seed.sql
│   └── functions/                # Edge functions
├── scripts/
├── assets/
├── app.json                      # Expo config
├── eas.json                      # EAS Build profiles
├── tsconfig.json
├── package.json
└── README.md
```

> **DECISION:** No monorepo for v1. If we add a separate admin web later, we revisit (Turborepo).

---

## 4. Data model (canonical for v1)

All tables tenanted to the platform (single tenant — the Round Table is *not* multi-tenant SaaS like BizCom). RLS still enforced per user.

### 4.1 Identity

```sql
-- Supabase auth.users handled by Supabase.
-- Application-level profile:
profiles (
  id              uuid primary key references auth.users(id),
  handle          text unique not null,        -- @handle
  display_name    text not null,
  bio             text,
  avatar_url      text,
  region          text,                        -- city, state-country
  joined_at       timestamptz not null default now(),
  rank            text not null default 'squire'
                  check (rank in ('squire','knight','knight_commander','council')),
  cohort          text,                        -- e.g., 'founding-2026'
  is_founding_knight boolean not null default false,
  role            text not null default 'member'
                  check (role in ('member','expert','moderator','admin')),
  honor_code_signed_at timestamptz,
  deleted_at      timestamptz                   -- soft delete; hard purge job removes data
);

profile_standards (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  pillar          text not null check (pillar in (
                    'fitness','investing','style','relationship_building',
                    'time_management','business_building','leadership')),
  statement       text not null,
  created_at      timestamptz not null default now()
);
```

### 4.2 Entitlements (mirror of RevenueCat)

```sql
entitlements (
  profile_id          uuid primary key references profiles(id) on delete cascade,
  tier                text not null check (tier in ('none','new_member','knight','council')),
  is_trial            boolean not null default false,
  current_period_end  timestamptz,
  platform            text check (platform in ('stripe','apple','google')),
  rc_subscriber_id    text,                  -- RevenueCat app user id
  updated_at          timestamptz not null default now()
);
```

### 4.3 Content

```sql
content (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null check (kind in (
                    'article','video','audio','live','course','lesson',
                    'standard_prompt','member_post','resource','challenge')),
  title           text not null,
  slug            text unique,
  body_md         text,
  hero_image_url  text,
  media_url       text,                       -- mux playback id for video
  author_id       uuid references profiles(id),
  parent_id       uuid references content(id), -- for lessons under a course
  subsection      text check (subsection in (
                    'round_table','fitness','relations','style',
                    'investments','entrepreneurship')),
  pillars         text[] not null default '{}',
  required_tier   text not null default 'new_member'
                  check (required_tier in ('new_member','knight','council')),
  visibility      text not null default 'published'
                  check (visibility in ('draft','published','archived')),
  scheduled_for   timestamptz,
  published_at    timestamptz,
  fts             tsvector,                   -- generated col, full-text
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

content_engagements (
  id              uuid primary key default gen_random_uuid(),
  content_id      uuid not null references content(id) on delete cascade,
  profile_id      uuid not null references profiles(id) on delete cascade,
  kind            text not null check (kind in ('view','complete','endorse','flag')),
  created_at      timestamptz not null default now(),
  unique(content_id, profile_id, kind)
);

comments (
  id              uuid primary key default gen_random_uuid(),
  content_id      uuid not null references content(id) on delete cascade,
  profile_id      uuid not null references profiles(id) on delete cascade,
  parent_comment_id uuid references comments(id),
  body_md         text not null,
  is_flagged      boolean not null default false,
  created_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
```

### 4.4 Brotherhood mechanics

```sql
check_ins (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  pillar          text not null,
  body            text not null,
  outcome         text check (outcome in ('on','off','partial')),
  visibility      text not null default 'table'   -- 'table' or 'pair'
                  check (visibility in ('table','pair','private')),
  created_at      timestamptz not null default now()
);

standards_reviews (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  week_of         date not null,
  ratings         jsonb not null,                 -- {fitness:8, investing:5, ...}
  notes           text,
  created_at      timestamptz not null default now(),
  unique(profile_id, week_of)
);

challenges (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description_md  text not null,
  pillars         text[] not null default '{}',
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  required_tier   text not null default 'new_member',
  kind            text not null check (kind in ('weekly','crucible','custom')),
  points          int not null default 0
);

challenge_participations (
  id              uuid primary key default gen_random_uuid(),
  challenge_id    uuid not null references challenges(id) on delete cascade,
  profile_id      uuid not null references profiles(id) on delete cascade,
  status          text not null default 'joined'
                  check (status in ('joined','completed','withdrew')),
  completed_at    timestamptz,
  unique(challenge_id, profile_id)
);

accountability_pairs (
  id              uuid primary key default gen_random_uuid(),
  profile_a       uuid not null references profiles(id),
  profile_b       uuid not null references profiles(id),
  pillar_focus    text,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  check (profile_a < profile_b)                   -- canonical order
);

pair_messages (
  id              uuid primary key default gen_random_uuid(),
  pair_id         uuid not null references accountability_pairs(id) on delete cascade,
  profile_id      uuid not null references profiles(id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now()
);

insignia (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  kind            text not null,                   -- 'founding_knight', 'crucible_2026q3', etc.
  awarded_at      timestamptz not null default now(),
  awarded_by      uuid references profiles(id),    -- admin who issued (if applicable)
  unique(profile_id, kind)
);
```

### 4.5 Live + events

```sql
live_sessions (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  starts_at       timestamptz not null,
  duration_minutes int not null,
  host_id         uuid references profiles(id),
  stream_url      text,
  replay_id       uuid references content(id),
  required_tier   text not null default 'knight',
  capacity        int,
  created_at      timestamptz not null default now()
);

live_rsvps (
  session_id      uuid not null references live_sessions(id) on delete cascade,
  profile_id      uuid not null references profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),
  primary key (session_id, profile_id)
);
```

### 4.6 Moderation + audit

```sql
moderation_actions (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid references profiles(id),   -- moderator
  subject_id      uuid references profiles(id),   -- offending member
  target_table    text not null,
  target_id       uuid not null,
  action          text not null check (action in ('warn','hide','suspend','ban','restore')),
  reason          text,
  created_at      timestamptz not null default now()
);

audit_log (
  id              bigserial primary key,
  actor_id        uuid references profiles(id),
  action          text not null,
  meta            jsonb,
  created_at      timestamptz not null default now()
);

notifications (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  kind            text not null,
  payload         jsonb not null,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

push_tokens (
  profile_id      uuid not null references profiles(id) on delete cascade,
  expo_token      text not null,
  platform        text check (platform in ('ios','android','web')),
  updated_at      timestamptz not null default now(),
  primary key (profile_id, expo_token)
);
```

### RLS posture
- All tables: RLS **on**.
- `select` policies: members can read what their tier entitles + their own private rows.
- `insert/update` policies: members can write their own rows; experts/moderators/admins via role check.
- Edge functions act as `service_role` for webhook handlers and admin operations.

> **DECISION:** Single-tenant. No `organization_id`. We borrow BizCom's RLS discipline but not its tenant column.

---

## 5. Auth strategy

- **Email magic link** (Supabase Auth) — primary, simplest, no password storage.
- **Apple Sign-In** — required on iOS because we offer Google Sign-In (Apple 4.8). Implemented via `expo-apple-authentication`.
- **Google Sign-In** — via `@react-native-google-signin/google-signin`.
- **Session management** — Supabase JS handles refresh tokens. Native uses SecureStore; web uses cookies (httpOnly via Supabase SSR helpers).
- **Logout from every device** — settings affordance, calls `supabase.auth.signOut({ scope: 'global' })`.

> **DECISION:** Email magic link is the default; Apple Sign-In is required to ship iOS; Google Sign-In is optional. Don't offer Facebook (low signal-to-noise, brand-misaligned).

---

## 6. Push notifications

- **Expo Push** abstracts APNs + FCM.
- One daily push budget per user (founder-authored "Morning Standard" or live-event reminder).
- Per-user opt-in for: challenge updates, accountability-pair pings, live reminders.
- Quiet hours per user (default 10pm–6am local).

> **DECISION:** Pushes are server-scheduled via a `notification_jobs` table + cron worker, not blasted from client. Audit log on every push.

---

## 7. Realtime layer

- **Feed updates** — Supabase Realtime channel on `comments` + `member_post` content rows. Subscribed only when feed visible.
- **Live session presence** — Realtime presence channel per session.
- **Chat (v1.1)** — Realtime + a `messages` table; deferred per intake.

---

## 8. Offline behavior

- **Reads cached** via TanStack Query persistent storage (AsyncStorage on native, IndexedDB on web).
- **Writes** (check-ins, comments) queued via a `pending_mutations` store; retried on reconnect.
- **Media** (video/audio) — no offline download in v1. v1.1 if Council members request it.

---

## 9. Observability + analytics

- **Sentry** — JS + native crash reporting, source maps uploaded via EAS hook.
- **PostHog** — event taxonomy:
  - `auth.signup`, `auth.signin`
  - `paywall.viewed`, `paywall.purchased` (with tier + platform)
  - `feed.post.created`, `feed.comment.created`
  - `checkin.created`
  - `standards.review.submitted`
  - `challenge.joined`, `challenge.completed`
  - `live.rsvp`, `live.attended`
  - `notification.received`, `notification.opened`
- **Funnels:** application → signup → paywall → trial → first check-in (D1 / D7 / D28 retention).

---

## 10. CI/CD

- **GitHub Actions:**
  - On PR: typecheck, lint, vitest unit tests, Detox smoke (if added v1.1).
  - On merge to `main`: EAS Build (preview profile) → internal channel.
  - On tag `v*.*.*`: EAS Build production → EAS Submit → Vercel deploy.
- **Branch model:** `main` is production, `develop` not used (solo dev, low ceremony).
- **Secrets:** GH Actions secrets + EAS secrets + Vercel envs. Never `.env` in repo.

---

## 11. Environments

| Env | Web | Mobile build | Supabase project | RevenueCat env | Stripe |
|---|---|---|---|---|---|
| **dev** | localhost | Expo Go (limited) / EAS development | `roundtable-dev` | sandbox | test mode |
| **preview** | vercel preview | EAS preview profile | `roundtable-preview` | sandbox | test mode |
| **prod** | roundtable.app *(tbd domain)* | EAS production | `roundtable-prod` | production | live |

> **DECISION:** Domain TBD by founder. Default suggestion: `roundtable.app` if available, else `theroundtable.club`.

---

## 12. AI features (server-side only)

Claude API is used for:
1. **Auto-tagging** member posts to pillar / subsection on submit.
2. **Honor code triage** — flagging posts that may violate honor code; never auto-deletes; routes to mod queue.
3. **Daily Standard prompt assistance** — John drafts, Claude tightens to ≤90-second read.
4. **Content summarization** for long-form articles (TL;DR generation).

**Never** uses Claude to:
- Impersonate any named knight.
- Reply in any expert's voice.
- Generate "member" posts.

> **DECISION:** All Claude calls proxied through a Supabase Edge Function with prompt logging to `audit_log`. Per-user rate limits.

---

## 13. Security checklist

- [ ] Supabase RLS on every table.
- [ ] No client-supplied `tier` ever trusted; entitlement read server-side.
- [ ] Mux signed playback URLs (token expiry 15 min).
- [ ] Push tokens scoped per device, revocable.
- [ ] Account deletion: cascades through application data; soft-delete for 30 days then hard purge (`pg_cron` job).
- [ ] PII minimization: only display name + handle + region in directory; no email/phone exposed.
- [ ] Mod queue requires reauthentication every 24h.

---

## 14. Open architecture decisions deferred to scaffold

- **Tamagui vs. react-native-reusables** — pick during scaffold based on which has cleaner shadcn parity in latest version.
- **Mux vs. Cloudflare Stream** — default Mux (better captions, simpler signing); revisit if pricing matters at scale.
- **Drizzle migrations location** — `server/db/migrations` (Drizzle Kit) — Supabase SQL migrations also live in `supabase/migrations` for RLS policies. Two-source split documented in README.

---

## 15. Final decision block

- Expo Router + RNW + EAS — locked.
- Supabase Postgres + Auth + Storage + Realtime — locked.
- RevenueCat for entitlements — locked.
- Stripe (web) + Apple IAP + Google Play Billing — locked.
- Drizzle ORM — locked.
- NativeWind — locked.
- Sentry + PostHog — locked.
- Single-tenant data model — locked.
- DMs deferred to v1.1 — confirmed.
