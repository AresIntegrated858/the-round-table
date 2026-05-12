# Decisions Log — The Round Table

> Running log of every non-trivial architectural / product decision, with the alternative considered and why rejected. Append-only.

---

## 2026-05-12 — Initial planning round

### D-001 · Cross-platform stack = Expo Router + React Native Web
- **Alternatives considered:** Next.js + Capacitor wrapper; fully native (Swift + Kotlin + Next.js); Flutter.
- **Chosen:** Expo Router + RNW + EAS.
- **Why:** One codebase ships three apps. Apple Sign-In, Google Sign-In, RevenueCat, Supabase all have first-class Expo modules. RNW maps to Next.js mental model John already uses on BizCom. Capacitor risks 4.2.2 webview-feel rejection. Native triples cost. Flutter diverges from John's existing JS/TS stack.

### D-002 · Backend = Supabase
- **Alternatives considered:** Firebase; custom Node + Postgres.
- **Chosen:** Supabase.
- **Why:** Matches Contract Command stack. Postgres + RLS + Auth + Storage + Realtime + Edge Functions in one. Firebase locks to Google's auth/data model and is less SQL-native. Custom is wrong scope for one-developer launch.

### D-003 · ORM = Drizzle, not Prisma
- **Alternatives considered:** Prisma (used in Contract Command).
- **Chosen:** Drizzle.
- **Why:** Drizzle is leaner on edge runtimes, smaller bundle, postgres-first. Round Table doesn't need Prisma Studio. Two-source migration split (`server/db/migrations` for Drizzle Kit, `supabase/migrations` for RLS policies) is acceptable and documented.

### D-004 · Pillars count = 7, not 8
- **Source of truth:** PDF p.3.
- **Why:** Brain wiki listed 8 by counting "Brotherhood / high-ROI relationships" as a pillar — but it's the connective tissue of the whole platform, not a discrete content/community wing.

### D-005 · Founding experts = 5 (John, Manny, Chase, Erik, Sean)
- **Source of truth:** PDF p.6.
- **Why:** Brain wiki omitted Sean Love. PDF wins. No invented experts in v1.

### D-006 · Information architecture = 1 primary feed + 5 subsection feeds + Library
- **Source of truth:** PDF p.12–18.
- **Why:** Subsections are: Fitness (John+Chase), Relations (Manny+Erik), Style (Manny+John), Investments (Manny+Sean), Entrepreneurship (John+Erik). Time Management and Leadership are pillars but not subsections — they live as Library content categories per PDF.

### D-007 · No Skool dependency
- **Alternatives considered:** Launch on Skool first per PDF p.6 + p.38, migrate at 4K members.
- **Chosen:** Skip Skool entirely; native app from day one.
- **Why:** App Store revenue, brand control, product velocity. The PDF's 2–3 year migration plan is compressed into the launch product.

### D-008 · No DMs in v1
- **Source:** User intake answer 6.
- **Why:** Ships brotherhood loop without the moderation surface area of free-form private messaging. Accountability pairs use a scoped thread, not free DMs. Open DMs in v1.1.

### D-009 · Tier pricing = $20 / $30 / $50, IAP +25%
- **Source:** User intake answer 3.
- **Why:** Honors PDF's $20 baseline. Web prices net at user's chosen number; iOS/Android prices bumped to $24.99 / $34.99 / $54.99 to absorb Apple/Google take. Paywall copy explains: "Web is cheaper because Apple and Google charge a tax. We pass none of it to you on web."

### D-010 · Annual = 17% discount, no trial
- **Why:** Standard SaaS annual incentive (~2 months free). Trials drive monthly conversion, not annual. Keeps annual signal honest.

### D-011 · 7-day trial on monthly only
- **Why:** Apple/Google support intro offers cleanly. 7 days is enough to feel one Daily Standard cycle + one Knight Challenge prompt.

### D-012 · Founding Knights cohort = 50 seats, Knight tier, $20/mo rate-lock for 12 months
- **Why:** Honors PDF p.23's beta-discount promise. Replaces the 50-free-Skool-betas with 50 paid founding members at the PDF's stated floor. Creates a permanent forensic record (insignia, cohort) of who was in the room first.

### D-013 · Council differentiator = access, not content
- **Why:** Content is replicable. Founder access isn't. Defensibility lives at the top tier through monthly Council Roundtable + AMA priority + direct expert reach.

### D-014 · No free tier inside the app
- **Why:** Free surface is acquisition-only: marketing site + (post-signup, pre-pay) sampler showing today's Daily Standard + 1 article + welcome message. Everything else is paywalled.

### D-015 · Single-tenant data model
- **Why:** Unlike BizCom (multi-tenant SaaS for separate orgs), Round Table is one community. No `organization_id` column. RLS still on. We borrow BizCom's discipline but not its tenancy.

### D-016 · RevenueCat is entitlement system of record
- **Why:** Cross-platform subs need unification. Subscribed on iOS but want to log in on web? RevenueCat carries the entitlement. Supabase `entitlements` table mirrors RC via webhook for fast in-app reads. Never trust the client.

### D-017 · Daily push budget = 1 per user per day
- **Why:** Push fatigue is the #1 way community apps lose retention. One Daily Standard *or* one live-event reminder, never both. Server-scheduled, audit-logged.

### D-018 · Mux for video, signed URLs
- **Alternatives considered:** Cloudflare Stream; direct Supabase Storage MP4s.
- **Chosen:** Mux.
- **Why:** Signed playback URLs prevent rip-and-share. Native HLS captions support. Supabase Storage MP4s are public-by-default and lack adaptive bitrate.

### D-019 · AI = Claude Sonnet 4.6 via server proxy, never impersonates experts
- **Alternatives considered:** OpenAI; on-device.
- **Chosen:** Anthropic Claude via Supabase Edge Function.
- **Why:** Same vendor as Contract Command (John's mental model). Use cases: post auto-tagging, honor-code triage, Daily Standard drafting assist, article TL;DR. Never replies as a named knight. Every call audit-logged.

### D-020 · Account deletion ships in M0
- **Why:** Apple 5.1.1(v) requirement. Cascading soft-delete with 30-day grace + `pg_cron` hard-purge job. Settings → Account → "Delete my account." Web fallback URL listed in Play Console.

### D-021 · ATT not requested in v1
- **Why:** No third-party SDKs track across other companies' apps. PostHog is configured to not use IDFA. If we add an SDK that triggers it later, ATT prompt happens at first session start with a clear rationale string.

### D-022 · Listing copy is "private brotherhood" not "men-only"
- **Why:** Apple 5.6 + Play discrimination policy. Access mechanics (men-focused) happen inside the app via application + paid tier, not in the store listing.

### D-023 · Rank ladder is separate from billing tier
- **Why:** Members can be a paying Knight subscriber at *Squire* rank if they haven't earned higher. This decouples money from honor. Rank insignia cannot be bought.

### D-024 · iPhone-only on iPad (no iPad-optimized UI v1)
- **Why:** iPad optimization requires distinct screenshots + design pass. Scope creep. Ships as iPhone-scaled. v1.2 if Council members ask.

### D-025 · NativeWind v4 (Tailwind for RN)
- **Alternatives considered:** Tamagui; StyleSheet; restyle.
- **Chosen:** NativeWind.
- **Why:** John already uses Tailwind on BizCom. Lowest mental-model cost. Tamagui is faster at runtime but its DX is heavier; we'll revisit if performance demands.

### D-026 · No referral cash payouts (credit only)
- **Why:** Honor code violation risk; affiliate behavior corrupts the table's culture. One earned free month per referral that converts past trial. Cap 3/year.

### D-027 · Disclaimers codified in CMS
- **Why:** Apple 1.4.1 + Play health-misinfo. Every fitness/finance/relationship long-form auto-renders "Educational content. Not medical, financial, or legal advice." Disclaimer component, not hand-typed.

### D-028 · No lifetime deals
- **Why:** Lifetime LTV uncertainty + Apple/Google handle subs cleanly; lifetime needs custom non-renewing setup. Subscriptions only.

### D-029 · 12 founding testers seeded for Play closed-testing window
- **Why:** Google Play production rollout requires ≥12 testers active for ≥14 days on closed track. Plan for this at M4 start, not M5.

### D-030 · Domain default = `roundtable.app` (founder confirms)
- **Why:** Short, brandable, .app TLD enforces HTTPS. Backup: `theroundtable.club`.

---

## 2026-05-12 — Founder approval + scaffold prep

### D-031 · Chase Grafton OUT of v1 founding circle (founder decision)
- **Source:** founder, 2026-05-12.
- **Effect:** Founding circle = 4 men (John, Manny, Erik, Sean). Fitness subsection reassigned to **John solo**; Erik remains a Fitness contributor per his PDF p.6 domain stake but is not co-lead.
- **Why:** Founder's call. No public reasoning recorded.
- **Implication:** Chase's name does not appear in v1 marketing site, app surfaces, or listings. PDF source page retained for the discovery record only.

### D-032 · Signup ritual = 4 mandatory steps (brief → code → standards → paywall)
- **Source:** founder, 2026-05-12.
- **Why:** Founder explicit: "New user sign ups should see a sign up UI explaining our code of ethic and what we do. Then ask them to agree."
- **How:** Sequenced onboarding routes under `(onboarding)/`. Route guards enforce ordering. `profiles.honor_code_signed_at` is the canonical gate.
- **UI rule:** "I agree" button is disabled until scroll-to-bottom on the code screen. ScrollGate component handles this.
- **Refusal path:** no charge taken, account row created with `honor_code_signed_at = NULL`. Re-engagement allowed if they come back.

### D-033 · iPad explicitly not supported in v1
- **Source:** founder, 2026-05-12.
- **Why:** Scope discipline. iPhone-only device family in `app.json` + Apple device family setting. No iPad screenshots, no iPad UI pass.
- **Revisit:** v1.2 if Council members ask.

### D-034 · npm, not pnpm, for v1 package management
- **Alternatives considered:** pnpm (originally specified in brief), Yarn.
- **Chosen:** npm.
- **Why:** Machine has Node 24 + npm 11 at `/usr/local/bin/` but pnpm requires sudo to symlink into the same dir via corepack. npm is sufficient for a single-app project. Revisit if/when we monorepo (Turborepo + pnpm makes sense then).

### D-035 · Apple Developer + Google Play accounts = fresh enrollment
- **Source:** founder, 2026-05-12.
- **Effect:** Both enrollment processes start at M0, not M5. Apple individual enrollment is ~24h typical; org enrollment with D-U-N-S verification can take 1–2 weeks. Google Play is <24h, $25 one-time.
- **Risk:** If org Apple enrollment chosen, this is the longest-pole item to M5. Recommend **individual** Apple enrollment to avoid D-U-N-S delay; convert to org later if needed.

---

## How to add entries

```
### D-XXX · One-line decision
- **Alternatives considered:** ...
- **Chosen:** ...
- **Why:** ...
```

Date-stamp every new section header. Never mutate prior entries; append a new entry that supersedes if a decision changes.
