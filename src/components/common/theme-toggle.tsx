import React from 'react';
import { useTheme } from '../../context/theme-context';

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 6.5,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  // Responsive font-size for .switch (scales the em-based width & height cleanly)
  const fontSizePx = Math.max(10, Math.round(size * 1.9));

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      title={`Theme: ${resolvedTheme.toUpperCase()} (Click Moon / Sun switch to toggle)`}
    >
      <label
        className="switch"
        style={{ '--switch-font-size': `${fontSizePx}px` } as React.CSSProperties}
      >
        <input
          type="checkbox"
          checked={isLight}
          onChange={toggleTheme}
          aria-label="Toggle dark/light theme"
        />
        <span className="slider" />
      </label>
    </div>
  );
};
