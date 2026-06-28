import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useRoundTableStore } from '@/lib/roundTableStore';
import { getPathById, PILLARS, type PillarId } from '@/lib/roundTableModel';

const CODE = [
  'Show up weekly.',
  'Tell the truth.',
  'Drop excuses.',
  'Respect the brotherhood.',
  'Take action before asking for status.',
  'Promote only in designated channels.',
  'Keep confidence when a brother shares something sensitive.',
];

export default function StandardsTab() {
  const { profile } = useAuth();
  const { scores, setPillarScore, wins, addWin, commandScore } = useRoundTableStore();
  const [winDraft, setWinDraft] = useState('');
  const path = profile?.transformation_path
    ? getPathById(profile.transformation_path)
    : getPathById('foundation-path');

  function submitWin() {
    addWin(winDraft);
    setWinDraft('');
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-5xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        STANDARDS
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        The oath becomes visible.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        The room allows sensitive topics, but it stays action-oriented:
        honesty, support, problem-solving, and forward movement.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          MEMBER OATH
        </Text>
        <Text className="mt-3 font-body text-ivory text-base leading-7">
          I enter The Round Table by choice. I will show up, tell the truth,
          take action, keep confidence, receive correction, and contribute to
          the room. Access is earned by conduct, not payment alone.
        </Text>
      </View>

      <View className="mt-6 gap-4 md:flex-row">
        <Score title="Hard track" value={path.title} body={path.hardMetrics.join(' / ')} />
        <Score
          title="Command score"
          value={`${commandScore()}/100`}
          body="This score updates from planning, missions, check-ins, local table selection, wins, and pillar ratings."
        />
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          PILLAR SCORECARD UTILITY
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          Soft-track every pillar. Hard-track the path that needs the most pressure.
        </Text>
        <View className="mt-5 gap-4">
          {PILLARS.map((pillar) => (
            <View key={pillar.id}>
              <View className="flex-row items-center justify-between">
                <Text className="font-body text-ivory text-sm">{pillar.title}</Text>
                <Text className="font-body text-brass text-sm">{scores[pillar.id]}/10</Text>
              </View>
              <View className="mt-2 flex-row gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <Pressable
                    key={score}
                    onPress={() => setPillarScore(pillar.id as PillarId, score)}
                    className={`h-8 flex-1 rounded-md border ${
                      scores[pillar.id] >= score && score > 0
                        ? 'border-brass bg-brass/30'
                        : 'border-ivory-dim/15'
                    }`}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          MEMBER WINS UTILITY
        </Text>
        <TextInput
          value={winDraft}
          onChangeText={setWinDraft}
          placeholder="Log a win worth showing the room."
          placeholderTextColor="#7A7466"
          className="mt-4 rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-4 font-body text-ivory"
        />
        <Pressable
          onPress={submitWin}
          className="mt-4 rounded-xl bg-brass px-5 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-sm tracking-wider">
            ADD WIN
          </Text>
        </Pressable>
        <View className="mt-4 gap-2">
          {(wins.length ? wins : ['No wins logged yet.']).map((win) => (
            <Text key={win} className="font-body text-ivory text-sm leading-6">
              - {win}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          CODE ENFORCEMENT
        </Text>
        <View className="mt-4 gap-2">
          {CODE.map((rule) => (
            <Text key={rule} className="font-body text-ivory text-sm leading-6">
              - {rule}
            </Text>
          ))}
        </View>
        <Text className="mt-4 font-body text-crimson-light text-sm">
          Consequence path: warning, then removal. Severe violations can skip warning.
        </Text>
      </View>
    </ScrollView>
  );
}

function Score({ title, value, body }: { title: string; value: string; body: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">
        {title.toUpperCase()}
      </Text>
      <Text className="mt-2 font-display text-ivory text-2xl">{value}</Text>
      <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">{body}</Text>
    </View>
  );
}
