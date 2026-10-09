import React, { useEffect, useRef, useState } from 'react';
import { BarChart2, Table } from 'lucide-react';

export type MarkerShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'cross';

export interface LegendItem {
  label: string;
  /** CSS color, normally a token such as var(--bm-s1). */
  color: string;
  shape: MarkerShape;
  value?: string;
}

/** Observes an element's width so charts re-layout on resize (not just on mount). */
export function useElementWidth<T extends HTMLElement>(fallback = 480): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const update = () => setWidth(Math.max(240, Math.floor(element.clientWidth)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

/** Keyboard cursor: arrow keys step through data points, Home/End jump. */
export function useChartCursor(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (count === 0) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      setIndex(current => (current === null ? 0 : Math.min(count - 1, current + 1)));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIndex(current => (current === null ? count - 1 : Math.max(0, current - 1)));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setIndex(count - 1);
    } else if (event.key === 'Escape') {
      setIndex(null);
    }
  };
  return { index, setIndex, onKeyDown };
}

export const Marker: React.FC<{ shape: MarkerShape; color: string; size?: number }> = ({ shape, color, size = 10 }) => {
  const h = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="shrink-0">
      {shape === 'circle' && <circle cx={h} cy={h} r={h - 0.5} fill={color} />}
      {shape === 'square' && <rect x="0.5" y="0.5" width={size - 1} height={size - 1} rx="1.5" fill={color} />}
      {shape === 'diamond' && <path d={`M${h} 0.5 L${size - 0.5} ${h} L${h} ${size - 0.5} L0.5 ${h} Z`} fill={color} />}
      {shape === 'triangle' && <path d={`M${h} 0.5 L${size - 0.5} ${size - 0.5} L0.5 ${size - 0.5} Z`} fill={color} />}
      {shape === 'cross' && <path d={`M${h} 0.5 V${size - 0.5} M0.5 ${h} H${size - 0.5}`} stroke={color} strokeWidth="2.2" strokeLinecap="round" />}
    </svg>
  );
};

/** SVG path for a marker centered at (cx, cy), used on the plot itself. */
export function markerPath(shape: MarkerShape, cx: number, cy: number, r = 4.5): string {
  switch (shape) {
    case 'square':
      return `M${cx - r} ${cy - r}h${2 * r}v${2 * r}h${-2 * r}Z`;
    case 'diamond':
      return `M${cx} ${cy - r - 1}L${cx + r + 1} ${cy}L${cx} ${cy + r + 1}L${cx - r - 1} ${cy}Z`;
    case 'triangle':
      return `M${cx} ${cy - r - 0.5}L${cx + r + 1} ${cy + r}L${cx - r - 1} ${cy + r}Z`;
    case 'cross':
      return `M${cx - r} ${cy}H${cx + r}M${cx} ${cy - r}V${cy + r}`;
    default:
      return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  }
}

export const ChartLegend: React.FC<{ items: LegendItem[] }> = ({ items }) => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Legend">
    {items.map(item => (
      <li key={item.label} className="flex items-center gap-2 text-xs text-fg-2">
        <Marker shape={item.shape} color={item.color} />
        <span>{item.label}</span>
        {item.value && <span className="font-mono text-fg-3">{item.value}</span>}
      </li>
    ))}
  </ul>
);

export const ChartTooltip: React.FC<{ x: number; y: number; containerWidth: number; children: React.ReactNode }> = ({ x, y, containerWidth, children }) => {
  const flip = x > containerWidth * 0.6;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-10 min-w-36 rounded-md border border-line-strong bg-surface px-3 py-2 text-xs text-fg shadow-raised"
      style={{ left: x, top: Math.max(y - 8, 0), transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -100%)` }}
    >
      {children}
    </div>
  );
};

interface ChartFrameProps {
  /** One-sentence summary of what the chart shows (becomes the accessible name). */
  summary: string;
  legend?: LegendItem[];
  table: { caption: string; columns: string[]; rows: Array<Array<string | number>> };
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Shared chart chrome: legend, table alternative, consistent spacing. */
export const ChartFrame: React.FC<ChartFrameProps> = ({ summary, legend, table, children, footer }) => {
  const [showTable, setShowTable] = useState(false);
  return (
    <figure className="bm-ds space-y-3" aria-label={summary}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {legend ? <ChartLegend items={legend} /> : <span />}
        <button type="button" className="bm-btn bm-btn-sm" aria-pressed={showTable} onClick={() => setShowTable(value => !value)}>
          {showTable ? <BarChart2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Table className="h-3.5 w-3.5" aria-hidden="true" />}
          {showTable ? 'View chart' : 'View as table'}
        </button>
      </div>
      {showTable ? (
        <div className="max-h-64 overflow-auto rounded-md border border-line" role="region" aria-label={table.caption} tabIndex={0}>
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">{table.caption}</caption>
            <thead className="sticky top-0 bg-surface-2">
              <tr>
                {table.columns.map(column => (
                  <th key={column} scope="col" className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fg-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cellIndex} scope="row" className="px-3 py-2 text-left font-medium text-fg">{cell}</th>
                    ) : (
                      <td key={cellIndex} className="px-3 py-2 font-mono text-fg-2">{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
      {footer}
    </figure>
  );
};
