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
import type { CampaignPhaseId, SundayPlan } from '@/lib/roundTableEngine';

export default function CommandCenter() {
  const { profile } = useAuth();
  const {
    sundayPlan,
    missionActions,
    localTable,
    wins,
    oath,
    seatStatus,
    campaignPhases,
    brotherCard,
    saveSundayPlan,
    commandScore,
  } = useRoundTableStore();
  const [draft, setDraft] = useState<SundayPlan>(sundayPlan);
  const path = profile?.transformation_path
    ? getPathById(profile.transformation_path)
    : getPathById('foundation-path');
  const score = commandScore();
  const card = brotherCard();
  const completedMissions = Object.values(missionActions).filter(Boolean).length;
  const completedPhases = Object.values(campaignPhases).filter((phase) => phase.completed).length;

  useEffect(() => {
    track('feed_viewed');
  }, []);

  function updateDraft(key: keyof SundayPlan, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        COMMAND CENTER
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        You are seated as {articleFor(seatStatus)} {seatStatus}. Payment opens the
        door. Conduct keeps the seat.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <View className="gap-4 md:flex-row">
          <Metric label="Seat" value={seatStatus.toUpperCase()} />
          <Metric label="Command score" value={`${score}/100`} />
          <Metric label="Campaign" value={`${completedPhases}/4`} />
          <Metric label="Oath" value={oath.accepted ? 'SWORN' : 'OPEN'} />
        </View>
      </View>

      <View className="mt-6 gap-4 md:flex-row">
        <Panel eyebrow="ASSIGNED PATH" title={path.title}>
          {path.promise}
        </Panel>
        <Panel eyebrow="CURRENT CAMPAIGN" title={FIRST_CAMPAIGN.title}>
          {FIRST_CAMPAIGN.subtitle}
        </Panel>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          BROTHER CARD
        </Text>
        <Text className="mt-2 font-display text-ivory text-3xl">
          {card.displayName}
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          {card.location} / {card.age} / strongest signal: {card.strongest}
        </Text>
        <Text className="mt-3 font-body text-brass text-sm leading-6">
          Hard problem: {card.hardProblem}
        </Text>
        <View className="mt-4 gap-3 md:flex-row">
          <MiniStat label="Proof" value={`${card.proofCount}`} />
          <MiniStat label="Contribution" value={`${card.contributionCount}`} />
          <MiniStat label="Local table" value={card.localTable ?? 'Unset'} />
        </View>
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          90-DAY CAMPAIGN MAP
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          Advancement requires proof.
        </Text>
        <View className="mt-5 gap-3">
          {FIRST_CAMPAIGN.weeks.map((week) => {
            const phase = campaignPhases[week.id as CampaignPhaseId];
            return (
              <View
                key={week.id}
                className={`rounded-xl border p-4 ${
                  phase.completed ? 'border-brass bg-brass/10' : 'border-ivory-dim/15 bg-charcoal'
                }`}
              >
                <Text className="font-body text-brass text-xs tracking-widest">
                  {week.window.toUpperCase()} / {phase.completed ? 'CLEARED' : 'LOCKED BY PROOF'}
                </Text>
                <Text className="mt-2 font-display text-ivory text-xl">{week.title}</Text>
                <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
                  {week.gate}
                </Text>
              </View>
            );
          })}
        </View>
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

      <View className="mt-6 gap-4 md:flex-row">
        <Panel eyebrow="ACTIVE MISSION" title={WEEKLY_MISSION.title}>
          {completedMissions}/4 actions complete. {WEEKLY_MISSION.standard}
        </Panel>
        <Panel eyebrow="LOCAL TABLE" title={localTable ?? 'Unset'}>
          First U.S. local tables are forming in {LOCAL_TABLES.slice(0, 3).map((table) => table.region).join(', ')}.
        </Panel>
        <Panel eyebrow="LATEST WIN" title={wins[0] ?? 'No win logged'}>
          Wins become public proof in the room and feed ranking momentum.
        </Panel>
      </View>
    </ScrollView>
  );
}

function articleFor(value: string) {
  return ['applicant', 'initiate'].includes(value) ? 'an' : 'a';
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
    <View className="flex-1">
      <Text className="font-body text-brass text-xs tracking-widest">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-2 font-display text-ivory text-3xl">{value}</Text>
    </View>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl border border-ivory-dim/15 bg-charcoal px-4 py-3">
      <Text className="font-body text-ivory-dim text-[10px] tracking-widest">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-1 font-display text-brass text-xl">{value}</Text>
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
