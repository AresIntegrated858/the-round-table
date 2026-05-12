/**
 * supabase.ts — Client-side Supabase singleton.
 *
 * Uses AsyncStorage on native, localStorage on web. Auth session
 * persistence is on; we'll add a custom auth state listener in
 * `lib/auth.ts` that pushes into the Zustand store.
 *
 * Service-role operations NEVER happen here — those live in Edge
 * Functions under `supabase/functions/`.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { env } from './env';

const storage = Platform.OS === 'web'
  ? undefined // supabase-js falls back to localStorage on web automatically
  : AsyncStorage;

export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
      flowType: 'pkce',
    },
  },
);
