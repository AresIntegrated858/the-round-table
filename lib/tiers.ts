/**
 * tiers.ts — Canonical tier definitions, mirrored to docs/monetization.md.
 *
 * The entitlement IDs MUST match what's configured in the RevenueCat
 * dashboard. We treat RC as the system of record for "what tier is the
 * user on right now" — never trust a client-set boolean.
 */
import { env } from './env';

export type TierId = 'new_member' | 'knight' | 'council';

export type TierDef = {
  id: TierId;
  name: string;
  /** Entitlement identifier in RevenueCat. */
  entitlement: string;
  /** Display copy for the paywall. */
  tagline: string;
  /** Web/Stripe monthly price in USD. */
  webMonthly: number;
  /** Web/Stripe annual price in USD (≈17% discount vs 12× monthly). */
  webAnnual: number;
  /** iOS/Android sticker price (price-parity bump to absorb store cut). */
  iapMonthly: number;
  iapAnnual: number;
  /** Order on the paywall, ascending. */
  order: number;
};

export const TIERS: Record<TierId, TierDef> = {
  new_member: {
    id: 'new_member',
    name: 'New Member',
    entitlement: env.RC_ENTITLEMENT_NEW_MEMBER,
    tagline: 'Cross the threshold. Sit at the table.',
    webMonthly: 20,
    webAnnual: 200,
    iapMonthly: 24.99,
    iapAnnual: 239.99,
    order: 1,
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    entitlement: env.RC_ENTITLEMENT_KNIGHT,
    tagline: 'Full library, full challenges, full ladder.',
    webMonthly: 30,
    webAnnual: 300,
    iapMonthly: 34.99,
    iapAnnual: 339.99,
    order: 2,
  },
  council: {
    id: 'council',
    name: 'Council',
    entitlement: env.RC_ENTITLEMENT_COUNCIL,
    tagline: 'Access to the men, not just the content.',
    webMonthly: 50,
    webAnnual: 500,
    iapMonthly: 54.99,
    iapAnnual: 549.99,
    order: 3,
  },
};

export const TIER_ORDER: TierId[] = ['new_member', 'knight', 'council'];

/** Does tier A satisfy a gate requiring tier B? */
export function tierMeets(have: TierId | null, required: TierId): boolean {
  if (!have) return false;
  return TIER_ORDER.indexOf(have) >= TIER_ORDER.indexOf(required);
}
