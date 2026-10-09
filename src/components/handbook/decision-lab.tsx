import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Search } from 'lucide-react';
import { DECISION_LAB_SCENARIOS, DecisionScenario } from '../../data/handbook-lab-content';
import { recordActivity } from '../../services/learning-progress';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { RiskMeter } from '../ui/risk-meter';

interface DecisionLabProps {
  onSelectPolicySection?: (sectionId: string) => void;
}

type Verdict = 'APPROVED' | 'CONDITIONAL' | 'VIOLATION';

interface CustomVerdict {
  verdict: Verdict;
  title: string;
  riskScore: number;
  explanation: string;
  rule: string;
  immediateAction: string;
  contact: string;
}

const VERDICT_STYLE: Record<Verdict, { label: string; chip: string; panel: string }> = {
  APPROVED: { label: 'Approved', chip: 'bm-sev-safe', panel: 'bg-safe-soft' },
  CONDITIONAL: { label: 'Conditional', chip: 'bm-sev-med', panel: 'bg-med-soft' },
  VIOLATION: { label: 'Violation', chip: 'bm-sev-crit', panel: 'bg-crit-soft' },
};

const CUSTOM_RULES: Array<{ words: string[]; result: CustomVerdict }> = [
  {
    words: ['wire', 'routing', 'bank', 'escrow', 'money'],
    result: {
      verdict: 'CONDITIONAL',
      title: 'High-stakes escrow protocol required',
      riskScore: 92,
      explanation: 'Modifying bank wire instructions or releasing escrow funds based on electronic messages is strictly controlled. In-band confirmations are legally prohibited.',
      rule: 'XYZ IT Security v7.0 Section 10 and Anti-Fraud Plan (page 9)',
      immediateAction: 'Make a verbal out-of-band callback using the phone number verified in the original title file. Never call a number found in the email.',
      contact: 'maya.patel@xyz.com and daniel.brooks@xyz.com',
    },
  },
  {
    words: ['chatgpt', 'ai', 'claude', 'llm', 'summarize'],
    result: {
      verdict: 'VIOLATION',
      title: 'Public generative AI data ingestion',
      riskScore: 88,
      explanation: 'Pasting customer deeds, loan amounts, personal information or proprietary contracts into unauthorized consumer AI tools violates XYZ policy and GLBA regulations.',
      rule: 'XYZ IT Security v7.0 Section 1 (page 2) and Code Pillar 6',
      immediateAction: 'Stop input immediately. Request authorization for vetted enterprise AI models through the XYZ AI Council.',
      contact: 'ethan.walker@xyz.com',
    },
  },
  {
    words: ['usb', 'flash', 'thumb drive', 'dropbox', 'google drive', 'icloud'],
    result: {
      verdict: 'VIOLATION',
      title: 'Unapproved removable media or shadow cloud storage',
      riskScore: 84,
      explanation: 'XYZ policy prohibits storing work documents on personal cloud services or unauthorized USB media. Endpoints block unauthorized mass storage.',
      rule: 'XYZ IT Security v7.0 Sections 2 and 6 (pages 3, 6)',
      immediateAction: 'Move files to XYZ Microsoft 365 (OneDrive, SharePoint, Teams) and share with encrypted links.',
      contact: 'maya.patel@xyz.com',
    },
  },
  {
    words: ['lost', 'stolen', 'uber', 'car', 'laptop', 'phone'],
    result: {
      verdict: 'CONDITIONAL',
      title: 'Critical device incident: 1 hour reporting SLA',
      riskScore: 95,
      explanation: 'Lost or stolen XYZ-issued endpoints must be reported to the IT Security Incident Desk within 60 minutes so the remote kill switch can run.',
      rule: 'XYZ IT Security v7.0 Section 9 (page 8)',
      immediateAction: 'Call or email the Security Desk immediately. XYZ enforces zero retaliation for good-faith incident reports.',
      contact: 'maya.patel@xyz.com (mandatory within 1 hour)',
    },
  },
  {
    words: ['gift', 'dinner', 'golf', 'trip', 'vendor', 'bribe'],
    result: {
      verdict: 'VIOLATION',
      title: 'Conflict of interest and bidding integrity',
      riskScore: 78,
      explanation: 'Accepting lavish entertainment, resort stays or personal travel from vendors, especially during an RFP, violates the XYZ Code of Business Conduct.',
      rule: 'XYZ Code of Business Conduct Pillar 5 (page 30)',
      immediateAction: 'Decline the offer in writing, citing XYZ policy, and forward the disclosure to daniel.brooks@xyz.com.',
      contact: 'daniel.brooks@xyz.com',
    },
  },
];

const DEFAULT_VERDICT: CustomVerdict = {
  verdict: 'APPROVED',
  title: 'Standard enterprise workflow',
  riskScore: 15,
  explanation: 'The activity is permissible on XYZ-managed hardware inside the approved Microsoft 365 tenant, while respecting confidentiality standards.',
  rule: 'XYZ IT Security v7.0 Sections 1 and 2',
  immediateAction: 'Follow least-privilege practice and keep project files in team SharePoint.',
  contact: 'maya.patel@xyz.com',
};

/** Maps "...Section 10..." to the handbook vector id "xyz-sec-10". */
function sectionId(policySection: string): string | null {
  const match = policySection.match(/Section\s*(\d+)/i);
  return match ? `xyz-sec-${match[1].padStart(2, '0')}` : null;
}

export const DecisionLab: React.FC<DecisionLabProps> = ({ onSelectPolicySection }) => {
  const [scenarioId, setScenarioId] = useState<string>(DECISION_LAB_SCENARIOS[0].id);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState<CustomVerdict | null>(null);
  const [copied, setCopied] = useState(false);
  const { soundEnabled } = useAlerts();

  const scenario: DecisionScenario = DECISION_LAB_SCENARIOS.find(item => item.id === scenarioId) ?? DECISION_LAB_SCENARIOS[0];
  const option = scenario.options.find(item => item.id === optionId);

  const choose = (id: string) => {
    if (optionId) return;
    setOptionId(id);
    recordActivity();
    const picked = scenario.options.find(item => item.id === id);
    if (soundEnabled) (picked?.verdict === 'APPROVED' ? soundManager.playQuizSuccess() : soundManager.playQuizTryAgain());
  };

  const analyze = (event: React.FormEvent) => {
    event.preventDefault();
    const text = query.toLowerCase();
    if (!text.trim()) return;
    recordActivity();
    const match = CUSTOM_RULES.find(rule => rule.words.some(word => text.includes(word)));
    setCustom(match ? match.result : DEFAULT_VERDICT);
  };

  const copy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bm-ds space-y-5">
      <div>
        <h3 className="bm-h font-display text-xl font-semibold text-fg">Decision lab</h3>
        <p className="mt-1 max-w-2xl text-sm text-fg-3">Pick a high-stakes workplace scenario, choose what you would do, and see the policy verdict, regulatory impact and escalation path.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <div role="radiogroup" aria-label="Scenarios" className="space-y-2">
            {DECISION_LAB_SCENARIOS.map(item => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={item.id === scenarioId}
                onClick={() => {
                  setScenarioId(item.id);
                  setOptionId(null);
                }}
                className={`w-full rounded-lg border p-3 text-left ${item.id === scenarioId ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong'}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="bm-eyebrow">{item.category}</span>
                  <span className={`bm-chip bm-sev ${item.urgency === 'CRITICAL' ? 'bm-sev-crit' : item.urgency === 'HIGH' ? 'bm-sev-high' : 'bm-sev-med'}`}>{item.urgency.charAt(0) + item.urgency.slice(1).toLowerCase()}</span>
                </span>
                <span className="mt-1 block text-sm font-semibold text-fg">{item.title}</span>
              </button>
            ))}
          </div>

          <form onSubmit={analyze} className="space-y-2 rounded-lg border border-line p-3">
            <label htmlFor="whatif" className="text-sm font-semibold text-fg">Custom what-if check</label>
            <textarea
              id="whatif"
              rows={3}
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="e.g. A vendor offered me a golf trip during the RFP"
              className="w-full resize-none rounded-md border border-line-strong bg-surface p-2.5 text-sm text-fg placeholder:text-fg-3"
            />
            <button type="submit" className="bm-btn bm-btn-sm bm-btn-primary w-full" disabled={!query.trim()}>
              <Search className="h-3.5 w-3.5" aria-hidden="true" /> Check policy
            </button>
          </form>
        </div>

        <div className="space-y-4 lg:col-span-8">
          <section aria-labelledby="scenario-title" className="space-y-3 rounded-lg border border-line bg-surface p-5">
            <p className="bm-eyebrow">{scenario.category}</p>
            <h4 id="scenario-title" className="bm-h font-display text-lg font-semibold text-fg">{scenario.title}</h4>
            <p className="text-sm text-fg-2">{scenario.description}</p>
            <p className="rounded-md bg-surface-2 p-3 text-sm text-fg-2">{scenario.context}</p>
            <p className="text-sm font-semibold text-fg">{scenario.userPrompt}</p>

            <div role="radiogroup" aria-label="What would you do?" className="space-y-2">
              {scenario.options.map(item => {
                const chosen = item.id === optionId;
                const style = VERDICT_STYLE[item.verdict];
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={chosen}
                    disabled={optionId !== null}
                    onClick={() => choose(item.id)}
                    className={`w-full rounded-md border p-3 text-left ${chosen ? `border-transparent ${style.panel}` : 'border-line bg-surface hover:border-line-strong'} ${optionId && !chosen ? 'opacity-60' : ''}`}
                  >
                    <span className="block text-sm font-semibold text-fg">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-fg-3">{item.actionDescription}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div aria-live="polite">
            {option && (
              <section className={`bm-pop space-y-3 rounded-lg p-5 ${VERDICT_STYLE[option.verdict].panel}`} aria-labelledby="verdict-title">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 id="verdict-title" className="bm-h flex items-center gap-2 font-display text-lg font-semibold text-fg">
                    <span className={`bm-chip bm-sev ${VERDICT_STYLE[option.verdict].chip}`}>{VERDICT_STYLE[option.verdict].label}</span>
                    {option.verdictTitle}
                  </h4>
                  <span className="font-mono text-sm text-fg-2">{option.scoreDelta > 0 ? `+${option.scoreDelta}` : option.scoreDelta} points</span>
                </div>
                <p className="text-sm text-fg-2"><span className="font-semibold text-fg">Policy:</span> {option.policySection} ({option.policyPage})</p>
                <p className="text-sm text-fg-2"><span className="font-semibold text-fg">Regulatory impact:</span> {option.regulatoryImpact}</p>
                <div>
                  <p className="bm-eyebrow mb-1">What to do</p>
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-fg-2">
                    {option.remediationSteps.map(step => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                  <button type="button" className="bm-btn bm-btn-sm" onClick={() => copy(option.escalationContact)}>
                    {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                    {copied ? 'Copied' : option.escalationContact}
                  </button>
                  <div className="flex gap-2">
                    {onSelectPolicySection && sectionId(option.policySection) && (
                      <button type="button" className="bm-btn bm-btn-sm" onClick={() => onSelectPolicySection(sectionId(option.policySection) as string)}>
                        Open policy <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                    <button type="button" className="bm-btn bm-btn-sm" onClick={() => setOptionId(null)}>Try again</button>
                  </div>
                </div>
              </section>
            )}

            {custom && (
              <section className={`bm-pop mt-4 space-y-3 rounded-lg p-5 ${VERDICT_STYLE[custom.verdict].panel}`} aria-labelledby="custom-verdict">
                <h4 id="custom-verdict" className="bm-h flex flex-wrap items-center gap-2 font-display text-lg font-semibold text-fg">
                  <span className={`bm-chip bm-sev ${VERDICT_STYLE[custom.verdict].chip}`}>{VERDICT_STYLE[custom.verdict].label}</span>
                  {custom.title}
                </h4>
                <RiskMeter score={custom.riskScore} label="Risk score" />
                <p className="text-sm text-fg-2">{custom.explanation}</p>
                <p className="text-sm text-fg-2"><span className="font-semibold text-fg">Rule:</span> {custom.rule}</p>
                <p className="text-sm text-fg-2"><span className="font-semibold text-fg">Do now:</span> {custom.immediateAction}</p>
                <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
                  <button type="button" className="bm-btn bm-btn-sm" onClick={() => copy(custom.contact)}>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" /> {custom.contact}
                  </button>
                  <button type="button" className="bm-btn bm-btn-sm" onClick={() => setCustom(null)}>Dismiss</button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
