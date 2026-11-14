import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { test } from 'node:test';

const { verifyReleaseSignature } = await import('../server/security/release-signature');

test('release signatures are verified with Ed25519 keys', () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
  const payload = Buffer.from('breachmirror release manifest');
  const signature = crypto.sign(null, payload, privateKey).toString('base64');
  assert.equal(verifyReleaseSignature(payload, signature, publicKey.export({ type: 'spki', format: 'pem' }).toString()), true);
  assert.equal(verifyReleaseSignature(Buffer.from('tampered'), signature, publicKey.export({ type: 'spki', format: 'pem' }).toString()), false);
});
