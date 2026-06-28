/**
 * env.ts — Single source of truth for runtime configuration.
 *
 * EXPO_PUBLIC_* keys are inlined into the JS bundle at build time and are
 * therefore safe to reference from client code. Anything without the prefix
 * is server-only and MUST only be read from edge functions.
 *
 * We fail loud on missing keys in dev so misconfiguration surfaces fast.
 */

type ClientEnv = {
  ENV: 'dev' | 'preview' | 'production';
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  RC_IOS_API_KEY: string;
  RC_ANDROID_API_KEY: string;
  RC_STRIPE_API_KEY: string;
  RC_ENTITLEMENT_NEW_MEMBER: string;
  RC_ENTITLEMENT_KNIGHT: string;
  RC_ENTITLEMENT_COUNCIL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  SENTRY_DSN: string;
  POSTHOG_API_KEY: string;
  POSTHOG_HOST: string;
  APP_URL: string;
  MARKETING_URL: string;
  SUPPORT_EMAIL: string;
};

const publicEnv = {
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_RC_IOS_API_KEY: process.env.EXPO_PUBLIC_RC_IOS_API_KEY,
  EXPO_PUBLIC_RC_ANDROID_API_KEY: process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY,
  EXPO_PUBLIC_RC_STRIPE_API_KEY: process.env.EXPO_PUBLIC_RC_STRIPE_API_KEY,
  EXPO_PUBLIC_RC_ENTITLEMENT_NEW_MEMBER: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_NEW_MEMBER,
  EXPO_PUBLIC_RC_ENTITLEMENT_KNIGHT: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_KNIGHT,
  EXPO_PUBLIC_RC_ENTITLEMENT_COUNCIL: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_COUNCIL,
  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  EXPO_PUBLIC_APP_URL: process.env.EXPO_PUBLIC_APP_URL,
  EXPO_PUBLIC_MARKETING_URL: process.env.EXPO_PUBLIC_MARKETING_URL,
  EXPO_PUBLIC_SUPPORT_EMAIL: process.env.EXPO_PUBLIC_SUPPORT_EMAIL,
};

function read(key: keyof typeof publicEnv, fallback = ''): string {
  const v = publicEnv[key];
  if (!v && __DEV__ && !fallback) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing ${key} — using empty string. Set in .env.`);
  }
  return v ?? fallback;
}

export const env: ClientEnv = {
  ENV: (read('EXPO_PUBLIC_ENV', 'dev') as ClientEnv['ENV']),
  SUPABASE_URL: read('EXPO_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: read('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  RC_IOS_API_KEY: read('EXPO_PUBLIC_RC_IOS_API_KEY'),
  RC_ANDROID_API_KEY: read('EXPO_PUBLIC_RC_ANDROID_API_KEY'),
  RC_STRIPE_API_KEY: read('EXPO_PUBLIC_RC_STRIPE_API_KEY'),
  RC_ENTITLEMENT_NEW_MEMBER: read('EXPO_PUBLIC_RC_ENTITLEMENT_NEW_MEMBER', 'new_member'),
  RC_ENTITLEMENT_KNIGHT: read('EXPO_PUBLIC_RC_ENTITLEMENT_KNIGHT', 'knight'),
  RC_ENTITLEMENT_COUNCIL: read('EXPO_PUBLIC_RC_ENTITLEMENT_COUNCIL', 'council'),
  STRIPE_PUBLISHABLE_KEY: read('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  GOOGLE_IOS_CLIENT_ID: read('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'),
  GOOGLE_WEB_CLIENT_ID: read('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'),
  SENTRY_DSN: read('EXPO_PUBLIC_SENTRY_DSN'),
  POSTHOG_API_KEY: read('EXPO_PUBLIC_POSTHOG_API_KEY'),
  POSTHOG_HOST: read('EXPO_PUBLIC_POSTHOG_HOST', 'https://us.i.posthog.com'),
  APP_URL: read('EXPO_PUBLIC_APP_URL', 'https://roundtable.app'),
  MARKETING_URL: read('EXPO_PUBLIC_MARKETING_URL', 'https://roundtable.app'),
  SUPPORT_EMAIL: read('EXPO_PUBLIC_SUPPORT_EMAIL', 'support@roundtable.app'),
};
