import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  /** Optional decorative sky backdrop (light theme only). Off by default. */
  scenery: boolean;
  setScenery: (enabled: boolean) => void;
  /** Pointer-reactive effects (cursor ring, light and glass highlights). */
  effects: boolean;
  setEffects: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'breachmirror_theme_preference';
const SCENERY_STORAGE_KEY = 'breachmirror_scenery';
const EFFECTS_STORAGE_KEY = 'breachmirror_fx';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && ['dark', 'light', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [scenery, setSceneryState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SCENERY_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [effects, setEffectsState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(EFFECTS_STORAGE_KEY) !== 'off';
    } catch {
      return true;
    }
  });

  const setEffects = (enabled: boolean) => {
    setEffectsState(enabled);
    try {
      localStorage.setItem(EFFECTS_STORAGE_KEY, enabled ? 'on' : 'off');
    } catch {
      // storage unavailable: keep the in-memory value only
    }
  };

  const setScenery = (enabled: boolean) => {
    setSceneryState(enabled);
    try {
      localStorage.setItem(SCENERY_STORAGE_KEY, String(enabled));
    } catch {
      // storage unavailable: keep the in-memory value only
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const computeResolvedTheme = (): 'dark' | 'light' => {
      if (theme === 'system') {
        return mediaQuery.matches ? 'dark' : 'light';
      }
      return theme;
    };

    const updateDOM = () => {
      const active = computeResolvedTheme();
      setResolvedTheme(active);

      if (active === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    updateDOM();

    const listener = () => {
      if (theme === 'system') {
        updateDOM();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, scenery, setScenery, effects, setEffects }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
