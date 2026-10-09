import React from 'react';
import { ArrowRight, Headset } from 'lucide-react';
import { PolicyRagResponse } from '../../services/local-api';
import { StatusChip } from '../support/support-badges';

interface EscalationCardProps {
  result: PolicyRagResponse;
  onOpenTicket?: (ticketId: string) => void;
}

/** Shown instead of an answer when the approved content cannot answer the question reliably. */
export const EscalationCard: React.FC<EscalationCardProps> = ({ result, onOpenTicket }) => {
  const escalation = result.escalation;
  if (!escalation) return null;
  return (
    <section aria-label="Forwarded to the Security Team" className="space-y-3 rounded-xl border border-line bg-med-soft p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-fg" aria-hidden="true">
          <Headset className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-semibold text-fg">Forwarded to the Security Team</p>
          {result.answer.split(/\n{2,}/).map(paragraph => (
            <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-fg-2">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      {escalation.ticketId && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <div>
              <dt className="text-fg-3">Request</dt>
              <dd className="font-mono font-semibold text-fg">{escalation.ticketId}</dd>
            </div>
            <div>
              <dt className="text-fg-3">Security Agent ID</dt>
              <dd className="font-mono font-semibold text-fg">{escalation.agentId ?? 'Being assigned'}</dd>
            </div>
            {escalation.status && (
              <div>
                <dt className="text-fg-3">Status</dt>
                <dd className="mt-0.5"><StatusChip status={escalation.status} /></dd>
              </div>
            )}
          </dl>
          {onOpenTicket && (
            <button type="button" className="bm-btn bm-btn-sm" onClick={() => onOpenTicket(escalation.ticketId as string)}>
              Track this request <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
