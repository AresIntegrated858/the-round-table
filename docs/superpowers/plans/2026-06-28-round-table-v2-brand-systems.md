# Round Table V2 Brand Systems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved V2 identity, progression, brotherhood, proof, ranking, local, and council utilities that make The Round Table feel like a real private brotherhood instead of a generic community shell.

**Architecture:** Extend the existing local-first Expo/React Native Web MVP with typed domain utilities in `lib/roundTableEngine.ts`, brand/curriculum constants in `lib/roundTableModel.ts`, persisted actions in `lib/roundTableStore.ts`, and focused app surfaces under `app/(app)/`. Keep the implementation shippable without requiring backend chat or live moderation infrastructure.

**Tech Stack:** Expo Router, React Native Web, NativeWind, Zustand persisted via AsyncStorage, TypeScript, `tsx` tests.

---

### Task 1: Domain Model And Engine

**Files:**
- Modify: `lib/roundTableModel.ts`
- Modify: `lib/roundTableEngine.ts`
- Modify: `lib/roundTableEngine.test.ts`

- [ ] **Step 1: Write failing tests**

Add assertions for seat progression, oath acceptance, campaign phase completion, proof posts, War Room posts, brotherhood requests, local connection intents, rankings, and council review items.

- [ ] **Step 2: Run the engine test**

Run: `./node_modules/.bin/tsx lib/roundTableEngine.test.ts`
Expected: FAIL because the new exported functions and state fields do not exist yet.

- [ ] **Step 3: Implement the domain utilities**

Add typed records and pure functions for:
- `acceptOath`
- `setSeatStatus`
- `completeCampaignPhase`
- `addProofPost`
- `addWarRoomPost`
- `addBrotherhoodRequest`
- `addLocalConnectionIntent`
- `addCouncilReviewItem`
- `resolveCouncilReviewItem`
- `buildBrotherCard`
- `calculateMonthlyRankings`

- [ ] **Step 4: Run the engine test**

Run: `./node_modules/.bin/tsx lib/roundTableEngine.test.ts`
Expected: PASS.

### Task 2: Persisted Store Actions

**Files:**
- Modify: `lib/roundTableStore.ts`

- [ ] **Step 1: Wire state and actions**

Expose the new state fields and actions from the engine through the persisted Zustand store.

- [ ] **Step 2: Run typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: PASS or only screen errors that will be fixed in Task 3.

### Task 3: Brand Surfaces

**Files:**
- Modify: `app/(app)/_layout.tsx`
- Modify: `app/(app)/index.tsx`
- Modify: `app/(app)/missions.tsx`
- Modify: `app/(app)/standards.tsx`
- Modify: `app/(app)/review.tsx`
- Create: `app/(app)/brotherhood.tsx`
- Create: `app/(app)/rankings.tsx`

- [ ] **Step 1: Add navigation**

Add `BROTHERHOOD` and `RANKINGS` tabs. Keep labels short because the mobile tab bar is crowded.

- [ ] **Step 2: Upgrade Command**

Surface seat status, oath status, Command Score, campaign phase progress, Brother Card summary, and local table signal.

- [ ] **Step 3: Upgrade Missions**

Show the 90-day campaign map with phase completion buttons and proof post submission.

- [ ] **Step 4: Build Brotherhood**

Add War Room posting, Brother Cards, Brotherhood Requests, and Local Table matchmaking intent.

- [ ] **Step 5: Build Rankings**

Show monthly table rankings generated from score, proof, wins, local action, and contribution.

- [ ] **Step 6: Upgrade Standards and Review**

Standards gets oath acceptance and code enforcement visibility. Review gets council queue creation/resolution for warnings, promotions, proof reviews, and application decisions.

### Task 4: Verification And Launch

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run tests**

Run:
- `./node_modules/.bin/tsx lib/roundTableModel.test.ts`
- `./node_modules/.bin/tsx lib/roundTableEngine.test.ts`

- [ ] **Step 2: Run TypeScript and lint**

Run:
- `./node_modules/.bin/tsc --noEmit`
- `npm run lint`

- [ ] **Step 3: Build web**

Run: `npm run build:web`
Expected: Expo static export succeeds.

- [ ] **Step 4: Commit, push, deploy**

Commit the V2 work, push `main`, and let Vercel deploy from the connected GitHub repo.
