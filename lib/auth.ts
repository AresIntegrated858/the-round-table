/**
 * auth.ts — Zustand store for auth state + signup-ritual progress.
 *
 * The four-step signup ritual is enforced here: the router checks
 * `ritualState` to decide which onboarding screen the user is on.
 * Skipping is impossible — users without `honor_code_signed_at` can
 * never reach the standards step; users without ≥1 standard can
 * never reach the paywall.
 */
import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { identifyRevenueCat, logoutRevenueCat, getCurrentTier } from './revenuecat';
import type { TierId } from './tiers';
import type { TransformationPathId } from './roundTableModel';

export type RitualStep = 'brief' | 'code' | 'standards' | 'paywall' | 'complete';

export type Profile = {
  id: string;
  display_name: string | null;
  honor_code_signed_at: string | null;
  standards_declared_at: string | null;
  cohort: string | null;
  transformation_path: TransformationPathId | null;
  is_admin: boolean;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  tier: TierId | null;
  /**
   * Demo mode: front-end-only session that lets us walk through the ritual
   * + app shell without a real Supabase project. NEVER set in production.
   */
  demo: boolean;
  hydrate: () => Promise<void>;
  setSession: (s: Session | null) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshTier: () => Promise<void>;
  signOut: () => Promise<void>;
  startDemo: () => void;
  exitDemo: () => void;
  demoAdvance: (patch: Partial<Profile> & { tier?: TierId | null }) => void;
};

export const useAuth = create<AuthState>((set, get) => ({
  loading: true,
  session: null,
  user: null,
  profile: null,
  tier: null,
  demo: false,

  async hydrate() {
    // Demo mode owns the state — don't let Supabase clobber it.
    if (get().demo) {
      set({ loading: false });
      return;
    }
    const { data } = await supabase.auth.getSession();
    await get().setSession(data.session);
    set({ loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (get().demo) return;
      void get().setSession(session);
    });
  },

  async setSession(session) {
    set({ session, user: session?.user ?? null });
    if (session?.user) {
      await identifyRevenueCat(session.user.id);
      await get().refreshProfile();
      await get().refreshTier();
    } else {
      set({ profile: null, tier: null });
    }
  },

  async refreshProfile() {
    const userId = get().user?.id;
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, honor_code_signed_at, standards_declared_at, cohort, is_admin')
      .eq('id', userId)
      .maybeSingle();
    const profile = data ? ({ ...(data as Omit<Profile, 'transformation_path'>), transformation_path: null }) : null;
    set({ profile, tier: profile?.is_admin ? 'council' : get().tier });
  },

  async refreshTier() {
    if (get().profile?.is_admin) {
      set({ tier: 'council' });
      return;
    }
    const tier = await getCurrentTier();
    set({ tier });
  },

  async signOut() {
    if (get().demo) {
      get().exitDemo();
      return;
    }
    await supabase.auth.signOut();
    await logoutRevenueCat();
    set({ session: null, user: null, profile: null, tier: null });
  },

  startDemo() {
    const demoUserId = 'demo-user-00000000-0000-0000-0000-000000000000';
    // Cast: a Session is a complex Supabase type; the AuthRouter only checks
    // truthiness + user.id, so a minimal stub suffices.
    const fakeSession = {
      access_token: 'demo',
      refresh_token: 'demo',
      expires_in: 3600,
      token_type: 'bearer',
      user: { id: demoUserId, email: 'demo@roundtable.app' },
    } as unknown as Session;
    // Profile starts null so the router routes us to /brief first —
    // brief.tsx will materialize the profile via demoAdvance.
    set({
      demo: true,
      loading: false,
      session: fakeSession,
      user: fakeSession.user,
      profile: null,
      tier: null,
    });
  },

  exitDemo() {
    set({
      demo: false,
      session: null,
      user: null,
      profile: null,
      tier: null,
    });
  },

  demoAdvance(patch) {
    const { profile, tier, user } = get();
    const { tier: nextTier, ...profilePatch } = patch;
    // If no profile exists yet, materialize one from the demo user — this
    // is the brief.tsx → code.tsx hand-off.
    const base: Profile = profile ?? {
      id: user?.id ?? 'demo',
      display_name: 'Founding Member',
      honor_code_signed_at: null,
      standards_declared_at: null,
      cohort: 'founding_2026',
      transformation_path: null,
      is_admin: false,
    };
    set({
      profile: { ...base, ...profilePatch },
      tier: nextTier !== undefined ? nextTier : tier,
    });
  },
}));

/** Derive which ritual step a user is on, given current profile + tier state. */
export function ritualStepFor(profile: Profile | null, tier: TierId | null): RitualStep {
  if (!profile) return 'brief';
  if (!profile.honor_code_signed_at) return 'code';
  if (!profile.standards_declared_at) return 'standards';
  if (!tier) return 'paywall';
  return 'complete';
}
