import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';
import { FIRST_CAMPAIGN, PILLARS, WEEKLY_MISSION, type PillarId } from '@/lib/roundTableModel';
import type { CampaignPhaseId, CheckIn, ProofPost } from '@/lib/roundTableEngine';

export default function Missions() {
  const {
    campaignPhases,
    missionActions,
    proofPosts,
    checkIns,
    completeMissionAction,
    completeCampaignPhase,
    addProofPost,
    addCheckIn,
  } = useRoundTableStore();
  const [pillar, setPillar] = useState<PillarId>('body');
  const [body, setBody] = useState('');
  const [proofTitle, setProofTitle] = useState('');
  const [proofBody, setProofBody] = useState('');
  const [phaseProofs, setPhaseProofs] = useState<Record<string, string>>({});

  function submitCheckIn() {
    addCheckIn(PILLARS.find((item) => item.id === pillar)?.title ?? pillar, body);
    setBody('');
  }

  function submitProof() {
    addProofPost({
      missionId: WEEKLY_MISSION.title,
      pillar,
      title: proofTitle,
      body: proofBody,
    });
    setProofTitle('');
    setProofBody('');
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        MISSIONS
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        {FIRST_CAMPAIGN.title}
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        The first 90 days from approved applicant to active brother. Every phase
        has a gate. Every gate requires proof.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          ACTIVE MISSION
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
          CAMPAIGN MAP
        </Text>
        <View className="mt-5 gap-4">
          {FIRST_CAMPAIGN.weeks.map((week) => {
            const phaseId = week.id as CampaignPhaseId;
            const phase = campaignPhases[phaseId];
            return (
              <View
                key={week.id}
                className={`rounded-2xl border p-5 ${
                  phase.completed ? 'border-brass bg-brass/10' : 'border-ivory-dim/15 bg-charcoal'
                }`}
              >
                <Text className="font-body text-brass text-xs tracking-widest">
                  {week.window.toUpperCase()} / {phase.completed ? 'CLEARED' : 'PROOF REQUIRED'}
                </Text>
                <Text className="mt-2 font-display text-ivory text-2xl">
                  {week.title}
                </Text>
                <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
                  {week.mission}
                </Text>
                <Text className="mt-3 font-body text-brass text-xs leading-5">
                  Gate: {week.gate}
                </Text>
                <TextInput
                  value={phaseProofs[phaseId] ?? phase.proof}
                  onChangeText={(value) =>
                    setPhaseProofs((prev) => ({ ...prev, [phaseId]: value }))
                  }
                  placeholder="Write the proof that clears this gate."
                  placeholderTextColor="#7A7466"
                  className="mt-4 rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-3 font-body text-ivory"
                />
                <Pressable
                  onPress={() => completeCampaignPhase(phaseId, phaseProofs[phaseId] ?? phase.proof)}
                  className="mt-3 rounded-xl bg-brass px-5 py-3 active:opacity-80"
                >
                  <Text className="text-center font-display text-charcoal text-xs tracking-wider">
                    CLEAR PHASE
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      <View className="mt-8 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          PROOF POST
        </Text>
        <Text className="mt-2 font-display text-ivory text-2xl">
          Log proof, not vibes.
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {PILLARS.slice(0, 7).map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setPillar(option.id)}
              className={`rounded-full border px-3 py-2 ${
                pillar === option.id ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
              }`}
            >
              <Text className={pillar === option.id ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
                {option.title}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={proofTitle}
          onChangeText={setProofTitle}
          placeholder="Proof title"
          placeholderTextColor="#7A7466"
          className="mt-4 rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-3 font-body text-ivory"
        />
        <TextInput
          value={proofBody}
          onChangeText={setProofBody}
          placeholder="What did you do, and what changed?"
          placeholderTextColor="#7A7466"
          multiline
          className="mt-3 min-h-[96px] rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-4 font-body text-ivory"
        />
        <Pressable
          onPress={submitProof}
          className="mt-4 rounded-xl bg-brass px-5 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-sm tracking-wider">
            SUBMIT PROOF
          </Text>
        </Pressable>
      </View>

      <View className="mt-8 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          CHECK-IN
        </Text>
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
        {[...proofPosts, ...checkIns].slice(0, 8).map((item) => (
          <LogItem key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

function LogItem({ item }: { item: ProofPost | CheckIn }) {
  const isProof = 'status' in item;
  return (
    <View className="rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
      <Text className="font-body text-brass text-xs tracking-widest">
        {isProof ? item.status.toUpperCase() : item.pillar.toUpperCase()}
      </Text>
      <Text className="mt-2 font-body text-ivory text-sm leading-6">
        {isProof ? `${item.title}: ${item.body}` : item.body}
      </Text>
      <Text className="mt-2 font-body text-ivory-dim text-xs">
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );
}
