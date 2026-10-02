import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface WelcomeButtonProps {
  onClick?: () => void;
  className?: string;
  title?: string;
  userName?: string;
  clearanceLevel?: string;
}

const StarSvg: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    version="1.1"
    style={{
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'auto',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    }}
    viewBox="0 0 784.11 815.53"
  >
    <g id="Layer_x0020_1">
      <path
        className="fil0"
        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
      />
    </g>
  </svg>
);

export const WelcomeButton: React.FC<WelcomeButtonProps> = ({
  onClick,
  className = '',
  title = 'INITIALIZE HANDBOOK',
  userName = 'Operator',
  clearanceLevel = 'LVL-4 CLEARANCE',
}) => {
  const displayUser = userName && userName.trim() ? userName.trim() : 'Operator';

  return (
    <button
      onClick={onClick}
      type="button"
      className={`welcome-star-btn group ${className}`}
      title={`Unverified local training session for ${displayUser} (${clearanceLevel})`}
    >
      {/* Tactical Badge Header & Officer Identifier */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Tactical Holographic Icon Container */}
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)] shrink-0 transition-transform group-hover:scale-105">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Structured Credentials Typography */}
        <div className="flex flex-col items-start text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-widest uppercase text-slate-100 font-display group-hover:text-cyan-200 transition-colors">
              {title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-mono text-cyan-400/90 font-medium">OFFICER</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[0_0_8px_rgba(6,182,212,0.2)]">
              {displayUser}
            </span>
            <span className="text-[9px] font-mono text-emerald-400 px-1 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 hidden sm:inline-block tracking-wider">
              {clearanceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Multi-Layered Animated Flying Stars */}
      <div className="star-1">
        <StarSvg />
      </div>
      <div className="star-2">
        <StarSvg />
      </div>
      <div className="star-3">
        <StarSvg />
      </div>
      <div className="star-4">
        <StarSvg />
      </div>
      <div className="star-5">
        <StarSvg />
      </div>
      <div className="star-6">
        <StarSvg />
      </div>
    </button>
  );
};
