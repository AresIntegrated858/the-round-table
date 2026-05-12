/**
 * sentry.ts — Crash + error reporting.
 *
 * Initialized at app root. PII scrubbed by default — never attach
 * email/phone to events. We tag environment and release so dashboards
 * separate dev noise from production incidents.
 */
import * as Sentry from '@sentry/react-native';
import { env } from './env';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!env.SENTRY_DSN) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[sentry] No DSN configured; skipping init.');
    }
    return;
  }
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENV,
    enableAutoSessionTracking: true,
    sendDefaultPii: false,
    tracesSampleRate: env.ENV === 'production' ? 0.2 : 1.0,
  });
  initialized = true;
}

export { Sentry };
