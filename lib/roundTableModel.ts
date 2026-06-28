export type TierId = 'member' | 'command' | 'council';

export type LaunchTier = {
  id: TierId;
  name: string;
  monthly: number;
  tagline: string;
  unlocks: string[];
};

export const LAUNCH_TIERS: LaunchTier[] = [
  {
    id: 'member',
    name: 'Member',
    monthly: 25,
    tagline: 'The founding seat. The room, the oath, the mission.',
    unlocks: ['App access', 'Weekly missions', 'Sunday planning', 'Local tables'],
  },
  {
    id: 'command',
    name: 'Command',
    monthly: 50,
    tagline: 'Full pillar access, deeper tracking, stronger accountability.',
    unlocks: ['All pillar rooms', 'Expanded scorecard', 'All replays', 'Squads'],
  },
  {
    id: 'council',
    name: 'Council',
    monthly: 100,
    tagline: 'Advanced access for men carrying bigger responsibility.',
    unlocks: ['Council calls', 'Priority Q&A', 'Advanced rooms', 'Event priority'],
  },
];

export type PillarId =
  | 'body'
  | 'money'
  | 'style'
  | 'relationships'
  | 'time'
  | 'business'
  | 'leadership'
  | 'brotherhood'
  | 'communication'
  | 'mental-discipline'
  | 'networking';

export type Pillar = {
  id: PillarId;
  title: string;
  description: string;
  hardTrack: string;
};

export const PILLARS: Pillar[] = [
  {
    id: 'brotherhood',
    title: 'Brotherhood',
    description: 'The umbrella standard: serious men, direct accountability, real trust.',
    hardTrack: 'Weekly contribution and one brotherhood action.',
  },
  {
    id: 'body',
    title: 'Body',
    description: 'Fitness, nutrition, energy, strength, and visible self-respect.',
    hardTrack: 'Training sessions, nutrition adherence, and body baseline.',
  },
  {
    id: 'money',
    title: 'Money',
    description: 'Budgeting, earning, saving, investing basics, and financial responsibility.',
    hardTrack: 'Spending log, savings action, and money lesson completion.',
  },
  {
    id: 'style',
    title: 'Style and Presence',
    description: 'Grooming, clothing, posture, voice, and first impression.',
    hardTrack: 'Weekly presence upgrade.',
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Standards with women, family, friends, and the men around you.',
    hardTrack: 'One repair, boundary, or intentional conversation.',
  },
  {
    id: 'time',
    title: 'Time and Discipline',
    description: 'Calendar control, focus, habits, and execution rhythm.',
    hardTrack: 'Sunday plan, weekly priorities, and daily anchor.',
  },
  {
    id: 'business',
    title: 'Business and Career',
    description: 'Sales, skill building, career growth, ownership, and execution.',
    hardTrack: 'One shipped asset, offer, outreach block, or skill rep.',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Responsibility, composure, example, and the ability to move men forward.',
    hardTrack: 'One act of ownership under pressure.',
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Direct speech, listening, conflict, persuasion, and clarity.',
    hardTrack: 'One direct conversation or written argument.',
  },
  {
    id: 'mental-discipline',
    title: 'Mental Discipline',
    description: 'Values, emotional control, spiritual grounding, and self-command.',
    hardTrack: 'One reflection, reset, or discipline block.',
  },
  {
    id: 'networking',
    title: 'High-Value Networking',
    description: 'Proximity, introductions, local relationships, and high-ROI rooms.',
    hardTrack: 'One connection made or strengthened.',
  },
];

export type CouncilMember = {
  name: string;
  domains: string[];
};

export const COUNCIL: CouncilMember[] = [
  {
    name: 'John Maciel',
    domains: ['Fitness', 'Style', 'Fatherhood', 'Business ownership', 'Networking'],
  },
  {
    name: 'Manny Thompson',
    domains: ['Combat', 'Style', 'Crypto and stocks', 'Networking', 'Relationships'],
  },
  {
    name: 'Chase Grafton',
    domains: ['Fitness', 'Sales', 'Business development', 'Marriage', 'Time management'],
  },
  {
    name: 'Erik Sims',
    domains: ['Fitness', 'Business development', 'Marriage', 'Time management', 'Money'],
  },
];

export type TransformationPathId =
  | 'foundation-path'
  | 'body-standard'
  | 'command-path'
  | 'money-path'
  | 'presence-path'
  | 'relationship-path'
  | 'builder-path';

export type TransformationPath = {
  id: TransformationPathId;
  title: string;
  signal: string;
  promise: string;
  hardMetrics: string[];
};

export const TRANSFORMATION_PATHS: TransformationPath[] = [
  {
    id: 'foundation-path',
    title: 'The Foundation Path',
    signal: 'You need structure before specialization.',
    promise: 'Build consistency, basic discipline, and proof that your word means something.',
    hardMetrics: ['Sunday plan', 'Weekly check-in', 'Daily anchor', 'One completed mission'],
  },
  {
    id: 'body-standard',
    title: 'The Body Standard',
    signal: 'Your first visible weakness is energy, training, health, or self-respect.',
    promise: 'Make the body the first proof that you are done drifting.',
    hardMetrics: ['Training sessions', 'Nutrition adherence', 'Sleep baseline', 'Progress photo'],
  },
  {
    id: 'command-path',
    title: 'The Command Path',
    signal: 'Your time, focus, and execution need order.',
    promise: 'Turn scattered intention into a weekly operating rhythm.',
    hardMetrics: ['Calendar blocks', 'Deep work sessions', 'Weekly priority score', 'Sunday plan'],
  },
  {
    id: 'money-path',
    title: 'The Money Path',
    signal: 'Your money needs responsibility, tracking, and a stronger earning posture.',
    promise: 'Stop leaking cash and start building financial command.',
    hardMetrics: ['Spending log', 'Savings action', 'Income action', 'Money lesson'],
  },
  {
    id: 'presence-path',
    title: 'The Presence Path',
    signal: 'Your appearance, confidence, communication, or social competence needs attention.',
    promise: 'Become a man whose presence matches the standard he claims.',
    hardMetrics: ['Grooming upgrade', 'Outfit audit', 'Conversation rep', 'Posture or voice rep'],
  },
  {
    id: 'relationship-path',
    title: 'The Relationship Path',
    signal: 'Your relationships need standards, repair, boundaries, or stronger brotherhood.',
    promise: 'Build cleaner relationships and stop moving alone.',
    hardMetrics: ['Hard conversation', 'Boundary action', 'Brotherhood action', 'Repair action'],
  },
  {
    id: 'builder-path',
    title: 'The Builder Path',
    signal: 'Your business, career, sales, or leadership growth needs pressure.',
    promise: 'Move from consuming advice to shipping work that creates leverage.',
    hardMetrics: ['Outreach block', 'Sales rep', 'Skill rep', 'Shipped asset'],
  },
];

export type DiagnosticAnswers = {
  body: number;
  money: number;
  time: number;
  relationships: number;
  business: number;
  presence: number;
};

const diagnosticPathMap: Record<keyof DiagnosticAnswers, TransformationPathId> = {
  body: 'body-standard',
  money: 'money-path',
  time: 'command-path',
  relationships: 'relationship-path',
  business: 'builder-path',
  presence: 'presence-path',
};

export function assignPathFromDiagnostic(answers: DiagnosticAnswers): TransformationPath {
  const entries = Object.entries(answers) as Array<[keyof DiagnosticAnswers, number]>;
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [topKey, topScore] = sorted[0];

  if (topScore <= 0) {
    return getPathById('foundation-path');
  }

  return getPathById(diagnosticPathMap[topKey]);
}

export function getPathById(id: TransformationPathId): TransformationPath {
  const path = TRANSFORMATION_PATHS.find((item) => item.id === id);
  if (!path) {
    throw new Error(`Unknown transformation path: ${id}`);
  }
  return path;
}

export type LocalTable = {
  region: string;
  label: string;
  status: 'open' | 'forming';
};

export const LOCAL_TABLES: LocalTable[] = [
  { region: 'Florida', label: 'Tampa Bay / Clearwater / Orlando', status: 'forming' },
  { region: 'Virginia', label: 'Northern Virginia / Hampton Roads', status: 'forming' },
  { region: 'Texas', label: 'Dallas / Austin / Houston', status: 'forming' },
  { region: 'California', label: 'Los Angeles / Orange County / San Diego', status: 'forming' },
  { region: 'New York', label: 'NYC / Long Island / North Jersey', status: 'forming' },
  { region: 'Georgia', label: 'Atlanta', status: 'forming' },
];

export const FIRST_CAMPAIGN = {
  title: 'The First Campaign',
  subtitle: 'The first 90 days from applicant to active brother.',
  weeks: [
    {
      title: 'The Threshold',
      window: 'Days 1-7',
      mission: 'Take the oath, complete your baseline, declare standards, and post your first introduction.',
    },
    {
      title: 'The Foundation',
      window: 'Days 8-30',
      mission: 'Build Sunday planning, complete weekly missions, and prove basic consistency.',
    },
    {
      title: 'The Chosen Path',
      window: 'Days 31-60',
      mission: 'Hard-track your assigned path and bring weekly proof to the room.',
    },
    {
      title: 'The Standard',
      window: 'Days 61-90',
      mission: 'Review proof, build one local or brotherhood connection, and choose the next campaign.',
    },
  ],
};

export const WEEKLY_MISSION = {
  title: 'The Baseline Week',
  standard: 'No performance. No overtalking. Establish the truth.',
  actions: [
    'Post your current path and one weakness you are done tolerating.',
    'Complete Sunday planning before Monday morning.',
    'Log one hard-tracked action for your assigned path.',
    'Recognize one brother who took action.',
  ],
};
