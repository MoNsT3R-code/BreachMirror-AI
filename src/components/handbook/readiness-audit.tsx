import React, { useEffect, useState } from 'react';
import { Award, Check } from 'lucide-react';
import { AUDIT_CHECKLIST_ITEMS } from '../../data/handbook-lab-content';
import { recordActivity } from '../../services/learning-progress';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { ProgressRing } from '../learning/progress-ring';

interface ReadinessAuditProps {
  onAuditScoreChange?: (score: number) => void;
  onOpenCertificate?: () => void;
}

const DEFAULT_CHECKS = ['chk-1', 'chk-2', 'chk-4', 'chk-8'];

function rank(score: number): { title: string; className: string } {
  if (score >= 90) return { title: 'Apex guardian', className: 'bm-sev-safe' };
  if (score >= 70) return { title: 'Enterprise defender', className: 'bm-sev-low' };
  if (score >= 50) return { title: 'Security sentinel', className: 'bm-sev-med' };
  return { title: 'Needs remediation', className: 'bm-sev-crit' };
}

export const ReadinessAudit: React.FC<ReadinessAuditProps> = ({ onAuditScoreChange, onOpenCertificate }) => {
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('xyz_sentinel_audit_checks');
      return saved ? (JSON.parse(saved) as string[]) : DEFAULT_CHECKS;
    } catch {
      return DEFAULT_CHECKS;
    }
  });
  const { soundEnabled } = useAlerts();

  const score = AUDIT_CHECKLIST_ITEMS.filter(item => checked.includes(item.id)).reduce((sum, item) => sum + item.points, 0);
  const level = rank(score);

  useEffect(() => {
    try {
      localStorage.setItem('xyz_sentinel_audit_checks', JSON.stringify(checked));
    } catch {
      // ignore
    }
    onAuditScoreChange?.(score);
  }, [checked, score, onAuditScoreChange]);

  const toggle = (id: string) => {
    const on = !checked.includes(id);
    setChecked(on ? [...checked, id] : checked.filter(item => item !== id));
    if (on) {
      recordActivity();
      if (soundEnabled) soundManager.playQuizSuccess();
    }
  };

  return (
    <div className="bm-ds space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <ProgressRing value={score} label="Readiness score" size={84} stroke={8} tone={score >= 70 ? 'safe' : 'accent'} />
          <div>
            <h3 className="bm-h font-display text-xl font-semibold text-fg">Readiness self-check</h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-fg-3">
              {checked.length} of {AUDIT_CHECKLIST_ITEMS.length} checks <span className={`bm-chip bm-sev ${level.className}`}>{level.title}</span>
            </p>
            <p className="mt-1 text-xs text-fg-3">Reach 70 points to complete the audit milestone.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="bm-btn bm-btn-sm" onClick={() => setChecked(AUDIT_CHECKLIST_ITEMS.map(item => item.id))}>
            Check all
          </button>
          <button type="button" className="bm-btn bm-btn-sm" onClick={() => setChecked([])}>
            Reset
          </button>
          {onOpenCertificate && (
            <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onOpenCertificate}>
              <Award className="h-3.5 w-3.5" aria-hidden="true" /> Update certificate
            </button>
          )}
        </div>
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {AUDIT_CHECKLIST_ITEMS.map((item, position) => {
          const on = checked.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(item.id)}
                className={`flex h-full w-full items-start gap-3 rounded-lg border p-4 text-left ${on ? 'border-transparent bg-safe-soft' : 'border-line bg-surface hover:border-line-strong'}`}
              >
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${on ? 'border-safe bg-safe text-surface' : 'border-line-strong bg-surface'}`}>
                  {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-fg">
                      {position + 1}. {item.title}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-fg-3">+{item.points}</span>
                  </span>
                  <span className="block text-sm text-fg-2">{item.description}</span>
                  <span className="flex flex-wrap justify-between gap-x-3 font-mono text-xs text-fg-3">
                    <span>{item.policyReference}</span>
                    <span>{item.category}</span>
                  </span>
                  {!on && <span className="block text-xs text-high">Action: {item.remediationAction}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
