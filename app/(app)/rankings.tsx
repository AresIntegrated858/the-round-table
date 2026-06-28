import { ScrollView, Text, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';

export default function Rankings() {
  const { rankings, proofPosts, warRoomPosts, brotherhoodRequests, localConnectionIntents } =
    useRoundTableStore();
  const table = rankings();

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        MONTHLY TABLE RANKINGS
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        Recognition follows proof.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        Rankings are not for ego. They make consistency visible, reward
        contribution, and show the room who is carrying the standard.
      </Text>

      <View className="mt-8 gap-4 md:flex-row">
        <Metric label="Proof posts" value={`${proofPosts.length}`} />
        <Metric label="War Room posts" value={`${warRoomPosts.length}`} />
        <Metric label="Requests" value={`${brotherhoodRequests.length}`} />
        <Metric label="Local signals" value={`${localConnectionIntents.length}`} />
      </View>

      <View className="mt-8 gap-4">
        {table.map((entry) => (
          <View
            key={`${entry.rank}-${entry.displayName}`}
            className={`rounded-2xl border p-5 ${
              entry.rank === 1 ? 'border-brass bg-brass/10' : 'border-ivory-dim/15 bg-charcoal-800'
            }`}
          >
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="font-body text-brass text-xs tracking-widest">
                  RANK {entry.rank} / {entry.seatStatus.toUpperCase()}
                </Text>
                <Text className="mt-2 font-display text-ivory text-2xl">
                  {entry.displayName}
                </Text>
                <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
                  {entry.location} / {entry.strongest} / hard problem: {entry.hardProblem}
                </Text>
              </View>
              <Text className="font-display text-brass text-3xl">
                {entry.rankingScore}
              </Text>
            </View>
            <View className="mt-4 gap-3 md:flex-row">
              <Mini label="Command" value={`${entry.commandScore}/100`} />
              <Mini label="Proof" value={`${entry.proofCount}`} />
              <Mini label="Contribution" value={`${entry.contributionCount}`} />
              <Mini label="Local" value={entry.localTable ?? 'Unset'} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-2 font-display text-brass text-3xl">{value}</Text>
    </View>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl border border-ivory-dim/10 bg-charcoal px-4 py-3">
      <Text className="font-body text-ivory-dim text-[10px] tracking-widest">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-1 font-body text-ivory text-sm">{value}</Text>
    </View>
  );
}
