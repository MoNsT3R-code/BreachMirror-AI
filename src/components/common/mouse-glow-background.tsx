import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAlerts } from '../../context/alert-context';
import { useTheme } from '../../context/theme-context';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface Particle3D {
  x: number;
  y: number;
  z: number; // 0.1 to 1.0 (depth factor)
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
}

export const MouseGlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isVengeanceMode, defconLevel, scanlines } = useAlerts();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  // Track mouse coordinates & velocity for dynamic "pop"
  const mouseRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 3 : 300,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 3 : 300,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: Date.now(),
  });

  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle3D[]>([]);

  // Trigger interactive shockwave / pop on mouse click or burst
  const triggerPop = useCallback((x: number, y: number, intensity = 1) => {
    const colors = isVengeanceMode
      ? ['#8f1c2f', '#441371', '#674915', '#ff00557b']
      : isLight
      ? ['#146289', '#7c3aed', '#10b981', '#f43f5e']
      : ['#00f2fe', '#a855f7', '#10f396', '#38bdf8'];

    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: 280 * intensity,
      alpha: 0.85,
      color: chosenColor,
    });
    if (ripplesRef.current.length > 8) {
      ripplesRef.current.shift();
    }
  }, [isVengeanceMode, isLight]);

  // Handle mouse movement and clicks
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - mouseRef.current.lastTime);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.vx = dx / dt;
      mouseRef.current.vy = dy / dt;
      mouseRef.current.speed = speed;
      mouseRef.current.lastTime = now;

      lastX = e.clientX;
      lastY = e.clientY;

      // If mouse is moved with high velocity, create an interactive aurora burst
      if (speed > 3.2 && Math.random() < 0.25) {
        triggerPop(e.clientX, e.clientY, Math.min(1.6, speed * 0.3));
      }
    };

    const handleClick = (e: MouseEvent) => {
      triggerPop(e.clientX, e.clientY, 1.4);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [triggerPop]);

  // Main 3D Aurora Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize 3D depth particles
    const particleCount = 55;
    const palette = isVengeanceMode
      ? ['#f43f5e', '#fb7185', '#c084fc', '#f59e0b', '#fda4af']
      : isLight
      ? ['#0284c7', '#6366f1', '#10b981', '#f43f5e', '#0ea5e9']
      : ['#00f2fe', '#38bdf8', '#a855f7', '#34d399', '#f472b6'];

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.15 + Math.random() * 0.85,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1 + Math.random() * 2.5,
      baseAlpha: 0.2 + Math.random() * 0.5,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.09;
      m.y += (m.targetY - m.y) * 0.09;

      // Clear canvas with subtle trail
      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. 3D Parallax Aurora Wave Ribbons (Mouse Interactive "Pop")
      // -------------------------------------------------------------
      const ribbonCount = 4;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.save();

        const baseHeight = height * (0.28 + r * 0.16);
        const mouseDistRatio = Math.max(0, 1 - Math.hypot(m.x - width / 2, m.y - baseHeight) / (width * 0.7));
        const popOffset = mouseDistRatio * 130 * (1 + Math.min(2, m.speed * 0.5));

        // Create gradient for each ribbon
        const grad = ctx.createLinearGradient(0, baseHeight - 120, width, baseHeight + 160);

        if (isVengeanceMode) {
          if (r === 0) {
            grad.addColorStop(0, 'rgba(244, 63, 94, 0)');
            grad.addColorStop(0.3, 'rgba(244, 63, 94, 0.45)');
            grad.addColorStop(0.6, 'rgba(168, 85, 247, 0.35)');
            grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          } else if (r === 1) {
            grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
            grad.addColorStop(0.4, 'rgba(225, 29, 72, 0.4)');
            grad.addColorStop(0.7, 'rgba(147, 51, 234, 0.3)');
            grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          } else {
            grad.addColorStop(0.2, 'rgba(168, 85, 247, 0.25)');
            grad.addColorStop(0.5, 'rgba(244, 63, 94, 0.35)');
            grad.addColorStop(0.8, 'rgba(245, 158, 11, 0.2)');
          }
        } else if (isLight) {
          // Opalescent crystal aurora in light mode (gentle translucent tones, zero contrast loss)
          if (r === 0) {
            grad.addColorStop(0, 'rgba(2, 132, 199, 0)');
            grad.addColorStop(0.3, 'rgba(2, 132, 199, 0.22)');
            grad.addColorStop(0.6, 'rgba(124, 58, 237, 0.18)');
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else if (r === 1) {
            grad.addColorStop(0, 'rgba(124, 58, 237, 0)');
            grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.2)');
            grad.addColorStop(0.7, 'rgba(244, 63, 94, 0.15)');
            grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          } else {
            grad.addColorStop(0.2, 'rgba(16, 185, 129, 0.15)');
            grad.addColorStop(0.5, 'rgba(2, 132, 199, 0.18)');
            grad.addColorStop(0.8, 'rgba(124, 58, 237, 0.12)');
          }
        } else {
          // Deep cosmic neon aurora in dark mode
          if (r === 0) {
            grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
            grad.addColorStop(0.25, 'rgba(0, 242, 254, 0.45)');
            grad.addColorStop(0.55, 'rgba(168, 85, 247, 0.4)');
            grad.addColorStop(0.85, 'rgba(16, 243, 150, 0.35)');
            grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
          } else if (r === 1) {
            grad.addColorStop(0, 'rgba(168, 85, 247, 0)');
            grad.addColorStop(0.3, 'rgba(244, 63, 94, 0.35)');
            grad.addColorStop(0.6, 'rgba(0, 242, 254, 0.4)');
            grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
          } else if (r === 2) {
            grad.addColorStop(0.1, 'rgba(16, 243, 150, 0.25)');
            grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
            grad.addColorStop(0.9, 'rgba(168, 85, 247, 0.25)');
          } else {
            grad.addColorStop(0.2, 'rgba(245, 158, 11, 0.18)');
            grad.addColorStop(0.5, 'rgba(244, 63, 94, 0.25)');
            grad.addColorStop(0.8, 'rgba(0, 242, 254, 0.2)');
          }
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, height);

        // Compute smooth cubic/sinusoidal spline warped by mouse
        const steps = 36;
        for (let i = 0; i <= steps; i++) {
          const px = (i / steps) * width;

          // Primary undulating harmonic
          const wave1 = Math.sin(time * 0.8 + i * 0.18 + r * 1.5) * 45;
          // Secondary rapid flutter
          const wave2 = Math.cos(time * 1.4 - i * 0.26 + r) * 25;

          // Magnetic mouse attraction & kinetic pop
          const dToMouse = Math.hypot(px - m.x, baseHeight - m.y);
          const mousePull = Math.max(0, 1 - dToMouse / (width * 0.45));
          const popY = (m.y - baseHeight) * mousePull * 0.45;
          const rippleWarp = Math.sin(dToMouse * 0.02 - time * 4) * mousePull * 28;

          const py = baseHeight + wave1 + wave2 + popY + rippleWarp - popOffset * 0.2;

          if (i === 0) {
            ctx.lineTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 2. Mouse Dynamic Aurora Core Spotlight (Follows & Glows)
      // -------------------------------------------------------------
      ctx.save();
      const coreRadius = isLight ? 280 : 340;
      const coreGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, coreRadius);

      if (isVengeanceMode) {
        coreGrad.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
        coreGrad.addColorStop(0.35, 'rgba(168, 85, 247, 0.25)');
        coreGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.1)');
        coreGrad.addColorStop(1, 'transparent');
      } else if (isLight) {
        coreGrad.addColorStop(0, 'rgba(2, 132, 199, 0.22)');
        coreGrad.addColorStop(0.4, 'rgba(124, 58, 237, 0.12)');
        coreGrad.addColorStop(0.75, 'rgba(16, 185, 129, 0.05)');
        coreGrad.addColorStop(1, 'transparent');
      } else {
        coreGrad.addColorStop(0, 'rgba(0, 242, 254, 0.38)');
        coreGrad.addColorStop(0.35, 'rgba(168, 85, 247, 0.22)');
        coreGrad.addColorStop(0.7, 'rgba(59, 130, 246, 0.1)');
        coreGrad.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sharp mouse lens center flare
      const flareGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 35);
      flareGrad.addColorStop(0, isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(255, 255, 255, 0.6)');
      flareGrad.addColorStop(0.5, isVengeanceMode ? 'rgba(244, 63, 94, 0.4)' : 'rgba(0, 242, 254, 0.35)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // 3. Interactive Expanding "Pop" Shockwaves
      // -------------------------------------------------------------
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += (rip.maxRadius - rip.radius) * 0.08 + 1.2;
        rip.alpha *= 0.94;

        if (rip.alpha < 0.02 || rip.radius >= rip.maxRadius - 2) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color;
        ctx.globalAlpha = rip.alpha;
        ctx.lineWidth = Math.max(1, 3 * (1 - rip.radius / rip.maxRadius));
        ctx.stroke();

        // Secondary subtle chromatic inner ring
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(1, rip.radius * 0.75), 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = rip.alpha * 0.5;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 4. 3D Floating Celestial Dust / Quantum Nodes (Parallax Drift)
      // -------------------------------------------------------------
      const particles = particlesRef.current;
      const mouseParallaxX = ((m.x / width) - 0.5) * 40;
      const mouseParallaxY = ((m.y / height) - 0.5) * 35;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse magnetic repulsion / interaction
        const distM = Math.hypot(p.x - m.x, p.y - m.y);
        let pushX = 0;
        let pushY = 0;
        if (distM < 160) {
          const force = (1 - distM / 160) * 1.5;
          pushX = ((p.x - m.x) / distM) * force * 4;
          pushY = ((p.y - m.y) / distM) * force * 4;
        }

        // Apply 3D depth parallax
        const renderX = p.x + mouseParallaxX * p.z + pushX;
        const renderY = p.y + mouseParallaxY * p.z + pushY;
        const renderSize = p.size * (0.8 + p.z * 0.6);
        const alpha = Math.min(1, p.baseAlpha * (0.5 + p.z * 0.5) * (distM < 160 ? 1.8 : 1));

        ctx.save();
        ctx.globalAlpha = isLight ? alpha * 0.6 : alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(renderX, renderY, renderSize, 0, Math.PI * 2);
        ctx.fill();

        // High-depth particles have a soft halo
        if (p.z > 0.65) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, renderSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.2;
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVengeanceMode, isLight]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 0. Infinite Parallax Starfield Background */}
      <div className="star-field-container">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <div />
      </div>

      {/* 1. CRT Scanlines (optional tactical overlay) */}
      {scanlines && <div className="crt-scanlines" />}

      {/* 2. Hardware-accelerated 3D Interactive Aurora Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: isLight ? 'blur(28px)' : 'blur(36px)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* 3. High-Fidelity 3D Cyber Isometric Matrix Grid */}
      <div 
        className="absolute inset-0 cyber-grid opacity-60"
        style={{
          perspective: '1000px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0.1) 85%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0.1) 85%, transparent 100%)',
        }}
      />

      {/* 4. Horizon Glow Accent */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-44 pointer-events-none transition-all duration-700 ${
          isVengeanceMode
            ? 'opacity-40'
            : isLight
            ? 'opacity-20'
            : 'opacity-30'
        }`}
        style={{
          background: isVengeanceMode
            ? 'linear-gradient(to top, rgba(244, 63, 94, 0.4) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 100%)'
            : isLight
            ? 'linear-gradient(to top, rgba(2, 132, 199, 0.18) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0, 242, 254, 0.25) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};
