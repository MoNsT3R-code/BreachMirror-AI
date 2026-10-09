import crypto from 'node:crypto';
import { buildPolicyGraph, Emit, Escalation, Mode, Route, Step, Turn } from './rag/graph';
import { CORPUS } from './rag/corpus';
import { chunkById, faqChunks } from './rag/knowledge-base';

/**
 * Policy Copilot: an agentic RAG pipeline orchestrated with LangGraph.
 *
 *   guard -> rewrite -> retrieve (BM25 + vectors, RRF) -> grade (+MMR) -> generate -> verify
 *                                                                          ^__________| (retry in strict mode)
 *   Ungrounded twice -> extractive fallback. Greetings and injection attempts
 *   short-circuit to a safe response. Questions the approved content cannot answer
 *   with confidence are never guessed at: they route to `escalate`, and the server
 *   forwards them to the Security Team (support-service.ts).
 *
 * Works fully offline (extractive, cited answers). With GEMINI_API_KEY it adds
 * Gemini embeddings, LLM query rewriting, LLM relevance grading and streamed generation.
 */

export interface PolicySource {
  id: string;
  label: string;
  sectionId?: string;
  excerpt: string;
  relevance: number;
}

export interface PolicyAnswer {
  answer: string;
  sources: PolicySource[];
  mode: Mode;
  route: Route;
  confidence: number;
  grounding: { grounded: boolean; ratio: number; checked: number };
  followUps: string[];
  trace: Array<Step & { ms: number }>;
  engine: string;
  notice?: string;
  /** Set when the question was withheld and forwarded to the Security Team. */
  escalation?: Escalation & { ticketId?: string; agentId?: string | null; status?: string };
  closestMatches?: string[];
}

const graph = buildPolicyGraph();

export const PIPELINE_NODES = ['guard', 'rewrite', 'retrieve', 'grade', 'generate', 'verify', 'extractive', 'finalize', 'respond', 'escalate'] as const;

export function corpusStats(): { chunks: number; faqs: number } {
  return { chunks: CORPUS.length, faqs: faqChunks().length };
}

/** The turns before the latest one on a thread: context for the Security Team, never sent to other users. */
export async function conversationContext(threadId: string | undefined): Promise<Turn[]> {
  if (!threadId) return [];
  const { values } = await graph.getState({ configurable: { thread_id: threadId } });
  return ((values.history ?? []) as Turn[]).slice(-4, -1);
}

export async function runPolicyGraph(question: string, options: { apiKey?: string; threadId?: string; emit?: Emit } = {}): Promise<PolicyAnswer> {
  const threadId = options.threadId ?? crypto.randomUUID();
  const config = { configurable: { thread_id: threadId, apiKey: options.apiKey, emit: options.emit } };
  const trace: Array<Step & { ms: number }> = [];

  // Nodes emit their own step events (exact ordering); here we only collect the trace.
  for await (const update of await graph.stream({ question }, { ...config, streamMode: 'updates' as const })) {
    for (const [node, value] of Object.entries(update as unknown as Record<string, { step?: Step }>)) {
      const step = value?.step ?? { node, detail: '' };
      trace.push({ node, detail: step.detail, ms: step.ms ?? 0 });
    }
  }

  const { values } = await graph.getState(config);
  const sources: PolicySource[] = (values.selected ?? []).map((item: { id: string; relevance: number }, index: number) => {
    const chunk = chunkById(item.id);
    return { id: `S${index + 1}`, label: chunk?.label ?? 'Policy', sectionId: chunk?.sectionId, excerpt: chunk?.text ?? '', relevance: Math.round(item.relevance * 100) / 100 };
  });
  const mode: Mode = values.mode ?? 'none';
  return {
    answer: values.answer ?? '',
    sources: mode === 'none' ? [] : sources,
    mode,
    route: values.route ?? 'out_of_scope',
    confidence: Math.round((values.confidence ?? 0) * 100) / 100,
    grounding: values.grounding ?? { grounded: false, ratio: 0, checked: 0 },
    followUps: values.followUps ?? [],
    trace,
    engine: values.engine || 'none',
    notice: values.notice || undefined,
    escalation: values.route === 'escalated' && values.escalation ? values.escalation : undefined,
    // Internal: the nearest (insufficient) matches, shown to the Security Team only. Stripped before responding.
    closestMatches: values.route === 'escalated' ? [...new Set((values.selected ?? []).map((item: { id: string }) => chunkById(item.id)?.label).filter(Boolean) as string[])] : undefined,
  };
}

/** Back-compatible entry point used by the JSON endpoint. */
export async function answerPolicyQuestion(question: string, apiKey?: string, threadId?: string): Promise<PolicyAnswer> {
  return runPolicyGraph(question, { apiKey, threadId });
}
