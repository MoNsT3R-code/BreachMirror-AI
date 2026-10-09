import React, { useEffect, useState } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { ThreatEvent } from '../../shared-types';
import { generateTeachableMomentApi, TeachableMomentResult } from '../../services/local-api';
import { Dialog } from '../ui/dialog';
import { RiskMeter } from '../ui/risk-meter';
import { SeverityBadge } from '../ui/severity';

interface BreachDetailModalProps {
  event: ThreatEvent | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

const RISK: Record<ThreatEvent['severity'], number> = { CRITICAL: 88, HIGH: 65, ELEVATED: 42, MONITORED: 20 };

const Fact: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="bm-eyebrow">{label}</dt>
    <dd className="mt-1 text-sm text-fg">{children}</dd>
  </div>
);

export const BreachDetailModal: React.FC<BreachDetailModalProps> = ({ event, onClose, onAcknowledge }) => {
  const [moment, setMoment] = useState<TeachableMomentResult | null>(null);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMoment(null);
    setLoading(false);
  }, [event?.id]);

  const generate = async () => {
    if (!event) return;
    setLoading(true);
    try {
      const result = await generateTeachableMomentApi(event);
      setMoment(result.data);
      setSource(result.source);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={event !== null}
      onClose={onClose}
      title={event ? `Event ${event.id}` : 'Event details'}
      description={event ? `${event.categoryLabel} · ${event.sourceEndpoint} · ${event.timestamp}` : undefined}
      size="lg"
      footer={
        event && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-fg-3">Zero-blame review: this is for learning, not discipline.</p>
            <div className="flex gap-2">
              <button type="button" className="bm-btn" onClick={onClose}>Close</button>
              <button
                type="button"
                className="bm-btn bm-btn-primary"
                onClick={() => {
                  onAcknowledge(event.id);
                  onClose();
                }}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Acknowledge
              </button>
            </div>
          </div>
        )
      }
    >
      {event && (
        <div className="bm-ds space-y-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={event.severity} />
            <span className="bm-chip">{event.status.charAt(0) + event.status.slice(1).toLowerCase()}</span>
            <span className="bm-chip">{event.userCohort}</span>
          </div>

          <RiskMeter score={RISK[event.severity]} label="Simulated risk score" />

          <blockquote className="rounded-md border-l-4 border-line-strong bg-surface-2 px-4 py-3 text-base text-fg">
            {event.actionDetected}
          </blockquote>

          {/* The reflection axis: the threat on one side, your move on the other. */}
          <div className="grid gap-6 md:grid-cols-[1fr_1px_1fr]">
            <section aria-labelledby="threat-side" className="space-y-4">
              <h3 id="threat-side" className="bm-h font-display text-base font-semibold text-fg">The threat</h3>
              <dl className="space-y-4">
                <Fact label="Policy rule involved">{event.ruleViolated}</Fact>
                <Fact label="Likely cause">{event.rootCause}</Fact>
                <div className="rounded-md bg-crit-soft p-3">
                  <dt className="bm-eyebrow text-crit">Possible impact if not stopped</dt>
                  <dd className="mt-1 text-sm text-fg">{event.blastRadius}</dd>
                </div>
              </dl>
            </section>

            <div className="hidden bg-line md:block" aria-hidden="true" />

            <section aria-labelledby="move-side" className="space-y-4">
              <h3 id="move-side" className="bm-h font-display text-base font-semibold text-fg">Your move</h3>
              <div className="rounded-md bg-safe-soft p-3">
                <p className="bm-eyebrow text-safe">Recommended next step</p>
                <p className="mt-1 text-sm text-fg">{event.remediationGuidance}</p>
              </div>

              <div className="rounded-md border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-fg">Learning tip</p>
                  {!moment && (
                    <button type="button" className="bm-btn bm-btn-sm" onClick={generate} disabled={loading}>
                      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
                      {loading ? 'Preparing…' : 'Show tip'}
                    </button>
                  )}
                </div>
                <div aria-live="polite" aria-busy={loading}>
                  {moment ? (
                    <div className="mt-3 space-y-3 text-sm">
                      <p className="font-semibold text-fg">{moment.headline}</p>
                      <p className="text-fg-2">{moment.zeroBlameGuidance}</p>
                      <ul className="list-disc space-y-1 pl-5 text-fg-2">
                        {moment.immediateActions.map(step => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                      <p className="font-mono text-xs text-fg-3">Approved tool: {moment.recommendedSanctionedTool} · {source}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-fg-3">A short explanation, the likely cause and practical next steps.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </Dialog>
  );
};
