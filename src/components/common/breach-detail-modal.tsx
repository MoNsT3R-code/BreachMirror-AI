import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  BrainCircuit, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { ThreatEvent } from '../../shared-types';
import { generateTeachableMomentApi, TeachableMomentResult } from '../../services/local-api';

interface BreachDetailModalProps {
  event: ThreatEvent | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

export const BreachDetailModal: React.FC<BreachDetailModalProps> = ({
  event,
  onClose,
  onAcknowledge,
}) => {
  const [aiMoment, setAiMoment] = useState<TeachableMomentResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiSource, setAiSource] = useState<string>('');

  if (!event) return null;

  const handleGenerateAiMoment = async () => {
    setIsLoadingAi(true);
    try {
      const res = await generateTeachableMomentApi(event);
      if (res && res.data) {
        setAiMoment(res.data);
        setAiSource(res.source);
      }
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breach-modal-title"
    >
      <div className="w-full max-w-2xl rounded-2xl vengeance-glass border border-white/10 bg-slate-950/90 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="breach-modal-title" className="text-base font-bold text-white font-display">
                  Event details and coaching
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  {event.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {event.sourceEndpoint} · {event.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close event details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-200">
          {/* Action Detected Callout */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-mono text-slate-400 font-bold">
              <span>Detected Action</span>
              <span className="text-emerald-400 font-bold">Status: {event.status}</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{event.actionDetected}"
            </p>
          </div>

          {/* User Cohort & Violated Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Who was affected
              </span>
              <span className="text-xs font-bold text-cyan-400">
                {event.userCohort}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Policy rule involved
              </span>
              <span className="text-xs font-bold text-rose-300">
                {event.ruleViolated}
              </span>
            </div>
          </div>

          {/* AI Teachable Moment Generator Trigger */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
                  BreachMirror AI learning tip
                </span>
              </div>

              {!aiMoment && (
                <button
                  onClick={handleGenerateAiMoment}
                  disabled={isLoadingAi}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Preparing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Show learning tip</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {aiMoment ? (
              <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1 flex items-center justify-between">
                    <span>Main lesson</span>
                    <span className="text-slate-400">{aiSource}</span>
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {aiMoment.headline}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      Why this happened
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {aiMoment.rootCauseAnalysis}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                        Possible impact
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                        Score: {aiMoment.blastRadiusScore}/100
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {aiMoment.blastRadiusSummary}
                    </p>
                  </div>
                </div>

                {/* Immediate Safe Actions */}
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Helpful next steps
                  </span>
                  <ul className="space-y-1 text-[11px] text-emerald-200">
                    {aiMoment.immediateActions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-mono font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Zero Blame Coaching Note */}
                <div className="p-3 rounded-lg bg-slate-900/70 border border-purple-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                    Supportive guidance
                  </span>
                  <p className="text-slate-300 text-[11px] italic">
                    "{aiMoment.zeroBlameGuidance}"
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Approved Tool: <strong className="text-cyan-400">{aiMoment.recommendedSanctionedTool}</strong></span>
                    <span>{aiMoment.complianceImpact}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Select the button above for a short explanation, likely cause, and practical next steps.
              </p>
            )}
          </div>

          {/* Root Cause Analysis */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Background and likely cause
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {event.rootCause}
            </p>
          </div>

          {/* Blast Radius */}
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase font-bold">
              <Zap className="w-3.5 h-3.5" />
              Possible impact if this is not stopped
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {event.blastRadius}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            BreachMirror AI Active · Zero Disciplinary Friction
          </span>

          <button
            onClick={() => {
              onAcknowledge(event.id);
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors shadow-md cursor-pointer"
          >
            Acknowledge &amp; Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
