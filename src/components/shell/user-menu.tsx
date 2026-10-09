import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Keyboard, LogOut, SlidersHorizontal } from 'lucide-react';
import { useAlerts } from '../../context/alert-context';
import { useTheme } from '../../context/theme-context';
import { Switch } from '../ui/switch';
import { ThemeSwitcher } from '../ui/theme-switcher';

interface UserMenuProps {
  name: string;
  role: string;
  onOpenShortcuts: () => void;
  onOpenCustomizer: () => void;
  onLogout: () => void;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** Account and appearance popover (disclosure pattern, non-modal). */
export const UserMenu: React.FC<UserMenuProps> = ({ name, role, onOpenShortcuts, onOpenCustomizer, onLogout }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { soundEnabled, toggleSound } = useAlerts();
  const { scenery, setScenery, resolvedTheme, effects, setEffects } = useTheme();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div ref={rootRef} className="bm-ds relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(value => !value)}
        className="flex min-h-10 items-center gap-2 rounded-md border border-line-strong bg-surface py-1 pl-1 pr-2 hover:bg-surface-2"
      >
        <span className="grid h-8 w-8 place-items-center rounded bg-accent text-xs font-bold text-accent-fg" aria-hidden="true">{initials(name)}</span>
        <span className="hidden min-w-0 text-left leading-tight sm:block xl:hidden 2xl:block">
          <span className="block max-w-[9rem] truncate text-sm font-semibold text-fg">{name}</span>
          <span className="block max-w-[9rem] truncate text-xs text-fg-3">{role}</span>
        </span>
        <span className="sr-only sm:hidden xl:inline 2xl:hidden">{name}, account menu</span>
        <ChevronDown className={`h-4 w-4 text-fg-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Account and appearance"
          className="bm-pop bm-glass-strong absolute right-0 top-[calc(100%+8px)] z-50 w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-line  p-2 shadow-overlay"
        >
          <div className="border-b border-line px-3 pb-3 pt-2">
            <p className="text-sm font-semibold text-fg">{name}</p>
            <p className="text-xs text-fg-3">{role} · local training profile</p>
          </div>

          <div className="space-y-1 border-b border-line px-1 py-3">
            <p className="bm-eyebrow px-2 pb-1">Appearance</p>
            <div className="px-2"><ThemeSwitcher /></div>
            <Switch
              checked={scenery && resolvedTheme === 'light'}
              onChange={setScenery}
              label="Scenery backdrop"
              description={resolvedTheme === 'light' ? 'Decorative sky and hills' : 'Available in the light theme'}
            />
            <Switch checked={effects} onChange={setEffects} label="Cursor and glass effects" description="Cursor ring, light and glass highlights" />
            <Switch checked={soundEnabled} onChange={() => toggleSound()} label="Sound effects" description="Muted by default" />
          </div>

          <div className="pt-1">
            <button type="button" className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-fg hover:bg-sunken" onClick={() => choose(onOpenCustomizer)}>
              <SlidersHorizontal className="h-4 w-4 text-fg-3" aria-hidden="true" />
              Customize layout
            </button>
            <button type="button" className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-fg hover:bg-sunken" onClick={() => choose(onOpenShortcuts)}>
              <Keyboard className="h-4 w-4 text-fg-3" aria-hidden="true" />
              Keyboard shortcuts
              <kbd className="bm-kbd ml-auto">?</kbd>
            </button>
            <button type="button" className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-crit hover:bg-crit-soft" onClick={() => choose(onLogout)}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
