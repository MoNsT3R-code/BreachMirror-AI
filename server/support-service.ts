import crypto from 'node:crypto';
import { getUserById, securityAgents, StoredUser } from './auth-service';
import { redactSecrets, Turn } from './rag/graph';
import { ApprovedFaq, listFaqs, PolicyReference, referenceCatalog, saveFaqs } from './rag/knowledge-base';
import { tokenize } from './rag/text';
import { appendAudit } from './security/audit-log';
import { readSecureJson, writeSecureJson } from './security/secure-store';

/**
 * Escalation & Security Support.
 *
 * Questions the Policy Copilot cannot answer from approved content become tickets
 * for the Security Team. Privacy rules enforced here, not in the UI:
 *  - employees only ever see a Security Agent ID (SEC-1234), never a name, email or profile;
 *  - agents see the requester's details, and contact details only when the employee allowed it;
 *  - every escalation, view of a requester's details, reply and approval is written to the
 *    hash-chained audit log.
 */

export type TicketStatus = 'open' | 'answered' | 'resolved';
export type TicketReason = 'not_covered' | 'low_confidence' | 'user_request';

interface TicketMessage {
  id: string;
  author: 'employee' | 'security' | 'system';
  /** Security Agent ID on Security Team messages. */
  agentId?: string;
  /** Internal: the team member who wrote it. Never leaves the server. */
  agentUserId?: string;
  kind?: 'response' | 'guidance';
  text: string;
  references?: PolicyReference[];
  at: string;
}

export interface Ticket {
  id: string;
  userId: string;
  question: string;
  reason: TicketReason;
  coverage: number;
  confidence: number;
  status: TicketStatus;
  assignedAgentUserId: string | null;
  assignedAgentId: string | null;
  /** Earlier Copilot turns in the same conversation. */
  context: Turn[];
  /** Nearest, insufficient policy matches: a starting point for the agent. */
  closestMatches: string[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  employeeSeenAt: string;
  agentSeenAt?: string;
  faqId?: string;
}

export interface KbRecommendation {
  id: string;
  question: string;
  approvedAnswer: string;
  references: PolicyReference[];
  /** Handbook section the answer most likely belongs in, or a new topic. */
  suggestedSection: string;
  /** How many escalated tickets asked essentially this question. */
  demand: number;
  ticketIds: string[];
  status: 'proposed' | 'accepted' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  decidedBy?: string;
}

interface SupportFile {
  counter: number;
  tickets: Ticket[];
}

const FILE = 'support-tickets.json';
const REC_FILE = 'kb-recommendations.json';
const MAX_OPEN_PER_EMPLOYEE = 15;
const AGENT_TEXT_MAX = 4000;
const EMPLOYEE_TEXT_MAX = 2000;

type Result<T> = { ok: true; value: T } | { ok: false; status: number; message: string };
const fail = (status: number, message: string): { ok: false; status: number; message: string } => ({ ok: false, status, message });

function load(): SupportFile {
  return readSecureJson<SupportFile>(FILE, { counter: 0, tickets: [] });
}
function save(file: SupportFile): void {
  writeSecureJson(FILE, file);
}
function loadRecs(): KbRecommendation[] {
  return readSecureJson<KbRecommendation[]>(REC_FILE, []);
}
function saveRecs(recs: KbRecommendation[]): void {
  writeSecureJson(REC_FILE, recs);
}
const now = () => new Date().toISOString();
const messageId = () => crypto.randomBytes(6).toString('hex');

function audit(event: string, user: Pick<StoredUser, 'username'> | null, reason: string): void {
  appendAudit({ event, username: user?.username, status: 'success', reason });
}

/** Jaccard similarity of the content words of two questions. */
export function questionSimilarity(a: string, b: string): number {
  const left = new Set(tokenize(a));
  const right = new Set(tokenize(b));
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  left.forEach(term => {
    if (right.has(term)) shared += 1;
  });
  return shared / (left.size + right.size - shared);
}

function clean(text: string, max: number): string | null {
  const value = redactSecrets(text.trim()).text;
  return value.length > 0 && value.length <= max ? value : null;
}

/* ------------------------------------------------------------------ assignment */

/** Least-loaded Security Team member; null when no team is configured (the ticket waits in the queue). */
function pickAgent(tickets: Ticket[]): { userId: string; agentId: string } | null {
  const agents = securityAgents();
  if (agents.length === 0) return null;
  const load = (userId: string) => tickets.filter(ticket => ticket.assignedAgentUserId === userId && ticket.status !== 'resolved').length;
  return [...agents].sort((a, b) => load(a.userId) - load(b.userId) || a.agentId.localeCompare(b.agentId))[0];
}

/* ------------------------------------------------------------------ views */

export interface EmployeeTicketView {
  id: string;
  question: string;
  status: TicketStatus;
  reason: TicketReason;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  unread: boolean;
  messages: Array<Omit<TicketMessage, 'agentUserId'>>;
}

function lastSecurityMessageAt(ticket: Ticket): string | undefined {
  return [...ticket.messages].reverse().find(message => message.author === 'security')?.at;
}

/** The only shape of a ticket an employee receives: no agent names, emails or internal ids. */
export function employeeView(ticket: Ticket): EmployeeTicketView {
  const latest = lastSecurityMessageAt(ticket);
  return {
    id: ticket.id,
    question: ticket.question,
    status: ticket.status,
    reason: ticket.reason,
    assignedAgentId: ticket.assignedAgentId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolvedAt: ticket.resolvedAt,
    unread: Boolean(latest && latest > ticket.employeeSeenAt),
    messages: ticket.messages.map(({ agentUserId: _internal, ...message }) => message),
  };
}

function requesterDetails(userId: string, lookup: (id: string) => StoredUser | undefined) {
  const user = lookup(userId);
  const profile = user?.profile;
  const shared = Boolean(profile?.shareContact);
  return {
    name: user?.name ?? 'Unknown employee',
    employeeId: profile?.employeeId || null,
    department: profile?.department || null,
    businessUnit: profile?.businessUnit || null,
    contactShared: shared,
    email: shared ? user?.email ?? null : null,
    phone: shared ? profile?.phone || null : null,
  };
}

/** Memoised user lookup for one request, so listing tickets decrypts the user store once. */
function userLookup(): (id: string) => StoredUser | undefined {
  const seen = new Map<string, StoredUser | undefined>();
  return id => {
    if (!seen.has(id)) seen.set(id, getUserById(id));
    return seen.get(id);
  };
}

function needsAttention(ticket: Ticket): boolean {
  const lastEmployee = [...ticket.messages].reverse().find(message => message.author === 'employee')?.at ?? ticket.createdAt;
  return ticket.status !== 'resolved' && (!ticket.agentSeenAt || lastEmployee > ticket.agentSeenAt);
}

function agentView(ticket: Ticket, tickets: Ticket[], viewer: { userId: string }, lookup = userLookup()) {
  const previousQueries = tickets
    .filter(other => other.userId === ticket.userId && other.id !== ticket.id)
    .map(other => ({ id: other.id, question: other.question, status: other.status, createdAt: other.createdAt, similarity: Math.round(questionSimilarity(ticket.question, other.question) * 100) / 100 }))
    .sort((a, b) => b.similarity - a.similarity || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);
  return {
    ...employeeView(ticket),
    coverage: ticket.coverage,
    confidence: ticket.confidence,
    context: ticket.context,
    closestMatches: ticket.closestMatches,
    assignedToMe: ticket.assignedAgentUserId === viewer.userId,
    needsAttention: needsAttention(ticket),
    firstResponseAt: ticket.firstResponseAt,
    faqId: ticket.faqId,
    requester: requesterDetails(ticket.userId, lookup),
    previousQueries,
  };
}

export type AgentTicketView = ReturnType<typeof agentView>;

/* ------------------------------------------------------------------ employee actions */

export interface EscalationInput {
  question: string;
  reason: TicketReason;
  coverage?: number;
  confidence?: number;
  context?: Turn[];
  closestMatches?: string[];
}

/** Creates (or, for a repeated open question, reuses) a ticket and assigns a Security Agent. */
export function createEscalation(user: StoredUser, input: EscalationInput): Result<{ ticket: EmployeeTicketView; reused: boolean }> {
  const question = clean(input.question, 500);
  if (!question) return fail(400, 'Enter the question you want the Security Team to review.');
  const file = load();
  const time = now();

  const duplicate = file.tickets.find(ticket => ticket.userId === user.id && ticket.status !== 'resolved' && questionSimilarity(ticket.question, question) >= 0.85);
  if (duplicate) {
    duplicate.messages.push({ id: messageId(), author: 'system', text: 'The employee asked this question again.', at: time });
    duplicate.updatedAt = time;
    save(file);
    audit('escalation_repeat', user, duplicate.id);
    return { ok: true, value: { ticket: employeeView(duplicate), reused: true } };
  }
  if (file.tickets.filter(ticket => ticket.userId === user.id && ticket.status !== 'resolved').length >= MAX_OPEN_PER_EMPLOYEE) {
    return fail(429, `You have ${MAX_OPEN_PER_EMPLOYEE} open requests. Please wait for the Security Team to answer them, or email maya.patel@xyz.com.`);
  }

  const agent = pickAgent(file.tickets);
  file.counter += 1;
  const ticket: Ticket = {
    id: `ESC-${String(file.counter).padStart(6, '0')}`,
    userId: user.id,
    question,
    reason: input.reason,
    coverage: input.coverage ?? 0,
    confidence: input.confidence ?? 0,
    status: 'open',
    assignedAgentUserId: agent?.userId ?? null,
    assignedAgentId: agent?.agentId ?? null,
    context: (input.context ?? []).slice(-3).map(turn => ({ q: redactSecrets(turn.q).text.slice(0, 500), a: turn.a.slice(0, 800) })),
    closestMatches: (input.closestMatches ?? []).slice(0, 4),
    messages: [
      {
        id: messageId(),
        author: 'system',
        text: input.reason === 'user_request' ? 'Submitted to the Security Team by the employee.' : input.reason === 'low_confidence' ? 'The Copilot withheld a low-confidence answer and forwarded the question.' : 'Not covered by the handbook or approved policy content. Forwarded automatically.',
        at: time,
      },
      ...(agent ? [{ id: messageId(), author: 'system' as const, text: `Assigned to Security Agent ${agent.agentId}.`, at: time }] : []),
    ],
    createdAt: time,
    updatedAt: time,
    employeeSeenAt: time,
  };
  file.tickets.push(ticket);
  save(file);
  audit('escalation_created', user, `${ticket.id}:${ticket.reason}:${ticket.assignedAgentId ?? 'queue'}`);
  return { ok: true, value: { ticket: employeeView(ticket), reused: false } };
}

export function listEmployeeTickets(userId: string): EmployeeTicketView[] {
  return load()
    .tickets.filter(ticket => ticket.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(employeeView);
}

export function openEmployeeTicket(userId: string, ticketId: string): Result<EmployeeTicketView> {
  const file = load();
  const ticket = file.tickets.find(item => item.id === ticketId && item.userId === userId);
  if (!ticket) return fail(404, 'Request not found.');
  ticket.employeeSeenAt = now();
  save(file);
  return { ok: true, value: employeeView(ticket) };
}

export function employeeReply(user: StoredUser, ticketId: string, text: string): Result<EmployeeTicketView> {
  const body = clean(text, EMPLOYEE_TEXT_MAX);
  if (!body) return fail(400, `Write a message of up to ${EMPLOYEE_TEXT_MAX} characters.`);
  const file = load();
  const ticket = file.tickets.find(item => item.id === ticketId && item.userId === user.id);
  if (!ticket) return fail(404, 'Request not found.');
  const time = now();
  if (ticket.status === 'resolved') {
    ticket.messages.push({ id: messageId(), author: 'system', text: 'Reopened by the employee.', at: time });
    ticket.resolvedAt = undefined;
  }
  ticket.messages.push({ id: messageId(), author: 'employee', text: body, at: time });
  ticket.status = 'open';
  ticket.updatedAt = time;
  ticket.employeeSeenAt = time;
  save(file);
  audit('escalation_employee_reply', user, ticket.id);
  return { ok: true, value: employeeView(ticket) };
}

/* ------------------------------------------------------------------ Security Team actions */

export function listAgentTickets(viewer: { userId: string }, status: TicketStatus | 'all' | 'mine' = 'all'): AgentTicketView[] {
  const { tickets } = load();
  const lookup = userLookup();
  return tickets
    .filter(ticket => (status === 'all' ? true : status === 'mine' ? ticket.assignedAgentUserId === viewer.userId && ticket.status !== 'resolved' : ticket.status === status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 200)
    .map(ticket => agentView(ticket, tickets, viewer, lookup));
}

/** Opening a ticket reveals the requester's details, so every open is audited. */
export function openAgentTicket(agent: StoredUser, agentId: string, ticketId: string): Result<AgentTicketView> {
  const file = load();
  const ticket = file.tickets.find(item => item.id === ticketId);
  if (!ticket) return fail(404, 'Ticket not found.');
  ticket.agentSeenAt = now();
  save(file);
  audit('escalation_viewed', agent, `${ticket.id}:${agentId}`);
  return { ok: true, value: agentView(ticket, file.tickets, { userId: agent.id }) };
}

export function claimTicket(agent: StoredUser, agentId: string, ticketId: string): Result<AgentTicketView> {
  const file = load();
  const ticket = file.tickets.find(item => item.id === ticketId);
  if (!ticket) return fail(404, 'Ticket not found.');
  if (ticket.assignedAgentUserId !== agent.id) {
    const time = now();
    ticket.assignedAgentUserId = agent.id;
    ticket.assignedAgentId = agentId;
    ticket.messages.push({ id: messageId(), author: 'system', text: `Assigned to Security Agent ${agentId}.`, at: time });
    ticket.updatedAt = time;
    save(file);
    audit('escalation_assigned', agent, `${ticket.id}:${agentId}`);
  }
  return { ok: true, value: agentView(ticket, file.tickets, { userId: agent.id }) };
}

function resolveReferences(ids: unknown): PolicyReference[] {
  if (!Array.isArray(ids)) return [];
  const catalog = new Map(referenceCatalog().map(reference => [reference.id, reference]));
  return [...new Set(ids.filter((id): id is string => typeof id === 'string'))]
    .map(id => catalog.get(id))
    .filter((reference): reference is PolicyReference => Boolean(reference))
    .slice(0, 6);
}

export interface AgentReplyInput {
  text: string;
  kind: 'response' | 'guidance';
  referenceIds?: unknown;
  resolve?: boolean;
  /** Publish the reply as an approved FAQ, so the Copilot can answer this automatically next time. */
  publishFaq?: boolean;
  faqQuestion?: string;
}

export function agentReply(agent: StoredUser, agentId: string, ticketId: string, input: AgentReplyInput): Result<AgentTicketView> {
  const text = clean(input.text, AGENT_TEXT_MAX);
  if (!text) return fail(400, `Write a reply of up to ${AGENT_TEXT_MAX} characters.`);
  const file = load();
  const ticket = file.tickets.find(item => item.id === ticketId);
  if (!ticket) return fail(404, 'Ticket not found.');
  const references = resolveReferences(input.referenceIds);
  const time = now();

  if (!ticket.assignedAgentUserId) {
    ticket.assignedAgentUserId = agent.id;
    ticket.assignedAgentId = agentId;
    ticket.messages.push({ id: messageId(), author: 'system', text: `Assigned to Security Agent ${agentId}.`, at: time });
  }
  ticket.messages.push({ id: messageId(), author: 'security', agentId, agentUserId: agent.id, kind: input.kind === 'guidance' ? 'guidance' : 'response', text, references, at: time });
  ticket.firstResponseAt ??= time;
  ticket.status = input.resolve ? 'resolved' : 'answered';
  if (input.resolve) {
    ticket.resolvedAt = time;
    ticket.messages.push({ id: messageId(), author: 'system', text: `Marked as resolved by Security Agent ${agentId}.`, at: time });
  }
  ticket.updatedAt = time;
  ticket.agentSeenAt = time;

  if (input.publishFaq) {
    const faq = createFaqRecord(agentId, input.faqQuestion?.trim() || ticket.question, text, references, ticket.id);
    ticket.faqId = faq.id;
    audit('faq_approved', agent, `${faq.id}:${ticket.id}:${agentId}`);
  }
  save(file);
  audit(input.resolve ? 'escalation_resolved' : 'escalation_reply', agent, `${ticket.id}:${agentId}:${input.kind}`);
  if (input.resolve) recordRecommendation(ticket, text, references);
  return { ok: true, value: agentView(ticket, file.tickets, { userId: agent.id }) };
}

export function resolveTicket(agent: StoredUser, agentId: string, ticketId: string): Result<AgentTicketView> {
  const file = load();
  const ticket = file.tickets.find(item => item.id === ticketId);
  if (!ticket) return fail(404, 'Ticket not found.');
  if (ticket.status !== 'resolved') {
    const time = now();
    ticket.status = 'resolved';
    ticket.resolvedAt = time;
    ticket.updatedAt = time;
    ticket.messages.push({ id: messageId(), author: 'system', text: `Marked as resolved by Security Agent ${agentId}.`, at: time });
    save(file);
    audit('escalation_resolved', agent, `${ticket.id}:${agentId}`);
    const answer = [...ticket.messages].reverse().find(message => message.author === 'security');
    if (answer) recordRecommendation(ticket, answer.text, answer.references ?? []);
  }
  return { ok: true, value: agentView(ticket, file.tickets, { userId: agent.id }) };
}

/* ------------------------------------------------------------------ approved FAQs */

function createFaqRecord(agentId: string, question: string, answer: string, references: PolicyReference[], sourceTicketId?: string): ApprovedFaq {
  const faqs = listFaqs();
  const faq: ApprovedFaq = {
    id: `FAQ-${String(faqs.length + 1).padStart(4, '0')}`,
    question: redactSecrets(question).text.slice(0, 300),
    answer: answer.slice(0, AGENT_TEXT_MAX),
    references,
    approvedBy: agentId,
    approvedAt: now(),
    sourceTicketId,
    status: 'active',
  };
  saveFaqs([...faqs, faq]);
  return faq;
}

export function createFaq(agent: StoredUser, agentId: string, input: { question: string; answer: string; referenceIds?: unknown }): Result<ApprovedFaq> {
  const question = clean(input.question, 300);
  const answer = clean(input.answer, AGENT_TEXT_MAX);
  if (!question || !answer) return fail(400, 'An FAQ needs a question (up to 300 characters) and an approved answer.');
  const faq = createFaqRecord(agentId, question, answer, resolveReferences(input.referenceIds));
  audit('faq_approved', agent, `${faq.id}:${agentId}`);
  return { ok: true, value: faq };
}

export function retireFaq(agent: StoredUser, agentId: string, faqId: string): Result<ApprovedFaq> {
  const faqs = listFaqs();
  const faq = faqs.find(item => item.id === faqId);
  if (!faq) return fail(404, 'FAQ not found.');
  faq.status = 'retired';
  saveFaqs(faqs);
  audit('faq_retired', agent, `${faq.id}:${agentId}`);
  return { ok: true, value: faq };
}

/* ------------------------------------------------------------------ handbook recommendations */

/** Learns from approved answers: similar resolved questions accumulate demand on one recommendation. */
function recordRecommendation(ticket: Ticket, answer: string, references: PolicyReference[]): void {
  const recs = loadRecs();
  const time = now();
  const match = recs.find(rec => rec.status === 'proposed' && questionSimilarity(rec.question, ticket.question) >= 0.6);
  if (match) {
    if (!match.ticketIds.includes(ticket.id)) {
      match.ticketIds.push(ticket.id);
      match.demand = match.ticketIds.length;
    }
    match.approvedAnswer = answer;
    match.references = references.length ? references : match.references;
    match.updatedAt = time;
  } else {
    recs.push({
      id: `KBR-${String(recs.length + 1).padStart(4, '0')}`,
      question: ticket.question,
      approvedAnswer: answer,
      references,
      suggestedSection: references[0]?.label ?? ticket.closestMatches[0] ?? 'New topic: not in the current handbook',
      demand: 1,
      ticketIds: [ticket.id],
      status: 'proposed',
      createdAt: time,
      updatedAt: time,
    });
  }
  saveRecs(recs);
}

export function listRecommendations(): KbRecommendation[] {
  return loadRecs().sort((a, b) => Number(a.status !== 'proposed') - Number(b.status !== 'proposed') || b.demand - a.demand || b.updatedAt.localeCompare(a.updatedAt));
}

export function decideRecommendation(agent: StoredUser, agentId: string, id: string, status: 'accepted' | 'dismissed'): Result<KbRecommendation> {
  const recs = loadRecs();
  const rec = recs.find(item => item.id === id);
  if (!rec) return fail(404, 'Recommendation not found.');
  rec.status = status;
  rec.decidedBy = agentId;
  rec.updatedAt = now();
  saveRecs(recs);
  audit('kb_recommendation_decided', agent, `${rec.id}:${status}:${agentId}`);
  return { ok: true, value: rec };
}

/* ------------------------------------------------------------------ reporting */

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const minutesBetween = (from: string, to: string) => Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / 60000));

export function supportReport() {
  const { tickets } = load();
  const byStatus = { open: 0, answered: 0, resolved: 0 } as Record<TicketStatus, number>;
  const byReason = { not_covered: 0, low_confidence: 0, user_request: 0 } as Record<TicketReason, number>;
  tickets.forEach(ticket => {
    byStatus[ticket.status] += 1;
    byReason[ticket.reason] += 1;
  });
  const days = Array.from({ length: 14 }, (_, index) => new Date(Date.now() - (13 - index) * 86_400_000).toISOString().slice(0, 10));
  return {
    total: tickets.length,
    byStatus,
    byReason,
    unassigned: tickets.filter(ticket => !ticket.assignedAgentUserId && ticket.status !== 'resolved').length,
    medianFirstResponseMinutes: median(tickets.filter(ticket => ticket.firstResponseAt).map(ticket => minutesBetween(ticket.createdAt, ticket.firstResponseAt as string))),
    medianResolutionMinutes: median(tickets.filter(ticket => ticket.resolvedAt).map(ticket => minutesBetween(ticket.createdAt, ticket.resolvedAt as string))),
    activeFaqs: listFaqs().filter(faq => faq.status === 'active').length,
    proposedRecommendations: loadRecs().filter(rec => rec.status === 'proposed').length,
    daily: days.map(day => ({ day, count: tickets.filter(ticket => ticket.createdAt.startsWith(day)).length })),
  };
}

/** Badge counts for the header. */
export function supportSummary(user: StoredUser, isAgent: boolean) {
  const { tickets } = load();
  const mine = tickets.filter(ticket => ticket.userId === user.id);
  return {
    unread: mine.filter(ticket => employeeView(ticket).unread).length,
    open: mine.filter(ticket => ticket.status !== 'resolved').length,
    agent: isAgent
      ? {
          open: tickets.filter(ticket => ticket.status === 'open').length,
          needsAttention: tickets.filter(needsAttention).length,
          assignedToMe: tickets.filter(ticket => ticket.assignedAgentUserId === user.id && ticket.status !== 'resolved').length,
        }
      : undefined,
  };
}
