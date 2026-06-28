import assert from 'node:assert/strict';
import {
  addCheckIn,
  calculateCommandScore,
  completeMissionAction,
  createInitialOpsState,
  saveSundayPlan,
  selectLocalTable,
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

console.log('roundTableEngine tests passed');
