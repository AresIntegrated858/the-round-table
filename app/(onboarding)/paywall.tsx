import { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useAuth } from '@/lib/auth';
import { TIERS, TIER_ORDER, type TierId } from '@/lib/tiers';
import { track } from '@/lib/posthog';

/**
 * Ritual Step 4 — Paywall. This is the M0 visual skeleton.
 *
 * Purchase wiring lands in M0.1 once RevenueCat products + Stripe products
 * + App Store / Play Console offerings are configured. For now: tier
 * selection persists locally and surfaces a clear "complete purchase" CTA
 * that is intentionally non-functional until products exist.
 *
 * NOTE on Apple anti-steering (3.1.3): iOS users see ONLY the IAP price.
 * Web pricing is never named inside the iOS app.
 */
export default function Paywall() {
  const refreshTier = useAuth((s) => s.refreshTier);
  const demo = useAuth((s) => s.demo);
  const demoAdvance = useAuth((s) => s.demoAdvance);
  const [selected, setSelected] = useState<TierId>('member');
  const [busy, setBusy] = useState(false);

  const showWebPricing = Platform.OS === 'web';

  async function onPurchase() {
    setBusy(true);
    track('paywall_viewed', { tier: selected });
    try {
      if (demo) {
        // In demo mode, "purchase" simply flips the tier state so the
        // AuthRouter promotes us into (app)/.
        demoAdvance({
          tier: selected,
          cohort: 'founding_2026',
        });
      } else {
        // TODO(M0.1): Wire actual purchase.
        //   - iOS / Android: Purchases.purchasePackage(...)
        //   - Web: Stripe checkout via RC web SDK or our own /api/checkout edge fn.
        await refreshTier();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View className="flex-1 bg-charcoal">
      <ScrollView contentContainerClassName="px-6 pt-24 pb-12">
        <Text className="font-display text-ivory text-3xl tracking-wide">
          Confirm your founding seat
        </Text>
        <Text className="mt-3 font-body text-ivory-dim text-sm leading-5">
          Application approval comes before payment. Founding members begin at
          $25/month, commit for the first 90 days, then continue month to
          month with their founding price locked while active.
        </Text>

        <View className="mt-8 gap-4">
          {TIER_ORDER.map((id) => {
            const t = TIERS[id];
            const isSel = selected === id;
            const price = showWebPricing ? t.webMonthly : t.iapMonthly;
            return (
              <Pressable
                key={id}
                onPress={() => setSelected(id)}
                className={`rounded-2xl border p-5 ${
                  isSel
                    ? 'border-brass bg-brass/10'
                    : 'border-ivory-dim/20 bg-charcoal-800'
                }`}
              >
                <View className="flex-row items-baseline justify-between">
                  <Text className="font-display text-ivory text-xl tracking-wide">
                    {t.name}
                  </Text>
                  <Text className="font-display text-brass text-2xl">
                    ${price.toFixed(showWebPricing ? 0 : 2)}
                    <Text className="font-body text-ivory-dim text-sm">/mo</Text>
                  </Text>
                </View>
                <Text className="mt-2 font-body text-ivory-dim text-sm leading-5">
                  {t.tagline}
                </Text>
                {id === 'member' && (
                  <View className="mt-3 self-start rounded-full border border-brass/40 bg-brass/10 px-2.5 py-1">
                    <Text className="font-body text-brass text-[10px] tracking-widest">
                      FOUNDING SEAT · FIRST 25 · CAP AT 50 · $25 LOCKED
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {showWebPricing && (
          <Text className="mt-6 font-body text-ivory-dim text-xs leading-5">
            Web prices shown. Apple and Google charge a marketplace fee on
            in-app purchases; on those platforms the sticker is higher and the
            difference goes to them, not us.
          </Text>
        )}

        <Text className="mt-6 font-body text-ivory-dim text-xs leading-5">
          The first 90 days are a minimum commitment to protect the culture.
          After that, membership is month to month. By subscribing you agree to
          the Terms of Service, Privacy Policy, and member code.
        </Text>
      </ScrollView>

      <View className="border-t border-ivory-dim/10 bg-charcoal px-6 pb-10 pt-4">
        <Pressable
          onPress={onPurchase}
          disabled={busy}
          className="rounded-xl bg-brass px-6 py-4 active:opacity-80 disabled:opacity-50"
        >
          <Text className="text-center font-display text-charcoal text-base tracking-wider">
            {busy ? 'PROCESSING…' : `BECOME ${TIERS[selected].name.toUpperCase()}`}
          </Text>
        </Pressable>
        <Pressable className="mt-3 py-2" onPress={() => track('tier_restored')}>
          <Text className="text-center font-body text-ivory-dim text-sm">
            Restore purchases
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
