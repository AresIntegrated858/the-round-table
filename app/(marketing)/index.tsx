import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { COUNCIL, PILLARS } from '@/lib/roundTableModel';

/**
 * Landing splash. Logged-out users see this on app open; web users
 * arrive here from roundtable.app. Marketing site copy mirrors PDF p.3–5.
 */
export default function MarketingHome() {
  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 py-10 md:py-16"
    >
      <View className="md:flex-row md:items-start md:gap-12">
        <View className="md:flex-1">
          <Text className="font-body text-brass text-xs tracking-widest">
            PRIVATE BROTHERHOOD
          </Text>
          <Text className="mt-3 font-display text-ivory text-5xl tracking-wide md:text-6xl">
            Build your life command system.
          </Text>
          <Text className="mt-5 font-body text-ivory-dim text-base leading-7 md:text-lg">
            A private, application-only brotherhood for young men who are done
            drifting and ready to build standards around body, money, time,
            relationships, business, leadership, and brotherhood.
          </Text>

          <View className="mt-8 flex-row flex-wrap gap-3">
            <Badge>Founding $25/mo</Badge>
            <Badge>90-day commitment</Badge>
            <Badge>Manual approval</Badge>
          </View>

          <View className="mt-10 gap-3 sm:flex-row">
            <Link href={'/(auth)/apply' as never} asChild>
              <Pressable className="rounded-xl bg-brass px-6 py-4 active:opacity-80">
                <Text className="text-center font-display text-charcoal text-base tracking-wider">
                  APPLY FOR A SEAT
                </Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable className="rounded-xl border border-ivory-dim/30 px-6 py-4 active:opacity-70">
                <Text className="text-center font-body text-ivory text-base">
                  Sign in
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <View className="mt-12 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5 md:mt-0 md:w-[360px]">
          <Text className="font-display text-ivory text-2xl">The standard</Text>
          <View className="mt-5 gap-4">
            <Stat n="25" label="founding seats before the room expands" />
            <Stat n="50" label="hard cap before culture is reviewed" />
            <Stat n="1-2h" label="minimum weekly commitment" />
          </View>
        </View>
      </View>

      <View className="mt-14">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          PILLARS UNDER BROTHERHOOD
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {PILLARS.map((pillar) => (
            <View
              key={pillar.id}
              className="rounded-full border border-ivory-dim/20 bg-charcoal-800 px-3 py-2"
            >
              <Text className="font-body text-ivory text-xs">{pillar.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-14">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          COUNCIL-LED
        </Text>
        <View className="mt-4 grid gap-3 md:grid-cols-4">
          {COUNCIL.map((member) => (
            <View
              key={member.name}
              className="rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-4"
            >
              <Text className="font-display text-ivory text-lg">{member.name}</Text>
              <Text className="mt-2 font-body text-ivory-dim text-xs leading-5">
                {member.domains.slice(0, 3).join(' / ')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-14 rounded-2xl border border-brass/25 bg-brass/10 p-5">
        <Text className="font-display text-ivory text-2xl">Lost is allowed.</Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          Defending weakness is not. The Round Table is for men willing to tell
          the truth, take action weekly, and let better men sharpen them.
        </Text>
        <Link href={'/(auth)/apply' as never} asChild>
          <Pressable className="rounded-xl bg-brass px-6 py-4 active:opacity-80">
            <Text className="text-center font-display text-charcoal text-base tracking-wider">
              START APPLICATION
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-full border border-brass/30 bg-brass/10 px-3 py-2">
      <Text className="font-body text-brass text-xs tracking-widest">{children}</Text>
    </View>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <View>
      <Text className="font-display text-brass text-4xl">{n}</Text>
      <Text className="mt-1 font-body text-ivory-dim text-sm leading-5">{label}</Text>
    </View>
  );
}
