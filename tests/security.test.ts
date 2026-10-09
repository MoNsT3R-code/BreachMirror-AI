import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-sec-'));
process.env.BM_DATA_DIR = dir;
process.env.BM_DATA_KEY = crypto.randomBytes(32).toString('base64');

const store = await import('../server/security/secure-store');
const auditLog = await import('../server/security/audit-log');
const password = await import('../server/security/password');
const limits = await import('../server/security/rate-limit');

test('data files are encrypted at rest and round-trip correctly', () => {
  store.writeSecureJson('sample.json', [{ email: 'priya.nair@xyz.com', secret: 'top' }]);
  const raw = fs.readFileSync(path.join(dir, 'sample.json'), 'utf8');
  assert.ok(!raw.includes('priya.nair@xyz.com'), 'plaintext must not appear on disk');
  assert.match(raw, /"bm":"enc"/);
  assert.deepEqual(store.readSecureJson('sample.json', []), [{ email: 'priya.nair@xyz.com', secret: 'top' }]);
});

test('tampering with a data file is detected instead of silently resetting it', () => {
  store.writeSecureJson('tamper.json', { ok: true });
  const file = path.join(dir, 'tamper.json');
  const envelope = JSON.parse(fs.readFileSync(file, 'utf8'));
  const bytes = Buffer.from(envelope.ct, 'base64');
  bytes[0] ^= 0xff;
  envelope.ct = bytes.toString('base64');
  fs.writeFileSync(file, JSON.stringify(envelope));
  assert.throws(() => store.readSecureJson('tamper.json', {}), store.IntegrityError);
});

test('a file copied over another file is rejected (file name is authenticated)', () => {
  store.writeSecureJson('a.json', { who: 'a' });
  fs.copyFileSync(path.join(dir, 'a.json'), path.join(dir, 'b.json'));
  assert.throws(() => store.readSecureJson('b.json', {}), store.IntegrityError);
});

test('legacy plaintext files are migrated to encrypted storage on first read', () => {
  fs.writeFileSync(path.join(dir, 'legacy.json'), JSON.stringify([{ id: 1 }]));
  assert.deepEqual(store.readSecureJson('legacy.json', []), [{ id: 1 }]);
  assert.match(fs.readFileSync(path.join(dir, 'legacy.json'), 'utf8'), /"bm":"enc"/);
});

test('audit log is hash-chained: edits, deletions and reordering are detected', () => {
  auditLog.appendAudit({ event: 'login', username: 'qa', status: 'success' });
  auditLog.appendAudit({ event: 'logout', username: 'qa', status: 'success' });
  auditLog.appendAudit({ event: 'login', username: 'qa', status: 'failed', reason: 'invalid_credentials' });
  assert.equal(auditLog.verifyAuditChain().valid, true);

  const file = auditLog.readAudit();
  const edited = { ...file, entries: file.entries.map((entry, index) => (index === 1 ? { ...entry, username: 'someone-else' } : entry)) };
  assert.equal(auditLog.verifyAuditChain(edited).valid, false);
  assert.equal(auditLog.verifyAuditChain({ ...file, entries: [file.entries[0], file.entries[2]] }).valid, false);
  assert.equal(auditLog.verifyAuditChain({ ...file, entries: [file.entries[1], file.entries[0], file.entries[2]] }).valid, false);
});

test('passwords use peppered scrypt; legacy PBKDF2 hashes still verify and are flagged for upgrade', () => {
  const stored = password.hashPassword('Str0ng!Passphrase');
  assert.match(stored, /^scrypt\$32768\$8\$1\$/);
  assert.deepEqual(password.verifyPassword('Str0ng!Passphrase', { passwordHash: stored }), { ok: true, needsRehash: false });
  assert.equal(password.verifyPassword('wrong-Passw0rd!', { passwordHash: stored }).ok, false);

  const salt = crypto.randomBytes(16);
  const legacy = { passwordHash: crypto.pbkdf2Sync('Old!Passw0rd', salt, 1000, 64, 'sha512').toString('hex'), passwordSalt: salt.toString('hex'), passwordIterations: 1000 };
  assert.deepEqual(password.verifyPassword('Old!Passw0rd', legacy), { ok: true, needsRehash: true });
});

test('rate limiter blocks bursts and refills over time', () => {
  limits.resetRateLimits();
  const start = 1_000_000;
  for (let i = 0; i < 10; i += 1) assert.equal(limits.takeToken('login', '1.2.3.4', start).ok, true);
  const blocked = limits.takeToken('login', '1.2.3.4', start);
  assert.equal(blocked.ok, false);
  assert.equal(limits.takeToken('login', '5.6.7.8', start).ok, true, 'other clients are unaffected');
  assert.equal(limits.takeToken('login', '1.2.3.4', start + 6_100).ok, true, 'a token refills after ~6 seconds');
});
