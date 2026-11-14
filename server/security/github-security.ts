import crypto from 'node:crypto';
import { detectSecurityEvent } from './detection-rules';

export function verifyGithubSignature(payload: string, signature: string | null, secret: string | undefined): boolean {
  if (!signature || !secret || !signature.startsWith('sha256=')) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  return expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function githubSecurityEvent(eventName: string, payload: Record<string, unknown>) {
  const repository = typeof payload.repository === 'string' ? payload.repository : typeof payload.repository === 'object' && payload.repository !== null ? (payload.repository as { full_name?: unknown }).full_name : undefined;
  const description = [eventName, payload.alert_type, payload.state, repository].filter(value => typeof value === 'string').join(' ');
  const detected = detectSecurityEvent(description || eventName);
  return { ...detected, source: 'github', repository: typeof repository === 'string' ? repository : null, description: description.slice(0, 300) };
}

export function isAllowedGithubRepository(repository: string | null): boolean {
  const allowlist = (process.env.BM_GITHUB_REPOSITORIES ?? '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  return allowlist.length > 0 && Boolean(repository && allowlist.includes(repository.toLowerCase()));
}

export function validDeliveryTimestamp(timestamp: string | null, now = Date.now()): boolean {
  const parsed = timestamp ? Date.parse(timestamp) : Number.NaN;
  return Number.isFinite(parsed) && Math.abs(now - parsed) <= 5 * 60 * 1000;
}
