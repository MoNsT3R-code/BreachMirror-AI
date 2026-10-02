import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Crosshair, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Maximize2,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { SAMPLE_HANDBOOK_RADAR_BREACHES, RadarSampleBreach } from '../common/threat-radar-modal';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { useTheme } from '../../context/theme-context';
import { InteractiveCard } from '../common/interactive-card';

interface RadarWidgetProps {
  onOpenFullRadar: () => void;
  onOpenHandbook: (vectorId?: string) => void;
}

export const RadarWidget: React.FC<RadarWidgetProps> = ({
  onOpenFullRadar,
  onOpenHandbook,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [breaches, setBreaches] = useState<RadarSampleBreach[]>(SAMPLE_HANDBOOK_RADAR_BREACHES);
  const [activeBreachId, setActiveBreachId] = useState<string>('radar-sample-1');
  const [liveDetected, setLiveDetected] = useState<RadarSampleBreach | null>(null);
  const [radarMode, setRadarMode] = useState<'tactical' | 'canvas'>('tactical');
  const { isVengeanceMode, soundEnabled, toggleSound } = useAlerts();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const activeBreach = breaches.find(b => b.id === activeBreachId) || breaches[0];

  useEffect(() => {
    let sweepAngle = 0;
    let animId: number;
    let lastHitId = '';

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) - 16;
      const ySquash = 0.88; // 3D perspective slant

      // Clear
      if (isLight) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      } else {
        ctx.fillStyle = isVengeanceMode ? 'rgba(8, 2, 14, 0.28)' : 'rgba(2, 6, 23, 0.28)';
      }
      ctx.fillRect(0, 0, width, height);

      // Radar Concentric Rings in 3D
      [0.33, 0.66, 1.0].forEach((d, idx) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * d, radius * d * ySquash, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isLight 
          ? 'rgba(2, 132, 199, 0.3)' 
          : isVengeanceMode ? 'rgba(244, 63, 94, 0.25)' : 'rgba(0, 242, 254, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius * ySquash);
      ctx.lineTo(cx, cy + radius * ySquash);
      ctx.strokeStyle = isLight ? 'rgba(148, 163, 184, 0.3)' : 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Sweep Beam
      sweepAngle += isVengeanceMode ? 0.045 : 0.026;
      if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const sweepSteps = 12;
      const spread = 0.38;
      for (let s = 0; s <= sweepSteps; s++) {
        const a = sweepAngle - spread + (s / sweepSteps) * spread;
        const px = cx + Math.cos(a) * radius;
        const py = cy + Math.sin(a) * (radius * ySquash);
        ctx.lineTo(px, py);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      if (isLight) {
        grad.addColorStop(0, 'rgba(2, 132, 199, 0.4)');
        grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      } else if (isVengeanceMode) {
        grad.addColorStop(0, 'rgba(255, 42, 109, 0.5)');
        grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
      } else {
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.5)');
        grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      }
      ctx.fillStyle = grad;
      ctx.fill();

      // Leading beam line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * radius, cy + Math.sin(sweepAngle) * (radius * ySquash));
      ctx.strokeStyle = isLight ? '#0284c7' : isVengeanceMode ? '#ff0055' : '#00f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Threat Blips (Handbook Sample Breaches)
      breaches.forEach(b => {
        let diff = Math.abs(b.angle - sweepAngle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;

        // Sweep detection hit
        if (diff < 0.09 && !b.neutralized && lastHitId !== b.id) {
          lastHitId = b.id;
          setLiveDetected(b);
        }

        const bx = cx + Math.cos(b.angle) * (radius * b.distance);
        const by = cy + Math.sin(b.angle) * (radius * b.distance * ySquash);

        ctx.beginPath();
        ctx.arc(bx, by, b.neutralized ? 3.5 : 5.5, 0, Math.PI * 2);
        ctx.fillStyle = b.neutralized 
          ? '#10b981' 
          : b.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b';
        ctx.fill();

        if (b.id === activeBreachId) {
          ctx.strokeStyle = isLight ? '#0284c7' : '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(bx - 8, by - 8, 16, 16);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [breaches, activeBreachId, isVengeanceMode, isLight]);

  const handleSelectBreach = (b: RadarSampleBreach) => {
    setActiveBreachId(b.id);
    soundManager.playTargetLock();
  };

  return (
    <InteractiveCard maxTilt={5} scale={1.01} className="w-full">
      <div className="p-5 sm:p-6 rounded-3xl vengeance-glass border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col gap-5 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Radar Breach Detector: Handbook Vectors
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  LIVE SWEEP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Correlating real-time radar echoes with internee security handbook sample incidents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFullRadar}
              className="h-8 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Full 3D War Room
            </button>
          </div>
        </div>

        {/* Live Detected Banner */}
        {liveDetected && (
          <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span className="font-bold text-white">INTERCEPTED:</span>
              <span className="text-amber-300 font-bold truncate">{liveDetected.name}</span>
            </div>
            <button
              onClick={() => setActiveBreachId(liveDetected.id)}
              className="text-[11px] font-bold text-cyan-400 hover:underline shrink-0 cursor-pointer"
            >
              Lock Blip
            </button>
          </div>
        )}

        {/* Middle: Tactical Radar Scanner / Canvas on left, Active Sample Breach on right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Tactical Radar Display */}
          <div className={`md:col-span-5 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border relative min-h-[220px] transition-colors ${
            isLight ? 'bg-slate-100/90 border-slate-200 shadow-inner' : 'bg-slate-950/80 border-white/5'
          }`}>
            {/* View Mode Toggle */}
            <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 p-1 rounded-lg border text-[10px] font-mono ${
              isLight ? 'bg-white/80 border-slate-200' : 'bg-black/50 border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setRadarMode('tactical')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  radarMode === 'tactical'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : isLight ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scanner
              </button>
              <button
                type="button"
                onClick={() => setRadarMode('canvas')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  radarMode === 'canvas'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : isLight ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                3D Grid
              </button>
            </div>

            {radarMode === 'tactical' ? (
              <div className="flex flex-col items-center justify-center py-2">
                {/* HTML/CSS Cyber Radar Scanner with 5 Interactive Sample Breach Blips */}
                <div className="loader">
                  <span />

                  <div
                    id="dot-1"
                    className={`dot ${activeBreachId === 'radar-sample-1' ? '!scale-175 !ring-4 !ring-rose-400 !shadow-[0_0_15px_#f43f5e]' : ''}`}
                    title="Sample Breach #1: Prompt Ingestion & PII Leak"
                    onClick={() => handleSelectBreach(breaches[0])}
                  />
                  <div
                    id="dot-2"
                    className={`dot ${activeBreachId === 'radar-sample-2' ? '!scale-175 !ring-4 !ring-amber-400 !shadow-[0_0_15px_#f59e0b]' : ''}`}
                    title="Sample Breach #2: Hardcoded Secrets in Git Commit"
                    onClick={() => handleSelectBreach(breaches[1])}
                  />
                  <div
                    id="dot-3"
                    className={`dot ${activeBreachId === 'radar-sample-3' ? '!scale-175 !ring-4 !ring-cyan-300 !shadow-[0_0_15px_#00f2fe]' : ''}`}
                    title="Sample Breach #3: AiTM Phishing & MFA Fatigue"
                    onClick={() => handleSelectBreach(breaches[2])}
                  />
                  <div
                    id="dot-4"
                    className={`dot ${activeBreachId === 'radar-sample-4' ? '!scale-175 !ring-4 !ring-purple-400 !shadow-[0_0_15px_#a855f7]' : ''}`}
                    title="Sample Breach #4: Unrestricted Public Cloud Share"
                    onClick={() => handleSelectBreach(breaches[3])}
                  />
                  <div
                    id="dot-5"
                    className={`dot ${activeBreachId === 'radar-sample-5' ? '!scale-175 !ring-4 !ring-emerald-400 !shadow-[0_0_15px_#10f396]' : ''}`}
                    title="Sample Breach #5: Malicious Dependency Squatting"
                    onClick={() => handleSelectBreach(breaches[4])}
                  />
                </div>

                <span className={`text-[10px] font-mono mt-2 flex items-center gap-1 font-semibold tracking-wide ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  <Crosshair className="w-3 h-3" /> CLICK ANY BLIP TO LOCK TARGET
                </span>
              </div>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={220}
                  className="w-full max-w-[240px] h-auto cursor-pointer rounded-full"
                  onClick={onOpenFullRadar}
                />
                <span className="text-[10px] font-mono text-cyan-400 mt-2 flex items-center gap-1">
                  <Crosshair className="w-3 h-3" /> CLICK TO EXPAND WAR ROOM RADAR
                </span>
              </>
            )}
          </div>

          {/* Active Target Info */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                SAMPLE BREACH #{activeBreach.chapterNumber}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                activeBreach.severity === 'CRITICAL' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {activeBreach.severity} RISK
              </span>
            </div>

            <h4 className="text-base font-bold text-white font-display">
              {activeBreach.name}
            </h4>

            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
              {activeBreach.sampleScenario}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onOpenHandbook(activeBreach.handbookVectorId)}
                className="h-8 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" /> Handbook Chapter #{activeBreach.chapterNumber}
              </button>

              <button
                onClick={() => {
                  soundManager.playTargetLock();
                  onOpenFullRadar();
                }}
                className="h-8 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Flame className="w-3.5 h-3.5" /> Deploy Countermeasure
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {breaches.map(b => (
            <button
              key={b.id}
              onClick={() => handleSelectBreach(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeBreachId === b.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              #{b.chapterNumber} {b.name}
            </button>
          ))}
        </div>
      </div>
    </InteractiveCard>
  );
};
