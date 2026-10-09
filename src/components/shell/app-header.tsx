import React from 'react';
import { Activity, BarChart2, BookOpen, Headset, Home, MessagesSquare, Search, ShieldAlert, Zap } from 'lucide-react';
import { BrandMark } from './brand-mark';
import { UserMenu } from './user-menu';

export type TabId = 'home' | 'copilot' | 'overview' | 'telemetry' | 'playbook' | 'analytics' | 'simulator' | 'support';

/** `inNav: false` tabs are reached from their own header button, the palette and their shortcut. */
export const TABS: Array<{ id: TabId; label: string; key: string; icon: React.ReactNode; inNav?: boolean }> = [
  { id: 'home', label: 'Home', key: '0', icon: <Home className="h-4 w-4" aria-hidden="true" /> },
  { id: 'copilot', label: 'Copilot', key: '6', icon: <MessagesSquare className="h-4 w-4" aria-hidden="true" /> },
  { id: 'overview', label: 'Dashboard', key: '1', icon: <Activity className="h-4 w-4" aria-hidden="true" /> },
  { id: 'telemetry', label: 'Threat activity', key: '2', icon: <ShieldAlert className="h-4 w-4" aria-hidden="true" /> },
  { id: 'playbook', label: 'Security guide', key: '3', icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
  { id: 'analytics', label: 'Analytics', key: '4', icon: <BarChart2 className="h-4 w-4" aria-hidden="true" /> },
  { id: 'simulator', label: 'Practice', key: '5', icon: <Zap className="h-4 w-4" aria-hidden="true" /> },
  { id: 'support', label: 'Security Support', key: '7', icon: <Headset className="h-4 w-4" aria-hidden="true" />, inNav: false },
];

const NAV_TABS = TABS.filter(tab => tab.inNav !== false);

interface AppHeaderProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenPalette: () => void;
  onOpenShortcuts: () => void;
  onOpenCustomizer: () => void;
  onLogout: () => void;
  operatorName: string;
  operatorRole: string;
  enhancedProtection: boolean;
  /** Unread Security Team replies (plus, for agents, tickets needing attention). */
  supportBadge?: number;
}

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenPalette,
  onOpenShortcuts,
  onOpenCustomizer,
  onLogout,
  operatorName,
  operatorRole,
  enhancedProtection,
  supportBadge = 0,
}) => (
  <header
    className="bm-ds bm-glass-strong sticky top-0 z-40 !rounded-none border-x-0 border-t-0"
    style={enhancedProtection ? { boxShadow: 'inset 0 3px 0 var(--bm-crit)' } : undefined}
  >
    <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-3 sm:px-6">
      <button type="button" onClick={() => onSelectTab('home')} className="rounded-md" aria-label="BreachMirror AI, go to home">
        <BrandMark size={28} />
      </button>

      <nav aria-label="Primary" className="ml-3 hidden items-center gap-0.5 xl:flex">
        {NAV_TABS.map(tab => {
          const active = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm font-medium ${
                active ? 'bg-accent-soft text-accent-text' : 'text-fg-2 hover:bg-sunken hover:text-fg'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {enhancedProtection && (
          <span className="bm-chip bm-sev bm-sev-crit hidden md:inline-flex">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Enhanced protection on
          </span>
        )}
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden min-h-10 w-56 items-center gap-2 rounded-md border border-line-strong bg-surface-2 px-3 text-sm text-fg-3 hover:bg-sunken md:flex xl:w-auto 2xl:w-64"
          aria-label="Open command palette"
          aria-keyshortcuts="Control+K Meta+K"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left xl:hidden 2xl:inline">Search or jump to…</span>
          <kbd className="bm-kbd">{isMac ? '⌘' : 'Ctrl'} K</kbd>
        </button>
        <button type="button" onClick={onOpenPalette} className="bm-btn bm-btn-icon md:hidden" aria-label="Open command palette">
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('support')}
          aria-current={currentTab === 'support' ? 'page' : undefined}
          aria-keyshortcuts="7"
          aria-label={supportBadge > 0 ? `Security Support, ${supportBadge} update${supportBadge === 1 ? '' : 's'}` : 'Security Support'}
          title="Security Support"
          className={`bm-btn bm-btn-icon relative ${currentTab === 'support' ? '!bg-accent-soft !text-accent-text' : ''}`}
        >
          <Headset className="h-4 w-4" aria-hidden="true" />
          {supportBadge > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 font-mono text-[0.65rem] font-semibold leading-none text-accent-fg ring-2 ring-[var(--bm-bg)]" aria-hidden="true">
              {supportBadge > 9 ? '9+' : supportBadge}
            </span>
          )}
        </button>
        <UserMenu name={operatorName} role={operatorRole} onOpenShortcuts={onOpenShortcuts} onOpenCustomizer={onOpenCustomizer} onLogout={onLogout} />
      </div>
    </div>

    <nav aria-label="Primary" className="border-t border-line xl:hidden">
      <div className="bm-scroll-fade flex gap-1 overflow-x-auto px-3 py-1.5 sm:px-6">
        {NAV_TABS.map(tab => {
          const active = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium ${
                active ? 'bg-accent-soft text-accent-text' : 'text-fg-2 hover:bg-sunken'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  </header>
);
