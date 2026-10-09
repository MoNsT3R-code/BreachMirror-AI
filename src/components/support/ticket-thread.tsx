import React from 'react';
import { BookOpen, UserRound } from 'lucide-react';
import { TicketMessage } from '../../services/local-api';
import { formatWhen, SecurityTeamBadge } from './support-badges';

interface TicketThreadProps {
  messages: TicketMessage[];
  /** Whose screen this is: labels the employee's own messages as "You". */
  viewer: 'employee' | 'agent';
  onOpenSection?: (sectionId: string) => void;
}

const Paragraphs: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/\n{2,}/).map((paragraph, index) => (
      <p key={index} className="whitespace-pre-line">
        {paragraph}
      </p>
    ))}
  </>
);

export const TicketThread: React.FC<TicketThreadProps> = ({ messages, viewer, onOpenSection }) => (
  <ol className="space-y-4" aria-label="Request history">
    {messages.map(message => {
      const time = (
        <time dateTime={message.at} title={new Date(message.at).toLocaleString()} className="text-xs text-fg-3">
          {formatWhen(message.at)}
        </time>
      );
      if (message.author === 'system') {
        return (
          <li key={message.id} className="flex items-center gap-3 text-xs text-fg-3">
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
            <span className="text-center">
              {message.text} · {formatWhen(message.at)}
            </span>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </li>
        );
      }
      if (message.author === 'employee') {
        return (
          <li key={message.id} className={`flex ${viewer === 'employee' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] space-y-1">
              <p className={`flex items-center gap-1.5 text-xs text-fg-3 ${viewer === 'employee' ? 'justify-end' : ''}`}>
                <UserRound className="h-3 w-3" aria-hidden="true" /> {viewer === 'employee' ? 'You' : 'Employee'} · {time}
              </p>
              <div className={`space-y-2 rounded-xl px-4 py-2.5 text-sm ${viewer === 'employee' ? 'rounded-br-sm bg-accent text-accent-fg' : 'rounded-bl-sm bg-surface-2 text-fg'}`}>
                <Paragraphs text={message.text} />
              </div>
            </div>
          </li>
        );
      }
      return (
        <li key={message.id}>
          <article aria-label={`Security Team ${message.kind ?? 'response'}`} className="space-y-3 rounded-xl border border-line border-l-4 border-l-safe bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SecurityTeamBadge agentId={message.agentId} kind={message.kind} />
              {time}
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-fg">
              <Paragraphs text={message.text} />
            </div>
            {message.references && message.references.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-fg-2">Policy references</p>
                <ul className="flex flex-wrap gap-1.5">
                  {message.references.map(reference => (
                    <li key={reference.id}>
                      {reference.sectionId && onOpenSection ? (
                        <button type="button" className="bm-chip hover:bg-surface-2" onClick={() => onOpenSection(reference.sectionId as string)}>
                          <BookOpen className="h-3 w-3" aria-hidden="true" /> {reference.label.replace(/^.*? — /, '')}
                        </button>
                      ) : (
                        <span className="bm-chip">
                          <BookOpen className="h-3 w-3" aria-hidden="true" /> {reference.label.replace(/^.*? — /, '')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </li>
      );
    })}
  </ol>
);
