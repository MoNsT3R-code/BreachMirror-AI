import React from 'react';
import { Dialog } from '../ui/dialog';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);

const GROUPS: Array<{ title: string; items: Array<{ keys: string[]; description: string }> }> = [
  {
    title: 'Global',
    items: [
      { keys: [isMac ? '⌘' : 'Ctrl', 'K'], description: 'Open the command palette' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close dialogs and menus' },
    ],
  },
  {
    title: 'Navigate',
    items: [
      { keys: ['0'], description: 'Home' },
      { keys: ['1'], description: 'Dashboard' },
      { keys: ['2'], description: 'Threat activity' },
      { keys: ['3'], description: 'Security guide' },
      { keys: ['4'], description: 'Analytics' },
      { keys: ['5'], description: 'Practice scenarios' },
      { keys: ['6'], description: 'Policy Copilot' },
      { keys: ['7'], description: 'Security Support' },
    ],
  },
  {
    title: 'Open a tool',
    items: [
      { keys: ['H'], description: 'Security handbook' },
      { keys: ['Q'], description: 'Certification exam' },
      { keys: ['O'], description: 'Code of conduct' },
      { keys: ['U'], description: 'Threat radar' },
      { keys: ['S'], description: 'Threat sandbox' },
      { keys: ['A'], description: 'Private report' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { keys: ['R'], description: 'Run a threat simulation' },
      { keys: ['V'], description: 'Toggle enhanced protection' },
      { keys: ['C'], description: 'Customize layout' },
      { keys: ['D'], description: 'Switch light / dark theme' },
      { keys: ['M'], description: 'Mute or unmute sound effects' },
    ],
  },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    title="Keyboard shortcuts"
    description="Single-key shortcuts are ignored while you are typing in a field."
    size="md"
    footer={
      <div className="flex justify-end">
        <button type="button" className="bm-btn bm-btn-primary" onClick={onClose}>Done</button>
      </div>
    }
  >
    <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
      {GROUPS.map(group => (
        <section key={group.title} aria-labelledby={`shortcut-${group.title}`}>
          <h3 id={`shortcut-${group.title}`} className="bm-eyebrow bm-h mb-2">{group.title}</h3>
          <dl className="space-y-1.5">
            {group.items.map(item => (
              <div key={item.description} className="flex items-center justify-between gap-3 text-sm">
                <dt className="text-fg-2">{item.description}</dt>
                <dd className="flex shrink-0 gap-1">
                  {item.keys.map(key => <kbd key={key} className="bm-kbd">{key}</kbd>)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  </Dialog>
);
