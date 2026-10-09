import React, { useCallback, useEffect, useRef } from 'react';
import { RadarSampleBreach } from '../../data/radar-breaches';
import { useTheme } from '../../context/theme-context';

interface RadarCanvasProps {
  blips: RadarSampleBreach[];
  selectedId?: string;
  /** Isometric tilt (modal) vs flat plan view. */
  tilted?: boolean;
  /** Ring captions and callout card (modal only). */
  detailed?: boolean;
  className?: string;
  onSelect: (id: string) => void;
  onDetect?: (breach: RadarSampleBreach) => void;
  ariaLabel: string;
}

interface Palette {
  surface: string;
  line: string;
  lineStrong: string;
  fg: string;
  fg3: string;
  accent: string;
  crit: string;
  high: string;
  med: string;
  safe: string;
}

const PITCH = 0.55;
const RING_LABELS = ['Core vault', 'Private network', 'DMZ ingress', 'Perimeter edge'];

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string) => css.getPropertyValue(name).trim();
  return {
    surface: get('--bm-surface'),
    line: get('--bm-line'),
    lineStrong: get('--bm-line-strong'),
    fg: get('--bm-fg'),
    fg3: get('--bm-fg-3'),
    accent: get('--bm-accent'),
    crit: get('--bm-crit'),
    high: get('--bm-high'),
    med: get('--bm-med'),
    safe: get('--bm-safe'),
  };
}

function severityColor(palette: Palette, severity: RadarSampleBreach['severity']): string {
  return severity === 'CRITICAL' ? palette.crit : severity === 'HIGH' ? palette.high : palette.med;
}

function geometry(width: number, height: number, tilted: boolean) {
  const cx = width / 2;
  const cy = height / 2 + (tilted ? 14 : 0);
  const radius = Math.min(cx, cy) - 22;
  const squash = tilted ? Math.cos(PITCH) : 1;
  return { cx, cy, radius, squash };
}

function blipPoint(b: RadarSampleBreach, angle: number, g: ReturnType<typeof geometry>, tilted: boolean) {
  const floorX = g.cx + Math.cos(angle) * g.radius * b.distance;
  const floorY = g.cy + Math.sin(angle) * g.radius * b.distance * g.squash;
  return { floorX, floorY, x: floorX, y: floorY - (tilted ? b.elevation : 0) };
}

/**
 * Radar plot. The vertical axis is the "mirror": when a threat is neutralized
 * its reflection appears across the axis in the safe color.
 */
export const RadarCanvas: React.FC<RadarCanvasProps> = ({ blips, selectedId, tilted = false, detailed = false, className = '', onSelect, onDetect, ariaLabel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const stateRef = useRef({ blips, selectedId, tilted, detailed, onDetect });
  stateRef.current = { blips, selectedId, tilted, detailed, onDetect };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = readPalette(); // re-read whenever the theme changes (effect re-runs)
    let sweep = 0.9;
    let frame = 0;
    let lastHit = '';
    let width = 0;
    let height = 0;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(box.width));
      height = Math.max(1, Math.round(box.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const { blips: items, selectedId: selected, tilted: tilt, detailed: showDetail, onDetect: detect } = stateRef.current;
      const g = geometry(width, height, tilt);
      ctx.clearRect(0, 0, width, height);

      // Rings
      [0.25, 0.5, 0.75, 1].forEach((d, index) => {
        ctx.beginPath();
        ctx.ellipse(g.cx, g.cy, g.radius * d, g.radius * d * g.squash, 0, 0, Math.PI * 2);
        ctx.strokeStyle = index === 3 ? palette.lineStrong : palette.line;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (showDetail) {
          ctx.fillStyle = palette.fg3;
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(RING_LABELS[index], g.cx + 6, g.cy - g.radius * d * g.squash + 13);
        }
      });

      // Mirror axis (vertical) and horizon
      ctx.beginPath();
      ctx.moveTo(g.cx, g.cy - g.radius * g.squash - 6);
      ctx.lineTo(g.cx, g.cy + g.radius * g.squash + 6);
      ctx.strokeStyle = palette.lineStrong;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(g.cx - g.radius, g.cy);
      ctx.lineTo(g.cx + g.radius, g.cy);
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sweep
      if (!reduced) sweep = (sweep + 0.018) % (Math.PI * 2);
      const steps = 14;
      const spread = 0.42;
      ctx.beginPath();
      ctx.moveTo(g.cx, g.cy);
      for (let s = 0; s <= steps; s += 1) {
        const a = sweep - spread + (s / steps) * spread;
        ctx.lineTo(g.cx + Math.cos(a) * g.radius, g.cy + Math.sin(a) * g.radius * g.squash);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = palette.accent;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(g.cx, g.cy);
      ctx.lineTo(g.cx + Math.cos(sweep) * g.radius, g.cy + Math.sin(sweep) * g.radius * g.squash);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Blips
      items.forEach(b => {
        if (!b.neutralized) {
          let diff = Math.abs(b.angle - sweep);
          if (diff > Math.PI) diff = Math.PI * 2 - diff;
          if (diff < 0.07 && lastHit !== b.id) {
            lastHit = b.id;
            detect?.(b);
          }
        }
        const p = blipPoint(b, b.angle, g, tilt);
        if (tilt) {
          ctx.beginPath();
          ctx.moveTo(p.floorX, p.floorY);
          ctx.lineTo(p.x, p.y);
          ctx.setLineDash([2, 3]);
          ctx.strokeStyle = palette.lineStrong;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        const color = severityColor(palette, b.severity);
        if (b.neutralized) {
          // Original threat becomes a hollow marker; its reflection appears across the axis.
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.strokeStyle = palette.fg3;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          const mirror = blipPoint(b, Math.PI - b.angle, g, tilt);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mirror.x, mirror.y);
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = palette.safe;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(mirror.x, mirror.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = palette.safe;
          ctx.fill();
        } else {
          // Severity is encoded by shape as well as color: circle (critical), square (high), diamond (elevated).
          ctx.fillStyle = color;
          ctx.beginPath();
          if (b.severity === 'CRITICAL') ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          else if (b.severity === 'HIGH') ctx.rect(p.x - 6, p.y - 6, 12, 12);
          else {
            ctx.moveTo(p.x, p.y - 8);
            ctx.lineTo(p.x + 8, p.y);
            ctx.lineTo(p.x, p.y + 8);
            ctx.lineTo(p.x - 8, p.y);
            ctx.closePath();
          }
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = palette.surface;
          ctx.stroke();
        }

        if (b.id === selected) {
          ctx.strokeStyle = palette.fg;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.font = '600 11px "JetBrains Mono", monospace';
        const label = `${b.chapterNumber}`;
        ctx.fillStyle = palette.surface;
        ctx.fillRect(p.x + 10, p.y - 8, ctx.measureText(label).width + 8, 16);
        ctx.strokeStyle = palette.line;
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x + 10, p.y - 8, ctx.measureText(label).width + 8, 16);
        ctx.fillStyle = palette.fg;
        ctx.fillText(label, p.x + 14, p.y + 4);
      });

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      resize();
      draw();
    };
    start();
    canvas.addEventListener('bm-redraw', draw);
    const observer = new ResizeObserver(start);
    observer.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      canvas.removeEventListener('bm-redraw', draw);
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [resolvedTheme]);

  // Static (reduced-motion) mode redraws when data changes.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvasRef.current?.dispatchEvent(new Event('bm-redraw'));
    }
  }, [blips, selectedId, tilted]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const box = canvas.getBoundingClientRect();
      const g = geometry(box.width, box.height, tilted);
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      let best: { id: string; dist: number } | null = null;
      blips.forEach(b => {
        const p = blipPoint(b, b.angle, g, tilted);
        const dist = Math.hypot(x - p.x, y - p.y);
        if (dist < 30 && (!best || dist < best.dist)) best = { id: b.id, dist };
      });
      const hit = best as { id: string; dist: number } | null;
      if (hit) onSelect(hit.id);
    },
    [blips, tilted, onSelect],
  );

  return <canvas ref={canvasRef} onClick={handleClick} aria-label={ariaLabel} role="img" className={`block h-full w-full cursor-crosshair ${className}`} />;
};
