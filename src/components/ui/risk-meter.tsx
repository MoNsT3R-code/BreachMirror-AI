import React from 'react';

function band(score: number): { color: string; label: string } {
  if (score >= 80) return { color: 'var(--bm-crit)', label: 'Critical' };
  if (score >= 60) return { color: 'var(--bm-high)', label: 'High' };
  if (score >= 40) return { color: 'var(--bm-med)', label: 'Elevated' };
  return { color: 'var(--bm-low)', label: 'Low' };
}

/** Horizontal 0-100 risk meter with a numeric label (never colour alone). */
export const RiskMeter: React.FC<{ score: number; label?: string }> = ({ score, label = 'Risk score' }) => {
  const meta = band(score);
  return (
    <div className="bm-ds">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-fg-2">{label}</span>
        <span className="font-mono text-fg-3">
          <span className="text-sm font-semibold text-fg">{score}</span> / 100 · {meta.label}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-sunken"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} out of 100, ${meta.label}`}
      >
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: meta.color }} />
      </div>
    </div>
  );
};
