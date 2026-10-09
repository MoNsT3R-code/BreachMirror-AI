import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  onSelect?: () => void;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="bm-ds">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-3">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <li key={item.label} className="flex items-center gap-1">
            {last || !item.onSelect ? (
              <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-fg-2' : ''}>{item.label}</span>
            ) : (
              <button type="button" onClick={item.onSelect} className="rounded px-0.5 hover:text-fg hover:underline">{item.label}</button>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  </nav>
);
