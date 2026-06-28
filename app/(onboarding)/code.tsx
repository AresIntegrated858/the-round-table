import { useState } from 'react';
import { Pressable, Text, View, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';
import { ScrollGate } from '@/components/ScrollGate';

/**
 * Ritual Step 2 — The honor code. CTA is disabled until the user has
 * scrolled to the bottom (ScrollGate). On agree, we stamp
 * `profiles.honor_code_signed_at` so the user cannot proceed without it.
 *
 * Copy is canonical — sourced verbatim from docs/product-brief.md §11.
 */
export default function Code() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const refreshProfile = useAuth((s) => s.refreshProfile);
  const demo = useAuth((s) => s.demo);
  const demoAdvance = useAuth((s) => s.demoAdvance);
  const [readEnd, setReadEnd] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onAgree() {
    if (!user || !readEnd) return;
    setSaving(true);
    try {
      const stamp = new Date().toISOString();
      if (demo) {
        demoAdvance({ honor_code_signed_at: stamp });
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ honor_code_signed_at: stamp })
          .eq('id', user.id);
        if (error) throw error;
        await refreshProfile();
      }
      track('code_agreed');
      router.replace('/(onboarding)/standards');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Could not save', msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-charcoal">
      <ScrollGate onReachEnd={() => setReadEnd(true)}>
        <Text className="font-display text-ivory text-3xl tracking-wide">
          The Code
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm">
          Read it. Then sign it.
        </Text>

        <Section title="At the Round Table, we:">
          <Bullet>
            Show up. Check-ins, challenges, threads — we participate, we do not lurk.
          </Bullet>
          <Bullet>Speak directly. No empty motivation, no fake performance.</Bullet>
          <Bullet>Sharpen each other. Feedback is given honestly and received without ego.</Bullet>
          <Bullet>Hold confidences. What happens at the table stays at the table.</Bullet>
          <Bullet>Earn what we wear. Rank is earned, never bought.</Bullet>
        </Section>

        <Section title="We do not:">
          <Bullet>Bash women, partners, or anyone outside the room.</Bullet>
          <Bullet>Pitch get-rich-quick schemes, MLMs, or affiliate funnels.</Bullet>
          <Bullet>Give medical, financial, or legal advice we would not sign our name to.</Bullet>
          <Bullet>Tolerate political tribalism inside the rooms.</Bullet>
          <Bullet>Trade tier dues for influence — no one buys a louder voice.</Bullet>
        </Section>

        <Text className="mt-10 font-body text-ivory text-base leading-7">
          Violation of the code routes to the founding knights. Action is at
          our discretion: warning, suspension, removal. No appeal.
        </Text>

        <Text className="mt-8 font-body text-ivory-dim text-xs">
          Scroll to the end to enable the agreement.
        </Text>
      </ScrollGate>

      <View className="border-t border-ivory-dim/10 bg-charcoal px-6 pb-10 pt-4">
        <Pressable
          onPress={onAgree}
          disabled={!readEnd || saving}
          className="rounded-xl bg-brass px-6 py-4 active:opacity-80 disabled:opacity-30"
        >
          <Text className="text-center font-display text-charcoal text-base tracking-wider">
            {saving ? 'SIGNING…' : 'I AGREE'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-8">
      <Text className="font-display text-brass text-lg tracking-wide">{title}</Text>
      <View className="mt-3 gap-3">{children}</View>
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row gap-3">
      <Text className="font-body text-brass text-base">•</Text>
      <Text className="flex-1 font-body text-ivory text-base leading-6">
        {children}
      </Text>
    </View>
  );
}
