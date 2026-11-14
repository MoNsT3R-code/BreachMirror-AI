import crypto from 'node:crypto';
import { detectSecurityEvent } from './detection-rules';

export function verifyGithubSignature(payload: string, signature: string | null, secret: string | undefined): boolean {
  if (!signature || !secret || !signature.startsWith('sha256=')) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  return expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function githubSecurityEvent(eventName: string, payload: Record<string, unknown>) {
  const description = [eventName, payload.alert_type, payload.state, payload.repository].filter(value => typeof value === 'string').join(' ');
  const detected = detectSecurityEvent(description || eventName);
  return { ...detected, source: 'github', description: description.slice(0, 300) };
}
