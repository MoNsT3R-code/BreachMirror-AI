import { useSyncExternalStore } from 'react';
import { INITIAL_THREAT_EVENTS } from '../data/sample-data';
import { ThreatEvent, ThreatSeverity } from '../shared-types';

/**
 * Simulated live telemetry shared by the velocity widget, the threat feed and
 * the "Run simulation" action. Everything here is generated locally for training.
 */
export interface FeedEvent extends ThreatEvent {
  /** Epoch ms the event was created; `timestamp` is rendered from this. */
  at: number;
  isNew: boolean;
}

interface TelemetryState {
  live: boolean;
  velocity: number;
  prevented: number;
  quarantined: number;
  series: number[];
  events: FeedEvent[];
}

const TEMPLATES: Array<Omit<ThreatEvent, 'id' | 'timestamp'>> = INITIAL_THREAT_EVENTS.map(({ id: _id, timestamp: _timestamp, ...rest }) => rest);
const MAX_EVENTS = 40;
const listeners = new Set<() => void>();
let nextId = 8950;
let templateCursor = 0;
let timer: number | undefined;
let tick = 0;

function parseAgeMs(label: string): number {
  const match = label.match(/(\d+)\s*(min|hour|h|sec|s)/i);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  return value * (unit.startsWith('h') ? 3_600_000 : unit.startsWith('m') ? 60_000 : 1000);
}

const now = Date.now();
let state: TelemetryState = {
  live: true,
  velocity: 4.2,
  prevented: 142,
  quarantined: 3,
  series: Array.from({ length: 24 }, (_, i) => 3 + Math.round(Math.sin(i / 3) * 1.2 + (i % 5) * 0.3)),
  events: INITIAL_THREAT_EVENTS.map(event => ({ ...event, at: now - parseAgeMs(event.timestamp), isNew: false })),
};

function emit(next: TelemetryState): void {
  state = next;
  listeners.forEach(listener => listener());
}

export function formatAge(at: number, reference = Date.now()): string {
  const seconds = Math.max(0, Math.round((reference - at) / 1000));
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} h ago`;
}

export function injectEvent(severityHint?: ThreatSeverity): FeedEvent {
  const pool = severityHint ? TEMPLATES.filter(template => template.severity === severityHint) : TEMPLATES;
  const template = pool[templateCursor++ % pool.length] ?? TEMPLATES[0];
  const event: FeedEvent = { ...template, id: `TR-${nextId++}`, timestamp: 'just now', at: Date.now(), isNew: true };
  emit({
    ...state,
    events: [event, ...state.events.map(e => ({ ...e, isNew: false }))].slice(0, MAX_EVENTS),
    prevented: state.prevented + (event.status === 'PREVENTED' ? 1 : 0),
    quarantined: state.quarantined + (event.status === 'QUARANTINED' ? 1 : 0),
  });
  return event;
}

function step(): void {
  tick += 1;
  const delta = (Math.random() - 0.48) * 0.5;
  const velocity = Number(Math.max(1.8, Math.min(8.5, state.velocity + delta)).toFixed(1));
  emit({ ...state, velocity, series: [...state.series.slice(-23), Math.round(velocity)] });
  if (tick % 5 === 0) injectEvent();
}

function startTimer(): void {
  if (timer === undefined && state.live && typeof window !== 'undefined') timer = window.setInterval(step, 3000);
}

function stopTimer(): void {
  if (timer !== undefined) {
    window.clearInterval(timer);
    timer = undefined;
  }
}

export function setLive(live: boolean): void {
  emit({ ...state, live });
  if (live) startTimer();
  else stopTimer();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  startTimer();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stopTimer();
  };
}

export function useTelemetry(): TelemetryState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
