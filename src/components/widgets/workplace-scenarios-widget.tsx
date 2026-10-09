import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw, ShieldAlert, X } from 'lucide-react';
import { WORKPLACE_DILEMMAS } from '../../data/sample-data';
import { DilemmaChoice } from '../../shared-types';
import { recordActivity } from '../../services/learning-progress';

const URGENCY_CLASS: Record<string, string> = { CRITICAL: 'bm-sev-crit', HIGH: 'bm-sev-high', MEDIUM: 'bm-sev-med' };

export const WorkplaceScenariosWidget: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<DilemmaChoice | null>(null);
  const [score, setScore] = useState(100);

  const dilemma = WORKPLACE_DILEMMAS[index] ?? WORKPLACE_DILEMMAS[0];

  const pick = (selected: DilemmaChoice) => {
    if (choice) return;
    setChoice(selected);
    setScore(current => Math.max(0, current + selected.scoreDelta));
    recordActivity();
  };

  const exit = () => {
    setChoice(null);
    setIndex(0);
    setScore(100);
    setStarted(false);
  };

  if (!started) {
    return (
      <div id="workplace-dilemma-gatekeeper" className="bm-ds mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-accent-soft text-accent-text">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </span>
        <h4 className="bm-h font-display text-xl font-semibold text-fg">Choose the best next step</h4>
        <p className="bm-p text-sm text-fg-3">Practice realistic security decisions under deadline pressure, then see what could happen over the next ten days.</p>
        <button type="button" className="bm-btn bm-btn-primary" onClick={() => setStarted(true)}>
          Start practice <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="font-mono text-xs text-fg-3">{WORKPLACE_DILEMMAS.length} scenarios · consequences shown</p>
      </div>
    );
  }

  const timeline = choice
    ? [
        ['Hour 0', choice.digitalMirrorTimeline.hour0],
        ['Day 2', choice.digitalMirrorTimeline.day2],
        ['Day 5', choice.digitalMirrorTimeline.day5],
        ['Day 10', choice.digitalMirrorTimeline.day10],
      ]
    : [];

  return (
    <div className="bm-ds space-y-4" id="workplace-dilemma-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bm-chip">Scenario {index + 1} of {WORKPLACE_DILEMMAS.length}</span>
          <span className={`bm-chip bm-sev ${URGENCY_CLASS[dilemma.urgencyLevel] ?? 'bm-sev-med'}`}>{dilemma.urgencyLevel.charAt(0) + dilemma.urgencyLevel.slice(1).toLowerCase()} priority</span>
          <span className="font-mono text-xs text-fg-3">{dilemma.policyCode}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-mono text-fg-2">Score <strong className="text-fg">{score}</strong></span>
          <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={exit}>Exit</button>
        </div>
      </div>

      <h4 className="bm-h font-display text-lg font-semibold text-fg">{dilemma.title}</h4>
      <p className="rounded-md bg-surface-2 p-3 text-sm text-fg-2">{dilemma.scenarioText}</p>
      {dilemma.codeSnippet && (
        <pre className="overflow-x-auto rounded-md border border-line bg-sunken p-3 font-mono text-xs text-fg" tabIndex={0}>{dilemma.codeSnippet}</pre>
      )}

      <div role="radiogroup" aria-label="What do you do?" className="space-y-2">
        {dilemma.choices.map(option => {
          const chosen = choice?.id === option.id;
          const tone = !chosen ? 'border-line bg-surface hover:border-line-strong' : option.isCorrect ? 'border-transparent bg-safe-soft' : 'border-transparent bg-crit-soft';
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={chosen}
              disabled={choice !== null}
              onClick={() => pick(option)}
              className={`flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm text-fg ${tone} ${choice && !chosen ? 'opacity-60' : ''}`}
            >
              {chosen && (
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${option.isCorrect ? 'bg-safe text-surface' : 'bg-crit text-surface'}`}>
                  {option.isCorrect ? <Check className="h-3 w-3" aria-hidden="true" /> : <X className="h-3 w-3" aria-hidden="true" />}
                </span>
              )}
              <span className="flex-1">{option.text}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {choice && (
          <section className="bm-pop space-y-3 rounded-lg border border-line bg-surface-2 p-4" aria-label="Outcome">
            <p className={`text-sm font-semibold ${choice.isCorrect ? 'text-safe' : 'text-crit'}`}>
              {choice.isCorrect ? 'Good call' : 'That could go badly'} <span className="font-mono text-xs text-fg-3">({choice.scoreDelta > 0 ? '+' : ''}{choice.scoreDelta})</span>
            </p>
            <p className="text-sm text-fg-2">{choice.feedback}</p>
            <ol className="space-y-2 border-l-2 border-line pl-4">
              {timeline.map(([label, text]) => (
                <li key={label} className="text-sm text-fg-2">
                  <span className="font-mono text-xs font-semibold text-fg">{label}</span>
                  <span className="block">{text}</span>
                </li>
              ))}
            </ol>
            <p className="rounded-md bg-surface p-3 text-sm text-fg-2"><span className="font-semibold text-fg">Business impact:</span> {choice.digitalMirrorTimeline.businessImpact}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="bm-btn bm-btn-sm" onClick={() => setChoice(null)}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
              </button>
              <button
                type="button"
                className="bm-btn bm-btn-sm bm-btn-primary"
                onClick={() => {
                  setChoice(null);
                  setIndex(value => (value + 1) % WORKPLACE_DILEMMAS.length);
                }}
              >
                Next scenario <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
