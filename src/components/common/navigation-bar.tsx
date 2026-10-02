import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BookOpen, 
  BarChart2, 
  Zap, 
  Sliders, 
  HelpCircle, 
  Sparkles,
  LogOut,
  UserCheck,
  Flame,
  Radio,
  LifeBuoy,
  Volume2,
  VolumeX,
  Scale
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { DocumentSearchButton } from './document-search-button';
import { BrandLogo } from './brand-logo';
import { useAlerts, DefconLevel } from '../../context/alert-context';

interface NavigationBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCustomizer: () => void;
  onOpenShortcuts: () => void;
  onInjectBreach: () => void;
  onOpenAiSandbox?: () => void;
  onOpenHandbook?: () => void;
  onOpenCodeOfConduct?: () => void;
  onOpenRadar?: () => void;
  onOpenAirlock?: () => void;
  operatorName?: string;
  operatorRole?: string;
  onLogout?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCustomizer,
  onOpenShortcuts,
  onInjectBreach,
  onOpenAiSandbox,
  onOpenHandbook,
  onOpenCodeOfConduct,
  onOpenRadar,
  onOpenAirlock,
  operatorName = 'Officer',
  operatorRole = 'Incident Commander',
  onLogout,
}) => {
  const { 
    isVengeanceMode, 
    toggleVengeanceMode, 
    defconLevel, 
    setDefconLevel, 
    soundEnabled, 
    toggleSound,
    countermeasuresCount
  } = useAlerts();

  const navItems = [
    { id: 'overview', label: 'Dashboard', key: '1', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'telemetry', label: 'Threat Activity', key: '2', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'playbook', label: 'Security Guide', key: '3', icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'analytics', label: 'Analytics', key: '4', icon: <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'simulator', label: 'Practice Scenarios', key: '5', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  const handleCycleDefcon = () => {
    const nextDefcon: DefconLevel = defconLevel === 1 ? 5 : ((defconLevel - 1) as DefconLevel);
    setDefconLevel(nextDefcon);
  };

  const displayName = operatorName.trim() || 'Officer';


  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6 w-full max-w-7xl mx-auto">
      <nav 
        role="navigation" 
        aria-label="Main Navigation"
        className="vengeance-glass w-full min-w-0 rounded-2xl px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 transition-all border border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Brand & Logo */}
        <BrandLogo
          size="sm"
          withText={true}
          showVersion={true}
          subtitle="Supportive security practice"
          onClick={() => onSelectTab('overview')}
        />

        {/* Navigation Tabs */}
          <div className="hidden 2xl:flex items-center gap-1 bg-slate-950/60 border border-white/10 rounded-xl p-1 shrink-0 order-3 basis-full 2xl:order-none 2xl:basis-auto justify-center">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">{item.label}</span>
                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {item.key}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Docs Button */}
        <div className="hidden 2xl:flex items-center shrink-0">
          <DocumentSearchButton
            onClick={() => onSelectTab('playbook')} 
            placeholder="Search guidance..." 
          />
        </div>

        {/* User Profile, Theme Toggle & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 basis-full 2xl:basis-auto max-w-full overflow-x-auto no-scrollbar ml-auto justify-end">
          {/* DEFCON Level Trigger Badge */}
          <button
            onClick={handleCycleDefcon}
            title={`Current alert level: ${defconLevel} (Click to change level)`}
            className={`h-8 px-2 sm:px-2.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
              defconLevel === 1
                ? 'bg-rose-600/30 text-rose-300 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                : defconLevel === 2
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : defconLevel === 3
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : defconLevel === 4
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${defconLevel === 1 ? 'bg-rose-400 animate-ping' : 'bg-current'}`} />
            <span>Alert level {defconLevel}</span>
          </button>

          {/* Vengeance mode button */}
          <button
            onClick={toggleVengeanceMode}
            title={isVengeanceMode ? 'Enhanced protection is on. Click to turn it off' : 'Turn on enhanced protection (Hotkey: V)'}
            className={`h-8 px-2.5 rounded-xl font-display text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              isVengeanceMode
                ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-rose-600 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] border border-rose-400/80 animate-pulse'
                : 'bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-cyan-500/15 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/60'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isVengeanceMode ? 'text-amber-300 animate-bounce' : 'text-rose-400'}`} />
            <span className="hidden sm:inline">Enhanced protection</span>
            {isVengeanceMode && (
              <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-amber-300">
                {countermeasuresCount}
              </span>
            )}
          </button>

          {/* Tactical Holographic Radar Quick Button */}
          {onOpenRadar && (
            <button
              onClick={onOpenRadar}
              title="Open the security radar (Hotkey: U)"
              className="h-8 w-8 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          {/* Zero-Blame Confession Airlock Button */}
          {onOpenAirlock && (
            <button
              onClick={onOpenAirlock}
              title="Open the private reporting tool (Hotkey: A)"
              className="h-8 w-8 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:text-emerald-100 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}

          {/* Code of Conduct Shortcut (Large+ screens) */}
          {onOpenCodeOfConduct && (
            <button
              onClick={onOpenCodeOfConduct}
              title="Open Stewart Code of Business Conduct (Hotkey: C)"
              className="hidden 2xl:flex h-8 px-2 sm:px-2.5 rounded-xl bg-[#9B2743]/20 hover:bg-[#9B2743]/30 border border-[#9B2743]/50 text-rose-200 hover:text-white items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(155,39,67,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[11px] font-bold font-display uppercase tracking-wider">Code of Conduct</span>
            </button>
          )}

          {/* Handbook Shortcut (Extra Large screens) */}
          {onOpenHandbook && (
            <button
              onClick={onOpenHandbook}
              title="Open the security handbook (Hotkey: H)"
              className="hidden 2xl:flex h-8 w-8 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 hover:text-sky-100 items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(14,165,233,0.2)] hover:scale-105 active:scale-95 shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            </button>
          )}

          {/* AI Threat Sandbox Shortcut */}
          {onOpenAiSandbox && (
            <button
              onClick={onOpenAiSandbox}
              title="Open the AI practice tool (Hotkey: S)"
              className="hidden 2xl:flex h-8 w-8 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 hover:text-purple-100 items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.25)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </button>
          )}

          {/* Vertical Divider */}
          <div className="h-5 w-[1px] bg-white/10 mx-0.5 hidden sm:block shrink-0" />

          {/* Cyber Audio SFX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects (Hotkey: M)' : 'Turn on sound effects (Hotkey: M)'}
            className="h-8 w-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Theme switcher */}
          <div className="flex items-center justify-center shrink-0 px-0.5" title="Change theme">
            <ThemeToggle size={5.5} />
          </div>

          {/* Customize Widgets Button */}
          <button
            onClick={onOpenCustomizer}
            title="Customize dashboard cards (Hotkey: C)"
            aria-label="Customize and rearrange dashboard widget cards"
            className="hidden sm:flex h-8 w-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Keyboard Shortcuts Helper */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (Hotkey: ?)"
            aria-label="View keyboard shortcuts cheat sheet"
            className="hidden sm:flex h-8 w-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Active Operator Profile Badge & Always-Visible Tactile Logout */}
          <div 
            title={`Active Officer: ${displayName} (${operatorRole})`}
            className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 border border-white/15 dark:border-white/15 border-slate-300 hover:border-cyan-500/40 transition-all shrink-0 ml-1 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-[11px] shadow-sm shrink-0">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left leading-none max-w-[100px]">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {displayName}
              </span>
              <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 truncate">
                {operatorRole.split(' ')[0]}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out / Switch Officer"
                aria-label="Logout or switch officer"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navigation tab strip */}
      <div className="2xl:hidden mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1.5 vengeance-glass rounded-xl border border-white/10">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex items-center gap-1.5 transition-all font-semibold ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
