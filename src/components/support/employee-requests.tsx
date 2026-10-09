import React, { useCallback, useEffect, useState } from 'react';
import { Headset, Inbox, Send, ShieldCheck } from 'lucide-react';
import { SupportTicket, supportApi } from '../../services/local-api';
import { ProfileCard } from './profile-card';
import { formatWhen, StatusChip } from './support-badges';
import { TicketThread } from './ticket-thread';

interface EmployeeRequestsProps {
  initialTicketId?: string;
  onOpenSection?: (sectionId: string) => void;
  onActivity?: () => void;
}

const TEXTAREA = 'w-full resize-y rounded-md border border-line-strong bg-surface p-3 text-sm text-fg placeholder:text-fg-3';

const HowItWorks: React.FC = () => (
  <ol className="grid gap-3 text-sm sm:grid-cols-3">
    {[
      ['Ask the Copilot', 'Answers come only from approved policy content, with sources.'],
      ['Not covered? It is forwarded', 'Instead of guessing, the Copilot sends your question to the Security Team.'],
      ['Get a reviewed answer', 'A Security Agent replies here with guidance and policy references.'],
    ].map(([title, text], index) => (
      <li key={title} className="rounded-lg border border-line bg-surface-2 p-3">
        <span className="font-mono text-xs text-accent-text">0{index + 1}</span>
        <p className="mt-1 font-semibold text-fg">{title}</p>
        <p className="mt-0.5 text-xs text-fg-3">{text}</p>
      </li>
    ))}
  </ol>
);

export const EmployeeRequests: React.FC<EmployeeRequestsProps> = ({ initialTicketId, onOpenSection, onActivity }) => {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialTicketId);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [draft, setDraft] = useState('');
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadList = useCallback(async () => {
    try {
      const result = await supportApi.myTickets();
      setTickets(result.tickets);
      setSelectedId(current => current ?? result.tickets[0]?.id);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not load your requests.');
      setTickets([]);
    }
  }, []);

  const loadTicket = useCallback(
    async (id: string) => {
      try {
        const opened = await supportApi.openTicket(id);
        setTicket(opened);
        setTickets(list => list?.map(item => (item.id === id ? { ...opened, unread: false } : item)) ?? list);
        onActivity?.();
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : 'Could not open this request.');
      }
    },
    [onActivity],
  );

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (initialTicketId) setSelectedId(initialTicketId);
  }, [initialTicketId]);

  useEffect(() => {
    if (!selectedId) return undefined;
    void loadTicket(selectedId);
    // Updates from the Security Team arrive while the page is open.
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadTicket(selectedId);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [selectedId, loadTicket]);

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    setBusy(true);
    setError('');
    try {
      const { ticket: created } = await supportApi.submit(question);
      setQuestion('');
      await loadList();
      setSelectedId(created.id);
      onActivity?.();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not send your question.');
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ticket || !draft.trim()) return;
    setBusy(true);
    setError('');
    try {
      const updated = await supportApi.reply(ticket.id, draft);
      setTicket(updated);
      setDraft('');
      setTickets(list => list?.map(item => (item.id === updated.id ? updated : item)) ?? list);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not send your message.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="space-y-4">
        <section className="bm-card space-y-3 p-4" aria-labelledby="new-request-title">
          <h2 id="new-request-title" className="bm-h font-display text-base font-semibold text-fg">Ask the Security Team directly</h2>
          <form onSubmit={submitQuestion} className="space-y-2">
            <label htmlFor="support-question" className="sr-only">Your question for the Security Team</label>
            <textarea id="support-question" rows={3} maxLength={500} value={question} onChange={event => setQuestion(event.target.value)} className={TEXTAREA} placeholder="Describe your situation. Do not include passwords or customer data." />
            <button type="submit" className="bm-btn bm-btn-primary bm-btn-sm" disabled={busy || !question.trim()}>
              <Headset className="h-3.5 w-3.5" aria-hidden="true" /> Send to Security Team
            </button>
          </form>
        </section>

        <section className="bm-card p-2" aria-labelledby="requests-title">
          <h2 id="requests-title" className="px-2 pb-1 pt-2 text-sm font-semibold text-fg">Your requests</h2>
          {tickets === null ? (
            <div className="bm-skeleton m-2 h-24" role="status" aria-label="Loading your requests" />
          ) : tickets.length === 0 ? (
            <p className="flex items-center gap-2 p-3 text-sm text-fg-3">
              <Inbox className="h-4 w-4" aria-hidden="true" /> No requests yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {tickets.map(item => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-current={item.id === selectedId ? 'true' : undefined}
                    className={`w-full rounded-lg p-3 text-left ${item.id === selectedId ? 'bg-accent-soft' : 'hover:bg-surface-2'}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-fg-3">{item.id}</span>
                      <span className="flex items-center gap-1.5">
                        {item.unread && <span className="bm-chip bm-sev bm-sev-high">New reply</span>}
                        <StatusChip status={item.status} />
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-fg">{item.question}</span>
                    <span className="mt-1 block text-xs text-fg-3">Updated {formatWhen(item.updatedAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ProfileCard />
      </div>

      <section className="bm-card min-h-[24rem] space-y-5 p-5" aria-live="polite" aria-labelledby="ticket-title">
        {error && <p role="alert" className="rounded-md bg-crit-soft p-3 text-sm text-fg">{error}</p>}
        {!ticket ? (
          <div className="space-y-5">
            <div>
              <h2 id="ticket-title" className="bm-h font-display text-lg font-semibold text-fg">How Security Support works</h2>
              <p className="mt-1 text-sm text-fg-3">Accuracy comes before speed: the Copilot never guesses at policy.</p>
            </div>
            <HowItWorks />
          </div>
        ) : (
          <>
            <header className="space-y-3 border-b border-line pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-fg-3">{ticket.id}</span>
                <StatusChip status={ticket.status} />
                <span className="bm-chip" title="Security Team members are identified only by their agent ID, to protect their privacy.">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Security Agent ID <span className="font-mono">{ticket.assignedAgentId ?? 'being assigned'}</span>
                </span>
              </div>
              <h2 id="ticket-title" className="bm-h font-display text-lg font-semibold text-fg">{ticket.question}</h2>
              <p className="text-xs text-fg-3">
                Opened {new Date(ticket.createdAt).toLocaleString()}
                {ticket.reason !== 'user_request' && ' · forwarded automatically because the approved content does not cover it'}
              </p>
            </header>

            <TicketThread messages={ticket.messages} viewer="employee" onOpenSection={onOpenSection} />

            <form onSubmit={sendReply} className="space-y-2 border-t border-line pt-4">
              <label htmlFor="ticket-reply" className="text-sm font-medium text-fg">
                {ticket.status === 'resolved' ? 'Still need help? Replying reopens this request.' : 'Add details for the Security Team'}
              </label>
              <textarea id="ticket-reply" rows={3} maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} className={TEXTAREA} placeholder="Do not include passwords or customer data." />
              <button type="submit" className="bm-btn bm-btn-primary bm-btn-sm" disabled={busy || !draft.trim()}>
                <Send className="h-3.5 w-3.5" aria-hidden="true" /> Send
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};
