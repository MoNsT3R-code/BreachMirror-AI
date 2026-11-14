import crypto from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(value: string): Buffer {
  let bits = 0;
  let current = 0;
  const bytes: number[] = [];
  for (const char of value.replace(/[\s=-]/g, '').toUpperCase()) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) throw new Error('Invalid TOTP secret.');
    current = (current << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((current >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

function codeFor(secret: string, counter: number): string {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac('sha1', base32Decode(secret)).update(buffer).digest();
  const offset = digest[digest.length - 1] & 15;
  const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return String(value).padStart(6, '0');
}

export function totpCode(secret: string, now = Date.now()): string {
  return codeFor(secret, Math.floor(now / 30_000));
}

export function generateSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

export function otpauthUri(secret: string, account: string, issuer = 'BreachMirror'): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

export function verifyTotp(secret: string, code: string, now = Date.now()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const counter = Math.floor(now / 30_000);
  return [-1, 0, 1].some(offset => codeFor(secret, counter + offset) === code);
}

export function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => `${crypto.randomInt(10000000, 100000000)}`);
}

export function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}
