# App Store + Play Store Readiness — The Round Table

> Every architectural decision in `architecture.md` should serve a clean first-submission. This is the compliance checklist + listing plan.

---

## 1. Apple App Store Review Guidelines — risk hit list

Mapped to the most likely rejection vectors for this kind of app:

### 3.1 In-App Purchase (highest risk for subscription apps)

| Guideline | What it requires | Our compliance |
|---|---|---|
| **3.1.1 In-App Purchase** | Digital subscriptions on iOS MUST use Apple IAP. | Yes — all iOS purchases via Apple IAP + RevenueCat. Stripe is web-only. |
| **3.1.2 Subscriptions** | Auto-renew terms disclosed, trial clearly stated, link to Privacy + Terms on paywall, restore purchases button. | Paywall component will include: tier, price, renewal cadence, "Subscription auto-renews", "Cancel anytime in Settings", Terms + Privacy links, **Restore Purchases** button. |
| **3.1.3(a) Reader rule** | Apps providing content the user purchased elsewhere can do so (but our content is purchased *here*, so this doesn't apply). | n/a — no external content imports. |
| **3.1.3(b) Multiplatform services** | Allowed to mention other platforms exist; cannot direct users to a different purchase method *inside the iOS app*. | Anti-steering compliant: no in-app web upsell links. Marketing site references web pricing but is reached only outside the iOS app. |
| **3.1.5(a) Goods and Services Outside the App** | Physical goods + real-world experiences may use other payment. | n/a — no physical goods in v1. |
| **3.1.1(c) Paid Communities** | Apps facilitating paid communities are explicitly permitted as long as they use IAP for digital subscriptions. | We're a paid community using IAP. Clean. |

### 1.x — Safety

| Guideline | Requirement | Our compliance |
|---|---|---|
| **1.1.6** Inaccurate or misleading content | No false claims. | No invented testimonials, no invented outcomes. Marketing uses PDF research stats verbatim with sources. |
| **1.2 User-Generated Content** | Filter objectionable material; reporting + blocking mechanism; published moderation policy; ability to eject abusive users. | All four built in: AI honor-code triage → mod queue, in-app report/block, honor code visible in onboarding, suspension/ban flow in mod tools. |

### 4.x — Design

| Guideline | Requirement | Our compliance |
|---|---|---|
| **4.0** App should feel native, not just a wrapper | Avoid webview-only experiences. | Native RN + Expo, not a Capacitor shell. |
| **4.2.2** Minimum functionality | More than a website wrapper. | Native push, native auth (Apple Sign-In), offline cache, push, RevenueCat — exceeds the bar. |
| **4.8** Sign-in services | If you offer third-party sign-in (Google), you MUST offer Apple Sign-In with at least equivalent privacy. | Apple Sign-In offered. Email magic link is the default. |

### 5.x — Legal + privacy

| Guideline | Requirement | Our compliance |
|---|---|---|
| **5.1.1(v) Account deletion** | Apps that allow account creation must let users initiate account deletion **from within the app**. | "Delete my account" lives in `settings/account.tsx`. 30-day soft-delete grace period, then hard purge cron. |
| **5.1.1 Data collection + storage** | Be transparent, request only what you need, easy to opt-out, privacy policy URL. | Privacy policy hosted on marketing site. Minimal collection: email, display name, region. |
| **5.1.2 Data use + sharing** | Don't transmit data without permission. | No third-party tracking SDKs on iOS without ATT. PostHog runs without identifying ATT-protected device IDs. |
| **5.1.5 Location services** | Only when needed. | Not requested in v1. Region is user-typed text. |
| **5.4 VPN apps** | n/a |  |
| **5.6.1 Developer Code of Conduct** | Maintain trust. | Honor code system, expert reply discipline. |
| **5.6.3 Misuse of testimonials** | No paid reviews etc. | We won't solicit. |

### 1.4 Physical Harm
| | |
|---|---|
| **1.4.1 medical** | Don't give specific medical advice. | Disclaimers on fitness + financial content. "This is not medical/financial/legal advice." |

> **DECISION:** All five fitness/finance/relationship subsections include a one-line disclaimer at the top of every long-form post and course: "Educational content. Not medical, financial, or legal advice." Codified in CMS.

---

## 2. Apple privacy posture

### App Tracking Transparency (ATT)
- v1 does **not** track users across other companies' apps and websites.
- No ATT prompt needed unless we add an SDK that triggers IDFA (we will not in v1).

### Privacy Nutrition Labels (App Store Connect "App Privacy")
Mapping of data collection:

| Data type | Collected? | Linked to user? | Used for tracking? | Purpose |
|---|---|---|---|---|
| Email address | Yes | Yes | No | Account, transactional email |
| Name (display) | Yes | Yes | No | Profile display |
| Region (city/state text) | Yes | Yes | No | Member directory matching |
| User content (posts, check-ins, comments) | Yes | Yes | No | App functionality |
| Photos (avatar) | Yes (optional) | Yes | No | Profile display |
| Diagnostics (Sentry) | Yes | No (anonymized) | No | App performance |
| Product interaction (PostHog) | Yes | Anonymized device ID | No | Analytics |
| Crash data | Yes | No | No | App functionality |
| Purchase history | Yes (via RevenueCat) | Yes | No | App functionality / subscriptions |

No: precise location, contacts, photos library scraping, search history, browsing history outside the app, sensitive info.

### Privacy Policy URL
- Required. Hosted at `/legal/privacy` on marketing site.

### Account deletion endpoint
- Settings → Account → "Delete my account" → confirmation modal → cascading soft-delete + scheduled hard-purge.
- App Store Connect listing fields a privacy URL specifically for the deletion path: `/legal/account-deletion`.

---

## 3. Google Play readiness

| Policy | Requirement | Our compliance |
|---|---|---|
| **Payments** | Digital goods MUST use Google Play Billing. | All Android purchases via Play Billing + RevenueCat. |
| **Subscriptions disclosure** | Same as Apple — terms, renewal, cancel. | Same paywall template. |
| **Account deletion** | Required (parity with Apple): in-app deletion + a web URL listed in Play Console for users who can't sign in. | In-app deletion + `/legal/account-deletion` web URL works without auth. |
| **Data Safety form** | Disclose data types collected, sharing, purpose, security practices. | Mirror Apple nutrition label posture. |
| **User-generated content policy** | Same as Apple 1.2. | Same moderation stack. |
| **Health Misinformation** | No anti-vax, etc. | Educational disclaimers. |
| **Sensitive Events** | n/a | No real-world event monetization. |
| **Subscription cancellation** | Must allow easy cancel; surface cancellation URL on subscription management screen. | Play Billing handles this; in-app "Manage subscription" deep-links to Play Store. |
| **Target SDK** | Latest required (Android 14 / API 34 currently). | Expo SDK 51+ ships with API 34 target. |
| **64-bit native libs** | Required. | Hermes engine compliant. |
| **App Bundle** | AAB required, not APK. | EAS Build produces AAB. |
| **Permissions Declaration** | Justify sensitive permissions. | We request none in v1 beyond push. |

---

## 4. Common rejection causes — preemptive review

| Common rejection | How we avoid |
|---|---|
| Missing "Restore Purchases" | Built into paywall component, present on first view + settings. |
| Subscription terms unclear | Paywall renders full terms inline + Apple/Google standard disclosure block. |
| Crash on launch | Sentry release health gates EAS Submit; if crash-free sessions < 99.5% in preview, no submission. |
| No real content / empty app | Library + Daily Standard + the 5 subsection feeds seeded with founder-authored content before submission. |
| Inappropriate UGC | Honor code visible at signup, in-app report on every post, mod queue active. |
| App Tracking without ATT | We don't track across apps. PostHog configured to respect ATT-no scenario by default. |
| Misleading screenshots | Screenshots will be real app shots, not mockups. No fake transformation photos. |
| Account creation without deletion | Account deletion built in v1. |
| Brotherhood / men-only framing | Listing copy describes a "private community for men committed to high standards in fitness, finances, marriage, and business." Application gate happens *inside* the app post-signup. Not platform-level exclusion. |

---

## 5. Listing assets — checklist

### Apple App Store

| Asset | Spec | Status |
|---|---|---|
| App name | 30 chars max | "The Round Table" (15) ✓ |
| Subtitle | 30 chars max | "Brotherhood. Standards. Skill." (32 — trim to 30) |
| App icon | 1024×1024 PNG, no transparency, no rounded corners | TBD design |
| Screenshots — 6.7" iPhone | 1290×2796, 3–10 images | TBD — capture from real app |
| Screenshots — 6.5" iPhone | 1284×2778 | TBD |
| Screenshots — 5.5" iPhone (optional) | 1242×2208 | Skip if not required |
| Screenshots — 12.9" iPad Pro | n/a | **iPad explicitly not supported in v1 (founder confirm 2026-05-12).** App will be flagged as iPhone-only in the device family setting. |
| App Preview video (optional) | 15–30 sec, .mov | v1.1 |
| Description | 4000 chars | Draft below |
| Keywords | 100 chars, comma-sep | Draft below |
| Promotional text | 170 chars | Draft below |
| Support URL | URL | `roundtable.app/support` |
| Marketing URL | URL | `roundtable.app` |
| Privacy URL | URL | `roundtable.app/legal/privacy` |
| Age rating | 17+ recommended (UGC) | Confirm via questionnaire |
| Categories | Primary + secondary | Primary: **Lifestyle** · Secondary: **Education** |

### Google Play

| Asset | Spec | Status |
|---|---|---|
| App name | 30 chars | "The Round Table" ✓ |
| Short description | 80 chars | Draft below |
| Full description | 4000 chars | Reuse Apple description, lightly adapted |
| App icon | 512×512 PNG | Same source as Apple icon |
| Feature graphic | 1024×500 | TBD |
| Phone screenshots | min 1080p, 2–8 images | TBD |
| Tablet screenshots (optional) | Skip v1 | |
| App category | "Lifestyle" or "Social" | Lifestyle |
| Content rating | IARC questionnaire | Mature 17+ likely (UGC) |
| Target audience | 18+ | |
| Data Safety form | Match Apple nutrition label | |
| Privacy Policy URL | | `roundtable.app/legal/privacy` |

---

## 6. Draft listing copy

### App Store description (draft, v1)

```
The Round Table is a private brotherhood for men committed to a higher standard.

Seven domains. Five founding knights. One disciplined room.

Most men have fewer than two people they can rely on. Most don't talk about money or goals with their friends. The Round Table exists to change that.

Inside, you'll find:

• Five subsection rooms led by named experts — Fitness, Relations, Style, Investments, Entrepreneurship.
• Daily Standard prompts that start your day with intention, not doom-scroll.
• Weekly Knight Challenges across the seven pillars of modern manhood.
• Quarterly Crucible campaigns for members who want their discipline tested.
• A rank ladder you can't buy — only earn.
• An accountability pair from week one.
• Long-form courses, articles, and live sessions from John Maciel, Manny Thompson, Erik Sims, and Sean Love.

Membership tiers:
• New Member — full table access, weekly challenges, daily Standard.
• Knight — full library, full subsection posting, monthly founder calls.
• Council — capped seats, monthly live roundtables, direct expert access.

Educational content. Not medical, financial, or legal advice.

Subscriptions auto-renew at the price shown until cancelled in Settings.
Terms: roundtable.app/legal/terms
Privacy: roundtable.app/legal/privacy
```

### Keywords (100-char Apple)
```
brotherhood,men,discipline,community,fitness,investing,leadership,style,marriage,mentorship,coaching
```

### Promotional text (170 chars)
```
The Round Table is a private men's brotherhood across fitness, money, style, marriage, time, business, and leadership. Standards over excuses.
```

### Subtitle (30 chars max)
```
Brotherhood for Disciplined Men
```
(28 chars ✓)

### Google Play short description (80 chars)
```
A private brotherhood for men committed to standards across the 7 modern pillars.
```
(79 chars ✓)

---

## 7. TestFlight + Play internal testing plan

### TestFlight
1. EAS Build production-flavored binary uploaded weekly during M2–M4.
2. Internal Testing group (John + any explicit testers).
3. External Testing group of 20–50 founding-knight applicants, **only after** the app passes the 7-day stability gate (no high-severity Sentry events).
4. Tester feedback collected via in-app `feedback` form + Sentry user feedback.

### Play Console
1. **Internal testing track** during M2–M4 (up to 100 testers, instant rollout).
2. **Closed testing** during M4 (≥12 testers required for 14 days continuous before production rollout per current Play policy).
3. **Production** rollout staged: 5% → 20% → 50% → 100% over 5 days.

> **DECISION:** Plan for the Play 14-day closed-testing requirement from the start; assemble at least 12 testers (John + 11 invited founding members) before M4.

---

## 8. Submission readiness gate

App **does not submit** until all of these are true:

- [ ] Account deletion works in-app and on the web fallback URL.
- [ ] Paywall renders all required disclosures + restore button.
- [ ] Apple Sign-In implemented (since Google Sign-In offered).
- [ ] Privacy policy + Terms live on marketing site.
- [ ] Honor code visible at signup, signed timestamp recorded.
- [ ] Report + block + mod queue functional.
- [ ] All UGC surfaces have report flow.
- [ ] No crashes in 7-day Sentry rolling window.
- [ ] Disclaimers present on fitness + financial + relationship long-form.
- [ ] Listing screenshots are real app captures.
- [ ] Push notification rationale string set; ATT not requested (none needed v1).
- [ ] iOS minimum target: iOS 16. Android: API 24+ (Android 7+).
- [ ] EAS Build production profile passes; Vercel production deploy green.

---

## 9. Decision summary

- iOS subs via Apple IAP, Android via Google Play, web via Stripe — locked.
- RevenueCat unifies entitlements — locked.
- Account deletion in-app from day one — locked.
- Apple Sign-In offered alongside Google — locked.
- ATT not requested in v1 (no cross-app tracking) — locked.
- Age rating 17+ — confirmed at submission via questionnaire.
- Listing voice: private brotherhood / disciplined men / 7 pillars; **no exclusionary copy in store listings.**
- Submission gate: 12 items above must pass.
