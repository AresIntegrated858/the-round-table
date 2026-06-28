/**
 * tiers.ts — Canonical tier definitions, mirrored to docs/monetization.md.
 *
 * The entitlement IDs MUST match what's configured in the RevenueCat
 * dashboard. We treat RC as the system of record for "what tier is the
 * user on right now" — never trust a client-set boolean.
 */
import { env } from './env';

export type TierId = 'member' | 'command' | 'council';

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
  member: {
    id: 'member',
    name: 'Member',
    entitlement: env.RC_ENTITLEMENT_NEW_MEMBER,
    tagline: 'The founding seat. The room, the oath, the mission.',
    webMonthly: 25,
    webAnnual: 250,
    iapMonthly: 29.99,
    iapAnnual: 299.99,
    order: 1,
  },
  command: {
    id: 'command',
    name: 'Command',
    entitlement: env.RC_ENTITLEMENT_KNIGHT,
    tagline: 'Full pillar access, deeper tracking, stronger accountability.',
    webMonthly: 50,
    webAnnual: 500,
    iapMonthly: 59.99,
    iapAnnual: 599.99,
    order: 2,
  },
  council: {
    id: 'council',
    name: 'Council',
    entitlement: env.RC_ENTITLEMENT_COUNCIL,
    tagline: 'Advanced access for men carrying bigger responsibility.',
    webMonthly: 100,
    webAnnual: 1000,
    iapMonthly: 119.99,
    iapAnnual: 1199.99,
    order: 3,
  },
};

export const TIER_ORDER: TierId[] = ['member', 'command', 'council'];

/** Does tier A satisfy a gate requiring tier B? */
export function tierMeets(have: TierId | null, required: TierId): boolean {
  if (!have) return false;
  return TIER_ORDER.indexOf(have) >= TIER_ORDER.indexOf(required);
}
