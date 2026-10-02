import React, { useState } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { ChecklistMilestone } from '../../shared-types';
import { INITIAL_CHECKLIST } from '../../data/sample-data';

export const OnboardingChecklistWidget: React.FC = () => {
  const [items, setItems] = useState<ChecklistMilestone[]>(INITIAL_CHECKLIST);

  const completedCount = items.filter(i => i.completed).length;
  const totalXP = items.filter(i => i.completed).reduce((acc, i) => acc + i.xp, 0);
  const maxXP = items.reduce((acc, i) => acc + i.xp, 0);
  const percent = Math.round((completedCount / items.length) * 100);

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between" id="new-joiner-checklist">
      {/* Top Progress Bar & Score */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">
                Onboarding Readiness
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {percent}% Completed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {completedCount} of {items.length} milestones verified · {totalXP} / {maxXP} XP
            </p>
          </div>
        </div>

        {/* Circular gauge */}
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-12 h-12 -rotate-90">
            <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray={119.4}
              strokeDashoffset={119.4 - (119.4 * percent) / 100}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute font-mono text-xs font-bold text-white">
            {percent}%
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              item.completed
                ? 'bg-emerald-950/10 border-emerald-500/30 text-slate-100'
                : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <button
                type="button"
                className="mt-0.5 shrink-0 text-emerald-400 hover:scale-110 transition-transform cursor-pointer"
                aria-label={`Toggle milestone ${item.title}`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">
                    [{item.dayTarget}]
                  </span>
                  <span
                    className={`text-xs font-bold leading-tight ${
                      item.completed ? 'text-white line-through opacity-80' : 'text-slate-200'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>

            <span className="font-mono text-[10px] text-emerald-400 font-bold shrink-0 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              +{item.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
