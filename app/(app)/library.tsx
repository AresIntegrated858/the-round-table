import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';
import { COUNCIL, LOCAL_TABLES, PILLARS } from '@/lib/roundTableModel';

export default function PillarsAndLocalTables() {
  const { localTable, selectLocalTable } = useRoundTableStore();

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        PILLARS AND LOCAL TABLES
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        The whole man, not one niche.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        Brotherhood is the umbrella. Your path gets hard-tracked, but the room
        keeps a soft standard across every major area of life command.
      </Text>

      <View className="mt-8 flex-row flex-wrap gap-3">
        {PILLARS.map((pillar) => (
          <View
            key={pillar.id}
            className="w-full rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5 md:w-[31%]"
          >
            <Text className="font-display text-ivory text-xl">{pillar.title}</Text>
            <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
              {pillar.description}
            </Text>
            <Text className="mt-3 font-body text-brass text-xs leading-5">
              Track: {pillar.hardTrack}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-12">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          U.S. LOCAL TABLE UTILITY
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          Pick the region you want to build around first. This selection feeds
          the command score and local prompt.
        </Text>
        <View className="mt-4 gap-3">
          {LOCAL_TABLES.map((table) => {
            const selected = localTable === table.region;
            return (
              <Pressable
                key={table.region}
                onPress={() => selectLocalTable(table.region)}
                className={`rounded-2xl border p-5 ${
                  selected ? 'border-brass bg-brass/10' : 'border-ivory-dim/15 bg-charcoal-800'
                }`}
              >
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1">
                    <Text className="font-display text-ivory text-xl">{table.region}</Text>
                    <Text className="mt-1 font-body text-ivory-dim text-sm">
                      {table.label}
                    </Text>
                  </View>
                  <Text className="font-body text-brass text-xs tracking-widest">
                    {selected ? 'SELECTED' : table.status.toUpperCase()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-12">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          COUNCIL EXPERTISE
        </Text>
        <View className="mt-4 gap-3">
          {COUNCIL.map((member) => (
            <View
              key={member.name}
              className="rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5"
            >
              <Text className="font-display text-ivory text-xl">{member.name}</Text>
              <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
                {member.domains.join(' / ')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
