import React, { useRef, useState, useCallback } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  scale?: number;
  glare?: boolean;
  depth?: number; // translateZ in px
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  id?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glare = true,
  depth = 12,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)'
  );
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const width = rect.width;
      const height = rect.height;

      // Normalized coordinates from -1 to 1
      const normalizedX = (clientX / width - 0.5) * 2;
      const normalizedY = (clientY / height - 0.5) * 2;

      // Tilt angles
      const rotateX = -normalizedY * maxTilt;
      const rotateY = normalizedX * maxTilt;

      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2
        )}deg) scale3d(${scale}, ${scale}, ${scale}) translateZ(${depth}px)`
      );

      setGlarePos({
        x: (clientX / width) * 100,
        y: (clientY / height) * 100,
        opacity: 0.18,
      });
    },
    [maxTilt, scale, depth]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)'
    );
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Interactive Glare Layer */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(6, 182, 212, 0.15) 35%, transparent 70%)`,
            mixBlendMode: 'overlay',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
