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

export type RitualStep = 'brief' | 'code' | 'standards' | 'paywall' | 'complete';

export type Profile = {
  id: string;
  display_name: string | null;
  honor_code_signed_at: string | null;
  standards_declared_at: string | null;
  cohort: string | null;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  tier: TierId | null;
  hydrate: () => Promise<void>;
  setSession: (s: Session | null) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshTier: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  loading: true,
  session: null,
  user: null,
  profile: null,
  tier: null,

  async hydrate() {
    const { data } = await supabase.auth.getSession();
    await get().setSession(data.session);
    set({ loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      void get().setSession(session);
    });
  },

  async setSession(session) {
    set({ session, user: session?.user ?? null });
    if (session?.user) {
      await identifyRevenueCat(session.user.id);
      await Promise.all([get().refreshProfile(), get().refreshTier()]);
    } else {
      set({ profile: null, tier: null });
    }
  },

  async refreshProfile() {
    const userId = get().user?.id;
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, honor_code_signed_at, standards_declared_at, cohort')
      .eq('id', userId)
      .maybeSingle();
    set({ profile: (data as Profile) ?? null });
  },

  async refreshTier() {
    const tier = await getCurrentTier();
    set({ tier });
  },

  async signOut() {
    await supabase.auth.signOut();
    await logoutRevenueCat();
    set({ session: null, user: null, profile: null, tier: null });
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
