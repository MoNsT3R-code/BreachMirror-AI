import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-support-'));
process.env.BM_DATA_DIR = dir;
process.env.BM_DATA_KEY = crypto.randomBytes(32).toString('base64');
process.env.BM_SECURITY_TEAM = 'sam.agent';

const auth = await import('../server/auth-service');
const support = await import('../server/support-service');
const { readAudit, verifyAuditChain } = await import('../server/security/audit-log');
const { listFaqs } = await import('../server/rag/knowledge-base');

const PASSWORD = 'Qz7!vKp#2mWx';
function register(name: string, username: string) {
  const result = auth.createUser({ name, username, email: `${username}@xyz.com`, role: 'Threat Hunter', password: PASSWORD, confirmPassword: PASSWORD });
  assert.ok('user' in result, 'registration should succeed');
  return result.user;
}

const employee = register('Avery Collins', 'avery.collins');
const agent = register('Sam Agent', 'sam.agent');
const agentId = auth.ensureSecurityAgentId(agent.id) as string;

test('Security Team membership comes from configuration, and agents get a pseudonymous SEC id', () => {
  assert.equal(auth.isSecurityAgent(employee), false);
  assert.equal(auth.isSecurityAgent(agent), true);
  assert.match(agentId, /^SEC-\d{4}$/);
  assert.equal(auth.ensureSecurityAgentId(agent.id), agentId, 'the id is stable');
  assert.equal(auth.ensureSecurityAgentId(employee.id), null);
  assert.equal(auth.publicUser(auth.getUserById(employee.id)!).isSecurityAgent, false);
});

test('an escalation becomes a ticket assigned to an agent, and the employee sees only the agent ID', () => {
  const created = support.createEscalation(employee, { question: 'Can I use Grammarly on work documents?', reason: 'not_covered', coverage: 0.47, context: [{ q: 'Can I paste customer data into ChatGPT?', a: 'No…' }] });
  assert.ok('value' in created);
  const { ticket, reused } = created.value;
  assert.equal(reused, false);
  assert.match(ticket.id, /^ESC-\d{6}$/);
  assert.equal(ticket.assignedAgentId, agentId);
  const serialised = JSON.stringify(ticket);
  for (const secret of ['Sam Agent', 'sam.agent', agent.id]) assert.ok(!serialised.includes(secret), `employee view leaked ${secret}`);

  const again = support.createEscalation(employee, { question: 'can I use grammarly on work documents', reason: 'not_covered' });
  assert.ok('value' in again && again.value.reused && again.value.ticket.id === ticket.id, 'a repeated open question reuses the ticket');
});

test('agents see requester details, and contact details only when the employee allows it', () => {
  auth.updateProfile(employee.id, { employeeId: 'E-20417', department: 'Title Operations', businessUnit: 'Commercial Services', phone: '+1 713 555 0100', shareContact: false });
  const [ticket] = support.listEmployeeTickets(employee.id);
  const opened = support.openAgentTicket(agent, agentId, ticket.id);
  assert.ok('value' in opened);
  const { requester, context } = opened.value;
  assert.equal(requester.name, 'Avery Collins');
  assert.equal(requester.employeeId, 'E-20417');
  assert.equal(requester.department, 'Title Operations');
  assert.equal(requester.businessUnit, 'Commercial Services');
  assert.equal(requester.email, null);
  assert.equal(requester.phone, null);
  assert.equal(context.length, 1, 'the Copilot conversation is attached');

  auth.updateProfile(employee.id, { employeeId: 'E-20417', department: 'Title Operations', businessUnit: 'Commercial Services', phone: '+1 713 555 0100', shareContact: true });
  const shared = support.openAgentTicket(agent, agentId, ticket.id);
  assert.ok('value' in shared);
  assert.equal(shared.value.requester.email, 'avery.collins@xyz.com');
  assert.equal(shared.value.requester.phone, '+1 713 555 0100');
  assert.ok(readAudit().entries.some(entry => entry.event === 'escalation_viewed'), 'viewing requester details is audited');
});

test('profile validation rejects malformed employee IDs and phone numbers', () => {
  assert.ok(!('profile' in auth.updateProfile(employee.id, { employeeId: '<script>', department: '', businessUnit: '', phone: '', shareContact: false })));
  assert.ok(!('profile' in auth.updateProfile(employee.id, { employeeId: 'E-1', department: '', businessUnit: '', phone: 'call me maybe', shareContact: false })));
});

test('an agent reply with policy references resolves the ticket, publishes an FAQ and records a handbook recommendation', () => {
  const [ticket] = support.listEmployeeTickets(employee.id);
  const reply = support.agentReply(agent, agentId, ticket.id, {
    text: 'No. Grammarly sends document text to external servers. Use Microsoft Editor instead.',
    kind: 'response',
    referenceIds: ['xyz-sec-05', 'not-a-real-reference'],
    resolve: true,
    publishFaq: true,
  });
  assert.ok('value' in reply);
  assert.equal(reply.value.status, 'resolved');

  const [seen] = support.listEmployeeTickets(employee.id);
  const answer = seen.messages.find(message => message.author === 'security');
  assert.equal(answer?.agentId, agentId);
  assert.equal(answer?.references?.length, 1, 'unknown references are dropped');
  assert.ok(!('agentUserId' in (answer ?? {})), 'the internal author id never reaches the employee');
  assert.equal(seen.unread, true);

  assert.equal(listFaqs().length, 1);
  assert.equal(listFaqs()[0].approvedBy, agentId);
  const [recommendation] = support.listRecommendations();
  assert.equal(recommendation.status, 'proposed');
  assert.match(recommendation.suggestedSection, /Section 5|Approved|IT Security|Information Technology/);
});

test('previous related queries are shown to agents and every escalation step is in the audit chain', () => {
  const second = support.createEscalation(employee, { question: 'Is Grammarly Premium allowed on my personal laptop for work?', reason: 'not_covered' });
  assert.ok('value' in second);
  const opened = support.openAgentTicket(agent, agentId, second.value.ticket.id);
  assert.ok('value' in opened);
  assert.ok(opened.value.previousQueries[0].similarity > 0, 'the earlier Grammarly question is ranked as related');

  const events = new Set(readAudit().entries.map(entry => entry.event));
  for (const event of ['escalation_created', 'escalation_repeat', 'escalation_viewed', 'escalation_resolved', 'faq_approved']) assert.ok(events.has(event), `${event} audited`);
  assert.equal(verifyAuditChain().valid, true);

  const report = support.supportReport();
  assert.equal(report.total, 2);
  assert.equal(report.byStatus.resolved, 1);
  assert.equal(report.activeFaqs, 1);
});

test('tickets are encrypted at rest', () => {
  const raw = fs.readFileSync(path.join(dir, 'support-tickets.json'), 'utf8');
  assert.ok(!raw.includes('Grammarly'), 'ticket text must not appear in plaintext');
});
