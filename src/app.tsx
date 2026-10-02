import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './context/theme-context';
import { AlertProvider, useAlerts } from './context/alert-context';
import { AuthRole, UserSession, ThreatEvent, WidgetConfig } from './shared-types';
import { DEFAULT_WIDGETS } from './data/sample-data';
import { HANDBOOK_VECTORS } from './data/handbook-content';
import { acknowledgeBreachApi, fetchHealth, HealthStatus, logoutApi, sessionApi } from './services/local-api';

// Components
import { LoginPanel } from './components/auth/login-panel';
import { NavigationBar } from './components/common/navigation-bar';
import { MouseGlowBackground } from './components/common/mouse-glow-background';
import { WidgetCustomizerModal } from './components/common/widget-customizer-modal';
import { KeyboardShortcutsModal } from './components/common/keyboard-shortcuts-modal';
import { BreachDetailModal } from './components/common/breach-detail-modal';
import { ThreatSandboxModal } from './components/common/threat-sandbox-modal';
import { SecurityHandbookModal } from './components/common/security-handbook-modal';
import { ThreatRadarModal } from './components/common/threat-radar-modal';
import { ConfessionAirlockModal } from './components/common/confession-airlock-modal';
import { ConductModal } from './components/common/conduct-modal';
import { CertificationQuizModal } from './components/common/certification-quiz-modal';
import { SearchBar } from './components/common/search-bar';
import { LoadingScreen } from './components/common/loading-screen';
import { WidgetContainer } from './components/common/widget-container';

// Widgets
import { ThreatSpeedWidget } from './components/widgets/threat-speed-widget';
import { ThreatFeedWidget } from './components/widgets/threat-feed-widget';
import { HandbookWidget } from './components/widgets/handbook-widget';
import { ActiveThreatsWidget } from './components/widgets/active-threats-widget';
import { DoAndDontWidget } from './components/widgets/do-and-dont-widget';
import { OnboardingChecklistWidget } from './components/widgets/onboarding-checklist-widget';
import { WorkplaceScenariosWidget } from './components/widgets/workplace-scenarios-widget';
import { ThreatStreamChart } from './components/widgets/threat-stream-chart';
import { AttackVectorChart } from './components/widgets/attack-vector-chart';
import { TenureRiskChart } from './components/widgets/tenure-risk-chart';
import { RadarWidget } from './components/widgets/radar-widget';

import { 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  Zap, 
  Sliders, 
  BrainCircuit, 
  RotateCcw,
  BookOpen,
  Flame,
  Radio,
  LifeBuoy,
  Volume2,
  Crosshair,
  ShieldCheck,
  Activity,
  Scale,
  Award
} from 'lucide-react';

function DashboardApp({
  session,
  onLogout,
}: {
  session: UserSession;
  onLogout: () => void;
}) {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('bm_widgets_cfg');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_WIDGETS;
  });

  // Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isAiSandboxOpen, setIsAiSandboxOpen] = useState<boolean>(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isCodeOfConductOpen, setIsCodeOfConductOpen] = useState<boolean>(false);
  const [isMasterQuizOpen, setIsMasterQuizOpen] = useState<boolean>(false);
  const [isRadarOpen, setIsRadarOpen] = useState<boolean>(false);
  const [isAirlockOpen, setIsAirlockOpen] = useState<boolean>(false);
  const [activeBreachDetail, setActiveBreachDetail] = useState<ThreatEvent | null>(null);
  const [selectedHandbookVectorId, setSelectedHandbookVectorId] = useState<string | undefined>(undefined);
  const [selectedRadarBreachId, setSelectedRadarBreachId] = useState<string | undefined>(undefined);

  // Vengeance context
  const { 
    isVengeanceMode, 
    toggleVengeanceMode, 
    defconLevel, 
    countermeasuresCount,
    toggleSound
  } = useAlerts();

  // Health
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);

  // Search & Simulation
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  useEffect(() => {
    fetchHealth().then(setBackendHealth);
  }, []);

  const handleInjectSimulatedBreach = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast(`Threat stopped: GenAI ingestion blocked on endpoint WKS-DEV-902`);
    }, 800);
  }, [showToast]);

  const handleCloseModals = useCallback(() => {
    setIsCustomizerOpen(false);
    setIsShortcutsOpen(false);
    setIsAiSandboxOpen(false);
    setIsHandbookOpen(false);
    setIsCodeOfConductOpen(false);
    setIsMasterQuizOpen(false);
    setIsRadarOpen(false);
    setIsAirlockOpen(false);
    setActiveBreachDetail(null);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape') {
          target.blur();
          handleCloseModals();
        }
        return;
      }

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (e.key === '1') {
        setCurrentTab('overview');
      } else if (e.key === '2') {
        setCurrentTab('telemetry');
      } else if (e.key === '3') {
        setCurrentTab('playbook');
      } else if (e.key === '4') {
        setCurrentTab('analytics');
      } else if (e.key === '5') {
        setCurrentTab('simulator');
      } else if (e.key === 'v' || e.key === 'V') {
        toggleVengeanceMode();
        showToast(isVengeanceMode ? 'Vengeance Overdrive is on standby' : 'Vengeance Overdrive is now active');
      } else if (e.key === 'u' || e.key === 'U') {
        setIsRadarOpen(true);
      } else if (e.key === 'a' || e.key === 'A') {
        setIsAirlockOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        const soundOn = toggleSound();
        showToast(soundOn ? 'Sound effects are on' : 'Sound effects are muted');
      } else if (e.key === 'h' || e.key === 'H') {
        setIsHandbookOpen(true);
      } else if (e.key === 'o' || e.key === 'O') {
        setIsCodeOfConductOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        setIsAiSandboxOpen(true);
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsMasterQuizOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        handleInjectSimulatedBreach();
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCustomizerOpen(true);
      } else if (e.key === 'Escape') {
        handleCloseModals();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseModals, handleInjectSimulatedBreach, toggleVengeanceMode, isVengeanceMode, toggleSound, showToast]);

  const handleUpdateWidgets = (updated: WidgetConfig[]) => {
    setWidgets(updated);
    localStorage.setItem('bm_widgets_cfg', JSON.stringify(updated));
    showToast('Dashboard layout updated.');
  };

  const handleResetWidgets = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem('bm_widgets_cfg');
    showToast('Reset to default layout.');
  };

  // Filter widgets by tab and search
  const visibleWidgets = widgets.filter(w => {
    if (!w.visible) return false;
    if (currentTab !== 'overview' && w.category !== currentTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.title.toLowerCase().includes(q) ||
        w.subtitle.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case 'handbook-radar':
        return (
          <RadarWidget
            onOpenFullRadar={() => {
              setSelectedRadarBreachId(undefined);
              setIsRadarOpen(true);
            }}
            onOpenHandbook={(vectorId) => {
              if (vectorId) setSelectedHandbookVectorId(vectorId);
              setIsHandbookOpen(true);
            }}
          />
        );
      case 'telemetry-velocity':
        return <ThreatSpeedWidget onInjectSimulatedBreach={handleInjectSimulatedBreach} />;
      case 'telemetry-feed':
        return <ThreatFeedWidget onInspectBreach={(e) => setActiveBreachDetail(e)} />;
      case 'security-handbook':
        return (
          <HandbookWidget 
            onOpenFullHandbook={() => setIsHandbookOpen(true)} 
            onOpenCodeOfConduct={() => setIsCodeOfConductOpen(true)}
            userRole={session.role} 
            onTrackOnRadar={(vectorId) => {
              setSelectedRadarBreachId(vectorId);
              setIsRadarOpen(true);
            }}
          />
        );
      case 'dos-and-donts':
        return <DoAndDontWidget />;
      case 'd3-threat-stream':
        return <ThreatStreamChart />;
      case 'd3-attack-vectors':
        return <AttackVectorChart />;
      case 'workplace-dilemma':
        return <WorkplaceScenariosWidget />;
      case 'd3-tenure-risk':
        return <TenureRiskChart />;
      case 'new-joiner-checklist':
        return <OnboardingChecklistWidget />;
      case 'active-vectors':
        return <ActiveThreatsWidget />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-cyan-500 selection:text-black">
      <MouseGlowBackground />

      {/* Navbar with logged-in user profile & logout button */}
      <NavigationBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onInjectBreach={handleInjectSimulatedBreach}
        onOpenAiSandbox={() => setIsAiSandboxOpen(true)}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenCodeOfConduct={() => setIsCodeOfConductOpen(true)}
        onOpenRadar={() => setIsRadarOpen(true)}
        onOpenAirlock={() => setIsAirlockOpen(true)}
        operatorName={session.name}
        operatorRole={session.role}
        onLogout={onLogout}
      />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-8">
        {/* Spacious, uncrowded Hero Overview Banner */}
        <section 
          aria-label="Welcome Banner"
          className="p-6 sm:p-8 rounded-3xl vengeance-glass border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col items-stretch gap-6 relative overflow-hidden shadow-2xl"
        >
          <div className="space-y-3 w-full max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Training simulation only
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                Local profile: {session.name} (not verified)
              </span>
              <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                Training role: {session.role}
              </span>
            </div>

            {/* Dynamic Welcome Heading with the user's name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
              Welcome, <span className="welcome-officer-name text-black dark:text-white font-bold">{session.name}</span>
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Practice security scenarios with supportive coaching. This local app does not provide live monitoring, account authentication, or protection for other systems.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="w-full flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsRadarOpen(true)}
              title="Open the security radar (Hotkey: U)"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Security Radar</span>
            </button>

            <button
              onClick={() => setIsAirlockOpen(true)}
              title="Open the private reporting tool (Hotkey: A)"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <LifeBuoy className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Private Report</span>
            </button>

            <button
              onClick={() => setIsCodeOfConductOpen(true)}
              title="Open Stewart Code of Business Conduct ('Integrity is at Home Here') (Hotkey: O)"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-[#9B2743]/20 hover:bg-[#9B2743]/30 border border-[#9B2743]/50 text-rose-200 hover:text-white text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(155,39,67,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Scale className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Code of Conduct</span>
            </button>

            <button
              onClick={() => setIsHandbookOpen(true)}
              title="Open the new employee security handbook (Hotkey: H)"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 hover:text-sky-200 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.2)] hover:scale-105 active:scale-95 shrink-0"
            >
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Security Handbook</span>
            </button>

            <button
              onClick={() => setIsMasterQuizOpen(true)}
              title="Open the security and conduct quiz (Hotkey: Q)"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-amber-100 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Master Exam</span>
            </button>

            <button
              onClick={() => setIsAiSandboxOpen(true)}
              title="Open the AI practice tool (Hotkey: S)"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 hover:text-purple-100 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">AI Sandbox</span>
            </button>
          </div>
        </section>

        {/* Global Search Bar (Positioned on top directly after Welcome Panel with Recommendations) */}
        <section 
          aria-label="Handbook and Perimeter Search"
          className="relative z-20 vengeance-glass p-4 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-display">
                  Search the security handbook
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Search the IT security policy and code of conduct
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold">
                {visibleWidgets.length} Active Sections
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer ml-1"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={(q) => showToast(`Filtered dashboard & handbook for "${q}"`)}
              onSelectRecommendation={(rec) => {
                showToast(`Loaded directive: ${rec.title} (${rec.badge})`);
                if (rec.category === 'Security Policy') {
                  // If it corresponds to a section, can select vector
                  const match = HANDBOOK_VECTORS.find(v => `Section ${v.sectionNumber}` === rec.badge || v.title.toLowerCase().includes(rec.queryText.toLowerCase()));
                  if (match) setSelectedHandbookVectorId(match.id);
                }
              }}
              placeholder="Search events, policies, guidance, and devices..."
            />
          </div>
        </section>

        {/* Enhanced protection controls */}
        <section className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isVengeanceMode
            ? 'bg-gradient-to-r from-rose-950/70 via-purple-950/60 to-slate-950/80 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
            : 'bg-slate-900/60 border-white/10 vengeance-glass'
        } flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              isVengeanceMode
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              <Flame className={`w-5 h-5 ${isVengeanceMode ? 'animate-bounce text-amber-300' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-white uppercase font-display tracking-wider">
                  Enhanced protection: {isVengeanceMode ? 'On' : 'Off'}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  defconLevel === 1 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-white/10 text-slate-200'
                }`}>
                  Alert level {defconLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {countermeasuresCount} automated safeguards are active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={toggleVengeanceMode}
              className={`h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 ${
                isVengeanceMode
                  ? 'bg-rose-600/30 hover:bg-rose-600/40 border border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{isVengeanceMode ? 'Turn off enhanced protection' : 'Turn on enhanced protection'}</span>
            </button>

            <button
              onClick={() => setIsRadarOpen(true)}
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Open Security Radar</span>
            </button>

            <button
              onClick={() => setIsAirlockOpen(true)}
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <LifeBuoy className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Private Report</span>
            </button>
          </div>
        </section>

        {/* Grid of Modular Widgets (Arranged spaciously with max 2 columns for comfortable reading) */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
          role="region"
          aria-label="Modular dashboard widget grid"
        >
          {visibleWidgets.length === 0 ? (
            <div className="col-span-full p-12 text-center vengeance-glass rounded-3xl border border-white/10 space-y-3">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-500" />
              <h3 className="text-base font-bold text-white">No widgets visible in this category</h3>
              <p className="text-xs text-slate-400">
                Select "Customize" in the navigation bar to show more dashboard cards.
              </p>
              <button
                onClick={handleResetWidgets}
                className="h-10 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Default Layout
              </button>
            </div>
          ) : (
            visibleWidgets.map((w, idx) => (
              <WidgetContainer
                key={w.id}
                id={w.id}
                title={w.title}
                subtitle={w.subtitle}
                category={w.category}
                width={w.width}
                closable={w.closable}
                isFirst={idx === 0}
                isLast={idx === visibleWidgets.length - 1}
                onHide={() => {
                  const updated = widgets.map(item => item.id === w.id ? { ...item, visible: false } : item);
                  handleUpdateWidgets(updated);
                }}
              >
                {renderWidgetContent(w.id)}
              </WidgetContainer>
            ))
          )}
        </div>
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="mt-auto border-t border-white/5 bg-slate-950/80 backdrop-blur-xl py-4 px-6 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Active Operator: {session.name} ({session.role})
            </span>
            <span>·</span>
            <span className="text-slate-500 hidden sm:inline">Stewart Information Services Corp</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-rose-400 font-semibold">Ethics Hotline: (866) 384-4277</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-rose-300 font-bold">O</kbd> Code of Conduct</span>
            <span>·</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-300">S</kbd> AI Sandbox</span>
            <span>·</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-300">?</kbd> Shortcuts</span>
          </div>
        </div>
      </footer>

      {/* Notification Toast */}
      {toastMessage && (
        <div 
          role="alert"
          className="fixed bottom-12 right-6 z-50 p-4 rounded-2xl vengeance-glass border border-cyan-500/40 text-xs text-white shadow-2xl flex items-center gap-3 bg-slate-950/95 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Cyber Loader Simulation Overlay */}
      {isSimulating && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          role="status"
          aria-live="assertive"
        >
          <div className="bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] max-w-sm w-full mx-4 flex flex-col items-center">
              <LoadingScreen label="Running practice scenario and estimating impact..." />
          </div>
        </div>
      )}

      {/* Modals */}
      <WidgetCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        widgets={widgets}
        onUpdateWidgets={handleUpdateWidgets}
        onResetDefaults={handleResetWidgets}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <BreachDetailModal
        event={activeBreachDetail}
        onClose={() => setActiveBreachDetail(null)}
        onAcknowledge={async (id) => {
          await acknowledgeBreachApi(id, 'RESOLVE');
          showToast(`Incident #${id} acknowledged and quarantined.`);
        }}
      />

      <ThreatSandboxModal
        isOpen={isAiSandboxOpen}
        onClose={() => setIsAiSandboxOpen(false)}
        userRole={session.role}
      />

      <SecurityHandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
        userRole={session.role}
        userName={session.name}
        initialVectorId={selectedHandbookVectorId}
        onTrackOnRadar={(vectorId) => {
          setSelectedRadarBreachId(vectorId);
          setIsHandbookOpen(false);
          setIsRadarOpen(true);
        }}
        onOpenCodeOfConduct={() => setIsCodeOfConductOpen(true)}
        onOpenMasterQuiz={() => setIsMasterQuizOpen(true)}
      />

      <ConductModal
        isOpen={isCodeOfConductOpen}
        onClose={() => setIsCodeOfConductOpen(false)}
        userName={session.name}
        userRole={session.role}
        onOpenMasterQuiz={() => setIsMasterQuizOpen(true)}
      />

      <CertificationQuizModal
        isOpen={isMasterQuizOpen}
        onClose={() => setIsMasterQuizOpen(false)}
        userName={session.name}
        userRole={session.role}
      />

      <ThreatRadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        initialBreachId={selectedRadarBreachId}
        onOpenHandbookVector={(vectorId) => {
          setSelectedHandbookVectorId(vectorId);
          setIsRadarOpen(false);
          setIsHandbookOpen(true);
        }}
      />

      <ConfessionAirlockModal
        isOpen={isAirlockOpen}
        onClose={() => setIsAirlockOpen(false)}
        userName={session.name}
      />
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<UserSession>({ isLoggedIn: false, name: '', role: 'Incident Commander', avatarSeed: 'operative-1' });
  const [sessionMessage, setSessionMessage] = useState<string>('');

  const handleLogin = (user: { id: string; name: string; email: string; role: AuthRole }) => {
    const newSession: UserSession = {
      isLoggedIn: true,
      name: user.name,
      role: user.role,
      avatarSeed: user.id,
      loginTime: new Date().toLocaleTimeString(),
    };
    setSession(newSession);
    setSessionMessage('');
  };

  const handleLogout = async () => { await logoutApi().catch(() => undefined); setSession({ isLoggedIn: false, name: '', role: 'Incident Commander', avatarSeed: 'operative-1' }); };

  useEffect(() => {
    sessionApi().then(result => handleLogin(result.user)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!session.isLoggedIn) return undefined;
    const interval = window.setInterval(() => {
      sessionApi().catch(() => { setSession({ isLoggedIn: false, name: '', role: 'Incident Commander', avatarSeed: 'operative-1' }); setSessionMessage('Session expired. Please login again.'); });
    }, 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [session.isLoggedIn]);

  return (
    <ThemeProvider>
      <AlertProvider>
        {!session.isLoggedIn ? (
          <LoginPanel 
            onLogin={handleLogin}
            initialName={session.name}
            sessionMessage={sessionMessage}
          />
        ) : (
          <DashboardApp 
            session={session} 
            onLogout={handleLogout} 
          />
        )}
      </AlertProvider>
    </ThemeProvider>
  );
}
