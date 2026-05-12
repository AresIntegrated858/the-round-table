# Monetization — The Round Table

> Anchored to user intake (3 tiers, $20 / $30 / $50). Web pays via Stripe; iOS via Apple IAP; Android via Google Play Billing. Entitlements unified via RevenueCat.

---

## 1. Tier structure

User-confirmed pricing. Names and gates proposed for approval.

| | **New Member** | **Knight** | **Council** |
|---|---|---|---|
| **Monthly (web/Stripe)** | $20 | $30 | $50 |
| **Annual (web/Stripe)** | $200 (≈$16.67/mo, save ~17%) | $300 (≈$25/mo) | $500 (≈$41.67/mo) |
| **Monthly (iOS/Android IAP — price-parity)** | $24.99 | $34.99 | $54.99 |
| **Annual (iOS/Android IAP)** | $239.99 | $339.99 | $549.99 |

### Why IAP prices are higher
Apple takes 30% (15% after year 1 of an auto-renewing sub; or under Small Business Program for revenue <$1M). Google is similar. We bump store prices to **roughly preserve net revenue** without forcing customers to feel a 30% gap. Founder voice on the paywall: "Web price is lower because Apple and Google charge a tax. We pass none of it to you on web."

> **DECISION:** Price-parity strategy = higher sticker on mobile, lower on web, with explicit copy on the paywall. Always cheapest on web. Never advertise web pricing *inside* iOS/Android apps (Apple 3.1.3 anti-steering — keep this kosher).

---

## 2. Tier feature matrix

The product surface follows the rule: **everyone gets the table; only depth/access scales with tier.**

| Surface | New Member ($20) | Knight ($30) | Council ($50) |
|---|---|---|---|
| **Primary feed** | Read + post | Read + post | Read + post |
| **5 subsection feeds** | Read all; post in 2 | Read all; post in all 5 | Read all; post in all 5 |
| **Library — articles** | Full | Full | Full |
| **Library — courses** | Brotherhood Leadership (1 course) | All courses (currently 1; expanding) | All courses |
| **Library — videos/audio** | Standard catalog | Full catalog incl. archive | Full catalog + early-release |
| **Daily Standard prompt** | ✓ | ✓ | ✓ |
| **Weekly Standards Review** | ✓ | ✓ | ✓ |
| **Knight Challenges** | View; join 1 active | Join unlimited | Join unlimited + early access |
| **Rank ladder participation** | Squire → Knight cap | Full ladder | Full ladder |
| **Accountability pair** | ✓ | ✓ | ✓ |
| **Live sessions** | Replay 7-day window | Full replay archive | Live + replay + Q&A submission priority |
| **Founder live group call** | ✗ | Quarterly | Monthly |
| **Council-only roundtable** | ✗ | ✗ | Monthly live + private feed |
| **Direct expert AMA submission** | ✗ | 1/mo | Unlimited |
| **Profile badges** | New Member | Knight | Council (gold) |
| **Member directory access** | Top 50 by rank | Full directory | Full + filter by region/pillar |
| **Founding Knight rate-lock** | n/a | Available to first 50 buyers | n/a |
| **Concierge support** | Email, 48h | Email, 24h | DM-to-John channel (v1.1) |

> **DECISION:** Library breadth is identical from Knight up. The Council premium is **access to people**, not content. This is structurally what makes Council defensible against churn — content can be ripped; relationships cannot.

---

## 3. Free / non-member surface

Per App Store guidelines we need a non-zero entry surface, and per growth we need an SEO-discoverable landing.

- **Marketing site (web only, no auth)**
  - Landing page using PDF p.5 research stats as the proof block.
  - The 7 pillars page.
  - The 5 founding knights bio pages (PDF-sourced copy only).
  - Public articles — a handful of John-authored long-form posts indexed for SEO.
  - Apply / Join page → paywall.
- **In-app for logged-out users**
  - Marketing splash + "Sign in / Apply" CTA. Nothing more.
- **In-app for signed-in but unsubscribed users**
  - Profile setup.
  - A read-only sampler: today's Daily Standard, 1 sample article, the welcome message from John.
  - Paywall on every other surface.

> **DECISION:** No free tier *inside* the table. Free surface is acquisition-only (web marketing site + sampler in the auth'd-but-unsubscribed state).

---

## 4. Trial strategy

Apple and Google both support introductory offers. Per Apple guideline 3.1.2(a) the trial must be presented clearly and the auto-renew must be disclosed.

- **7-day free trial** offered at any tier, one per Apple/Google account, no credit card friction (Apple/Google handle it).
- **Trial conversion target:** ≥40%. Below 30%, we re-examine the onboarding flow before re-pricing.
- **No trial on annual plans.** Annual is for committed buyers; trials drive monthly conversion only.

> **DECISION:** 7-day trial at all three tiers, monthly only. Annual is full-price from day one but with the ~17% built-in discount.

---

## 5. Founding Knights cohort (honors the PDF beta promise)

PDF p.23 promised beta participants $10/mo lifetime discount. We're replacing the beta giveaway (because we're not betaing on Skool) with a **paid founding cohort**:

- **First 50 paying members on Knight tier** lock in **$20/mo for 12 months** (matching the PDF's $20 floor).
- After 12 months, auto-converts to standard $30/mo.
- Visible badge: "Founding Knight, Class of 2026" — permanent profile insignia, never reissued.
- Marketed as cohort scarcity: "50 seats. Once gone, the standard rate returns."

> **DECISION:** Founding cohort is a Knight-tier-only offer. New Member and Council launch at standard pricing. The cohort serves two purposes: (1) honors the PDF's beta-discount promise, (2) creates a forensic record of who was in the room first.

---

## 6. Web vs. mobile entitlement architecture

This is where RevenueCat earns its fee.

```
                  ┌──────────────────────┐
                  │   RevenueCat         │  Source of truth for entitlements
                  │   (entitlements API) │
                  └──────────┬───────────┘
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐    ┌───────────────┐
│ Stripe (web)  │   │ Apple IAP     │    │ Google Play   │
│ subscriptions │   │ subscriptions │    │ Billing       │
└───────┬───────┘   └───────┬───────┘    └───────┬───────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            ▼
                  ┌──────────────────────┐
                  │  Supabase            │
                  │  users + entitlements│  Mirrored from RevenueCat webhooks
                  └──────────────────────┘
```

- One **RevenueCat user** per Round Table account.
- Server-side entitlement check on every gated route (Supabase RLS + a `tier` column on profiles, refreshed from RevenueCat webhook).
- A member subscribed on iOS can log in on web with no double-pay (entitlement carries via the unified RevenueCat user).
- A member who subscribes on **web first**, then opens iOS, sees: "You're already subscribed (managed on web)." No paywall on iOS.

> **DECISION:** RevenueCat is the entitlement system of record. Supabase mirrors entitlements on webhook for fast in-app reads. Never trust the client.

---

## 7. Promotional levers (post-launch)

| Lever | When | Constraint |
|---|---|---|
| **Annual upgrade prompt** | After day 14 on monthly | One prompt per user per quarter |
| **Tier upgrade prompt** | When a member maxes out tier-locked feature (e.g., posting in only 2 subsections) | Contextual, in-line |
| **Win-back** | Cancellation flow + email at days 7/30 post-cancel | Apple allows win-back offers via App Store Connect |
| **Referrals** | Member-to-member referrals | One earned free month per referral that converts past trial (cap 3/year per member) |
| **Founding Knight scarcity** | Permanent ticker on /apply until 50 sold | Single use |

> **DECISION:** Referrals are credit-only (free month). No cash payouts — keeps the table free of affiliate-style behavior the honor code would flag.

---

## 8. Churn risk per tier

| Tier | Top churn driver | Mitigation |
|---|---|---|
| **New Member** | Onboarding bounce (felt the table, didn't post in week 1) | Mandatory standards declaration + accountability pair within 72h of payment |
| **Knight** | Content fatigue (Library plateaus) | Weekly live + monthly Challenge + quarterly Crucible — rolling cadence |
| **Council** | Felt non-special (didn't see the founding knights enough) | Council monthly call is on John's calendar as a hard recurring commitment, not an aspiration |

---

## 9. What we will NOT do

- **No discounts shown to logged-in mobile users for the web price.** Apple anti-steering.
- **No lifetime deals.** Subscriptions only.
- **No "free forever" tier.** The product is a paid room. Free is acquisition surface only.
- **No coupon code injection from outside the app for mobile.** App Store Connect "Offer Codes" only on iOS.
- **No price changes for existing subscribers without 30-day grandfather notice.** Apple/Google both require notice; we'll honor 60 days regardless.

---

## 10. Defensibility check

A pricing reviewer would ask:

1. *Why $20 / $30 / $50 and not $10 / $25 / $99?* — Because $20 was the PDF's stated floor, $50 is the psychological "club dues" ceiling for a non-mastermind, and $30 anchors the middle without compressing.
2. *Why not pay-per-pillar / a la carte?* — Defeats the brotherhood premise. The table is one room.
3. *Why no business / B2B tier?* — v1 is consumer-only. Group memberships (e.g., "sponsor 5 men from my company") is v2 if demand surfaces.
4. *Why three tiers, not two?* — Two compresses the New Member to an awkward middle. Three gives a real on-ramp + a real top.
5. *Why is content not the Council differentiator?* — Content is replicable. Founder access isn't. Defensibility lives at the top.

> **OVERALL DECISION:** Tier structure approved-pending-founder-review. Build paywall against this matrix. RevenueCat configured first.
