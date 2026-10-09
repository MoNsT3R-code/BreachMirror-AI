import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Check, RotateCcw } from 'lucide-react';
import { WidgetConfig } from '../../shared-types';
import { Dialog } from '../ui/dialog';
import { Switch } from '../ui/switch';

interface WidgetCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onUpdateWidgets: (updated: WidgetConfig[]) => void;
  onResetDefaults: () => void;
}

export const WidgetCustomizerModal: React.FC<WidgetCustomizerModalProps> = ({ isOpen, onClose, widgets, onUpdateWidgets, onResetDefaults }) => {
  const [local, setLocal] = useState<WidgetConfig[]>(widgets);

  useEffect(() => {
    if (isOpen) setLocal(widgets);
  }, [isOpen, widgets]);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= local.length) return;
    const next = [...local];
    [next[index], next[target]] = [next[target], next[index]];
    setLocal(next.map((widget, position) => ({ ...widget, order: position + 1 })));
  };

  const toggle = (id: string, visible: boolean) => setLocal(local.map(widget => (widget.id === id ? { ...widget, visible } : widget)));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Customize layout"
      description="Choose which widgets appear and in what order. You can also drag cards by their handle on the dashboard."
      size="md"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="bm-btn bm-btn-ghost"
            onClick={() => {
              onResetDefaults();
              onClose();
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Restore defaults
          </button>
          <div className="flex gap-2">
            <button type="button" className="bm-btn" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="bm-btn bm-btn-primary"
              onClick={() => {
                onUpdateWidgets(local);
                onClose();
              }}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Apply
            </button>
          </div>
        </div>
      }
    >
      <ol className="divide-y divide-line">
        {local.map((widget, index) => (
          <li key={widget.id} className="flex items-center gap-2 px-3 py-2 sm:px-4">
            <span className="w-6 shrink-0 text-center font-mono text-xs text-fg-3">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <Switch checked={widget.visible} onChange={value => toggle(widget.id, value)} label={widget.title} description={widget.subtitle} />
            </div>
            <div className="flex shrink-0">
              <button type="button" className="bm-btn bm-btn-ghost bm-btn-icon" aria-label={`Move ${widget.title} up`} disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" className="bm-btn bm-btn-ghost bm-btn-icon" aria-label={`Move ${widget.title} down`} disabled={index === local.length - 1} onClick={() => move(index, 1)}>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </Dialog>
  );
};
