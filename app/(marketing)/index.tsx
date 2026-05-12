import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

/**
 * Landing splash. Logged-out users see this on app open; web users
 * arrive here from roundtable.app. Marketing site copy mirrors PDF p.3–5.
 */
export default function MarketingHome() {
  return (
    <ScrollView className="flex-1 bg-charcoal" contentContainerClassName="px-6 py-16">
      <Text className="font-display text-ivory text-4xl tracking-wide">
        The Round Table
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-base">
        A private brotherhood for men who refuse to drift.
      </Text>

      <View className="mt-12 gap-8">
        <Stat n="80%" label="of men have fewer than two people they can rely on" />
        <Stat n="20%" label="never discuss finances or goals with their friends" />
        <Stat n="60%" label="say they often lack purpose" />
      </View>

      <Text className="mt-12 font-body text-ivory text-base leading-6">
        Seven domains. Four men leading the rooms. One operating standard.
      </Text>

      <View className="mt-12 gap-3">
        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="rounded-xl bg-brass px-6 py-4 active:opacity-80">
            <Text className="text-center font-display text-charcoal text-base tracking-wider">
              SIT AT THE TABLE
            </Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="rounded-xl border border-ivory-dim/30 px-6 py-4 active:opacity-70">
            <Text className="text-center font-body text-ivory text-base">
              Already a member — sign in
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <View>
      <Text className="font-display text-brass text-5xl">{n}</Text>
      <Text className="mt-1 font-body text-ivory-dim text-sm leading-5">{label}</Text>
    </View>
  );
}
