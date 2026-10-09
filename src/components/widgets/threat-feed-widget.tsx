import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { ThreatEvent, ThreatSeverity } from '../../shared-types';
import { formatAge, useTelemetry } from '../../services/live-telemetry';
import { SeverityBadge } from '../ui/severity';

interface ThreatFeedWidgetProps {
  onInspectBreach: (event: ThreatEvent) => void;
}

const FILTERS: Array<{ value: 'ALL' | ThreatSeverity; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'ELEVATED', label: 'Elevated' },
];

export const ThreatFeedWidget: React.FC<ThreatFeedWidgetProps> = ({ onInspectBreach }) => {
  const { events, live } = useTelemetry();
  const [severity, setSeverity] = useState<'ALL' | ThreatSeverity>('ALL');
  const [query, setQuery] = useState('');
  const [, setClock] = useState(0);

  // Re-render every 15 s so relative ages ("2 min ago") stay current.
  useEffect(() => {
    const id = window.setInterval(() => setClock(value => value + 1), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter(event => {
      if (severity !== 'ALL' && event.severity !== severity) return false;
      if (!needle) return true;
      return [event.actionDetected, event.userCohort, event.categoryLabel, event.id].some(field => field.toLowerCase().includes(needle));
    });
  }, [events, severity, query]);

  return (
    <div className="bm-ds flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search threat events</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search events, endpoints, cohorts…"
            className="min-h-10 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-3"
          />
        </label>
        <div role="radiogroup" aria-label="Filter by severity" className="flex gap-1 overflow-x-auto rounded-md border border-line-strong bg-sunken p-0.5">
          {FILTERS.map(filter => (
            <button
              key={filter.value}
              type="button"
              role="radio"
              aria-checked={severity === filter.value}
              onClick={() => setSeverity(filter.value)}
              className={`min-h-8 shrink-0 rounded px-3 text-xs font-semibold ${severity === filter.value ? 'bg-surface text-fg shadow-card' : 'text-fg-3 hover:text-fg'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[26rem] overflow-y-auto pr-1" role="log" aria-live="polite" aria-label="Threat events, newest first" tabIndex={0}>
        <ul className="space-y-2">
        {filtered.length === 0 && (
          <li className="bm-p rounded-md border border-dashed border-line-strong px-4 py-10 text-center text-sm text-fg-3">
            No events match these filters. Clear the search or choose All.
          </li>
        )}
        {filtered.map(event => (
          <li key={event.id} className={`rounded-md border border-line bg-surface-2 p-3.5 ${event.isNew ? 'bm-pop' : ''}`}>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-fg">{event.id}</span>
                  <SeverityBadge severity={event.severity} />
                  {event.isNew && <span className="bm-chip bm-sev bm-sev-low">New</span>}
                  <span className="text-xs text-fg-3">
                    {event.categoryLabel} · {event.userCohort}
                  </span>
                </div>
                <p className="text-sm text-fg">{event.actionDetected}</p>
                <p className="flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-xs text-fg-3">
                  <span>{event.sourceEndpoint}</span>
                  <span>{event.status.charAt(0) + event.status.slice(1).toLowerCase()}</span>
                  <span>{formatAge(event.at)}</span>
                </p>
              </div>
              <button type="button" className="bm-btn bm-btn-sm justify-self-end" onClick={() => onInspectBreach(event)} aria-label={`Inspect ${event.id}: ${event.categoryLabel}`}>
                Inspect
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
        </ul>
      </div>

      <p className="flex items-center justify-between gap-3 border-t border-line pt-3 text-xs text-fg-3">
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${live ? 'bg-safe' : 'bg-fg-3'}`} aria-hidden="true" />
          {live ? 'Live: new simulated events arrive every few seconds' : 'Sensor paused'}
        </span>
        <span className="font-mono">{filtered.length} shown</span>
      </p>
    </div>
  );
};
