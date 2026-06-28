import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  addCheckIn,
  addWin,
  calculateCommandScore,
  completeMissionAction,
  createInitialOpsState,
  saveSundayPlan,
  selectLocalTable,
  setPillarScore,
  type OpsState,
  type SundayPlan,
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
  saveSundayPlan: (plan: SundayPlan) => void;
  completeMissionAction: (actionId: string, completed: boolean) => void;
  addCheckIn: (pillar: string, body: string) => void;
  setPillarScore: (pillar: PillarId, score: number) => void;
  selectLocalTable: (region: string) => void;
  addWin: (win: string) => void;
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
      saveSundayPlan: (plan) => set((state) => saveSundayPlan(state, plan)),
      completeMissionAction: (actionId, completed) =>
        set((state) => completeMissionAction(state, actionId, completed)),
      addCheckIn: (pillar, body) => set((state) => addCheckIn(state, pillar, body)),
      setPillarScore: (pillar, score) =>
        set((state) => setPillarScore(state, pillar, score)),
      selectLocalTable: (region) => set((state) => selectLocalTable(state, region)),
      addWin: (win) => set((state) => addWin(state, win)),
      commandScore: () => calculateCommandScore(get()),
      resetOps: () => set(createInitialOpsState()),
    }),
    {
      name: 'round-table-ops-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
