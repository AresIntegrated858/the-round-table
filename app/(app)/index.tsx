import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';
import { useRoundTableStore } from '@/lib/roundTableStore';
import {
  FIRST_CAMPAIGN,
  getPathById,
  LOCAL_TABLES,
  WEEKLY_MISSION,
} from '@/lib/roundTableModel';
import type { SundayPlan } from '@/lib/roundTableEngine';

export default function CommandCenter() {
  const { profile, tier } = useAuth();
  const {
    sundayPlan,
    missionActions,
    localTable,
    wins,
    saveSundayPlan,
    commandScore,
  } = useRoundTableStore();
  const [draft, setDraft] = useState<SundayPlan>(sundayPlan);
  const path = profile?.transformation_path
    ? getPathById(profile.transformation_path)
    : getPathById('foundation-path');
  const score = commandScore();
  const completedMissions = Object.values(missionActions).filter(Boolean).length;

  useEffect(() => {
    track('feed_viewed');
  }, []);

  function updateDraft(key: keyof SundayPlan, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-5xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        COMMAND CENTER
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        You are seated as a {tier ?? 'founding'} member. Your first job is to
        prove consistency before chasing status.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          DAILY STANDARD
        </Text>
        <Text className="mt-3 font-display text-ivory text-2xl leading-8">
          No performance. No overtalking. Establish the truth, then move.
        </Text>
        <Text className="mt-3 font-body text-ivory-dim text-xs">
          Council standard
        </Text>
      </View>

      <View className="mt-6 gap-4 md:flex-row">
        <Panel eyebrow="ASSIGNED PATH" title={path.title}>
          {path.promise}
        </Panel>
        <Panel eyebrow="CURRENT CAMPAIGN" title={FIRST_CAMPAIGN.title}>
          {FIRST_CAMPAIGN.subtitle}
        </Panel>
      </View>

      <View className="mt-6 gap-4 md:flex-row">
        <Metric label="Command score" value={`${score}/100`} />
        <Metric label="Mission proof" value={`${completedMissions}/4`} />
        <Metric label="Local table" value={localTable ?? 'Unset'} />
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          SUNDAY PLANNING UTILITY
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          Turn the week into orders.
        </Text>
        <View className="mt-5 gap-3">
          <PlanInput label="Completed last week" value={draft.completed} onChangeText={(v) => updateDraft('completed', v)} />
          <PlanInput label="Where I fell short" value={draft.shortfall} onChangeText={(v) => updateDraft('shortfall', v)} />
          <PlanInput label="Primary mission this week" value={draft.primaryMission} onChangeText={(v) => updateDraft('primaryMission', v)} />
          <PlanInput label="Hard-track pillar" value={draft.hardTrack} onChangeText={(v) => updateDraft('hardTrack', v)} />
          <PlanInput label="Brotherhood action" value={draft.brotherhoodAction} onChangeText={(v) => updateDraft('brotherhoodAction', v)} />
          <PlanInput label="Accountability by next Sunday" value={draft.accountability} onChangeText={(v) => updateDraft('accountability', v)} />
        </View>
        <Pressable
          onPress={() => saveSundayPlan(draft)}
          className="mt-5 rounded-xl bg-brass px-5 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-sm tracking-wider">
            SAVE SUNDAY PLAN
          </Text>
        </Pressable>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          ACTIVE MISSION
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          {WEEKLY_MISSION.title}
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          {WEEKLY_MISSION.standard}
        </Text>
        <View className="mt-4 gap-2">
          {WEEKLY_MISSION.actions.map((action, index) => (
            <Text key={action} className="font-body text-ivory text-sm leading-6">
              {missionActions[`mission-${index}`] ? 'Complete' : 'Open'} - {action}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          LOCAL TABLE PROMPT
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          Start local, build real.
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          First U.S. local tables are forming in {LOCAL_TABLES.slice(0, 3).map((table) => table.region).join(', ')}.
          Current selection: {localTable ?? 'none'}.
        </Text>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          RECENT MEMBER WINS
        </Text>
        <View className="mt-3 gap-2">
          {(wins.length ? wins : ['No wins logged yet. Add one in Standards.']).map((win) => (
            <Text key={win} className="font-body text-ivory text-sm leading-6">
              - {win}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">{eyebrow}</Text>
      <Text className="mt-2 font-display text-ivory text-2xl">{title}</Text>
      <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">{children}</Text>
    </View>
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

function PlanInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View>
      <Text className="mb-1 font-body text-ivory-dim text-xs tracking-widest">
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Write it plainly."
        placeholderTextColor="#7A7466"
        className="rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-3 font-body text-ivory"
      />
    </View>
  );
}
