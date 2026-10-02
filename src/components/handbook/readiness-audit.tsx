import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  RefreshCw, 
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck
} from 'lucide-react';
import { AUDIT_CHECKLIST_ITEMS, AuditChecklistItem } from '../../data/handbook-lab-content';
import { soundManager } from '../../services/sound-effects';

interface ReadinessAuditProps {
  onAuditScoreChange?: (score: number) => void;
  onOpenCertificate?: () => void;
}

export const ReadinessAudit: React.FC<ReadinessAuditProps> = ({
  onAuditScoreChange,
  onOpenCertificate
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stewart_sentinel_audit_checks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ['chk-1', 'chk-2', 'chk-4', 'chk-8']; // default sensible initial checks
  });

  const totalScore = checkedIds.reduce((sum, id) => {
    const item = AUDIT_CHECKLIST_ITEMS.find(i => i.id === id);
    return sum + (item ? item.points : 0);
  }, 0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stewart_sentinel_audit_checks', JSON.stringify(checkedIds));
    }
    if (onAuditScoreChange) {
      onAuditScoreChange(totalScore);
    }
  }, [checkedIds, totalScore, onAuditScoreChange]);

  const handleToggle = (id: string) => {
    const isCurrentlyChecked = checkedIds.includes(id);
    const next = isCurrentlyChecked
      ? checkedIds.filter(i => i !== id)
      : [...checkedIds, id];
    
    setCheckedIds(next);
    if (!isCurrentlyChecked) {
      soundManager.playQuizSuccess();
    } else {
      soundManager.playBlip(500);
    }
  };

  const handleSelectAll = () => {
    setCheckedIds(AUDIT_CHECKLIST_ITEMS.map(i => i.id));
    soundManager.playSuccess();
  };

  const handleReset = () => {
    setCheckedIds([]);
    soundManager.playBlip(400);
  };

  const getRank = (score: number) => {
    if (score >= 90) return { title: 'Apex Sentinel Guardian', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' };
    if (score >= 70) return { title: 'Enterprise Defender (Level 2)', color: 'text-cyan-400', badge: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' };
    if (score >= 50) return { title: 'Security Sentinel (Level 1)', color: 'text-amber-400', badge: 'bg-amber-500/20 border-amber-500/40 text-amber-300' };
    return { title: 'Recruit (Remediation Needed)', color: 'text-rose-400', badge: 'bg-rose-500/20 border-rose-500/40 text-rose-300' };
  };

  const rank = getRank(totalScore);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-[0_15px_40px_rgba(16,185,129,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold uppercase tracking-wider">
                Personal Compliance Audit
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                Live Posture Score
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
              Sentinel Readiness Self-Check (10 Points)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl font-sans mt-1 leading-relaxed">
              Verify your physical workstation, MFA settings, cloud storage, and incident escalation readiness against Stewart IT Security Policy v7.0. Your score dynamically calibrates your Sentinel Certificate rank.
            </p>
          </div>

          {/* Readiness Score Badge */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-right font-mono shrink-0 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Sentinel Index</span>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-2xl font-black text-white">{totalScore}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${rank.badge}`}>
                {rank.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Bulk Actions */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Posture Progress ({checkedIds.length} / 10 Items):</span>
            <span className="text-cyan-400 font-bold">{totalScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${totalScore}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Check All
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset
          </button>
          {onOpenCertificate && (
            <button
              onClick={onOpenCertificate}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Update Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* 10 Audit Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {AUDIT_CHECKLIST_ITEMS.map((item, idx) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isChecked
                  ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/20'
              }`}
            >
              {/* Custom Checkbox */}
              <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                isChecked
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : 'border-slate-600 bg-slate-950'
              }`}>
                {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Text content */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">
                    {idx + 1}. {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                    +{item.points} pts
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>{item.policyReference}</span>
                  <span className="text-cyan-400">{item.category}</span>
                </div>

                {!isChecked && (
                  <div className="text-[10px] text-amber-400/90 font-sans pt-0.5 italic">
                    Action: {item.remediationAction}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
