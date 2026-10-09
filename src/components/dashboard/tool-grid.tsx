import React from 'react';
import { Award, BookOpen, LifeBuoy, Radio, Scale, Sparkles } from 'lucide-react';

export type ToolId = 'radar' | 'report' | 'conduct' | 'handbook' | 'exam' | 'sandbox';

interface ToolGridProps {
  onOpen: (tool: ToolId) => void;
}

const TOOLS: Array<{ id: ToolId; label: string; description: string; hotkey: string; icon: React.ReactNode }> = [
  { id: 'handbook', label: 'Security handbook', description: 'Policy, quizzes and drills', hotkey: 'H', icon: <BookOpen className="h-5 w-5" aria-hidden="true" /> },
  { id: 'exam', label: 'Certification exam', description: '21 questions, 80% to pass', hotkey: 'Q', icon: <Award className="h-5 w-5" aria-hidden="true" /> },
  { id: 'radar', label: 'Threat radar', description: 'Explore sample breach vectors', hotkey: 'U', icon: <Radio className="h-5 w-5" aria-hidden="true" /> },
  { id: 'sandbox', label: 'Threat sandbox', description: 'Test an action for risk', hotkey: 'S', icon: <Sparkles className="h-5 w-5" aria-hidden="true" /> },
  { id: 'report', label: 'Private report', description: 'Check a mistake, no blame', hotkey: 'A', icon: <LifeBuoy className="h-5 w-5" aria-hidden="true" /> },
  { id: 'conduct', label: 'Code of conduct', description: 'Seven pillars and scenarios', hotkey: 'O', icon: <Scale className="h-5 w-5" aria-hidden="true" /> },
];

export const ToolGrid: React.FC<ToolGridProps> = ({ onOpen }) => (
  <section aria-labelledby="tools-title" className="bm-ds">
    <h2 id="tools-title" className="bm-h mb-3 font-display text-lg font-semibold text-fg">Jump back in</h2>
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {TOOLS.map((tool, index) => (
        <li key={tool.id} className="bm-rise" style={{ '--bm-i': index + 1 } as React.CSSProperties}>
          <button
            type="button"
            onClick={() => onOpen(tool.id)}
            className="bm-card bm-magnet group flex w-full items-center gap-3.5 p-3.5 text-left transition-colors hover:border-line-strong"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">{tool.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-fg">{tool.label}</span>
              <span className="block truncate text-xs text-fg-3">{tool.description}</span>
            </span>
            <kbd className="bm-kbd shrink-0" aria-label={`Shortcut ${tool.hotkey}`}>{tool.hotkey}</kbd>
          </button>
        </li>
      ))}
    </ul>
  </section>
);
