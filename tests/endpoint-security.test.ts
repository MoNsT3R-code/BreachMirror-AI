import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-endpoint-'));
process.env.BM_DATA_DIR = dir;
process.env.BM_DATA_KEY = crypto.randomBytes(32).toString('base64');

const security = await import('../server/security/endpoint-security');
const fingerprint = crypto.randomBytes(32).toString('hex');

test('enrollment returns a one-time secret and does not expose it in endpoint listings', () => {
  const created = security.createEnrollment('user-1', { deviceName: 'Work laptop', platform: 'Windows', version: '11', region: 'PK-PB', certFingerprint: fingerprint });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  assert.match(created.value.enrollmentToken, /^[A-Za-z0-9_-]+$/);
  assert.equal(security.listEndpoints('user-1')[0]?.id, created.value.endpointId);
  assert.equal(JSON.stringify(security.listEndpoints('user-1')).includes(created.value.enrollmentToken), false);
});

test('high-severity events create alerts and remediation requires policy acknowledgment', () => {
  const created = security.createEnrollment('user-2', { deviceName: 'Phone', platform: 'Android', version: '14', certFingerprint: fingerprint });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  const denied = security.ingestEvent(created.value.enrollmentToken, fingerprint, { endpointId: created.value.endpointId, eventType: 'malware_detected', severity: 'CRITICAL', summary: 'Unsigned executable blocked', remediationRequested: true });
  assert.equal(denied.ok, false);
  assert.equal(security.acknowledgePolicy('user-2').ok, true);
  const accepted = security.ingestEvent(created.value.enrollmentToken, fingerprint, { endpointId: created.value.endpointId, eventType: 'malware_detected', severity: 'CRITICAL', summary: 'Unsigned executable blocked', remediationRequested: true });
  assert.equal(accepted.ok, true);
  assert.equal(security.listAlerts('user-2')[0]?.metadata.region, undefined);
});
