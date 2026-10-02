import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  AlertTriangle, 
  BookOpen, 
  Copy, 
  Check, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Lock,
  HardDrive,
  Cloud,
  FileCode
} from 'lucide-react';
import { PlaybookDomain, DoDontItem } from '../../shared-types';
import { PLAYBOOK_RULES } from '../../data/sample-data';

export const DoAndDontWidget: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<PlaybookDomain>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(PLAYBOOK_RULES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const domains: { id: PlaybookDomain; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'All', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'AI_TOOLS', label: 'AI & LLM', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'GIT_SECRETS', label: 'Git & Code', icon: <FileCode className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'CREDENTIALS_MFA', label: 'MFA & Auth', icon: <Lock className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'DEVICES_PHYSICAL', label: 'Hardware', icon: <HardDrive className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'CLOUD_STORAGE', label: 'Cloud DLP', icon: <Cloud className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  const filteredRules = PLAYBOOK_RULES.filter(item => {
    const matchesDomain = selectedDomain === 'ALL' || item.domain === selectedDomain;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.ruleTitle.toLowerCase().includes(q) ||
      item.doText.toLowerCase().includes(q) ||
      item.dontText.toLowerCase().includes(q) ||
      item.policyCode.toLowerCase().includes(q);
    return matchesDomain && matchesSearch;
  });

  const handleCopyAlternative = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between" id="dos-and-donts-playbook">
      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guidelines and policies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {domains.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDomain === d.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-white/5'
              }`}
            >
              {d.icon}
                    <span className="tracking-wider text-[11px]">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rules Accordion List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredRules.map(rule => {
          const isExpanded = expandedId === rule.id;

          return (
            <div
              key={rule.id}
              className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-all space-y-3"
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(prev => (prev === rule.id ? null : rule.id))}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 text-cyan-400 border border-white/10 font-bold">
                    {rule.policyCode}
                  </span>
                  <h3 className="text-sm font-bold text-white font-display">
                    {rule.ruleTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    {rule.domainLabel}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* High-Contrast DO vs DONT cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* DO */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>What to do</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {rule.doText}
                  </p>
                </div>

                {/* DONT */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>What to avoid</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {rule.dontText}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-slate-300 leading-relaxed">
                      <strong className="text-amber-300 font-mono text-[11px] uppercase">
                        Why this matters:
                      </strong>{' '}
                      {rule.rationale}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-slate-400 italic leading-relaxed">
                      <strong className="text-rose-400 font-mono text-[11px] uppercase not-italic">
                        Example:
                      </strong>{' '}
                      {rule.realPrecedent}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="font-mono text-[11px] text-cyan-300 flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">Recommended option:</span>
                      <code className="bg-black/50 px-2 py-0.5 rounded border border-white/10 text-cyan-300 truncate">
                        {rule.sanctionedAlternative}
                      </code>
                    </div>

                    <button
                      onClick={() => handleCopyAlternative(rule.id, rule.sanctionedAlternative)}
                      className="py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer self-end sm:self-auto"
                    >
                      {copiedId === rule.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy Path</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
