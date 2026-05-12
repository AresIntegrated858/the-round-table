# Discovery Notes — The Round Table

> Source of truth: `/Users/aresathletics/Downloads/Knights of the Round Table.pdf` (43 pages, John Maciel, Ares Athletics LLC).
> Secondary context: `~/Downloads/Claude.Brain/` wiki (read-only).
> Captured: 2026-05-12.

This document captures founder vision verbatim from the PDF, reconciles it with the Claude.Brain context, and locks the canonical facts the rest of the planning depends on. **Where the PDF and brain disagree, the PDF wins.**

---

## 1. Founder vision — verbatim quotes

### The thesis
> "The Knights of The Round Table will be a highly organized brotherhood of like minded men who are seeking a network where they can prosper through **HIGH ROI relationships** with other men on the same journey and proper training from industry experts of fields often over looked in modern day society…" — *PDF p.3*

### The mandate
> "To foster the growth of a new and fresh community dedicated to **'Men helping men'** through the use of an online community featuring multiple wings each ran by its own expert." — *PDF p.4*

> "To build a self sustaining ecosystem (Brotherhood) of men that are dedicated to providing and receiving value from each other." — *PDF p.4*

### The problem (research John ran personally)
> "Over **80% of recently polled men on instagram voted anonymously that they have 2 or less other men they can rely on**. Of those 80%, only 25% said that the friends they have in life are propelling them forward." — *PDF p.5*

> "Less than **20% of men talk to their friends about finances and goals** while a whopping 90% talk about video games and sports with their friends." — *PDF p.5*

> "**60% of men said that they 'often' have moments of feeling a lack of purpose, support and direction** while another 20% answered that they feel this way 'Constantly' accounting for over 80% of the total men polled." — *PDF p.5*

> "Over **40% of men have more credit card debt than they do emergency savings**." — *PDF p.5*

> "Only 25% of men say they have 6 close friends (**this number is half what it was 30 years ago**). Further, 15% of men say they have no close friends at all (**up an astounding 500% since 1990**)." — *PDF p.5*

> "Almost 70% of young men are single (compared to women at 30%), 1/3 of men polled regularly feel lonely… less then 3% of men felt that traditional masculinity was valued in society while 65% found that it was valued amongst their friends." — *PDF p.5*

These six stats are the **canonical landing-page proof block.** Use them verbatim.

---

## 2. The seven pillars (canonical, from PDF p.3)

The PDF names these focus areas — these are binding:

1. **Fitness**
2. **Investing**
3. **Style**
4. **Relationship Building**
5. **Time Management**
6. **Business Building**
7. **Leadership**

> **DECISION:** Seven pillars, not eight. The brain wiki listed eight by counting "Brotherhood / high-ROI relationships" — but that's the *connective tissue* of the whole platform, not a pillar of its own. The seven above are the discrete content/community wings.

---

## 3. Founding circle (the experts)

From PDF p.6 and p.12–18 expert pairings. **Sean Love is included; the brain summary omitted him.** **Chase Grafton is OUT of v1 per founder decision 2026-05-12** — Fitness subsection reassigned to John solo (Erik's Fitness domain remains as a contributor channel, not as a co-lead).

| Knight | Domains | Sections led |
|---|---|---|
| **John Maciel** | Fitness, Style, Fatherhood, Business Development/Ownership, Networking | Fitness (solo), Style (w/ Manny), Entrepreneurship (w/ Erik) |
| **Manny Thompson** | Combat, Style, Crypto, Stocks, Networking, Relationship Management | Relations (w/ Erik), Style (w/ John), Investments (w/ Sean) |
| **Erik Sims** | Fitness, Business Development, Marriage, Time Management, Financial Management | Relations (w/ Manny), Entrepreneurship (w/ John) |
| **Sean Love** | Marriage, Financial Management, Real Estate, Fatherhood, Networking | Investments (w/ Manny) |

> **DECISION:** Founding-circle expert profiles in v1 = these **four** named men only. No invented bios. No invented outcomes. Copy comes from the PDF and from John directly during onboarding. Chase's name and PDF profile do **not** appear in any v1 surface (marketing site, app, listings).

---

## 4. Information architecture (PDF p.12–18, amended)

The PDF defines a **primary community + 5 specialized subsections**, each led by 1–2 named experts. With Chase out, Fitness becomes a single-lead room under John. This is binding for v1.

```
The Round Table (primary community — all experts)
├── Fitness            — John M.            (solo lead; Erik contributes)
├── Relations          — Manny T. + Erik S.
├── Style              — Manny T. + John M.
├── Investments        — Manny T. + Sean L.
└── Entrepreneurship   — John M. + Erik S.
```

Pillars *not* mapped to subsections in the PDF: Time Management, Leadership. These exist as **content tracks** (Brotherhood Leadership course already exists per the brain), not as separate subsection rooms. We'll surface them as cross-cutting content categories inside the primary community.

> **DECISION:** v1 IA = 1 primary feed + 5 subsection feeds + a Library that hosts content across all 7 pillars. Time Management and Leadership live in Library, not as subsection feeds.

---

## 5. User experience the PDF specifies (p.9–10)

The PDF prescribes specific UX moments. These are the user-experience non-negotiables:

1. **Personalized Profiles** — interests, goals, areas for growth; used for matching.
2. **Orientation Webinars** — led by founding experts, introduce values + how to navigate.
3. **Special Interest Groups** — the 5 subsections above.
4. **Expert-Led Training Sessions** — regular cadence.
5. **Interactive Workshops** — hands-on, on practical skills.
6. **Goal Setting & Progress Tracking** — personal dashboards visible to member + coach.
7. **Networking Events** — virtual *and* in-person.
8. **One-on-One Consultations** — bookable sessions with named experts (Erik for financial, Manny for stocks/crypto).
9. **Community Support Groups** — explicitly addresses "the alarming lack of purpose among men."
10. **Brotherhood Activities** — meetups, online and offline.

> **DECISION:** Of these, v1 ships 1, 3, 4 (async first, live by v1.1), 6, 9. Webinars (2), workshops (5), networking events (7), 1:1 consults (8), and offline activities (10) are v1.1+ once the founding cohort proves the loop.

---

## 6. Functional specs the PDF demands (p.28)

> "User Interaction and Engagement Tools: Implementation of **forums, direct messaging, live chat, and event scheduling** functionalities to foster interaction and engagement among members."
> "Content Management and Distribution: A **CMS** that allows for easy posting, scheduling, and management of diverse content types (articles, videos, podcasts)."
> "Analytics and Reporting: Tools to monitor engagement levels, track member activity, and generate reports…"
> "**Mobile-responsive design** to accommodate members accessing the community via smartphones and tablets." — *PDF p.28*

> **NOTE:** v1 ships forums, CMS, analytics, mobile (native, not just responsive). DMs/live-chat are explicitly v1.1 per user intake. Event scheduling = v1.1.

---

## 7. Pricing — what the PDF said vs. what we're shipping

PDF p.23 originally proposed:
- Beta: 50 members, free, 30 days
- Beta grads: $10/mo lifetime discount
- Early bird (2 weeks): $15/mo
- Regular: $20–$25/mo (single tier)

User's confirmed v1 tier structure (overrides PDF):
- **New Member**: $20/mo
- **Knight**: $30/mo
- **Council**: $50/mo

PDF's original $20 floor is preserved as New Member. The PDF's projection of "10% of a 20K-member market × $20 = $40K MRR" still holds for the entry tier; Knight and Council are upside.

> **DECISION:** Keep the PDF's beta promise alive as the **Founding Knights cohort** — first 50 paid members get rate lock on Knight tier for 12 months at $20 (the PDF's promised baseline). This honors John's stated commitment to beta participants.

---

## 8. The platform shift (PDF p.38, p.41)

> "Our long-term goal is to transition to a dedicated live server within the next 2-3 years, providing a more robust and customizable environment for our thriving brotherhood." — *PDF p.38*

> Migration trigger in PDF: **4,000 members**.

**We are not building on Skool.** We are building the dedicated live-server endpoint directly — and shipping it as a cross-platform native app from day one. This is a strategic compression of the PDF's 2–3 year roadmap into the launch product.

> **DECISION:** Skip Skool entirely. The Round Table launches as a native iOS/Android/Web app on owned infrastructure. The PDF's "page 33: Skool does all of this for you" punchline is acknowledged but rejected — App Store revenue, brand control, and product velocity demand owned infrastructure.

---

## 9. Brand & aesthetic guardrails

From the brain critique (`brotherhood-based-transformation.md`):
> "Messaging can become **cartoonish if intensity is not grounded in real delivery and client outcomes**."

From John's biography:
> "The ideal tone is: Professional but intense. Strategic but direct. **Masculine but not cartoonish.** Confident but grounded."

Aesthetic anchors (proposed, pending lock):
- **Round Table** ≠ Ares Athletics aesthetic. Ares is war/blood/iron. Round Table is private-club Arthurian — older, quieter, heavier.
- Palette (proposal): **Deep charcoal #0E0F12** base, **antique brass / bronze #B08D57** primary accent, **ivory #EFEAE0** type, **deep crimson #6B1418** for sparing emphasis (badges, rank, recognition).
- Typography: a serif display (something with weight — think Trajan/Cinzel territory but cleaner) + a precise sans for UI.
- Iconography: minimal heraldry. No swords-and-shields kitsch. Think monogram, mark, seal.

> **DECISION:** Palette and type to be locked at the start of architecture. Aesthetic posture = **"private members' club, not pickup-artist forum."**

---

## 10. Non-negotiables (PDF + brain + user)

1. **No cartoonish "alpha" framing** — premium, restrained, serious.
2. **No invented members or outcomes** — only the four named knights (John, Manny, Erik, Sean) speak as experts in v1 copy. Chase Grafton's profile is excluded from v1 surfaces despite appearing in the source PDF.
3. **No Skool dependency** — own the platform.
4. **No discriminatory gating in listings** — access is by application + paid tier, never by platform-level exclusion (App Store compliance).
5. **No Stripe subscriptions on iOS or Android builds** — Apple IAP / Google Billing only on those platforms.
6. **Account deletion in-app from day one** (Apple 5.1.1(v) requirement).
7. **Apple Sign-In available** if any other third-party sign-in is offered (Apple guideline 4.8).
8. **Founder voice in every user-facing string** — directness, no fluff, no soft motivational language. (Master bio §16.)

---

## 11. What this document does NOT decide

- Tier feature gates (→ `monetization.md`).
- Tech stack details (→ `architecture.md`).
- App Store compliance posture (→ `app-store-readiness.md`).
- Build order (→ `build-plan.md`).

These follow.
