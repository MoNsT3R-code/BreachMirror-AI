import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { COMPREHENSIVE_QUIZ_QUESTIONS } from '../src/data/certification-questions';

// Minimal in-memory localStorage for the browser-only module under test.
const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => void store.set(key, String(value)),
  removeItem: key => void store.delete(key),
  clear: () => store.clear(),
  key: index => Array.from(store.keys())[index] ?? null,
  get length() {
    return store.size;
  },
};

const { computeJourney, currentStreak, examResult, PASS_MARK, recordActivity } = await import('../src/services/learning-progress');
const { formatAge } = await import('../src/services/live-telemetry');

beforeEach(() => store.clear());

const day = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

test('exam passes only when every question is answered and the score reaches the pass mark', () => {
  const all = Object.fromEntries(COMPREHENSIVE_QUIZ_QUESTIONS.map(q => [q.id, q.correctIndex]));
  assert.equal(examResult(all).passed, true);
  assert.equal(examResult(all).percent, 100);

  const partial = Object.fromEntries(COMPREHENSIVE_QUIZ_QUESTIONS.slice(0, 5).map(q => [q.id, q.correctIndex]));
  assert.equal(examResult(partial).passed, false, 'unanswered questions block certification');

  const wrong = Object.fromEntries(COMPREHENSIVE_QUIZ_QUESTIONS.map(q => [q.id, (q.correctIndex + 1) % q.options.length]));
  assert.equal(examResult(wrong).passed, false);
  assert.ok(examResult(wrong).percent < PASS_MARK);
});

test('streak counts consecutive learning days and survives until midnight', () => {
  assert.equal(currentStreak(), 0);
  store.set('bm_activity_days', JSON.stringify([day(-3), day(-2), day(-1), day(0)]));
  assert.equal(currentStreak(), 4);
  store.set('bm_activity_days', JSON.stringify([day(-2), day(-1)]));
  assert.equal(currentStreak(), 2, 'yesterday still counts');
  store.set('bm_activity_days', JSON.stringify([day(-5), day(-4)]));
  assert.equal(currentStreak(), 0, 'a gap resets the streak');
});

test('recordActivity is idempotent within a day', () => {
  recordActivity();
  recordActivity();
  assert.deepEqual(JSON.parse(store.get('bm_activity_days') ?? '[]'), [day(0)]);
});

test('journey advances as milestones are completed', () => {
  assert.ok(computeJourney().next, 'a fresh learner has a next step');
  store.set('xyz_policy_pledge_signed', 'true');
  store.set('xyz_code_conduct_pledge_signed', 'true');
  const journey = computeJourney();
  assert.equal(journey.milestones.find(m => m.id === 'it-pledge')?.done, true);
  assert.equal(journey.milestones.find(m => m.id === 'conduct-pledge')?.done, true);
  assert.ok(journey.completed >= 2);
});

test('relative ages read naturally', () => {
  const now = 1_000_000_000;
  assert.equal(formatAge(now - 3_000, now), 'just now');
  assert.equal(formatAge(now - 42_000, now), '42 s ago');
  assert.equal(formatAge(now - 8 * 60_000, now), '8 min ago');
  assert.equal(formatAge(now - 3 * 3_600_000, now), '3 h ago');
});
