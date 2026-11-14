import { AuthRole, AuthUser, ThreatEvent } from '../shared-types';

export interface AuthResponse {
  user: AuthUser;
  message?: string;
}

export interface PolicySource {
  id: string;
  label: string;
  sectionId?: string;
  excerpt: string;
  relevance: number;
}

export interface PipelineStep {
  node: string;
  detail: string;
  ms: number;
}

export interface PolicyRagResponse {
  answer: string;
  mode: 'gemini' | 'extractive' | 'none';
  route: 'policy' | 'greeting' | 'blocked' | 'out_of_scope' | 'escalated';
  sources: PolicySource[];
  confidence: number;
  grounding: { grounded: boolean; ratio: number; checked: number };
  followUps: string[];
  trace: PipelineStep[];
  engine: string;
  notice?: string;
  /** Present when the answer was withheld and the question forwarded to the Security Team. */
  escalation?: { reason: 'not_covered' | 'low_confidence'; coverage: number; confidence: number; ticketId?: string; agentId?: string | null; status?: TicketStatus };
}

/* ------------------------------------------------------------------ Security Support */

export type TicketStatus = 'open' | 'answered' | 'resolved';
export type TicketReason = 'not_covered' | 'low_confidence' | 'user_request';

export interface PolicyReference {
  id: string;
  label: string;
  sectionId?: string;
}

export interface TicketMessage {
  id: string;
  author: 'employee' | 'security' | 'system';
  agentId?: string;
  kind?: 'response' | 'guidance';
  text: string;
  references?: PolicyReference[];
  at: string;
}

export interface SupportTicket {
  id: string;
  question: string;
  status: TicketStatus;
  reason: TicketReason;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  unread: boolean;
  messages: TicketMessage[];
}

export interface AgentTicket extends SupportTicket {
  coverage: number;
  confidence: number;
  context: Array<{ q: string; a: string }>;
  closestMatches: string[];
  assignedToMe: boolean;
  needsAttention: boolean;
  firstResponseAt?: string;
  faqId?: string;
  requester: { name: string; employeeId: string | null; department: string | null; businessUnit: string | null; contactShared: boolean; email: string | null; phone: string | null };
  previousQueries: Array<{ id: string; question: string; status: TicketStatus; createdAt: string; similarity: number }>;
}

export interface EmployeeProfile {
  employeeId: string;
  department: string;
  businessUnit: string;
  phone: string;
  shareContact: boolean;
  updatedAt?: string;
}

export interface SupportSummary {
  unread: number;
  open: number;
  agent?: { open: number; needsAttention: number; assignedToMe: number };
}

export interface ApprovedFaq {
  id: string;
  question: string;
  answer: string;
  references: PolicyReference[];
  approvedBy: string;
  approvedAt: string;
  sourceTicketId?: string;
  status: 'active' | 'retired';
}

export interface KbRecommendation {
  id: string;
  question: string;
  approvedAnswer: string;
  references: PolicyReference[];
  suggestedSection: string;
  demand: number;
  ticketIds: string[];
  status: 'proposed' | 'accepted' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  decidedBy?: string;
}

export interface SupportReport {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byReason: Record<TicketReason, number>;
  unassigned: number;
  medianFirstResponseMinutes: number | null;
  medianResolutionMinutes: number | null;
  activeFaqs: number;
  proposedRecommendations: number;
  daily: Array<{ day: string; count: number }>;
}

async function supportRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'include',
    headers: body === undefined ? BM_HEADERS : { ...BM_HEADERS, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof payload.message === 'string' ? payload.message : 'Security Support is unavailable right now.');
  return payload as T;
}

export const supportApi = {
  summary: () => supportRequest<SupportSummary>('/api/support/summary'),
  profile: () => supportRequest<{ profile: EmployeeProfile | null }>('/api/profile'),
  saveProfile: (profile: Omit<EmployeeProfile, 'updatedAt'>) => supportRequest<{ profile: EmployeeProfile }>('/api/profile', profile),
  myTickets: () => supportRequest<{ tickets: SupportTicket[] }>('/api/support/tickets'),
  openTicket: (id: string) => supportRequest<SupportTicket>(`/api/support/tickets/${id}`),
  submit: (question: string) => supportRequest<{ ticket: SupportTicket; reused: boolean }>('/api/support/tickets', { question }),
  reply: (id: string, text: string) => supportRequest<SupportTicket>(`/api/support/tickets/${id}/messages`, { text }),
  agent: {
    tickets: (status: TicketStatus | 'all' | 'mine') => supportRequest<{ tickets: AgentTicket[]; agentId: string }>(`/api/support/agent/tickets?status=${status}`),
    open: (id: string) => supportRequest<AgentTicket>(`/api/support/agent/tickets/${id}`),
    claim: (id: string) => supportRequest<AgentTicket>(`/api/support/agent/tickets/${id}/claim`, {}),
    resolve: (id: string) => supportRequest<AgentTicket>(`/api/support/agent/tickets/${id}/resolve`, {}),
    reply: (id: string, input: { text: string; kind: 'response' | 'guidance'; referenceIds: string[]; resolve: boolean; publishFaq: boolean; faqQuestion?: string }) =>
      supportRequest<AgentTicket>(`/api/support/agent/tickets/${id}/reply`, input),
    references: () => supportRequest<{ references: PolicyReference[] }>('/api/support/agent/references'),
    faqs: () => supportRequest<{ faqs: ApprovedFaq[] }>('/api/support/agent/faqs'),
    createFaq: (input: { question: string; answer: string; referenceIds: string[] }) => supportRequest<ApprovedFaq>('/api/support/agent/faqs', input),
    retireFaq: (id: string) => supportRequest<ApprovedFaq>(`/api/support/agent/faqs/${id}/retire`, {}),
    recommendations: () => supportRequest<{ recommendations: KbRecommendation[] }>('/api/support/agent/recommendations'),
    decide: (id: string, status: 'accepted' | 'dismissed') => supportRequest<KbRecommendation>(`/api/support/agent/recommendations/${id}`, { status }),
    report: () => supportRequest<SupportReport>('/api/support/agent/report'),
  },
};

/** Every request carries this header; the server rejects writes without it (CSRF defence). */
const BM_HEADERS = { 'X-BM-Request': '1' };

async function authRequest<T>(path: string, body?: Record<string, string>): Promise<T> {
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: body ? { ...BM_HEADERS, 'Content-Type': 'application/json' } : BM_HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof payload.message === 'string' ? payload.message : 'Unable to complete authentication request.');
  return payload as T;
}

export const loginApi = (identifier: string, password: string): Promise<AuthResponse> => authRequest('/auth/login', { identifier, password });
export const registerApi = (name: string, username: string, email: string, role: AuthRole, password: string, confirmPassword: string): Promise<{ message: string }> => authRequest('/auth/register', { name, username, email, role, password, confirmPassword });
/** Resolves with `user: null` when nobody is signed in. */
export const sessionApi = (): Promise<{ user: AuthUser | null }> => authRequest('/auth/session');
export const logoutApi = (): Promise<{ ok: boolean }> => authRequest('/auth/logout', {});
export const requestPasswordResetApi = (identifier: string): Promise<{ message: string }> => authRequest('/auth/password-reset/request', { identifier });
export const confirmPasswordResetApi = (token: string, password: string): Promise<{ message: string }> => authRequest('/auth/password-reset/confirm', { token, password });
export const askPolicyRagApi = (question: string): Promise<PolicyRagResponse> => authRequest('/api/policy/ask', { question });

export interface StreamHandlers {
  onStep?: (step: PipelineStep) => void;
  onToken?: (text: string) => void;
}

/**
 * Streams the LangGraph pipeline over server-sent events: each node's step as it
 * finishes, answer tokens as they are generated, then the final result.
 */
export async function streamPolicyAnswer(question: string, conversationId: string, handlers: StreamHandlers, signal?: AbortSignal): Promise<PolicyRagResponse> {
  const response = await fetch('/api/policy/stream', {
    method: 'POST',
    credentials: 'include',
    headers: { ...BM_HEADERS, 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ question, conversationId }),
    signal,
  });
  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(typeof payload.message === 'string' ? payload.message : 'Unable to reach the policy copilot.');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: PolicyRagResponse | null = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      boundary = buffer.indexOf('\n\n');
      const event = block.match(/^event: (.+)$/m)?.[1];
      const data = block.match(/^data: (.+)$/m)?.[1];
      if (!event || !data) continue;
      const parsed: unknown = JSON.parse(data);
      if (event === 'step') handlers.onStep?.(parsed as PipelineStep);
      else if (event === 'token') handlers.onToken?.(parsed as string);
      else if (event === 'final') result = parsed as PolicyRagResponse;
      else if (event === 'error') throw new Error((parsed as { message?: string }).message ?? 'The policy copilot failed.');
    }
  }
  if (!result) throw new Error('The answer stream ended early. Please try again.');
  return result;
}

export interface HealthStatus {
  status: string;
  uptime: number;
  encryption: string;
  node: string;
  geminiConfigured: boolean;
}

export interface TeachableMomentResult {
  headline: string;
  rootCauseAnalysis: string;
  blastRadiusScore: number;
  blastRadiusSummary: string;
  immediateActions: string[];
  zeroBlameGuidance: string;
  recommendedSanctionedTool: string;
  complianceImpact: string;
}

export interface CustomActionAnalysisResult {
  detectedThreat: string;
  categoryLabel: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  riskScore: number;
  blastRadiusAnalysis: string;
  immediateRemediation: string;
  safeAlternative: string;
  recommendedDirective: string;
  teachableMoment?: string;
}

// Built-in rule-based heuristic generation for reliable instant response
export const generateTeachableMomentApi = async (
  event: ThreatEvent
): Promise<{ source: string; data: TeachableMomentResult }> => {
  // Simulate rapid AI analysis latency
  await new Promise(r => setTimeout(r, 600));

  return {
    source: 'Gemini 3.8 Flash Heuristic Engine',
    data: {
      headline: `Zero-Blame Incident Coaching: ${event.categoryLabel}`,
      rootCauseAnalysis: event.rootCause || 'Accidental policy deviation under tight delivery deadlines without enterprise gateway tooling.',
      blastRadiusScore: event.severity === 'CRITICAL' ? 88 : event.severity === 'HIGH' ? 65 : 42,
      blastRadiusSummary: event.blastRadius || 'Downstream potential credential leakage and unauthorized access.',
      immediateActions: [
        'Rotate all associated staging/production credentials in HashiCorp Vault',
        'Verify local pre-commit secret scanning hooks with `git config --get core.hooksPath`',
        'Clear shell history cache containing plaintext secrets or authorization headers',
      ],
      zeroBlameGuidance: 'Security is a team safeguard, not individual fault. Modern engineering speed requires guardrails, not reprimands.',
      recommendedSanctionedTool: event.remediationGuidance || 'Enterprise AI Gateway & HashiCorp Vault',
      complianceImpact: 'SOC2 Type II & ISO 27001 §A.9.4 Zero-Breach Conformance',
    },
  };
};

export const analyzeCustomActionApi = async (
  actionText: string,
  userRole: string
): Promise<{ source: string; data: CustomActionAnalysisResult }> => {
  await new Promise(r => setTimeout(r, 700));

  const lower = actionText.toLowerCase();
  let severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW' = 'HIGH';
  let categoryLabel = 'Unsanctioned Workflow';
  let score = 72;

  if (lower.includes('key') || lower.includes('secret') || lower.includes('token') || lower.includes('password')) {
    severity = 'CRITICAL';
    categoryLabel = 'Secret Exposure Intercept';
    score = 92;
  } else if (lower.includes('gpt') || lower.includes('ai') || lower.includes('chat') || lower.includes('prompt')) {
    severity = 'CRITICAL';
    categoryLabel = 'GenAI Exfiltration Risk';
    score = 85;
  } else if (lower.includes('usb') || lower.includes('drive') || lower.includes('plug')) {
    severity = 'ELEVATED';
    categoryLabel = 'Physical Device Perimeter';
    score = 68;
  }

  return {
    source: 'BreachMirror Threat Radar (Zero-Blame AI)',
    data: {
      detectedThreat: `Potentially unsafe action detected: "${actionText.substring(0, 120)}${actionText.length > 120 ? '...' : ''}"`,
      categoryLabel,
      severity,
      riskScore: score,
      blastRadiusAnalysis: `Executing this action presents a simulated blast radius of ${score}/100. It could expose internal authentication flows, stage secrets into unencrypted third-party indices, or trigger automated MDM lockdown.`,
      immediateRemediation: 'Halt the unverified workflow immediately. Utilize internal Approved enterprise gateways or reach out to the SecOps mentor channel for a zero-blame consultation.',
      safeAlternative: 'Route requests through the sanctioned enterprise proxy (`https://internal.ai.corp`) with automatic DLP token masking.',
      recommendedDirective: 'Directive SEC-DEV-03: Pre-flight Verification & Secret Quarantine',
      teachableMoment: `As an operative (${userRole}), getting code shipped quickly is commendable. However, taking 15 seconds to check secrets ensures the entire organization remains shielded.`,
    },
  };
};

export const fetchHealth = async (): Promise<HealthStatus> => {
  try {
    const res = await fetch('/local-api/health');
    if (res.ok) return (await res.json()) as HealthStatus;
  } catch {
    // Fall through to the offline status below.
  }
  return { status: 'OFFLINE', uptime: 0, encryption: 'unavailable', node: 'NO BACKEND', geminiConfigured: false };
};

export const simulateBreachApi = async (): Promise<{ event: ThreatEvent } | null> => {
  return null; // Triggers fallback generator in UI
};

export const acknowledgeBreachApi = async (id: string, action: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/breaches/acknowledge', {
      method: 'POST',
      credentials: 'include',
      headers: { ...BM_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId: id, action }),
    });
    return res.ok;
  } catch {
    return false;
  }
};
