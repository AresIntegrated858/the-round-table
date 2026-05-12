import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';

/**
 * Ritual Step 1 — The brief. Read-only. Founder voice from
 * docs/product-brief.md §11. CTA only persists "user has seen brief"
 * by creating a profile row if one does not yet exist.
 */
export default function Brief() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  async function onContinue() {
    if (!user) return;
    // Ensure profile row exists. honor_code_signed_at and standards_declared_at
    // remain null — those are set by the next steps.
    await supabase.from('profiles').upsert(
      { id: user.id, display_name: null },
      { onConflict: 'id' },
    );
    track('brief_continued');
    await refreshProfile();
    router.replace('/(onboarding)/code');
  }

  return (
    <View className="flex-1 bg-charcoal">
      <ScrollView contentContainerClassName="px-6 pt-24 pb-12">
        <Text className="font-display text-ivory text-4xl tracking-wide">
          The Round Table
        </Text>

        <View className="mt-10 gap-5">
          <P>
            This is a private brotherhood. Not a feed. Not a forum. Not a chat
            app.
          </P>
          <P>
            Most men have fewer than two people they can rely on. Most never
            talk about money or goals with their friends. We exist to change
            that — through standards, not slogans.
          </P>
          <P>
            Seven domains: fitness, investing, style, relationship building,
            time management, business building, leadership.
          </P>
          <P>
            Four men leading the rooms: John Maciel, Manny Thompson, Erik Sims,
            Sean Love.
          </P>
          <P>
            One operating premise: men helping men, on the same journey, at a
            higher standard.
          </P>
          <P className="text-ivory-dim italic">
            If that's not what you came for, the door is to your right.
          </P>
        </View>
      </ScrollView>

      <View className="border-t border-ivory-dim/10 bg-charcoal px-6 pb-10 pt-4">
        <Pressable
          onPress={onContinue}
          className="rounded-xl bg-brass px-6 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-base tracking-wider">
            CONTINUE
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={`font-body text-ivory text-base leading-7 ${className}`}>
      {children}
    </Text>
  );
}
