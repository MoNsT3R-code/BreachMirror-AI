import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  Loader2, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { analyzeCustomActionApi, CustomActionAnalysisResult } from '../../services/local-api';

interface ThreatSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const PRESET_SCENARIOS = [
  {
    title: 'GenAI Prompt with DB Secret',
    text: "Pasted sensitive information of client's data on chatgpt.",
  },
  {
    title: 'Personal laptop and Ethernet cable connection',
    text: "Connected the personal laptop with the company's ethernet cable.",
  },
  {
    title: 'Personal ',
    text: 'Configured auto-sync on local workspace repository to a personal Google Drive account to work over the weekend.',
  },
  {
    title: 'Unknown USB Flash Drive',
    text: 'Inserted an unlabeled black USB thumb drive found on the conference table into corporate laptop to locate the owner.',
  },
];

export const ThreatSandboxModal: React.FC<ThreatSandboxModalProps> = ({
  isOpen,
  onClose,
  userRole = 'Security Officer',
}) => {
  const [scenarioText, setScenarioText] = useState('');
  const [cohortRole, setCohortRole] = useState(userRole);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CustomActionAnalysisResult | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string>('');

  if (!isOpen) return null;

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || scenarioText;
    if (!text.trim()) return;

    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const res = await analyzeCustomActionApi(text, cohortRole);
      if (res && res.data) {
        setAnalysisResult(res.data);
        setAnalysisSource(res.source);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setScenarioText(preset.text);
    handleAnalyze(preset.text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-sandbox-title"
    >
      <div className="w-full max-w-2xl rounded-2xl vengeance-glass border border-cyan-500/30 bg-slate-950/90 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-sandbox-title" className="text-base font-bold text-white font-display">
                  BreachMirror AI Threat Sandbox
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI practice tool
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Try a scenario and see its possible impact
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Threat Sandbox"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-200">
          {/* Preset Scenarios */}
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
              Choose a sample scenario:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-left transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                    {preset.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1">
                    {preset.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="custom-action-input" className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                Action or command to review:
              </label>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">Role:</span>
                <select
                  value={cohortRole}
                  onChange={e => setCohortRole(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Incident Commander">Incident Commander</option>
                  <option value="New Joiner (Day 3)">New Joiner (Day 3)</option>
                  <option value="Summer Intern">Summer Intern</option>
                  <option value="Staff Software Engineer">Staff Software Engineer</option>
                  <option value="DevOps Contractor">DevOps Contractor</option>
                </select>
              </div>
            </div>

            <textarea
              id="custom-action-input"
              rows={3}
              value={scenarioText}
              onChange={e => setScenarioText(e.target.value)}
              placeholder="e.g., Pasted private SSH key into unsanctioned code formatting website..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono resize-none"
            />

            <div className="flex items-center justify-end">
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading || !scenarioText.trim()}
                className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Reviewing possible impact...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Review action</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Output */}
          {analysisResult && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {analysisResult.severity} RISK
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    {analysisResult.categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-slate-400">Possible impact:</span>
                    <strong className="text-rose-400 font-bold">{analysisResult.riskScore}/100</strong>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {analysisSource}
                  </span>
                </div>
              </div>

              {/* Threat description */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  What may happen:
                </span>
                <p className="text-xs text-white leading-relaxed">
                  {analysisResult.detectedThreat}
                </p>
              </div>

              {/* Blast radius details */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  Possible downstream impact
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.blastRadiusAnalysis}
                </p>
              </div>

              {/* Safe Remediation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended next step
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {analysisResult.immediateRemediation}
                </p>
              </div>

              {/* Sanctioned Alternative */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Recommended work process
                </span>
                <p className="text-slate-300 text-[11px]">
                  {analysisResult.safeAlternative}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            BreachMirror AI practice mode
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close practice tool
          </button>
        </div>
      </div>
    </div>
  );
};
