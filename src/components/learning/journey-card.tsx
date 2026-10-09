import React from 'react';
import { ArrowRight, Check, Circle, Flame } from 'lucide-react';
import { Journey } from '../../services/learning-progress';
import { ProgressRing } from './progress-ring';

interface JourneyCardProps {
  journey: Journey;
  onContinue: (tool: 'handbook' | 'conduct' | 'exam') => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({ journey, onContinue }) => (
  <section aria-labelledby="journey-title" className="bm-card bm-ds bm-rise p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <ProgressRing value={journey.percent} label="Learning journey progress" size={84}>
          <span className="text-lg">{journey.completed}/{journey.milestones.length}</span>
        </ProgressRing>
        <div>
          <p className="bm-eyebrow">Learning journey</p>
          <h2 id="journey-title" className="bm-h font-display text-xl font-semibold text-fg">
            {journey.next ? 'Next up' : 'Journey complete'}
          </h2>
          <p className="mt-0.5 text-sm text-fg-2">{journey.next ? journey.next.label : 'You have finished every milestone. Keep your streak going.'}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`bm-chip ${journey.streak > 0 ? 'bm-sev bm-sev-high' : ''}`} title="Consecutive days with learning activity">
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          {journey.streak > 0 ? `${journey.streak}-day streak` : 'Start a streak today'}
        </span>
        {journey.next && (
          <button type="button" className="bm-btn bm-btn-primary" onClick={() => onContinue(journey.next!.tool)}>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>

    <ol className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      {journey.milestones.map((milestone, index) => (
        <li key={milestone.id} className={`rounded-md border p-3 ${milestone.done ? 'border-transparent bg-safe-soft' : 'border-line bg-surface-2'}`}>
          <div className="flex items-start gap-2.5">
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${milestone.done ? 'bg-safe text-surface' : 'border border-line-strong text-fg-3'}`}>
              {milestone.done ? <Check className="h-3 w-3" aria-hidden="true" /> : <Circle className="h-2 w-2" aria-hidden="true" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-fg">
                <span className="sr-only">Step {index + 1}: </span>
                {milestone.label}
              </span>
              <span className="block text-xs text-fg-3">
                {milestone.done ? 'Done' : milestone.detail}
              </span>
            </span>
          </div>
        </li>
      ))}
    </ol>
  </section>
);
