import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Radio, 
  Zap 
} from 'lucide-react';

interface ThreatSpeedWidgetProps {
  onInjectSimulatedBreach?: () => void;
}

export const ThreatSpeedWidget: React.FC<ThreatSpeedWidgetProps> = ({
  onInjectSimulatedBreach,
}) => {
  const [velocityRate, setVelocityRate] = useState<number>(4.2);
  const [preventedCount, setPreventedCount] = useState<number>(142);
  const [quarantinedCount, setQuarantinedCount] = useState<number>(3);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setVelocityRate(prev => {
        const delta = (Math.random() - 0.48) * 0.4;
        return Number(Math.max(1.8, Math.min(8.5, prev + delta)).toFixed(1));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  return (
    <div className="space-y-4" id="telemetry-velocity-radar">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Velocity */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>Threat Velocity</span>
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-white">
              {velocityRate}
            </span>
            <span className="text-xs text-cyan-400 font-mono">eps / min</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.4)] h-full transition-all duration-700 rounded-full"
              style={{ width: `${Math.min(100, velocityRate * 12)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Prevented */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>Prevented</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-emerald-400">
              {preventedCount}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-mono">Zero Escape</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            100% Intercepted without fault
          </div>
        </div>

        {/* Metric 3: Quarantined */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col justify-between group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>Quarantined</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-amber-400">
              {quarantinedCount}
            </span>
            <span className="text-[10px] text-amber-300 font-mono">Fleet Isolated</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            2 USBs, 1 Typosquat PR
          </div>
        </div>

        {/* Metric 4: Sensor Controls */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
              Kernel Sensor
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                isLiveStreaming
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              {isLiveStreaming ? 'LIVE' : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {isLiveStreaming ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={onInjectSimulatedBreach}
              title="Simulate breach attempt"
              className="py-1.5 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[11px] uppercase tracking-wider">Simulate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
