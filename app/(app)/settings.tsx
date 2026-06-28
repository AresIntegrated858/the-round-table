import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { TIERS } from '@/lib/tiers';
import { track } from '@/lib/posthog';

/**
 * Settings — required surfaces for App Store compliance:
 *   - Subscription management (Apple 3.1.2)
 *   - Account deletion in-app (Apple 5.1.1(v))
 *
 * Account deletion is destructive and final. We confirm twice and
 * route the actual deletion through an Edge Function so it can also
 * scrub Stripe/RevenueCat references atomically.
 */
export default function Settings() {
  const { user, profile, tier, signOut } = useAuth();

  async function confirmDelete() {
    const proceed = await ask(
      'Delete your account?',
      'This is irreversible. Your profile, standards, posts, and subscription are removed. Are you sure?',
    );
    if (!proceed) return;
    const reallyProceed = await ask(
      'Final confirmation',
      'Once you confirm, your account is queued for deletion immediately.',
    );
    if (!reallyProceed) return;

    try {
      // Server-authoritative deletion: edge function handles cascading
      // deletes + Stripe subscription cancellation + RC user delete.
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      track('account_deleted');
      await signOut();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not delete account.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
    }
  }

  function manageSubscription() {
    if (Platform.OS === 'ios') {
      void openUrl('https://apps.apple.com/account/subscriptions');
    } else if (Platform.OS === 'android') {
      void openUrl('https://play.google.com/store/account/subscriptions');
    } else {
      // Web → Stripe customer portal endpoint
      void openUrl('/billing-portal');
    }
  }

  return (
    <ScrollView className="flex-1 bg-charcoal" contentContainerClassName="px-6 pt-20 pb-12">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">SETTINGS</Text>
      <Text className="mt-2 font-display text-ivory text-3xl tracking-wide">
        Account
      </Text>

      <Row label="Email" value={user?.email ?? '—'} />
      <Row label="Tier" value={tier ? TIERS[tier].name : 'None'} />
      <Row label="Cohort" value={profile?.cohort ?? '—'} />
      <Row label="Path" value={profile?.transformation_path ?? '—'} />
      <Row
        label="Code signed"
        value={profile?.honor_code_signed_at ? new Date(profile.honor_code_signed_at).toDateString() : '—'}
      />

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-display text-ivory text-xl">MVP launch status</Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          This local build demonstrates the approved responsive web MVP:
          application, oath, diagnostic, path assignment, founding offer,
          command center, missions, pillar rooms, local tables, and scorecard.
          Production payments remain blocked on Stripe/RevenueCat/store setup.
        </Text>
      </View>

      <View className="mt-10 gap-3">
        <ActionButton label="Manage subscription" onPress={manageSubscription} />
        <ActionButton label="Sign out" onPress={signOut} />
      </View>

      <View className="mt-12 border-t border-crimson/20 pt-6">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">DANGER</Text>
        <Pressable
          onPress={confirmDelete}
          className="mt-3 rounded-xl border border-crimson/40 bg-crimson/5 px-5 py-4 active:opacity-70"
        >
          <Text className="text-center font-body text-crimson-light text-base">
            Delete account
          </Text>
        </Pressable>
        <Text className="mt-3 font-body text-ivory-dim text-xs leading-5">
          Removes your profile, standards, and posts. Cancels and removes any
          active subscription. Irreversible.
        </Text>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-6">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">{label.toUpperCase()}</Text>
      <Text className="mt-1 font-body text-ivory text-base">{value}</Text>
    </View>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-5 py-4 active:opacity-70"
    >
      <Text className="font-body text-ivory text-base">{label}</Text>
    </Pressable>
  );
}

async function ask(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return window.confirm(`${title}\n\n${message}`);
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
      { text: 'Confirm', onPress: () => resolve(true), style: 'destructive' },
    ]);
  });
}

async function openUrl(url: string): Promise<void> {
  const { Linking } = await import('react-native');
  await Linking.openURL(url);
}
