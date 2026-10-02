import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ShieldAlert, 
  Zap 
} from 'lucide-react';
import { WORKPLACE_DILEMMAS } from '../../data/sample-data';
import { DilemmaChoice } from '../../shared-types';
import { StartSessionButton } from '../common/start-session-button';

export const WorkplaceScenariosWidget: React.FC = () => {
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
  const [dilemmaIndex, setDilemmaIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<DilemmaChoice | null>(null);
  const [scoreTotal, setScoreTotal] = useState<number>(100);

  const activeDilemma = WORKPLACE_DILEMMAS[dilemmaIndex] || WORKPLACE_DILEMMAS[0];

  const handleSelect = (choice: DilemmaChoice) => {
    setSelectedChoice(choice);
    setScoreTotal(prev => Math.max(0, prev + choice.scoreDelta));
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setDilemmaIndex(prev => (prev + 1) % WORKPLACE_DILEMMAS.length);
  };

  const handleReset = () => {
    setSelectedChoice(null);
  };

  const handleEndSession = () => {
    setSelectedChoice(null);
    setDilemmaIndex(0);
    setIsSessionStarted(false);
  };

  // Gatekeeper: Quiz only begins when user clicks "Start session"
  if (!isSessionStarted) {
    return (
      <div 
        id="workplace-dilemma-gatekeeper"
        className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 space-y-5 rounded-2xl bg-gradient-to-b from-slate-900/60 to-black/80 border border-white/5"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <ShieldAlert className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>

        <div className="space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span>Workplace practice scenarios</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            Choose the best next step
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Practice realistic security decisions, including deadline pressure and possible consequences.
          </p>

          <p className="text-xs text-cyan-300 font-mono font-medium pt-1">
            Select the button below to begin:
          </p>
        </div>

        <div className="pt-2">
          <StartSessionButton 
            onClick={() => setIsSessionStarted(true)} 
            label="Start practice" 
          />
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-2 border-t border-white/10 w-full max-w-xs justify-center">
          <span>Realistic Dilemmas</span>
          <span>•</span>
          <span>See what could happen</span>
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between" id="workplace-dilemma-simulator">
      {/* Top Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              {activeDilemma.urgencyLevel} priority
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {activeDilemma.policyCode}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Score:</span>
              <span className={`font-bold ${scoreTotal >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scoreTotal} XP
              </span>
            </div>
            <button
              onClick={handleEndSession}
              title="Return to gatekeeper"
              className="text-[10px] text-slate-400 hover:text-rose-300 transition-colors underline cursor-pointer"
            >
              Exit Challenge
            </button>
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white font-display leading-snug">
          {activeDilemma.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans bg-black/30 p-3 rounded-xl border border-white/5">
          {activeDilemma.scenarioText}
        </p>

        {activeDilemma.codeSnippet && (
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{activeDilemma.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* Choices Options */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
              What would you do?
        </span>

        {activeDilemma.choices.map(choice => {
          const isSelected = selectedChoice?.id === choice.id;

          let btnClass = 'bg-black/30 border-white/10 hover:border-white/30 text-slate-200';
          if (selectedChoice) {
            if (choice.isCorrect) {
              btnClass = 'bg-emerald-950/30 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500/50';
            } else if (isSelected) {
              btnClass = 'bg-rose-950/30 border-rose-500 text-rose-200 font-bold ring-1 ring-rose-500/50';
            } else {
              btnClass = 'opacity-40 border-white/5 cursor-not-allowed';
            }
          }

          return (
            <button
              key={choice.id}
              onClick={() => !selectedChoice && handleSelect(choice)}
              disabled={!!selectedChoice}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
            >
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                {choice.id}
              </span>
              <span className="leading-relaxed flex-1">{choice.text}</span>
              {selectedChoice && choice.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {selectedChoice && isSelected && !choice.isCorrect && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Digital Mirror Consequence Timeline */}
      {selectedChoice && (
        <div
          className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-300 ${
            selectedChoice.isCorrect
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedChoice.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              )}
              <span className="font-bold text-xs font-display">
                {selectedChoice.isCorrect ? 'Good choice' : 'Try a different choice'}
              </span>
            </div>
            <span
              className={`font-mono text-xs font-bold ${
                selectedChoice.scoreDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {selectedChoice.scoreDelta > 0 ? `+${selectedChoice.scoreDelta}` : selectedChoice.scoreDelta} XP
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {selectedChoice.feedback}
          </p>

          {/* Timeline */}
          <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-2 text-[11px] font-mono">
            <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[10px]">
              What could happen over time:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div>
                <strong className="text-white">Hour 0:</strong> {selectedChoice.digitalMirrorTimeline.hour0}
              </div>
              <div>
                <strong className="text-white">Day 2:</strong> {selectedChoice.digitalMirrorTimeline.day2}
              </div>
              <div>
                <strong className="text-white">Day 5:</strong> {selectedChoice.digitalMirrorTimeline.day5}
              </div>
              <div>
                <strong className="text-white">Day 10:</strong> {selectedChoice.digitalMirrorTimeline.day10}
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 text-rose-300">
              <strong className="text-amber-400 text-[10px]">Business impact:</strong>{' '}
              {selectedChoice.digitalMirrorTimeline.businessImpact}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleReset}
              className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Decision</span>
            </button>
            <button
              onClick={handleNext}
              className="py-1.5 px-4 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-cyan-400 shadow-md"
            >
              <span>Next Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
