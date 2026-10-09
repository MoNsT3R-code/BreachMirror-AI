import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { analyzeCustomActionApi, CustomActionAnalysisResult } from '../../services/local-api';
import { ThreatSeverity } from '../../shared-types';
import { Dialog } from '../ui/dialog';
import { RiskMeter } from '../ui/risk-meter';
import { SeverityBadge } from '../ui/severity';

interface ThreatSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const PRESET_SCENARIOS = [
  { title: 'GenAI prompt with a database secret', text: "Pasted sensitive information of client's data on chatgpt." },
  { title: 'Personal laptop on the office network', text: "Connected the personal laptop with the company's ethernet cable." },
  { title: 'Personal cloud sync over the weekend', text: 'Configured auto-sync on local workspace repository to a personal Google Drive account to work over the weekend.' },
  { title: 'Unknown USB drive', text: 'Inserted an unlabeled black USB thumb drive found on the conference table into corporate laptop to locate the owner.' },
];

const ROLES = ['Incident Commander', 'New Joiner (Day 3)', 'Summer Intern', 'Staff Software Engineer', 'DevOps Contractor'];

const SEVERITY: Record<CustomActionAnalysisResult['severity'], ThreatSeverity> = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  ELEVATED: 'ELEVATED',
  LOW: 'MONITORED',
};

export const ThreatSandboxModal: React.FC<ThreatSandboxModalProps> = ({ isOpen, onClose, userRole = 'Incident Commander' }) => {
  const [text, setText] = useState('');
  const [role, setRole] = useState(ROLES.includes(userRole) ? userRole : ROLES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomActionAnalysisResult | null>(null);
  const [source, setSource] = useState('');

  const analyze = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await analyzeCustomActionApi(value, role);
      setResult(response.data);
      setSource(response.source);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Threat sandbox"
      description="Describe an action and see its possible impact. Rule-based practice only; nothing leaves your browser."
      size="lg"
    >
      <div className="bm-ds space-y-6 p-5">
        <section aria-labelledby="sandbox-presets">
          <h3 id="sandbox-presets" className="bm-eyebrow mb-2">Try a sample scenario</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PRESET_SCENARIOS.map(preset => (
              <li key={preset.title}>
                <button
                  type="button"
                  className="w-full rounded-md border border-line bg-surface-2 p-3 text-left hover:border-line-strong hover:bg-sunken"
                  onClick={() => {
                    setText(preset.text);
                    void analyze(preset.text);
                  }}
                >
                  <span className="block text-sm font-semibold text-fg">{preset.title}</span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-fg-3">{preset.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <form
          className="space-y-3 rounded-md border border-line p-4"
          onSubmit={event => {
            event.preventDefault();
            void analyze(text);
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <label htmlFor="sandbox-action" className="text-sm font-semibold text-fg">Action to review</label>
            <label className="flex items-center gap-2 text-xs text-fg-3">
              Role
              <select value={role} onChange={event => setRole(event.target.value)} className="min-h-9 rounded-md border border-line-strong bg-surface px-2 text-sm text-fg">
                {ROLES.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            id="sandbox-action"
            rows={3}
            value={text}
            onChange={event => setText(event.target.value)}
            placeholder="e.g. Pasted a private SSH key into an unapproved code formatting website"
            className="w-full resize-none rounded-md border border-line-strong bg-surface p-3 text-sm text-fg placeholder:text-fg-3"
          />
          <div className="flex justify-end">
            <button type="submit" className="bm-btn bm-btn-primary" disabled={loading || !text.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
              {loading ? 'Reviewing…' : 'Review action'}
            </button>
          </div>
        </form>

        <div aria-live="polite" aria-busy={loading}>
          {result && (
            <section aria-labelledby="sandbox-result" className="bm-pop space-y-4 rounded-md border border-line bg-surface-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 id="sandbox-result" className="bm-h flex flex-wrap items-center gap-2 font-display text-base font-semibold text-fg">
                  <SeverityBadge severity={SEVERITY[result.severity]} />
                  {result.categoryLabel}
                </h3>
                <span className="font-mono text-xs text-fg-3">{source}</span>
              </div>
              <RiskMeter score={result.riskScore} label="Possible impact" />
              <p className="text-sm text-fg">{result.detectedThreat}</p>
              <div className="rounded-md bg-crit-soft p-3">
                <p className="bm-eyebrow text-crit">Possible downstream impact</p>
                <p className="mt-1 text-sm text-fg">{result.blastRadiusAnalysis}</p>
              </div>
              <div className="rounded-md bg-safe-soft p-3">
                <p className="bm-eyebrow text-safe">Recommended next step</p>
                <p className="mt-1 text-sm text-fg">{result.immediateRemediation}</p>
              </div>
              <div>
                <p className="bm-eyebrow">Safer way to work</p>
                <p className="mt-1 text-sm text-fg-2">{result.safeAlternative}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </Dialog>
  );
};
