import React, { useState } from 'react';
import { BookOpen, Maximize2, Shield } from 'lucide-react';
import { RadarSampleBreach, SAMPLE_HANDBOOK_RADAR_BREACHES } from '../../data/radar-breaches';
import { useAlerts } from '../../context/alert-context';
import { soundManager } from '../../services/sound-effects';
import { RadarCanvas } from '../radar/radar-canvas';
import { SeverityBadge } from '../ui/severity';

interface RadarWidgetProps {
  onOpenFullRadar: () => void;
  onOpenHandbook: (vectorId?: string) => void;
}

export const RadarWidget: React.FC<RadarWidgetProps> = ({ onOpenFullRadar, onOpenHandbook }) => {
  const [breaches, setBreaches] = useState<RadarSampleBreach[]>(SAMPLE_HANDBOOK_RADAR_BREACHES);
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_HANDBOOK_RADAR_BREACHES[0].id);
  const { deployCountermeasure, soundEnabled } = useAlerts();
  const selected = breaches.find(b => b.id === selectedId) ?? breaches[0];
  const active = breaches.filter(b => !b.neutralized).length;

  const select = (id: string) => {
    setSelectedId(id);
    if (soundEnabled) soundManager.playTargetLock();
  };

  const contain = () => {
    if (selected.neutralized) return;
    deployCountermeasure(selected.name);
    setBreaches(previous => previous.map(b => (b.id === selected.id ? { ...b, neutralized: true } : b)));
    if (soundEnabled) soundManager.playSuccess();
  };

  return (
    <div className="bm-ds grid gap-5 md:grid-cols-[minmax(0,20rem)_1fr] md:items-start">
      <div className="space-y-2">
        <div className="mx-auto aspect-square w-full max-w-[20rem] rounded-lg border border-line bg-surface-2">
          <RadarCanvas blips={breaches} selectedId={selectedId} onSelect={select} ariaLabel="Radar plot of sample breach vectors. The list beside it is the keyboard-accessible version." />
        </div>
        <p className="text-center font-mono text-xs text-fg-3">{active} of {breaches.length} sample threats active</p>
      </div>

      <div className="min-w-0 space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bm-chip">Chapter {selected.chapterNumber}</span>
            <SeverityBadge severity={selected.neutralized ? 'RESOLVED' : selected.severity} />
          </div>
          <h4 className="bm-h font-display text-lg font-semibold text-fg">{selected.name}</h4>
          <p className="rounded-md bg-surface-2 p-3 text-sm text-fg-2">{selected.sampleScenario}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="bm-btn bm-btn-sm" onClick={() => onOpenHandbook(selected.handbookVectorId)}>
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Chapter {selected.chapterNumber}
            </button>
            <button type="button" className="bm-btn bm-btn-sm" onClick={contain} disabled={selected.neutralized}>
              <Shield className="h-3.5 w-3.5" aria-hidden="true" /> {selected.neutralized ? 'Contained' : 'Contain this threat'}
            </button>
            <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onOpenFullRadar}>
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> Full radar
            </button>
          </div>
        </div>

        <div role="radiogroup" aria-label="Sample threats" className="flex flex-wrap gap-1.5">
          {breaches.map(b => (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={b.id === selectedId}
              title={b.name}
              aria-label={`Chapter ${b.chapterNumber}: ${b.name}${b.neutralized ? ', resolved' : ''}`}
              onClick={() => select(b.id)}
              className={`min-h-8 min-w-8 rounded-md border px-2 font-mono text-xs font-semibold ${b.id === selectedId ? 'border-accent bg-accent-soft text-accent-text' : b.neutralized ? 'border-line bg-safe-soft text-safe' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}
            >
              {b.chapterNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
