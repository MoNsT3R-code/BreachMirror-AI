import React from 'react';
import { Cloud, Cpu, FileCode, Globe, HardDrive, Lock, Mail, Terminal, Users, Wifi } from 'lucide-react';

const CHECKS: Array<{ name: string; status: string; latency: string; icon: React.ReactNode }> = [
  { name: 'GenAI endpoint ingestion guard', status: 'Active', latency: '6 ms', icon: <Cpu className="h-4 w-4" aria-hidden="true" /> },
  { name: 'Git pre-push secret scanner', status: 'Enforced', latency: '12 ms', icon: <FileCode className="h-4 w-4" aria-hidden="true" /> },
  { name: 'USB mass-storage lock', status: 'Locked', latency: '0 ms', icon: <HardDrive className="h-4 w-4" aria-hidden="true" /> },
  { name: 'Artifact registry typosquat filter', status: 'Active', latency: '18 ms', icon: <Terminal className="h-4 w-4" aria-hidden="true" /> },
  { name: 'AiTM reverse-proxy DNS resolver', status: 'Active', latency: '4 ms', icon: <Globe className="h-4 w-4" aria-hidden="true" /> },
  { name: 'Email auto-forwarding DLP', status: 'Enforced', latency: '22 ms', icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
  { name: 'Cloud bucket access guard', status: 'Active', latency: '15 ms', icon: <Cloud className="h-4 w-4" aria-hidden="true" /> },
  { name: 'Zero-trust Wi-Fi certificate guard', status: 'Healthy', latency: '1 ms', icon: <Wifi className="h-4 w-4" aria-hidden="true" /> },
  { name: 'FIDO2 push-fatigue blocker', status: 'Enforced', latency: '9 ms', icon: <Lock className="h-4 w-4" aria-hidden="true" /> },
  { name: 'Zero-blame feedback hook', status: 'Online', latency: '8 ms', icon: <Users className="h-4 w-4" aria-hidden="true" /> },
];

export const ActiveThreatsWidget: React.FC = () => (
  <div className="bm-ds space-y-3">
    <p className="flex items-center justify-between text-sm text-fg-3">
      <span>{CHECKS.length} security checks running (simulated)</span>
      <span className="bm-chip bm-sev bm-sev-safe">All passing</span>
    </p>
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
      {CHECKS.map(check => (
        <li key={check.name} className="flex items-start gap-3 rounded-md border border-line bg-surface-2 p-3">
          <span className="mt-0.5 text-accent-text">{check.icon}</span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-fg">{check.name}</span>
            <span className="mt-0.5 block font-mono text-xs text-fg-3">
              {check.status} · {check.latency}
            </span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);
