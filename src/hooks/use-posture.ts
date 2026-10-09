import { useEffect, useMemo, useState } from 'react';
import { COMPREHENSIVE_QUIZ_QUESTIONS as CERTIFICATION_QUESTIONS } from '../data/certification-questions';
import { AUDIT_CHECKLIST_ITEMS } from '../data/handbook-lab-content';
import { DefconLevel } from '../context/alert-context';

const HISTORY_KEY = 'bm_posture_history';
const MAX_HISTORY = 30;

export type PostureBand = 'strong' | 'steady' | 'watch' | 'at-risk';

export interface PostureFactor {
  id: string;
  label: string;
  /** 0-100 */
  value: number;
  detail: string;
}

export interface PostureSnapshot {
  score: number;
  band: PostureBand;
  bandLabel: string;
  readiness: number;
  pressure: number;
  factors: PostureFactor[];
  /** Change versus the most recent earlier day, or null while a baseline is being built. */
  delta: number | null;
  history: number[];
}

interface HistoryEntry {
  d: string;
  s: number;
}

const DEFCON_PRESSURE: Record<DefconLevel, number> = { 5: 10, 4: 30, 3: 50, 2: 75, 1: 95 };
const DEFAULT_AUDIT_CHECKS = ['chk-1', 'chk-2', 'chk-4', 'chk-8'];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function pct(part: number, whole: number): number {
  return whole <= 0 ? 0 : Math.round((part / whole) * 100);
}

export function bandFor(score: number): { band: PostureBand; label: string } {
  if (score >= 80) return { band: 'strong', label: 'Strong' };
  if (score >= 60) return { band: 'steady', label: 'Steady' };
  if (score >= 40) return { band: 'watch', label: 'Needs attention' };
  return { band: 'at-risk', label: 'At risk' };
}

/**
 * Posture = 80% readiness (what you have learned and signed) + 20% calm
 * (inverse of simulated threat pressure from the alert level and practice drills).
 */
export function computePosture(defcon: DefconLevel, simulatedThreats: number): Omit<PostureSnapshot, 'delta' | 'history'> {
  const answers = readJson<Record<string, number>>('xyz_master_quiz_answers', {});
  const correct = CERTIFICATION_QUESTIONS.filter(q => answers[q.id] === q.correctIndex).length;
  const knowledge = pct(correct, CERTIFICATION_QUESTIONS.length);

  const checks = readJson<string[]>('xyz_sentinel_audit_checks', DEFAULT_AUDIT_CHECKS);
  const maxPoints = AUDIT_CHECKLIST_ITEMS.reduce((sum, item) => sum + item.points, 0);
  const earned = AUDIT_CHECKLIST_ITEMS.filter(item => checks.includes(item.id)).reduce((sum, item) => sum + item.points, 0);
  const audit = pct(earned, maxPoints);

  const pledgesSigned = ['xyz_policy_pledge_signed', 'xyz_code_conduct_pledge_signed'].filter(key => localStorage.getItem(key) === 'true').length;
  const pledges = pct(pledgesSigned, 2);

  const readiness = Math.round(knowledge * 0.4 + audit * 0.35 + pledges * 0.25);
  const pressure = Math.min(100, DEFCON_PRESSURE[defcon] + Math.min(15, simulatedThreats * 5));
  const score = Math.round(readiness * 0.8 + (100 - pressure) * 0.2);
  const { band, label } = bandFor(score);

  return {
    score,
    band,
    bandLabel: label,
    readiness,
    pressure,
    factors: [
      { id: 'knowledge', label: 'Certification exam', value: knowledge, detail: `${correct} of ${CERTIFICATION_QUESTIONS.length} answers correct` },
      { id: 'audit', label: 'Readiness audit', value: audit, detail: `${earned} of ${maxPoints} points` },
      { id: 'pledges', label: 'Policy pledges', value: pledges, detail: `${pledgesSigned} of 2 signed` },
    ],
  };
}

/** Recomputes whenever `version` changes (bumped when a learning modal closes). */
export function usePosture(defcon: DefconLevel, simulatedThreats: number, version: number): PostureSnapshot {
  const base = useMemo(() => computePosture(defcon, simulatedThreats), [defcon, simulatedThreats, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const [history, setHistory] = useState<HistoryEntry[]>(() => readJson<HistoryEntry[]>(HISTORY_KEY, []));

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.d === today && last.s === base.score) return prev;
      const withoutToday = last && last.d === today ? prev.slice(0, -1) : prev;
      const next = [...withoutToday, { d: today, s: base.score }].slice(-MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable: trend stays in memory
      }
      return next;
    });
  }, [base.score]);

  const today = new Date().toISOString().slice(0, 10);
  const earlier = history.filter(entry => entry.d < today);
  const delta = earlier.length > 0 ? base.score - earlier[earlier.length - 1].s : null;
  return { ...base, delta, history: history.map(entry => entry.s) };
}
