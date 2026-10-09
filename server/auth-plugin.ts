import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { authenticate, confirmPasswordReset, createUser, ensureSecurityAgentId, getSession, isSecurityAgent, logout, publicUser, requestPasswordReset, sessionThreadId, updateProfile, type AuthRole, type StoredUser } from './auth-service';
import { answerPolicyQuestion, conversationContext, corpusStats, PolicyAnswer, runPolicyGraph } from './policy-rag-service';
import { listFaqs, referenceCatalog } from './rag/knowledge-base';
import {
  agentReply,
  claimTicket,
  createEscalation,
  createFaq,
  decideRecommendation,
  employeeReply,
  listAgentTickets,
  listEmployeeTickets,
  listRecommendations,
  openAgentTicket,
  openEmployeeTicket,
  resolveTicket,
  retireFaq,
  supportReport,
  supportSummary,
  type TicketStatus,
} from './support-service';
import { getHealth, listAcknowledgements, recordAcknowledgement } from './ops-service';
import { verifyAuditChain } from './security/audit-log';
import { LimitName, takeToken } from './security/rate-limit';
import { IntegrityError, storageInfo } from './security/secure-store';

/* ------------------------------------------------------------------ helpers */

const COOKIE_NAME = 'bm_session';
const SESSION_MAX_AGE = 1800;
const ROLES: AuthRole[] = ['Incident Commander', 'Threat Hunter', 'SOC Security Lead', 'Cloud Security Architect'];
/** Custom header the app sends on every request. Browsers cannot add it cross-site without a CORS preflight, which we never grant. */
const CSRF_HEADER = 'x-bm-request';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

type Middleware = (request: IncomingMessage, response: ServerResponse, next: () => void) => unknown;

/** Proxy headers (X-Forwarded-*) are only trusted when the app is deployed behind a known reverse proxy. */
const TRUST_PROXY = process.env.BM_TRUST_PROXY === '1';

function isHttps(request: IncomingMessage): boolean {
  return (TRUST_PROXY && request.headers['x-forwarded-proto'] === 'https') || Boolean((request.socket as { encrypted?: boolean }).encrypted);
}

function cookieOptions(request: IncomingMessage): string {
  return `HttpOnly; Path=/; SameSite=Strict${isHttps(request) ? '; Secure' : ''}`;
}

function getCookie(request: IncomingMessage): string | undefined {
  return request.headers.cookie
    ?.split(';')
    .map(value => value.trim())
    .find(value => value.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
}

function clientIp(request: IncomingMessage): string {
  if (TRUST_PROXY) {
    const forwarded = request.headers['x-forwarded-for'];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim();
    if (first) return first;
  }
  return request.socket.remoteAddress || 'unknown';
}

function userAgent(request: IncomingMessage): string {
  return String(request.headers['user-agent'] ?? '');
}

async function readBody(request: IncomingMessage): Promise<Record<string, unknown> | null> {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) return null;
  }
  try {
    const parsed: unknown = JSON.parse(body || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function text(value: unknown, max = 120): string | null {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null;
}

function send(response: ServerResponse, status: number, payload: unknown, headers: Record<string, string> = {}): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  Object.entries(headers).forEach(([key, value]) => response.setHeader(key, value));
  response.end(JSON.stringify(payload));
}

/** Rejects cross-site state changes: custom header required, and Origin / Fetch Metadata must be same-origin. */
function isSameOriginWrite(request: IncomingMessage): boolean {
  if (request.headers[CSRF_HEADER] !== '1') return false;
  const site = request.headers['sec-fetch-site'];
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

function limited(response: ServerResponse, name: LimitName, client: string): boolean {
  const result = takeToken(name, client);
  if (!('retryAfterSeconds' in result)) return false;
  send(response, 429, { message: `Too many requests. Try again in ${result.retryAfterSeconds} seconds.` }, { 'Retry-After': String(result.retryAfterSeconds) });
  return true;
}

function threadIdFor(request: IncomingMessage, conversation: unknown): string | undefined {
  const base = sessionThreadId(getCookie(request));
  if (!base) return undefined;
  const suffix = typeof conversation === 'string' && /^[a-z0-9-]{1,40}$/i.test(conversation) ? conversation : 'default';
  return `${base}:${suffix}`;
}

const ACCURACY_NOTE = 'We want to ensure the information provided is accurate and compliant with company policy.';

/**
 * Turns a withheld Copilot answer into a Security Team ticket and tells the employee
 * who will respond: only the Security Agent ID, never a name or contact detail.
 */
async function forwardEscalation(result: PolicyAnswer, user: StoredUser, question: string, threadId: string | undefined): Promise<PolicyAnswer> {
  const { closestMatches, ...answer } = result;
  if (!answer.escalation) return answer;
  const created = createEscalation(user, {
    question,
    reason: answer.escalation.reason,
    coverage: answer.escalation.coverage,
    confidence: answer.escalation.confidence,
    context: await conversationContext(threadId),
    closestMatches,
  });
  if (!('value' in created)) return { ...answer, answer: `${answer.answer}\n\n${created.message}` };
  const { ticket, reused } = created.value;
  const who = ticket.assignedAgentId ? `You will receive a response from Security Agent ID ${ticket.assignedAgentId}.` : 'A Security Agent will be assigned shortly.';
  const track = reused ? `You already have an open request for this question: ${ticket.id}.` : `Your request number is ${ticket.id}. You can follow it in Security Support.`;
  return {
    ...answer,
    answer: `${ACCURACY_NOTE} ${answer.answer}\n\n${who} ${track}`,
    escalation: { ...answer.escalation, ticketId: ticket.id, agentId: ticket.assignedAgentId, status: ticket.status },
  };
}

const TICKET_ROUTE = /^\/api\/support\/tickets\/(ESC-\d{6})(\/messages)?$/;
const AGENT_TICKET_ROUTE = /^\/api\/support\/agent\/tickets\/(ESC-\d{6})(?:\/(claim|reply|resolve))?$/;
const FAQ_ROUTE = /^\/api\/support\/agent\/faqs\/(FAQ-\d{4,})\/retire$/;
const REC_ROUTE = /^\/api\/support\/agent\/recommendations\/(KBR-\d{4,})$/;
const STATUSES: Array<TicketStatus | 'all' | 'mine'> = ['open', 'answered', 'resolved', 'all', 'mine'];

/* ------------------------------------------------------------------ routes */

export function authPlugin(geminiApiKey?: string): Plugin {
  const handler: Middleware = async (request, response, next) => {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => response.setHeader(key, value));
    if (isHttps(request)) response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    const route = (request.url ?? '').split('?')[0];
    if (!route.startsWith('/auth/') && !route.startsWith('/api/') && route !== '/local-api/health') return next();

    const ip = clientIp(request);
    const method = request.method ?? 'GET';

    if (method === 'POST' && !isSameOriginWrite(request)) return send(response, 403, { message: 'Request blocked: cross-site or missing request header.' });

    const sessionUser = (): StoredUser | null => getSession(getCookie(request), ip, userAgent(request));
    const unauthorised = () => send(response, 401, { message: 'Session expired. Please login again.' });

    try {
      if (method === 'GET' && route === '/local-api/health') return send(response, 200, getHealth(Boolean(geminiApiKey)));

      if (method === 'GET' && route === '/api/security/status') {
        if (!sessionUser()) return unauthorised();
        return send(response, 200, { storage: storageInfo(), auditChain: verifyAuditChain(), rag: { chunks: corpusStats().chunks, gemini: Boolean(geminiApiKey) } });
      }

      if (method === 'GET' && route === '/api/breaches/acknowledgements') {
        if (!sessionUser()) return unauthorised();
        return send(response, 200, { acknowledgements: listAcknowledgements().slice(-100) });
      }

      if (method === 'POST' && route === '/api/breaches/acknowledge') {
        const operator = sessionUser();
        if (!operator) return unauthorised();
        if (limited(response, 'write', ip)) return;
        const body = await readBody(request);
        const incidentId = text(body?.incidentId, 80);
        const action = text(body?.action, 40);
        if (!incidentId || !action) return send(response, 400, { message: 'Invalid acknowledgement.' });
        recordAcknowledgement({ incidentId, action, operator: operator.username, role: operator.role, timestamp: new Date().toISOString() });
        return send(response, 201, { ok: true });
      }

      if (method === 'POST' && (route === '/api/policy/ask' || route === '/api/policy/stream')) {
        const asker = sessionUser();
        if (!asker) return unauthorised();
        if (limited(response, 'ask', ip)) return;
        const body = await readBody(request);
        const question = text(body?.question, 500);
        if (!question) return send(response, 400, { message: 'Enter a question about the security policies.' });
        const threadId = threadIdFor(request, body?.conversationId);

        if (route === '/api/policy/ask') return send(response, 200, await forwardEscalation(await answerPolicyQuestion(question, geminiApiKey, threadId), asker, question, threadId));

        // Server-sent events: pipeline steps and answer tokens as they happen.
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store, no-transform');
        response.setHeader('Connection', 'keep-alive');
        response.setHeader('X-Accel-Buffering', 'no');
        let closed = false;
        request.on('close', () => {
          closed = true;
        });
        const write = (event: string, data: unknown) => {
          if (!closed) response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };
        try {
          const result = await runPolicyGraph(question, { apiKey: geminiApiKey, threadId, emit: write });
          write('final', await forwardEscalation(result, asker, question, threadId));
        } catch {
          write('error', { message: 'Unable to search the policy documents right now.' });
        }
        response.end();
        return;
      }

      /* ---------------- profile and Security Support (employees) ---------------- */

      if (route === '/api/profile' || route.startsWith('/api/support/')) {
        const user = sessionUser();
        if (!user) return unauthorised();
        if (method === 'POST' && limited(response, 'support', ip)) return;
        const body = method === 'POST' ? await readBody(request) : {};
        if (!body) return send(response, 400, { message: 'Invalid request.' });
        const agent = isSecurityAgent(user);
        const reply = <T,>(result: { ok: true; value: T } | { ok: false; status: number; message: string }, status = 200) =>
          'value' in result ? send(response, status, result.value) : send(response, result.status, { message: result.message });

        if (route === '/api/profile') {
          if (method === 'GET') return send(response, 200, { profile: user.profile ?? null });
          const result = updateProfile(user.id, {
            employeeId: typeof body.employeeId === 'string' ? body.employeeId : '',
            department: typeof body.department === 'string' ? body.department : '',
            businessUnit: typeof body.businessUnit === 'string' ? body.businessUnit : '',
            phone: typeof body.phone === 'string' ? body.phone : '',
            shareContact: body.shareContact === true,
          });
          return 'profile' in result ? send(response, 200, { profile: result.profile }) : send(response, 400, { message: result.message });
        }

        if (method === 'GET' && route === '/api/support/summary') return send(response, 200, supportSummary(user, agent));
        if (method === 'GET' && route === '/api/support/tickets') return send(response, 200, { tickets: listEmployeeTickets(user.id) });
        if (method === 'POST' && route === '/api/support/tickets') {
          const question = text(body.question, 500);
          if (!question) return send(response, 400, { message: 'Enter the question you want the Security Team to review (up to 500 characters).' });
          return reply(createEscalation(user, { question, reason: 'user_request' }), 201);
        }
        const ticketMatch = route.match(TICKET_ROUTE);
        if (ticketMatch) {
          const [, ticketId, messages] = ticketMatch;
          if (method === 'GET' && !messages) return reply(openEmployeeTicket(user.id, ticketId));
          if (method === 'POST' && messages) return reply(employeeReply(user, ticketId, typeof body.text === 'string' ? body.text : ''));
        }

        /* ---------------- Security Team console ---------------- */

        if (route.startsWith('/api/support/agent/')) {
          if (!agent) return send(response, 403, { message: 'Only Security Team members can use the console.' });
          const agentId = ensureSecurityAgentId(user.id) as string;

          if (method === 'GET' && route === '/api/support/agent/tickets') {
            const status = new URL(request.url ?? '', 'http://local').searchParams.get('status') as TicketStatus | 'all' | 'mine' | null;
            return send(response, 200, { tickets: listAgentTickets({ userId: user.id }, status && STATUSES.includes(status) ? status : 'all'), agentId });
          }
          const agentTicket = route.match(AGENT_TICKET_ROUTE);
          if (agentTicket) {
            const [, ticketId, action] = agentTicket;
            if (method === 'GET' && !action) return reply(openAgentTicket(user, agentId, ticketId));
            if (method === 'POST' && action === 'claim') return reply(claimTicket(user, agentId, ticketId));
            if (method === 'POST' && action === 'resolve') return reply(resolveTicket(user, agentId, ticketId));
            if (method === 'POST' && action === 'reply') {
              return reply(
                agentReply(user, agentId, ticketId, {
                  text: typeof body.text === 'string' ? body.text : '',
                  kind: body.kind === 'guidance' ? 'guidance' : 'response',
                  referenceIds: body.referenceIds,
                  resolve: body.resolve === true,
                  publishFaq: body.publishFaq === true,
                  faqQuestion: typeof body.faqQuestion === 'string' ? body.faqQuestion.slice(0, 300) : undefined,
                }),
              );
            }
          }
          if (method === 'GET' && route === '/api/support/agent/references') return send(response, 200, { references: referenceCatalog() });
          if (method === 'GET' && route === '/api/support/agent/faqs') return send(response, 200, { faqs: listFaqs() });
          if (method === 'POST' && route === '/api/support/agent/faqs') {
            return reply(createFaq(user, agentId, { question: typeof body.question === 'string' ? body.question : '', answer: typeof body.answer === 'string' ? body.answer : '', referenceIds: body.referenceIds }), 201);
          }
          const faqMatch = route.match(FAQ_ROUTE);
          if (method === 'POST' && faqMatch) return reply(retireFaq(user, agentId, faqMatch[1]));
          if (method === 'GET' && route === '/api/support/agent/recommendations') return send(response, 200, { recommendations: listRecommendations() });
          const recMatch = route.match(REC_ROUTE);
          if (method === 'POST' && recMatch) {
            if (body.status !== 'accepted' && body.status !== 'dismissed') return send(response, 400, { message: 'Choose accepted or dismissed.' });
            return reply(decideRecommendation(user, agentId, recMatch[1], body.status));
          }
          if (method === 'GET' && route === '/api/support/agent/report') return send(response, 200, supportReport());
        }
        return send(response, 404, { message: 'Not found.' });
      }

      if (method === 'GET' && route === '/auth/session') {
        const token = getCookie(request);
        const user = getSession(token, ip, userAgent(request));
        return user
          ? send(response, 200, { user: publicUser(user) }, { 'Set-Cookie': `${COOKIE_NAME}=${token}; Max-Age=${SESSION_MAX_AGE}; ${cookieOptions(request)}` })
          : unauthorised();
      }

      if (method === 'POST' && route === '/auth/logout') {
        logout(getCookie(request), ip);
        return send(response, 200, { ok: true }, { 'Set-Cookie': `${COOKIE_NAME}=; Max-Age=0; ${cookieOptions(request)}` });
      }

      const body = await readBody(request);
      if (!body) return send(response, 400, { message: 'Invalid request.' });

      if (method === 'POST' && route === '/auth/register') {
        if (limited(response, 'register', ip)) return;
        const name = text(body.name, 80);
        const username = text(body.username, 120);
        const email = text(body.email, 254);
        const password = typeof body.password === 'string' && body.password.length <= 64 ? body.password : null;
        const confirmPassword = typeof body.confirmPassword === 'string' && body.confirmPassword.length <= 64 ? body.confirmPassword : null;
        const role = text(body.role, 60) as AuthRole | null;
        if (!name || !username || !email || !role || !ROLES.includes(role)) return send(response, 400, { message: 'Please check the registration details.' });
        if (!password) return send(response, 400, { message: 'Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
        if (confirmPassword === null) return send(response, 400, { message: 'Passwords do not match. Please confirm your password.' });
        const result = createUser({ name, username, email, role, password, confirmPassword }, ip);
        if ('message' in result) return send(response, 400, { message: result.message });
        return send(response, 201, { message: 'Registration completed successfully.' });
      }

      if (method === 'POST' && route === '/auth/login') {
        if (limited(response, 'login', ip)) return;
        const identifier = text(body.identifier, 254);
        const password = typeof body.password === 'string' && body.password.length <= 64 ? body.password : null;
        if (!identifier || !password) return send(response, 401, { message: 'Invalid username or password.' });
        const result = authenticate(identifier, password, ip, userAgent(request));
        if ('message' in result) return send(response, result.message.startsWith('Account temporarily locked') ? 423 : 401, { message: result.message });
        return send(response, 200, { message: 'Login successful.', user: publicUser(result.user) }, { 'Set-Cookie': `${COOKIE_NAME}=${result.token}; Max-Age=${SESSION_MAX_AGE}; ${cookieOptions(request)}` });
      }

      if (method === 'POST' && route === '/auth/password-reset/request') {
        if (limited(response, 'reset', ip)) return;
        const identifier = text(body.identifier, 254);
        if (identifier) requestPasswordReset(identifier, ip);
        return send(response, 200, { message: 'If an account matches, reset instructions have been issued.' });
      }

      if (method === 'POST' && route === '/auth/password-reset/confirm') {
        if (limited(response, 'reset', ip)) return;
        const token = text(body.token, 200);
        const password = typeof body.password === 'string' && body.password.length <= 64 ? body.password : null;
        if (!token || !password || !confirmPasswordReset(token, password, ip)) return send(response, 400, { message: 'Unable to reset the password.' });
        return send(response, 200, { message: 'Password reset complete. You can now sign in.' });
      }

      return send(response, 404, { message: 'Not found.' });
    } catch (error) {
      // Never leak internals. Integrity failures are reported distinctly so an operator can restore from backup.
      if (error instanceof IntegrityError) return send(response, 503, { message: 'Secure storage failed an integrity check. Contact the administrator.' });
      return send(response, 500, { message: 'Something went wrong. Please try again.' });
    }
  };

  const install = (server: { middlewares: { use: (handler: Middleware) => unknown } }) => {
    server.middlewares.use(handler);
  };
  return { name: 'breach-mirror-auth', configureServer: install, configurePreviewServer: install };
}
