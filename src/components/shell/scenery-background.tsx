import React from 'react';

/** Optional decorative sky (light theme, opt-in via the user menu). Static when motion is reduced. */
export const SceneryBackground: React.FC = () => {
  const cloud = (top: string, scale: number, duration: number, delay: number, opacity: number) => (
    <svg
      className="bm-cloud absolute"
      style={{ top, width: 220 * scale, animationDuration: `${duration}s`, animationDelay: `${delay}s`, opacity }}
      viewBox="0 0 220 90"
      fill="#ffffff"
    >
      <ellipse cx="60" cy="62" rx="52" ry="24" />
      <ellipse cx="105" cy="42" rx="46" ry="34" />
      <ellipse cx="150" cy="58" rx="56" ry="28" />
      <ellipse cx="100" cy="68" rx="90" ry="20" />
    </svg>
  );
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #cfe6f8 0%, #e6f2fb 55%, #eef6e8 100%)' }}
      aria-hidden="true"
    >
      {cloud('8%', 1.3, 140, -30, 0.9)}
      {cloud('24%', 0.9, 190, -110, 0.8)}
      {cloud('42%', 1.1, 230, -60, 0.7)}
      <svg className="absolute bottom-0 left-0 h-[20vh] min-h-[120px] w-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path d="M0 120 C160 60 320 70 480 110 C640 150 780 60 960 80 C1120 100 1280 150 1440 90 L1440 220 L0 220 Z" fill="#b5dd9c" />
        <path d="M0 160 C200 110 360 140 560 160 C760 180 900 120 1100 140 C1260 156 1360 130 1440 140 L1440 220 L0 220 Z" fill="#8ccb70" />
      </svg>
    </div>
  );
};
