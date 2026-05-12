/**
 * revenuecat.ts — Entitlement layer.
 *
 * RevenueCat unifies Apple IAP, Google Play Billing, and Stripe (web)
 * behind one entitlement contract. Treat RC's CustomerInfo as the
 * truth — server-side webhooks mirror it into `entitlements` for
 * fast reads + audit trail, but client decisions go through RC.
 *
 * Web is currently a no-op stub — RC for web ships via their JS SDK
 * which we'll wire in M1 once Stripe products are configured.
 */
import { Platform } from 'react-native';
import { env } from './env';
import { TIERS, TIER_ORDER, type TierId } from './tiers';

type CustomerInfoLike = {
  entitlements: { active: Record<string, { identifier: string }> };
} | null;

let configured = false;

export async function configureRevenueCat(appUserId?: string): Promise<void> {
  if (Platform.OS === 'web') return; // web handled separately
  if (configured) return;

  // Lazy import so web bundles don't pull native-only code.
  const Purchases = (await import('react-native-purchases')).default;

  const apiKey = Platform.OS === 'ios'
    ? env.RC_IOS_API_KEY
    : env.RC_ANDROID_API_KEY;

  if (!apiKey) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[revenuecat] No API key configured for', Platform.OS);
    }
    return;
  }

  Purchases.configure({ apiKey, appUserID: appUserId });
  configured = true;
}

export async function identifyRevenueCat(userId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const Purchases = (await import('react-native-purchases')).default;
  await Purchases.logIn(userId);
}

export async function logoutRevenueCat(): Promise<void> {
  if (Platform.OS === 'web') return;
  const Purchases = (await import('react-native-purchases')).default;
  await Purchases.logOut();
}

/** Resolve the highest-ranked active tier from a CustomerInfo blob. */
export function activeTierFromCustomerInfo(info: CustomerInfoLike): TierId | null {
  if (!info) return null;
  const active = info.entitlements.active;
  // Walk descending — Council > Knight > New Member.
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const tier = TIERS[TIER_ORDER[i]];
    if (active[tier.entitlement]) return tier.id;
  }
  return null;
}

export async function getCurrentTier(): Promise<TierId | null> {
  if (Platform.OS === 'web') return null;
  const Purchases = (await import('react-native-purchases')).default;
  try {
    const info = await Purchases.getCustomerInfo();
    return activeTierFromCustomerInfo(info as unknown as CustomerInfoLike);
  } catch (e) {
    if (__DEV__) console.warn('[revenuecat] getCustomerInfo failed', e);
    return null;
  }
}
