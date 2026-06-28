import type { PillarId } from './roundTableModel';

export type SeatStatus = 'applicant' | 'initiate' | 'member' | 'command' | 'council';

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

export type OathState = {
  accepted: boolean;
  acceptedAt: string | null;
  declaration: string;
};

export type CampaignPhaseId = 'threshold' | 'foundation' | 'chosen-path' | 'standard';

export type CampaignPhaseState = {
  completed: boolean;
  completedAt: string | null;
  proof: string;
};

export type WarRoomPostType = 'win' | 'lesson' | 'ask' | 'accountability' | 'proof';

export type WarRoomPost = {
  id: string;
  type: WarRoomPostType;
  title: string;
  body: string;
  createdAt: string;
};

export type ProofPost = {
  id: string;
  missionId: string;
  pillar: PillarId;
  title: string;
  body: string;
  status: 'submitted' | 'approved' | 'rejected';
  createdAt: string;
};

export type BrotherhoodRequest = {
  id: string;
  category: 'accountability' | 'local' | 'business' | 'style' | 'fitness' | 'relationship';
  title: string;
  body: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
};

export type LocalConnectionIntent = {
  id: string;
  region: string;
  intent: string;
  availability: string;
  createdAt: string;
};

export type CouncilReviewType = 'application' | 'warning' | 'removal' | 'promotion' | 'proof';

export type CouncilReviewItem = {
  id: string;
  type: CouncilReviewType;
  title: string;
  body: string;
  status: 'open' | 'approved' | 'rejected' | 'resolved';
  createdAt: string;
  resolvedAt: string | null;
};

export type ApplicationSnapshot = {
  fullName: string;
  cityState: string;
  age: string;
  strongest: string;
  weakest: string;
  tolerating: string;
  why: string;
  status: 'draft' | 'approved' | 'rejected';
};

export type BrotherCard = {
  displayName: string;
  seatStatus: SeatStatus;
  location: string;
  age: string;
  strongest: string;
  hardProblem: string;
  commandScore: number;
  proofCount: number;
  contributionCount: number;
  localTable: string | null;
  latestWin: string;
};

export type RankingEntry = BrotherCard & {
  rank: number;
  rankingScore: number;
};

export type OpsState = {
  seatStatus: SeatStatus;
  oath: OathState;
  campaignPhases: Record<CampaignPhaseId, CampaignPhaseState>;
  sundayPlan: SundayPlan;
  missionActions: Record<string, boolean>;
  checkIns: CheckIn[];
  scores: Record<PillarId, number>;
  localTable: string | null;
  wins: string[];
  warRoomPosts: WarRoomPost[];
  proofPosts: ProofPost[];
  brotherhoodRequests: BrotherhoodRequest[];
  localConnectionIntents: LocalConnectionIntent[];
  councilReviewItems: CouncilReviewItem[];
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

const campaignPhaseIds: CampaignPhaseId[] = ['threshold', 'foundation', 'chosen-path', 'standard'];

function createId(prefix: string, currentLength: number): string {
  return `${prefix}-${Date.now()}-${currentLength}`;
}

export function createInitialOpsState(): OpsState {
  return {
    seatStatus: 'applicant',
    oath: {
      accepted: false,
      acceptedAt: null,
      declaration: '',
    },
    campaignPhases: campaignPhaseIds.reduce(
      (acc, id) => ({
        ...acc,
        [id]: {
          completed: false,
          completedAt: null,
          proof: '',
        },
      }),
      {} as Record<CampaignPhaseId, CampaignPhaseState>,
    ),
    sundayPlan: blankPlan,
    missionActions: {},
    checkIns: [],
    scores: scoreIds.reduce(
      (acc, id) => ({ ...acc, [id]: 0 }),
      {} as Record<PillarId, number>,
    ),
    localTable: null,
    wins: [],
    warRoomPosts: [],
    proofPosts: [],
    brotherhoodRequests: [],
    localConnectionIntents: [],
    councilReviewItems: [],
  };
}

export function setSeatStatus(state: OpsState, seatStatus: SeatStatus): OpsState {
  return {
    ...state,
    seatStatus,
  };
}

export function acceptOath(state: OpsState, declaration: string): OpsState {
  const trimmed = declaration.trim();
  if (!trimmed) return state;

  return {
    ...state,
    oath: {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      declaration: trimmed,
    },
  };
}

export function completeCampaignPhase(
  state: OpsState,
  phaseId: CampaignPhaseId,
  proof: string,
): OpsState {
  const trimmed = proof.trim();
  if (!trimmed) return state;

  return {
    ...state,
    campaignPhases: {
      ...state.campaignPhases,
      [phaseId]: {
        completed: true,
        completedAt: new Date().toISOString(),
        proof: trimmed,
      },
    },
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

export function addWarRoomPost(
  state: OpsState,
  post: Pick<WarRoomPost, 'type' | 'title' | 'body'>,
): OpsState {
  const title = post.title.trim();
  const body = post.body.trim();
  if (!title || !body) return state;
  const nextPost: WarRoomPost = {
    id: createId('war-room', state.warRoomPosts.length),
    type: post.type,
    title,
    body,
    createdAt: new Date().toISOString(),
  };

  return {
    ...state,
    warRoomPosts: [nextPost, ...state.warRoomPosts].slice(0, 30),
  };
}

export function addProofPost(
  state: OpsState,
  proof: Pick<ProofPost, 'missionId' | 'pillar' | 'title' | 'body'>,
): OpsState {
  const title = proof.title.trim();
  const body = proof.body.trim();
  if (!title || !body) return state;

  const nextProof: ProofPost = {
    id: createId('proof', state.proofPosts.length),
    missionId: proof.missionId,
    pillar: proof.pillar,
    title,
    body,
    status: 'submitted',
    createdAt: new Date().toISOString(),
  };
  const nextWarRoomPost: WarRoomPost = {
    id: createId('war-room-proof', state.warRoomPosts.length),
    type: 'proof',
    title,
    body,
    createdAt: nextProof.createdAt,
  };

  return {
    ...state,
    proofPosts: [nextProof, ...state.proofPosts].slice(0, 30),
    warRoomPosts: [nextWarRoomPost, ...state.warRoomPosts].slice(0, 30),
  };
}

export function addBrotherhoodRequest(
  state: OpsState,
  request: Pick<BrotherhoodRequest, 'category' | 'title' | 'body'>,
): OpsState {
  const title = request.title.trim();
  const body = request.body.trim();
  if (!title || !body) return state;
  const nextRequest: BrotherhoodRequest = {
    id: createId('request', state.brotherhoodRequests.length),
    category: request.category,
    title,
    body,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  return {
    ...state,
    brotherhoodRequests: [nextRequest, ...state.brotherhoodRequests].slice(0, 20),
  };
}

export function addLocalConnectionIntent(
  state: OpsState,
  intent: Pick<LocalConnectionIntent, 'region' | 'intent' | 'availability'>,
): OpsState {
  const region = intent.region.trim();
  const body = intent.intent.trim();
  const availability = intent.availability.trim();
  if (!region || !body || !availability) return state;

  return {
    ...state,
    localConnectionIntents: [
      {
        id: createId('local-intent', state.localConnectionIntents.length),
        region,
        intent: body,
        availability,
        createdAt: new Date().toISOString(),
      },
      ...state.localConnectionIntents,
    ].slice(0, 20),
  };
}

export function addCouncilReviewItem(
  state: OpsState,
  item: Pick<CouncilReviewItem, 'type' | 'title' | 'body'>,
): OpsState {
  const title = item.title.trim();
  const body = item.body.trim();
  if (!title || !body) return state;
  const nextItem: CouncilReviewItem = {
    id: createId('review', state.councilReviewItems.length),
    type: item.type,
    title,
    body,
    status: 'open',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };

  return {
    ...state,
    councilReviewItems: [nextItem, ...state.councilReviewItems].slice(0, 30),
  };
}

export function resolveCouncilReviewItem(
  state: OpsState,
  itemId: string,
  status: Exclude<CouncilReviewItem['status'], 'open'>,
): OpsState {
  return {
    ...state,
    councilReviewItems: state.councilReviewItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status,
            resolvedAt: new Date().toISOString(),
          }
        : item,
    ),
  };
}

export function buildBrotherCard(
  state: OpsState,
  application: ApplicationSnapshot,
): BrotherCard {
  return {
    displayName: application.fullName.trim() || 'Founding Brother',
    seatStatus: state.seatStatus,
    location: application.cityState.trim() || state.localTable || 'Location unset',
    age: application.age.trim() || 'Unset',
    strongest: application.strongest.trim() || 'Standard forming',
    hardProblem: application.weakest.trim() || application.tolerating.trim() || 'No hard problem declared',
    commandScore: calculateCommandScore(state),
    proofCount: state.proofPosts.length,
    contributionCount: state.warRoomPosts.length + state.checkIns.length + state.brotherhoodRequests.length,
    localTable: state.localTable,
    latestWin: state.wins[0] ?? 'No public win logged yet',
  };
}

export function calculateMonthlyRankings(cards: BrotherCard[]): RankingEntry[] {
  return cards
    .map((card) => ({
      ...card,
      rankingScore: card.commandScore + card.proofCount * 8 + card.contributionCount * 4,
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore)
    .map((card, index) => ({
      ...card,
      rank: index + 1,
    }));
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
  const oathPoints = state.oath.accepted ? 10 : 0;
  const campaignPoints = Object.values(state.campaignPhases).filter((phase) => phase.completed).length * 5;
  const proofPoints = Math.min(15, state.proofPosts.length * 5);
  const contributionPoints = Math.min(10, state.warRoomPosts.length * 2 + state.brotherhoodRequests.length * 3);

  return Math.min(
    100,
    planPoints +
      missionPoints +
      checkInPoints +
      scorePoints +
      localPoints +
      winPoints +
      oathPoints +
      campaignPoints +
      proofPoints +
      contributionPoints,
  );
}
