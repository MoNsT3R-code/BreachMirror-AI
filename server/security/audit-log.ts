import { hmac, readSecureJson, writeSecureJson } from './secure-store';

/**
 * Tamper-evident audit log. Every entry carries the HMAC of the previous entry,
 * so editing, deleting or reordering any entry breaks the chain. When old
 * entries are trimmed, the hash of the last removed entry is kept as the anchor.
 */

export interface AuditEvent {
  event: string;
  username?: string;
  status?: 'success' | 'failed';
  reason?: string;
  /** HMAC of the client IP: lets you correlate events without storing the address. */
  ipHash?: string;
}

export interface AuditEntry extends AuditEvent {
  seq: number;
  timestamp: string;
  prev: string;
  hash: string;
}

interface AuditFile {
  anchor: string;
  entries: AuditEntry[];
}

const FILE = 'auth-audit.json';
const MAX_ENTRIES = 2_000;
const GENESIS = 'genesis';

function digest(entry: Omit<AuditEntry, 'hash'>): string {
  const { seq, timestamp, prev, event, username, status, reason, ipHash } = entry;
  return hmac(JSON.stringify([seq, timestamp, prev, event, username ?? null, status ?? null, reason ?? null, ipHash ?? null]));
}

function load(): AuditFile {
  const data = readSecureJson<AuditFile | AuditEntry[]>(FILE, { anchor: GENESIS, entries: [] });
  // Older versions stored a bare array without a chain; start a fresh chain after them.
  if (Array.isArray(data)) return { anchor: GENESIS, entries: [] };
  return data;
}

export function appendAudit(event: AuditEvent): void {
  const file = load();
  const last = file.entries[file.entries.length - 1];
  const base = { ...event, seq: (last?.seq ?? 0) + 1, timestamp: new Date().toISOString(), prev: last?.hash ?? file.anchor };
  const entries = [...file.entries, { ...base, hash: digest(base) }];
  const overflow = Math.max(0, entries.length - MAX_ENTRIES);
  const anchor = overflow > 0 ? entries[overflow - 1].hash : file.anchor;
  writeSecureJson(FILE, { anchor, entries: entries.slice(overflow) });
}

export function verifyAuditChain(file: AuditFile = load()): { valid: boolean; entries: number; brokenAtSeq?: number } {
  let previous = file.anchor;
  for (const entry of file.entries) {
    const { hash, ...rest } = entry;
    if (entry.prev !== previous || digest(rest) !== hash) return { valid: false, entries: file.entries.length, brokenAtSeq: entry.seq };
    previous = hash;
  }
  return { valid: true, entries: file.entries.length };
}

export function readAudit(): AuditFile {
  return load();
}
