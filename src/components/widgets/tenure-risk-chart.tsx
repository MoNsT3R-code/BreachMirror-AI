import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Table, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

interface TenureRiskData {
  cohort: string;
  phishingFailRate: number;
  genaiPasteRate: number;
  secretCommitRate: number;
  annotation: string;
}

const TENURE_DATA: TenureRiskData[] = [
  { cohort: 'Days 1-30', phishingFailRate: 38.4, genaiPasteRate: 43.1, secretCommitRate: 29.5, annotation: 'Peak vulnerability window: urgency to ship code quickly' },
  { cohort: 'Months 2-3', phishingFailRate: 24.2, genaiPasteRate: 28.5, secretCommitRate: 18.0, annotation: 'Tooling familiarity and habit formation' },
  { cohort: 'Months 4-12', phishingFailRate: 14.8, genaiPasteRate: 16.2, secretCommitRate: 9.4, annotation: 'Comfortable with enterprise sandbox tools' },
  { cohort: '1+ Year', phishingFailRate: 8.1, genaiPasteRate: 9.5, secretCommitRate: 4.2, annotation: 'Adherence to zero-blame security culture' },
];

export const TenureRiskChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [hoveredCohort, setHoveredCohort] = useState<TenureRiskData | null>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 460;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = Math.max(280, containerWidth - margin.left - margin.right);
    const height = 220 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('role', 'img')
      .attr('aria-label', 'Risk failure rates by employee tenure cohort');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand().domain(TENURE_DATA.map(d => d.cohort)).rangeRound([0, width]).paddingInner(0.2);

    const categories = ['phishingFailRate', 'genaiPasteRate', 'secretCommitRate'];
    const x1 = d3.scaleBand().domain(categories).rangeRound([0, x0.bandwidth()]).padding(0.08);
    const y = d3.scaleLinear().domain([0, 50]).rangeRound([height, 0]);

    const color = d3.scaleOrdinal<string>().domain(categories).range(['#f43f5e', '#06b6d4', '#f59e0b']);

    // Grid
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)')
      .attr('stroke-dasharray', '2,2');
    g.select('.domain').remove();

    // Bars
    const cohortGroups = g
      .selectAll('.cohort-group')
      .data(TENURE_DATA)
      .enter()
      .append('g')
      .attr('class', 'cohort-group')
      .attr('transform', d => `translate(${x0(d.cohort)},0)`);

    cohortGroups
      .selectAll('rect')
      .data(d => [
        { key: 'phishingFailRate', value: d.phishingFailRate, cohort: d },
        { key: 'genaiPasteRate', value: d.genaiPasteRate, cohort: d },
        { key: 'secretCommitRate', value: d.secretCommitRate, cohort: d },
      ])
      .enter()
      .append('rect')
      .attr('x', d => x1(d.key) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => color(d.key))
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        setHoveredCohort(d.cohort);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1);
      });

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .call(g => g.select('.domain').attr('stroke', isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'))
      .selectAll('text')
      .attr('fill', isLight ? '#334155' : 'rgba(255, 255, 255, 0.5)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat(d => `${d}%`))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .attr('fill', isLight ? '#475569' : 'rgba(255, 255, 255, 0.4)')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');
  }, [resolvedTheme]);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-[11px] font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            <span className="text-slate-300">Phishing (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 inline-block" />
            <span className="text-slate-300">GenAI Leaks (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
            <span className="text-slate-300">Secret Commits (%)</span>
          </div>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          aria-label={showTable ? 'Show chart' : 'Show screen reader table'}
          className="py-1 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          {showTable ? <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> : <Table className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{showTable ? 'View Chart' : 'Accessible Table'}</span>
        </button>
      </div>

      {hoveredCohort && (
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-slate-200 flex items-center justify-between">
          <div>
            <strong className="text-cyan-400">{hoveredCohort.cohort}:</strong>{' '}
            <span className="text-slate-300">{hoveredCohort.annotation}</span>
          </div>
          <div className="text-rose-400 font-bold shrink-0 ml-2">
            Peak: {hoveredCohort.genaiPasteRate}%
          </div>
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
                <th className="py-2 px-3">Tenure</th>
                <th className="py-2 px-3">Phishing (%)</th>
                <th className="py-2 px-3">GenAI (%)</th>
                <th className="py-2 px-3">Secrets (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TENURE_DATA.map(d => (
                <tr key={d.cohort}>
                  <td className="py-1.5 px-3 font-bold text-white">{d.cohort}</td>
                  <td className="py-1.5 px-3 text-rose-400">{d.phishingFailRate}%</td>
                  <td className="py-1.5 px-3 text-cyan-400">{d.genaiPasteRate}%</td>
                  <td className="py-1.5 px-3 text-amber-400">{d.secretCommitRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
