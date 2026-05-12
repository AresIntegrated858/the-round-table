/**
 * posthog.ts — Product analytics.
 *
 * We track *actions* (signup_completed, code_agreed, paywall_view,
 * tier_purchased) not user content. No event names include PII.
 *
 * The provider lives in app/_layout.tsx via PostHogProvider; this
 * module just exposes a typed event helper for consistency.
 */
import PostHog from 'posthog-react-native';
import { env } from './env';

let client: PostHog | null = null;

export async function initPostHog(): Promise<PostHog | null> {
  if (client) return client;
  if (!env.POSTHOG_API_KEY) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[posthog] No API key configured; skipping init.');
    }
    return null;
  }
  client = new PostHog(env.POSTHOG_API_KEY, { host: env.POSTHOG_HOST });
  return client;
}

export function getPostHog(): PostHog | null {
  return client;
}

/** Canonical event names — keep this list narrow; ad-hoc names are forbidden. */
export type AnalyticsEvent =
  | 'app_opened'
  | 'signup_started'
  | 'brief_continued'
  | 'code_agreed'
  | 'standards_declared'
  | 'paywall_viewed'
  | 'tier_purchased'
  | 'tier_restored'
  | 'account_deleted'
  | 'feed_viewed';

// PostHog only accepts JSON-serializable properties. Keep the public type
// permissive for callers; we cast at the boundary.
export function track(event: AnalyticsEvent, props?: Record<string, unknown>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?.capture(event, props as any);
}
