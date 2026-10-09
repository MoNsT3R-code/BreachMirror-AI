import React, { useEffect, useState } from 'react';

/** First file that exists wins. Drop a photo in public/images/xyz/ as background.jpg. */
const CANDIDATES = ['/images/xyz/background.jpg', '/images/xyz/background.webp', '/images/xyz/hero-building.jpg'];

/**
 * Full-screen XYZ photo behind the sign-in and home pages. A veil of the
 * page colour sits on top, so text contrast holds over any photo (tested in
 * tests/design-tokens.test.ts). Renders nothing until a photo exists, and the
 * ambient glass backdrop shows instead. Place it inside a stacking context.
 */
export const XYZBackdrop: React.FC = () => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tryLoad = (index: number) => {
      if (index >= CANDIDATES.length) return;
      const image = new Image();
      image.onload = () => {
        if (!cancelled) setSrc(CANDIDATES[index]);
      };
      image.onerror = () => tryLoad(index + 1);
      image.src = CANDIDATES[index];
    };
    tryLoad(0);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!src) return null;
  return (
    <div aria-hidden="true" className="bm-photo pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: `url(${src})`, filter: 'saturate(0.9)' }} />
      <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--bm-bg) var(--bm-photo-veil), transparent)' }} />
    </div>
  );
};
