# Round Table MVP Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally launch a coherent responsive web MVP for The Round Table using the approved 2026-06-27 offer, onboarding, app structure, and member experience.

**Architecture:** Add a small typed content/model layer for tiers, transformation paths, pillars, launch missions, local tables, and diagnostic scoring. Wire the existing Expo Router screens to that model, prioritizing a polished demo/application flow and a mobile-native web app experience. Keep backend/payment integrations as explicit demo/MVP placeholders because production approval, Stripe, RevenueCat, and app-store accounts are external blockers.

**Tech Stack:** Expo Router, React Native Web, TypeScript, NativeWind, Zustand, Supabase stubs, tsx for lightweight model tests.

---

## File Structure

- Create `lib/roundTableModel.ts`: canonical launch content, diagnostic scoring, path definitions, pillars, missions, local tables.
- Create `lib/roundTableModel.test.ts`: lightweight tsx tests for tier naming/pricing, diagnostic path assignment, and required launch content.
- Modify `lib/tiers.ts`: update tier IDs/names/pricing to Member / Command / Council and $25 founding entry.
- Modify `lib/auth.ts`: allow demo profile to carry a transformation path and founding cohort.
- Create `app/(auth)/apply.tsx`: application-first entry surface that can start demo onboarding.
- Modify `app/(marketing)/index.tsx`: movement-style landing page with apply and demo entry.
- Modify `app/(onboarding)/brief.tsx`: current council and $25/90-day framing.
- Modify `app/(onboarding)/standards.tsx`: combine diagnostic, standards, and path assignment.
- Modify `app/(onboarding)/paywall.tsx`: founding $25 and Member / Command / Council offer.
- Modify `app/(app)/_layout.tsx`: tab IA for Command, Missions, Pillars, Standards, Settings.
- Modify `app/(app)/index.tsx`: mobile-native command center.
- Create `app/(app)/missions.tsx`: First Campaign and weekly mission surface.
- Modify `app/(app)/library.tsx`: pillar/local-table hub.
- Modify `app/(app)/standards.tsx`: scorecard, oath, progress/rankings.
- Modify `app/(app)/settings.tsx`: current tier labels and MVP status.

## Task 1: Model Layer

**Files:**
- Create: `lib/roundTableModel.test.ts`
- Create: `lib/roundTableModel.ts`

- [ ] **Step 1: Write failing tests**

```ts
import assert from 'node:assert/strict';
import {
  FIRST_CAMPAIGN,
  LAUNCH_TIERS,
  assignPathFromDiagnostic,
  getPathById,
  LOCAL_TABLES,
  PILLARS,
} from './roundTableModel';

assert.equal(LAUNCH_TIERS[0].name, 'Member');
assert.equal(LAUNCH_TIERS[0].monthly, 25);
assert.equal(LAUNCH_TIERS[1].name, 'Command');
assert.equal(LAUNCH_TIERS[2].name, 'Council');

const bodyPath = assignPathFromDiagnostic({
  body: 5,
  money: 1,
  time: 1,
  relationships: 1,
  business: 1,
  presence: 1,
});
assert.equal(bodyPath.id, 'body-standard');

const foundation = assignPathFromDiagnostic({
  body: 0,
  money: 0,
  time: 0,
  relationships: 0,
  business: 0,
  presence: 0,
});
assert.equal(foundation.id, 'foundation-path');

assert.equal(getPathById('command-path').title, 'The Command Path');
assert.ok(PILLARS.length >= 10);
assert.ok(LOCAL_TABLES.some((table) => table.region === 'Florida'));
assert.equal(FIRST_CAMPAIGN.weeks.length, 4);

console.log('roundTableModel tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/tsx lib/roundTableModel.test.ts`

Expected: fail because `lib/roundTableModel.ts` does not exist.

- [ ] **Step 3: Implement model**

Create `lib/roundTableModel.ts` with tier definitions, path definitions, diagnostic scoring, pillars, local tables, launch missions, First Campaign weeks, and council data.

- [ ] **Step 4: Run test to verify it passes**

Run: `./node_modules/.bin/tsx lib/roundTableModel.test.ts`

Expected: `roundTableModel tests passed`.

## Task 2: Offer And Auth State

**Files:**
- Modify: `lib/tiers.ts`
- Modify: `lib/auth.ts`

- [ ] **Step 1: Update tier constants**

Change tier IDs to `member`, `command`, `council`, with display names Member / Command / Council and founding Member price at $25.

- [ ] **Step 2: Update demo profile**

Allow `Profile` to carry `transformation_path` and make demo users display as founding members.

- [ ] **Step 3: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`

Expected: no type errors.

## Task 3: Application And Onboarding

**Files:**
- Create: `app/(auth)/apply.tsx`
- Modify: `app/(marketing)/index.tsx`
- Modify: `app/(onboarding)/brief.tsx`
- Modify: `app/(onboarding)/standards.tsx`
- Modify: `app/(onboarding)/paywall.tsx`

- [ ] **Step 1: Add application screen**

Create a private but movement-driven application form with core questions, manual-review copy, and a demo approval button that starts the onboarding ritual.

- [ ] **Step 2: Update landing page**

Move landing copy to the approved hook: build your life command system. Route primary CTA to application.

- [ ] **Step 3: Update onboarding brief**

Use current council names, $25/month, 90-day commitment, and values-based brotherhood copy.

- [ ] **Step 4: Add diagnostic/path assignment to standards**

Let demo users score their current weak points, declare standards, then assign a branded transformation path.

- [ ] **Step 5: Update paywall**

Show Member / Command / Council, founding $25, 90-day commitment, approval-before-payment copy, and demo purchase.

- [ ] **Step 6: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`

Expected: no type errors.

## Task 4: Member App MVP

**Files:**
- Modify: `app/(app)/_layout.tsx`
- Modify: `app/(app)/index.tsx`
- Create: `app/(app)/missions.tsx`
- Modify: `app/(app)/library.tsx`
- Modify: `app/(app)/standards.tsx`
- Modify: `app/(app)/settings.tsx`

- [ ] **Step 1: Update tab IA**

Tabs: Command, Missions, Pillars, Standards, Settings.

- [ ] **Step 2: Build command center**

Show today's standard, assigned path, mission, scorecard preview, public ranking, and local table prompt.

- [ ] **Step 3: Build missions screen**

Show The First Campaign, four campaign phases, this week's mission, and rituals.

- [ ] **Step 4: Build pillars/local hub**

Use the existing Library tab as a Pillars tab: pillar sections, U.S. local tables, council expertise.

- [ ] **Step 5: Build standards scorecard**

Show oath, core code, hard/soft tracking, public wins, and scorecard.

- [ ] **Step 6: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`

Expected: no type errors.

## Task 5: Verify And Launch

**Files:**
- No source edits expected unless verification catches a defect.

- [ ] **Step 1: Run model tests**

Run: `./node_modules/.bin/tsx lib/roundTableModel.test.ts`

Expected: `roundTableModel tests passed`.

- [ ] **Step 2: Run TypeScript check**

Run: `./node_modules/.bin/tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Start local web server**

Run: `npm run web -- --port 8082`

Expected: Expo starts a local web server. Share the local URL with John.
