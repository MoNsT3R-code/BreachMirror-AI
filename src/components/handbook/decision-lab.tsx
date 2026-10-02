import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  PhoneCall, 
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Building2,
  Gauge
} from 'lucide-react';
import { DECISION_LAB_SCENARIOS, DecisionScenario } from '../../data/handbook-lab-content';
import { soundManager } from '../../services/sound-effects';

interface DecisionLabProps {
  onSelectPolicySection?: (sectionId: string) => void;
}

export const DecisionLab: React.FC<DecisionLabProps> = ({
  onSelectPolicySection
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DECISION_LAB_SCENARIOS[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [customVerdict, setCustomVerdict] = useState<{
    verdict: 'APPROVED' | 'CONDITIONAL' | 'VIOLATION';
    title: string;
    riskScore: number;
    explanation: string;
    rule: string;
    immediateAction: string;
    contact: string;
  } | null>(null);
  const [isCopiedContact, setIsCopiedContact] = useState<boolean>(false);

  const activeScenario: DecisionScenario = 
    DECISION_LAB_SCENARIOS.find(s => s.id === selectedScenarioId) || DECISION_LAB_SCENARIOS[0];

  const selectedOption = activeScenario.options.find(o => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    const opt = activeScenario.options.find(o => o.id === optId);
    if (opt?.verdict === 'APPROVED') {
      soundManager.playQuizSuccess();
    } else {
      soundManager.playQuizTryAgain();
    }
  };

  const handleAnalyzeCustomScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    soundManager.playTargetLock();
    const q = customQuery.toLowerCase();

    // Semantic rule evaluation against Stewart policies
    if (q.includes('wire') || q.includes('routing') || q.includes('bank') || q.includes('escrow') || q.includes('money')) {
      setCustomVerdict({
        verdict: 'CONDITIONAL',
        title: 'High-Stakes Financial Escrow Protocol Required',
        riskScore: 92,
        explanation: 'Modifying bank wire instructions or releasing escrow funds based on electronic messages is strictly controlled. In-band confirmations are legally prohibited.',
        rule: 'Stewart IT Security v7.0 §Section 10 & Anti-Fraud Plan (Page 9)',
        immediateAction: 'Execute mandatory verbal out-of-band callback using the phone number verified in the original title file. Never call phone numbers inside the email.',
        contact: 'itsecurity@stewart.com & ethics@stewart.com'
      });
    } else if (q.includes('chatgpt') || q.includes('ai') || q.includes('claude') || q.includes('llm') || q.includes('summarize')) {
      setCustomVerdict({
        verdict: 'VIOLATION',
        title: 'Public Generative AI Data Ingestion Violation',
        riskScore: 88,
        explanation: 'Pasting customer deeds, loan amounts, personal identifying information (PII), or proprietary contracts into unauthorized consumer AI tools violates Stewart policy and GLBA regulations.',
        rule: 'Stewart IT Security v7.0 §Section 1 (Page 2) & Code Pillar 6',
        immediateAction: 'Cease input immediately. Request authorization for vetted enterprise AI models through Stewart AI Council.',
        contact: 'AICouncil@stewart.com'
      });
    } else if (q.includes('usb') || q.includes('flash') || q.includes('thumb drive') || q.includes('dropbox') || q.includes('google drive') || q.includes('icloud')) {
      setCustomVerdict({
        verdict: 'VIOLATION',
        title: 'UnApproved Removable Media / Shadow Cloud Storage',
        riskScore: 84,
        explanation: 'Stewart policy strictly prohibits storing work-related documents on personal cloud storage services or unauthorized USB media. Endpoints block unauthorized mass storage.',
        rule: 'Stewart IT Security v7.0 §Section 2 & §Section 6 (Pages 3, 6)',
        immediateAction: 'Migrate files exclusively to Stewart Microsoft 365 (OneDrive, SharePoint, Teams). Use encrypted SharePoint sharing links.',
        contact: 'itsecurity@stewart.com'
      });
    } else if (q.includes('lost') || q.includes('stolen') || q.includes('uber') || q.includes('car') || q.includes('laptop') || q.includes('phone')) {
      setCustomVerdict({
        verdict: 'CONDITIONAL',
        title: 'Critical Device Incident — 1 Hour Reporting SLA',
        riskScore: 95,
        explanation: 'All lost or stolen Stewart-issued endpoints must be reported to the IT Security Incident Desk within 60 minutes for remote kill-switch activation.',
        rule: 'Stewart IT Security v7.0 §Section 9 (Page 8)',
        immediateAction: 'Call or email the Security Desk immediately. Stewart enforces 100% zero-retaliation for good-faith incident reporting.',
        contact: 'itsecurity@stewart.com (Mandatory < 1 hr)'
      });
    } else if (q.includes('gift') || q.includes('dinner') || q.includes('golf') || q.includes('trip') || q.includes('vendor') || q.includes('bribe')) {
      setCustomVerdict({
        verdict: 'VIOLATION',
        title: 'Commercial Conflict of Interest / Bidding Integrity',
        riskScore: 78,
        explanation: 'Accepting lavish entertainment, resort stays, or personal travel from vendors—especially during an RFP or active procurement—violates the Stewart Code of Business Conduct.',
        rule: 'Stewart Code of Business Conduct §Pillar 5 (Page 30)',
        immediateAction: 'Politely decline the offer in writing, citing Stewart policy. Forward disclosure to ethics@stewart.com.',
        contact: 'ethics@stewart.com'
      });
    } else {
      setCustomVerdict({
        verdict: 'APPROVED',
        title: 'Standard Enterprise Operational Workflow',
        riskScore: 15,
        explanation: 'Activity is permissible provided it occurs on Stewart-managed hardware within our Approved Microsoft 365 tenant and respects confidentiality standards.',
        rule: 'Stewart IT Security v7.0 §Section 1 & §Section 2',
        immediateAction: 'Follow standard least-privilege protocols and store all associated project files in team SharePoint.',
        contact: 'itsecurity@stewart.com'
      });
    }
  };

  const copyContact = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedContact(true);
    setTimeout(() => setIsCopiedContact(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-rose-500/30 shadow-[0_15px_40px_rgba(244,63,94,0.08)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold uppercase tracking-wider">
                Interactive Decision Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                Out-Of-The-Box Workplace Scenarios
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Workplace "What-If" Policy Simulator
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl font-sans leading-relaxed">
              Test your reflexes against high-stakes title, escrow, data privacy, and ethical dilemmas. Pick a real scenario or input your own query to receive instant policy verdicts, regulatory blast radius, and exact escalation paths.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Policy Compliance</span>
              <span className="text-sm font-bold text-emerald-400">Zero-Tolerance Wire &amp; AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Scenario Selector & Live Decision Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Preset High-Stakes Scenarios (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider px-1">
            <span>High-Stakes Scenarios</span>
            <span className="text-rose-400">{DECISION_LAB_SCENARIOS.length} Dilemmas</span>
          </div>

          <div className="space-y-2.5">
            {DECISION_LAB_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;
              return (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenarioId(scen.id);
                    setSelectedOptionId(null);
                    soundManager.playBlip(720);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/40'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/70 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold uppercase">
                      {scen.category}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                      scen.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    }`}>
                      {scen.urgency}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {scen.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {scen.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick Custom Query Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-cyan-300 font-mono uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Custom What-If Check</span>
            </span>
            <p className="text-[11px] text-slate-400 font-sans">
              Type any real action (e.g., "Can I use WhatsApp with an escrow buyer?", "Lost my badge"):
            </p>
            <form onSubmit={handleAnalyzeCustomScenario} className="space-y-2">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Describe scenario..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <span>Evaluate Against Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Decision Lab Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Active Scenario Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                  Live Workplace Simulation • {activeScenario.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                  {activeScenario.title}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold self-start sm:self-center">
                {activeScenario.urgency} SLA REQUIRED
              </span>
            </div>

            {/* Context Narrative */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs leading-relaxed font-sans">
              <p className="text-slate-200 font-medium">
                {activeScenario.description}
              </p>
              <p className="text-slate-400 italic">
                {activeScenario.context}
              </p>
            </div>

            {/* User Prompt */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-200 font-medium">
              <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{activeScenario.userPrompt}</span>
            </div>

            {/* Interactive Decision Options */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Select Your Action:
              </span>
              <div className="space-y-2.5">
                {activeScenario.options.map((opt) => {
                  const isSelected = opt.id === selectedOptionId;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? opt.verdict === 'APPROVED'
                            ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40'
                            : 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.2)] ring-1 ring-rose-500/40'
                          : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900/80 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                            opt.verdict === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            {opt.verdict}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {opt.actionDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verdict & Blast Radius Breakdown */}
            {selectedOption && (
              <div className={`p-5 rounded-2xl border space-y-4 animate-in fade-in duration-200 ${
                selectedOption.verdict === 'APPROVED'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-100'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {selectedOption.verdict === 'APPROVED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-base font-bold font-display text-white">
                        {selectedOption.verdictTitle}
                      </h4>
                      <span className="text-xs text-slate-300 font-mono">
                        {selectedOption.policySection} • {selectedOption.policyPage}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Sentinel Score</span>
                    <span className={`text-base font-black font-mono ${
                      selectedOption.scoreDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {selectedOption.scoreDelta > 0 ? `+${selectedOption.scoreDelta} XP` : `${selectedOption.scoreDelta} XP`}
                    </span>
                  </div>
                </div>

                {/* Regulatory Impact */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
                    Regulatory &amp; Business Impact:
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {selectedOption.regulatoryImpact}
                  </p>
                </div>

                {/* Remediation Steps */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">
                    Mandatory Protocol Steps:
                  </span>
                  <ul className="space-y-1.5">
                    {selectedOption.remediationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Escalation Contact Footer */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="text-slate-300">
                    Escalation Contact: <span className="text-white font-bold">{selectedOption.escalationContact}</span>
                  </div>
                  <button
                    onClick={() => copyContact(selectedOption.escalationContact)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {isCopiedContact ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopiedContact ? 'Copied' : 'Copy Contact'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Custom Query Verdict Result Card */}
          {customVerdict && (
            <div className="p-5 rounded-3xl bg-slate-950/95 border border-cyan-500/40 space-y-4 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                      Custom Evaluation Result
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      customVerdict.verdict === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : customVerdict.verdict === 'CONDITIONAL'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {customVerdict.verdict}
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-display text-white mt-1">
                    {customVerdict.title}
                  </h4>
                </div>

                <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-right font-mono shrink-0">
                  <span className="text-[10px] text-slate-400 block">Risk Metric</span>
                  <span className={`text-sm font-bold ${
                    customVerdict.riskScore > 75 ? 'text-rose-400' : customVerdict.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {customVerdict.riskScore}% Severity
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {customVerdict.explanation}
              </p>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Applicable Policy Standard:
                </span>
                <span className="text-slate-200 font-mono block">
                  {customVerdict.rule}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 space-y-1 font-sans">
                <strong className="text-cyan-300 font-mono uppercase tracking-wider block text-[10px]">
                  Immediate Required Action:
                </strong>
                <p>{customVerdict.immediateAction}</p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Escalation: <span className="text-white font-bold">{customVerdict.contact}</span></span>
                <button
                  onClick={() => setCustomVerdict(null)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Dismiss Analysis
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
