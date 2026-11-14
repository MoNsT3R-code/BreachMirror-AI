import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { test } from 'node:test';

const rules = await import('../server/security/detection-rules');
const github = await import('../server/security/github-security');

test('detection rules classify common endpoint signals', () => {
  assert.equal(rules.detectSecurityEvent('ransomware blocked by endpoint').severity, 'CRITICAL');
  assert.equal(rules.detectSecurityEvent('multiple failed login from new country').eventType, 'suspicious_login');
  assert.equal(rules.detectSecurityEvent('routine heartbeat').severity, 'LOW');
});

test('GitHub webhook signatures are verified before payload processing', () => {
  const payload = JSON.stringify({ alert_type: 'secret', state: 'open', repository: 'demo' });
  const secret = 'test-secret';
  const signature = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  assert.equal(github.verifyGithubSignature(payload, signature, secret), true);
  assert.equal(github.verifyGithubSignature(payload, `${signature}0`, secret), false);
  assert.equal(github.githubSecurityEvent('secret_scanning_alert', JSON.parse(payload)).severity, 'CRITICAL');
});
