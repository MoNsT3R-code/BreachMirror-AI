import React, { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Flame, RefreshCw, RotateCw } from 'lucide-react';
import { FLASHCARD_DRILLS } from '../../data/handbook-lab-content';
import { loadMasteredCards, recordActivity, saveMasteredCards } from '../../services/learning-progress';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { ProgressRing } from '../learning/progress-ring';

export const Flashcards: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<string[]>(loadMasteredCards);
  const [run, setRun] = useState(0);
  const { soundEnabled } = useAlerts();

  const card = FLASHCARD_DRILLS[index];
  const isMastered = mastered.includes(card.id);
  const total = FLASHCARD_DRILLS.length;

  useEffect(() => saveMasteredCards(mastered), [mastered]);

  const go = (step: number) => {
    setFlipped(false);
    setIndex(current => (current + step + total) % total);
  };

  const toggleMastered = () => {
    if (isMastered) {
      setMastered(mastered.filter(id => id !== card.id));
      setRun(0);
      return;
    }
    setMastered([...mastered, card.id]);
    setRun(value => value + 1);
    recordActivity();
    if (soundEnabled) soundManager.playQuizSuccess();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(1);
    else if (event.key === 'ArrowLeft') go(-1);
  };

  return (
    <div className="bm-ds mx-auto max-w-2xl space-y-5" onKeyDown={onKeyDown}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProgressRing value={(mastered.length / total) * 100} label="Cards mastered" size={72} stroke={7} tone={mastered.length === total ? 'safe' : 'accent'}>
            <span className="text-base">
              {mastered.length}/{total}
            </span>
          </ProgressRing>
          <div>
            <h3 className="bm-h font-display text-xl font-semibold text-fg">Speed drills</h3>
            <p className="text-sm text-fg-3">Recall the rule, then flip the card to check.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`bm-chip ${run > 0 ? 'bm-sev bm-sev-high' : ''}`}>
            <Flame className="h-3.5 w-3.5" aria-hidden="true" /> Run: {run}
          </span>
          <button
            type="button"
            className="bm-btn bm-btn-sm"
            onClick={() => {
              setMastered([]);
              setRun(0);
              setIndex(0);
              setFlipped(false);
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </button>
        </div>
      </div>

      <p className="flex items-center justify-between text-xs text-fg-3">
        <span>
          Card {index + 1} of {total} · {card.category}
        </span>
        <span>Arrow keys move between cards</span>
      </p>

      <button
        type="button"
        onClick={() => setFlipped(value => !value)}
        aria-pressed={flipped}
        aria-label={flipped ? 'Showing the official answer. Select to show the question.' : 'Showing the question. Select to reveal the answer.'}
        className={`flex min-h-72 w-full flex-col justify-between rounded-xl border p-6 text-left sm:p-8 ${flipped ? 'border-accent bg-accent-soft' : 'border-line bg-surface shadow-raised hover:border-line-strong'}`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="bm-chip">{flipped ? 'Official answer' : 'Question'}</span>
          <span className="flex items-center gap-2 text-xs text-fg-3">
            {isMastered && (
              <span className="bm-chip bm-sev bm-sev-safe">
                <Check className="h-3 w-3" aria-hidden="true" /> Mastered
              </span>
            )}
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" /> Flip
          </span>
        </span>
        <span className="my-6 block space-y-3">
          {flipped ? (
            <>
              <span className="bm-h block font-display text-xl font-semibold text-fg">{card.backAnswer}</span>
              <span className="block rounded-md bg-surface/70 p-3 text-sm text-fg-2">
                <span className="bm-eyebrow mb-1 block">Tip</span>
                {card.mnemonicOrTip}
                <span className="mt-1 block font-mono text-xs text-fg-3">Ref: {card.ruleCitation}</span>
              </span>
            </>
          ) : (
            <span className="bm-h block font-display text-2xl font-semibold leading-snug text-fg">{card.frontQuestion}</span>
          )}
        </span>
        <span className="text-xs text-fg-3">XYZ IT Security Policy v7.0</span>
      </button>

      <div className="flex items-center justify-between gap-3">
        <button type="button" className="bm-btn" onClick={() => go(-1)}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
        </button>
        <button type="button" className={`bm-btn ${isMastered ? '' : 'bm-btn-primary'}`} aria-pressed={isMastered} onClick={toggleMastered}>
          <Check className="h-4 w-4" aria-hidden="true" /> {isMastered ? 'Mastered' : 'Mark as mastered'}
        </button>
        <button type="button" className="bm-btn" onClick={() => go(1)}>
          Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
