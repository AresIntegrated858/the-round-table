import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  addCheckIn,
  addBrotherhoodRequest,
  addCouncilReviewItem,
  addLocalConnectionIntent,
  addProofPost,
  addWarRoomPost,
  addWin,
  acceptOath,
  buildBrotherCard,
  calculateCommandScore,
  calculateMonthlyRankings,
  completeMissionAction,
  completeCampaignPhase,
  createInitialOpsState,
  resolveCouncilReviewItem,
  saveSundayPlan,
  selectLocalTable,
  setSeatStatus,
  setPillarScore,
  type BrotherhoodRequest,
  type CampaignPhaseId,
  type CouncilReviewItem,
  type LocalConnectionIntent,
  type OpsState,
  type ProofPost,
  type SeatStatus,
  type SundayPlan,
  type WarRoomPost,
} from './roundTableEngine';
import type { PillarId } from './roundTableModel';

type RoundTableStore = OpsState & {
  application: {
    fullName: string;
    cityState: string;
    age: string;
    strongest: string;
    weakest: string;
    tolerating: string;
    why: string;
    status: 'draft' | 'approved' | 'rejected';
  };
  saveApplication: (application: RoundTableStore['application']) => void;
  setApplicationStatus: (status: RoundTableStore['application']['status']) => void;
  setSeatStatus: (seatStatus: SeatStatus) => void;
  acceptOath: (declaration: string) => void;
  completeCampaignPhase: (phaseId: CampaignPhaseId, proof: string) => void;
  saveSundayPlan: (plan: SundayPlan) => void;
  completeMissionAction: (actionId: string, completed: boolean) => void;
  addCheckIn: (pillar: string, body: string) => void;
  setPillarScore: (pillar: PillarId, score: number) => void;
  selectLocalTable: (region: string) => void;
  addWin: (win: string) => void;
  addWarRoomPost: (post: Pick<WarRoomPost, 'type' | 'title' | 'body'>) => void;
  addProofPost: (proof: Pick<ProofPost, 'missionId' | 'pillar' | 'title' | 'body'>) => void;
  addBrotherhoodRequest: (
    request: Pick<BrotherhoodRequest, 'category' | 'title' | 'body'>,
  ) => void;
  addLocalConnectionIntent: (
    intent: Pick<LocalConnectionIntent, 'region' | 'intent' | 'availability'>,
  ) => void;
  addCouncilReviewItem: (item: Pick<CouncilReviewItem, 'type' | 'title' | 'body'>) => void;
  resolveCouncilReviewItem: (
    itemId: string,
    status: Exclude<CouncilReviewItem['status'], 'open'>,
  ) => void;
  brotherCard: () => ReturnType<typeof buildBrotherCard>;
  rankings: () => ReturnType<typeof calculateMonthlyRankings>;
  commandScore: () => number;
  resetOps: () => void;
};

const initial = createInitialOpsState();

export const useRoundTableStore = create<RoundTableStore>()(
  persist(
    (set, get) => ({
      ...initial,
      application: {
        fullName: '',
        cityState: '',
        age: '',
        strongest: '',
        weakest: '',
        tolerating: '',
        why: '',
        status: 'draft',
      },
      saveApplication: (application) => set({ application }),
      setApplicationStatus: (status) =>
        set((state) => ({ application: { ...state.application, status } })),
      setSeatStatus: (seatStatus) => set((state) => setSeatStatus(state, seatStatus)),
      acceptOath: (declaration) => set((state) => acceptOath(state, declaration)),
      completeCampaignPhase: (phaseId, proof) =>
        set((state) => completeCampaignPhase(state, phaseId, proof)),
      saveSundayPlan: (plan) => set((state) => saveSundayPlan(state, plan)),
      completeMissionAction: (actionId, completed) =>
        set((state) => completeMissionAction(state, actionId, completed)),
      addCheckIn: (pillar, body) => set((state) => addCheckIn(state, pillar, body)),
      setPillarScore: (pillar, score) =>
        set((state) => setPillarScore(state, pillar, score)),
      selectLocalTable: (region) => set((state) => selectLocalTable(state, region)),
      addWin: (win) => set((state) => addWin(state, win)),
      addWarRoomPost: (post) => set((state) => addWarRoomPost(state, post)),
      addProofPost: (proof) => set((state) => addProofPost(state, proof)),
      addBrotherhoodRequest: (request) =>
        set((state) => addBrotherhoodRequest(state, request)),
      addLocalConnectionIntent: (intent) =>
        set((state) => addLocalConnectionIntent(state, intent)),
      addCouncilReviewItem: (item) => set((state) => addCouncilReviewItem(state, item)),
      resolveCouncilReviewItem: (itemId, status) =>
        set((state) => resolveCouncilReviewItem(state, itemId, status)),
      brotherCard: () => buildBrotherCard(get(), get().application),
      rankings: () => {
        const card = buildBrotherCard(get(), get().application);
        return calculateMonthlyRankings([
          card,
          {
            ...card,
            displayName: 'The Standard Setter',
            commandScore: Math.max(0, card.commandScore - 8),
            proofCount: Math.max(0, card.proofCount - 1),
            contributionCount: card.contributionCount + 1,
          },
          {
            ...card,
            displayName: 'The Local Builder',
            commandScore: Math.max(0, card.commandScore - 14),
            proofCount: card.proofCount,
            contributionCount: card.contributionCount + 2,
          },
        ]);
      },
      commandScore: () => calculateCommandScore(get()),
      resetOps: () => set(createInitialOpsState()),
    }),
    {
      name: 'round-table-ops-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
