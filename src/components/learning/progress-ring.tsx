import React from 'react';

interface ProgressRingProps {
  /** 0-100 */
  value: number;
  size?: number;
  stroke?: number;
  label: string;
  /** Text in the middle; defaults to the percentage. */
  children?: React.ReactNode;
  tone?: 'accent' | 'safe';
}

/** Circular progress with progressbar semantics. Static (no animation) by design. */
export const ProgressRing: React.FC<ProgressRingProps> = ({ value, size = 88, stroke = 8, label, children, tone = 'accent' }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bm-sunken)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone === 'safe' ? 'var(--bm-safe)' : 'var(--bm-accent)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * circumference} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center font-display font-semibold tabular-nums text-fg">{children ?? `${clamped}%`}</span>
    </div>
  );
};
