# Build Plan — The Round Table (v1)

> Milestones M0 → M5. No time estimates per founder rule. Each milestone has a binary "done" gate. Dependencies named.

---

## Critical-path scope for first submission

The smallest coherent product that ships to App Store + Play Store + Web with the brotherhood loop intact:

1. Auth (email magic link + Apple Sign-In + Google Sign-In)
2. Application + paywall + RevenueCat entitlement gate
3. Profile + standards + honor code
4. Primary feed + 5 subsection feeds (read + post)
5. Library (courses, articles, audio) with tier-gated content
6. Daily Standard prompt
7. Weekly Knight Challenges (join + complete)
8. Accountability pair (matched, scoped thread)
9. Push notifications (1/day budget)
10. Member directory + profile pages
11. Mod queue + report/block + honor code enforcement
12. Account deletion (in-app + web fallback)
13. Settings (subscription management, notifications, account)
14. Analytics (PostHog) + crash reporting (Sentry)
15. Marketing site (landing, pillars, knight bios, apply, legal)

---

## Explicit out-of-scope for v1

- **DMs / chat** (v1.1)
- **Live video streaming** (v1.1 — live sessions ship as RSVP + replay-via-Mux only)
- **Networking events / IRL meetups** (v1.1)
- **One-on-one expert consultation booking** (v1.1)
- **Offline video download** (v1.2 if Council demands)
- **iPad / tablet optimized UI** (v1.2 — ships as iPhone-scaled on iPad if at all)
- **Affiliate / referral cash payouts** (never — credit only)
- **Group / corporate memberships** (v2)
- **Multi-language** (v2)
- **Skool import / migration tools** (n/a — we never used Skool)

---

## M0 — Foundation & Spine

**Goal:** the app launches, a user can sign up, pay, see a gated feed, and the entitlement gate is real.

### Tasks (ordered)
1. Scaffold Expo project at `~/Downloads/the-round-table/` with TypeScript strict, Expo Router, NativeWind, EAS.
2. Configure `app.json` + `eas.json` for iOS + Android + web; **iPhone-only device family** (no iPad target).
3. Wire Sentry (RN + RNW).
4. Initialize Supabase project `roundtable-dev`. SQL migrations for: `profiles`, `profile_standards`, `entitlements`, `audit_log`, `push_tokens`.
5. Implement design tokens (colors, type, spacing) per palette draft (charcoal / brass / ivory / crimson).
6. Implement core UI primitives: `Button`, `Card`, `Insignia`, `Heading`, `Body`, `Input`, `Modal`, `ScrollGate` (used by honor code).
7. Auth: email magic link, Apple Sign-In (`expo-apple-authentication`), Google Sign-In; profile-row insertion on first sign-in.
8. **Signup ritual (4 steps, mandatory, ordered)** — implemented as `(onboarding)/brief` → `(onboarding)/code` → `(onboarding)/standards` → `(onboarding)/paywall`:
   - **Step 1 — The brief:** ivory-on-charcoal welcome screen, founder voice; CTA Continue.
   - **Step 2 — The code:** full honor code rendered; scroll-to-end gate enables "I agree" button; stamp `honor_code_signed_at` on agree; refusal exits to goodbye screen, no charge.
   - **Step 3 — The standards:** 3–5 declarations across the 7 pillars, ≤140 chars each, saved to `profile_standards`.
   - **Step 4 — The paywall:** tier select + IAP/Stripe + restore + legal links + 7-day trial offer on monthly.
9. Route guards enforce signup-ritual sequencing — user cannot reach step N without N-1 completed.
10. RevenueCat setup: products configured in App Store Connect + Play Console + Stripe; SDK initialized in app; webhook → Supabase edge function → `entitlements` table mirror.
11. Paywall screen rendering 3 tiers with correct platform pricing; restore purchases; legal links.
12. Server-side entitlement helpers; route gate that redirects unentitled users to paywall.
13. Empty primary feed shell (renders, no posts yet).
14. Settings → Subscription (manage / cancel deep-link); Account (delete account flow + soft-delete cascade).
15. Push token registration (Expo Push); permission rationale string.
16. Marketing site skeleton on Vercel (landing + apply + legal placeholder pages).
17. GitHub Actions: typecheck + lint + unit on PR; EAS preview build on `main`.
18. Sentry + PostHog event taxonomy stubbed.

### Done gate
- `npm run web`, `npm run ios`, `npm run android` all run locally.
- A test user can: sign up → read brief → scroll honor code → agree → declare 3 standards → see paywall → buy New Member tier in sandbox → land in the (empty) feed.
- Refusing the honor code exits cleanly without charge.
- Account deletion runs cleanly on iOS sandbox and on the web fallback URL.
- `decisions.md` updated with every non-trivial decision made during M0.

**Stop here. Check in with founder before M1.**

---

## M1 — Content backbone

**Goal:** the table has something to read. Long-form content + library work end-to-end.

### Tasks
1. SQL migrations for `content`, `content_engagements`, `comments`.
2. Drizzle schema mirroring Supabase tables.
3. Library tab: list courses, articles, audio; tier-gated visibility.
4. Course renderer: lesson list + lesson body (markdown + media).
5. Article renderer: long-form markdown, hero image, author byline tied to founding-knight profile.
6. Audio player (`expo-av`) for John's audio drops.
7. Video playback via Mux signed URLs (player + posters).
8. Brotherhood Leadership course imported (John provides content; or transcribed from his materials).
9. **Educational disclaimer** banner component on all fitness/finance/relationship long-form.
10. Comments thread component on every content row (with report + delete-own).
11. Author tooling: founder can create + publish content via an admin web view (`/(admin)/...` route, role-gated).
12. Founding-knight profile pages with PDF-sourced bios.

### Done gate
- John has authored at least 5 articles + uploaded the Brotherhood Leadership course before next milestone.
- A subscribed member can read, watch, listen, and comment.

---

## M2 — Feed + brotherhood mechanics

**Goal:** the loop is live. Members post, comment, check in, run a challenge, see their rank.

### Tasks
1. SQL migrations for `check_ins`, `standards_reviews`, `challenges`, `challenge_participations`, `accountability_pairs`, `pair_messages`, `insignia`.
2. Primary feed: chronological + tier-aware filter.
3. 5 subsection feeds (Fitness, Relations, Style, Investments, Entrepreneurship).
4. Post composer with auto-tagging (Claude proxy edge function): pillar + subsection suggestion.
5. Check-in composer (structured: pillar, outcome, body).
6. Weekly Standards Review tool (1–10 rating across 7 pillars + notes, weekly cadence with reminder).
7. Challenge surface: list active challenges, join, mark complete, leaderboard.
8. Accountability pair matching job: at signup, queue user; once enough queue, batch-match by pillar overlap + region; create pair + private thread.
9. Rank ladder logic: point accrual + monthly promotion event; insignia auto-issue on Founding Knight cohort cap.
10. Insignia rendering in profile + comment bylines.
11. Member directory: searchable, filter by pillar, paginated.
12. Daily Standard prompt: scheduled content row + push notification at user's preferred time (default 6am local).

### Done gate
- John runs a 5-person dogfood week. Five real members can post check-ins, get matched into pairs, join a challenge, and complete it. Daily Standard fires once a day for each.

---

## M3 — Moderation, abuse, account hygiene

**Goal:** the app survives a stranger. Honor code is enforced, not theoretical.

### Tasks
1. In-app report flow on every UGC surface (post, comment, profile, check-in).
2. Mod queue web view (`/(admin)/moderation`) with: pending reports, AI-flagged items, action buttons (warn/hide/suspend/ban/restore).
3. Honor-code violation triage edge function (Claude proxy): scans new posts on insert, flags candidates, never auto-deletes.
4. Block user: hides their content from blocker's feed.
5. Suspension: temporary read-only flag on profile; ban: full removal with content soft-delete.
6. Audit log entries on every moderation action.
7. Email notifications to suspended/banned users (Resend), explaining and citing honor code.
8. Account deletion hardening: cascading soft-delete with 30-day grace; `pg_cron` purge job; user receives confirmation email.
9. Test-account flow for App Store reviewer (handle: `@reviewer`, fixed creds, persistent test data).

### Done gate
- A staged abuse scenario (test account posts a violating comment) flows: AI flag → mod queue → action → audit log → notification.
- App Store reviewer can be onboarded with one test account into a populated feed.

---

## M4 — Live, polish, listing assets

**Goal:** the app feels finished. Listing assets are produced. Beta testers exercise it.

### Tasks
1. Live session surface: list upcoming, RSVP, calendar invite via `.ics`, push reminder.
2. Live replay player: Mux signed URLs, tier-gated.
3. Council monthly call surface (Council-only feed + RSVP).
4. AMA submission form (Knight: 1/month; Council: unlimited).
5. Notifications inbox: chronological list of in-app notifications + read state.
6. Notification preferences screen (per-kind toggles + quiet hours).
7. Onboarding polish: cohort assignment ("Founding Knight, Class of 2026") + welcome video from John.
8. Marketing site: full content (landing copy with PDF stats, 7 pillars, 5 knight bios, apply, legal).
9. Listing assets:
   - App icon (1024 + 512) — design pass.
   - Screenshots: 6.7" + 6.5" iPhone, Android phone.
   - Feature graphic for Play.
   - App Store + Play descriptions finalized.
   - Privacy nutrition label + Data Safety form completed in respective consoles.
10. TestFlight external test group seeded (≥12 testers, ≥14 day window for Play closed testing).
11. Sentry release health gate: ≥99.5% crash-free sessions across 7 days.
12. Performance pass: cold start <3s on mid-tier Android; JS bundle <2MB gzipped on web; image lazy-load.

### Done gate
- All 12 items in `app-store-readiness.md` §8 submission gate pass.
- 12+ external testers active for 14 days (Play requirement).
- John signs off on listing assets.

---

## M5 — Submission

**Goal:** the app is in front of reviewers.

### Tasks
1. Production EAS Build for iOS + Android.
2. Vercel production deploy of marketing + web app.
3. App Store Connect: upload binary, fill metadata, attach screenshots, set pricing (Apple IAP price tiers per `monetization.md`), submit for review.
4. Play Console: upload AAB, fill metadata, complete Data Safety form, target Production track (staged rollout 5%), submit for review.
5. Founders cohort launch sequence: email Founding Knight applicants with sign-up link the moment the apps are live.

### Done gate
- App in "Waiting for Review" or "In Review" on both stores.
- Web app live at production domain.
- First 5 Founding Knights have an active subscription on web (we can ship web ahead of mobile-review approval).

---

## Post-launch v1.1 priorities

In order of impact:

1. **DMs / chat** (member-to-member, capped to mutual followers or pair partners).
2. **Live video streaming** in-app (vs. RSVP-only).
3. **One-on-one expert consult booking** (Erik for finances, Manny for crypto/stocks).
4. **Networking event scheduling** (online + in-person RSVPs).
5. **Offline content download** (videos / audio).
6. **Lifecycle email** (re-engagement, milestone, win-back).

---

## Critical dependencies (named)

| Need | Owner | Blocking? |
|---|---|---|
| Founding-knight bio + photo per the four named men (John, Manny, Erik, Sean) | John | M1 |
| Brotherhood Leadership course content (already exists) | John | M1 |
| First 5–10 authored articles | John | M1 |
| Welcome video for onboarding | John | M4 |
| App Store Connect + Play Console accounts in good standing | John | M5 |
| **Apple Developer Program enrollment ($99/yr) — FRESH ENROLL, start NOW** | John | M5 (lead time risk — start at M0) |
| **Google Play Developer account ($25 one-time) — FRESH ENROLL, start NOW** | John | M5 (lead time risk — start at M0) |
| Stripe account + bank | John | M0 |
| RevenueCat account | John | M0 |
| Domain (suggested `roundtable.app` or `theroundtable.club`) | John | M0 |
| Mux account (for video) | John | M1 |
| Resend account | John | M0 |

---

## Risk register

| Risk | Mitigation |
|---|---|
| Apple rejects on UGC moderation insufficient | Honor code + report/block/mod queue/AI triage shipped in M3 before submission. |
| Apple rejects on "men-only" exclusionary framing | Listing copy describes "private brotherhood for committed men"; access is by application + paid tier, not platform-level. |
| Play closed-testing 14-day window not met | Start closed test at M4 start, not M5. |
| RevenueCat misconfiguration → double-charge | Sandbox-test cross-platform purchases in M0; verify entitlement unification on test user. |
| Empty feed at launch | Founder authors ≥5 articles + ≥4 weeks of Daily Standards + 1 challenge primed before submission. |
| Tier feature-creep stretches M2 | Strict scope freeze after this brief is approved; new ideas go to v1.1 doc. |
| Founder content cadence post-launch | Define minimum content commitment (1 article/wk + Daily Standard + 1 live/month) and put it in `decisions.md`. |

---

## Status check-in cadence

At end of every milestone, post to chat:
- **Shipped:** bullet list
- **Next:** bullet list
- **Blockers needing John's input:** bullet list

Stop and wait for John's go-ahead between M0 → M1 and between M4 → M5. Otherwise proceed continuously.
