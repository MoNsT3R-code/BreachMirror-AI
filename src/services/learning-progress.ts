import { COMPREHENSIVE_QUIZ_QUESTIONS } from '../data/certification-questions';
import { AUDIT_CHECKLIST_ITEMS, FLASHCARD_DRILLS } from '../data/handbook-lab-content';

const ACTIVITY_KEY = 'bm_activity_days';
const FLASHCARD_KEY = 'bm_flashcards_mastered';
export const PASS_MARK = 80;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable: progress lasts for this session only
  }
}

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

/** Marks today as a learning day (drives the streak). */
export function recordActivity(): void {
  const days = readJson<string[]>(ACTIVITY_KEY, []);
  const today = dayKey(new Date());
  if (days[days.length - 1] === today) return;
  writeJson(ACTIVITY_KEY, [...days.filter(day => day !== today), today].slice(-90));
}

/** Consecutive learning days ending today (or yesterday, so a streak survives until midnight). */
export function currentStreak(): number {
  const days = new Set(readJson<string[]>(ACTIVITY_KEY, []));
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const loadMasteredCards = (): string[] => readJson<string[]>(FLASHCARD_KEY, []);
export const saveMasteredCards = (ids: string[]): void => writeJson(FLASHCARD_KEY, ids);

export interface ExamResult {
  answered: number;
  total: number;
  correct: number;
  percent: number;
  passed: boolean;
}

export function examResult(answers: Record<string, number>): ExamResult {
  const total = COMPREHENSIVE_QUIZ_QUESTIONS.length;
  const answered = COMPREHENSIVE_QUIZ_QUESTIONS.filter(q => answers[q.id] !== undefined).length;
  const correct = COMPREHENSIVE_QUIZ_QUESTIONS.filter(q => answers[q.id] === q.correctIndex).length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { answered, total, correct, percent, passed: answered === total && percent >= PASS_MARK };
}

export type MilestoneId = 'audit' | 'it-pledge' | 'conduct-pledge' | 'flashcards' | 'exam';

export interface Milestone {
  id: MilestoneId;
  label: string;
  detail: string;
  done: boolean;
  /** Which tool continues this milestone. */
  tool: 'handbook' | 'conduct' | 'exam';
}

export interface Journey {
  milestones: Milestone[];
  completed: number;
  percent: number;
  streak: number;
  next: Milestone | null;
}

export function computeJourney(): Journey {
  const checks = readJson<string[]>('xyz_sentinel_audit_checks', ['chk-1', 'chk-2', 'chk-4', 'chk-8']);
  const auditPoints = AUDIT_CHECKLIST_ITEMS.filter(item => checks.includes(item.id)).reduce((sum, item) => sum + item.points, 0);
  const mastered = loadMasteredCards().length;
  const exam = examResult(readJson<Record<string, number>>('xyz_master_quiz_answers', {}));
  const flag = (key: string) => localStorage.getItem(key) === 'true';

  const milestones: Milestone[] = [
    { id: 'audit', label: 'Complete the readiness audit', detail: `${auditPoints} of 70 points needed`, done: auditPoints >= 70, tool: 'handbook' },
    { id: 'it-pledge', label: 'Sign the IT security pledge', detail: 'In the security handbook', done: flag('xyz_policy_pledge_signed'), tool: 'handbook' },
    { id: 'conduct-pledge', label: 'Sign the code of conduct pledge', detail: 'In the code of conduct', done: flag('xyz_code_conduct_pledge_signed'), tool: 'conduct' },
    { id: 'flashcards', label: 'Master the speed-drill cards', detail: `${mastered} of ${FLASHCARD_DRILLS.length} mastered`, done: mastered >= FLASHCARD_DRILLS.length, tool: 'handbook' },
    { id: 'exam', label: `Pass the certification exam (${PASS_MARK}%)`, detail: `${exam.answered} of ${exam.total} answered, ${exam.percent}% correct`, done: exam.passed, tool: 'exam' },
  ];
  const completed = milestones.filter(milestone => milestone.done).length;
  return {
    milestones,
    completed,
    percent: Math.round((completed / milestones.length) * 100),
    streak: currentStreak(),
    next: milestones.find(milestone => !milestone.done) ?? null,
  };
}
