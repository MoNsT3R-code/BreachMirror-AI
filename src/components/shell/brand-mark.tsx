import React from 'react';

interface BrandMarkProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * BreachMirror mark: a shield split on a vertical axis. The left half is the
 * threat (outline), the right half is you (solid), mirrored about the axis.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ size = 28, withWordmark = true, className = '' }) => (
  <span className={`bm-ds inline-flex items-center gap-2.5 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="BreachMirror" className="shrink-0">
      <path d="M16 3 L5 7 V15 C5 21.5 9.6 26.6 16 29 Z" fill="none" stroke="var(--bm-fg-3)" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="2.6 2.2" />
      <path d="M16 3 L27 7 V15 C27 21.5 22.4 26.6 16 29 Z" fill="var(--bm-accent)" />
      <path d="M16 3 V29" stroke="var(--bm-bg)" strokeWidth="1.2" />
    </svg>
    {withWordmark && (
      <span className="whitespace-nowrap font-display text-[1.0625rem] font-semibold leading-none tracking-tight text-fg">
        BreachMirror<span className="font-medium text-fg-3"> AI</span>
      </span>
    )}
  </span>
);
