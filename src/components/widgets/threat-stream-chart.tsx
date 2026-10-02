import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Table, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

interface ThreatDataPoint {
  hour: string;
  threats: number;
  prevented: number;
  anomalies: number;
}

const SAMPLE_TIMELINE_DATA: ThreatDataPoint[] = [
  { hour: '00:00', threats: 12, prevented: 12, anomalies: 3 },
  { hour: '03:00', threats: 6, prevented: 6, anomalies: 1 },
  { hour: '06:00', threats: 14, prevented: 14, anomalies: 4 },
  { hour: '09:00', threats: 68, prevented: 68, anomalies: 16 },
  { hour: '12:00', threats: 98, prevented: 97, anomalies: 24 },
  { hour: '15:00', threats: 112, prevented: 112, anomalies: 28 },
  { hour: '18:00', threats: 74, prevented: 74, anomalies: 18 },
  { hour: '21:00', threats: 32, prevented: 32, anomalies: 7 },
];

export const ThreatStreamChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [hoveredData, setHoveredData] = useState<ThreatDataPoint | null>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 460;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = Math.max(280, containerWidth - margin.left - margin.right);
    const height = 220 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('role', 'img')
      .attr('aria-label', '24-hour threat velocity stream area chart');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient
    const defs = svg.append('defs');
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'threatStreamGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.4);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.02);

    const x = d3.scalePoint().domain(SAMPLE_TIMELINE_DATA.map(d => d.hour)).range([0, width]);
    const y = d3.scaleLinear().domain([0, 130]).range([height, 0]);

    // Grid
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)')
      .attr('stroke-dasharray', '2,2');
    g.select('.domain').remove();

    // Area & Line
    const area = d3.area<ThreatDataPoint>().x(d => x(d.hour) || 0).y0(height).y1(d => y(d.threats)).curve(d3.curveMonotoneX);
    const line = d3.line<ThreatDataPoint>().x(d => x(d.hour) || 0).y(d => y(d.threats)).curve(d3.curveMonotoneX);

    g.append('path').datum(SAMPLE_TIMELINE_DATA).attr('fill', 'url(#threatStreamGradient)').attr('d', area);
    g.append('path').datum(SAMPLE_TIMELINE_DATA).attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 2).attr('d', line);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').attr('stroke', isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'))
      .selectAll('text')
      .attr('fill', isLight ? '#334155' : 'rgba(255, 255, 255, 0.5)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(4))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .attr('fill', isLight ? '#475569' : 'rgba(255, 255, 255, 0.4)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Hover elements
    const focus = g.append('g').style('display', 'none');
    focus.append('line').attr('stroke', 'rgba(6, 182, 212, 0.4)').attr('stroke-width', 1).attr('stroke-dasharray', '2,2').attr('y1', 0).attr('y2', height);
    focus.append('circle').attr('r', 4.5).attr('fill', '#06b6d4').attr('stroke', '#ffffff').attr('stroke-width', 1.5);

    svg
      .append('rect')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        setHoveredData(null);
      })
      .on('mousemove', function (event) {
        const [xm] = d3.pointer(event);
        const eachBand = width / (SAMPLE_TIMELINE_DATA.length - 1);
        const index = Math.round(xm / eachBand);
        const clampedIndex = Math.max(0, Math.min(SAMPLE_TIMELINE_DATA.length - 1, index));
        const d = SAMPLE_TIMELINE_DATA[clampedIndex];
        if (d) {
          const cx = x(d.hour) || 0;
          const cy = y(d.threats);
          focus.attr('transform', `translate(${cx},0)`);
          focus.select('circle').attr('transform', `translate(0,${cy})`);
          setHoveredData(d);
        }
      });
  }, [resolvedTheme]);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span className="text-slate-300">Total Intercepts</span>
          </div>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          aria-label={showTable ? 'Show chart' : 'Show screen reader table'}
          className="py-1 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
        >
          {showTable ? <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> : <Table className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{showTable ? 'View Chart' : 'Accessible Table'}</span>
        </button>
      </div>

      {hoveredData && (
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-slate-200">
          <span className="text-cyan-400 font-bold">Hour: {hoveredData.hour}</span>
          <span>Threats: <strong className="text-white">{hoveredData.threats}</strong></span>
          <span>Prevented: <strong className="text-emerald-400">{hoveredData.prevented}</strong></span>
        </div>
      )}

      {!showTable ? (
        <div className="w-full overflow-x-auto flex justify-center">
          <svg ref={svgRef} className="overflow-visible" />
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[220px]">
          <table className="w-full text-left text-xs font-mono text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Hour</th>
                <th className="py-2 px-3">Threats</th>
                <th className="py-2 px-3">Prevented</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SAMPLE_TIMELINE_DATA.map(d => (
                <tr key={d.hour}>
                  <td className="py-1.5 px-3 font-bold text-white">{d.hour}</td>
                  <td className="py-1.5 px-3 text-cyan-400">{d.threats}</td>
                  <td className="py-1.5 px-3 text-emerald-400">{d.prevented}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
