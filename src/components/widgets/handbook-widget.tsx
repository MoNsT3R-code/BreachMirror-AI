import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  FileCode, 
  Lock, 
  Cloud, 
  HardDrive,
  HeartHandshake,
  ChevronRight,
  Radio,
  Volume2,
  Zap,
  Award,
  Scale,
  Building2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { HANDBOOK_VECTORS, HANDBOOK_MARKDOWN_EXPORT } from '../../data/handbook-content';
import { 
  STEWART_CODE_PILLARS, 
  STEWART_CORP_METADATA,
  STEWART_DNA 
} from '../../data/conduct-content';
import { soundManager } from '../../services/sound-effects';

interface HandbookWidgetProps {
  onOpenFullHandbook: () => void;
  onOpenCodeOfConduct?: () => void;
  userRole?: string;
  onTrackOnRadar?: (vectorId: string) => void;
}

export const HandbookWidget: React.FC<HandbookWidgetProps> = ({
  onOpenFullHandbook,
  onOpenCodeOfConduct,
  userRole = 'New Joiner',
  onTrackOnRadar,
}) => {
  const [activeHandbookTab, setActiveHandbookTab] = useState<'codeOfConduct' | 'itSecurity'>('codeOfConduct');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [selectedPillarIdx, setSelectedPillarIdx] = useState<number>(0);
  const [isPlayingSiren, setIsPlayingSiren] = useState<boolean>(false);
  
  const activeVector = HANDBOOK_VECTORS[selectedIdx];
  const activePillar = STEWART_CODE_PILLARS[selectedPillarIdx];

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([HANDBOOK_MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stewart-it-security-and-usage-v7.0.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePlayThreatAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSiren(true);
    soundManager.playThreatAlarm(activeVector.riskLevel, {
      voiceAlert: true,
      threatName: activeVector.title,
    });
    setTimeout(() => {
      setIsPlayingSiren(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* View Switcher: Code of Conduct vs IT Security */}
      <div className="flex items-center justify-between gap-2 p-1 rounded-xl bg-slate-950/80 border border-white/5 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveHandbookTab('codeOfConduct');
              soundManager.playBlip(700);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeHandbookTab === 'codeOfConduct'
                ? 'bg-[#9B2743] text-white shadow-[0_0_12px_rgba(155,39,67,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Code of Conduct (7 Pillars)</span>
          </button>

          <button
            onClick={() => {
              setActiveHandbookTab('itSecurity');
              soundManager.playBlip(800);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeHandbookTab === 'itSecurity'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>IT Security (v7.0)</span>
          </button>
        </div>

        {activeHandbookTab === 'codeOfConduct' && onOpenCodeOfConduct && (
          <button
            onClick={onOpenCodeOfConduct}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#9B2743]/30 text-rose-300 border border-white/10 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Open Code</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* TAB 1: CODE OF CONDUCT (7 PILLARS) */}
      {activeHandbookTab === 'codeOfConduct' && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          {/* Header Strip */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#9B2743]/20 border border-[#9B2743]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#9B2743]/20 border border-[#9B2743]/40 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-display">
                    {STEWART_CORP_METADATA.tagline}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                    OFFICIAL CODE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Stewart Information Services Corporation • Hotline: (866) 384-4277
                </p>
              </div>
            </div>

            {onOpenCodeOfConduct && (
              <button
                onClick={onOpenCodeOfConduct}
                className="px-2.5 py-1.5 rounded-lg bg-[#9B2743] hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(155,39,67,0.3)] shrink-0"
              >
                <span>Full Code</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Pillars Selector */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
            {STEWART_CODE_PILLARS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPillarIdx(i);
                  soundManager.playBlip(650 + i * 40);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPillarIdx === i
                    ? 'bg-[#9B2743]/30 text-rose-200 border border-[#9B2743] shadow-[0_0_10px_rgba(155,39,67,0.2)]'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Pillar {p.number}: {p.title.replace('WE ', '')}
              </button>
            ))}
          </div>

          {/* Pillar Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {activePillar.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  {activePillar.pageRange}
                </span>
              </div>

              <p className="text-xs text-rose-200/90 italic">
                "{activePillar.tagline}"
              </p>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activePillar.summary}
              </p>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Core Requirements:
                </span>
                <ul className="space-y-1">
                  {activePillar.corePillars.slice(0, 3).map((r, rIdx) => (
                    <li key={rIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Ethics Hotline: <strong className="text-rose-400">(866) 384-4277</strong>
              </span>

              {onOpenCodeOfConduct && (
                <button
                  onClick={onOpenCodeOfConduct}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Explore Subtopics &amp; 8 Questions</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IT SECURITY (v7.0) */}
      {activeHandbookTab === 'itSecurity' && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          {/* Top Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-display">
                    Stewart IT Security &amp; Usage
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                    v7.0 POLICY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  10 Core Directives • Zero-retaliation reporting at itsecurity@stewart.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleDownload}
                title="Download full handbook as .md file"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono hidden sm:inline">.md</span>
              </button>

              <button
                onClick={onOpenFullHandbook}
                title="Open comprehensive interactive handbook"
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                <span>Expand</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Vector Pill Selector */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
            {HANDBOOK_VECTORS.map((v, i) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedIdx(i);
                  soundManager.playBlip(600 + i * 50);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedIdx === i
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {v.title.split('&')[0].trim()}
              </button>
            ))}
          </div>

          {/* Active Threat Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-white/10 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-display">
                    {activeVector.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {onTrackOnRadar && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrackOnRadar(activeVector.id);
                      }}
                      title="Detect and lock onto this sample breach in the 3D Radar"
                      className="p-1 px-2 rounded-lg border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>RADAR</span>
                    </button>
                  )}

                  <button
                    onClick={handlePlayThreatAudio}
                    title="Play threat siren audio signature"
                    className={`p-1 px-2 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                      isPlayingSiren 
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                    }`}
                  >
                    <Radio className={`w-3 h-3 ${isPlayingSiren ? 'animate-spin text-white' : 'text-rose-400'}`} />
                    <span>{isPlayingSiren ? 'SIREN' : 'AUDIO'}</span>
                  </button>

                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold">
                    {activeVector.riskLevel}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeVector.howBreachOccurs.summary}
              </p>

              {/* DO vs DONT Quick Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/5">
                <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Approved Habit
                  </span>
                  <p className="text-[11px] text-slate-200 line-clamp-2">
                    {activeVector.howToPrevent.doList[0]}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Prohibited
                  </span>
                  <p className="text-[11px] text-slate-200 line-clamp-2">
                    {activeVector.howToPrevent.dontList[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Footnote */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <code className="text-cyan-400">{activeVector.audioSignature.decibelLevel.split(' ')[0]} dB acoustic profile</code>
              </span>
              <button
                onClick={onOpenFullHandbook}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Interactive Guide &amp; Quiz</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

