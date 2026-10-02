import React from 'react';
import { Search } from 'lucide-react';

interface DocumentSearchButtonProps {
  onClick?: () => void;
  className?: string;
  placeholder?: string;
}

export const DocumentSearchButton: React.FC<DocumentSearchButtonProps> = ({
  onClick,
  className = '',
  placeholder = 'Search security playbook...',
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 border border-white/10 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white px-3 py-1.5 justify-start rounded-xl text-xs font-normal shadow-sm h-9 w-44 md:w-56 cursor-pointer ${className}`}
      type="button"
    >
      <Search className="w-3.5 h-3.5 mr-2 text-cyan-400 shrink-0" />
      <span className="hidden sm:inline-flex truncate mr-6 text-[11px]">{placeholder}</span>
      <span className="inline-flex sm:hidden text-[11px]">Search...</span>
      <kbd
        className="pointer-events-none absolute right-[0.35rem] top-[0.35rem] flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-slate-800/80 px-1.5 font-mono text-[9px] font-medium text-slate-300"
      >
        <span>/</span>
      </kbd>
    </button>
  );
};
