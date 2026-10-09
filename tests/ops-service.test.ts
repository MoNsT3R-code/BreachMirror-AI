import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getHealth } from '../server/ops-service';

test('health reports online status and gemini flag', () => {
  const health = getHealth(true);
  assert.equal(health.status, 'ONLINE');
  assert.equal(health.geminiConfigured, true);
  assert.ok(health.uptime >= 0);
});
