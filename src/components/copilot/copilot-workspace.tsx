import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowUp, BookOpen, Check, Copy, Cpu, Database, Headset, MessageSquarePlus, RotateCcw, ShieldCheck, Square, ThumbsDown, ThumbsUp } from 'lucide-react';
import { PolicyRagResponse } from '../../services/local-api';
import { BrandMark } from '../shell/brand-mark';
import { AiAnswerBadge } from '../support/support-badges';
import { AnswerView, Highlighted, highlightTerms } from './answer-view';
import { EscalationCard } from './escalation-card';
import { PipelineGraph } from './pipeline-graph';
import { CopilotMessage, useCopilot } from './use-copilot';

interface CopilotWorkspaceProps {
  /** Opens a policy section in the handbook (by handbook vector id). */
  onOpenSection?: (sectionId: string) => void;
  /** Opens a Security Support request (ticket id). */
  onOpenTicket?: (ticketId: string) => void;
  /** Compact layout for embedding inside the handbook dialog. */
  compact?: boolean;
}

const Handoff: React.FC<{ message: CopilotMessage; onOpenTicket?: (id: string) => void }> = ({ message, onOpenTicket }) => {
  const handoff = message.handoff;
  if (!handoff || handoff.state === 'sending') return null;
  if (handoff.state === 'error') return <p role="alert" className="rounded-md bg-crit-soft p-2.5 text-sm text-fg">{handoff.message}</p>;
  return (
    <p role="status" className="flex flex-wrap items-center gap-2 rounded-md bg-safe-soft p-2.5 text-sm text-fg">
      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
      {handoff.reused ? 'You already have an open request for this question' : 'Sent to the Security Team'}: <span className="font-mono font-semibold">{handoff.ticketId}</span>
      {handoff.agentId ? <>· Security Agent ID <span className="font-mono font-semibold">{handoff.agentId}</span></> : '· an agent will be assigned shortly'}
      {onOpenTicket && (
        <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={() => onOpenTicket(handoff.ticketId)}>
          Track
        </button>
      )}
    </p>
  );
};

const STARTERS = [
  'What should I do if I lose my company laptop?',
  'Can I paste customer data into ChatGPT?',
  'I got an MFA prompt I did not trigger. What now?',
  'Can I accept a gift from a vendor during an RFP?',
  'Is it OK to work on public airport Wi-Fi?',
  'How do I report a phishing email?',
];

const MAX_LENGTH = 500;

function confidenceLabel(value: number): { label: string; tone: string } {
  if (value >= 0.75) return { label: 'High', tone: 'bg-safe' };
  if (value >= 0.5) return { label: 'Medium', tone: 'bg-med' };
  return { label: 'Low', tone: 'bg-high' };
}

const Meter: React.FC<{ label: string; value: number; tone: string; caption: string }> = ({ label, value, tone, caption }) => (
  <div>
    <div className="flex items-baseline justify-between text-xs">
      <span className="font-medium text-fg-2">{label}</span>
      <span className="font-mono text-fg-3">{caption}</span>
    </div>
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sunken" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  </div>
);

const EnginePills: React.FC<{ result?: PolicyRagResponse }> = ({ result }) => (
  <div className="flex flex-wrap gap-1.5 text-xs">
    <span className="bm-chip"><Database className="h-3 w-3" aria-hidden="true" /> BM25 + {result?.engine === 'gemini-embedding' ? 'Gemini embeddings' : 'local vectors'} · RRF · MMR</span>
    <span className="bm-chip"><Cpu className="h-3 w-3" aria-hidden="true" /> {result?.mode === 'gemini' ? 'Gemini generation' : result?.mode === 'extractive' ? 'Extractive synthesis' : 'LangGraph agent'}</span>
  </div>
);

const Evidence: React.FC<{ message?: CopilotMessage; active: string | null; onSelect: (id: string) => void; onOpenSection?: (id: string) => void }> = ({ message, active, onSelect, onOpenSection }) => {
  const result = message?.result;
  const terms = highlightTerms(message?.question ?? '');
  const refs = useRef<Record<string, HTMLLIElement | null>>({});
  useEffect(() => {
    if (active) refs.current[active]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [active]);

  if (!result) return <p className="text-sm text-fg-3">Sources for the selected answer appear here, ranked by relevance, with your search terms highlighted.</p>;
  if (result.escalation) {
    return (
      <p className="text-sm text-fg-3">
        No answer was generated. The approved content covers about {Math.round(result.escalation.coverage * 100)}% of this question, below the bar for reliable guidance, so the Security Team will answer it instead.
      </p>
    );
  }
  if (result.sources.length === 0) return <p className="text-sm text-fg-3">No policy sources were needed for this reply.</p>;
  const confidence = confidenceLabel(result.confidence);
  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Meter label="Confidence" value={result.confidence} tone={confidence.tone} caption={`${Math.round(result.confidence * 100)}% · ${confidence.label}`} />
        <Meter label="Grounding" value={result.grounding.ratio} tone={result.grounding.grounded ? 'bg-safe' : 'bg-high'} caption={`${Math.round(result.grounding.ratio * 100)}% of ${result.grounding.checked} statements cited`} />
      </div>
      <ol className="space-y-2.5">
        {result.sources.map(source => (
          <li
            key={source.id}
            ref={element => {
              refs.current[source.id] = element;
            }}
            className={`rounded-lg border p-3 ${active === source.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface-2'}`}
          >
            <button type="button" onClick={() => onSelect(source.id)} className="w-full text-left" aria-pressed={active === source.id}>
              <span className="flex items-center justify-between gap-2">
                <span className="grid h-6 min-w-6 place-items-center rounded bg-accent px-1 font-mono text-xs font-semibold text-accent-fg">{source.id.slice(1)}</span>
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-fg">{source.label.replace(/^.*? — /, '')}</span>
                <span className="font-mono text-xs text-fg-3">{Math.round(source.relevance * 100)}%</span>
              </span>
              {source.label.startsWith('Approved Security Team FAQ') && (
                <span className="bm-chip bm-sev bm-sev-safe mt-2">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Approved Security Team FAQ
                </span>
              )}
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(6, Math.round(source.relevance * 100))}%` }} />
              </span>
              <span className={`mt-2 block text-xs leading-relaxed text-fg-2 ${active === source.id ? '' : 'line-clamp-4'}`}>
                <Highlighted text={source.excerpt} terms={terms} />
              </span>
            </button>
            {source.sectionId && onOpenSection && (
              <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm -ml-2 mt-1" onClick={() => onOpenSection(source.sectionId as string)}>
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Open in handbook
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({ onOpenSection, onOpenTicket, compact = false }) => {
  const { messages, busy, ask, stop, reset, retry, rate, askSecurityTeam } = useCopilot();
  const [draft, setDraft] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const assistants = messages.filter(message => message.role === 'assistant');
  const selected = assistants.find(message => message.id === selectedId) ?? assistants[assistants.length - 1];
  const running = selected?.status === 'streaming';

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  useEffect(() => {
    setActiveSource(null);
  }, [selected?.id]);

  const submit = (question: string) => {
    if (!question.trim() || busy) return;
    setDraft('');
    setSelectedId(null);
    void ask(question);
  };

  const copy = (message: CopilotMessage) => {
    void navigator.clipboard.writeText(message.text);
    setCopied(message.id);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const conversation = (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div role="log" aria-live="polite" aria-label="Conversation" className="min-h-0 flex-1 space-y-5">
        {messages.length === 0 && (
          <div className="space-y-4 py-2">
            {!compact && (
              <div className="flex items-start gap-3">
                <BrandMark size={34} withWordmark={false} />
                <div>
                  <h2 className="bm-h font-display text-xl font-semibold text-fg">Ask the Policy Copilot</h2>
                  <p className="bm-p text-sm text-fg-3">Answers come only from the XYZ IT security policy, Code of Business Conduct and Security Team approved FAQs, and every statement is cited and checked. If the approved content does not cover your question, it goes to the Security Team instead of being guessed.</p>
                </div>
              </div>
            )}
            <ul className="grid gap-2 sm:grid-cols-2">
              {STARTERS.slice(0, compact ? 4 : 6).map(question => (
                <li key={question}>
                  <button type="button" onClick={() => submit(question)} className="bm-card bm-magnet w-full p-3 text-left text-sm text-fg">
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map(message =>
          message.role === 'user' ? (
            <div key={message.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-accent-fg">{message.text}</p>
            </div>
          ) : (
            <article
              key={message.id}
              aria-label="Copilot answer"
              onClick={() => setSelectedId(message.id)}
              className={`flex gap-3 rounded-xl p-2 ${!compact && selected?.id === message.id && assistants.length > 1 ? 'bg-accent-soft/40' : ''}`}
            >
              <span className="mt-1 shrink-0"><BrandMark size={26} withWordmark={false} /></span>
              <div className="min-w-0 flex-1 space-y-3">
                {compact && <PipelineGraph steps={message.steps} running={message.status === 'streaming'} compact />}
                {message.result?.notice && (
                  <p role="alert" className="flex gap-2 rounded-md bg-high-soft p-3 text-sm text-fg">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-high" aria-hidden="true" />
                    {message.result.notice}
                  </p>
                )}
                {message.status === 'error' ? (
                  <div role="alert" className="space-y-2 rounded-md bg-crit-soft p-3">
                    <p className="text-sm text-fg">{message.text}</p>
                    <button type="button" className="bm-btn bm-btn-sm" onClick={() => retry(message)}>
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
                    </button>
                  </div>
                ) : message.result?.escalation ? (
                  <EscalationCard result={message.result} onOpenTicket={onOpenTicket} />
                ) : message.status === 'streaming' && message.steps.some(step => step.node === 'escalate') ? (
                  <p className="flex items-center gap-2 text-sm text-fg-3" role="status">
                    <Headset className="h-4 w-4" aria-hidden="true" /> Not covered by approved content. Forwarding your question to the Security Team…
                  </p>
                ) : message.text ? (
                  <AnswerView
                    text={message.text}
                    sources={message.result?.sources ?? []}
                    activeSource={selected?.id === message.id ? activeSource : null}
                    streaming={message.status === 'streaming'}
                    onCite={id => {
                      setSelectedId(message.id);
                      setActiveSource(id);
                    }}
                  />
                ) : (
                  <p className="text-sm text-fg-3" role="status">Working through the pipeline…</p>
                )}

                {message.status === 'done' && message.result && !message.result.escalation && (
                  <div className="space-y-3">
                    {compact && message.result.sources.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5" aria-label="Sources">
                        {message.result.sources.map(source => (
                          <li key={source.id}>
                            <button type="button" className="bm-chip hover:bg-surface-2" onClick={() => source.sectionId && onOpenSection?.(source.sectionId)} title={source.excerpt.slice(0, 200)}>
                              <span className="font-mono">{source.id}</span> {source.label.replace(/^.*? — /, '').slice(0, 48)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap items-center gap-1">
                      <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={() => copy(message)}>
                        {copied === message.id ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                        {copied === message.id ? 'Copied' : 'Copy'}
                      </button>
                      <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" aria-pressed={message.feedback === 'up'} aria-label="Helpful" onClick={() => rate(message, 'up')}>
                        <ThumbsUp className={`h-3.5 w-3.5 ${message.feedback === 'up' ? 'text-safe' : ''}`} aria-hidden="true" />
                      </button>
                      <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" aria-pressed={message.feedback === 'down'} aria-label="Not helpful" onClick={() => rate(message, 'down')}>
                        <ThumbsDown className={`h-3.5 w-3.5 ${message.feedback === 'down' ? 'text-crit' : ''}`} aria-hidden="true" />
                      </button>
                      {message.result.mode !== 'none' && (
                        <span className="ml-1 flex flex-wrap items-center gap-1">
                          <AiAnswerBadge />
                          {message.result.grounding.grounded && <span className="bm-chip bm-sev bm-sev-safe"><ShieldCheck className="h-3 w-3" aria-hidden="true" /> Grounded</span>}
                        </span>
                      )}
                      {message.result.mode !== 'none' && message.handoff?.state !== 'sent' && (
                        <button
                          type="button"
                          className="bm-btn bm-btn-ghost bm-btn-sm"
                          onClick={() => void askSecurityTeam(message)}
                          disabled={message.handoff?.state === 'sending'}
                          title="Not sure this covers your situation? Send it to the Security Team for a human answer."
                        >
                          <Headset className="h-3.5 w-3.5" aria-hidden="true" />
                          {message.handoff?.state === 'sending' ? 'Sending…' : 'Ask the Security Team'}
                        </button>
                      )}
                    </div>
                    <Handoff message={message} onOpenTicket={onOpenTicket} />
                    {message.result.followUps.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5" aria-label="Suggested follow-up questions">
                        {message.result.followUps.map(question => (
                          <li key={question}>
                            <button type="button" className="bm-btn bm-btn-sm !h-auto !whitespace-normal py-1.5 text-left" onClick={() => submit(question)} disabled={busy}>
                              {question}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </article>
          ),
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={event => {
          event.preventDefault();
          submit(draft);
        }}
        className="bm-glass-strong sticky bottom-3 rounded-xl p-2"
      >
        <label htmlFor="copilot-question" className="sr-only">Ask a policy question</label>
        <textarea
          id="copilot-question"
          ref={inputRef}
          rows={2}
          maxLength={MAX_LENGTH}
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit(draft);
            }
          }}
          placeholder="Ask about the security policy or code of conduct…"
          className="w-full resize-none bg-transparent p-2 text-sm text-fg placeholder:text-fg-3 focus-visible:outline-none"
        />
        <div className="flex items-center justify-between gap-2 px-1 pb-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-fg-3">{draft.length}/{MAX_LENGTH}</span>
            {messages.length > 0 && (
              <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={reset} disabled={busy}>
                <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" /> New chat
              </button>
            )}
          </div>
          {busy ? (
            <button type="button" className="bm-btn bm-btn-sm" onClick={stop}>
              <Square className="h-3.5 w-3.5" aria-hidden="true" /> Stop
            </button>
          ) : (
            <button type="submit" className="bm-btn bm-btn-primary bm-btn-sm" disabled={!draft.trim()} aria-label="Send question">
              <ArrowUp className="h-4 w-4" aria-hidden="true" /> Send
            </button>
          )}
        </div>
      </form>
    </div>
  );

  if (compact) return <div className="bm-ds mx-auto flex max-w-3xl flex-col">{conversation}</div>;

  return (
    <div className="bm-ds grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <div className="flex min-h-[60vh] flex-col">{conversation}</div>
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="How this answer was produced">
        <section className="bm-card space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="bm-h font-display text-base font-semibold text-fg">LangGraph pipeline</h2>
            {running && <span className="bm-chip bm-sev bm-sev-low">Running</span>}
          </div>
          <PipelineGraph steps={selected?.steps ?? []} running={running} />
          <EnginePills result={selected?.result} />
        </section>
        <section className="bm-card space-y-3 p-4">
          <h2 className="bm-h font-display text-base font-semibold text-fg">Evidence</h2>
          <Evidence message={selected} active={activeSource} onSelect={setActiveSource} onOpenSection={onOpenSection} />
        </section>
      </aside>
    </div>
  );
};
