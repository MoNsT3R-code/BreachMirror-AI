import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Pause, Play, Zap } from 'lucide-react';
import { setLive, useTelemetry } from '../../services/live-telemetry';

interface ThreatSpeedWidgetProps {
  onInjectSimulatedBreach?: () => void;
}

const Spark: React.FC<{ values: number[] }> = ({ values }) => {
  const width = 120;
  const height = 32;
  const max = Math.max(...values, 1);
  const path = values
    .map((value, index) => `${index === 0 ? 'M' : 'L'}${((index / (values.length - 1)) * width).toFixed(1)} ${(height - (value / max) * (height - 4) - 2).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Velocity over the last two minutes" className="max-w-full">
      <path d={path} fill="none" stroke="var(--bm-s1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ThreatSpeedWidget: React.FC<ThreatSpeedWidgetProps> = ({ onInjectSimulatedBreach }) => {
  const { live, velocity, prevented, quarantined, series } = useTelemetry();

  return (
    <div className="bm-ds grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" id="telemetry-velocity-radar">
      <div className="rounded-md border border-line bg-surface-2 p-4">
        <p className="bm-eyebrow flex items-center justify-between">
          Threat velocity <Activity className="h-4 w-4 text-accent-text" aria-hidden="true" />
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold tabular-nums text-fg">{velocity}</span>
          <span className="font-mono text-xs text-fg-3">events / min</span>
        </p>
        <div className="mt-2">
          <Spark values={series} />
        </div>
      </div>

      <div className="rounded-md border border-line bg-surface-2 p-4">
        <p className="bm-eyebrow flex items-center justify-between">
          Prevented <CheckCircle2 className="h-4 w-4 text-safe" aria-hidden="true" />
        </p>
        <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-safe">{prevented}</p>
        <p className="mt-2 text-xs text-fg-3">Intercepted before any data left.</p>
      </div>

      <div className="rounded-md border border-line bg-surface-2 p-4">
        <p className="bm-eyebrow flex items-center justify-between">
          Quarantined <AlertTriangle className="h-4 w-4 text-med" aria-hidden="true" />
        </p>
        <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-med">{quarantined}</p>
        <p className="mt-2 text-xs text-fg-3">Devices isolated for review.</p>
      </div>

      <div className="flex flex-col justify-between rounded-md border border-line bg-surface-2 p-4">
        <p className="bm-eyebrow flex items-center justify-between">
          Sensor
          <span className={`bm-chip ${live ? 'bm-sev bm-sev-safe' : ''}`}>{live ? 'Live' : 'Paused'}</span>
        </p>
        <div className="mt-3 flex gap-2">
          <button type="button" className="bm-btn bm-btn-sm flex-1" onClick={() => setLive(!live)}>
            {live ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            {live ? 'Pause' : 'Resume'}
          </button>
          <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onInjectSimulatedBreach} title="Simulate a breach attempt">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Simulate
          </button>
        </div>
      </div>
    </div>
  );
};
