import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Check, Printer, RotateCcw, X } from 'lucide-react';
import { COMPREHENSIVE_QUIZ_QUESTIONS } from '../../data/certification-questions';
import { examResult, PASS_MARK, recordActivity } from '../../services/learning-progress';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { ProgressRing } from '../learning/progress-ring';
import { Dialog } from '../ui/dialog';

interface CertificationQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
}

type Filter = 'ALL' | 'IT_SECURITY' | 'CODE_CONDUCT';

const STORAGE_KEY = 'xyz_master_quiz_answers';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function loadAnswers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function certificateId(name: string, date: string): string {
  let hash = 0;
  for (const char of `${name}|${date}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `BM-${date.replace(/-/g, '')}-${hash.toString(16).toUpperCase().padStart(8, '0').slice(0, 6)}`;
}

export const CertificationQuizModal: React.FC<CertificationQuizModalProps> = ({ isOpen, onClose, userName, userRole }) => {
  const [answers, setAnswers] = useState<Record<string, number>>(loadAnswers);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [index, setIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { soundEnabled } = useAlerts();

  useEffect(() => {
    if (isOpen) {
      setAnswers(loadAnswers());
      setShowResults(false);
    }
  }, [isOpen]);

  const questions = useMemo(
    () =>
      COMPREHENSIVE_QUIZ_QUESTIONS.filter(q =>
        filter === 'ALL' ? true : filter === 'IT_SECURITY' ? q.sourceDoc === 'IT_SECURITY_POLICY_V7' : q.sourceDoc === 'CODE_OF_BUSINESS_CONDUCT',
      ),
    [filter],
  );
  const current = questions[Math.min(index, questions.length - 1)];
  const result = examResult(answers);
  const selected = current ? answers[current.id] : undefined;
  const answered = selected !== undefined;

  const choose = (optionIndex: number) => {
    if (!current || answered) return;
    const next = { ...answers, [current.id]: optionIndex };
    setAnswers(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable: answers last for this session only
    }
    recordActivity();
    if (soundEnabled) (optionIndex === current.correctIndex ? soundManager.playQuizSuccess() : soundManager.playBlip(300));
  };

  const reset = () => {
    setAnswers({});
    setIndex(0);
    setShowResults(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const goTo = (target: number) => {
    setShowResults(false);
    setIndex(Math.max(0, Math.min(questions.length - 1, target)));
  };

  const today = new Date().toISOString().slice(0, 10);
  const status = (id: string, correctIndex: number): 'unanswered' | 'correct' | 'incorrect' =>
    answers[id] === undefined ? 'unanswered' : answers[id] === correctIndex ? 'correct' : 'incorrect';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Certification exam"
      description={`IT security policy v7.0 and Code of Business Conduct. Answer every question and score at least ${PASS_MARK}% to certify.`}
      size="xl"
    >
      <div className="bm-ds space-y-5 p-4 sm:p-6">
        {/* Progress and controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProgressRing value={result.total ? (result.answered / result.total) * 100 : 0} label="Questions answered" size={72} stroke={7}>
              <span className="text-base">{result.answered}/{result.total}</span>
            </ProgressRing>
            <div>
              <p className="text-sm font-semibold text-fg">{result.correct} correct so far</p>
              <p className="text-xs text-fg-3">{result.answered === 0 ? 'No answers yet' : `${result.percent}% of all questions · ${PASS_MARK}% to pass`}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div role="radiogroup" aria-label="Question source" className="inline-flex rounded-md border border-line-strong bg-sunken p-0.5">
              {([['ALL', 'All'], ['IT_SECURITY', 'IT security'], ['CODE_CONDUCT', 'Conduct']] as Array<[Filter, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={filter === value}
                  onClick={() => {
                    setFilter(value);
                    setIndex(0);
                    setShowResults(false);
                  }}
                  className={`min-h-8 rounded px-3 text-xs font-semibold ${filter === value ? 'bg-surface text-fg shadow-card' : 'text-fg-3 hover:text-fg'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="button" className="bm-btn bm-btn-sm" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
            </button>
          </div>
        </div>

        {/* Navigator */}
        <nav aria-label="Question navigator">
          <ol className="flex flex-wrap gap-1.5">
            {questions.map((q, position) => {
              const state = status(q.id, q.correctIndex);
              const active = !showResults && position === index;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => goTo(position)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`Question ${position + 1}, ${state}`}
                    className={`grid h-8 min-w-8 place-items-center rounded-md border px-1 font-mono text-xs font-semibold ${
                      active ? 'border-accent ring-2 ring-accent' : 'border-transparent'
                    } ${state === 'correct' ? 'bg-safe-soft text-safe' : state === 'incorrect' ? 'bg-crit-soft text-crit' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}
                  >
                    {state === 'correct' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : state === 'incorrect' ? <X className="h-3.5 w-3.5" aria-hidden="true" /> : position + 1}
                  </button>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={() => setShowResults(true)} disabled={result.answered < result.total} className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold ${showResults ? 'border-accent ring-2 ring-accent' : 'border-line bg-surface hover:bg-sunken'} disabled:opacity-50`}>
                <Award className="h-3.5 w-3.5" aria-hidden="true" /> Results
              </button>
            </li>
          </ol>
        </nav>

        {showResults ? (
          <Results
            result={result}
            userName={userName}
            userRole={userRole}
            date={today}
            onReview={() => {
              const firstWrong = questions.findIndex(q => status(q.id, q.correctIndex) === 'incorrect');
              goTo(firstWrong < 0 ? 0 : firstWrong);
            }}
            onRetake={reset}
          />
        ) : current ? (
          <section aria-labelledby="exam-question" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-fg-3">
              <span className="bm-chip">Question {index + 1} of {questions.length}</span>
              <span className="bm-chip">{current.sourceDoc === 'IT_SECURITY_POLICY_V7' ? 'IT security policy' : 'Code of conduct'}</span>
              <span>{current.sectionOrPillar} · {current.pageCitation}</span>
            </div>
            <p className="bm-eyebrow">{current.topicTitle}</p>
            <h3 id="exam-question" className="bm-h font-display text-xl font-semibold leading-snug text-fg sm:text-2xl">{current.question}</h3>

            <div role="radiogroup" aria-labelledby="exam-question" className="space-y-2">
              {current.options.map((option, optionIndex) => {
                const isChosen = selected === optionIndex;
                const isCorrect = optionIndex === current.correctIndex;
                const reveal = answered && (isChosen || isCorrect);
                const tone = !reveal ? 'border-line bg-surface hover:border-line-strong hover:bg-surface-2' : isCorrect ? 'border-transparent bg-safe-soft' : 'border-transparent bg-crit-soft';
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    role="radio"
                    aria-checked={isChosen}
                    disabled={answered}
                    onClick={() => choose(optionIndex)}
                    className={`flex w-full items-start gap-3 rounded-md border p-3.5 text-left ${tone} ${answered && !reveal ? 'opacity-60' : ''}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded font-mono text-xs font-semibold ${reveal ? (isCorrect ? 'bg-safe text-surface' : 'bg-crit text-surface') : 'bg-sunken text-fg-2'}`}>
                      {reveal ? (isCorrect ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />) : LETTERS[optionIndex]}
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-fg">
                      {option}
                      {reveal && (
                        <span className={`mt-1 block text-xs font-semibold ${isCorrect ? 'text-safe' : 'text-crit'}`}>
                          {isCorrect ? (isChosen ? 'Correct' : 'Correct answer') : 'Your answer'}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite">
              {answered && (
                <div className="bm-pop space-y-3 rounded-lg border border-line bg-surface-2 p-4">
                  <p className={`text-sm font-semibold ${selected === current.correctIndex ? 'text-safe' : 'text-crit'}`}>
                    {selected === current.correctIndex ? 'That is correct.' : 'Not quite. Here is why.'}
                  </p>
                  <p className="text-sm text-fg-2">{current.explanation}</p>
                  {current.policyDirectives.length > 0 && (
                    <div>
                      <p className="bm-eyebrow mb-1">Policy directives</p>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-fg-2">
                        {current.policyDirectives.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-fg-3"><span className="font-semibold text-fg-2">Source:</span> {current.sourceTitle}, {current.pageCitation}. <span className="font-semibold text-fg-2">Contact:</span> {current.contactOrAction}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
              <button type="button" className="bm-btn" onClick={() => goTo(index - 1)} disabled={index === 0}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous
              </button>
              {index === questions.length - 1 ? (
                <button type="button" className="bm-btn bm-btn-primary" onClick={() => setShowResults(true)} disabled={result.answered < result.total}>
                  See results <Award className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="button" className="bm-btn bm-btn-primary" onClick={() => goTo(index + 1)}>
                  Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {index === questions.length - 1 && result.answered < result.total && (
              <p className="text-right text-xs text-fg-3">Answer all {result.total} questions to see your results.</p>
            )}
          </section>
        ) : null}
      </div>
    </Dialog>
  );
};

interface ResultsProps {
  result: ReturnType<typeof examResult>;
  userName: string;
  userRole: string;
  date: string;
  onReview: () => void;
  onRetake: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, userName, userRole, date, onReview, onRetake }) => (
  <section aria-labelledby="exam-results" className="space-y-5">
    <div className="flex flex-wrap items-center gap-5 rounded-lg border border-line bg-surface-2 p-5">
      <ProgressRing value={result.percent} label="Exam score" size={104} stroke={9} tone={result.passed ? 'safe' : 'accent'}>
        <span className="text-2xl">{result.percent}%</span>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <h3 id="exam-results" className="bm-h font-display text-2xl font-semibold text-fg">
          {result.passed ? 'You passed' : result.percent >= PASS_MARK ? 'Almost there' : 'Not yet certified'}
        </h3>
        <p className="mt-1 text-sm text-fg-2">
          {result.correct} of {result.total} correct. {result.passed ? 'Your certificate is ready below.' : `You need ${PASS_MARK}% to certify. Review the questions you missed and try again.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {!result.passed && (
            <button type="button" className="bm-btn bm-btn-primary" onClick={onReview}>Review missed questions</button>
          )}
          <button type="button" className="bm-btn" onClick={onRetake}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake exam
          </button>
        </div>
      </div>
    </div>

    {result.passed && (
      <div className="space-y-3">
        <div id="bm-certificate" className="bm-pop mx-auto max-w-2xl rounded-xl border-2 border-line-strong bg-surface p-8 text-center shadow-raised">
          <svg width="44" height="44" viewBox="0 0 32 32" className="mx-auto" role="img" aria-label="BreachMirror seal">
            <path d="M16 3 L5 7 V15 C5 21.5 9.6 26.6 16 29 Z" fill="none" stroke="var(--bm-brand-crimson)" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="2.6 2.2" />
            <path d="M16 3 L27 7 V15 C27 21.5 22.4 26.6 16 29 Z" fill="var(--bm-brand-crimson)" />
          </svg>
          <p className="bm-eyebrow mt-3">Certificate of completion</p>
          <p className="mt-4 text-sm text-fg-3">This certifies that</p>
          <p className="bm-h mt-1 font-display text-3xl font-semibold text-fg">{userName}</p>
          <p className="text-sm text-fg-3">{userRole}</p>
          <p className="mx-auto mt-4 max-w-md text-sm text-fg-2">
            passed the XYZ IT Security Policy v7.0 and Code of Business Conduct certification exam with a score of <strong className="text-fg">{result.percent}%</strong>.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-left text-xs text-fg-3">
            <div><dt className="bm-eyebrow">Issued</dt><dd className="mt-0.5 font-mono text-sm text-fg">{date}</dd></div>
            <div className="text-right"><dt className="bm-eyebrow">Certificate ID</dt><dd className="mt-0.5 font-mono text-sm text-fg">{certificateId(userName, date)}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-fg-3">Issued by a local training simulation. Not an official credential.</p>
        </div>
        <div className="flex justify-center">
          <button type="button" className="bm-btn" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" /> Print certificate
          </button>
        </div>
      </div>
    )}
  </section>
);
