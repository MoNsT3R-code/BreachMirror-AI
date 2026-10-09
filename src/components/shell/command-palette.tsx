import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Search } from 'lucide-react';
import { Dialog } from '../ui/dialog';

export interface PaletteCommand {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}

function score(command: PaletteCommand, tokens: string[]): number {
  const label = command.label.toLowerCase();
  const haystack = `${label} ${command.group.toLowerCase()} ${(command.keywords ?? '').toLowerCase()} ${(command.hint ?? '').toLowerCase()}`;
  let total = 0;
  for (const token of tokens) {
    if (!haystack.includes(token)) return -1;
    total += label.startsWith(token) ? 3 : label.includes(token) ? 2 : 1;
  }
  return total;
}

/** Ctrl/Cmd+K palette: navigate, open tools, jump to policy sections, run actions. */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, commands }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return commands.slice(0, 40);
    return commands
      .map(command => ({ command, value: score(command, tokens) }))
      .filter(item => item.value >= 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 40)
      .map(item => item.command);
  }, [commands, query]);

  useEffect(() => {
    setActive(current => Math.min(current, Math.max(results.length - 1, 0)));
  }, [results.length]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const execute = (command: PaletteCommand | undefined) => {
    if (!command) return;
    onClose();
    // Let the dialog release focus and the inert root before the action opens something else.
    window.setTimeout(command.run, 0);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(current => (results.length ? (current + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(current => (results.length ? (current - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(Math.max(results.length - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      execute(results[active]);
    }
  };

  let lastGroup = '';

  return (
    <Dialog open={open} onClose={onClose} title="Command palette" description="Search commands, tools and policy sections" size="md" placement="top" hideHeader initialFocusRef={inputRef}>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="h-4 w-4 shrink-0 text-fg-3" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
          aria-autocomplete="list"
          aria-label="Search commands"
          placeholder="Search commands, tools, policy sections…"
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-3 focus-visible:outline-none"
        />
        <kbd className="bm-kbd">Esc</kbd>
      </div>

      <ul id={listId} ref={listRef} role="listbox" aria-label="Results" className="max-h-[min(55vh,26rem)] overflow-y-auto p-2">
        {results.length === 0 && <li className="bm-p px-3 py-8 text-center text-sm text-fg-3" role="presentation">No matches for “{query}”.</li>}
        {results.map((command, index) => {
          const showGroup = command.group !== lastGroup;
          lastGroup = command.group;
          const selected = index === active;
          return (
            <React.Fragment key={command.id}>
              {showGroup && (
                <li role="presentation" className="bm-eyebrow px-3 pb-1 pt-3 first:pt-1">{command.group}</li>
              )}
              <li
                id={`${listId}-${command.id}`}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(index)}
                onClick={() => execute(command)}
                className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 ${selected ? 'bg-accent-soft text-fg' : 'text-fg-2'}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded ${selected ? 'text-accent-text' : 'text-fg-3'}`} aria-hidden="true">{command.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{command.label}</span>
                  {command.hint && <span className="block truncate text-xs text-fg-3">{command.hint}</span>}
                </span>
                {command.shortcut && <kbd className="bm-kbd shrink-0">{command.shortcut}</kbd>}
                {selected && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-fg-3" aria-hidden="true" />}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </Dialog>
  );
};
