import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { test } from 'node:test';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-2fa-race-'));
process.env.BM_DATA_DIR = dir;
process.env.BM_DATA_KEY = crypto.randomBytes(32).toString('base64');

const auth = await import('../server/auth-service');
const store = await import('../server/security/secure-store');
const totp = await import('../server/security/totp');
const workerPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'two-factor-worker.ts');

const password = 'Str0ng!Passphrase';
const created = auth.createUser({
  name: 'Race Test',
  username: 'race.test',
  email: 'race.test@xyz.com',
  role: 'Threat Hunter',
  password,
  confirmPassword: password,
});
assert.equal(created.ok, true);
if (created.ok !== true) throw new Error('Unable to create race-test user');

const setup = auth.setupTwoFactor(created.user.id);
assert.equal(setup.ok, true);
if (setup.ok !== true) throw new Error('Unable to set up race-test 2FA');
const enabled = auth.enableTwoFactor(created.user.id, totp.totpCode(setup.secret));
assert.equal(enabled.ok, true);
if (enabled.ok !== true) throw new Error('Unable to enable race-test 2FA');

test('same recovery code cannot create two sessions', () => {
  const code = enabled.recoveryCodes[0];
  const attempts = [auth.authenticate('race.test', password, undefined, 'race-test', code), auth.authenticate('race.test', password, undefined, 'race-test', code)];
  assert.equal(attempts.filter(result => result.ok).length, 1);
});

test('same TOTP code cannot create two sessions in the replay window', () => {
  const freshSetup = auth.setupTwoFactor(created.user.id);
  assert.equal(freshSetup.ok, false, 'enabled account cannot start a second setup');
  const code = totp.totpCode(setup.secret);
  const attempts = [auth.authenticate('race.test', password, undefined, 'race-test', code), auth.authenticate('race.test', password, undefined, 'race-test', code)];
  assert.equal(attempts.filter(result => result.ok).length, 1);
});

test('lock failure does not create a session or consume a factor', () => {
  const lockPath = path.join(dir, '.auth-users.lock');
  fs.writeFileSync(lockPath, 'live-worker', { mode: 0o600 });
  const current = new Date();
  fs.utimesSync(lockPath, current, current);
  assert.throws(() => auth.authenticate('race.test', password, undefined, 'race-test', enabled.recoveryCodes[1]), /Timed out acquiring data lock/);
  fs.unlinkSync(lockPath);
});

function runWorker(identifier: string, code: string): Promise<{ ok: boolean }> {
  return new Promise((resolve, reject) => {
    const worker = spawn(process.execPath, ['--import', 'tsx/esm', workerPath, identifier, password, code], {
      cwd: process.cwd(),
      env: { ...process.env, BM_DATA_DIR: dir },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    let error = '';
    worker.stdout.on('data', chunk => { output += chunk; });
    worker.stderr.on('data', chunk => { error += chunk; });
    worker.once('error', reject);
    worker.once('close', exitCode => {
      if (exitCode !== 0) return reject(new Error(error || `Worker exited with ${exitCode}`));
      resolve(JSON.parse(output.trim()) as { ok: boolean });
    });
  });
}

test('separate worker processes cannot reuse the same recovery code or TOTP code', async () => {
  const workerUser = auth.createUser({
    name: 'Worker Race',
    username: 'worker.race',
    email: 'worker.race@xyz.com',
    role: 'Threat Hunter',
    password,
    confirmPassword: password,
  });
  assert.equal(workerUser.ok, true);
  if (workerUser.ok !== true) throw new Error('Unable to create worker-race user');
  const workerSetup = auth.setupTwoFactor(workerUser.user.id);
  assert.equal(workerSetup.ok, true);
  if (workerSetup.ok !== true) throw new Error('Unable to set up worker-race 2FA');
  const workerEnabled = auth.enableTwoFactor(workerUser.user.id, totp.totpCode(workerSetup.secret));
  assert.equal(workerEnabled.ok, true);
  if (workerEnabled.ok !== true) throw new Error('Unable to enable worker-race 2FA');

  const recoveryResults = await Promise.all([
    runWorker('worker.race', workerEnabled.recoveryCodes[0]),
    runWorker('worker.race', workerEnabled.recoveryCodes[0]),
  ]);
  assert.equal(recoveryResults.filter(result => result.ok).length, 1);

  const totpResults = await Promise.all([
    runWorker('worker.race', totp.totpCode(workerSetup.secret)),
    runWorker('worker.race', totp.totpCode(workerSetup.secret)),
  ]);
  assert.equal(totpResults.filter(result => result.ok).length, 1);
});
