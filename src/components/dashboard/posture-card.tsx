import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus, ShieldAlert, ShieldCheck } from 'lucide-react';
import { DefconLevel } from '../../context/alert-context';
import { PostureBand, PostureSnapshot } from '../../hooks/use-posture';
import { Switch } from '../ui/switch';

interface PostureCardProps {
  posture: PostureSnapshot;
  defcon: DefconLevel;
  onDefconChange: (level: DefconLevel) => void;
  enhancedProtection: boolean;
  onToggleEnhanced: () => void;
  safeguards: number;
}

const BAND_CLASS: Record<PostureBand, string> = {
  strong: 'bm-sev-safe',
  steady: 'bm-sev-low',
  watch: 'bm-sev-med',
  'at-risk': 'bm-sev-crit',
};

const ALERT_LEVELS: Array<{ level: DefconLevel; label: string }> = [
  { level: 5, label: 'Normal' },
  { level: 4, label: 'Guarded' },
  { level: 3, label: 'Elevated' },
  { level: 2, label: 'High' },
  { level: 1, label: 'Critical' },
];

function pressureColor(pressure: number): string {
  if (pressure >= 75) return 'var(--bm-crit)';
  if (pressure >= 50) return 'var(--bm-high)';
  if (pressure >= 30) return 'var(--bm-med)';
  return 'var(--bm-low)';
}

/** Two mirrored half-rings: threat pressure on the left, your readiness on the right. */
const MirrorGauge: React.FC<{ score: number; pressure: number; readiness: number }> = ({ score, pressure, readiness }) => (
  <div
    className="relative mx-auto h-[220px] w-[220px] shrink-0"
    role="img"
    aria-label={`Security posture ${score} out of 100. Threat pressure ${pressure}. Your readiness ${readiness}.`}
  >
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeWidth="10">
        <path d="M100 178 A78 78 0 0 1 100 22" pathLength="100" stroke="var(--bm-sunken)" />
        <path d="M100 178 A78 78 0 0 0 100 22" pathLength="100" stroke="var(--bm-sunken)" />
        <path d="M100 178 A78 78 0 0 1 100 22" pathLength="100" stroke={pressureColor(pressure)} strokeDasharray={`${Math.max(pressure, 1)} 100`} />
        <path d="M100 178 A78 78 0 0 0 100 22" pathLength="100" stroke="var(--bm-accent)" strokeDasharray={`${Math.max(readiness, 1)} 100`} />
      </g>
      <path d="M100 8 V16 M100 184 V192" stroke="var(--bm-line-strong)" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="font-display text-[3.5rem] font-semibold leading-none tracking-tight text-fg tabular-nums">{score}</span>
      <span className="mt-1 text-xs font-medium text-fg-3">out of 100</span>
    </div>
  </div>
);

const Sparkline: React.FC<{ values: number[] }> = ({ values }) => {
  if (values.length < 2) return null;
  const points = values.slice(-14);
  const width = 96;
  const height = 28;
  const path = points
    .map((value, index) => `${index === 0 ? 'M' : 'L'}${((index / (points.length - 1)) * width).toFixed(1)} ${(height - (value / 100) * height).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0" role="img" aria-label={`Score history over the last ${points.length} days`}>
      <path d={path} fill="none" stroke="var(--bm-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PostureCard: React.FC<PostureCardProps> = ({ posture, defcon, onDefconChange, enhancedProtection, onToggleEnhanced, safeguards }) => {
  const { delta } = posture;
  const trend =
    delta === null ? (
      <span className="text-sm text-fg-3">Baseline recorded today</span>
    ) : delta === 0 ? (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-fg-2">
        <Minus className="h-4 w-4" aria-hidden="true" />
        No change since yesterday
      </span>
    ) : delta > 0 ? (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-safe">
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />+{delta} since yesterday
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-crit">
        <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
        {delta} since yesterday
      </span>
    );

  return (
    <section aria-labelledby="posture-title" className="bm-card bm-ds bm-rise grid gap-6 p-5 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,18rem)] lg:items-center">
      <MirrorGauge score={posture.score} pressure={posture.pressure} readiness={posture.readiness} />

      <div className="min-w-0 space-y-4">
        <div>
          <p className="bm-eyebrow">Security posture</p>
          <h2 id="posture-title" className="bm-h mt-1 flex flex-wrap items-center gap-2.5 font-display text-2xl font-semibold text-fg">
            {posture.bandLabel}
            <span className={`bm-chip bm-sev ${BAND_CLASS[posture.band]}`}>
              {posture.band === 'at-risk' ? <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> : <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
              {posture.score} / 100
            </span>
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {trend}
            <Sparkline values={posture.history} />
          </div>
        </div>

        <ul className="space-y-3" aria-label="What makes up your score">
          {posture.factors.map(factor => (
            <li key={factor.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-fg">{factor.label}</span>
                <span className="font-mono text-xs text-fg-3">{factor.detail}</span>
              </div>
              <div
                className="mt-1.5 h-2 overflow-hidden rounded-full bg-sunken"
                role="progressbar"
                aria-label={factor.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={factor.value}
              >
                <div className="h-full rounded-full bg-accent" style={{ width: `${factor.value}%` }} />
              </div>
            </li>
          ))}
        </ul>

        <details className="text-sm text-fg-3">
          <summary className="cursor-pointer font-medium text-accent-text">How this score is calculated</summary>
          <p className="bm-p mt-2 max-w-prose">
            Posture is 80% <strong className="text-fg-2">readiness</strong> (40% certification exam accuracy, 35% readiness audit, 25% signed pledges) plus 20% <strong className="text-fg-2">calm</strong>, the inverse of simulated threat pressure from the alert level and practice drills you run. The left ring is threat pressure ({posture.pressure}); the right ring is your readiness ({posture.readiness}). All values are training simulations stored in this browser.
          </p>
        </details>
      </div>

      <div className="min-w-0 space-y-4 lg:border-l lg:border-line lg:pl-6">
        <div>
          <p id="alert-level-label" className="bm-eyebrow">Alert level</p>
          <div role="radiogroup" aria-labelledby="alert-level-label" className="mt-2 grid grid-cols-5 gap-1 rounded-md border border-line-strong bg-sunken p-0.5">
            {ALERT_LEVELS.map(item => {
              const active = item.level === defcon;
              return (
                <button
                  key={item.level}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`Level ${item.level}, ${item.label}`}
                  onClick={() => onDefconChange(item.level)}
                  className={`min-h-9 rounded text-sm font-semibold tabular-nums ${active ? 'bg-surface text-fg shadow-card' : 'text-fg-3 hover:text-fg'}`}
                >
                  {item.level}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-fg-3">{ALERT_LEVELS.find(item => item.level === defcon)?.label}. Level 1 is most severe.</p>
        </div>
        <div className="-mx-3">
          <Switch
            checked={enhancedProtection}
            onChange={onToggleEnhanced}
            label="Enhanced protection"
            description={`Heightened alert state · ${safeguards} safeguards active`}
          />
        </div>
      </div>
    </section>
  );
};
