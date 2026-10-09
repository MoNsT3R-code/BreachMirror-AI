import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { INITIAL_CHECKLIST } from '../../data/sample-data';
import { recordActivity } from '../../services/learning-progress';
import { ProgressRing } from '../learning/progress-ring';

const STORAGE_KEY = 'bm_onboarding_checklist';

function loadDone(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as string[];
  } catch {
    // fall through to defaults
  }
  return INITIAL_CHECKLIST.filter(item => item.completed).map(item => item.id);
}

export const OnboardingChecklistWidget: React.FC = () => {
  const [done, setDone] = useState<string[]>(loadDone);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // ignore
    }
  }, [done]);

  const completed = INITIAL_CHECKLIST.filter(item => done.includes(item.id));
  const xp = completed.reduce((sum, item) => sum + item.xp, 0);
  const maxXp = INITIAL_CHECKLIST.reduce((sum, item) => sum + item.xp, 0);
  const percent = Math.round((completed.length / INITIAL_CHECKLIST.length) * 100);

  const toggle = (id: string) => {
    setDone(current => (current.includes(id) ? current.filter(item => item !== id) : [...current, id]));
    if (!done.includes(id)) recordActivity();
  };

  return (
    <div className="bm-ds space-y-4" id="new-joiner-checklist">
      <div className="flex items-center gap-4 rounded-lg border border-line bg-surface-2 p-4">
        <ProgressRing value={percent} label="Onboarding progress" size={64} stroke={6} tone={percent === 100 ? 'safe' : 'accent'} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fg">
            {completed.length} of {INITIAL_CHECKLIST.length} milestones verified
          </p>
          <p className="font-mono text-xs text-fg-3">
            {xp} / {maxXp} XP
          </p>
        </div>
      </div>

      <ul className="max-h-80 space-y-2 overflow-y-auto pr-1" tabIndex={0} aria-label="Onboarding milestones">
        {INITIAL_CHECKLIST.map(item => {
          const on = done.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(item.id)}
                className={`flex w-full items-start gap-3 rounded-md border p-3 text-left ${on ? 'border-transparent bg-safe-soft' : 'border-line bg-surface hover:border-line-strong'}`}
              >
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${on ? 'border-safe bg-safe text-surface' : 'border-line-strong bg-surface'}`}>
                  {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-semibold text-fg ${on ? 'line-through decoration-fg-3' : ''}`}>
                      <span className="font-mono text-xs text-fg-3">{item.dayTarget} </span>
                      {item.title}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-fg-3">+{item.xp} XP</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-fg-3">{item.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
