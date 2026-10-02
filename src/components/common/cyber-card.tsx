import React from 'react';

interface CyberCardProps {
  promptText?: string;
  titleText?: React.ReactNode;
  subtitlePrefix?: string;
  highlightText?: string;
  className?: string;
  onClick?: () => void;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  promptText = 'BREACH_MIRROR',
  titleText = (
    <>
      CYBER<br />DEFENSE
    </>
  ),
  subtitlePrefix = 'BLAST RADIUS',
  highlightText = 'ZERO',
  className = '',
  onClick,
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div className="cyber-card-container noselect cursor-pointer" onClick={onClick}>
        <div className="cyber-canvas">
          <div className="tracker tr-1"></div>
          <div className="tracker tr-3"></div>
          <div className="tracker tr-5"></div>
          <div className="tracker tr-11"></div>
          <div className="tracker tr-13"></div>
          <div className="tracker tr-15"></div>
          <div className="tracker tr-21"></div>
          <div className="tracker tr-23"></div>
          <div className="tracker tr-25"></div>
          <div id="cyber-card">
            <p id="cyber-prompt">{promptText}</p>
            <div className="cyber-title">{titleText}</div>
            <div className="cyber-subtitle">
              {subtitlePrefix} <span className="cyber-highlight">{highlightText}</span>
            </div>
            <div className="cyber-glowing-elements">
              <div className="cyber-glow-1"></div>
              <div className="cyber-glow-2"></div>
              <div className="cyber-glow-3"></div>
            </div>
            <div className="cyber-corner-elements">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
