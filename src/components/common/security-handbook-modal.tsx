import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Printer, 
  Award, 
  ExternalLink,
  Cpu,
  FileCode,
  Lock,
  Cloud,
  HardDrive,
  Users,
  Info,
  Volume2,
  VolumeX,
  Radio,
  HelpCircle,
  Code2,
  FileText,
  Bookmark,
  Building2,
  ShieldCheck,
  PhoneCall,
  Mail,
  Zap,
  Play,
  Scale,
  Sparkles,
  RotateCw,
  Sliders,
  Eye,
  CheckCheck
} from 'lucide-react';
import { 
  HANDBOOK_VECTORS, 
  ZERO_BLAME_POLICY, 
  HANDBOOK_MARKDOWN_EXPORT, 
  STEWART_POLICY_METADATA,
  STEWART_POLICY_SECTIONS,
  ThreatVectorGuide 
} from '../../data/handbook-content';
import { soundManager } from '../../services/sound-effects';
import { BrandLogo } from './brand-logo';
import { DecisionLab } from '../handbook/decision-lab';
import { PolicyAssistant } from '../handbook/policy-assistant';
import { Flashcards } from '../handbook/flashcards';
import { ReadinessAudit } from '../handbook/readiness-audit';

export type HandbookViewMode = 
  | 'interactive' 
  | 'decisionLab' 
  | 'policyAssistant' 
  | 'Flashcards' 
  | 'readinessAudit' 
  | 'fullDocument';

interface SecurityHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  userName?: string;
  initialVectorId?: string;
  onTrackOnRadar?: (vectorId: string) => void;
  onOpenCodeOfConduct?: () => void;
  onOpenMasterQuiz?: () => void;
}

export const SecurityHandbookModal: React.FC<SecurityHandbookModalProps> = ({
  isOpen,
  onClose,
  userRole = 'Stewart Associate',
  userName = 'Security Sentinel',
  initialVectorId,
  onTrackOnRadar,
  onOpenCodeOfConduct,
  onOpenMasterQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<HandbookViewMode>('interactive');
  const [auditScore, setAuditScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stewart_sentinel_audit_checks');
      if (saved) {
        try {
          const checks = JSON.parse(saved);
          return Math.min(100, checks.length * 10);
        } catch {}
      }
    }
    return 40;
  });
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState<boolean>(false);
  const [activeScrubberStep, setActiveScrubberStep] = useState<number>(0);
  
  const resolveVectorId = (id?: string) => {
    if (!id) return HANDBOOK_VECTORS[0].id;
    const direct = HANDBOOK_VECTORS.find(v => v.id === id);
    if (direct) return direct.id;
    const byAlias = HANDBOOK_VECTORS.find(v => v.aliases?.includes(id));
    if (byAlias) return byAlias.id;
    return HANDBOOK_VECTORS[0].id;
  };

  const [selectedVectorId, setSelectedVectorId] = useState<string>(() => resolveVectorId(initialVectorId));

  useEffect(() => {
    if (initialVectorId) {
      setSelectedVectorId(resolveVectorId(initialVectorId));
    }
  }, [initialVectorId]);

  const [activeTab, setActiveTab] = useState<'blueprint' | 'rules' | 'code' | 'quiz' | 'officialText'>('blueprint');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [hasAcknowledgedPledge, setHasAcknowledgedPledge] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stewart_policy_pledge_signed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    soundManager.stopSpeaking();
    setIsSpeakingBriefing(false);
    setActiveScrubberStep(0);
    return () => {
      soundManager.stopSpeaking();
    };
  }, [selectedVectorId, viewMode, isOpen]);

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'All 10 Sections', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'Information Classification', label: '1. Classification', icon: <Bookmark className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'Information Protection', label: '2. Protection', icon: <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'Authentication & Access', label: '3. Authentication', icon: <Lock className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'Ownership & Privacy', label: '4. Privacy', icon: <Building2 className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'AI & Machine Learning', label: '5. AI & LLMs', icon: <Cpu className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'Device Management', label: '6. Devices', icon: <Zap className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'Network & Remote Access', label: '7. Network/VPN', icon: <Radio className="w-3.5 h-3.5 text-teal-400" /> },
    { id: 'Cloud & Applications', label: '8. Cloud/Apps', icon: <Cloud className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'Incident Reporting', label: '9. Incident Report', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'Enforcement & Discipline', label: '10. Enforcement', icon: <FileText className="w-3.5 h-3.5 text-red-400" /> },
  ];

  const filteredVectors = HANDBOOK_VECTORS.filter((vector) => {
    const matchesCategory = activeCategory === 'ALL' || vector.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      vector.title.toLowerCase().includes(q) ||
      vector.howBreachOccurs.summary.toLowerCase().includes(q) ||
      vector.howBreachOccurs.commonScenarios.some(s => s.toLowerCase().includes(q)) ||
      vector.howToPrevent.goldenRules.some(r => r.toLowerCase().includes(q)) ||
      vector.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const activeVector: ThreatVectorGuide = 
    HANDBOOK_VECTORS.find(v => v.id === selectedVectorId) || filteredVectors[0] || HANDBOOK_VECTORS[0];

  const activeSectionData = STEWART_POLICY_SECTIONS.find(s => s.id === activeVector.id) || STEWART_POLICY_SECTIONS[0];

  // Number of quizzes mastered
  const masteredCount = Object.keys(quizAnswers).filter(id => {
    const v = HANDBOOK_VECTORS.find(item => item.id === id);
    return v && quizAnswers[id] === v.quiz.correctIndex;
  }).length;

  const handleDownloadFile = () => {
    const blob = new Blob([HANDBOOK_MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stewart-information-technology-security-and-usage-v7.0.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(HANDBOOK_MARKDOWN_EXPORT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTogglePledge = () => {
    const next = !hasAcknowledgedPledge;
    setHasAcknowledgedPledge(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('stewart_policy_pledge_signed', String(next));
    }
    if (next) {
      soundManager.playSuccess();
    }
  };

  const handleToggleVoiceBriefing = () => {
    if (isSpeakingBriefing) {
      soundManager.stopSpeaking();
      setIsSpeakingBriefing(false);
    } else {
      setIsSpeakingBriefing(true);
      const text = `Stewart Information Technology Security Policy Section ${activeVector.sectionNumber}: ${activeVector.title}. ${activeVector.howBreachOccurs.summary}. Primary guideline: ${activeVector.howToPrevent.goldenRules[0]}`;
      soundManager.speakBriefing(text, () => {
        setIsSpeakingBriefing(false);
      });
    }
  };

  const handlePlayThreatAudio = () => {
    setIsPlayingAudio(true);
    soundManager.playThreatAlarm(activeVector.riskLevel, {
      voiceAlert: voiceEnabled,
      threatName: activeVector.title,
    });
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [activeVector.id]: optionIdx }));
    if (optionIdx === activeVector.quiz.correctIndex) {
      soundManager.playQuizSuccess();
    } else {
      soundManager.playQuizTryAgain();
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handbook-title"
    >
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-3xl border border-cyan-500/30 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] overflow-hidden bg-slate-950 text-slate-100">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" withText={false} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="handbook-title" className="text-base sm:text-lg font-bold font-display text-white">
                  IT Security &amp; Usage Handbook
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold tracking-wider">
                  STEWART v7.0
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  10 core policies
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                Stewart Information Services Corporation • Official Information Technology Security and Usage Policy (Revised 04/01/2026)
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Certificate Button with combined score */}
            <button
              onClick={() => setShowCertificate(true)}
              title="View your Security Sentinel Certificate"
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Progress certificate</span>
              <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.2 rounded-full font-bold">
                {masteredCount}/10 • {auditScore}%
              </span>
            </button>

            {/* Code of Conduct Switcher */}
            {onOpenCodeOfConduct && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCodeOfConduct();
                }}
                title="Open Stewart Corporate Code of Business Conduct"
                className="py-1.5 px-3 rounded-xl bg-[#9B2743]/20 hover:bg-[#9B2743]/35 text-rose-200 hover:text-white border border-[#9B2743]/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(155,39,67,0.2)] cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden lg:inline">Code of Conduct</span>
              </button>
            )}

            <button
              onClick={handleDownloadFile}
              title="Download full handbook as Markdown (.md) file"
              className="py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export (.md)</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              title="Copy Handbook markdown to clipboard"
              className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Handbook"
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              aria-label="Close Handbook Modal"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cockpit Mode Command Ribbon */}
        <div className="px-5 py-2 bg-slate-950 border-b border-white/10 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => { setViewMode('interactive'); soundManager.playBlip(600); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>10 policy sections</span>
            </button>

            <button
              onClick={() => { setViewMode('decisionLab'); soundManager.playBlip(650); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'decisionLab'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              <span>Decision practice</span>
            </button>

            <button
              onClick={() => { setViewMode('policyAssistant'); soundManager.playBlip(700); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'policyAssistant'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask a question</span>
            </button>

            <button
              onClick={() => { setViewMode('Flashcards'); soundManager.playBlip(750); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'Flashcards'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick review</span>
            </button>

            <button
              onClick={() => { setViewMode('readinessAudit'); soundManager.playBlip(800); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'readinessAudit'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Readiness check ({auditScore}%)</span>
            </button>

            <button
              onClick={() => { setViewMode('fullDocument'); soundManager.playBlip(850); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'fullDocument'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full policy (v7.0)</span>
            </button>

            {onOpenMasterQuiz && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMasterQuiz();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                title="Open the security and conduct quiz"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Security and conduct quiz</span>
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span>Progress level:</span>
            <span className="text-emerald-400 font-bold">
              {auditScore >= 90 && masteredCount >= 8 ? 'Apex Guardian' : auditScore >= 70 ? 'Defender L2' : 'Sentinel L1'}
            </span>
          </div>
        </div>

        {/* VIEW MODE: FULL OFFICIAL POLICY DOCUMENT */}
        {viewMode === 'fullDocument' ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-950/90 text-slate-200">
            {/* Document Header Banner */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                    Official policy document
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                    Information Technology Security and Usage
                  </h1>
                </div>
                <div className="text-right sm:text-right font-mono text-xs text-slate-400 space-y-0.5">
                  <div>Version: <span className="text-cyan-300 font-bold">v7.0</span></div>
                  <div>Last Revised: <span className="text-white font-semibold">04/01/2026</span></div>
                  <div>Publisher: <span className="text-slate-300 font-semibold">Stewart Information Services Corp</span></div>
                </div>
              </div>

              {/* Table of Contents Quick Grid */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold block">
                  Contents (10 sections)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {STEWART_POLICY_SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#sec-${sec.number}`}
                      className="p-2 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-xs flex items-center justify-between transition-colors group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                        {sec.number}. {sec.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                        {sec.page}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Scope Box */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed font-sans space-y-1">
                <strong className="text-cyan-300 font-mono uppercase tracking-wider block">
                  Where this policy applies:
                </strong>
                <p>{STEWART_POLICY_METADATA.scope}</p>
              </div>
            </div>

            {/* Sections Full Text */}
            <div className="space-y-8 max-w-4xl mx-auto">
              {STEWART_POLICY_SECTIONS.map((sec) => (
                <article 
                  key={sec.id} 
                  id={`sec-${sec.number}`} 
                  className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4 scroll-mt-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        Section {sec.number} • {sec.page}
                      </span>
                      <h2 className="text-xl font-bold font-display text-white mt-0.5">
                        {sec.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedVectorId(sec.id);
                        setViewMode('interactive');
                        setActiveTab('blueprint');
                        soundManager.playBlip(750);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Open this section</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Verbatim Section Text */}
                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                    {sec.fullText}
                  </div>

                  {/* Key Directives Checklist */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Key requirements:
                    </span>
                    <ul className="space-y-1.5">
                      {sec.keyDirectives.map((directive, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{directive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}

              {/* Emergency Contacts & Whistleblower Info Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold font-display text-white">
                    Emergency reporting and protection
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Stewart does not tolerate retaliation against employees, contractors, or partners who report security incidents or policy concerns in good faith.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span>IT security help desk</span>
                    </div>
                    <code className="text-xs font-mono text-white block">itsecurity@stewart.com</code>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Report within 1 hour for critical issues or 4 hours for other issues
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      <span>Outlook report button</span>
                    </div>
                    <span className="text-xs font-bold text-white block">“Report Email” Button</span>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Available in Outlook on desktop, web, and mobile
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 font-bold">
                      <PhoneCall className="w-4 h-4 text-purple-400" />
                      <span>EthicsPoint Hotline</span>
                    </div>
                    <code className="text-xs font-mono text-white block">(866) 384-4277</code>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Free, 24/7, anonymous reporting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'decisionLab' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            <DecisionLab 
              onSelectPolicySection={(secId) => {
                setSelectedVectorId(secId);
                setViewMode('interactive');
              }}
            />
          </div>
        ) : viewMode === 'policyAssistant' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            <PolicyAssistant 
              onSelectSection={(secId) => {
                setSelectedVectorId(secId);
                setViewMode('interactive');
              }}
            />
          </div>
        ) : viewMode === 'Flashcards' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            <Flashcards />
          </div>
        ) : viewMode === 'readinessAudit' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            <ReadinessAudit 
              onAuditScoreChange={(score) => setAuditScore(score)}
              onOpenCertificate={() => setShowCertificate(true)}
            />
          </div>
        ) : (
          /* VIEW MODE: INTERACTIVE VECTOR INSPECTOR */
          <>
            {/* Search & Category Filter Bar */}
            <div className="px-5 py-3 border-b border-white/5 bg-slate-900/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Stewart policies, prohibited activities, M365 storage, MFA, AI rules..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {cat.icon}
                    <span className="text-[11px]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Body: 2 Columns */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Navigation: 10 Policy Sections */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-3 sm:p-4 overflow-y-auto max-h-[240px] lg:max-h-none space-y-2.5 bg-slate-950/60">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1 pb-1">
                  <span>Policy sections ({filteredVectors.length} of 10)</span>
                  <span className="text-cyan-400">Select to view</span>
                </div>

                {filteredVectors.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No policy sections found matching "{searchQuery}".
                  </div>
                ) : (
                  filteredVectors.map((v) => {
                    const isSelected = v.id === activeVector.id;
                    const isMastered = quizAnswers[v.id] === v.quiz.correctIndex;

                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVectorId(v.id);
                          soundManager.playBlip(700);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                            : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/70 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-5 h-5 rounded-lg bg-white/10 text-[10px] font-mono flex items-center justify-center font-bold text-cyan-300 shrink-0">
                              {v.sectionNumber}
                            </span>
                            {isMastered && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-label="Quiz completed" />
                            )}
                            <span className="text-xs font-bold text-white truncate">
                              {v.title}
                            </span>
                          </div>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold shrink-0 ${getRiskBadge(v.riskLevel)}`}>
                            {v.riskLevel}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                          {v.howBreachOccurs.summary}
                        </p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
                          <span className="text-cyan-400/80">{v.category}</span>
                          <span>Section {v.sectionNumber}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Detail Pane */}
              <div className="lg:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-900/30">
                
                {/* Active Section Header */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                          Section {activeVector.sectionNumber} of 10
                        </span>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${getRiskBadge(activeVector.riskLevel)}`}>
                          {activeVector.riskLevel} priority
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {activeSectionData.page}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-1">
                        {activeVector.title}
                      </h3>
                    </div>

                    {/* Audio Signature & Executive Voice Debrief */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleToggleVoiceBriefing}
                        title="Listen to Executive Voice Briefing of this policy section"
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                          isSpeakingBriefing
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                        }`}
                      >
                        {isSpeakingBriefing ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span>{isSpeakingBriefing ? 'Stop Audio' : 'Voice Briefing'}</span>
                      </button>

                      <button
                        onClick={handlePlayThreatAudio}
                        disabled={isPlayingAudio}
                        title="Simulate audible threat signature telemetry"
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Play className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-rose-400' : ''}`} />
                        <span>{isPlayingAudio ? 'Broadcasting...' : 'Acoustic Signature'}</span>
                      </button>

                      {onTrackOnRadar && (
                        <button
                          onClick={() => onTrackOnRadar(activeVector.id)}
                          title="Track sample breach on Tactical Radar"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <Radio className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Radar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {activeVector.targetAudienceNote}
                  </p>

                  {/* Audible Signature Mini Status */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <div>
                      Acoustic Signature: <span className="text-cyan-300">{activeVector.audioSignature.name}</span>
                    </div>
                    <div className="text-slate-500">
                      {activeVector.audioSignature.acousticProfile}
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => {
                      setActiveTab('blueprint');
                      soundManager.playBlip(650);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'blueprint'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>1. Attack Sequence</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('rules');
                      soundManager.playBlip(750);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'rules'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>2. DO &amp; DON'T Rules</span>
                  </button>

                  {activeVector.codeComparison && (
                    <button
                      onClick={() => {
                        setActiveTab('code');
                        soundManager.playBlip(850);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'code'
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>3. Policy Diff</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab('quiz');
                      soundManager.playBlip(950);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'quiz'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>4. Instinct Quiz</span>
                    {quizAnswers[activeVector.id] === activeVector.quiz.correctIndex && (
                      <Check className="w-3 h-3 text-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('officialText');
                      soundManager.playBlip(1000);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'officialText'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>5. Official Policy Text</span>
                  </button>
                </div>

                {/* TAB 1: ATTACK ANATOMY & BLAST RADIUS */}
                {activeTab === 'blueprint' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Interactive 3-Step Visual Sequence Scrubber */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                          <Radio className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Interactive Attack Progression Sequence</span>
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                          Select a stage to inspect telemetry
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {activeVector.anatomySteps.map((step, idx) => {
                          const isSelected = activeScrubberStep === idx;
                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                setActiveScrubberStep(idx);
                                soundManager.playBlip(500 + idx * 100);
                              }}
                              className={`relative p-4 rounded-2xl border flex flex-col justify-between gap-2 overflow-hidden cursor-pointer transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50' 
                                  : 'bg-slate-950/70 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/40'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-400" />
                              )}
                              
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className={`px-2 py-0.5 rounded-full font-bold ${
                                  isSelected 
                                    ? 'bg-cyan-500 text-slate-950' 
                                    : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                                }`}>
                                  STAGE {idx + 1}
                                </span>
                                <span className="text-slate-400 uppercase tracking-wider">{step.phase}</span>
                              </div>

                              <div>
                                <h5 className="text-sm font-bold text-white font-display mt-1">
                                  {step.title}
                                </h5>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                                  {step.description}
                                </p>
                              </div>

                              <div className="text-[10px] font-mono pt-2 border-t border-white/5 flex items-center justify-between">
                                <span className="text-cyan-400/90">Actor: <strong className="text-slate-200">{step.actor}</strong></span>
                                {isSelected && (
                                  <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-semibold">● ACTIVE</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Common Scenarios & Underlying Mechanics */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                      <span className="text-xs font-mono uppercase text-slate-300 font-bold block">
                        Realistic Workplace Scenarios:
                      </span>
                      <ul className="space-y-2">
                        {activeVector.howBreachOccurs.commonScenarios.map((scenario, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                            <span>{scenario}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono text-slate-300">
                        <strong className="text-cyan-300">Underlying Attack Mechanics:</strong>{' '}
                        {activeVector.howBreachOccurs.mechanics}
                      </div>
                    </div>

                    {/* Downstream Blast Radius */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Downstream Blast Radius (Business &amp; Legal Consequences)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1">
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                            Business Impact
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {activeVector.downstreamBlastRadius.businessImpact}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1">
                          <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                            Data at Risk
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {activeVector.downstreamBlastRadius.dataAtRisk}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-purple-500/20 space-y-1">
                          <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                            Legal &amp; Compliance
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {activeVector.downstreamBlastRadius.legalOrCompliance}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PREVENTION RULES (DO & DONT) */}
                {activeTab === 'rules' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Golden Rules */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>The Golden Protocols:</span>
                      </span>
                      <ol className="space-y-2 list-decimal list-inside text-xs text-slate-200">
                        {activeVector.howToPrevent.goldenRules.map((rule, i) => (
                          <li key={i} className="leading-relaxed pl-1 font-sans">
                            {rule}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* High-Contrast DO vs DONT Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* DO */}
                      <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono uppercase">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Always Do (Approved Habits)</span>
                        </div>
                        <ul className="space-y-2">
                          {activeVector.howToPrevent.doList.map((doItem, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed font-sans">
                              <span className="text-emerald-400 font-bold shrink-0">✓</span>
                              <span>{doItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* DONT */}
                      <div className="p-4 rounded-2xl bg-rose-950/15 border border-rose-500/30 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 font-mono uppercase">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Never Do (Strictly Prohibited)</span>
                        </div>
                        <ul className="space-y-2">
                          {activeVector.howToPrevent.dontList.map((dontItem, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed font-sans">
                              <span className="text-rose-400 font-bold shrink-0">✕</span>
                              <span>{dontItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Approved Tooling */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                      <span className="text-slate-400">Sanctioned Enterprise Tooling:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {activeVector.howToPrevent.ApprovedAlternatives.map((alt, i) => (
                          <code key={i} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px]">
                            {alt}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CODE & POLICY DIFF COMPARISON */}
                {activeTab === 'code' && activeVector.codeComparison && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Standard / Format: <strong className="text-cyan-300 uppercase">{activeVector.codeComparison.language}</strong></span>
                      <span>Side-by-side compliance review</span>
                    </div>

                    {/* Bad Practice */}
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-300 font-mono flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          {activeVector.codeComparison.badLabel}
                        </span>
                        <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">NON-COMPLIANT</span>
                      </div>
                      <pre className="p-3 rounded-xl bg-black/70 border border-rose-500/20 text-xs font-mono text-rose-200 overflow-x-auto leading-relaxed">
                        <code>{activeVector.codeComparison.badCode}</code>
                      </pre>
                      <p className="text-xs text-slate-300 font-sans">
                        <strong className="text-rose-400">Risk Assessment:</strong> {activeVector.codeComparison.badReason}
                      </p>
                    </div>

                    {/* Good Practice */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {activeVector.codeComparison.goodLabel}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">SANCTIONED POLICY</span>
                      </div>
                      <pre className="p-3 rounded-xl bg-black/70 border border-emerald-500/20 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                        <code>{activeVector.codeComparison.goodCode}</code>
                      </pre>
                      <p className="text-xs text-slate-300 font-sans">
                        <strong className="text-emerald-400">Defense Benefit:</strong> {activeVector.codeComparison.goodReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 4: INSTINCT QUIZ */}
                {activeTab === 'quiz' && (
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                          Stewart Policy Instinct Challenge
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        Section {activeVector.sectionNumber}: {activeVector.category}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-sm font-semibold text-white leading-relaxed">
                      {activeVector.quiz.question}
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {activeVector.quiz.options.map((option, idx) => {
                        const hasSelected = quizAnswers[activeVector.id] !== undefined;
                        const isChosen = quizAnswers[activeVector.id] === idx;
                        const isCorrect = idx === activeVector.quiz.correctIndex;

                        let btnStyle = "bg-slate-900/40 border-white/10 text-slate-300 hover:bg-slate-900/80 hover:border-white/20";
                        if (hasSelected) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                          } else if (isChosen) {
                            btnStyle = "bg-rose-500/20 border-rose-500/60 text-rose-200";
                          } else {
                            btnStyle = "bg-slate-950/40 border-white/5 text-slate-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerQuiz(idx)}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 font-bold">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1 font-sans">{option}</span>
                            {hasSelected && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {hasSelected && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Card */}
                    {quizAnswers[activeVector.id] !== undefined && (
                      <div className={`p-4 rounded-xl border text-xs space-y-1.5 animate-in fade-in duration-200 ${
                        quizAnswers[activeVector.id] === activeVector.quiz.correctIndex
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      }`}>
                        <div className="flex items-center gap-2 font-bold font-display">
                          {quizAnswers[activeVector.id] === activeVector.quiz.correctIndex ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Instinct Verified: Correct Stewart Protocol!</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              <span>Review Policy Requirement</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {activeVector.quiz.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: OFFICIAL VERBATIM POLICY TEXT */}
                {activeTab === 'officialText' && (
                  <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          Official Verbatim Policy • {activeSectionData.page}
                        </span>
                        <h4 className="text-base font-bold font-display text-white mt-0.5">
                          {activeSectionData.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        {STEWART_POLICY_METADATA.copyright}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line space-y-2">
                      {activeSectionData.fullText}
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                        Directives Summary:
                      </span>
                      <ul className="space-y-1">
                        {activeSectionData.keyDirectives.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Bottom Pledge & Sentinel Sign-Off */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTogglePledge}
                      className="w-6 h-6 rounded-lg border border-cyan-400 flex items-center justify-center transition-colors cursor-pointer bg-cyan-500/20 text-cyan-300 shrink-0"
                    >
                      {hasAcknowledgedPledge ? <Check className="w-4 h-4" /> : null}
                    </button>
                    <div className="text-xs">
                      <span className="font-bold text-white block">
                        Stewart IT Security &amp; Usage Acknowledgment
                      </span>
                      <span className="text-[11px] text-slate-400">
                        I acknowledge receipt of Policy v7.0 and commit to upholding Stewart’s information security standards and prompt incident reporting.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCertificate(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Sentinel Credential</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border-2 border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.35)] space-y-6 text-center">
            
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emblem */}
            <div className="flex justify-center">
              <BrandLogo size="lg" withText={false} />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                STEWART INFORMATION SERVICES CORPORATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                Information Security Sentinel
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                IT Security &amp; Usage Policy (v7.0) Official Certification
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-mono">Awarded to:</div>
              <div className="text-xl font-bold font-display text-cyan-300">
                {userName}
              </div>
              <div className="text-xs text-slate-300 font-mono">
                Role: <span className="text-white font-semibold">{userRole}</span> • Clearance Rank:{' '}
                <span className="text-emerald-400 font-bold">
                  {auditScore >= 90 && masteredCount >= 8 
                    ? 'Level 3 Apex Guardian' 
                    : auditScore >= 70 
                    ? 'Level 2 Enterprise Defender' 
                    : 'Level 1 Security Sentinel'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">Policy Quizzes</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{masteredCount} / 10 Mastered</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">Readiness Audit</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{auditScore}% Compliant</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">Acknowledgment</span>
                <span className={`text-sm font-bold font-mono ${hasAcknowledgedPledge ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {hasAcknowledgedPledge ? 'Pledged' : 'Pending'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block">Crypto Verification</span>
                <span className="text-xs font-bold text-purple-400 font-mono truncate block">SHA-256: 9b72a...4f</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 text-left space-y-1">
              <div className="text-cyan-300 font-bold">Emergency Contacts on File:</div>
              <div>• Incident Desk: <span className="text-white">itsecurity@stewart.com</span> (&lt; 1 hr critical)</div>
              <div>• EthicsPoint Hotline: <span className="text-white">(866) 384-4277</span> (Whistleblower Protection)</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>

              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Return to Handbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
