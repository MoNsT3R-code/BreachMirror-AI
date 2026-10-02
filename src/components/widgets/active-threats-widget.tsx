import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  HardDrive, 
  Lock, 
  Mail, 
  Cloud, 
  Eye, 
  Wifi, 
  Globe, 
  FileCode, 
  Users 
} from 'lucide-react';

export const ActiveThreatsWidget: React.FC = () => {
  const vectors = [
    { name: 'GenAI Endpoint Ingestion Guard', status: 'ACTIVE', latency: '6ms', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
    { name: 'Git Commit Pre-Push Hook (Secrets)', status: 'ENFORCED', latency: '12ms', icon: <FileCode className="w-3.5 h-3.5 text-rose-400" /> },
    { name: 'USB Mass Storage Kernel Lock', status: 'LOCKED', latency: '0ms', icon: <HardDrive className="w-3.5 h-3.5 text-amber-400" /> },
    { name: 'Artifact Registry Typosquat Filter', status: 'ACTIVE', latency: '18ms', icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" /> },
    { name: 'AiTM Reverse Proxy DNS Resolver', status: 'ACTIVE', latency: '4ms', icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> },
    { name: 'Corporate Email Auto-Forwarding DLP', status: 'ENFORCED', latency: '22ms', icon: <Mail className="w-3.5 h-3.5 text-purple-400" /> },
    { name: 'S3 & Cloud Bucket Access Guard', status: 'ACTIVE', latency: '15ms', icon: <Cloud className="w-3.5 h-3.5 text-cyan-400" /> },
    { name: 'Zero-Trust Wi-Fi Certificate Guard', status: 'HEALTHY', latency: '1ms', icon: <Wifi className="w-3.5 h-3.5 text-teal-400" /> },
    { name: 'FIDO2 WebAuthn Push Fatigue Blocker', status: 'ENFORCED', latency: '9ms', icon: <Lock className="w-3.5 h-3.5 text-emerald-400" /> },
    { name: 'Zero-Blame Feedback Telemetry Hook', status: 'ONLINE', latency: '8ms', icon: <Users className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Security checks running</span>
        <span className="font-mono text-emerald-400 font-bold">All checks passing</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {vectors.map((v, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-white/5 shrink-0">
                {v.icon}
              </div>
              <span className="text-xs font-semibold text-slate-200 truncate">
                {v.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {v.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
