import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

/** Labelled on/off control (role="switch"). */
export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="bm-ds flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left hover:bg-sunken"
  >
    <span className="min-w-0">
      <span className="block text-sm font-medium text-fg">{label}</span>
      {description && <span className="block text-xs text-fg-3">{description}</span>}
    </span>
    <span
      aria-hidden="true"
      className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors ${checked ? 'border-accent bg-accent' : 'border-line-strong bg-sunken'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-transform ${checked ? 'translate-x-4 bg-accent-fg' : 'bg-fg-3'}`}
      />
    </span>
  </button>
);
