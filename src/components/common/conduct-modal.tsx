import React, { useMemo, useState } from 'react';
import { AlertTriangle, Award, Building2, Check, Copy, Cpu, Download, ExternalLink, Eye, FileText, HelpCircle, Mail, PhoneCall, Printer, Scale, Search, ShieldCheck, Target, Users } from 'lucide-react';
import {
  XYZ_CODE_MARKDOWN_EXPORT,
  XYZ_CODE_PILLARS,
  XYZ_CORP_METADATA,
  XYZ_DNA,
  XYZ_ETHICAL_QUESTIONS,
  XYZ_KNOW_THE_CODE_SCENARIOS,
} from '../../data/conduct-content';
import { recordActivity } from '../../services/learning-progress';
import { soundManager } from '../../services/sound-effects';
import { Dialog } from '../ui/dialog';
import { BrandMark } from '../shell/brand-mark';

interface ConductModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: string;
  initialPillarId?: string;
  onOpenMasterQuiz?: () => void;
}

type Tab = 'pillars' | 'ethicalDecision' | 'knowTheCode' | 'ceoAndDna' | 'hotlines' | 'fullDocument';

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: 'pillars', label: '7 core pillars', icon: <Scale className="h-4 w-4" aria-hidden="true" /> },
  { id: 'ethicalDecision', label: '8-question test', icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
  { id: 'knowTheCode', label: 'Know the code', icon: <HelpCircle className="h-4 w-4" aria-hidden="true" /> },
  { id: 'ceoAndDna', label: 'CEO message and DNA', icon: <Users className="h-4 w-4" aria-hidden="true" /> },
  { id: 'hotlines', label: 'Speak up', icon: <PhoneCall className="h-4 w-4" aria-hidden="true" /> },
  { id: 'fullDocument', label: 'Full text', icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
];

const CHANNELS = [
  { tag: '100% anonymous, 24/7', title: 'EthicsPoint independent hotline', icon: <PhoneCall className="h-4 w-4" aria-hidden="true" />, text: 'Operated by an independent third party. Report online or by phone any time.', links: [['Phone', 'tel:8005550199', '(800) 555-0199'], ['Online', 'https://www.ethicspoint.com', 'www.ethicspoint.com']] },
  { tag: 'Direct compliance', title: 'XYZ Compliance Officer', icon: <Mail className="h-4 w-4" aria-hidden="true" />, text: 'Confidential contact for code clarifications, conflict of interest disclosures and policy interpretation.', links: [['Email', 'mailto:daniel.brooks@xyz.com', 'daniel.brooks@xyz.com']] },
  { tag: 'Legal counsel', title: 'XYZ Legal Department', icon: <Scale className="h-4 w-4" aria-hidden="true" />, text: 'Legal notices, trade sanctions (OFAC) clearance, anti-boycott inquiries, antitrust reviews and litigation matters.', links: [['Email', 'mailto:sofia.ramirez@xyz.com', 'sofia.ramirez@xyz.com']] },
  { tag: 'Emerging tech governance', title: 'XYZ AI Council', icon: <Cpu className="h-4 w-4" aria-hidden="true" />, text: 'Mandatory consultation before adopting any new generative AI tool or starting an AI-assisted initiative.', links: [['Email', 'mailto:ethan.walker@xyz.com', 'ethan.walker@xyz.com']] },
];

export const ConductModal: React.FC<ConductModalProps> = ({ isOpen, onClose, userName = 'XYZ Associate', userRole = 'Operations Specialist', initialPillarId, onOpenMasterQuiz }) => {
  const [tab, setTab] = useState<Tab>('pillars');
  const [pillarId, setPillarId] = useState<string>(initialPillarId || 'pillar-1');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [scenarioFilter, setScenarioFilter] = useState('ALL');
  const [openScenario, setOpenScenario] = useState<string | null>(null);
  const [signed, setSigned] = useState<boolean>(() => localStorage.getItem('xyz_code_conduct_pledge_signed') === 'true');

  const pillar = useMemo(() => XYZ_CODE_PILLARS.find(item => item.id === pillarId) ?? XYZ_CODE_PILLARS[0], [pillarId]);
  const subtopics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return pillar.subtopics;
    return pillar.subtopics.filter(sub => sub.title.toLowerCase().includes(needle) || sub.summary.toLowerCase().includes(needle) || sub.keyRules.some(rule => rule.toLowerCase().includes(needle)));
  }, [pillar, query]);
  const scenarios = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return XYZ_KNOW_THE_CODE_SCENARIOS.filter(item => {
      if (scenarioFilter !== 'ALL' && item.pillarId !== scenarioFilter) return false;
      return !needle || [item.topicTitle, item.question, item.explanation, item.answer].some(field => field.toLowerCase().includes(needle));
    });
  }, [scenarioFilter, query]);
  const scenarioPillars = useMemo(() => {
    const seen = new Map<string, string>();
    XYZ_KNOW_THE_CODE_SCENARIOS.forEach(item => seen.set(item.pillarId, item.pillarTitle));
    return Array.from(seen.entries());
  }, []);

  const answered = Object.keys(answers).length;
  const anyYes = Object.values(answers).some(value => value);

  const download = () => {
    const blob = new Blob([XYZ_CODE_MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'xyz-our-code-of-business-conduct.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copy = () => {
    void navigator.clipboard.writeText(XYZ_CODE_MARKDOWN_EXPORT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const togglePledge = () => {
    const next = !signed;
    setSigned(next);
    try {
      localStorage.setItem('xyz_code_conduct_pledge_signed', String(next));
    } catch {
      // ignore
    }
    if (next) {
      recordActivity();
      soundManager.playSuccess();
      setShowCertificate(true);
    }
  };

  const answerEthics = (id: string, yes: boolean) => {
    setAnswers(previous => ({ ...previous, [id]: yes }));
    recordActivity();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        title="Our Code of Business Conduct"
        description={`${XYZ_CORP_METADATA.tagline} · Est. ${XYZ_CORP_METADATA.founded}`}
        size="xl"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={signed} onChange={togglePledge} className="h-5 w-5 accent-[var(--bm-accent)]" />
              <span className="text-fg">Sign the integrity pledge <span className="text-fg-3">· Hotline (800) 555-0199</span></span>
            </label>
            <div className="flex flex-wrap gap-2">
              {signed && <button type="button" className="bm-btn bm-btn-sm" onClick={() => setShowCertificate(true)}><Award className="h-3.5 w-3.5" aria-hidden="true" /> Certificate</button>}
              {onOpenMasterQuiz && <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onOpenMasterQuiz}><Award className="h-3.5 w-3.5" aria-hidden="true" /> Take the exam</button>}
              <button type="button" className="bm-btn bm-btn-sm" onClick={download}><Download className="h-3.5 w-3.5" aria-hidden="true" /> Download</button>
              <button type="button" className="bm-btn bm-btn-sm" onClick={copy}>{copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}{copied ? 'Copied' : 'Copy'}</button>
            </div>
          </div>
        }
      >
        <div className="bm-ds">
          <div className="sticky top-0 z-10 border-b border-line bg-surface px-4 pt-2 sm:px-6">
            <div role="tablist" aria-label="Code of conduct sections" className="-mb-px flex gap-1 overflow-x-auto">
              {TABS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`coc-tab-${item.id}`}
                  aria-selected={tab === item.id}
                  aria-controls="coc-panel"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium ${tab === item.id ? 'border-accent text-accent-text' : 'border-transparent text-fg-3 hover:text-fg'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div id="coc-panel" role="tabpanel" aria-labelledby={`coc-tab-${tab}`} className="p-4 sm:p-6">
            {(tab === 'pillars' || tab === 'knowTheCode') && (
              <label className="relative mb-5 block max-w-md">
                <span className="sr-only">Search</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
                <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search directives, policies, topics…" className="min-h-10 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-3" />
              </label>
            )}

            {tab === 'pillars' && (
              <div className="grid gap-5 lg:grid-cols-12">
                <nav aria-label="Pillars" className="lg:col-span-4">
                  <ul className="space-y-2">
                    {XYZ_CODE_PILLARS.map(item => (
                      <li key={item.id}>
                        <button type="button" aria-current={item.id === pillar.id ? 'true' : undefined} onClick={() => setPillarId(item.id)} className={`w-full rounded-lg border p-3 text-left ${item.id === pillar.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong'}`}>
                          <span className="flex items-center justify-between text-xs text-fg-3"><span className="bm-chip">Pillar {item.number}</span><span>{item.pageRange}</span></span>
                          <span className="mt-1.5 block text-sm font-semibold text-fg">{item.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-xs text-fg-3">{item.summary}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="space-y-5 lg:col-span-8">
                  <header className="space-y-3 rounded-lg border border-line bg-surface p-5">
                    <p className="bm-eyebrow">Chapter {pillar.number} · {pillar.pageRange}</p>
                    <h3 className="bm-h font-display text-2xl font-semibold text-fg">{pillar.title}</h3>
                    <p className="text-sm italic text-fg-2">“{pillar.tagline}”</p>
                    <p className="text-sm text-fg-2">{pillar.summary}</p>
                    <div className="border-t border-line pt-3">
                      <p className="bm-eyebrow mb-2">Core directives</p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {pillar.corePillars.map(rule => (
                          <li key={rule} className="flex items-start gap-2 text-sm text-fg"><Check className="mt-0.5 h-4 w-4 shrink-0 text-safe" aria-hidden="true" />{rule}</li>
                        ))}
                      </ul>
                    </div>
                  </header>
                  <section aria-labelledby="coc-subtopics" className="space-y-3">
                    <h4 id="coc-subtopics" className="bm-eyebrow">In-depth policy sections ({subtopics.length})</h4>
                    {subtopics.length === 0 && <p className="rounded-md border border-dashed border-line-strong p-4 text-sm text-fg-3">No sections match your search.</p>}
                    {subtopics.map(sub => (
                      <article key={sub.id} className="space-y-2 rounded-lg border border-line bg-surface p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-semibold text-fg">{sub.title}</h5>
                          <span className="bm-chip shrink-0">Page {sub.page}</span>
                        </div>
                        <p className="text-sm text-fg-2">{sub.summary}</p>
                        <ul className="list-disc space-y-1 border-t border-line pl-5 pt-2 text-sm text-fg-2">
                          {sub.keyRules.map(rule => (
                            <li key={rule}>{rule}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </section>
                </div>
              </div>
            )}

            {tab === 'ethicalDecision' && (
              <div className="mx-auto max-w-4xl space-y-5">
                <header className="space-y-2 text-center">
                  <p className="bm-eyebrow">Official framework · page 5</p>
                  <h3 className="bm-h font-display text-2xl font-semibold text-fg">We make ethical decisions</h3>
                  <p className="mx-auto max-w-2xl text-sm text-fg-2">If you are uncertain about a decision, ask yourself these eight questions. If the answer to any of them is <strong>yes</strong>, step back and reconsider, then seek guidance from a manager, a Compliance Officer or the Legal Department.</p>
                </header>
                <div aria-live="polite">
                  {answered > 0 && (
                    <div className={`flex items-start justify-between gap-3 rounded-lg p-4 text-sm ${anyYes ? 'bg-crit-soft' : 'bg-safe-soft'}`}>
                      <p className="flex items-start gap-2 text-fg">
                        {anyYes ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-crit" aria-hidden="true" /> : <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-safe" aria-hidden="true" />}
                        <span><strong>{anyYes ? 'Pause and reconsider.' : 'All answered no.'}</strong> {anyYes ? 'You flagged at least one concern. Consult daniel.brooks@xyz.com or your manager before acting.' : 'Your decision lines up with XYZ ethical safeguards.'} ({answered} of {XYZ_ETHICAL_QUESTIONS.length} answered)</span>
                      </p>
                      <button type="button" className="bm-btn bm-btn-sm shrink-0" onClick={() => setAnswers({})}>Reset</button>
                    </div>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {XYZ_ETHICAL_QUESTIONS.map(question => {
                    const value = answers[question.id];
                    return (
                      <section key={question.id} aria-labelledby={`q-${question.id}`} className={`space-y-3 rounded-lg border p-4 ${value === true ? 'border-transparent bg-crit-soft' : value === false ? 'border-transparent bg-safe-soft' : 'border-line bg-surface'}`}>
                        <p className="bm-eyebrow">Question {question.number} · {question.category}</p>
                        <h4 id={`q-${question.id}`} className="text-sm font-semibold text-fg">“{question.question}”</h4>
                        <p className="text-xs text-fg-3">{question.riskIfYes}</p>
                        <div role="radiogroup" aria-labelledby={`q-${question.id}`} className="flex gap-2">
                          <button type="button" role="radio" aria-checked={value === true} onClick={() => answerEthics(question.id, true)} className={`bm-btn flex-1 ${value === true ? '!border-crit !bg-crit !text-surface' : ''}`}>Yes</button>
                          <button type="button" role="radio" aria-checked={value === false} onClick={() => answerEthics(question.id, false)} className={`bm-btn flex-1 ${value === false ? '!border-safe !bg-safe !text-surface' : ''}`}>No</button>
                        </div>
                        {value === true && <p className="rounded-md bg-surface p-2.5 text-xs text-fg"><strong>Next action:</strong> {question.guidance}</p>}
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === 'knowTheCode' && (
              <div className="mx-auto max-w-5xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="bm-h font-display text-xl font-semibold text-fg">Know the code scenarios</h3>
                    <p className="text-sm text-fg-3">Real ethics and compliance dilemmas from the Code of Business Conduct.</p>
                  </div>
                  <div role="radiogroup" aria-label="Filter scenarios" className="flex flex-wrap gap-1.5">
                    {[['ALL', `All (${XYZ_KNOW_THE_CODE_SCENARIOS.length})`], ...scenarioPillars].map(([id, label]) => (
                      <button key={id} type="button" role="radio" aria-checked={scenarioFilter === id} onClick={() => setScenarioFilter(id)} className={`min-h-8 rounded-md border px-2.5 text-xs font-semibold ${scenarioFilter === id ? 'border-accent bg-accent-soft text-accent-text' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {scenarios.map(item => {
                    const open = openScenario === item.id;
                    return (
                      <article key={item.id} className="flex flex-col justify-between gap-4 rounded-lg border border-line bg-surface p-5">
                        <div className="space-y-2">
                          <p className="bm-eyebrow">Page {item.page} · {item.pillarTitle}</p>
                          <h4 className="text-sm font-semibold text-fg">“{item.question}”</h4>
                        </div>
                        {!open ? (
                          <button type="button" className="bm-btn bm-btn-sm w-full" onClick={() => setOpenScenario(item.id)}><Eye className="h-3.5 w-3.5" aria-hidden="true" /> Show official guidance</button>
                        ) : (
                          <div className="bm-pop space-y-3 border-t border-line pt-3 text-sm">
                            <p className="rounded-md bg-accent-soft p-3 font-semibold text-fg">{item.answer}</p>
                            <p className="text-fg-2">{item.explanation}</p>
                            <ul className="list-disc space-y-1 pl-5 text-fg-2">
                              {item.actionProtocol.map(step => (
                                <li key={step}>{step}</li>
                              ))}
                            </ul>
                            <div className="flex items-center justify-between gap-2 text-xs text-fg-3">
                              <span>Escalate to: <strong className="text-fg-2">{item.relevantContact}</strong></span>
                              <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={() => setOpenScenario(null)}>Hide</button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === 'ceoAndDna' && (
              <div className="mx-auto max-w-4xl space-y-8">
                <article className="space-y-4 rounded-lg border border-line bg-surface p-6">
                  <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                    <div>
                      <p className="bm-eyebrow">Executive message · page ii</p>
                      <h3 className="bm-h font-display text-2xl font-semibold text-fg">A message from our CEO</h3>
                    </div>
                    <p className="text-sm text-fg"><strong>{XYZ_CORP_METADATA.leadership.ceo}</strong><span className="block text-xs text-fg-3">{XYZ_CORP_METADATA.leadership.ceoTitle}</span></p>
                  </header>
                  <div className="space-y-3 text-sm leading-relaxed text-fg-2">
                    <p>At XYZ, we are committed to becoming the <strong>Premier Title Services Company</strong>. That is the mission and vision that unites and drives our people every day to uphold our reputation, serve our customers with excellence and remain open to new thinking that fuels innovation.</p>
                    <p>Our success over the past <strong>130-plus years</strong> has been built on a foundation of values and principles that we call our <strong>XYZ DNA</strong>. These are the attributes we hold ourselves and each other to, ensuring that we operate with the highest standards of integrity, responsibility and respect.</p>
                    <p>As you review our Code of Business Conduct and Ethics, understand it is not only a reflection of our past but a blueprint for how we will continue to thrive in the future. It is our commitment to always doing the right thing and maintaining the highest ethical standards and practices in all aspects of our work, protecting our people and serving our customers.</p>
                    <p>In following our Code, we are ensuring <em>integrity is at home here</em> by reinforcing our reputation for honesty, fairness and trustworthiness that our customers expect. We encourage our employees to speak up without fear of retaliation or retribution. Our integrity has made us a trusted name in the title industry for more than a century.</p>
                  </div>
                  <p className="border-t border-line pt-3 text-xs text-fg-3">Founded 1893 · Anytown, USA</p>
                </article>
                <section aria-labelledby="coc-dna" className="space-y-4">
                  <div className="text-center">
                    <h4 id="coc-dna" className="bm-h font-display text-xl font-semibold text-fg">Our culture and the XYZ DNA</h4>
                    <p className="text-sm text-fg-3">Five foundational values that guide our actions and decisions.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {XYZ_DNA.map((dna, index) => (
                      <div key={dna.id} className="space-y-2 rounded-lg border border-line bg-surface p-5">
                        <div className="flex items-center justify-between"><span className="bm-chip">DNA {index + 1}</span><Target className="h-4 w-4 text-accent-text" aria-hidden="true" /></div>
                        <h5 className="text-sm font-semibold text-fg">{dna.title}</h5>
                        <p className="text-sm text-fg-3">{dna.shortDesc}</p>
                      </div>
                    ))}
                    <div className="space-y-2 rounded-lg border border-line bg-surface-2 p-5 text-sm text-fg-2">
                      <p className="flex items-center gap-2 font-semibold text-fg"><Building2 className="h-4 w-4 text-accent-text" aria-hidden="true" /> Corporate headquarters</p>
                      <p>{XYZ_CORP_METADATA.headquarters.address}</p>
                      <p>{XYZ_CORP_METADATA.headquarters.cityStateZip}</p>
                      <p className="font-mono">{XYZ_CORP_METADATA.headquarters.phone}</p>
                      <p className="text-xs text-fg-3">{XYZ_CORP_METADATA.copyright}</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {tab === 'hotlines' && (
              <div className="mx-auto max-w-4xl space-y-5">
                <header className="space-y-2 rounded-lg bg-safe-soft p-6 text-center">
                  <p className="bm-eyebrow text-safe">Strict no-retaliation policy</p>
                  <h3 className="bm-h font-display text-2xl font-semibold text-fg">How to report concerns at XYZ</h3>
                  <p className="mx-auto max-w-2xl text-sm text-fg-2">We speak up against disrespectful, unethical or unlawful conduct without fear of retaliation. XYZ investigates suspected misconduct and protects everyone who speaks up in good faith.</p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                  {CHANNELS.map(channel => (
                    <section key={channel.title} className="space-y-3 rounded-lg border border-line bg-surface p-5" aria-label={channel.title}>
                      <div className="flex items-center justify-between"><span className="bm-chip">{channel.tag}</span><span className="text-accent-text">{channel.icon}</span></div>
                      <h4 className="text-sm font-semibold text-fg">{channel.title}</h4>
                      <p className="text-sm text-fg-3">{channel.text}</p>
                      <dl className="space-y-1 rounded-md bg-surface-2 p-3 font-mono text-xs">
                        {channel.links.map(([label, href, text]) => (
                          <div key={href} className="flex items-center justify-between gap-2">
                            <dt className="text-fg-3">{label}</dt>
                            <dd><a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className="inline-flex items-center gap-1 text-accent-text underline">{text}{href.startsWith('http') && <ExternalLink className="h-3 w-3" aria-hidden="true" />}</a></dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  ))}
                </div>
              </div>
            )}

            {tab === 'fullDocument' && (
              <div className="mx-auto max-w-4xl space-y-4">
                <p className="text-sm text-fg-3">Complete text compiled from all 61 pages of the official document.</p>
                <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-surface-2 p-5 font-mono text-xs leading-relaxed text-fg-2" tabIndex={0}>{XYZ_CODE_MARKDOWN_EXPORT}</pre>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isOpen && showCertificate}
        onClose={() => setShowCertificate(false)}
        title="Integrity pledge certificate"
        description="XYZ Code of Business Conduct compliance pledge"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="bm-btn" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden="true" /> Print</button>
            <button type="button" className="bm-btn bm-btn-primary" onClick={() => setShowCertificate(false)}>Done</button>
          </div>
        }
      >
        <div className="bm-ds p-5">
          <div id="bm-certificate" className="mx-auto max-w-xl space-y-4 rounded-xl border-2 border-line-strong bg-surface p-6 text-center">
            <div className="flex justify-center"><BrandMark size={34} withWordmark={false} /></div>
            <p className="bm-eyebrow">Integrity is at home here</p>
            <h3 className="bm-h font-display text-2xl font-semibold text-fg">Code of Business Conduct pledge</h3>
            <p className="text-sm text-fg-3">Signed by</p>
            <p className="bm-h font-display text-2xl font-semibold text-fg">{userName}</p>
            <p className="text-sm text-fg-3">{userRole}</p>
            <p className="mx-auto max-w-md text-sm text-fg-2">I commit to acting with integrity, speaking up without fear of retaliation, and following XYZ's Code of Business Conduct.</p>
            <p className="text-xs text-fg-3">Issued by a local training simulation. Not an official credential. · EthicsPoint (800) 555-0199</p>
          </div>
        </div>
      </Dialog>
    </>
  );
};