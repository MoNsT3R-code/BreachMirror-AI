/** In-memory token buckets, keyed by route + client. Suitable for a single local server process. */

interface Bucket {
  tokens: number;
  updated: number;
}

const buckets = new Map<string, Bucket>();

export const LIMITS = {
  login: { capacity: 10, perMinute: 10 },
  register: { capacity: 5, perMinute: 5 },
  reset: { capacity: 5, perMinute: 3 },
  ask: { capacity: 20, perMinute: 20 },
  write: { capacity: 60, perMinute: 60 },
  support: { capacity: 30, perMinute: 30 },
} as const;

export type LimitName = keyof typeof LIMITS;

export function takeToken(name: LimitName, client: string, now = Date.now()): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const { capacity, perMinute } = LIMITS[name];
  const key = `${name}:${client}`;
  const ratePerMs = perMinute / 60_000;
  const bucket = buckets.get(key) ?? { tokens: capacity, updated: now };
  bucket.tokens = Math.min(capacity, bucket.tokens + (now - bucket.updated) * ratePerMs);
  bucket.updated = now;
  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return { ok: false, retryAfterSeconds: Math.ceil((1 - bucket.tokens) / ratePerMs / 1000) };
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  if (buckets.size > 10_000) {
    for (const [staleKey, stale] of buckets) if (now - stale.updated > 600_000) buckets.delete(staleKey);
  }
  return { ok: true };
}

export function resetRateLimits(): void {
  buckets.clear();
}
