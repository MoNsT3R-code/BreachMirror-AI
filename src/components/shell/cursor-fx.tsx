import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/theme-context';

/** Slowly drifting colour fields that give the glass something to refract. Purely decorative. */
export const AmbientBackground: React.FC = () => (
  <div className="bm-ambient" aria-hidden="true">
    <span className="bm-ambient__blob" />
    <span className="bm-ambient__blob" />
    <span className="bm-ambient__blob" />
  </div>
);

const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], [role="radio"], [role="checkbox"], [role="switch"], [role="option"], summary, select, [draggable="true"], label[for]';
const TEXT_ENTRY = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]';
const GLASS = '.bm-glass, .bm-glass-strong, .bm-card, .bm-btn-primary';
const MAGNET = '.bm-btn-primary, .bm-magnet';

/**
 * Pointer-reactive effects for fine pointers (mouse, trackpad, pen):
 *  - a soft accent light that trails the cursor behind the glass,
 *  - a ring and dot that follow the cursor and react to what is under it,
 *  - a click ripple,
 *  - a pointer-lit edge and sheen on glass surfaces (via --gx / --gy).
 * Everything is transform/opacity based, runs in one requestAnimationFrame loop,
 * is hidden for touch, reduced motion and forced colors, and can be turned off in the user menu.
 */
export const CursorFx: React.FC = () => {
  const { effects } = useTheme();
  const spotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effects) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return undefined;

    const spot = spotRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!spot || !ring || !dot) return undefined;

    const target = { x: -200, y: -200 };
    const eased = { x: -200, y: -200 };
    const ringPos = { x: -200, y: -200 };
    let ringScale = 1;
    let ringScaleTarget = 1;
    let pressed = false;
    let frame = 0;
    let glassEl: HTMLElement | null = null;
    let glassPoint: { x: number; y: number } | null = null;
    let visible = false;
    let magnetEl: HTMLElement | null = null;

    const show = (on: boolean) => {
      if (visible === on) return;
      visible = on;
      const value = String(on);
      spot.dataset.on = value;
      ring.dataset.on = value;
      dot.dataset.on = value;
    };

    const tick = () => {
      eased.x += (target.x - eased.x) * 0.08;
      eased.y += (target.y - eased.y) * 0.08;
      ringPos.x += (target.x - ringPos.x) * 0.2;
      ringPos.y += (target.y - ringPos.y) * 0.2;
      ringScale += (ringScaleTarget - ringScale) * 0.22;
      spot.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${ringScale.toFixed(3)})`;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (glassEl && glassPoint) {
        const box = glassEl.getBoundingClientRect();
        glassEl.style.setProperty('--gx', `${glassPoint.x - box.left}px`);
        glassEl.style.setProperty('--gy', `${glassPoint.y - box.top}px`);
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        eased.x = ringPos.x = target.x;
        eased.y = ringPos.y = target.y;
        show(true);
      }
      const el = event.target as Element | null;
      const hot = Boolean(el?.closest?.(INTERACTIVE));
      const text = Boolean(el?.closest?.(TEXT_ENTRY));
      ring.dataset.hot = String(hot);
      ring.dataset.text = String(text);
      dot.dataset.text = String(text);
      ringScaleTarget = pressed ? 0.8 : hot ? 1.55 : 1;
      const glass = el?.closest?.(GLASS) as HTMLElement | null;
      glassEl = glass;
      glassPoint = glass ? { x: event.clientX, y: event.clientY } : null;

      // Magnetic pull: primary controls lean a few pixels toward the cursor.
      const magnet = el?.closest?.(MAGNET) as HTMLElement | null;
      if (magnetEl && magnetEl !== magnet) magnetEl.style.translate = '';
      magnetEl = magnet;
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const dx = Math.max(-5, Math.min(5, (event.clientX - (box.left + box.width / 2)) * 0.12));
        const dy = Math.max(-4, Math.min(4, (event.clientY - (box.top + box.height / 2)) * 0.18));
        magnet.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pressed = true;
      ringScaleTarget = 0.8;
      const wave = document.createElement('span');
      wave.className = 'bm-ripple';
      wave.style.left = `${event.clientX}px`;
      wave.style.top = `${event.clientY}px`;
      wave.setAttribute('aria-hidden', 'true');
      wave.addEventListener('animationend', () => wave.remove());
      document.body.appendChild(wave);
    };

    const onUp = () => {
      pressed = false;
      ringScaleTarget = ring.dataset.hot === 'true' ? 1.55 : 1;
    };

    const onLeave = () => {
      show(false);
      if (magnetEl) magnetEl.style.translate = '';
    };
    const onEnter = () => show(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      if (magnetEl) magnetEl.style.translate = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      show(false);
    };
  }, [effects]);

  if (!effects) return null;
  return (
    <>
      <div ref={spotRef} className="bm-spot" aria-hidden="true" />
      <div ref={ringRef} className="bm-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="bm-cursor-dot" aria-hidden="true" />
    </>
  );
};
