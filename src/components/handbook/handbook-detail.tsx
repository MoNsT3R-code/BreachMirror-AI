import React, { useEffect, useState } from 'react';
import { AlertTriangle, Award, Check, CheckCircle2, Code2, FileText, HelpCircle, Play, Radio, ShieldCheck, Volume2, VolumeX, XCircle } from 'lucide-react';
import { XYZ_POLICY_METADATA, XYZ_POLICY_SECTIONS, ThreatVectorGuide } from '../../data/handbook-content';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { SeverityBadge } from '../ui/severity';

type DetailTab = 'blueprint' | 'rules' | 'code' | 'quiz' | 'officialText';

interface HandbookDetailProps {
  vector: ThreatVectorGuide;
  quizAnswers: Record<string, number>;
  onAnswer: (vectorId: string, optionIndex: number) => void;
  onTrackOnRadar?: (vectorId: string) => void;
  pledgeSigned: boolean;
  onTogglePledge: () => void;
  onOpenCredential: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const Callout: React.FC<{ tone: 'safe' | 'crit' | 'neutral'; title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ tone, title, icon, children }) => (
  <div className={`rounded-lg p-4 ${tone === 'safe' ? 'bg-safe-soft' : tone === 'crit' ? 'bg-crit-soft' : 'border border-line bg-surface-2'}`}>
    <p className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${tone === 'safe' ? 'text-safe' : tone === 'crit' ? 'text-crit' : 'text-fg-3'}`}>
      {icon}
      {title}
    </p>
    <div className="mt-2 text-sm text-fg">{children}</div>
  </div>
);

export const HandbookDetail: React.FC<HandbookDetailProps> = ({ vector, quizAnswers, onAnswer, onTrackOnRadar, pledgeSigned, onTogglePledge, onOpenCredential }) => {
  const [tab, setTab] = useState<DetailTab>('blueprint');
  const [stage, setStage] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { soundEnabled } = useAlerts();
  const section = XYZ_POLICY_SECTIONS.find(item => item.id === vector.id) ?? XYZ_POLICY_SECTIONS[0];

  useEffect(() => {
    soundManager.stopSpeaking();
    setSpeaking(false);
    setStage(0);
    if (vector.codeComparison === undefined && tab === 'code') setTab('blueprint');
    return () => soundManager.stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vector.id]);

  const toggleBriefing = () => {
    if (speaking) {
      soundManager.stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    soundManager.speakBriefing(
      `XYZ Information Technology Security Policy Section ${vector.sectionNumber}: ${vector.title}. ${vector.howBreachOccurs.summary}. Primary guideline: ${vector.howToPrevent.goldenRules[0]}`,
      () => setSpeaking(false),
    );
  };

  const playSignature = () => {
    setPlaying(true);
    soundManager.playThreatAlarm(vector.riskLevel, { voiceAlert: soundEnabled, threatName: vector.title });
    window.setTimeout(() => setPlaying(false), 1200);
  };

  const tabs: Array<{ id: DetailTab; label: string; icon: React.ReactNode; show: boolean }> = [
    { id: 'blueprint', label: 'Attack sequence', icon: <Radio className="h-4 w-4" aria-hidden="true" />, show: true },
    { id: 'rules', label: "Do and don't", icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />, show: true },
    { id: 'code', label: 'Policy diff', icon: <Code2 className="h-4 w-4" aria-hidden="true" />, show: vector.codeComparison !== undefined },
    { id: 'quiz', label: 'Instinct quiz', icon: <HelpCircle className="h-4 w-4" aria-hidden="true" />, show: true },
    { id: 'officialText', label: 'Official text', icon: <FileText className="h-4 w-4" aria-hidden="true" />, show: true },
  ];

  const answer = quizAnswers[vector.id];
  const answered = answer !== undefined;

  return (
    <div className="bm-ds space-y-5">
      <header className="space-y-3 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bm-chip">Section {vector.sectionNumber} of 10</span>
          <SeverityBadge severity={vector.riskLevel} />
          <span className="text-xs text-fg-3">{section.page}</span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="bm-h font-display text-xl font-semibold text-fg">{vector.title}</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="bm-btn bm-btn-sm" aria-pressed={speaking} onClick={toggleBriefing}>
              {speaking ? <VolumeX className="h-3.5 w-3.5" aria-hidden="true" /> : <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />}
              {speaking ? 'Stop briefing' : 'Voice briefing'}
            </button>
            <button type="button" className="bm-btn bm-btn-sm" onClick={playSignature} disabled={playing} title="Plays a short tone. Honors the sound setting for voice.">
              <Play className="h-3.5 w-3.5" aria-hidden="true" /> {playing ? 'Playing…' : 'Acoustic signature'}
            </button>
            {onTrackOnRadar && (
              <button type="button" className="bm-btn bm-btn-sm" onClick={() => onTrackOnRadar(vector.id)}>
                <Radio className="h-3.5 w-3.5" aria-hidden="true" /> Track on radar
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-fg-2">{vector.targetAudienceNote}</p>
      </header>

      <div role="tablist" aria-label="Section views" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.filter(item => item.show).map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`hb-detail-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls="hb-detail-panel"
            onClick={() => setTab(item.id)}
            className={`-mb-px inline-flex min-h-10 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium ${tab === item.id ? 'border-accent text-accent-text' : 'border-transparent text-fg-3 hover:text-fg'}`}
          >
            {item.icon}
            {item.label}
            {item.id === 'quiz' && answer === vector.quiz.correctIndex && <Check className="h-3.5 w-3.5 text-safe" aria-label="Answered correctly" />}
          </button>
        ))}
      </div>

      <div id="hb-detail-panel" role="tabpanel" aria-labelledby={`hb-detail-tab-${tab}`} className="space-y-5">
        {tab === 'blueprint' && (
          <>
            <section aria-labelledby="hb-stages">
              <h4 id="hb-stages" className="bm-eyebrow mb-2">Attack progression: select a stage</h4>
              <div role="radiogroup" aria-labelledby="hb-stages" className="grid gap-3 md:grid-cols-3">
                {vector.anatomySteps.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    role="radio"
                    aria-checked={stage === index}
                    onClick={() => setStage(index)}
                    className={`flex flex-col gap-2 rounded-lg border p-4 text-left ${stage === index ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong'}`}
                  >
                    <span className="flex items-center justify-between text-xs">
                      <span className="bm-chip">Stage {index + 1}</span>
                      <span className="text-fg-3">{step.phase}</span>
                    </span>
                    <span className="font-display text-sm font-semibold text-fg">{step.title}</span>
                    <span className="text-sm text-fg-2">{step.description}</span>
                    <span className="mt-auto border-t border-line pt-2 font-mono text-xs text-fg-3">Actor: {step.actor}</span>
                  </button>
                ))}
              </div>
            </section>

            <Callout tone="neutral" title="Realistic workplace scenarios">
              <ul className="list-disc space-y-1.5 pl-5">
                {vector.howBreachOccurs.commonScenarios.map(scenario => (
                  <li key={scenario}>{scenario}</li>
                ))}
              </ul>
              <p className="mt-3 rounded-md bg-sunken p-3 text-xs text-fg-2">
                <span className="font-semibold text-fg">Underlying mechanics:</span> {vector.howBreachOccurs.mechanics}
              </p>
            </Callout>

            <section aria-labelledby="hb-blast">
              <h4 id="hb-blast" className="bm-eyebrow mb-2 flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Downstream blast radius</h4>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['Business impact', vector.downstreamBlastRadius.businessImpact],
                  ['Data at risk', vector.downstreamBlastRadius.dataAtRisk],
                  ['Legal and compliance', vector.downstreamBlastRadius.legalOrCompliance],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-lg border border-line bg-surface p-4">
                    <p className="bm-eyebrow">{label}</p>
                    <p className="mt-1.5 text-sm text-fg-2">{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === 'rules' && (
          <>
            <Callout tone="safe" title="The golden protocols" icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}>
              <ol className="list-decimal space-y-1.5 pl-5">
                {vector.howToPrevent.goldenRules.map(rule => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
            </Callout>
            <div className="grid gap-3 md:grid-cols-2">
              <Callout tone="safe" title="Always do" icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}>
                <ul className="space-y-1.5">
                  {vector.howToPrevent.doList.map(item => (
                    <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-safe" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </Callout>
              <Callout tone="crit" title="Never do" icon={<XCircle className="h-4 w-4" aria-hidden="true" />}>
                <ul className="space-y-1.5">
                  {vector.howToPrevent.dontList.map(item => (
                    <li key={item} className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-crit" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </Callout>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface-2 p-4 text-sm">
              <span className="text-fg-3">Sanctioned tooling:</span>
              {vector.howToPrevent.ApprovedAlternatives.map(alt => (
                <code key={alt} className="rounded bg-sunken px-2 py-0.5 font-mono text-xs text-fg">{alt}</code>
              ))}
            </div>
          </>
        )}

        {tab === 'code' && vector.codeComparison && (
          <div className="space-y-4">
            <p className="text-xs text-fg-3">Format: <span className="font-semibold uppercase text-fg-2">{vector.codeComparison.language}</span> · side-by-side compliance review</p>
            <Callout tone="crit" title={`Non-compliant: ${vector.codeComparison.badLabel}`} icon={<XCircle className="h-4 w-4" aria-hidden="true" />}>
              <pre className="overflow-x-auto rounded-md bg-sunken p-3 font-mono text-xs text-fg" tabIndex={0}><code>{vector.codeComparison.badCode}</code></pre>
              <p className="mt-2 text-fg-2"><span className="font-semibold text-fg">Risk:</span> {vector.codeComparison.badReason}</p>
            </Callout>
            <Callout tone="safe" title={`Sanctioned: ${vector.codeComparison.goodLabel}`} icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}>
              <pre className="overflow-x-auto rounded-md bg-sunken p-3 font-mono text-xs text-fg" tabIndex={0}><code>{vector.codeComparison.goodCode}</code></pre>
              <p className="mt-2 text-fg-2"><span className="font-semibold text-fg">Benefit:</span> {vector.codeComparison.goodReason}</p>
            </Callout>
          </div>
        )}

        {tab === 'quiz' && (
          <section aria-labelledby="hb-quiz-q" className="space-y-4 rounded-lg border border-line bg-surface p-5">
            <p className="bm-eyebrow">Instinct challenge · Section {vector.sectionNumber}: {vector.category}</p>
            <h4 id="hb-quiz-q" className="bm-h font-display text-lg font-semibold text-fg">{vector.quiz.question}</h4>
            <div role="radiogroup" aria-labelledby="hb-quiz-q" className="space-y-2">
              {vector.quiz.options.map((option, index) => {
                const chosen = answer === index;
                const correct = index === vector.quiz.correctIndex;
                const reveal = answered && (chosen || correct);
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={chosen}
                    disabled={answered}
                    onClick={() => onAnswer(vector.id, index)}
                    className={`flex w-full items-start gap-3 rounded-md border p-3.5 text-left ${!reveal ? 'border-line bg-surface hover:border-line-strong' : correct ? 'border-transparent bg-safe-soft' : 'border-transparent bg-crit-soft'} ${answered && !reveal ? 'opacity-60' : ''}`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded font-mono text-xs font-semibold ${reveal ? (correct ? 'bg-safe text-surface' : 'bg-crit text-surface') : 'bg-sunken text-fg-2'}`}>
                      {reveal ? (correct ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <XCircle className="h-3.5 w-3.5" aria-hidden="true" />) : LETTERS[index]}
                    </span>
                    <span className="flex-1 text-sm text-fg">
                      {option}
                      {reveal && <span className={`mt-0.5 block text-xs font-semibold ${correct ? 'text-safe' : 'text-crit'}`}>{correct ? (chosen ? 'Correct' : 'Correct answer') : 'Your answer'}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <div aria-live="polite">
              {answered && (
                <div className="bm-pop rounded-md border border-line bg-surface-2 p-4 text-sm">
                  <p className={`font-semibold ${answer === vector.quiz.correctIndex ? 'text-safe' : 'text-crit'}`}>{answer === vector.quiz.correctIndex ? 'Instinct verified: that is the XYZ protocol.' : 'Review the policy requirement.'}</p>
                  <p className="mt-1 text-fg-2">{vector.quiz.explanation}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'officialText' && (
          <article className="space-y-4 rounded-lg border border-line bg-surface p-5" aria-labelledby="hb-official">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-3">
              <div>
                <p className="bm-eyebrow">Official verbatim policy · {section.page}</p>
                <h4 id="hb-official" className="bm-h font-display text-lg font-semibold text-fg">{section.title}</h4>
              </div>
              <span className="bm-chip">{XYZ_POLICY_METADATA.copyright}</span>
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-fg-2">{section.fullText}</div>
            <Callout tone="safe" title="Directives summary">
              <ul className="list-disc space-y-1 pl-5">
                {section.keyDirectives.map(directive => (
                  <li key={directive}>{directive}</li>
                ))}
              </ul>
            </Callout>
          </article>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-line bg-surface-2 p-4 sm:flex-row sm:items-center">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={pledgeSigned} onChange={onTogglePledge} className="mt-1 h-5 w-5 shrink-0 accent-[var(--bm-accent)]" />
          <span>
            <span className="block text-sm font-semibold text-fg">XYZ IT security and usage acknowledgment</span>
            <span className="block text-xs text-fg-3">I acknowledge receipt of Policy v7.0 and commit to upholding XYZ's information security standards and prompt incident reporting.</span>
          </span>
        </label>
        <button type="button" className="bm-btn bm-btn-primary shrink-0" onClick={onOpenCredential}>
          <Award className="h-4 w-4" aria-hidden="true" /> View credential
        </button>
      </div>
    </div>
  );
};
