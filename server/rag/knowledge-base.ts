import { readSecureJson, writeSecureJson } from '../security/secure-store';
import { Chunk, CORPUS } from './corpus';
import { tokenize } from './text';

/**
 * Approved knowledge base: answers the Security Team has approved (FAQs).
 * They are searched alongside the policy text, so a question that was escalated
 * once can be answered automatically next time, with the FAQ cited as its source.
 */

export interface PolicyReference {
  /** Reference id from referenceCatalog(): a policy section id or a conduct chunk id. */
  id: string;
  label: string;
  sectionId?: string;
}

export interface ApprovedFaq {
  id: string;
  question: string;
  answer: string;
  references: PolicyReference[];
  /** Security Agent ID only (never a name). */
  approvedBy: string;
  approvedAt: string;
  sourceTicketId?: string;
  status: 'active' | 'retired';
}

const FILE = 'support-faqs.json';
const policyById = new Map<string, Chunk>(CORPUS.map(chunk => [chunk.id, chunk]));
let cache: { faqs: ApprovedFaq[]; chunks: Chunk[]; byId: Map<string, Chunk> } | null = null;

function faqChunk(faq: ApprovedFaq): Chunk {
  const terms = tokenize(`${faq.question} ${faq.question} ${faq.answer}`);
  const termCounts = new Map<string, number>();
  terms.forEach(term => termCounts.set(term, (termCounts.get(term) ?? 0) + 1));
  return { id: `faq-${faq.id}#1`, doc: 'faq', label: `Approved Security Team FAQ — ${faq.question}`, heading: faq.question, sectionId: faq.references.find(ref => ref.sectionId)?.sectionId, text: faq.answer, terms, termCounts };
}

function load() {
  if (cache) return cache;
  const faqs = readSecureJson<ApprovedFaq[]>(FILE, []);
  // One chunk per FAQ, so the question and its approved answer are always retrieved together.
  const chunks = faqs.filter(faq => faq.status === 'active').map(faq => faqChunk(faq));
  cache = { faqs, chunks, byId: new Map(chunks.map(chunk => [chunk.id, chunk])) };
  return cache;
}

export function listFaqs(): ApprovedFaq[] {
  return load().faqs;
}

export function saveFaqs(faqs: ApprovedFaq[]): void {
  writeSecureJson(FILE, faqs);
  cache = null;
}

export function faqChunks(): Chunk[] {
  return load().chunks;
}

/** Looks a chunk up in the policy corpus, then in the approved FAQs. */
export function chunkById(id: string): Chunk | undefined {
  return policyById.get(id) ?? load().byId.get(id);
}

/** Every citable policy location an agent can attach to a reply: policy sections and conduct topics. */
export function referenceCatalog(): PolicyReference[] {
  const seen = new Map<string, PolicyReference>();
  for (const chunk of CORPUS) {
    const key = chunk.sectionId ?? chunk.label;
    if (!seen.has(key)) seen.set(key, { id: chunk.sectionId ?? chunk.id.split('#')[0], label: chunk.label, sectionId: chunk.sectionId });
  }
  return [...seen.values()];
}

export function resetKnowledgeBaseCache(): void {
  cache = null;
}
