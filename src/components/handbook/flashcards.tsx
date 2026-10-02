import React, { useState } from 'react';
import { 
  Zap, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  RefreshCw,
  HelpCircle,
  Bookmark
} from 'lucide-react';
import { FLASHCARD_DRILLS, FlashcardItem } from '../../data/handbook-lab-content';
import { soundManager } from '../../services/sound-effects';

export const Flashcards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);

  const card: FlashcardItem = FLASHCARD_DRILLS[currentIndex];
  const isMastered = masteredIds.includes(card.id);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    soundManager.playBlip(isFlipped ? 550 : 850);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARD_DRILLS.length);
    soundManager.playBlip(700);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARD_DRILLS.length) % FLASHCARD_DRILLS.length);
    soundManager.playBlip(600);
  };

  const handleToggleMastered = () => {
    if (isMastered) {
      setMasteredIds(masteredIds.filter(id => id !== card.id));
    } else {
      setMasteredIds([...masteredIds, card.id]);
      setStreak(streak + 1);
      soundManager.playQuizSuccess();
    }
  };

  const handleResetDrills = () => {
    setMasteredIds([]);
    setStreak(0);
    setCurrentIndex(0);
    setIsFlipped(false);
    soundManager.playTargetLock();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-[0_15px_40px_rgba(245,158,11,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider">
                Micro-Learning Flashcards
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                Rapid Reflex Drill
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
              Sentinel Speed Drills: Policy Memory Cards
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl font-sans mt-1 leading-relaxed">
              Master the exact figures, golden hours, encryption mandates, and reporting SLAs. Click or tap any card to reveal Stewart’s official rule and pro tips.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Mastered</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {masteredIds.length} / {FLASHCARD_DRILLS.length} Cards
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Arena */}
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* Progress & Category Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 font-bold">
              Card {currentIndex + 1} of {FLASHCARD_DRILLS.length}
            </span>
            <span className="text-cyan-400 font-bold">{card.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">🔥 Streak: {streak}</span>
            <button
              onClick={handleResetDrills}
              title="Reset drill progress"
              className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Flip Card Container */}
        <div 
          onClick={handleFlip}
          className="relative h-72 sm:h-80 w-full rounded-3xl cursor-pointer perspective-1000 transition-all select-none group"
        >
          <div className={`relative w-full h-full rounded-3xl border transition-all duration-300 transform-style-3d p-6 sm:p-8 flex flex-col justify-between ${
            isFlipped 
              ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.2)]'
              : 'bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 border-white/10 hover:border-cyan-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
          }`}>
            
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-bold uppercase">
                {isFlipped ? 'Official Policy Answer' : 'Question Prompt'}
              </span>

              <div className="flex items-center gap-2">
                {isMastered && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mastered</span>
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Click to flip</span>
                </span>
              </div>
            </div>

            {/* Middle Card Content */}
            <div className="py-2 text-center my-auto space-y-3">
              {!isFlipped ? (
                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-bold font-display text-white leading-relaxed">
                    {card.frontQuestion}
                  </h4>
                  <span className="text-xs text-slate-400 font-sans block">
                    Think of the exact Stewart rule or SLA window before flipping...
                  </span>
                </div>
              ) : (
                <div className="space-y-3 animate-in zoom-in-95 duration-150">
                  <h4 className="text-base sm:text-lg font-bold font-display text-amber-300 leading-relaxed">
                    {card.backAnswer}
                  </h4>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 font-sans leading-relaxed text-left">
                    <strong className="text-amber-400 font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                      Operational Tip &amp; Rule Citation:
                    </strong>
                    <p>{card.mnemonicOrTip}</p>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                      Ref: {card.ruleCitation}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              <span>Stewart IT Security v7.0</span>
              <span className="text-cyan-400 font-bold">Space / Click to Flip</span>
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleToggleMastered}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isMastered
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isMastered ? 'Marked as Mastered' : 'Mark as Mastered (+1 Streak)'}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
