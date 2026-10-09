import crypto from 'node:crypto';
import { keys } from './secure-store';

/**
 * Password hashing: scrypt (memory-hard) over an HMAC "pepper" of the password,
 * so a stolen user file alone is not enough to start offline guessing.
 * Stored format: scrypt$N$r$p$salt$hash (base64). Legacy PBKDF2 hashes from
 * earlier versions still verify and are upgraded on the next successful login.
 */

const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;

export interface LegacyHash {
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
}

function peppered(password: string): Buffer {
  return crypto.createHmac('sha256', keys().pepper).update(password.normalize('NFKC')).digest();
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(peppered(password), salt, KEY_LENGTH, { N, r: R, p: P, maxmem: MAX_MEMORY });
  return ['scrypt', N, R, P, salt.toString('base64'), hash.toString('base64')].join('$');
}

function equal(left: Buffer, right: Buffer): boolean {
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/** Returns whether the password matches and whether the stored hash should be upgraded. */
export function verifyPassword(password: string, stored: { passwordHash: string; passwordSalt?: string; passwordIterations?: number }): { ok: boolean; needsRehash: boolean } {
  if (stored.passwordHash.startsWith('scrypt$')) {
    const [, n, r, p, salt, hash] = stored.passwordHash.split('$');
    const expected = Buffer.from(hash, 'base64');
    const actual = crypto.scryptSync(peppered(password), Buffer.from(salt, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p), maxmem: MAX_MEMORY });
    const ok = equal(actual, expected);
    return { ok, needsRehash: ok && (Number(n) < N || Number(r) !== R || Number(p) !== P) };
  }
  if (stored.passwordSalt && stored.passwordIterations) {
    const actual = crypto.pbkdf2Sync(password, Buffer.from(stored.passwordSalt, 'hex'), stored.passwordIterations, 64, 'sha512');
    const ok = equal(actual, Buffer.from(stored.passwordHash, 'hex'));
    return { ok, needsRehash: ok };
  }
  return { ok: false, needsRehash: false };
}
