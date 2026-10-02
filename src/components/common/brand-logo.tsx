import React from 'react';
import { useAlerts } from '../../context/alert-context';
import { StewartLogo } from './stewart-logo';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  showVersion?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  /** Force specific color theme for wordmark */
  theme?: 'dark' | 'light' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'sm',
  withText = false,
  showVersion = false,
  subtitle,
  className = '',
  onClick,
  theme = 'auto',
}) => {
  const { isVengeanceMode } = useAlerts();

  // Scale map for container and mark
  const sizeMap = {
    xs: {
      box: 'h-6 px-1.5 py-0.5',
      markHeight: 18,
      title: 'text-xs',
      sub: 'text-[9px]',
      badge: 'text-[8px] px-1 py-0.2',
    },
    sm: {
      box: 'h-9 px-2 py-1',
      markHeight: 24,
      title: 'text-base',
      sub: 'text-[10px]',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    md: {
      box: 'h-11 px-2.5 py-1.5',
      markHeight: 30,
      title: 'text-lg',
      sub: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      box: 'h-14 px-3 py-2',
      markHeight: 40,
      title: 'text-xl',
      sub: 'text-xs',
      badge: 'text-xs px-2 py-1',
    },
    xl: {
      box: 'h-20 px-4 py-3',
      markHeight: 54,
      title: 'text-2xl',
      sub: 'text-sm',
      badge: 'text-xs px-2.5 py-1',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Emblem Mark Container with Cyber Aura */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Subtle Brand Aura */}
        <div
          className={`absolute -inset-1 rounded-2xl blur-md transition-all duration-300 opacity-60 group-hover:opacity-90 ${
            isVengeanceMode
              ? 'bg-gradient-to-tr from-rose-600 via-amber-500 to-purple-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'bg-gradient-to-tr from-[#9B2743]/50 via-cyan-500/30 to-blue-600/40 shadow-[0_0_15px_rgba(155,39,67,0.3)]'
          }`}
        />

        {/* Stewart Logo Container: Crisp White/Light Badge matching the official Stewart identity card */}
        <div
          className={`relative ${currentSize.box} rounded-xl flex items-center justify-center bg-white shadow-md border transition-transform duration-300 group-hover:scale-105 ${
            isVengeanceMode
              ? 'border-rose-400/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'border-slate-200/80 shadow-[0_0_12px_rgba(0,0,0,0.15)]'
          }`}
        >
          <StewartLogo
            variant={withText ? 'mark' : 'mark'}
            height={currentSize.markHeight}
            theme="light"
          />
        </div>
      </div>

      {/* Typography Identity */}
      {withText && (
        <div className="flex flex-col min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {/* stewart wordmark in bold lowercase */}
            <div className="flex items-baseline gap-0.5">
              <span
                className={`font-sans font-black tracking-tight leading-none text-slate-900 dark:text-white ${currentSize.title}`}
                style={{ letterSpacing: '-0.02em' }}
              >
                stewart
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-none">
                ™
              </span>
            </div>

            <span
              className={`ml-1 font-display font-extrabold uppercase tracking-wider text-xs leading-none ${
                isVengeanceMode ? 'text-rose-400' : 'text-cyan-400'
              }`}
            >
              DEFENSE
            </span>

            {showVersion && (
              <span
                className={`font-mono font-bold rounded border tracking-wider uppercase leading-none ${currentSize.badge} ${
                  isVengeanceMode
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}
              >
                v7.0
              </span>
            )}
          </div>

          {subtitle && (
            <span
              className={`text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5 leading-tight ${currentSize.sub}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
