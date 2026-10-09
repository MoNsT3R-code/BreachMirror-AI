import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SAMPLE_INPUTS, scanForSecrets } from '../src/services/secret-scanner';

test('detects each sample credential type with the right severity', () => {
  assert.equal(scanForSecrets(SAMPLE_INPUTS.AWS)[0].riskSeverity, 'CRITICAL');
  assert.match(scanForSecrets(SAMPLE_INPUTS.AWS)[0].type, /AWS/);
  assert.match(scanForSecrets(SAMPLE_INPUTS.GITHUB)[0].type, /GitHub/);
  assert.ok(scanForSecrets(SAMPLE_INPUTS.OPENAI).some(finding => /OpenAI/.test(finding.type)));
  assert.ok(scanForSecrets(SAMPLE_INPUTS.PHISHING).some(finding => /phishing/i.test(finding.type)));
});

test('falls back to a general finding for unrecognised text and returns nothing for empty input', () => {
  const findings = scanForSecrets('customer ledger export for Q3');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].riskSeverity, 'MEDIUM');
  assert.deepEqual(scanForSecrets('   '), []);
});
