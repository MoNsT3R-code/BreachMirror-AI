import React from 'react';

interface StewartLogoProps {
  className?: string;
  variant?: 'full' | 'mark';
  height?: number | string;
  theme?: 'dark' | 'light' | 'auto';
}

/**
 * Stewart Information Services Corporation Official Vector Logo
 * Exact geometric reproduction of the brand mark:
 * - 3 angled burgundy stripes (#9B2743)
 * - Charcoal/black architectural rooftop gable (#1E2229)
 * - Lowercase geometric wordmark "stewart" with trademark symbol
 */
export const StewartLogo: React.FC<StewartLogoProps> = ({
  className = '',
  variant = 'full',
  height = 32,
  theme = 'auto',
}) => {
  // If variant is 'mark', render only the iconic 3-striped roofline mark
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 98 62"
        height={height}
        className={`inline-block shrink-0 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Stewart Logo Mark"
      >
        <g transform="translate(-4, -8)">
          {/* Stripe 1 (Left - Burgundy) */}
          <polygon
            points="12,68 25,68 44,18 31,18"
            fill="#9B2743"
          />

          {/* Stripe 2 (Middle - Burgundy) */}
          <polygon
            points="31,68 44,68 63,18 50,18"
            fill="#9B2743"
          />

          {/* Stripe 3 (Right - Burgundy base) */}
          <polygon
            points="50,68 63,68 74,38 61,38"
            fill="#9B2743"
          />

          {/* Roof Peak / Gable (Black / Dark Slate Accent) */}
          <path
            d="M 64,18 L 84,18 L 98,42 L 86,42 L 77,27 L 70,27 L 61,48 L 56,48 Z"
            fill="#1E2229"
          />
        </g>
      </svg>
    );
  }

  // Full Logo: Emblem + "stewart" wordmark + TM
  return (
    <svg
      viewBox="0 0 320 62"
      height={height}
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Stewart Information Services Corporation Logo"
    >
      {/* Stewart Emblem Mark */}
      <g transform="translate(-4, -8)">
        {/* Stripe 1 (Left - Burgundy) */}
        <polygon
          points="12,68 25,68 44,18 31,18"
          fill="#9B2743"
        />

        {/* Stripe 2 (Middle - Burgundy) */}
        <polygon
          points="31,68 44,68 63,18 50,18"
          fill="#9B2743"
        />

        {/* Stripe 3 (Right - Burgundy base) */}
        <polygon
          points="50,68 63,68 74,38 61,38"
          fill="#9B2743"
        />

        {/* Roof Peak / Gable (Dark Slate) */}
        <path
          d="M 64,18 L 84,18 L 98,42 L 86,42 L 77,27 L 70,27 L 61,48 L 56,48 Z"
          fill="#1E2229"
        />
      </g>

      {/* Wordmark: stewart */}
      <text
        x="108"
        y="49"
        className={
          theme === 'dark'
            ? 'fill-white'
            : theme === 'light'
            ? 'fill-[#1E2229]'
            : 'fill-slate-900 dark:fill-white'
        }
        style={{
          fontFamily:
            '-Apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 800,
          fontSize: '46px',
          letterSpacing: '-1.5px',
        }}
      >
        stewart
      </text>

      {/* Trademark symbol */}
      <text
        x="284"
        y="24"
        className={
          theme === 'dark'
            ? 'fill-slate-300'
            : theme === 'light'
            ? 'fill-slate-700'
            : 'fill-slate-600 dark:fill-slate-300'
        }
        style={{
          fontFamily:
            '-Apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '9px',
        }}
      >
        TM
      </text>
    </svg>
  );
};
