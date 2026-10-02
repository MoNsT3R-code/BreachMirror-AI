import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Table, PieChart as PieIcon } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

interface VectorData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

const VECTOR_DATA: VectorData[] = [
  { name: 'GenAI Credential Leaks', count: 184, percentage: 38, color: '#06b6d4', description: 'Pastes of algorithms and DB strings to consumer AI' },
  { name: 'Secret in Git Commits', count: 116, percentage: 24, color: '#f43f5e', description: 'Hardcoded tokens staged in commit history' },
  { name: 'Removable USB Media', count: 77, percentage: 16, color: '#f59e0b', description: 'Hardware flash drives blocked by kernel lock' },
  { name: 'AiTM Phishing Reverse Proxies', count: 68, percentage: 14, color: '#8b5cf6', description: 'Spoofed reverse proxy portals and fatigue pushes' },
  { name: 'Cloud Bucket Misconfigs', count: 39, percentage: 8, color: '#10b981', description: 'Public bucket access permissions in Terraform' },
];

export const AttackVectorChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVector, setSelectedVector] = useState<VectorData | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 8;
    const innerRadius = radius * 0.65;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', 'Attack vector breakdown donut chart');

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<VectorData>().value(d => d.count).sort(null).padAngle(0.04);
    const arc = d3.arc<d3.PieArcDatum<VectorData>>().innerRadius(innerRadius).outerRadius(radius).cornerRadius(4);
    const arcHover = d3.arc<d3.PieArcDatum<VectorData>>().innerRadius(innerRadius - 2).outerRadius(radius + 6).cornerRadius(4);

    const arcs = g.selectAll('.arc').data(pie(VECTOR_DATA)).enter().append('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', isLight ? '#ffffff' : '#020408')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.25s ease-out')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(150).attr('d', arcHover as any);
        setSelectedVector(d.data);
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('d', arc as any);
      });
  }, [resolvedTheme]);

  const totalCount = VECTOR_DATA.reduce((acc, v) => acc + v.count, 0);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-slate-400 uppercase">
          Attack Vector Distributions
        </span>

        <button
          onClick={() => setShowTable(!showTable)}
          aria-label={showTable ? 'Show Donut chart' : 'Show screen reader table'}
          className="py-1 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
        >
          {showTable ? <PieIcon className="w-3.5 h-3.5 text-cyan-400" /> : <Table className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{showTable ? 'View Chart' : 'Accessible Table'}</span>
        </button>
      </div>

      {!showTable ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Donut */}
          <div className="relative flex items-center justify-center">
            <svg ref={svgRef} className="overflow-visible" />
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-bold font-display text-white">
                {selectedVector ? `${selectedVector.percentage}%` : totalCount}
              </span>
              <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">
                {selectedVector ? selectedVector.name.split(' ')[0] : 'Incidents'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            {VECTOR_DATA.map(v => {
              const isSelected = selectedVector?.name === v.name;
              return (
                <div
                  key={v.name}
                  onClick={() => setSelectedVector(v)}
                  className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-black/30 border-transparent hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: v.color }}
                    />
                    <span className="font-semibold truncate text-[11px]">{v.name}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-200">{v.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[220px]">
          <table className="w-full text-left text-xs font-mono text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Vector</th>
                <th className="py-2 px-3">Incidents</th>
                <th className="py-2 px-3">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {VECTOR_DATA.map(v => (
                <tr key={v.name}>
                  <td className="py-2 px-3 font-bold text-white">{v.name}</td>
                  <td className="py-2 px-3 text-cyan-400">{v.count}</td>
                  <td className="py-2 px-3 text-rose-400 font-bold">{v.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
