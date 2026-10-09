import React, { lazy, Suspense, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/theme-context';
import { AlertProvider, useAlerts } from './context/alert-context';
import { AuthRole, UserSession, ThreatEvent, WidgetConfig } from './shared-types';
import { DEFAULT_WIDGETS } from './data/sample-data';
import { HANDBOOK_VECTORS } from './data/handbook-content';
import { acknowledgeBreachApi, logoutApi, sessionApi } from './services/local-api';
import { usePosture } from './hooks/use-posture';
import { injectEvent } from './services/live-telemetry';

import { LoginPanel } from './components/auth/login-panel';
import { AppHeader, TABS, TabId } from './components/shell/app-header';
import { Breadcrumbs } from './components/shell/breadcrumbs';
import { CommandPalette, PaletteCommand } from './components/shell/command-palette';
import { SceneryBackground } from './components/shell/scenery-background';
import { AmbientBackground, CursorFx } from './components/shell/cursor-fx';
import { PostureCard } from './components/dashboard/posture-card';
import { HomePage } from './components/home/home-page';
import { JourneyCard } from './components/learning/journey-card';
import { computeJourney } from './services/learning-progress';
import { useSupportSummary } from './components/support/use-support-summary';
import { ToolGrid, ToolId } from './components/dashboard/tool-grid';
import { WidgetGrid } from './components/dashboard/widget-grid';
import { WidgetCustomizerModal } from './components/common/widget-customizer-modal';
import { KeyboardShortcutsModal } from './components/common/keyboard-shortcuts-modal';
import { BreachDetailModal } from './components/common/breach-detail-modal';
import type { HandbookViewMode } from './components/common/security-handbook-modal';

const ThreatSandboxModal = lazy(() => import('./components/common/threat-sandbox-modal').then(m => ({ default: m.ThreatSandboxModal })));
const SecurityHandbookModal = lazy(() => import('./components/common/security-handbook-modal').then(m => ({ default: m.SecurityHandbookModal })));
const ThreatRadarModal = lazy(() => import('./components/common/threat-radar-modal').then(m => ({ default: m.ThreatRadarModal })));
const ConfessionAirlockModal = lazy(() => import('./components/common/confession-airlock-modal').then(m => ({ default: m.ConfessionAirlockModal })));
const ConductModal = lazy(() => import('./components/common/conduct-modal').then(m => ({ default: m.ConductModal })));
const CertificationQuizModal = lazy(() => import('./components/common/certification-quiz-modal').then(m => ({ default: m.CertificationQuizModal })));

const ThreatSpeedWidget = lazy(() => import('./components/widgets/threat-speed-widget').then(m => ({ default: m.ThreatSpeedWidget })));
const ThreatFeedWidget = lazy(() => import('./components/widgets/threat-feed-widget').then(m => ({ default: m.ThreatFeedWidget })));
const HandbookWidget = lazy(() => import('./components/widgets/handbook-widget').then(m => ({ default: m.HandbookWidget })));
const ActiveThreatsWidget = lazy(() => import('./components/widgets/active-threats-widget').then(m => ({ default: m.ActiveThreatsWidget })));
const DoAndDontWidget = lazy(() => import('./components/widgets/do-and-dont-widget').then(m => ({ default: m.DoAndDontWidget })));
const OnboardingChecklistWidget = lazy(() => import('./components/widgets/onboarding-checklist-widget').then(m => ({ default: m.OnboardingChecklistWidget })));
const WorkplaceScenariosWidget = lazy(() => import('./components/widgets/workplace-scenarios-widget').then(m => ({ default: m.WorkplaceScenariosWidget })));
const ThreatStreamChart = lazy(() => import('./components/widgets/threat-stream-chart').then(m => ({ default: m.ThreatStreamChart })));
const AttackVectorChart = lazy(() => import('./components/widgets/attack-vector-chart').then(m => ({ default: m.AttackVectorChart })));
const TenureRiskChart = lazy(() => import('./components/widgets/tenure-risk-chart').then(m => ({ default: m.TenureRiskChart })));
const CopilotWorkspace = lazy(() => import('./components/copilot/copilot-workspace').then(m => ({ default: m.CopilotWorkspace })));
const SupportCenter = lazy(() => import('./components/support/support-center').then(m => ({ default: m.SupportCenter })));
const RadarWidget = lazy(() => import('./components/widgets/radar-widget').then(m => ({ default: m.RadarWidget })));

import {
  Award,
  BarChart2,
  BookOpen,
  Flame,
  Headset,
  Keyboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Moon,
  Play,
  Radio,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Volume2,
} from 'lucide-react';

const TAB_COPY: Record<TabId, { title: string; description: string }> = {
  home: { title: 'BreachMirror', description: 'Your starting point: progress, shortcuts and the XYZ team.' },
  copilot: { title: 'Policy Copilot', description: 'Ask anything about the security policy or code of conduct. Hybrid retrieval and a LangGraph agent answer with cited, verified sources.' },
  overview: { title: 'Dashboard', description: 'Your security posture, learning tools and live training widgets.' },
  telemetry: { title: 'Threat activity', description: 'Simulated threat events, sensors and breach vectors.' },
  playbook: { title: 'Security guide', description: 'Policy guidance, do and don’t rules and onboarding.' },
  analytics: { title: 'Analytics', description: 'Simulated trends across attack vectors and employee tenure.' },
  simulator: { title: 'Practice', description: 'Scenario-based decision practice with consequences.' },
  support: { title: 'Security Support', description: 'Questions the approved policy content does not cover go to the Security Team. Follow your requests and their reviewed answers here.' },
};

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}

function DashboardApp({
  session,
  onLogout,
}: {
  session: UserSession;
  onLogout: () => void;
}) {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [supportTicketId, setSupportTicketId] = useState<string | undefined>(undefined);
  const { summary: supportSummary, refresh: refreshSupport } = useSupportSummary(true);
  const supportBadge = (supportSummary?.unread ?? 0) + (supportSummary?.agent?.needsAttention ?? 0);
  const openTicket = useCallback((ticketId: string) => {
    setSupportTicketId(ticketId);
    setCurrentTab('support');
  }, []);
  useEffect(() => {
    refreshSupport();
  }, [currentTab, refreshSupport]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem('bm_widgets_cfg');
      if (saved) {
        const parsed = JSON.parse(saved) as WidgetConfig[];
        // Keep newly shipped widgets that an older saved layout does not know about.
        const defaults = new Map(DEFAULT_WIDGETS.map(widget => [widget.id, widget]));
        const known = new Set(parsed.map(widget => widget.id));
        // Titles and categories always come from the current defaults; the user's order, size and visibility are kept.
        const merged = parsed.flatMap(widget => {
          const fresh = defaults.get(widget.id);
          return fresh ? [{ ...widget, title: fresh.title, subtitle: fresh.subtitle, category: fresh.category }] : [];
        });
        return [...merged, ...DEFAULT_WIDGETS.filter(widget => !known.has(widget.id))];
      }
    } catch {
      // fall through to defaults
    }
    return DEFAULT_WIDGETS;
  });

  // Dialog / tool state
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
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
  const [handbookMode, setHandbookMode] = useState<HandbookViewMode | undefined>(undefined);
  const [selectedRadarBreachId, setSelectedRadarBreachId] = useState<string | undefined>(undefined);

  const { isVengeanceMode, toggleVengeanceMode, defconLevel, setDefconLevel, countermeasuresCount, toggleSound, soundEnabled } = useAlerts();
  const { resolvedTheme, scenery, setTheme } = useTheme();

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedThreats, setSimulatedThreats] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), 3500);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Recompute posture whenever a learning tool closes (its progress lives in localStorage).
  const [progressVersion, setProgressVersion] = useState<number>(0);
  const learningOpen = isHandbookOpen || isMasterQuizOpen || isCodeOfConductOpen;
  const wasLearningOpen = useRef<boolean>(false);
  useEffect(() => {
    if (wasLearningOpen.current && !learningOpen) setProgressVersion(version => version + 1);
    wasLearningOpen.current = learningOpen;
  }, [learningOpen]);

  const posture = usePosture(defconLevel, simulatedThreats, progressVersion);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const journey = useMemo(() => computeJourney(), [progressVersion]);

  const handleInjectSimulatedBreach = useCallback(() => {
    setIsSimulating(true);
    window.setTimeout(() => {
      setIsSimulating(false);
      setSimulatedThreats(count => count + 1);
      const event = injectEvent('CRITICAL');
      showToast(`Simulation: ${event.categoryLabel} blocked on ${event.sourceEndpoint.split(' ')[0]}.`);
    }, 800);
  }, [showToast]);

  const handleCloseModals = useCallback(() => {
    setIsPaletteOpen(false);
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

  const openTool = useCallback((tool: ToolId) => {
    if (tool === 'radar') {
      setSelectedRadarBreachId(undefined);
      setIsRadarOpen(true);
    } else if (tool === 'report') setIsAirlockOpen(true);
    else if (tool === 'conduct') setIsCodeOfConductOpen(true);
    else if (tool === 'handbook') {
      setSelectedHandbookVectorId(undefined);
      setHandbookMode(undefined);
      setIsHandbookOpen(true);
    } else if (tool === 'exam') setIsMasterQuizOpen(true);
    else setIsAiSandboxOpen(true);
  }, []);

  const toggleEnhanced = useCallback(() => {
    toggleVengeanceMode();
    showToast(isVengeanceMode ? 'Enhanced protection is off.' : 'Enhanced protection is on.');
  }, [toggleVengeanceMode, isVengeanceMode, showToast]);

  const openHandbookSection = useCallback((sectionId: string) => {
    setSelectedHandbookVectorId(sectionId);
    setHandbookMode('interactive');
    setIsHandbookOpen(true);
  }, []);

  const toggleThemeNow = useCallback(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'), [setTheme, resolvedTheme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(open => !open);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
        if (e.key === 'Escape') {
          target.blur();
          handleCloseModals();
        }
        return;
      }
      if (e.key === 'Escape') {
        handleCloseModals();
        return;
      }
      // Ignore single-key shortcuts while any modal dialog is open.
      if (document.querySelector('[aria-modal="true"]')) return;

      const key = e.key.toLowerCase();
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (TABS.some(tab => tab.key === key)) {
        setCurrentTab(TABS.find(tab => tab.key === key)!.id);
      } else if (key === 'v') toggleEnhanced();
      else if (key === 'u') openTool('radar');
      else if (key === 'a') openTool('report');
      else if (key === 'm') {
        const soundOn = toggleSound();
        showToast(soundOn ? 'Sound effects are on.' : 'Sound effects are muted.');
      } else if (key === 'h') openTool('handbook');
      else if (key === 'o') openTool('conduct');
      else if (key === 's') openTool('sandbox');
      else if (key === 'q') openTool('exam');
      else if (key === 'r') handleInjectSimulatedBreach();
      else if (key === 'c') setIsCustomizerOpen(true);
      else if (key === 'd') toggleThemeNow();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseModals, handleInjectSimulatedBreach, toggleEnhanced, toggleSound, toggleThemeNow, openTool, showToast]);

  const handleUpdateWidgets = useCallback((updated: WidgetConfig[]) => {
    setWidgets(updated);
    try {
      localStorage.setItem('bm_widgets_cfg', JSON.stringify(updated));
    } catch {
      // storage unavailable: layout lasts for this session only
    }
  }, []);

  const handleResetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
    try {
      localStorage.removeItem('bm_widgets_cfg');
    } catch {
      // ignore
    }
    showToast('Restored the default layout.');
  }, [showToast]);

  const shownWidgets = useMemo(
    () => widgets.filter(widget => widget.visible && (currentTab === 'overview' || widget.category === currentTab)),
    [widgets, currentTab],
  );

  const renderWidgetContent = (id: string): React.ReactNode => {
    switch (id) {
      case 'handbook-radar':
        return (
          <RadarWidget
            onOpenFullRadar={() => {
              setSelectedRadarBreachId(undefined);
              setIsRadarOpen(true);
            }}
            onOpenHandbook={vectorId => {
              if (vectorId) setSelectedHandbookVectorId(vectorId);
              setIsHandbookOpen(true);
            }}
          />
        );
      case 'telemetry-velocity':
        return <ThreatSpeedWidget onInjectSimulatedBreach={handleInjectSimulatedBreach} />;
      case 'telemetry-feed':
        return <ThreatFeedWidget onInspectBreach={e => setActiveBreachDetail(e)} />;
      case 'security-handbook':
        return (
          <HandbookWidget
            onOpenFullHandbook={() => setIsHandbookOpen(true)}
            onOpenCodeOfConduct={() => setIsCodeOfConductOpen(true)}
            userRole={session.role}
            onTrackOnRadar={vectorId => {
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

  const commands = useMemo<PaletteCommand[]>(() => {
    const icon = 'h-4 w-4';
    const nav: PaletteCommand[] = TABS.map(tab => ({
      id: `nav-${tab.id}`,
      group: 'Go to',
      label: tab.label,
      hint: TAB_COPY[tab.id].description,
      shortcut: tab.key,
      icon: tab.icon,
      run: () => setCurrentTab(tab.id),
    }));
    const tools: PaletteCommand[] = [
      { id: 'tool-handbook', group: 'Open', label: 'Security handbook', hint: 'IT security policy v7.0', shortcut: 'H', icon: <BookOpen className={icon} />, run: () => openTool('handbook') },
      { id: 'tool-exam', group: 'Open', label: 'Certification exam', hint: 'Policy and conduct questions', shortcut: 'Q', icon: <Award className={icon} />, run: () => openTool('exam') },
      { id: 'tool-conduct', group: 'Open', label: 'Code of conduct', hint: 'Seven pillars and scenarios', shortcut: 'O', icon: <Scale className={icon} />, run: () => openTool('conduct') },
      { id: 'tool-radar', group: 'Open', label: 'Threat radar', hint: 'Sample breach vectors', shortcut: 'U', icon: <Radio className={icon} />, run: () => openTool('radar') },
      { id: 'tool-sandbox', group: 'Open', label: 'Threat sandbox', hint: 'Test an action for risk', shortcut: 'S', icon: <Sparkles className={icon} />, run: () => openTool('sandbox') },
      { id: 'tool-report', group: 'Open', label: 'Private report', hint: 'Check a possible mistake, no blame', shortcut: 'A', icon: <LifeBuoy className={icon} />, run: () => openTool('report') },
    ];
    const sections: PaletteCommand[] = HANDBOOK_VECTORS.map(vector => ({
      id: `section-${vector.id}`,
      group: 'Policy sections',
      label: `Section ${vector.sectionNumber}: ${vector.title}`,
      hint: vector.category,
      keywords: `policy handbook ${vector.category}`,
      icon: <BookOpen className={icon} />,
      run: () => {
        setSelectedHandbookVectorId(vector.id);
        setHandbookMode('interactive');
        setIsHandbookOpen(true);
      },
    }));
    const actions: PaletteCommand[] = [
      { id: 'act-assistant', group: 'Actions', label: 'Ask the Policy Copilot', hint: 'Questions answered from the policy text, with sources', keywords: 'chat rag question help', icon: <MessageSquare className={icon} />, run: () => setCurrentTab('copilot') },
      { id: 'act-support', group: 'Actions', label: 'Ask the Security Team', hint: 'For questions the handbook does not cover', keywords: 'support escalate ticket help human agent', icon: <Headset className={icon} />, run: () => setCurrentTab('support') },
      { id: 'act-flashcards', group: 'Actions', label: 'Practice speed drills', hint: 'Flashcards for key policy rules', keywords: 'flashcards cards memory', icon: <Award className={icon} />, run: () => { setHandbookMode('Flashcards'); setIsHandbookOpen(true); } },
      { id: 'act-simulate', group: 'Actions', label: 'Run a threat simulation', shortcut: 'R', icon: <Play className={icon} />, run: handleInjectSimulatedBreach },
      { id: 'act-enhanced', group: 'Actions', label: isVengeanceMode ? 'Turn off enhanced protection' : 'Turn on enhanced protection', shortcut: 'V', icon: <Flame className={icon} />, run: toggleEnhanced },
      { id: 'act-customize', group: 'Actions', label: 'Customize layout', hint: 'Show, hide and reorder widgets', shortcut: 'C', icon: <SlidersHorizontal className={icon} />, run: () => setIsCustomizerOpen(true) },
      { id: 'act-theme', group: 'Actions', label: resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', shortcut: 'D', icon: <Moon className={icon} />, run: toggleThemeNow },
      { id: 'act-sound', group: 'Actions', label: soundEnabled ? 'Mute sound effects' : 'Turn on sound effects', shortcut: 'M', icon: <Volume2 className={icon} />, run: () => showToast(toggleSound() ? 'Sound effects are on.' : 'Sound effects are muted.') },
      { id: 'act-keys', group: 'Actions', label: 'Keyboard shortcuts', shortcut: '?', icon: <Keyboard className={icon} />, run: () => setIsShortcutsOpen(true) },
      { id: 'act-analytics', group: 'Actions', label: 'View analytics', icon: <BarChart2 className={icon} />, run: () => setCurrentTab('analytics') },
      { id: 'act-signout', group: 'Actions', label: 'Sign out', icon: <LogOut className={icon} />, run: onLogout },
    ];
    return [...nav, ...tools, ...actions, ...sections];
  }, [openTool, handleInjectSimulatedBreach, toggleEnhanced, toggleThemeNow, toggleSound, soundEnabled, isVengeanceMode, resolvedTheme, onLogout, showToast]);

  const tabCopy = TAB_COPY[currentTab];
  const firstName = session.name.trim().split(/\s+/)[0] || 'there';

  return (
    <div className="relative flex min-h-screen flex-col text-fg">
      {scenery && resolvedTheme === 'light' && <SceneryBackground />}

      <AppHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onLogout={onLogout}
        operatorName={session.name}
        operatorRole={session.role}
        enhancedProtection={isVengeanceMode}
        supportBadge={supportBadge}
      />

      <main id="main-content" tabIndex={-1} className="relative z-10 mx-auto w-full max-w-[90rem] flex-1 space-y-8 px-3 pb-16 pt-6 sm:px-6">
        {currentTab === 'home' ? (
          <div className="bm-ds bm-glass inline-flex w-fit rounded-full px-3 py-1">
            <Breadcrumbs items={[{ label: 'BreachMirror' }]} />
          </div>
        ) : (
        <div className="bm-ds flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <Breadcrumbs items={[{ label: 'BreachMirror', onSelect: () => setCurrentTab('home') }, { label: tabCopy.title }]} />
            <h1 className="bm-h font-display text-3xl font-semibold tracking-tight text-fg sm:text-display">
              {currentTab === 'overview' ? `${greeting()}, ${firstName}` : tabCopy.title}
            </h1>
            <p className="bm-p max-w-2xl text-sm text-fg-3">
              {currentTab === 'overview' ? 'This is a training simulation. Nothing here monitors or protects real systems.' : tabCopy.description}
            </p>
          </div>
          {currentTab !== 'copilot' && currentTab !== 'support' && <div className="flex flex-wrap gap-2">
            <button type="button" className="bm-btn" onClick={() => setIsCustomizerOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Customize layout
            </button>
            <button type="button" className="bm-btn bm-btn-primary" onClick={handleInjectSimulatedBreach} disabled={isSimulating}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {isSimulating ? 'Simulating…' : 'Run simulation'}
            </button>
          </div>}
        </div>
        )}

        {currentTab === 'home' && <HomePage name={session.name} posture={posture} journey={journey} onNavigate={setCurrentTab} />}

        {currentTab === 'overview' && (
          <>
            <PostureCard
              posture={posture}
              defcon={defconLevel}
              onDefconChange={setDefconLevel}
              enhancedProtection={isVengeanceMode}
              onToggleEnhanced={toggleEnhanced}
              safeguards={countermeasuresCount}
            />
            <JourneyCard journey={journey} onContinue={openTool} />
            <ToolGrid onOpen={openTool} />
          </>
        )}

        {currentTab === 'copilot' && (
          <Suspense fallback={<div className="bm-skeleton h-96" role="status" aria-label="Loading the copilot" />}>
            <CopilotWorkspace onOpenSection={openHandbookSection} onOpenTicket={openTicket} />
          </Suspense>
        )}

        {currentTab === 'support' && (
          <Suspense fallback={<div className="bm-skeleton h-96" role="status" aria-label="Loading Security Support" />}>
            <SupportCenter
              isSecurityAgent={Boolean(session.isSecurityAgent)}
              securityAgentId={session.securityAgentId}
              initialTicketId={supportTicketId}
              onOpenSection={openHandbookSection}
              onActivity={refreshSupport}
            />
          </Suspense>
        )}

        {currentTab !== 'home' && currentTab !== 'copilot' && currentTab !== 'support' && (
        <section aria-labelledby="widgets-title" className="space-y-4">
          <div className="bm-ds flex items-baseline justify-between gap-3">
            <h2 id="widgets-title" className="bm-h font-display text-lg font-semibold text-fg">
              {currentTab === 'overview' ? 'Live training widgets' : 'Widgets'}
            </h2>
            <p className="text-xs text-fg-3">{shownWidgets.length} shown · drag the handle to reorder</p>
          </div>
          <WidgetGrid widgets={widgets} shown={shownWidgets} renderContent={renderWidgetContent} onChange={handleUpdateWidgets} onReset={handleResetWidgets} />
        </section>
        )}
      </main>

      <footer className="bm-ds bm-glass relative z-10 border-t border-line !shadow-none">
        <div className="mx-auto flex max-w-[90rem] flex-col items-start justify-between gap-2 px-3 py-4 text-xs text-fg-3 sm:flex-row sm:items-center sm:px-6">
          <p className="bm-p">Training simulation · XYZ Information Services Corp · Ethics hotline (800) 555-0199</p>
          <p className="bm-p">
            <kbd className="bm-kbd">Ctrl K</kbd> command palette · <kbd className="bm-kbd">?</kbd> shortcuts
          </p>
        </div>
      </footer>

      {toastMessage && (
        <div role="status" aria-live="polite" className="bm-ds bm-pop bm-glass-strong fixed bottom-6 left-1/2 z-[90] w-[min(28rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-lg px-4 py-3 text-sm text-fg">
          {toastMessage}
        </div>
      )}

      <CommandPalette open={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} commands={commands} />

      {/* Dialogs */}
      <WidgetCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        widgets={widgets}
        onUpdateWidgets={updated => {
          handleUpdateWidgets(updated);
          showToast('Layout updated.');
        }}
        onResetDefaults={handleResetWidgets}
      />

      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

      <BreachDetailModal
        event={activeBreachDetail}
        onClose={() => setActiveBreachDetail(null)}
        onAcknowledge={async (id) => {
          const saved = await acknowledgeBreachApi(id, 'RESOLVE');
          showToast(saved ? `Incident #${id} acknowledged and recorded.` : `Could not record incident #${id}. Check your session and try again.`);
        }}
      />

      <OnDemand when={isAiSandboxOpen}>
        <ThreatSandboxModal
          isOpen={isAiSandboxOpen}
          onClose={() => setIsAiSandboxOpen(false)}
          userRole={session.role}
        />
      </OnDemand>

      <OnDemand when={isHandbookOpen}>
        <SecurityHandbookModal
          isOpen={isHandbookOpen}
          onClose={() => setIsHandbookOpen(false)}
          userRole={session.role}
          userName={session.name}
          initialVectorId={selectedHandbookVectorId}
          initialViewMode={handbookMode}
          onTrackOnRadar={(vectorId) => {
            setSelectedRadarBreachId(vectorId);
            setIsHandbookOpen(false);
            setIsRadarOpen(true);
          }}
          onOpenCodeOfConduct={() => setIsCodeOfConductOpen(true)}
          onOpenMasterQuiz={() => setIsMasterQuizOpen(true)}
        />
      </OnDemand>

      <OnDemand when={isCodeOfConductOpen}>
        <ConductModal
          isOpen={isCodeOfConductOpen}
          onClose={() => setIsCodeOfConductOpen(false)}
          userName={session.name}
          userRole={session.role}
          onOpenMasterQuiz={() => setIsMasterQuizOpen(true)}
        />
      </OnDemand>

      <OnDemand when={isMasterQuizOpen}>
        <CertificationQuizModal
          isOpen={isMasterQuizOpen}
          onClose={() => setIsMasterQuizOpen(false)}
          userName={session.name}
          userRole={session.role}
        />
      </OnDemand>

      <OnDemand when={isRadarOpen}>
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
      </OnDemand>

      <OnDemand when={isAirlockOpen}>
        <ConfessionAirlockModal
          isOpen={isAirlockOpen}
          onClose={() => setIsAirlockOpen(false)}
          userName={session.name}
        />
      </OnDemand>
    </div>
  );
}

/** Mounts lazy-loaded children the first time `when` is true, then keeps them mounted. */
function OnDemand({ when, children }: { when: boolean; children: React.ReactNode }) {
  const [seen, setSeen] = useState(when);
  useEffect(() => { if (when) setSeen(true); }, [when]);
  return seen || when ? <Suspense fallback={null}>{children}</Suspense> : null;
}

export default function App() {
  const [session, setSession] = useState<UserSession>({ isLoggedIn: false, name: '', role: 'Incident Commander', avatarSeed: 'operative-1' });
  const [sessionMessage, setSessionMessage] = useState<string>('');

  const handleLogin = (user: { id: string; name: string; email: string; role: AuthRole; isSecurityAgent?: boolean; securityAgentId?: string }) => {
    const newSession: UserSession = {
      isLoggedIn: true,
      name: user.name,
      role: user.role,
      avatarSeed: user.id,
      loginTime: new Date().toLocaleTimeString(),
      isSecurityAgent: Boolean(user.isSecurityAgent),
      securityAgentId: user.securityAgentId,
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
        <AmbientBackground />
        <CursorFx />
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
