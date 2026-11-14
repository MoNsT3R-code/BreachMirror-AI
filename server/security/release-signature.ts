import crypto from 'node:crypto';

export function verifyReleaseSignature(payload: string | Buffer, signature: string, publicKey: string): boolean {
  try {
    return crypto.verify(null, Buffer.from(payload), publicKey, Buffer.from(signature, 'base64'));
  } catch {
    return false;
  }
}
