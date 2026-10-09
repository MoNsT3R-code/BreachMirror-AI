import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validatePassword } from '../server/auth-service';

test('accepts a strong password', () => {
  assert.equal(validatePassword('Str0ng!Passphrase'), null);
});

test('rejects short, weak and identifier-containing passwords', () => {
  assert.notEqual(validatePassword('Ab1!'), null);
  assert.notEqual(validatePassword('alllowercase1!'), null);
  assert.notEqual(validatePassword('Password123!'), null);
  assert.notEqual(validatePassword('Jsmith#2024x', 'jsmith'), null);
});
