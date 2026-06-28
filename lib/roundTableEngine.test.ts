import assert from 'node:assert/strict';
import {
  addCheckIn,
  addBrotherhoodRequest,
  addCouncilReviewItem,
  addLocalConnectionIntent,
  addProofPost,
  addWarRoomPost,
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
} from './roundTableEngine';

const initial = createInitialOpsState();
assert.equal(calculateCommandScore(initial), 0);

const planned = saveSundayPlan(initial, {
  completed: 'Trained three times.',
  shortfall: 'Skipped planning.',
  primaryMission: 'Finish the Baseline Week.',
  hardTrack: 'Body',
  brotherhoodAction: 'Recognize one member.',
  accountability: 'Post Friday proof.',
});
assert.equal(planned.sundayPlan.primaryMission, 'Finish the Baseline Week.');

const mission = completeMissionAction(planned, 'post-path', true);
assert.equal(mission.missionActions['post-path'], true);

const checkedIn = addCheckIn(mission, 'Body', 'Trained and logged meals.');
assert.equal(checkedIn.checkIns.length, 1);
assert.equal(checkedIn.checkIns[0].pillar, 'Body');

const scored = setPillarScore(checkedIn, 'body', 12);
assert.equal(scored.scores.body, 10);

const local = selectLocalTable(scored, 'Florida');
assert.equal(local.localTable, 'Florida');
assert.ok(calculateCommandScore(local) > 0);

const seated = setSeatStatus(local, 'initiate');
assert.equal(seated.seatStatus, 'initiate');

const oathed = acceptOath(seated, 'I will show up and tell the truth.');
assert.equal(oathed.oath.accepted, true);
assert.match(oathed.oath.declaration, /show up/);

const campaign = completeCampaignPhase(oathed, 'threshold', 'Posted oath and baseline.');
assert.equal(campaign.campaignPhases.threshold.completed, true);
assert.match(campaign.campaignPhases.threshold.proof, /baseline/);

const proofed = addProofPost(campaign, {
  missionId: 'baseline-week',
  pillar: 'body',
  title: 'Baseline proof',
  body: 'Trained, logged meals, and posted the weakness I am done tolerating.',
});
assert.equal(proofed.proofPosts.length, 1);
assert.equal(proofed.proofPosts[0].status, 'submitted');
assert.equal(proofed.warRoomPosts[0].type, 'proof');

const posted = addWarRoomPost(proofed, {
  type: 'win',
  title: 'First clean week',
  body: 'Completed the standard without negotiating.',
});
assert.equal(posted.warRoomPosts[0].title, 'First clean week');

const requested = addBrotherhoodRequest(posted, {
  category: 'accountability',
  title: 'Need a 6am check-in brother',
  body: 'Looking for another Florida member to confirm training starts.',
});
assert.equal(requested.brotherhoodRequests[0].status, 'open');

const localIntent = addLocalConnectionIntent(requested, {
  region: 'Florida',
  intent: 'Training meetup',
  availability: 'Saturday morning',
});
assert.equal(localIntent.localConnectionIntents[0].region, 'Florida');

const reviewQueued = addCouncilReviewItem(localIntent, {
  type: 'promotion',
  title: 'Review for Member seat',
  body: 'Oath accepted and first proof submitted.',
});
assert.equal(reviewQueued.councilReviewItems[0].status, 'open');

const reviewResolved = resolveCouncilReviewItem(
  reviewQueued,
  reviewQueued.councilReviewItems[0].id,
  'approved',
);
assert.equal(reviewResolved.councilReviewItems[0].status, 'approved');

const card = buildBrotherCard(reviewResolved, {
  fullName: 'John Test',
  cityState: 'Clearwater, FL',
  age: '24',
  strongest: 'Fitness',
  weakest: 'Money',
  tolerating: 'Inconsistency',
  why: 'Needs a serious room.',
  status: 'approved',
});
assert.equal(card.seatStatus, 'initiate');
assert.equal(card.location, 'Clearwater, FL');
assert.ok(card.commandScore > 0);

const rankings = calculateMonthlyRankings([
  card,
  { ...card, displayName: 'Lower Score', commandScore: 12, proofCount: 0, contributionCount: 0 },
]);
assert.equal(rankings[0].displayName, 'John Test');
assert.equal(rankings[0].rank, 1);

console.log('roundTableEngine tests passed');
