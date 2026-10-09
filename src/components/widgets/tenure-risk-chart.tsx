import React, { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3';
import { ChartFrame, ChartTooltip, LegendItem, useChartCursor, useElementWidth } from '../charts/chart-kit';

interface TenureRiskData {
  cohort: string;
  phishingFailRate: number;
  genaiPasteRate: number;
  secretCommitRate: number;
  annotation: string;
}

const DATA: TenureRiskData[] = [
  { cohort: 'Days 1–30', phishingFailRate: 38.4, genaiPasteRate: 43.1, secretCommitRate: 29.5, annotation: 'Peak vulnerability window: pressure to ship quickly.' },
  { cohort: 'Months 2–3', phishingFailRate: 24.2, genaiPasteRate: 28.5, secretCommitRate: 18.0, annotation: 'Tooling familiarity and habit formation.' },
  { cohort: 'Months 4–12', phishingFailRate: 14.8, genaiPasteRate: 16.2, secretCommitRate: 9.4, annotation: 'Comfortable with the enterprise sandbox tools.' },
  { cohort: '1+ year', phishingFailRate: 8.1, genaiPasteRate: 9.5, secretCommitRate: 4.2, annotation: 'Zero-blame security culture is the norm.' },
];

const SERIES = [
  { key: 'phishingFailRate', label: 'Phishing failures', color: 'var(--bm-s1)', shape: 'square' },
  { key: 'genaiPasteRate', label: 'GenAI pastes', color: 'var(--bm-s2)', shape: 'circle' },
  { key: 'secretCommitRate', label: 'Secret commits', color: 'var(--bm-s3)', shape: 'diamond' },
] as const;

const LEGEND: LegendItem[] = SERIES.map(series => ({ label: series.label, color: series.color, shape: series.shape }));
const HEIGHT = 240;
const MARGIN = { top: 12, right: 12, bottom: 30, left: 40 };

export const TenureRiskChart: React.FC = () => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const cursor = useChartCursor(DATA.length);
  const active = hover ?? cursor.index;

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x0 = scaleBand<string>().domain(DATA.map(d => d.cohort)).range([0, innerW]).paddingInner(0.22).paddingOuter(0.1);
  const x1 = scaleBand<string>().domain(SERIES.map(series => series.key)).range([0, x0.bandwidth()]).padding(0.12);
  const y = scaleLinear().domain([0, 50]).range([innerH, 0]);
  const d = active === null ? null : DATA[active];

  return (
    <ChartFrame
      summary="Risky-behaviour rates by employee tenure. Rates fall steadily from the first 30 days to over a year."
      legend={LEGEND}
      table={{
        caption: 'Risky behaviour rate (%) by tenure cohort',
        columns: ['Cohort', 'Phishing failures (%)', 'GenAI pastes (%)', 'Secret commits (%)'],
        rows: DATA.map(item => [item.cohort, item.phishingFailRate, item.genaiPasteRate, item.secretCommitRate]),
      }}
      footer={<p className="min-h-5 text-xs text-fg-3">{d ? <><span className="font-semibold text-fg-2">{d.cohort}:</span> {d.annotation}</> : 'Simulated data. Hover a cohort, or focus the chart and use the arrow keys.'}</p>}
    >
      <div ref={wrapRef} className="relative">
        <svg
          width={width}
          height={HEIGHT}
          role="group"
          aria-roledescription="bar chart"
          aria-label="Risky behaviour rate by tenure cohort. Focus and use arrow keys to read each cohort."
          tabIndex={0}
          onKeyDown={cursor.onKeyDown}
          onBlur={() => cursor.setIndex(null)}
          className="block overflow-visible rounded-md"
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {y.ticks(5).map(tick => (
              <g key={tick} transform={`translate(0,${y(tick)})`}>
                <line x2={innerW} stroke="var(--bm-line)" strokeDasharray={tick === 0 ? undefined : '2 4'} />
                <text x={-8} dy="0.32em" textAnchor="end" className="fill-fg-3 font-mono text-[12px]">{tick}%</text>
              </g>
            ))}
            {DATA.map((item, index) => {
              const left = x0(item.cohort) ?? 0;
              const dim = active !== null && active !== index;
              return (
                <g key={item.cohort} transform={`translate(${left},0)`} opacity={dim ? 0.4 : 1} style={{ transition: 'opacity 120ms' }}>
                  {SERIES.map(series => {
                    const value = item[series.key];
                    return <rect key={series.key} x={x1(series.key) ?? 0} y={y(value)} width={x1.bandwidth()} height={innerH - y(value)} rx="3" fill={series.color} />;
                  })}
                  <text x={x0.bandwidth() / 2} y={innerH + 20} textAnchor="middle" className="fill-fg-2 text-[12px]">{item.cohort}</text>
                  <rect
                    width={x0.bandwidth()}
                    height={innerH}
                    fill="transparent"
                    onPointerEnter={() => setHover(index)}
                    onPointerLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
          </g>
        </svg>
        {d && active !== null && (
          <ChartTooltip x={MARGIN.left + (x0(d.cohort) ?? 0) + x0.bandwidth() / 2} y={MARGIN.top + 120} containerWidth={width}>
            <p className="font-semibold">{d.cohort}</p>
            {SERIES.map(series => (
              <p key={series.key} className="mt-0.5 flex justify-between gap-4">
                <span className="text-fg-3">{series.label}</span>
                <span className="font-mono">{d[series.key]}%</span>
              </p>
            ))}
          </ChartTooltip>
        )}
        <p className="sr-only" role="status" aria-live="polite">
          {d ? `${d.cohort}: phishing ${d.phishingFailRate} percent, GenAI pastes ${d.genaiPasteRate} percent, secret commits ${d.secretCommitRate} percent.` : ''}
        </p>
      </div>
    </ChartFrame>
  );
};
