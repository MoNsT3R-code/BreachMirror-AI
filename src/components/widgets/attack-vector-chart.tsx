import React, { useState } from 'react';
import { arc as d3arc, pie as d3pie } from 'd3';
import { ChartFrame, Marker, MarkerShape } from '../charts/chart-kit';

interface VectorData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  shape: MarkerShape;
  description: string;
}

const VECTORS: VectorData[] = [
  { name: 'GenAI credential leaks', count: 184, percentage: 38, color: 'var(--bm-s1)', shape: 'circle', description: 'Pastes of code and database strings into consumer AI tools' },
  { name: 'Secrets in Git commits', count: 116, percentage: 24, color: 'var(--bm-s2)', shape: 'square', description: 'Hardcoded tokens staged in commit history' },
  { name: 'Removable USB media', count: 77, percentage: 16, color: 'var(--bm-s3)', shape: 'diamond', description: 'Flash drives blocked by the kernel lock' },
  { name: 'AiTM phishing proxies', count: 68, percentage: 14, color: 'var(--bm-s4)', shape: 'triangle', description: 'Spoofed reverse-proxy portals and MFA fatigue prompts' },
  { name: 'Cloud bucket misconfigurations', count: 39, percentage: 8, color: 'var(--bm-s5)', shape: 'cross', description: 'Public bucket access found in Terraform' },
];

const SIZE = 200;
const TOTAL = VECTORS.reduce((sum, item) => sum + item.count, 0);

export const AttackVectorChart: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const slices = d3pie<VectorData>().value(item => item.count).sort(null).padAngle(0.02)(VECTORS);
  const outer = SIZE / 2 - 4;
  const makeArc = (grow: boolean) => d3arc<(typeof slices)[number]>().innerRadius(outer * 0.62).outerRadius(grow ? outer + 4 : outer).cornerRadius(3);
  const current = selected === null ? null : VECTORS[selected];

  return (
    <ChartFrame
      summary={`Share of ${TOTAL} intercepted events by attack vector. Largest: ${VECTORS[0].name} at ${VECTORS[0].percentage}%.`}
      table={{
        caption: 'Intercepted events by attack vector',
        columns: ['Vector', 'Events', 'Share'],
        rows: VECTORS.map(item => [item.name, item.count, `${item.percentage}%`]),
      }}
      footer={<p className="text-xs text-fg-3">Simulated data. Select a vector to highlight it.</p>}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <svg width={SIZE} height={SIZE} viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`} className="shrink-0 overflow-visible" role="img" aria-label="Donut chart. Use the list beside it to explore each vector.">
          {slices.map((slice, index) => (
            <path
              key={slice.data.name}
              d={makeArc(selected === index)(slice) ?? ''}
              fill={slice.data.color}
              opacity={selected === null || selected === index ? 1 : 0.35}
              onPointerEnter={() => setSelected(index)}
              onPointerLeave={() => setSelected(null)}
              style={{ transition: 'opacity 120ms' }}
            />
          ))}
          <text textAnchor="middle" y="-2" className="fill-fg font-display text-[28px] font-semibold">{current ? current.count : TOTAL}</text>
          <text textAnchor="middle" y="18" className="fill-fg-3 text-[12px]">{current ? `${current.percentage}% of events` : 'events intercepted'}</text>
        </svg>

        <ul className="w-full min-w-0 flex-1 space-y-1.5" aria-label="Attack vectors">
          {VECTORS.map((item, index) => {
            const active = selected === index;
            return (
              <li key={item.name}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(active ? null : index)}
                  onPointerEnter={() => setSelected(index)}
                  onPointerLeave={() => setSelected(null)}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left ${active ? 'border-line-strong bg-sunken' : 'border-transparent hover:bg-sunken'}`}
                >
                  <Marker shape={item.shape} color={item.color} size={12} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{item.name}</span>
                    {active && <span className="block text-xs text-fg-3">{item.description}</span>}
                  </span>
                  <span className="font-mono text-sm text-fg-2 tabular-nums">{item.percentage}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartFrame>
  );
};
