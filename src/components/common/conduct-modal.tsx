import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Download,
  Copy,
  Check,
  Award,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Building2,
  Users,
  Trophy,
  Heart,
  Target,
  PhoneCall,
  Mail,
  ExternalLink,
  ChevronRight,
  Printer,
  Sparkles,
  BookOpen,
  FileText,
  Lock,
  Globe,
  DollarSign,
  Scale,
  Briefcase,
  Cpu,
  Leaf,
  Megaphone,
  UserCheck,
  Eye,
  ShieldAlert
} from 'lucide-react';
import {
  STEWART_CORP_METADATA,
  STEWART_DNA,
  STEWART_ETHICAL_QUESTIONS,
  STEWART_CODE_PILLARS,
  STEWART_KNOW_THE_CODE_SCENARIOS,
  STEWART_CODE_MARKDOWN_EXPORT
} from '../../data/conduct-content';
import { StewartLogo } from './stewart-logo';
import { soundManager } from '../../services/sound-effects';

interface ConductModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: string;
  initialPillarId?: string;
  onOpenMasterQuiz?: () => void;
}

export const ConductModal: React.FC<ConductModalProps> = ({
  isOpen,
  onClose,
  userName = 'Stewart Associate',
  userRole = 'Operations Specialist',
  initialPillarId,
  onOpenMasterQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'ethicalDecision' | 'knowTheCode' | 'ceoAndDna' | 'hotlines' | 'fullDocument'>('pillars');
  const [selectedPillarId, setSelectedPillarId] = useState<string>(initialPillarId || 'pillar-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  
  // Interactive 8-Question Ethical Test State
  const [ethicalAnswers, setEthicalAnswers] = useState<Record<string, boolean | null>>({});
  
  // Know the Code Scenarios filter
  const [scenarioFilter, setScenarioFilter] = useState<string>('ALL');
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);

  // Signed pledge state
  const [hasSignedPledge, setHasSignedPledge] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stewart_code_conduct_pledge_signed') === 'true';
    }
    return false;
  });

  const selectedPillar = useMemo(() => {
    return STEWART_CODE_PILLARS.find(p => p.id === selectedPillarId) || STEWART_CODE_PILLARS[0];
  }, [selectedPillarId]);

  // Filtered pillars / subtopics based on search
  const filteredSubtopics = useMemo(() => {
    if (!searchQuery.trim()) return selectedPillar.subtopics;
    const q = searchQuery.toLowerCase();
    return selectedPillar.subtopics.filter(sub => 
      sub.title.toLowerCase().includes(q) ||
      sub.summary.toLowerCase().includes(q) ||
      sub.keyRules.some(r => r.toLowerCase().includes(q))
    );
  }, [selectedPillar, searchQuery]);

  // Filtered Know the Code Scenarios
  const filteredScenarios = useMemo(() => {
    return STEWART_KNOW_THE_CODE_SCENARIOS.filter(s => {
      const matchesFilter = scenarioFilter === 'ALL' || s.pillarId === scenarioFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery.trim() ||
        s.topicTitle.toLowerCase().includes(q) ||
        s.question.toLowerCase().includes(q) ||
        s.explanation.toLowerCase().includes(q) ||
        s.answer.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [scenarioFilter, searchQuery]);

  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    const blob = new Blob([STEWART_CODE_MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stewart-our-code-of-business-conduct.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(STEWART_CODE_MARKDOWN_EXPORT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSignPledge = () => {
    const next = !hasSignedPledge;
    setHasSignedPledge(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('stewart_code_conduct_pledge_signed', String(next));
    }
    if (next) {
      soundManager.playSuccess();
      setShowCertificate(true);
    }
  };

  // Check if any ethical answer is 'YES'
  const anyYesInEthical = Object.values(ethicalAnswers).some(val => val === true);
  const answeredCount = Object.values(ethicalAnswers).filter(val => val !== null).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stewart-code-modal-title"
    >
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[950px] flex flex-col rounded-2xl bg-slate-900 border border-[#9B2743]/40 shadow-[0_0_50px_rgba(155,39,67,0.25)] overflow-hidden text-slate-100">
        
        {/* Top Header with Stewart Official Identity & Motto */}
        <div className="relative p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-[#9B2743]/20 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Stewart White Badge */}
            <div className="p-2 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200">
              <StewartLogo height={26} variant="full" theme="light" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded bg-[#9B2743]/20 text-rose-300 border border-[#9B2743]/40">
                  {STEWART_CORP_METADATA.tagline}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden md:inline">
                  Est. {STEWART_CORP_METADATA.founded}
                </span>
              </div>
              <h2 id="stewart-code-modal-title" className="text-lg sm:text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                Our Code of Business Conduct
              </h2>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadMarkdown}
              title="Download full Code as Markdown"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline font-mono text-[11px]">.md</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              title="Copy Markdown to clipboard"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              title="Close modal (Esc)"
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-white/5 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'pillars'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_15px_rgba(155,39,67,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>7 Core Pillars</span>
            </button>

            <button
              onClick={() => setActiveTab('ethicalDecision')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ethicalDecision'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_15px_rgba(155,39,67,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>8-Question Decision Test</span>
            </button>

            <button
              onClick={() => setActiveTab('knowTheCode')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'knowTheCode'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_15px_rgba(155,39,67,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Know the Code (16 Cases)</span>
            </button>

            <button
              onClick={() => setActiveTab('ceoAndDna')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ceoAndDna'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_15px_rgba(155,39,67,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>CEO Message &amp; Stewart DNA</span>
            </button>

            <button
              onClick={() => setActiveTab('hotlines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'hotlines'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_15px_rgba(155,39,67,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Speak Up &amp; Hotlines</span>
            </button>

            <button
              onClick={() => setActiveTab('fullDocument')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'fullDocument'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_15px_rgba(155,39,67,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Text</span>
            </button>
          </div>

          {/* Certificate / Pledge Trigger */}
          <div className="shrink-0 flex items-center gap-2">
            {onOpenMasterQuiz && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMasterQuiz();
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                title="Launch Master Certification Exam covering both Stewart PDFs"
              >
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Master Exam (Both PDFs)</span>
              </button>
            )}

            <button
              onClick={() => setShowCertificate(true)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                hasSignedPledge
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${hasSignedPledge ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden md:inline">{hasSignedPledge ? 'Pledge Verified' : 'Compliance Pledge'}</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: 7 CORE PILLARS */}
          {activeTab === 'pillars' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Column: Pillars List */}
              <div className="lg:col-span-4 space-y-2.5">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search directives, policies, topics..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#9B2743]"
                  />
                </div>

                <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                  {STEWART_CODE_PILLARS.map((pillar) => {
                    const isSelected = pillar.id === selectedPillarId;
                    return (
                      <button
                        key={pillar.id}
                        onClick={() => setSelectedPillarId(pillar.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-[#9B2743]/20 border-[#9B2743] shadow-[0_0_20px_rgba(155,39,67,0.25)]'
                            : 'bg-slate-950/40 border-white/5 hover:bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              isSelected ? 'bg-[#9B2743] text-white' : 'bg-white/10 text-slate-400'
                            }`}>
                              Pillar {pillar.number}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {pillar.pageRange}
                            </span>
                          </div>
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {pillar.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {pillar.tagline}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 mt-1 shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Pillar Detail */}
              <div className="lg:col-span-8 space-y-6">
                {/* Pillar Header Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#9B2743]/15 border border-[#9B2743]/30 shadow-lg space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300 bg-[#9B2743]/20 px-2.5 py-1 rounded-lg border border-[#9B2743]/40">
                      Chapter {selectedPillar.number} • {selectedPillar.pageRange}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Stewart Information Services Corporation
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {selectedPillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-rose-200/90 font-medium italic">
                    "{selectedPillar.tagline}"
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {selectedPillar.summary}
                  </p>

                  {/* Core Takeaways */}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-2">
                      Core Directives:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedPillar.corePillars.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Subtopics Accordion / Cards */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>In-Depth Policy Sections ({filteredSubtopics.length})</span>
                  </h4>

                  <div className="space-y-3">
                    {filteredSubtopics.map((subtopic) => (
                      <div
                        key={subtopic.id}
                        className="p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/15 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            {subtopic.title}
                          </h5>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            Page {subtopic.page}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {subtopic.summary}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-white/5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold">
                            Operational Requirements:
                          </span>
                          <ul className="space-y-1">
                            {subtopic.keyRules.map((rule, rIdx) => (
                              <li key={rIdx} className="text-[11px] text-slate-300 flex items-start gap-2">
                                <span className="text-rose-400 font-bold">•</span>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 8-QUESTION ETHICAL DECISION TEST */}
          {activeTab === 'ethicalDecision' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#9B2743]/20 border border-[#9B2743]/40 space-y-3 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B2743]/20 border border-[#9B2743]/40 text-rose-300 text-xs font-mono font-bold uppercase">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Official Framework • Page 5</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  We Make Ethical Decisions
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  "If you are uncertain about a decision or action, ask yourself the 8 questions below. If the answer to any of these questions is <strong>'YES'</strong>, take a step back and reconsider the action or decision. Then seek the guidance of a manager, a Compliance Officer, or the Legal Department."
                </p>

                {/* Score Alert Banner */}
                {answeredCount > 0 && (
                  <div className={`mt-4 p-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
                    anyYesInEthical
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <div className="flex items-center gap-2 text-left">
                      {anyYesInEthical ? (
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold">
                          {anyYesInEthical ? 'HALT & RECONSIDER ACTION:' : 'ALL QUESTIONS ANSWERED "NO":'}
                        </span>{' '}
                        {anyYesInEthical 
                          ? 'You flagged one or more ethical concerns. Take a step back and consult ethics@stewart.com or your manager before taking action.' 
                          : 'Your proposed decision aligns with Stewart ethical safeguards and policy standards.'}
                      </div>
                    </div>
                    <button
                      onClick={() => setEthicalAnswers({})}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono cursor-pointer shrink-0"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>

              {/* 8 Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STEWART_ETHICAL_QUESTIONS.map((q) => {
                  const currentVal = ethicalAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        currentVal === true
                          ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                          : currentVal === false
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-950/60 border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                          Question {q.number} • {q.category}
                        </span>
                        {currentVal !== null && (
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                            currentVal ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {currentVal ? 'YES (Risk Detected)' : 'NO (Clear)'}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        "{q.question}"
                      </h4>

                      <p className="text-[11px] text-slate-400">
                        {q.riskIfYes}
                      </p>

                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            setEthicalAnswers(prev => ({ ...prev, [q.id]: true }));
                            soundManager.playBlip(750);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            currentVal === true
                              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                              : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 border-white/10 hover:border-rose-500/30'
                          }`}
                        >
                          YES
                        </button>
                        <button
                          onClick={() => {
                            setEthicalAnswers(prev => ({ ...prev, [q.id]: false }));
                            soundManager.playBlip(880);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            currentVal === false
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                              : 'bg-white/5 hover:bg-emerald-500/20 text-slate-300 border-white/10 hover:border-emerald-500/30'
                          }`}
                        >
                          NO
                        </button>
                      </div>

                      {currentVal === true && (
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200">
                          <span className="font-bold">Next Action:</span> {q.guidance}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KNOW THE CODE SCENARIOS (16 CASES) */}
          {activeTab === 'knowTheCode' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-rose-400" />
                    <span>Official "Know the Code" Scenarios</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-world ethical and compliance dilemmas directly from Stewart's Code of Business Conduct.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setScenarioFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      scenarioFilter === 'ALL'
                        ? 'bg-[#9B2743] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    All (16)
                  </button>
                  <button
                    onClick={() => setScenarioFilter('pillar-2')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      scenarioFilter === 'pillar-2'
                        ? 'bg-[#9B2743] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Speaking Up
                  </button>
                  <button
                    onClick={() => setScenarioFilter('pillar-3')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      scenarioFilter === 'pillar-3'
                        ? 'bg-[#9B2743] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    People &amp; Labor
                  </button>
                  <button
                    onClick={() => setScenarioFilter('pillar-4')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      scenarioFilter === 'pillar-4'
                        ? 'bg-[#9B2743] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Customers &amp; RESPA
                  </button>
                  <button
                    onClick={() => setScenarioFilter('pillar-5')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      scenarioFilter === 'pillar-5'
                        ? 'bg-[#9B2743] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Conflicts &amp; Gifts
                  </button>
                  <button
                    onClick={() => setScenarioFilter('pillar-6')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      scenarioFilter === 'pillar-6'
                        ? 'bg-[#9B2743] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Assets &amp; Privacy
                  </button>
                </div>
              </div>

              {/* Scenarios List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredScenarios.map((scen) => {
                  const isExpanded = expandedScenarioId === scen.id;
                  return (
                    <div
                      key={scen.id}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30">
                            Page {scen.page} • {scen.pillarTitle}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {scen.topicTitle}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                          "{scen.question}"
                        </h4>
                      </div>

                      {/* Reveal Answer Accordion */}
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        {!isExpanded ? (
                          <button
                            onClick={() => setExpandedScenarioId(scen.id)}
                            className="w-full py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 hover:border-rose-500/40"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Click for Official Code Guidance</span>
                          </button>
                        ) : (
                          <div className="space-y-3 animate-fadeIn">
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase text-rose-300 block">
                                Direct Answer:
                              </span>
                              <p className="text-xs font-bold text-white">
                                {scen.answer}
                              </p>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {scen.explanation}
                            </p>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                                Required Action Protocol:
                              </span>
                              <ul className="space-y-1">
                                {scen.actionProtocol.map((act, aIdx) => (
                                  <li key={aIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                    <Check className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                                    <span>{act}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5">
                              <span>Escalate to: <strong className="text-rose-300">{scen.relevantContact}</strong></span>
                              <button
                                onClick={() => setExpandedScenarioId(null)}
                                className="text-slate-400 hover:text-white underline cursor-pointer"
                              >
                                Hide
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CEO MESSAGE & STEWART DNA */}
          {activeTab === 'ceoAndDna' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* CEO Message Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#9B2743]/20 border border-[#9B2743]/40 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 block mb-1">
                      Executive Message • Page ii
                    </span>
                    <h3 className="text-2xl font-extrabold text-white font-display">
                      A Message from Our CEO
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-bold text-white block">
                      {STEWART_CORP_METADATA.leadership.ceo}
                    </span>
                    <span className="text-xs text-rose-300 font-mono">
                      {STEWART_CORP_METADATA.leadership.ceoTitle}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  <p>
                    At Stewart, we are committed to becoming the <strong>Premier Title Services Company</strong>. That is the mission and vision that unites and drives our people every day to uphold our reputation, serve our customers with excellence and remain open to new thinking that fuels innovation.
                  </p>
                  <p>
                    Our success over the past <strong>130-plus years</strong> has been built on a foundation of values and principles that we call our <strong>Stewart DNA</strong>. These are the attributes we hold ourselves and each other to, ensuring that we operate with the highest standards of integrity, responsibility and respect.
                  </p>
                  <p>
                    As you review our Code of Business Conduct and Ethics, understand it is not only a reflection of our past but a blueprint for how we will continue to thrive in the future. It is our commitment to always doing the right thing and maintaining the highest ethical standards and practices in all aspects of our work, protecting our people and serving our customers.
                  </p>
                  <p>
                    In following our Code, we are ensuring <em>integrity is at home here</em> by reinforcing our reputation for honesty, fairness and trustworthiness that our customers expect. We encourage our employees to speak up without fear of retaliation or retribution. Our integrity has made us a trusted name in the title industry for more than a century.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Founded 1893 • Houston, Texas</span>
                  <span className="text-rose-300 font-bold">Fred Eppinger, Stewart CEO</span>
                </div>
              </div>

              {/* Stewart DNA: 5 Core Values */}
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-bold text-white font-display">
                    Our Culture &amp; The Stewart DNA
                  </h4>
                  <p className="text-xs text-slate-400">
                    The 5 foundational values that guide our actions and decisions across every team.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STEWART_DNA.map((dna, idx) => (
                    <div
                      key={dna.id}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-[#9B2743]/50 transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          DNA #{idx + 1}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                          <Target className="w-4 h-4" />
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                        {dna.title}
                      </h5>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {dna.shortDesc}
                      </p>
                    </div>
                  ))}

                  {/* Corporate HQ Badge */}
                  <div className="p-5 rounded-2xl bg-[#9B2743]/15 border border-[#9B2743]/40 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-white font-display">Corporate Headquarters</span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-semibold">{STEWART_CORP_METADATA.headquarters.address}</p>
                      <p>{STEWART_CORP_METADATA.headquarters.cityStateZip}</p>
                      <p className="text-rose-300 font-mono">{STEWART_CORP_METADATA.headquarters.phone}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {STEWART_CORP_METADATA.copyright}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SPEAK UP & HOTLINES */}
          {activeTab === 'hotlines' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#9B2743]/20 border border-[#9B2743]/40 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Strict No-Retaliation Policy</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  How to Report Concerns at Stewart
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  We speak up against disrespectful, unethical, or unlawful conduct without fear of retaliation. Stewart takes all reasonable steps to investigate suspected misconduct and protects everyone who speaks up in good faith.
                </p>
              </div>

              {/* 4 Reporting Channels Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* EthicsPoint */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-rose-500/30 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      100% ANONYMOUS 24/7
                    </span>
                    <PhoneCall className="w-4 h-4 text-rose-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    EthicsPoint Independent Hotline
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Operated by an independent third party. Report online or by phone anytime, day or night.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1 text-xs font-mono">
                    <div className="text-white font-bold flex items-center justify-between">
                      <span>Phone:</span>
                      <a href="tel:8663844277" className="text-rose-400 hover:underline">(866) 384-4277</a>
                    </div>
                    <div className="text-white flex items-center justify-between">
                      <span>Online Portal:</span>
                      <a href="https://www.ethicspoint.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        www.ethicspoint.com <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Compliance Officer */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      DIRECT COMPLIANCE
                    </span>
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Stewart Compliance Officer
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Direct confidential contact for Code of Conduct clarifications, conflict of interest disclosures, and policy interpretations.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono">
                    <div className="text-white font-bold flex items-center justify-between">
                      <span>Email:</span>
                      <a href="mailto:ethics@stewart.com" className="text-cyan-400 hover:underline">ethics@stewart.com</a>
                    </div>
                  </div>
                </div>

                {/* Legal Department */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                      LEGAL COUNSEL
                    </span>
                    <Scale className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Stewart Legal Department
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    For legal notices, trade sanctions (OFAC) clearance, anti-boycott inquiries, antitrust reviews, or litigation matters.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono">
                    <div className="text-white font-bold flex items-center justify-between">
                      <span>Email:</span>
                      <a href="mailto:compliance@stewart.com" className="text-purple-400 hover:underline">compliance@stewart.com</a>
                    </div>
                  </div>
                </div>

                {/* AI Council */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      EMERGING TECH GOVERNANCE
                    </span>
                    <Cpu className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Stewart AI Council
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mandatory consultation before adopting any new generative AI tool or starting any AI-assisted business initiative.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono">
                    <div className="text-white font-bold flex items-center justify-between">
                      <span>Email:</span>
                      <a href="mailto:AICouncil@stewart.com" className="text-amber-400 hover:underline">AICouncil@stewart.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FULL TEXT / MARKDOWN VIEWER */}
          {activeTab === 'fullDocument' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Official Text of Our Code of Business Conduct</h4>
                  <p className="text-xs text-slate-400">Complete text compiled from all 61 pages of the official document.</p>
                </div>
                <button
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-[#9B2743] hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download (.md)</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                {STEWART_CODE_MARKDOWN_EXPORT}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Footer Bar */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-rose-400 font-bold">{STEWART_CORP_METADATA.tagline}</span>
            <span>•</span>
            <span>Houston, TX</span>
            <span>•</span>
            <span>Hotline: (866) 384-4277</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playBlip(900);
                handleSignPledge();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                hasSignedPledge
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#9B2743] hover:bg-rose-700 text-white shadow-md'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{hasSignedPledge ? 'Certificate of Integrity Signed' : 'Sign Integrity Pledge'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* COMPLIANCE CERTIFICATE MODAL */}
      {showCertificate && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl p-8 rounded-3xl bg-slate-900 border-2 border-[#9B2743] shadow-[0_0_60px_rgba(155,39,67,0.4)] text-center space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Certificate Header */}
            <div className="space-y-2">
              <div className="mx-auto p-3 rounded-2xl bg-white w-fit shadow-md border border-slate-200">
                <StewartLogo height={32} variant="full" theme="light" />
              </div>

              <div className="pt-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
                  Certificate of Ethical Commitment
                </span>
                <h3 className="text-2xl font-extrabold text-white font-display mt-1">
                  Stewart Code of Business Conduct
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic">
              "Integrity is at home here. Acting with integrity is what we expect of everyone working for or with Stewart."
            </p>

            {/* Recipient Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Certified Associate:</span>
              <h4 className="text-lg font-bold text-white font-display">{userName}</h4>
              <p className="text-xs text-rose-300 font-mono">{userRole}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Has reviewed, understood, and pledged adherence to Stewart’s 7 Core Pillars, the 8-Question Ethical Test, zero-retaliation reporting, and our Stewart DNA principles.
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="text-left">
                <span className="text-slate-300 font-bold block">Fred Eppinger</span>
                <span>Stewart CEO</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold block">VERIFIED PLEDGE</span>
                <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2 rounded-xl bg-[#9B2743] hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
