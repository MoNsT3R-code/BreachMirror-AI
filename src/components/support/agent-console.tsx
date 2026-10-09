import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookMarked, CheckCircle2, ClipboardList, History, Inbox, Lightbulb, LineChart, MessageSquareText, Search, Send, UserRound } from 'lucide-react';
import { AgentTicket, ApprovedFaq, KbRecommendation, PolicyReference, SupportReport, TicketStatus, supportApi } from '../../services/local-api';
import { formatWhen, StatusChip } from './support-badges';
import { TicketThread } from './ticket-thread';

type Section = 'queue' | 'faqs' | 'updates' | 'reports';
type Filter = TicketStatus | 'all' | 'mine';

const TEXTAREA = 'w-full resize-y rounded-md border border-line-strong bg-surface p-3 text-sm text-fg placeholder:text-fg-3';
const INPUT = 'min-h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-3';
const REASON_LABEL = { not_covered: 'Not covered', low_confidence: 'Low confidence', user_request: 'Employee request' } as const;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'open', label: 'Needs reply' },
  { id: 'mine', label: 'Assigned to me' },
  { id: 'answered', label: 'Answered' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'all', label: 'All' },
];

function useReferences() {
  const [references, setReferences] = useState<PolicyReference[]>([]);
  useEffect(() => {
    supportApi.agent.references().then(result => setReferences(result.references)).catch(() => undefined);
  }, []);
  return references;
}

const ReferencePicker: React.FC<{ references: PolicyReference[]; value: string[]; onChange: (ids: string[]) => void; idPrefix: string }> = ({ references, value, onChange, idPrefix }) => {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return references.filter(reference => value.includes(reference.id) || !needle || reference.label.toLowerCase().includes(needle)).slice(0, 40);
  }, [references, query, value]);
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold text-fg-2">Attach policy references ({value.length}/6)</legend>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-3" aria-hidden="true" />
        <input className={`${INPUT} pl-8`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Filter sections, e.g. remote work" aria-label="Filter policy references" />
      </div>
      <ul className="max-h-40 space-y-0.5 overflow-y-auto rounded-md border border-line p-1">
        {shown.map(reference => {
          const checked = value.includes(reference.id);
          return (
            <li key={reference.id}>
              <label htmlFor={`${idPrefix}-${reference.id}`} className={`flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 text-xs ${checked ? 'bg-accent-soft text-fg' : 'text-fg-2 hover:bg-surface-2'}`}>
                <input
                  id={`${idPrefix}-${reference.id}`}
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--bm-accent)]"
                  checked={checked}
                  disabled={!checked && value.length >= 6}
                  onChange={() => onChange(checked ? value.filter(id => id !== reference.id) : [...value, reference.id])}
                />
                {reference.label.replace(/^Information Technology Security and Usage /, 'IT Security ')}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};

/* ------------------------------------------------------------------ queue */

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-xs text-fg-3">{label}</dt>
    <dd className="text-sm text-fg">{value || <span className="text-fg-3">Not provided</span>}</dd>
  </div>
);

const TicketDetail: React.FC<{ ticket: AgentTicket; references: PolicyReference[]; onChange: (ticket: AgentTicket) => void; onOpenSection?: (id: string) => void }> = ({ ticket, references, onChange, onOpenSection }) => {
  const [text, setText] = useState('');
  const [kind, setKind] = useState<'response' | 'guidance'>('response');
  const [referenceIds, setReferenceIds] = useState<string[]>([]);
  const [publishFaq, setPublishFaq] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState(ticket.question);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { requester } = ticket;

  useEffect(() => {
    setText('');
    setReferenceIds([]);
    setPublishFaq(false);
    setFaqQuestion(ticket.question);
    setError('');
  }, [ticket.id, ticket.question]);

  const run = async (action: () => Promise<AgentTicket>) => {
    setBusy(true);
    setError('');
    try {
      onChange(await action());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'The action failed.');
    } finally {
      setBusy(false);
    }
  };

  const send = (resolve: boolean) =>
    run(async () => {
      const updated = await supportApi.agent.reply(ticket.id, { text, kind, referenceIds, resolve, publishFaq, faqQuestion: publishFaq ? faqQuestion : undefined });
      setText('');
      setReferenceIds([]);
      setPublishFaq(false);
      return updated;
    });

  return (
    <div className="space-y-5">
      <header className="space-y-2 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-fg-3">{ticket.id}</span>
          <StatusChip status={ticket.status} />
          <span className="bm-chip">{REASON_LABEL[ticket.reason]}</span>
          {ticket.reason !== 'user_request' && <span className="bm-chip font-mono">coverage {Math.round(ticket.coverage * 100)}%</span>}
          <span className="bm-chip font-mono">{ticket.assignedAgentId ?? 'Unassigned'}</span>
        </div>
        <h2 className="bm-h font-display text-lg font-semibold text-fg">{ticket.question}</h2>
        <div className="flex flex-wrap gap-2">
          {!ticket.assignedToMe && (
            <button type="button" className="bm-btn bm-btn-sm" disabled={busy} onClick={() => void run(() => supportApi.agent.claim(ticket.id))}>
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" /> Assign to me
            </button>
          )}
          {ticket.status !== 'resolved' && (
            <button type="button" className="bm-btn bm-btn-sm" disabled={busy} onClick={() => void run(() => supportApi.agent.resolve(ticket.id))}>
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Mark resolved
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface-2 p-3" aria-labelledby={`req-${ticket.id}`}>
          <h3 id={`req-${ticket.id}`} className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-3">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" /> Requester
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Field label="Name" value={requester.name} />
            <Field label="Employee ID" value={requester.employeeId && <span className="font-mono">{requester.employeeId}</span>} />
            <Field label="Department" value={requester.department} />
            <Field label="Business unit" value={requester.businessUnit} />
            <div className="col-span-2">
              <dt className="text-xs text-fg-3">Contact</dt>
              <dd className="text-sm text-fg">
                {requester.contactShared ? (
                  <>
                    {requester.email && <a className="underline" href={`mailto:${requester.email}`}>{requester.email}</a>}
                    {requester.phone && <span className="ml-2 font-mono">{requester.phone}</span>}
                  </>
                ) : (
                  <span className="text-fg-3">Not shared by the employee. Reply in this request.</span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-line bg-surface-2 p-3" aria-labelledby={`prev-${ticket.id}`}>
          <h3 id={`prev-${ticket.id}`} className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-3">
            <History className="h-3.5 w-3.5" aria-hidden="true" /> Previous related queries
          </h3>
          {ticket.previousQueries.length === 0 ? (
            <p className="text-sm text-fg-3">No earlier requests from this employee.</p>
          ) : (
            <ul className="space-y-1.5">
              {ticket.previousQueries.map(previous => (
                <li key={previous.id} className="flex items-start justify-between gap-2 text-sm">
                  <span className="min-w-0 text-fg">
                    <span className="font-mono text-xs text-fg-3">{previous.id}</span> {previous.question}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    {previous.similarity >= 0.2 && <span className="bm-chip bm-sev bm-sev-med">related</span>}
                    <StatusChip status={previous.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {(ticket.context.length > 0 || ticket.closestMatches.length > 0) && (
        <details className="rounded-lg border border-line p-3">
          <summary className="cursor-pointer text-sm font-semibold text-fg">Copilot context</summary>
          <div className="mt-3 space-y-3 text-sm">
            {ticket.context.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-fg-2">Earlier in the conversation</p>
                <ul className="mt-1 space-y-1.5">
                  {ticket.context.map((turn, index) => (
                    <li key={index} className="text-fg-2">
                      <span className="font-medium text-fg">Q:</span> {turn.q}
                      <span className="mt-0.5 line-clamp-2 block text-xs text-fg-3">A: {turn.a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ticket.closestMatches.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-fg-2">Closest policy passages (judged insufficient)</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-fg-3">
                  {ticket.closestMatches.map(match => (
                    <li key={match}>{match}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      )}

      <TicketThread messages={ticket.messages} viewer="agent" onOpenSection={onOpenSection} />

      <form
        onSubmit={event => {
          event.preventDefault();
          void send(false);
        }}
        className="space-y-3 rounded-xl border border-line bg-surface-2 p-4"
        aria-label="Reply to the employee"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-fg">Reply as Security Team</p>
          <div role="radiogroup" aria-label="Reply type" className="flex gap-1 rounded-md bg-sunken p-0.5">
            {(['response', 'guidance'] as const).map(option => (
              <button key={option} type="button" role="radio" aria-checked={kind === option} onClick={() => setKind(option)} className={`rounded px-2.5 py-1 text-xs font-medium ${kind === option ? 'bg-surface text-fg shadow-sm' : 'text-fg-3'}`}>
                {option === 'response' ? 'Response' : 'Guidance'}
              </button>
            ))}
          </div>
        </div>
        <label htmlFor={`reply-${ticket.id}`} className="sr-only">Reply text</label>
        <textarea id={`reply-${ticket.id}`} rows={5} maxLength={4000} value={text} onChange={event => setText(event.target.value)} className={TEXTAREA} placeholder="Answer the question clearly. Cite the policy where it applies." />
        <ReferencePicker references={references} value={referenceIds} onChange={setReferenceIds} idPrefix={`ref-${ticket.id}`} />
        <label className="flex items-start gap-2.5 text-sm text-fg">
          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--bm-accent)]" checked={publishFaq} onChange={event => setPublishFaq(event.target.checked)} />
          <span>
            Publish this reply as an approved FAQ
            <span className="block text-xs text-fg-3">The Copilot will answer similar questions from it automatically, citing it as a Security Team FAQ.</span>
          </span>
        </label>
        {publishFaq && (
          <label className="block space-y-1 text-xs font-medium text-fg-2">
            FAQ question (as employees would ask it)
            <input className={INPUT} value={faqQuestion} onChange={event => setFaqQuestion(event.target.value)} maxLength={300} />
          </label>
        )}
        {error && <p role="alert" className="rounded-md bg-crit-soft p-2.5 text-sm text-fg">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="bm-btn bm-btn-primary bm-btn-sm" disabled={busy || !text.trim()}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" /> Send reply
          </button>
          <button type="button" className="bm-btn bm-btn-sm" disabled={busy || !text.trim()} onClick={() => void send(true)}>
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Send and resolve
          </button>
        </div>
      </form>
    </div>
  );
};

const Queue: React.FC<{ initialTicketId?: string; references: PolicyReference[]; onOpenSection?: (id: string) => void; onActivity?: () => void }> = ({ initialTicketId, references, onOpenSection, onActivity }) => {
  const [filter, setFilter] = useState<Filter>(initialTicketId ? 'all' : 'open');
  const [tickets, setTickets] = useState<AgentTicket[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialTicketId);
  const [detail, setDetail] = useState<AgentTicket | null>(null);
  const [error, setError] = useState('');

  const loadList = useCallback(async () => {
    try {
      setTickets((await supportApi.agent.tickets(filter)).tickets);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not load the queue.');
      setTickets([]);
    }
  }, [filter]);

  useEffect(() => {
    void loadList();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadList();
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    supportApi.agent
      .open(selectedId)
      .then(opened => {
        setDetail(opened);
        onActivity?.();
      })
      .catch(failure => setError(failure instanceof Error ? failure.message : 'Could not open the ticket.'));
  }, [selectedId, onActivity]);

  const changed = (updated: AgentTicket) => {
    setDetail(updated);
    setTickets(list => list?.map(item => (item.id === updated.id ? updated : item)) ?? list);
    onActivity?.();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <section className="bm-card space-y-2 p-2" aria-label="Ticket queue">
        <div className="flex flex-wrap gap-1 p-1" role="tablist" aria-label="Filter tickets">
          {FILTERS.map(item => (
            <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} onClick={() => setFilter(item.id)} className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${filter === item.id ? 'bg-accent-soft text-accent-text' : 'text-fg-2 hover:bg-surface-2'}`}>
              {item.label}
            </button>
          ))}
        </div>
        {tickets === null ? (
          <div className="bm-skeleton m-2 h-32" role="status" aria-label="Loading tickets" />
        ) : tickets.length === 0 ? (
          <p className="flex items-center gap-2 p-3 text-sm text-fg-3">
            <Inbox className="h-4 w-4" aria-hidden="true" /> Nothing here.
          </p>
        ) : (
          <ul className="space-y-1">
            {tickets.map(item => (
              <li key={item.id}>
                <button type="button" onClick={() => setSelectedId(item.id)} aria-current={item.id === selectedId ? 'true' : undefined} className={`w-full rounded-lg p-3 text-left ${item.id === selectedId ? 'bg-accent-soft' : 'hover:bg-surface-2'}`}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-fg-3">
                      {item.needsAttention && <span className="h-2 w-2 rounded-full bg-high" aria-label="Needs attention" />}
                      {item.id}
                    </span>
                    <StatusChip status={item.status} />
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-fg">{item.question}</span>
                  <span className="mt-1 block text-xs text-fg-3">
                    {item.requester.name}
                    {item.requester.department ? ` · ${item.requester.department}` : ''} · {REASON_LABEL[item.reason]} · {formatWhen(item.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="bm-card min-h-[24rem] p-5" aria-live="polite">
        {error && <p role="alert" className="mb-3 rounded-md bg-crit-soft p-3 text-sm text-fg">{error}</p>}
        {detail ? <TicketDetail ticket={detail} references={references} onChange={changed} onOpenSection={onOpenSection} /> : <p className="text-sm text-fg-3">Select a ticket to see the requester, their related questions and the conversation.</p>}
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ FAQs */

const Faqs: React.FC<{ references: PolicyReference[] }> = ({ references }) => {
  const [faqs, setFaqs] = useState<ApprovedFaq[] | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [referenceIds, setReferenceIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(() => supportApi.agent.faqs().then(result => setFaqs(result.faqs)).catch(() => setFaqs([])), []);
  useEffect(() => {
    void load();
  }, [load]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await supportApi.agent.createFaq({ question, answer, referenceIds });
      setQuestion('');
      setAnswer('');
      setReferenceIds([]);
      await load();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save the FAQ.');
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <section className="bm-card space-y-3 p-4" aria-labelledby="faq-list-title">
        <h2 id="faq-list-title" className="bm-h font-display text-base font-semibold text-fg">Approved knowledge base</h2>
        <p className="text-xs text-fg-3">Active FAQs are searched with the policy text. The Copilot cites them as “Approved Security Team FAQ”.</p>
        {faqs === null ? (
          <div className="bm-skeleton h-24" role="status" aria-label="Loading FAQs" />
        ) : faqs.length === 0 ? (
          <p className="text-sm text-fg-3">No FAQs yet. Publish one from a ticket reply, or add one here.</p>
        ) : (
          <ul className="space-y-3">
            {faqs.map(faq => (
              <li key={faq.id} className={`rounded-lg border border-line p-3 ${faq.status === 'retired' ? 'opacity-60' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-fg-3">
                    {faq.id} · approved by {faq.approvedBy} · {formatWhen(faq.approvedAt)}
                    {faq.sourceTicketId && ` · from ${faq.sourceTicketId}`}
                  </span>
                  {faq.status === 'active' ? (
                    <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={() => void supportApi.agent.retireFaq(faq.id).then(load)}>
                      Retire
                    </button>
                  ) : (
                    <span className="bm-chip">Retired</span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-fg">{faq.question}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-fg-2">{faq.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <form onSubmit={create} className="bm-card space-y-3 p-4" aria-labelledby="faq-new-title">
        <h2 id="faq-new-title" className="bm-h font-display text-base font-semibold text-fg">Add an approved FAQ</h2>
        <label className="block space-y-1 text-xs font-medium text-fg-2">
          Question
          <input className={INPUT} value={question} onChange={event => setQuestion(event.target.value)} maxLength={300} />
        </label>
        <label className="block space-y-1 text-xs font-medium text-fg-2">
          Approved answer
          <textarea className={TEXTAREA} rows={5} value={answer} onChange={event => setAnswer(event.target.value)} maxLength={4000} />
        </label>
        <ReferencePicker references={references} value={referenceIds} onChange={setReferenceIds} idPrefix="faq-ref" />
        {error && <p role="alert" className="rounded-md bg-crit-soft p-2.5 text-sm text-fg">{error}</p>}
        <button type="submit" className="bm-btn bm-btn-primary bm-btn-sm" disabled={!question.trim() || !answer.trim()}>
          Approve and publish
        </button>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ handbook recommendations */

const Updates: React.FC = () => {
  const [recs, setRecs] = useState<KbRecommendation[] | null>(null);
  const load = useCallback(() => supportApi.agent.recommendations().then(result => setRecs(result.recommendations)).catch(() => setRecs([])), []);
  useEffect(() => {
    void load();
  }, [load]);
  const decide = (id: string, status: 'accepted' | 'dismissed') => void supportApi.agent.decide(id, status).then(load);

  return (
    <section className="bm-card space-y-3 p-4" aria-labelledby="updates-title">
      <h2 id="updates-title" className="bm-h font-display text-base font-semibold text-fg">Handbook update recommendations</h2>
      <p className="text-xs text-fg-3">Built from resolved escalations. Similar questions add demand to the same recommendation, so the gaps employees hit most rise to the top.</p>
      {recs === null ? (
        <div className="bm-skeleton h-24" role="status" aria-label="Loading recommendations" />
      ) : recs.length === 0 ? (
        <p className="text-sm text-fg-3">No recommendations yet. They appear when escalated questions are resolved.</p>
      ) : (
        <ul className="space-y-3">
          {recs.map(rec => (
            <li key={rec.id} className="space-y-2 rounded-lg border border-line p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-xs text-fg-3">{rec.id}</span>
                  <span className="bm-chip bm-sev bm-sev-med">asked {rec.demand}×</span>
                  <span className={`bm-chip ${rec.status === 'accepted' ? 'bm-sev bm-sev-safe' : ''}`}>{rec.status}</span>
                </span>
                {rec.status === 'proposed' && (
                  <span className="flex gap-1">
                    <button type="button" className="bm-btn bm-btn-sm" onClick={() => decide(rec.id, 'accepted')}>
                      Accept for next handbook
                    </button>
                    <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={() => decide(rec.id, 'dismissed')}>
                      Dismiss
                    </button>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-fg">{rec.question}</p>
              <p className="text-xs text-fg-3">
                Suggested location: <span className="text-fg-2">{rec.suggestedSection}</span> · tickets {rec.ticketIds.join(', ')}
              </p>
              <p className="whitespace-pre-line rounded-md bg-surface-2 p-2.5 text-sm text-fg-2">{rec.approvedAnswer}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ reports */

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-lg border border-line bg-surface-2 p-3">
    <p className="text-xs text-fg-3">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold text-fg">{value}</p>
  </div>
);

const minutes = (value: number | null) => (value === null ? '—' : value < 60 ? `${value} min` : `${Math.round(value / 60)} h`);

const Reports: React.FC = () => {
  const [report, setReport] = useState<SupportReport | null>(null);
  useEffect(() => {
    supportApi.agent.report().then(setReport).catch(() => undefined);
  }, []);
  if (!report) return <div className="bm-skeleton h-48" role="status" aria-label="Loading the report" />;
  const peak = Math.max(1, ...report.daily.map(day => day.count));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Escalations" value={report.total} />
        <Stat label="Needs reply" value={report.byStatus.open} />
        <Stat label="Median first response" value={minutes(report.medianFirstResponseMinutes)} />
        <Stat label="Median time to resolve" value={minutes(report.medianResolutionMinutes)} />
        <Stat label="Answered" value={report.byStatus.answered} />
        <Stat label="Resolved" value={report.byStatus.resolved} />
        <Stat label="Active FAQs" value={report.activeFaqs} />
        <Stat label="Handbook gaps proposed" value={report.proposedRecommendations} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="bm-card space-y-3 p-4" aria-labelledby="reasons-title">
          <h2 id="reasons-title" className="text-sm font-semibold text-fg">Why questions were escalated</h2>
          <ul className="space-y-2">
            {(Object.keys(report.byReason) as Array<keyof typeof REASON_LABEL>).map(reason => (
              <li key={reason} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-fg-2">{REASON_LABEL[reason]}</span>
                  <span className="font-mono text-fg-3">{report.byReason[reason]}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-sunken">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${report.total ? (report.byReason[reason] / report.total) * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="bm-card space-y-3 p-4" aria-labelledby="daily-title">
          <h2 id="daily-title" className="text-sm font-semibold text-fg">Escalations, last 14 days</h2>
          <div className="flex h-28 items-end gap-1" role="img" aria-label={report.daily.map(day => `${day.day}: ${day.count}`).join(', ')}>
            {report.daily.map(day => (
              <div key={day.day} className="flex-1 rounded-t bg-accent" style={{ height: `${Math.max(4, (day.count / peak) * 100)}%`, opacity: day.count ? 1 : 0.25 }} title={`${day.day}: ${day.count}`} />
            ))}
          </div>
          <p className="text-xs text-fg-3">Every escalation, view of requester details, reply and approval is recorded in the tamper-evident audit log.</p>
        </section>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ console */

const SECTIONS: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
  { id: 'queue', label: 'Queue', icon: <ClipboardList className="h-4 w-4" aria-hidden="true" /> },
  { id: 'faqs', label: 'Approved FAQs', icon: <BookMarked className="h-4 w-4" aria-hidden="true" /> },
  { id: 'updates', label: 'Handbook updates', icon: <Lightbulb className="h-4 w-4" aria-hidden="true" /> },
  { id: 'reports', label: 'Reports', icon: <LineChart className="h-4 w-4" aria-hidden="true" /> },
];

export const AgentConsole: React.FC<{ agentId?: string; initialTicketId?: string; onOpenSection?: (id: string) => void; onActivity?: () => void }> = ({ agentId, initialTicketId, onOpenSection, onActivity }) => {
  const [section, setSection] = useState<Section>('queue');
  const references = useReferences();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Console sections">
          {SECTIONS.map(item => (
            <button key={item.id} type="button" role="tab" aria-selected={section === item.id} onClick={() => setSection(item.id)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium ${section === item.id ? 'bg-accent-soft text-accent-text' : 'text-fg-2 hover:bg-surface-2'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        {agentId && (
          <span className="bm-chip" title="Employees see only this ID, never your name or contact details.">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" /> You reply as <span className="font-mono font-semibold">{agentId}</span>
          </span>
        )}
      </div>
      {section === 'queue' && <Queue initialTicketId={initialTicketId} references={references} onOpenSection={onOpenSection} onActivity={onActivity} />}
      {section === 'faqs' && <Faqs references={references} />}
      {section === 'updates' && <Updates />}
      {section === 'reports' && <Reports />}
    </div>
  );
};
