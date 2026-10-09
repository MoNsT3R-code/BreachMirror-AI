import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemeMode, useTheme } from '../../context/theme-context';

const OPTIONS: Array<{ value: ThemeMode; label: string; icon: React.ReactNode }> = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" aria-hidden="true" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" aria-hidden="true" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" aria-hidden="true" /> },
];

/** Segmented control for theme preference (radio group semantics). */
export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className={`bm-ds inline-flex rounded-md border border-line-strong bg-sunken p-0.5 ${className}`}>
      {OPTIONS.map(option => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            onClick={() => setTheme(option.value)}
            className={`inline-flex min-h-8 items-center gap-1.5 rounded px-2.5 text-xs font-semibold ${active ? 'bg-surface text-fg shadow-card' : 'text-fg-3 hover:text-fg'}`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
