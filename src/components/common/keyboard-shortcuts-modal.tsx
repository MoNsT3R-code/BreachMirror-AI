import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '?', label: 'Shift + /', description: 'Show keyboard shortcuts', category: 'Actions' },
  { key: '1', label: '1', description: 'Switch to Master Dashboard', category: 'Navigation' },
  { key: '2', label: '2', description: 'Switch to Threat Telemetry', category: 'Navigation' },
  { key: '3', label: '3', description: 'Switch to Security Playbook', category: 'Navigation' },
  { key: '4', label: '4', description: 'Switch to D3 Analytics', category: 'Navigation' },
  { key: '5', label: '5', description: 'Switch to Dilemma Lab', category: 'Navigation' },
  { key: 'v', label: 'V', description: 'Engage Vengeance Overdrive Protocol', category: 'Actions' },
  { key: 'u', label: 'U', description: 'Open Tactical Cyber Radar (War Room)', category: 'Actions' },
  { key: 'a', label: 'A', description: 'Open Zero-Blame Confession Airlock', category: 'Actions' },
  { key: 's', label: 'S', description: 'Open AI Threat Sandbox', category: 'Actions' },
  { key: 'h', label: 'H', description: 'Open Internee & New Hire Handbook', category: 'Actions' },
  { key: 'o', label: 'O', description: 'Open Stewart Code of Business Conduct (7 Pillars)', category: 'Actions' },
  { key: 'q', label: 'Q', description: 'Open Master Compliance Certification Exam (Both PDFs)', category: 'Actions' },
  { key: 'm', label: 'M', description: 'Toggle Cyber Audio Sound Effects', category: 'View' },
  { key: 'd', label: 'D', description: 'Toggle Dark / Light Theme', category: 'View' },
  { key: 'r', label: 'R', description: 'Simulate Threat Anomaly', category: 'Actions' },
  { key: 'c', label: 'C', description: 'Customize Widget Cards', category: 'View' },
  { key: 'Escape', label: 'Esc', description: 'Close modals & overlays', category: 'Actions' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const categories = ['Navigation', 'Actions', 'View'] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl vengeance-glass border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-base font-bold text-white font-display">
                Keyboard Shortcuts Reference
              </h2>
              <p className="text-xs text-slate-400">
                Quick commands for high-efficiency incident triage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {categories.map(cat => (
            <div key={cat} className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider block">
                {cat} Controls
              </span>

              <div className="space-y-2">
                {SHORTCUTS.filter(s => s.category === cat).map(s => (
                  <div
                    key={s.key}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <span className="text-slate-300 font-medium">
                      {s.description}
                    </span>
                    <kbd className="px-2.5 py-1 rounded bg-white/10 text-white font-mono text-[11px] font-bold border border-white/15 shadow-xs">
                      {s.label}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
