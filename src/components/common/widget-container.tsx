import React, { useRef, useState } from 'react';
import { ChevronUp, ChevronDown, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface WidgetContainerProps {
  id: string;
  title: string;
  subtitle?: string;
  category: 'telemetry' | 'playbook' | 'analytics' | 'simulator';
  children: React.ReactNode;
  width?: 'full' | 'half';
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onHide?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  closable?: boolean;
  badgeText?: string;
  actionButton?: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  subtitle,
  category,
  children,
  width = 'half',
  onMoveUp,
  onMoveDown,
  onHide,
  isFirst,
  isLast,
  closable = true,
  badgeText,
  actionButton,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Calculate subtle 3D tilt (max 4.5 degrees for clean usability)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 3.5;
    const rotateX = -((y - centerY) / centerY) * 3.5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const getCategoryTheme = () => {
    switch (category) {
      case 'telemetry':
        return {
          glow: 'rgba(6, 182, 212, 0.15)',
          border: 'border-white/10 hover:border-cyan-500/40',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          tag: 'THREAT TELEMETRY',
        };
      case 'playbook':
        return {
          glow: 'rgba(168, 85, 247, 0.15)',
          border: 'border-white/10 hover:border-purple-500/40',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          tag: 'SECURITY DIRECTIVES',
        };
      case 'analytics':
        return {
          glow: 'rgba(59, 130, 246, 0.15)',
          border: 'border-white/10 hover:border-blue-500/40',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          tag: 'ANALYTICS RADAR',
        };
      case 'simulator':
        return {
          glow: 'rgba(245, 158, 11, 0.15)',
          border: 'border-white/10 hover:border-amber-500/40',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          tag: 'DILEMMA LAB',
        };
    }
  };

  const theme = getCategoryTheme();

  const widthClass = isExpanded
    ? 'col-span-1 lg:col-span-2'
    : width === 'full'
    ? 'col-span-1 lg:col-span-2'
    : 'col-span-1';

  return (
    <section
      ref={containerRef}
      id={`mfe-widget-${id}`}
      role="region"
      aria-labelledby={`title-${id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden vengeance-glass transition-all duration-200 ${theme.border} ${widthClass} flex flex-col bg-slate-900/60 backdrop-blur-xl`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateZ(6px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out' : 'transform 0.35s ease-out, box-shadow 0.35s ease-out',
        boxShadow: isHovered
          ? `0 20px 45px -12px ${theme.glow}, 0 0 25px -5px ${theme.glow}`
          : '0 8px 24px -10px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Dynamic 3D Mouse Spotlight & Specular Glare */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-200 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${theme.glow}, transparent 75%)`,
        }}
      />
      {/* Specular White Glare for Authentic 3D Pop */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-200 z-0 mix-blend-overlay"
        style={{
          opacity: isHovered ? 0.35 : 0,
          background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.45), transparent 70%)`,
        }}
      />

      {/* Header bar */}
      <header className="relative z-10 px-5 py-4 border-b border-white/5 flex items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border tracking-wider font-bold shrink-0 ${theme.badge}`}
          >
            {badgeText || theme.tag}
          </span>
          <div className="min-w-0">
            <h2
              id={`title-${id}`}
              className="text-sm sm:text-base font-bold text-slate-100 tracking-wide font-display truncate"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-slate-400 font-sans truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 shrink-0">
          {actionButton}

          {onMoveUp && !isFirst && (
            <button
              onClick={onMoveUp}
              aria-label={`Move ${title} widget up`}
              title="Move Up"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          {onMoveDown && !isLast && (
            <button
              onClick={onMoveDown}
              aria-label={`Move ${title} widget down`}
              title="Move Down"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
            title={isExpanded ? 'Collapse' : 'Expand full width'}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {closable && onHide && (
            <button
              onClick={onHide}
              aria-label={`Hide ${title} widget`}
              title="Hide Widget"
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Widget Content Body with spacious padding */}
      <div className="relative z-10 p-5 sm:p-6 flex-1 flex flex-col">{children}</div>
    </section>
  );
};
