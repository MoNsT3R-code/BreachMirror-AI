import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Eye, Info } from 'lucide-react';
import { ThreatSeverity } from '../../shared-types';

export type SeverityKey = 'crit' | 'high' | 'med' | 'low' | 'safe';

const META: Record<ThreatSeverity | 'RESOLVED', { key: SeverityKey; label: string; icon: React.ReactNode }> = {
  CRITICAL: { key: 'crit', label: 'Critical', icon: <AlertOctagon className="h-3.5 w-3.5" aria-hidden="true" /> },
  HIGH: { key: 'high', label: 'High', icon: <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> },
  ELEVATED: { key: 'med', label: 'Elevated', icon: <Info className="h-3.5 w-3.5" aria-hidden="true" /> },
  MONITORED: { key: 'low', label: 'Monitored', icon: <Eye className="h-3.5 w-3.5" aria-hidden="true" /> },
  RESOLVED: { key: 'safe', label: 'Resolved', icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> },
};

export function severityMeta(severity: ThreatSeverity | 'RESOLVED') {
  return META[severity];
}

/** Severity is always icon + label + tint, never colour alone. */
export const SeverityBadge: React.FC<{ severity: ThreatSeverity | 'RESOLVED'; className?: string }> = ({ severity, className = '' }) => {
  const meta = META[severity];
  return (
    <span className={`bm-chip bm-sev bm-sev-${meta.key} ${className}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
};
