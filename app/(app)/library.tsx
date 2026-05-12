import { ScrollView, Text, View } from 'react-native';

export default function Library() {
  return (
    <ScrollView className="flex-1 bg-charcoal" contentContainerClassName="px-6 pt-20 pb-12">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">LIBRARY</Text>
      <Text className="mt-2 font-display text-ivory text-3xl tracking-wide">
        Brotherhood Leadership
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        Six modules. Founder-authored. Available at every tier. Additional
        courses and the full video archive unlock at Knight and above.
      </Text>

      <View className="mt-8 gap-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <View
            key={n}
            className="rounded-xl border border-ivory-dim/15 bg-charcoal-50 p-4"
          >
            <Text className="font-body text-brass text-xs">MODULE {n}</Text>
            <Text className="mt-1 font-display text-ivory text-lg">
              Coming with M1
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
