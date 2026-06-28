import assert from 'node:assert/strict';
import {
  FIRST_CAMPAIGN,
  LAUNCH_TIERS,
  assignPathFromDiagnostic,
  getPathById,
  LOCAL_TABLES,
  PILLARS,
} from './roundTableModel';

assert.equal(LAUNCH_TIERS[0].name, 'Member');
assert.equal(LAUNCH_TIERS[0].monthly, 25);
assert.equal(LAUNCH_TIERS[1].name, 'Command');
assert.equal(LAUNCH_TIERS[2].name, 'Council');

const bodyPath = assignPathFromDiagnostic({
  body: 5,
  money: 1,
  time: 1,
  relationships: 1,
  business: 1,
  presence: 1,
});
assert.equal(bodyPath.id, 'body-standard');

const foundation = assignPathFromDiagnostic({
  body: 0,
  money: 0,
  time: 0,
  relationships: 0,
  business: 0,
  presence: 0,
});
assert.equal(foundation.id, 'foundation-path');

assert.equal(getPathById('command-path').title, 'The Command Path');
assert.ok(PILLARS.length >= 10);
assert.ok(LOCAL_TABLES.some((table) => table.region === 'Florida'));
assert.equal(FIRST_CAMPAIGN.weeks.length, 4);

console.log('roundTableModel tests passed');
