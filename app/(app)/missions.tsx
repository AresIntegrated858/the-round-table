import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';
import { FIRST_CAMPAIGN, WEEKLY_MISSION } from '@/lib/roundTableModel';

export default function Missions() {
  const { missionActions, completeMissionAction, checkIns, addCheckIn } = useRoundTableStore();
  const [pillar, setPillar] = useState('Body');
  const [body, setBody] = useState('');

  function submitCheckIn() {
    addCheckIn(pillar, body);
    setBody('');
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-5xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        MISSIONS
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        {FIRST_CAMPAIGN.title}
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        The first 90 days from approved applicant to active brother. Curriculum
        unlocks on cadence so progress feels earned.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          ACTIVE MISSION UTILITY
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          {WEEKLY_MISSION.title}
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          {WEEKLY_MISSION.standard}
        </Text>
        <View className="mt-4 gap-3">
          {WEEKLY_MISSION.actions.map((action, index) => {
            const actionId = `mission-${index}`;
            const complete = Boolean(missionActions[actionId]);
            return (
              <Pressable
                key={action}
                onPress={() => completeMissionAction(actionId, !complete)}
                className={`rounded-xl border px-4 py-3 ${
                  complete ? 'border-brass bg-brass/20' : 'border-ivory-dim/20 bg-charcoal-800'
                }`}
              >
                <Text className={complete ? 'font-body text-brass text-sm leading-6' : 'font-body text-ivory text-sm leading-6'}>
                  {complete ? 'Complete' : 'Open'} - {action}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-8 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          CHECK-IN UTILITY
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          Log proof, not vibes.
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {['Body', 'Money', 'Time', 'Relationships', 'Business', 'Brotherhood'].map((option) => (
            <Pressable
              key={option}
              onPress={() => setPillar(option)}
              className={`rounded-full border px-3 py-2 ${
                pillar === option ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
              }`}
            >
              <Text className={pillar === option ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="What did you do? What is the next action?"
          placeholderTextColor="#7A7466"
          multiline
          className="mt-4 min-h-[96px] rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-4 font-body text-ivory"
        />
        <Pressable
          onPress={submitCheckIn}
          className="mt-4 rounded-xl bg-brass px-5 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-sm tracking-wider">
            POST CHECK-IN
          </Text>
        </Pressable>
      </View>

      <View className="mt-8 gap-4">
        {checkIns.map((checkIn) => (
          <View
            key={checkIn.id}
            className="rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5"
          >
            <Text className="font-body text-brass text-xs tracking-widest">
              {checkIn.pillar.toUpperCase()}
            </Text>
            <Text className="mt-2 font-body text-ivory text-sm leading-6">
              {checkIn.body}
            </Text>
            <Text className="mt-2 font-body text-ivory-dim text-xs">
              {new Date(checkIn.createdAt).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-8 gap-4">
        {FIRST_CAMPAIGN.weeks.map((week, index) => (
          <View
            key={week.title}
            className="rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5"
          >
            <Text className="font-body text-brass text-xs tracking-widest">
              PHASE {index + 1} - {week.window.toUpperCase()}
            </Text>
            <Text className="mt-2 font-display text-ivory text-2xl">
              {week.title}
            </Text>
            <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
              {week.mission}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
