import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { ThreatEvent } from '../../shared-types';
import { INITIAL_THREAT_EVENTS } from '../../data/sample-data';

interface ThreatFeedWidgetProps {
  onInspectBreach: (event: ThreatEvent) => void;
}

export const ThreatFeedWidget: React.FC<ThreatFeedWidgetProps> = ({ onInspectBreach }) => {
  const [events, setEvents] = useState<ThreatEvent[]>(INITIAL_THREAT_EVENTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter(e => {
    const matchesSeverity = filterSeverity === 'ALL' || e.severity === filterSeverity;
    const matchesQuery =
      e.actionDetected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.userCohort.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesQuery;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'ELEVATED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search breach events, endpoints, cohorts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {['ALL', 'CRITICAL', 'HIGH', 'ELEVATED'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Events Stream Feed */}
      <div 
        className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1"
        role="log"
        aria-live="polite"
      >
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No threat telemetry matches the active filter.
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-bold border ${getSeverityBadge(
                    event.severity
                  )}`}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {event.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-bold ${getSeverityBadge(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {event.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      · {event.userCohort}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
                    {event.actionDetected}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-mono">
                    <span>Source: {event.sourceEndpoint}</span>
                    <span>Status: <strong className="text-emerald-400">{event.status}</strong></span>
                    <span>{event.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onInspectBreach(event)}
                className="self-end sm:self-center py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-200 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Automated DLP &amp; zero data exposure guarantee</span>
        </div>
        <span>{filteredEvents.length} Active Records</span>
      </div>
    </div>
  );
};
