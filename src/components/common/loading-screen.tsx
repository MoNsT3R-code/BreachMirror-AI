import React, { useState } from 'react';

interface LoadingScreenProps {
  label?: string;
  size?: number;
  className?: string;
  showSampleData?: boolean;
}

interface SampleBreachPoint {
  id: string;
  dotId: string;
  chapter: number;
  name: string;
  severity: 'CRITICAL' | 'HIGH';
  cveOrType: string;
  vector: string;
}

const SAMPLE_BREACH_POINTS: SampleBreachPoint[] = [
  {
    id: 'sb-1',
    dotId: 'dot-1',
    chapter: 1,
    name: 'Prompt Ingestion & PII Leak',
    severity: 'CRITICAL',
    cveOrType: 'CWE-200 / PII Leak',
    vector: 'Raw SQL dumped into public LLM',
  },
  {
    id: 'sb-2',
    dotId: 'dot-2',
    chapter: 2,
    name: 'Hardcoded Secrets in Git',
    severity: 'CRITICAL',
    cveOrType: 'CWE-798 / Secret Exposure',
    vector: 'Stripe API key committed to public repo',
  },
  {
    id: 'sb-3',
    dotId: 'dot-3',
    chapter: 3,
    name: 'AiTM Phishing & MFA Fatigue',
    severity: 'CRITICAL',
    cveOrType: 'MITRE T1566 / AiTM Phishing',
    vector: 'Reverse-proxy hijacked Okta session cookies',
  },
  {
    id: 'sb-4',
    dotId: 'dot-4',
    chapter: 4,
    name: 'Unrestricted Public Cloud Share',
    severity: 'HIGH',
    cveOrType: 'CWE-732 / Misconfiguration',
    vector: 'Google Drive roadmap opened to public link',
  },
  {
    id: 'sb-5',
    dotId: 'dot-5',
    chapter: 5,
    name: 'Malicious NPM Dependency',
    severity: 'CRITICAL',
    cveOrType: 'MITRE T1195.001 / Supply Chain',
    vector: 'Typosquatted package exfiltrating env keys',
  },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  label = 'Handbook Tactical Radar Sweep',
  size = 1,
  className = '',
  showSampleData = true,
}) => {
  const [activeSample, setActiveSample] = useState<SampleBreachPoint>(SAMPLE_BREACH_POINTS[0]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 gap-4 select-none ${className}`}>
      {/* Radar Scanner Container with User's Exact HTML/CSS Specification */}
      <div 
        className="relative flex items-center justify-center"
        style={{ transform: size !== 1 ? `scale(${size})` : undefined }}
      >
        <div className="loader">
          <span />

          <div 
            id="dot-1" 
            className="dot" 
            title="Sample Breach #1: Prompt Ingestion & PII Leak"
            onClick={() => setActiveSample(SAMPLE_BREACH_POINTS[0])}
          />
          <div 
            id="dot-2" 
            className="dot" 
            title="Sample Breach #2: Hardcoded Secrets in Git"
            onClick={() => setActiveSample(SAMPLE_BREACH_POINTS[1])}
          />
          <div 
            id="dot-3" 
            className="dot" 
            title="Sample Breach #3: AiTM Phishing & MFA Fatigue"
            onClick={() => setActiveSample(SAMPLE_BREACH_POINTS[2])}
          />
          <div 
            id="dot-4" 
            className="dot" 
            title="Sample Breach #4: Unrestricted Public Cloud Share"
            onClick={() => setActiveSample(SAMPLE_BREACH_POINTS[3])}
          />
          <div 
            id="dot-5" 
            className="dot" 
            title="Sample Breach #5: Malicious Dependency Squatting"
            onClick={() => setActiveSample(SAMPLE_BREACH_POINTS[4])}
          />
        </div>
      </div>

      {label && (
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 animate-pulse text-center">
          {label}
        </p>
      )}

      {/* Embedded Sample Data Display */}
      {showSampleData && activeSample && (
        <div className="w-full max-w-sm px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-left font-mono shadow-lg">
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mb-1">
            <span className="text-emerald-400 font-bold">SAMPLE BREACH #{activeSample.chapter}</span>
            <span className={activeSample.severity === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
              {activeSample.severity}
            </span>
          </div>
          <p className="text-xs font-bold text-white tracking-wide truncate">
            {activeSample.name}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-cyan-400 truncate">{activeSample.cveOrType}</span>
            <span className="text-slate-500 truncate max-w-[140px]">{activeSample.vector}</span>
          </div>
        </div>
      )}
    </div>
  );
};
