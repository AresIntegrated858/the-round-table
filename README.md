# The Round Table

> A private brotherhood for men who refuse to drift. iOS · Android · Web — one codebase.

A premium men's community app by John Maciel / Ares Athletics LLC.

---

## Stack

- **Expo SDK 54** + **Expo Router 6** + **React Native 0.81** + **React 19**
- **React Native Web** — same code ships to iOS, Android, and web
- **NativeWind v4** (Tailwind for RN)
- **Supabase** — Postgres, Auth, Storage, Realtime, Edge Functions
- **RevenueCat** — entitlement system of record across Apple IAP, Google Play Billing, and Stripe (web)
- **Mux** — signed video playback for tier-gated content
- **Sentry** + **PostHog** — crash reporting + product analytics
- **Resend** — transactional email
- **Anthropic Claude** (`claude-sonnet-4-6`) — server-side only, for auto-tagging and honor-code triage. Never impersonates an expert.

See `docs/architecture.md` for the full decision log.

---

## Repo layout

```
app/                     Expo Router routes
  (marketing)/           Logged-out splash + marketing site
  (auth)/                Sign-in flow
  (onboarding)/          Mandatory four-step signup ritual
    brief.tsx              1. The brief
    code.tsx               2. The honor code (scroll-gated)
    standards.tsx          3. Standards declaration
    paywall.tsx            4. Tier selection
  (app)/                 Authenticated, paid-tier app shell
components/              Reusable UI primitives
lib/                     Cross-cutting: env, auth store, RC, Supabase, analytics
supabase/
  migrations/            SQL migrations (run via `supabase db push`)
  functions/             Edge Functions (delete-account, RC webhook, etc.)
docs/                    Planning artifacts (PDF-anchored)
```

---

## First-time setup

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Copy environment**
   ```sh
   cp .env.example .env
   ```
   Fill in real values. Required to run end-to-end:
   - `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_RC_IOS_API_KEY`, `EXPO_PUBLIC_RC_ANDROID_API_KEY`
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` (web)

3. **Provision Supabase**
   - Create a new Supabase project.
   - Run the M0 migration:
     ```sh
     supabase link --project-ref <ref>
     supabase db push
     ```
   - Deploy the account-deletion edge function (required for Apple 5.1.1(v)):
     ```sh
     supabase functions deploy delete-account
     ```

4. **Configure RevenueCat**
   - Create three entitlements: `new_member`, `knight`, `council`.
   - Create products + offerings per the pricing matrix in `docs/monetization.md`.
   - Set the webhook to `https://<project>.supabase.co/functions/v1/rc-webhook` (added in M0.1).

---

## Dev commands

```sh
npm run web         # browser
npm run ios         # iOS simulator (requires Xcode)
npm run android     # Android emulator
npm run lint        # eslint
npx tsc --noEmit    # type-check
```

---

## The signup ritual (mandatory, ordered)

New users cannot reach the table without completing four steps, in order. State lives in `profiles`:

| Step | Surface | DB state set | Gate |
|---|---|---|---|
| 1 | `brief.tsx` | profile row created | — |
| 2 | `code.tsx` | `honor_code_signed_at` | scroll-to-bottom required |
| 3 | `standards.tsx` | `standards_declared_at` + `profile_standards` rows | min 1 standard |
| 4 | `paywall.tsx` | active RC entitlement | tier required to enter `(app)/` |

Routing enforcement lives in `app/_layout.tsx → AuthRouter`. Bypassing any step is impossible — the router reads `ritualStepFor(profile, tier)` and redirects.

---

## App Store / Play Store compliance notes

- **Apple 4.8** — Sign-in with Apple available alongside Google + email magic link.
- **Apple 5.1.1(v)** — Account deletion in `Settings → Delete account`, executes via the `delete-account` edge function.
- **Apple 3.1.3 (anti-steering)** — iOS app never advertises web pricing or external purchase paths inside the app.
- **iPad** — Not supported in v1 (`app.json: supportsTablet: false`).

Full compliance map in `docs/app-store-readiness.md`.

---

## Where things are

- **Tier prices** → `lib/tiers.ts` (mirrors `docs/monetization.md` §1)
- **Pillars** → `app/(onboarding)/standards.tsx` (mirrors `docs/product-brief.md` §3)
- **Honor code copy** → `app/(onboarding)/code.tsx` (canonical from `docs/product-brief.md` §11)
- **Auth state** → `lib/auth.ts` (Zustand store)
- **Entitlement state** → `lib/revenuecat.ts` + `entitlements` table

---

## Roadmap (M0 → M5)

See `docs/build-plan.md` for the milestone-by-milestone done-gates. **M0 ships the signup ritual + empty feed + settings + account deletion** — enough to submit to TestFlight and gather first feedback.

---

## License & ownership

© Ares Athletics LLC. All rights reserved.
Founder voice and content created by John Maciel; named knights retain rights to their own contributions per the contributor agreement.
