import type { PillarId } from './roundTableModel';

export type SundayPlan = {
  completed: string;
  shortfall: string;
  primaryMission: string;
  hardTrack: string;
  brotherhoodAction: string;
  accountability: string;
};

export type CheckIn = {
  id: string;
  pillar: string;
  body: string;
  createdAt: string;
};

export type OpsState = {
  sundayPlan: SundayPlan;
  missionActions: Record<string, boolean>;
  checkIns: CheckIn[];
  scores: Record<PillarId, number>;
  localTable: string | null;
  wins: string[];
};

const blankPlan: SundayPlan = {
  completed: '',
  shortfall: '',
  primaryMission: '',
  hardTrack: '',
  brotherhoodAction: '',
  accountability: '',
};

const scoreIds: PillarId[] = [
  'body',
  'money',
  'style',
  'relationships',
  'time',
  'business',
  'leadership',
  'brotherhood',
  'communication',
  'mental-discipline',
  'networking',
];

export function createInitialOpsState(): OpsState {
  return {
    sundayPlan: blankPlan,
    missionActions: {},
    checkIns: [],
    scores: scoreIds.reduce(
      (acc, id) => ({ ...acc, [id]: 0 }),
      {} as Record<PillarId, number>,
    ),
    localTable: null,
    wins: [],
  };
}

export function saveSundayPlan(state: OpsState, plan: SundayPlan): OpsState {
  return {
    ...state,
    sundayPlan: {
      completed: plan.completed.trim(),
      shortfall: plan.shortfall.trim(),
      primaryMission: plan.primaryMission.trim(),
      hardTrack: plan.hardTrack.trim(),
      brotherhoodAction: plan.brotherhoodAction.trim(),
      accountability: plan.accountability.trim(),
    },
  };
}

export function completeMissionAction(
  state: OpsState,
  actionId: string,
  completed: boolean,
): OpsState {
  return {
    ...state,
    missionActions: {
      ...state.missionActions,
      [actionId]: completed,
    },
  };
}

export function addCheckIn(state: OpsState, pillar: string, body: string): OpsState {
  const trimmed = body.trim();
  if (!trimmed) return state;

  return {
    ...state,
    checkIns: [
      {
        id: `${Date.now()}-${state.checkIns.length}`,
        pillar,
        body: trimmed,
        createdAt: new Date().toISOString(),
      },
      ...state.checkIns,
    ].slice(0, 12),
  };
}

export function setPillarScore(state: OpsState, pillar: PillarId, score: number): OpsState {
  const nextScore = Math.max(0, Math.min(10, Math.round(score)));
  return {
    ...state,
    scores: {
      ...state.scores,
      [pillar]: nextScore,
    },
  };
}

export function selectLocalTable(state: OpsState, region: string): OpsState {
  return {
    ...state,
    localTable: region,
  };
}

export function addWin(state: OpsState, win: string): OpsState {
  const trimmed = win.trim();
  if (!trimmed) return state;
  return {
    ...state,
    wins: [trimmed, ...state.wins].slice(0, 10),
  };
}

export function calculateCommandScore(state: OpsState): number {
  const planFields = Object.values(state.sundayPlan).filter(Boolean).length;
  const planPoints = Math.min(20, planFields * 4);
  const missionPoints = Object.values(state.missionActions).filter(Boolean).length * 10;
  const checkInPoints = Math.min(20, state.checkIns.length * 5);
  const scoreAverage =
    Object.values(state.scores).reduce((sum, value) => sum + value, 0) /
    Object.values(state.scores).length;
  const scorePoints = Math.round(scoreAverage * 2);
  const localPoints = state.localTable ? 10 : 0;
  const winPoints = Math.min(10, state.wins.length * 5);

  return Math.min(100, planPoints + missionPoints + checkInPoints + scorePoints + localPoints + winPoints);
}
