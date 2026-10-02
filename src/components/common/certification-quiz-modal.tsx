import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Scale, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Printer, 
  X, 
  Sparkles,
  ExternalLink,
  Lock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { 
  COMPREHENSIVE_QUIZ_QUESTIONS, 
  TOTAL_QUESTIONS_COUNT,
  IT_SECURITY_QUESTIONS_COUNT,
  CODE_OF_CONDUCT_QUESTIONS_COUNT
} from '../../data/certification-questions';
import { ComprehensiveQuizQuestion } from '../../shared-types';
import { soundManager } from '../../services/sound-effects';

interface CertificationQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
}

export const CertificationQuizModal: React.FC<CertificationQuizModalProps> = ({
  isOpen,
  onClose,
  userName,
  userRole,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IT_SECURITY' | 'CODE_CONDUCT'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showCertificate, setShowCertificate] = useState(false);

  // Load persisted answers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('stewart_master_quiz_answers');
        if (saved) {
          setAnswers(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to load quiz progress', err);
      }
    }
  }, []);

  const filteredQuestions = useMemo(() => {
    if (activeFilter === 'IT_SECURITY') {
      return COMPREHENSIVE_QUIZ_QUESTIONS.filter(q => q.sourceDoc === 'IT_SECURITY_POLICY_V7');
    }
    if (activeFilter === 'CODE_CONDUCT') {
      return COMPREHENSIVE_QUIZ_QUESTIONS.filter(q => q.sourceDoc === 'CODE_OF_BUSINESS_CONDUCT');
    }
    return COMPREHENSIVE_QUIZ_QUESTIONS;
  }, [activeFilter]);

  // Keep index within bounds when filter changes
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQ: ComprehensiveQuizQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const selectedOption = currentQ ? answers[currentQ.id] : undefined;
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === currentQ.correctIndex;

  // Calculate statistics
  const totalAnswered = Object.keys(answers).length;
  const correctCount = Object.keys(answers).filter(qId => {
    const q = COMPREHENSIVE_QUIZ_QUESTIONS.find(item => item.id === qId);
    return q && answers[qId] === q.correctIndex;
  }).length;

  const scorePercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const isAllAnswered = totalAnswered === TOTAL_QUESTIONS_COUNT;
  const isCertified = isAllAnswered && scorePercentage >= 80;

  const handleSelectOption = (index: number) => {
    if (selectedOption !== undefined) return; // Prevent changing after answered for integrity
    const newAnswers = { ...answers, [currentQ.id]: index };
    setAnswers(newAnswers);
    localStorage.setItem('stewart_master_quiz_answers', JSON.stringify(newAnswers));

    if (index === currentQ.correctIndex) {
      soundManager.playQuizSuccess();
    } else {
      soundManager.playQuizTryAgain();
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your quiz answers and start over?')) {
      setAnswers({});
      localStorage.removeItem('stewart_master_quiz_answers');
      setCurrentIndex(0);
      setShowCertificate(false);
      soundManager.playBlip(600);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-white/15 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Skeuomorphic Metallic Header */}
        <header className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="quiz-modal-title" className="text-base sm:text-lg font-bold text-white font-display tracking-wide">
                  Stewart security and conduct quiz
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  2026 edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Covers IT Security Policy v7.0 and Code of Business Conduct
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Exam (Esc)"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tactical Sub-Nav & Stats Meter */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs font-mono">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => { setActiveFilter('ALL'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              All questions ({TOTAL_QUESTIONS_COUNT})
            </button>

            <button
              onClick={() => { setActiveFilter('IT_SECURITY'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeFilter === 'IT_SECURITY'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>IT Security v7.0 ({IT_SECURITY_QUESTIONS_COUNT})</span>
            </button>

            <button
              onClick={() => { setActiveFilter('CODE_CONDUCT'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeFilter === 'CODE_CONDUCT'
                  ? 'bg-[#9B2743] text-white shadow-[0_0_12px_rgba(155,39,67,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Code of Conduct ({CODE_OF_CONDUCT_QUESTIONS_COUNT})</span>
            </button>
          </div>

          {/* Real-time Progress & Score HUD */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Correct:</span>
              <span className="font-bold text-cyan-400">{correctCount} / {TOTAL_QUESTIONS_COUNT}</span>
              <span className="text-slate-500">({scorePercentage}%)</span>
            </div>

            {isCertified && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-emerald-400 cursor-pointer animate-pulse"
              >
                <Award className="w-3.5 h-3.5" />
                View Official Certificate
              </button>
            )}

            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 hover:underline cursor-pointer"
              title="Reset all exam answers"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Segmented Question Progress Track */}
        <div className="px-6 py-2 bg-slate-950 border-b border-white/5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {filteredQuestions.map((q, idx) => {
            const ans = answers[q.id];
            const hasAnswer = ans !== undefined;
            const isRight = hasAnswer && ans === q.correctIndex;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center justify-center border ${
                  isCurrent
                    ? 'ring-2 ring-cyan-400 border-white text-white'
                    : 'border-transparent'
                } ${
                  hasAnswer
                    ? isRight
                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/25 text-rose-300 border-rose-500/40'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
                title={`Question ${idx + 1}: ${q.topicTitle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Question */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentQ && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
              {/* Question Metadata & Source Citation */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    currentQ.sourceDoc === 'IT_SECURITY_POLICY_V7'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'bg-[#9B2743]/20 text-rose-300 border border-[#9B2743]/40'
                  }`}>
                    {currentQ.sourceDoc === 'IT_SECURITY_POLICY_V7' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <Scale className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase font-display">
                        {currentQ.sectionOrPillar}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {currentQ.pageCitation}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      {currentQ.sourceTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-slate-400">
                  Question {currentIndex + 1} of {filteredQuestions.length}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {currentQ.topicTitle}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Interactive Skeuomorphic Option Buttons */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrectChoice = optIdx === currentQ.correctIndex;

                  let cardStyle = 'bg-slate-950/60 hover:bg-slate-800/80 border-white/10 text-slate-200';

                  if (isAnswered) {
                    if (isCorrectChoice) {
                      cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                    } else if (isSelected) {
                      cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
                    } else {
                      cardStyle = 'opacity-40 border-white/5 bg-slate-950/30';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${cardStyle} ${
                        !isAnswered ? 'hover:border-cyan-500/40 hover:scale-[1.008]' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                        isAnswered && isCorrectChoice
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : isAnswered && isSelected
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-white/10 text-slate-300 border-white/10'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>

                      <div className="flex-1 text-sm font-sans leading-normal">
                        {option}
                      </div>

                      {isAnswered && isCorrectChoice && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isCorrectChoice && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Post-Answer Detailed Explanation & Policy Citing Banner */}
              {isAnswered && (
                <div className={`p-5 rounded-2xl border space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30'
                    : 'bg-rose-950/30 border-rose-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 tracking-wide flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct answer
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Not quite
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                      Key guidance for this section:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {currentQ.policyDirectives.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Contact: {currentQ.contactOrAction}</span>
                    <span className="text-cyan-400 font-semibold">{currentQ.sourceTitle}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer: Navigation Controls */}
        <footer className="px-6 py-4 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            Use Question Numbers at top or buttons to navigate
          </div>

          <div className="flex items-center gap-2">
            {currentIndex < filteredQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Next Directive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowCertificate(true)}
                disabled={!isAllAnswered}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Award className="w-4 h-4" />
                <span>Complete Certification</span>
              </button>
            )}
          </div>
        </footer>

        {/* Pop-up Certificate Viewer */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl p-8 rounded-3xl bg-white text-slate-900 shadow-2xl border-4 border-[#9B2743] space-y-6 text-center font-sans">
              <button
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Stewart Information Services Corporation • Annual Audit
                </p>
                <h3 className="text-2xl font-bold text-slate-950 font-display">
                  Certificate of Information Security &amp; Conduct Compliance
                </h3>
              </div>

              <div className="py-4 border-y border-slate-200 space-y-2">
                <p className="text-sm text-slate-600">This certifies that</p>
                <h4 className="text-2xl font-bold text-[#9B2743] font-serif uppercase tracking-wide">
                  {userName || 'Stewart Employee / Internee'}
                </h4>
                <p className="text-xs text-slate-500">Role: {userRole.toUpperCase()}</p>
                <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed pt-2">
                  has successfully reviewed and demonstrated 100% compliance knowledge across all 10 sections of the <strong>Information Technology Security &amp; Usage Policy (v7.0)</strong> and all 5 pillars of <strong>Our Code of Business Conduct ("Integrity is at Home Here")</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 px-4">
                <div>
                  <span className="block font-bold text-slate-700">Audit Score:</span>
                  <span>{correctCount} / {TOTAL_QUESTIONS_COUNT} ({scorePercentage}%)</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-700">Verification Hash:</span>
                  <span>SIS-CERT-{Date.now().toString(36).toUpperCase()}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-700">Date Issued:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Official Certificate
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Return to Exam
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
