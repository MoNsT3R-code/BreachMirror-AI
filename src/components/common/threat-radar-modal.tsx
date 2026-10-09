import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Box, Check, Crosshair, Layers, RefreshCw, ShieldAlert, Volume2, VolumeX, Zap } from 'lucide-react';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { HANDBOOK_VECTORS } from '../../data/handbook-content';
import { RadarSampleBreach, SAMPLE_HANDBOOK_RADAR_BREACHES } from '../../data/radar-breaches';
import { RadarCanvas } from '../radar/radar-canvas';
import { Dialog } from '../ui/dialog';
import { SeverityBadge } from '../ui/severity';

export type { RadarSampleBreach };
export { SAMPLE_HANDBOOK_RADAR_BREACHES };

interface ThreatRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHandbookVector?: (vectorId: string) => void;
  initialBreachId?: string;
}

type ResponseKind = 'HONEYTOKEN' | 'BLACKHOLE' | 'SANDBOX';

const RESPONSES: Array<{ kind: ResponseKind; label: string; description: string; icon: React.ReactNode }> = [
  { kind: 'HONEYTOKEN', label: 'Add a harmless decoy', description: 'Plant fake credentials so misuse is obvious.', icon: <Zap className="h-4 w-4" aria-hidden="true" /> },
  { kind: 'BLACKHOLE', label: 'Block the source', description: 'End the session and cut the connection. No penalty.', icon: <ShieldAlert className="h-4 w-4" aria-hidden="true" /> },
  { kind: 'SANDBOX', label: 'Move to the practice area', description: 'Reroute it to an isolated lab to study safely.', icon: <Crosshair className="h-4 w-4" aria-hidden="true" /> },
];

const LOG_TEXT: Record<ResponseKind, (b: RadarSampleBreach) => string> = {
  HONEYTOKEN: b => `Decoy credentials planted for ${b.sourceIp}. Any use is now traceable.`,
  BLACKHOLE: b => `Source ${b.sourceIp} blocked and its session ended. No penalty applied.`,
  SANDBOX: b => `Traffic from ${b.sourceIp} rerouted into an isolated lab. Impact reduced to zero.`,
};

const LEGEND = [
  { label: 'Critical', shape: 'circle', color: 'var(--bm-crit)' },
  { label: 'High', shape: 'square', color: 'var(--bm-high)' },
  { label: 'Elevated', shape: 'diamond', color: 'var(--bm-med)' },
] as const;

export const ThreatRadarModal: React.FC<ThreatRadarModalProps> = ({ isOpen, onClose, onOpenHandbookVector, initialBreachId }) => {
  const [blips, setBlips] = useState<RadarSampleBreach[]>(SAMPLE_HANDBOOK_RADAR_BREACHES);
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_HANDBOOK_RADAR_BREACHES[0].id);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [tilted, setTilted] = useState(true);
  const [detected, setDetected] = useState<RadarSampleBreach | null>(null);
  const { deployCountermeasure, soundEnabled, toggleSound } = useAlerts();

  const selected = blips.find(b => b.id === selectedId) ?? blips[0];
  const vector = HANDBOOK_VECTORS.find(v => v.id === selected.handbookVectorId);
  const active = blips.filter(b => !b.neutralized).length;

  useEffect(() => {
    if (!initialBreachId) return;
    const match = blips.find(b => b.id === initialBreachId || b.handbookVectorId === initialBreachId);
    if (match) setSelectedId(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBreachId]);

  const select = (id: string) => {
    setSelectedId(id);
    if (soundEnabled) soundManager.playTargetLock();
  };

  const respond = (kind: ResponseKind) => {
    if (selected.neutralized || busy) return;
    setBusy(true);
    deployCountermeasure(selected.name);
    setLog(previous => [`${new Date().toLocaleTimeString()}  ${LOG_TEXT[kind](selected)}`, ...previous]);
    window.setTimeout(() => {
      setBlips(previous => previous.map(b => (b.id === selected.id ? { ...b, neutralized: true } : b)));
      setBusy(false);
      if (soundEnabled) soundManager.playSuccess();
    }, 450);
  };

  const reset = () => {
    setBlips(SAMPLE_HANDBOOK_RADAR_BREACHES);
    setSelectedId(SAMPLE_HANDBOOK_RADAR_BREACHES[0].id);
    setLog([]);
    setDetected(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Threat radar"
      description="Ten sample breach vectors from the security handbook. Select one to study it, then choose a response."
      size="xl"
    >
      <div className="bm-ds space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md border border-line-strong bg-sunken p-0.5" role="radiogroup" aria-label="Radar view">
            <button type="button" role="radio" aria-checked={tilted} onClick={() => setTilted(true)} className={`inline-flex min-h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold ${tilted ? 'bg-surface text-fg shadow-card' : 'text-fg-3'}`}>
              <Box className="h-4 w-4" aria-hidden="true" /> Isometric
            </button>
            <button type="button" role="radio" aria-checked={!tilted} onClick={() => setTilted(false)} className={`inline-flex min-h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold ${!tilted ? 'bg-surface text-fg shadow-card' : 'text-fg-3'}`}>
              <Layers className="h-4 w-4" aria-hidden="true" /> Plan
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-fg-3">{active} of {blips.length} active</span>
            <button type="button" className="bm-btn bm-btn-sm" aria-pressed={soundEnabled} onClick={() => toggleSound()}>
              {soundEnabled ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
              Sound {soundEnabled ? 'on' : 'off'}
            </button>
            <button type="button" className="bm-btn bm-btn-sm" onClick={reset}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
            </button>
          </div>
        </div>

        <div role="status" aria-live="polite" className="min-h-9">
          {detected && !detected.neutralized && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-crit-soft px-3 py-2 text-sm">
              <span className="text-fg"><span className="font-semibold text-crit">Sweep detected:</span> {detected.name}</span>
              <button type="button" className="bm-btn bm-btn-sm" onClick={() => select(detected.id)}>
                <Crosshair className="h-3.5 w-3.5" aria-hidden="true" /> Focus
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <div className="aspect-[540/470] w-full rounded-lg border border-line bg-surface-2">
              <RadarCanvas
                blips={blips}
                selectedId={selectedId}
                tilted={tilted}
                detailed
                onSelect={select}
                onDetect={setDetected}
                ariaLabel="Radar plot of ten sample breach vectors. The list below is the keyboard-accessible version."
              />
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-2" aria-label="Legend">
              {LEGEND.map(item => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    {item.shape === 'circle' && <circle cx="6" cy="6" r="5" fill={item.color} />}
                    {item.shape === 'square' && <rect x="1" y="1" width="10" height="10" rx="1" fill={item.color} />}
                    {item.shape === 'diamond' && <path d="M6 0.5 L11.5 6 L6 11.5 L0.5 6 Z" fill={item.color} />}
                  </svg>
                  {item.label}
                </li>
              ))}
              <li className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="var(--bm-safe)" /></svg>
                Resolved: reflected across the axis
              </li>
            </ul>

            <div role="radiogroup" aria-label="Sample events" className="grid gap-1.5 sm:grid-cols-2">
              {blips.map(b => {
                const on = b.id === selectedId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => select(b.id)}
                    className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm ${on ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:bg-sunken'}`}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs text-fg-3">{b.chapterNumber}</span>
                    <span className="min-w-0 flex-1 truncate text-fg">{b.name}</span>
                    {b.neutralized ? <SeverityBadge severity="RESOLVED" /> : <SeverityBadge severity={b.severity} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <section aria-labelledby="radar-dossier" className="space-y-3 rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bm-chip">Handbook chapter {selected.chapterNumber}</span>
                <SeverityBadge severity={selected.neutralized ? 'RESOLVED' : selected.severity} />
              </div>
              <h3 id="radar-dossier" className="bm-h font-display text-xl font-semibold text-fg">{selected.name}</h3>
              <p className="rounded-md bg-surface-2 p-3 text-sm text-fg-2">{selected.sampleScenario}</p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="bm-eyebrow">Category</dt><dd className="mt-0.5 text-fg">{selected.category}</dd></div>
                <div><dt className="bm-eyebrow">Who is affected</dt><dd className="mt-0.5 text-fg">{selected.targetCohort}</dd></div>
              </dl>
              <div><p className="bm-eyebrow">How it could happen</p><p className="mt-0.5 text-sm text-fg-2">{selected.payloadVector}</p></div>
              <div className="rounded-md bg-crit-soft p-3">
                <p className="bm-eyebrow text-crit">Possible impact</p>
                <p className="mt-0.5 text-sm text-fg">{selected.blastRadius}</p>
              </div>
              {onOpenHandbookVector && vector && (
                <button type="button" className="bm-btn bm-btn-primary w-full justify-between" onClick={() => onOpenHandbookVector(selected.handbookVectorId)}>
                  <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" aria-hidden="true" /> Review prevention guidance</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </section>

            {selected.neutralized ? (
              <div className="flex items-start gap-3 rounded-lg bg-safe-soft p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-safe" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-fg">Sample event resolved</p>
                  <p className="mt-0.5 text-sm text-fg-2">Its reflection now sits across the axis. In a real incident, reporting quickly is what lets the team respond.</p>
                </div>
              </div>
            ) : (
              <section aria-labelledby="radar-moves">
                <h3 id="radar-moves" className="bm-eyebrow mb-2">Your move</h3>
                <ul className="space-y-2">
                  {RESPONSES.map(response => (
                    <li key={response.kind}>
                      <button type="button" disabled={busy} onClick={() => respond(response.kind)} className="flex w-full items-start gap-3 rounded-md border border-line bg-surface p-3 text-left hover:border-line-strong hover:bg-surface-2 disabled:opacity-60">
                        <span className="mt-0.5 text-accent-text">{response.icon}</span>
                        <span>
                          <span className="block text-sm font-semibold text-fg">{response.label}</span>
                          <span className="block text-xs text-fg-3">{response.description}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="radar-log" className="rounded-lg border border-line bg-surface-2 p-3">
              <h3 id="radar-log" className="bm-eyebrow mb-1.5">Activity log</h3>
              <div role="log" aria-live="polite" className="max-h-28 overflow-y-auto font-mono text-xs text-fg-2" tabIndex={0}>
                {log.length === 0 ? <p className="text-fg-3">No responses yet. Select a threat and choose a move.</p> : log.map((entry, index) => <p key={`${entry}-${index}`} className="mb-1">{entry}</p>)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
