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
  const user = useAuth((s) => s.user);
  const refreshProfile = useAuth((s) => s.refreshProfile);

  const demo = useAuth((s) => s.demo);
  const demoAdvance = useAuth((s) => s.demoAdvance);

  async function onContinue() {
    if (!user) return;
    track('brief_continued');
    if (demo) {
      // Materialize the profile so the AuthRouter advances past /brief.
      demoAdvance({});
    } else {
      // Ensure profile row exists. honor_code_signed_at and standards_declared_at
      // remain null — those are set by the next steps.
      await supabase.from('profiles').upsert(
        { id: user.id, display_name: null },
        { onConflict: 'id' },
      );
      await refreshProfile();
    }
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
            You were approved because you are serious enough to be tested by a
            room with standards. The founding seat is $25/month with a 90-day
            minimum commitment. Low-ticket does not mean low-standard.
          </P>
          <P>
            Brotherhood is the umbrella. Under it: body, money, style,
            relationships, time, business, leadership, communication, mental
            discipline, and high-value networking.
          </P>
          <P>
            The council: John Maciel, Manny Thompson, Chase Grafton, and Erik
            Sims.
          </P>
          <P>
            One operating premise: men helping men build command over life
            through action, accountability, and high-ROI relationships.
          </P>
          <P className="text-ivory-dim italic">
            If this is not what you came for, the door is to your right.
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
