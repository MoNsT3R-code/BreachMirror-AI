import React, { useState } from 'react';
import { area, curveMonotoneX, line, scaleLinear, scalePoint } from 'd3';
import { ChartFrame, ChartTooltip, LegendItem, markerPath, useChartCursor, useElementWidth } from '../charts/chart-kit';

interface ThreatDataPoint {
  hour: string;
  threats: number;
  prevented: number;
  anomalies: number;
}

const DATA: ThreatDataPoint[] = [
  { hour: '00:00', threats: 12, prevented: 12, anomalies: 3 },
  { hour: '03:00', threats: 6, prevented: 6, anomalies: 1 },
  { hour: '06:00', threats: 14, prevented: 14, anomalies: 4 },
  { hour: '09:00', threats: 68, prevented: 68, anomalies: 16 },
  { hour: '12:00', threats: 98, prevented: 97, anomalies: 24 },
  { hour: '15:00', threats: 112, prevented: 112, anomalies: 28 },
  { hour: '18:00', threats: 74, prevented: 74, anomalies: 18 },
  { hour: '21:00', threats: 32, prevented: 32, anomalies: 7 },
];

const LEGEND: LegendItem[] = [
  { label: 'Intercepted threats', color: 'var(--bm-s1)', shape: 'circle' },
  { label: 'Anomalies', color: 'var(--bm-s3)', shape: 'diamond' },
];

const HEIGHT = 240;
const MARGIN = { top: 12, right: 16, bottom: 28, left: 36 };

export const ThreatStreamChart: React.FC = () => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const cursor = useChartCursor(DATA.length);
  const active = hover ?? cursor.index;

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x = scalePoint<string>().domain(DATA.map(d => d.hour)).range([0, innerW]);
  const y = scaleLinear().domain([0, 120]).range([innerH, 0]);
  const xOf = (d: ThreatDataPoint) => x(d.hour) ?? 0;

  const threatsLine = line<ThreatDataPoint>().x(xOf).y(d => y(d.threats)).curve(curveMonotoneX)(DATA) ?? '';
  const threatsArea = area<ThreatDataPoint>().x(xOf).y0(innerH).y1(d => y(d.threats)).curve(curveMonotoneX)(DATA) ?? '';
  const anomaliesLine = line<ThreatDataPoint>().x(xOf).y(d => y(d.anomalies)).curve(curveMonotoneX)(DATA) ?? '';
  const peak = DATA.reduce((best, d) => (d.threats > best.threats ? d : best), DATA[0]);

  const onPointerMove = (event: React.PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const step = innerW / (DATA.length - 1);
    setHover(Math.max(0, Math.min(DATA.length - 1, Math.round((event.clientX - box.left) / step))));
  };

  const d = active === null ? null : DATA[active];

  return (
    <ChartFrame
      summary={`Threats intercepted per three-hour window over 24 hours. Peak of ${peak.threats} at ${peak.hour}.`}
      legend={LEGEND}
      table={{
        caption: 'Intercepted threats and anomalies by hour',
        columns: ['Hour', 'Threats', 'Prevented', 'Anomalies'],
        rows: DATA.map(item => [item.hour, item.threats, item.prevented, item.anomalies]),
      }}
      footer={<p className="text-xs text-fg-3">Simulated data. Peak: <span className="font-mono text-fg-2">{peak.threats}</span> at {peak.hour}. Use the arrow keys on the chart to step through hours.</p>}
    >
      <div ref={wrapRef} className="relative">
        <svg
          width={width}
          height={HEIGHT}
          role="group"
          aria-roledescription="line chart"
          aria-label="Threat volume by hour. Focus and use arrow keys to read each value."
          tabIndex={0}
          onKeyDown={cursor.onKeyDown}
          onBlur={() => cursor.setIndex(null)}
          className="block overflow-visible rounded-md"
        >
          <defs>
            <linearGradient id="stream-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--bm-s1)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--bm-s1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {y.ticks(4).map(tick => (
              <g key={tick} transform={`translate(0,${y(tick)})`}>
                <line x2={innerW} stroke="var(--bm-line)" strokeDasharray={tick === 0 ? undefined : '2 4'} />
                <text x={-8} dy="0.32em" textAnchor="end" className="fill-fg-3 font-mono text-[12px]">{tick}</text>
              </g>
            ))}
            {DATA.map(item => (
              <text key={item.hour} x={xOf(item)} y={innerH + 20} textAnchor="middle" className="fill-fg-3 font-mono text-[12px]">{item.hour}</text>
            ))}
            <path d={threatsArea} fill="url(#stream-fill)" />
            <path d={threatsLine} fill="none" stroke="var(--bm-s1)" strokeWidth="2.5" strokeLinecap="round" />
            <path d={anomaliesLine} fill="none" stroke="var(--bm-s3)" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" />
            {DATA.map(item => (
              <React.Fragment key={item.hour}>
                <path d={markerPath('circle', xOf(item), y(item.threats), 3.5)} fill="var(--bm-surface)" stroke="var(--bm-s1)" strokeWidth="2" />
                <path d={markerPath('diamond', xOf(item), y(item.anomalies), 3)} fill="var(--bm-surface)" stroke="var(--bm-s3)" strokeWidth="2" />
              </React.Fragment>
            ))}
            {d && (
              <g>
                <line x1={xOf(d)} x2={xOf(d)} y1={0} y2={innerH} stroke="var(--bm-fg-3)" strokeDasharray="3 3" />
                <path d={markerPath('circle', xOf(d), y(d.threats), 6)} fill="var(--bm-s1)" stroke="var(--bm-surface)" strokeWidth="2" />
              </g>
            )}
            <rect width={innerW} height={innerH} fill="transparent" onPointerMove={onPointerMove} onPointerLeave={() => setHover(null)} />
          </g>
        </svg>
        {d && (
          <ChartTooltip x={MARGIN.left + xOf(d)} y={MARGIN.top + y(d.threats)} containerWidth={width}>
            <p className="font-semibold">{d.hour}</p>
            <p className="mt-1 flex justify-between gap-4"><span className="text-fg-3">Threats</span><span className="font-mono">{d.threats}</span></p>
            <p className="flex justify-between gap-4"><span className="text-fg-3">Prevented</span><span className="font-mono">{d.prevented}</span></p>
            <p className="flex justify-between gap-4"><span className="text-fg-3">Anomalies</span><span className="font-mono">{d.anomalies}</span></p>
          </ChartTooltip>
        )}
        <p className="sr-only" role="status" aria-live="polite">
          {d ? `${d.hour}: ${d.threats} threats, ${d.prevented} prevented, ${d.anomalies} anomalies.` : ''}
        </p>
      </div>
    </ChartFrame>
  );
};
