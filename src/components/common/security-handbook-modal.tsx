import React, { useEffect, useMemo, useState } from 'react';
import { Award, BookOpen, Check, ClipboardCheck, Copy, Download, FileText, HelpCircle, Printer, Scale, Search, Zap } from 'lucide-react';
import { HANDBOOK_VECTORS, HANDBOOK_MARKDOWN_EXPORT } from '../../data/handbook-content';
import { soundManager } from '../../services/sound-effects';
import { recordActivity } from '../../services/learning-progress';
import { DecisionLab } from '../handbook/decision-lab';
import { PolicyAssistant } from '../handbook/policy-assistant';
import { Flashcards } from '../handbook/flashcards';
import { ReadinessAudit } from '../handbook/readiness-audit';
import { HandbookDetail } from '../handbook/handbook-detail';
import { HandbookDocument } from '../handbook/handbook-document';
import { BrandMark } from '../shell/brand-mark';
import { Dialog } from '../ui/dialog';
import { SeverityBadge } from '../ui/severity';

export type HandbookViewMode = 'interactive' | 'decisionLab' | 'policyAssistant' | 'Flashcards' | 'readinessAudit' | 'fullDocument';

interface SecurityHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  userName?: string;
  initialVectorId?: string;
  onTrackOnRadar?: (vectorId: string) => void;
  onOpenCodeOfConduct?: () => void;
  onOpenMasterQuiz?: () => void;
  /** Opens on a specific learning mode (e.g. the policy assistant). */
  initialViewMode?: HandbookViewMode;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All sections' },
  { id: 'Information Classification', label: '1 Classification' },
  { id: 'Information Protection', label: '2 Protection' },
  { id: 'Authentication & Access', label: '3 Authentication' },
  { id: 'Ownership & Privacy', label: '4 Privacy' },
  { id: 'AI & Machine Learning', label: '5 AI and LLMs' },
  { id: 'Device Management', label: '6 Devices' },
  { id: 'Network & Remote Access', label: '7 Network' },
  { id: 'Cloud & Applications', label: '8 Cloud' },
  { id: 'Incident Reporting', label: '9 Incidents' },
  { id: 'Enforcement & Discipline', label: '10 Enforcement' },
];

function resolveVectorId(id?: string): string {
  if (!id) return HANDBOOK_VECTORS[0].id;
  const direct = HANDBOOK_VECTORS.find(vector => vector.id === id);
  if (direct) return direct.id;
  return HANDBOOK_VECTORS.find(vector => vector.aliases?.includes(id))?.id ?? HANDBOOK_VECTORS[0].id;
}

function loadAuditScore(): number {
  try {
    const saved = localStorage.getItem('xyz_sentinel_audit_checks');
    if (saved) return Math.min(100, (JSON.parse(saved) as string[]).length * 10);
  } catch {
    // fall through
  }
  return 40;
}

export const SecurityHandbookModal: React.FC<SecurityHandbookModalProps> = ({
  isOpen,
  onClose,
  userRole = 'XYZ Associate',
  userName = 'Security Sentinel',
  initialVectorId,
  onTrackOnRadar,
  onOpenCodeOfConduct,
  onOpenMasterQuiz,
  initialViewMode,
}) => {
  const [viewMode, setViewMode] = useState<HandbookViewMode>('interactive');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [selectedId, setSelectedId] = useState(() => resolveVectorId(initialVectorId));
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [pledgeSigned, setPledgeSigned] = useState<boolean>(() => localStorage.getItem('xyz_policy_pledge_signed') === 'true');
  const [auditScore, setAuditScore] = useState<number>(loadAuditScore);
  const [showCredential, setShowCredential] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialVectorId) setSelectedId(resolveVectorId(initialVectorId));
  }, [initialVectorId]);

  useEffect(() => {
    if (isOpen && initialViewMode) setViewMode(initialViewMode);
  }, [isOpen, initialViewMode]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return HANDBOOK_VECTORS.filter(vector => {
      if (category !== 'ALL' && vector.category !== category) return false;
      if (!needle) return true;
      return (
        vector.title.toLowerCase().includes(needle) ||
        vector.category.toLowerCase().includes(needle) ||
        vector.howBreachOccurs.summary.toLowerCase().includes(needle) ||
        vector.howBreachOccurs.commonScenarios.some(item => item.toLowerCase().includes(needle)) ||
        vector.howToPrevent.goldenRules.some(item => item.toLowerCase().includes(needle))
      );
    });
  }, [query, category]);

  const active = HANDBOOK_VECTORS.find(vector => vector.id === selectedId) ?? filtered[0] ?? HANDBOOK_VECTORS[0];
  const mastered = Object.keys(quizAnswers).filter(id => {
    const vector = HANDBOOK_VECTORS.find(item => item.id === id);
    return vector !== undefined && quizAnswers[id] === vector.quiz.correctIndex;
  }).length;
  const rank = auditScore >= 90 && mastered >= 8 ? 'Level 3 Apex Guardian' : auditScore >= 70 ? 'Level 2 Enterprise Defender' : 'Level 1 Security Sentinel';

  const download = () => {
    const blob = new Blob([HANDBOOK_MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'xyz-information-technology-security-and-usage-v7.0.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyMarkdown = () => {
    void navigator.clipboard.writeText(HANDBOOK_MARKDOWN_EXPORT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const togglePledge = () => {
    const next = !pledgeSigned;
    setPledgeSigned(next);
    try {
      localStorage.setItem('xyz_policy_pledge_signed', String(next));
    } catch {
      // ignore
    }
    if (next) {
      recordActivity();
      soundManager.playSuccess();
    }
  };

  const answer = (vectorId: string, optionIndex: number) => {
    setQuizAnswers(previous => ({ ...previous, [vectorId]: optionIndex }));
    recordActivity();
    const vector = HANDBOOK_VECTORS.find(item => item.id === vectorId);
    if (vector) (optionIndex === vector.quiz.correctIndex ? soundManager.playQuizSuccess() : soundManager.playQuizTryAgain());
  };

  const openSection = (id: string) => {
    setSelectedId(id);
    setViewMode('interactive');
  };

  const modes: Array<{ id: HandbookViewMode; label: string; icon: React.ReactNode }> = [
    { id: 'interactive', label: 'Policy sections', icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
    { id: 'decisionLab', label: 'Decision practice', icon: <Scale className="h-4 w-4" aria-hidden="true" /> },
    { id: 'policyAssistant', label: 'Ask a question', icon: <HelpCircle className="h-4 w-4" aria-hidden="true" /> },
    { id: 'Flashcards', label: 'Quick review', icon: <Zap className="h-4 w-4" aria-hidden="true" /> },
    { id: 'readinessAudit', label: `Readiness check (${auditScore}%)`, icon: <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> },
    { id: 'fullDocument', label: 'Full policy', icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
  ];

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        title="IT security and usage handbook"
        description="XYZ Information Services Corporation · Information Technology Security and Usage Policy v7.0 (revised 04/01/2026)"
        size="xl"
      >
        <div className="bm-ds">
          <div className="sticky top-0 z-10 space-y-3 border-b border-line bg-surface px-4 pb-0 pt-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="bm-chip">{mastered} of 10 quizzes mastered · {auditScore}% audit</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="bm-btn bm-btn-sm" onClick={() => setShowCredential(true)}><Award className="h-3.5 w-3.5" aria-hidden="true" /> Credential</button>
                {onOpenCodeOfConduct && <button type="button" className="bm-btn bm-btn-sm" onClick={onOpenCodeOfConduct}><Scale className="h-3.5 w-3.5" aria-hidden="true" /> Code of conduct</button>}
                {onOpenMasterQuiz && <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onOpenMasterQuiz}><Award className="h-3.5 w-3.5" aria-hidden="true" /> Take the exam</button>}
                <button type="button" className="bm-btn bm-btn-sm" onClick={download}><Download className="h-3.5 w-3.5" aria-hidden="true" /> Export</button>
                <button type="button" className="bm-btn bm-btn-sm" onClick={copyMarkdown}>{copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}{copied ? 'Copied' : 'Copy'}</button>
              </div>
            </div>
            <div role="tablist" aria-label="Handbook modes" className="-mb-px flex gap-1 overflow-x-auto">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  id={`hb-mode-${mode.id}`}
                  aria-selected={viewMode === mode.id}
                  aria-controls="hb-mode-panel"
                  onClick={() => setViewMode(mode.id)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium ${viewMode === mode.id ? 'border-accent text-accent-text' : 'border-transparent text-fg-3 hover:text-fg'}`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div id="hb-mode-panel" role="tabpanel" aria-labelledby={`hb-mode-${viewMode}`} className="p-4 sm:p-6">
            {viewMode === 'fullDocument' && <HandbookDocument onOpenSection={openSection} />}
            {viewMode === 'decisionLab' && <DecisionLab onSelectPolicySection={openSection} />}
            {viewMode === 'policyAssistant' && <PolicyAssistant onSelectSection={openSection} />}
            {viewMode === 'Flashcards' && <Flashcards />}
            {viewMode === 'readinessAudit' && <ReadinessAudit onAuditScoreChange={setAuditScore} onOpenCertificate={() => setShowCredential(true)} />}

            {viewMode === 'interactive' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <label className="relative block flex-1">
                    <span className="sr-only">Search the policy</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
                    <input
                      type="search"
                      value={query}
                      onChange={event => setQuery(event.target.value)}
                      placeholder="Search policies, prohibited activities, MFA, AI rules…"
                      className="min-h-10 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-3"
                    />
                  </label>
                  <div role="radiogroup" aria-label="Filter by topic" className="flex gap-1 overflow-x-auto pb-1">
                    {CATEGORIES.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={category === item.id}
                        onClick={() => setCategory(item.id)}
                        className={`min-h-8 shrink-0 rounded-md border px-2.5 text-xs font-semibold ${category === item.id ? 'border-accent bg-accent-soft text-accent-text' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-12">
                  <nav aria-label="Policy sections" className="lg:col-span-4">
                    <p className="bm-eyebrow mb-2">Sections ({filtered.length} of {HANDBOOK_VECTORS.length})</p>
                    {filtered.length === 0 && <p className="rounded-md border border-dashed border-line-strong p-4 text-sm text-fg-3">No sections match. Clear the search or filter.</p>}
                    <ul className="max-h-[60vh] space-y-2 overflow-y-auto pr-1" tabIndex={0} aria-label="Section list">
                      {filtered.map(vector => (
                        <li key={vector.id}>
                          <button
                            type="button"
                            aria-current={vector.id === active.id ? 'true' : undefined}
                            onClick={() => setSelectedId(vector.id)}
                            className={`w-full rounded-lg border p-3 text-left ${vector.id === active.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong'}`}
                          >
                            <span className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs text-fg-3">Section {vector.sectionNumber}</span>
                              <SeverityBadge severity={vector.riskLevel} />
                            </span>
                            <span className="mt-1 block text-sm font-semibold text-fg">{vector.title}</span>
                            <span className="mt-0.5 line-clamp-2 block text-xs text-fg-3">{vector.howBreachOccurs.summary}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="min-w-0 lg:col-span-8">
                    <HandbookDetail
                      vector={active}
                      quizAnswers={quizAnswers}
                      onAnswer={answer}
                      onTrackOnRadar={onTrackOnRadar}
                      pledgeSigned={pledgeSigned}
                      onTogglePledge={togglePledge}
                      onOpenCredential={() => setShowCredential(true)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isOpen && showCredential}
        onClose={() => setShowCredential(false)}
        title="Information security sentinel credential"
        description="IT Security and Usage Policy v7.0 certification summary"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="bm-btn" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden="true" /> Print</button>
            <button type="button" className="bm-btn bm-btn-primary" onClick={() => setShowCredential(false)}>Back to handbook</button>
          </div>
        }
      >
        <div className="bm-ds p-5">
          <div id="bm-certificate" className="mx-auto max-w-xl space-y-5 rounded-xl border-2 border-line-strong bg-surface p-6 text-center">
            <div className="flex justify-center"><BrandMark size={34} withWordmark={false} /></div>
            <div>
              <p className="bm-eyebrow">XYZ Information Services Corporation</p>
              <h3 className="bm-h mt-1 font-display text-2xl font-semibold text-fg">Information Security Sentinel</h3>
            </div>
            <div>
              <p className="text-sm text-fg-3">Awarded to</p>
              <p className="bm-h font-display text-2xl font-semibold text-fg">{userName}</p>
              <p className="text-sm text-fg-3">{userRole} · <span className="font-semibold text-fg-2">{rank}</span></p>
            </div>
            <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4 text-left">
              <div><dt className="bm-eyebrow">Quizzes</dt><dd className="mt-0.5 font-mono text-sm text-fg">{mastered} / 10</dd></div>
              <div><dt className="bm-eyebrow">Audit</dt><dd className="mt-0.5 font-mono text-sm text-fg">{auditScore}%</dd></div>
              <div><dt className="bm-eyebrow">Pledge</dt><dd className="mt-0.5 font-mono text-sm text-fg">{pledgeSigned ? 'Signed' : 'Pending'}</dd></div>
            </dl>
            <p className="text-left text-xs text-fg-3">Contacts: maya.patel@xyz.com (within 1 hour for critical issues) · EthicsPoint hotline (800) 555-0199.</p>
            <p className="text-xs text-fg-3">Issued by a local training simulation. Not an official credential.</p>
          </div>
        </div>
      </Dialog>
    </>
  );
};
