import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundManager } from '../services/sound-effects';

export type DefconLevel = 1 | 2 | 3 | 4 | 5;

interface AlertContextType {
  isVengeanceMode: boolean;
  defconLevel: DefconLevel;
  soundEnabled: boolean;
  scanlines: boolean;
  countermeasuresCount: number;
  toggleVengeanceMode: () => void;
  setDefconLevel: (level: DefconLevel) => void;
  toggleSound: () => boolean;
  toggleScanlines: () => void;
  deployCountermeasure: (threatTitle?: string) => void;
  playThreatAlarm: (severity?: 'CRITICAL' | 'HIGH' | 'ELEVATED', options?: { voiceAlert?: boolean; threatName?: string }) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVengeanceMode, setIsVengeanceMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breachmirror_vengeance_mode');
      return saved === 'true';
    }
    return false;
  });

  const [defconLevel, setDefconLevelState] = useState<DefconLevel>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breachmirror_defcon');
      if (saved && ['1', '2', '3', '4', '5'].includes(saved)) {
        return Number(saved) as DefconLevel;
      }
    }
    return 3;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return soundManager.isEnabled();
  });

  const [scanlines, setScanlines] = useState<boolean>(false);

  const [countermeasuresCount, setCountermeasuresCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breachmirror_countermeasures_count');
      return saved ? parseInt(saved, 10) : 14;
    }
    return 14;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isVengeanceMode) {
      root.classList.add('vengeance-active');
    } else {
      root.classList.remove('vengeance-active');
    }
    localStorage.setItem('breachmirror_vengeance_mode', String(isVengeanceMode));
  }, [isVengeanceMode]);

  const toggleVengeanceMode = () => {
    setIsVengeanceMode(prev => {
      const next = !prev;
      if (next) {
        soundManager.playDefconAlert(1);
        setDefconLevelState(1);
      } else {
        soundManager.playSuccess();
        setDefconLevelState(3);
      }
      return next;
    });
  };

  const setDefconLevel = (level: DefconLevel) => {
    setDefconLevelState(level);
    localStorage.setItem('breachmirror_defcon', String(level));
    soundManager.playDefconAlert(level);
    if (level === 1) {
      setIsVengeanceMode(true);
    }
  };

  const toggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
    return next;
  };

  const toggleScanlines = () => {
    setScanlines(prev => !prev);
    soundManager.playBlip(600);
  };

  const deployCountermeasure = (_threatTitle?: string) => {
    soundManager.playCountermeasure();
    setCountermeasuresCount(prev => {
      const updated = prev + 1;
      localStorage.setItem('breachmirror_countermeasures_count', String(updated));
      return updated;
    });
  };

  const playThreatAlarm = (
    severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' = 'CRITICAL',
    options?: { voiceAlert?: boolean; threatName?: string }
  ) => {
    soundManager.playThreatAlarm(severity, options);
  };

  return (
    <AlertContext.Provider
      value={{
        isVengeanceMode,
        defconLevel,
        soundEnabled,
        scanlines,
        countermeasuresCount,
        toggleVengeanceMode,
        setDefconLevel,
        toggleSound,
        toggleScanlines,
        deployCountermeasure,
        playThreatAlarm,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = (): AlertContextType => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return ctx;
};
