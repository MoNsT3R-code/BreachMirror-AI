import { verifyAuditChain } from './security/audit-log';
import { readSecureJson, storageInfo, writeSecureJson } from './security/secure-store';

const ACK_FILE = 'acknowledgements.json';
const MAX_ACKS = 5_000;
const startedAt = Date.now();

export interface Acknowledgement {
  incidentId: string;
  action: string;
  operator: string;
  role: string;
  timestamp: string;
}

export function getHealth(geminiConfigured: boolean) {
  const storage = storageInfo();
  let auditChain: 'intact' | 'broken' | 'unreadable' = 'intact';
  try {
    auditChain = verifyAuditChain().valid ? 'intact' : 'broken';
  } catch {
    auditChain = 'unreadable';
  }
  return {
    status: 'ONLINE',
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    encryption: storage.encryption,
    keySource: storage.keySource,
    auditChain,
    node: `${process.platform.toUpperCase()}-${process.version}`,
    geminiConfigured,
    rag: 'LangGraph hybrid retrieval (BM25 + vector, RRF, MMR)',
  };
}

export function listAcknowledgements(): Acknowledgement[] {
  const data = readSecureJson<Acknowledgement[]>(ACK_FILE, []);
  return Array.isArray(data) ? data : [];
}

export function recordAcknowledgement(entry: Acknowledgement): void {
  writeSecureJson(ACK_FILE, [...listAcknowledgements(), entry].slice(-MAX_ACKS));
}
