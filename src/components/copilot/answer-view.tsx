import React from 'react';
import { PolicySource } from '../../services/local-api';

interface AnswerViewProps {
  text: string;
  sources: PolicySource[];
  activeSource?: string | null;
  onCite?: (id: string) => void;
  streaming?: boolean;
}

/** Renders an answer with bullets and inline [S1] citations that link to the evidence. */
export const AnswerView: React.FC<AnswerViewProps> = ({ text, sources, activeSource, onCite, streaming = false }) => {
  const lines = text.split('\n');
  const blocks: Array<{ type: 'p' | 'ul'; items: string[] }> = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = /^[-*•]\s+/.test(line);
    const content = line.replace(/^[-*•]\s+/, '');
    const previous = blocks[blocks.length - 1];
    if (bullet && previous?.type === 'ul') previous.items.push(content);
    else blocks.push({ type: bullet ? 'ul' : 'p', items: [content] });
  }

  const inline = (value: string, key: string) =>
    value.split(/(\[S\d+\])/g).map((part, index) => {
      const match = part.match(/^\[S(\d+)\]$/);
      if (!match) return <React.Fragment key={`${key}-${index}`}>{part.replace(/\*\*(.+?)\*\*/g, '$1')}</React.Fragment>;
      const id = `S${match[1]}`;
      const source = sources.find(item => item.id === id);
      return (
        <button
          key={`${key}-${index}`}
          type="button"
          onClick={() => onCite?.(id)}
          aria-label={source ? `Source ${match[1]}: ${source.label}` : `Source ${match[1]}`}
          title={source?.label}
          className={`mx-0.5 inline-flex h-5 min-w-5 -translate-y-px items-center justify-center rounded px-1 align-middle font-mono text-[0.7rem] font-semibold ${activeSource === id ? 'bg-accent text-accent-fg' : 'bg-accent-soft text-accent-text hover:bg-accent hover:text-accent-fg'}`}
        >
          {match[1]}
        </button>
      );
    });

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-fg">
      {blocks.map((block, index) =>
        block.type === 'ul' ? (
          <ul key={index} className="list-disc space-y-1.5 pl-5 marker:text-fg-3">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{inline(item, `${index}-${itemIndex}`)}</li>
            ))}
          </ul>
        ) : (
          <p key={index}>{inline(block.items[0], `${index}`)}</p>
        ),
      )}
      {streaming && <span className="inline-block h-4 w-0.5 translate-y-0.5 bg-fg motion-safe:animate-pulse" aria-hidden="true" />}
    </div>
  );
};

const STOP = new Set(['what', 'when', 'where', 'which', 'should', 'could', 'would', 'about', 'there', 'their', 'this', 'that', 'with', 'from', 'have', 'does', 'into', 'your', 'policy']);

export function highlightTerms(question: string): string[] {
  return [...new Set((question.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(word => word.length >= 4 && !STOP.has(word)))].slice(0, 8);
}

export const Highlighted: React.FC<{ text: string; terms: string[] }> = ({ text, terms }) => {
  if (terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return (
    <>
      {text.split(pattern).map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="rounded bg-med-soft px-0.5 text-fg">
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};
