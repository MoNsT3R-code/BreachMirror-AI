import React, { useState } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  Sliders
} from 'lucide-react';
import { WidgetConfig } from '../../shared-types';

interface WidgetCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onUpdateWidgets: (updated: WidgetConfig[]) => void;
  onResetDefaults: () => void;
}

export const WidgetCustomizerModal: React.FC<WidgetCustomizerModalProps> = ({
  isOpen,
  onClose,
  widgets,
  onUpdateWidgets,
  onResetDefaults,
}) => {
  const [localWidgets, setLocalWidgets] = useState<WidgetConfig[]>(widgets);

  React.useEffect(() => {
    if (isOpen) {
      setLocalWidgets(widgets);
    }
  }, [isOpen, widgets]);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localWidgets.length) return;

    const copy = [...localWidgets];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const updated = copy.map((w, i) => ({ ...w, order: i + 1 }));
    setLocalWidgets(updated);
  };

  const handleToggleVisibility = (id: string) => {
    setLocalWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const handleSave = () => {
    onUpdateWidgets(localWidgets);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-modal-title"
    >
      <div className="w-full max-w-2xl rounded-2xl vengeance-glass border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 id="customizer-modal-title" className="text-base font-bold text-white font-display">
                Customize Dashboard Widgets
              </h2>
              <p className="text-xs text-slate-400">
                Rearrange card order and toggle visibility to reduce clutter
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close widget customizer modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1 text-xs">
          <p className="text-slate-400 mb-2 text-[11px] font-mono">
            Enable or hide modular widgets to streamline your tactical workspace:
          </p>

          {localWidgets.map((w, index) => (
            <div
              key={w.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                w.visible
                  ? 'bg-black/40 border-white/10 text-slate-200'
                  : 'bg-black/20 border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-mono text-[11px] text-cyan-400 font-bold shrink-0">
                  {w.order}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white truncate text-xs">
                      {w.title}
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 uppercase">
                      {w.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {w.subtitle}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  aria-label={`Move ${w.title} up`}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === localWidgets.length - 1}
                  aria-label={`Move ${w.title} down`}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleVisibility(w.id)}
                  aria-label={w.visible ? `Hide ${w.title}` : `Show ${w.title}`}
                  className={`p-1 rounded transition-colors ${
                    w.visible
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {w.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetDefaults();
              onClose();
            }}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
