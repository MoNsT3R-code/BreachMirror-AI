import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Encrypted, tamper-evident JSON storage for the local data files.
 *
 * - AES-256-GCM with a fresh 96-bit IV per write and the file name as
 *   additional authenticated data, so a file cannot be swapped for another.
 * - Keys come from BM_DATA_KEY (base64, 32 bytes) or, for local development,
 *   a generated key file (data/.bm-data.key, mode 0600). Sub-keys for
 *   encryption, HMAC and the password pepper are derived with HKDF.
 * - Writes are atomic (temp file + fsync + rename) and owner-only.
 * - Legacy plaintext files are read once and re-written encrypted.
 * - A file that fails authentication throws instead of being silently reset.
 */

export class IntegrityError extends Error {
  constructor(file: string) {
    super(`Data file ${file} failed its integrity check. Restore it from a backup.`);
    this.name = 'IntegrityError';
  }
}

interface Envelope {
  bm: 'enc';
  v: 1;
  iv: string;
  tag: string;
  ct: string;
}

export function dataDir(): string {
  return process.env.BM_DATA_DIR ? path.resolve(process.env.BM_DATA_DIR) : path.resolve(process.cwd(), 'data');
}

let cachedKeys: { enc: Buffer; mac: Buffer; pepper: Buffer; source: 'env' | 'keyfile' } | null = null;

function ensureDir(): void {
  fs.mkdirSync(dataDir(), { recursive: true, mode: 0o700 });
}

function masterKey(): { key: Buffer; source: 'env' | 'keyfile' } {
  const fromEnv = process.env.BM_DATA_KEY;
  if (fromEnv) {
    const key = Buffer.from(fromEnv, 'base64');
    if (key.length !== 32) throw new Error('BM_DATA_KEY must be 32 bytes, base64 encoded.');
    return { key, source: 'env' };
  }
  ensureDir();
  const keyFile = path.join(dataDir(), '.bm-data.key');
  if (!fs.existsSync(keyFile)) {
    fs.writeFileSync(keyFile, crypto.randomBytes(32).toString('base64'), { mode: 0o600 });
  }
  return { key: Buffer.from(fs.readFileSync(keyFile, 'utf8').trim(), 'base64'), source: 'keyfile' };
}

export function keys() {
  if (cachedKeys) return cachedKeys;
  const { key, source } = masterKey();
  const derive = (info: string) => Buffer.from(crypto.hkdfSync('sha256', key, Buffer.alloc(0), info, 32));
  cachedKeys = { enc: derive('bm-data-encryption-v1'), mac: derive('bm-audit-hmac-v1'), pepper: derive('bm-password-pepper-v1'), source };
  return cachedKeys;
}

/** For tests: forget derived keys after changing BM_DATA_KEY / BM_DATA_DIR. */
export function resetKeyCache(): void {
  cachedKeys = null;
}

export function hmac(value: string): string {
  return crypto.createHmac('sha256', keys().mac).update(value).digest('hex');
}

function encrypt(name: string, plaintext: string): Envelope {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keys().enc, iv);
  cipher.setAAD(Buffer.from(name));
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return { bm: 'enc', v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ct: ct.toString('base64') };
}

function decrypt(name: string, envelope: Envelope): string {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', keys().enc, Buffer.from(envelope.iv, 'base64'));
    decipher.setAAD(Buffer.from(name));
    decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(envelope.ct, 'base64')), decipher.final()]).toString('utf8');
  } catch {
    throw new IntegrityError(name);
  }
}

function isEnvelope(value: unknown): value is Envelope {
  return Boolean(value && typeof value === 'object' && (value as Envelope).bm === 'enc' && (value as Envelope).v === 1);
}

export function writeSecureJson(name: string, value: unknown): void {
  ensureDir();
  const file = path.join(dataDir(), name);
  const temporary = `${file}.${process.pid}.tmp`;
  const payload = JSON.stringify(encrypt(name, JSON.stringify(value)));
  const handle = fs.openSync(temporary, 'w', 0o600);
  try {
    fs.writeSync(handle, payload);
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
  fs.renameSync(temporary, file);
}

export function readSecureJson<T>(name: string, fallback: T): T {
  const file = path.join(dataDir(), name);
  if (!fs.existsSync(file)) return fallback;
  const raw = fs.readFileSync(file, 'utf8').trim();
  if (!raw) return fallback;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new IntegrityError(name);
  }
  if (isEnvelope(parsed)) return JSON.parse(decrypt(name, parsed)) as T;
  // Legacy plaintext file from an earlier version: migrate it to encrypted storage.
  writeSecureJson(name, parsed);
  return parsed as T;
}

export function storageInfo(): { encryption: string; keySource: 'env' | 'keyfile' } {
  return { encryption: 'AES-256-GCM (HKDF-derived keys)', keySource: keys().source };
}
