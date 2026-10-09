import React from 'react';
import { Check, CornerDownRight, FileSearch, GitMerge, Filter, Headset, PenLine, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import { PipelineStep } from '../../services/local-api';

/**
 * Live view of the LangGraph pipeline. Each node lights up as its server-sent
 * step arrives; the alternative branches (safe response, self-correction and
 * extractive fallback) appear only when the graph takes them.
 */

const MAIN: Array<{ id: string; label: string; icon: React.ReactNode }> = [
  { id: 'guard', label: 'Guard', icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
  { id: 'rewrite', label: 'Rewrite', icon: <Wand2 className="h-4 w-4" aria-hidden="true" /> },
  { id: 'retrieve', label: 'Retrieve', icon: <FileSearch className="h-4 w-4" aria-hidden="true" /> },
  { id: 'grade', label: 'Grade', icon: <Filter className="h-4 w-4" aria-hidden="true" /> },
  { id: 'generate', label: 'Generate', icon: <PenLine className="h-4 w-4" aria-hidden="true" /> },
  { id: 'verify', label: 'Verify', icon: <GitMerge className="h-4 w-4" aria-hidden="true" /> },
  { id: 'finalize', label: 'Answer', icon: <Sparkles className="h-4 w-4" aria-hidden="true" /> },
];

const LABELS: Record<string, string> = Object.fromEntries([...MAIN.map(item => [item.id, item.label]), ['respond', 'Safe response'], ['extractive', 'Extractive fallback'], ['escalate', 'Security Team']]);

interface PipelineGraphProps {
  steps: PipelineStep[];
  running: boolean;
  compact?: boolean;
}

export const PipelineGraph: React.FC<PipelineGraphProps> = ({ steps, running, compact = false }) => {
  const done = new Map<string, PipelineStep[]>();
  steps.forEach(step => done.set(step.node, [...(done.get(step.node) ?? []), step]));
  const last = steps[steps.length - 1];
  const escalated = done.has('escalate');
  const shortCircuit = done.has('respond') || escalated;
  const lastMainIndex = Math.max(-1, ...MAIN.map((node, index) => (done.has(node.id) ? index : -1)));
  const activeIndex = running && !shortCircuit ? Math.min(lastMainIndex + 1, MAIN.length - 1) : -1;
  const retried = (done.get('generate')?.length ?? 0) > 1;
  const total = steps.reduce((sum, step) => sum + step.ms, 0);

  return (
    <section aria-label="Retrieval pipeline" className="bm-ds space-y-3">
      <ol className={`flex items-stretch ${compact ? 'gap-1 overflow-x-auto' : 'flex-wrap gap-1.5 sm:flex-nowrap'}`}>
        {MAIN.map((node, index) => {
          // An escalated run ends at the Security Team instead of an answer.
          const handedOff = escalated && node.id === 'finalize';
          const nodeSteps = handedOff ? done.get('escalate') : done.get(node.id);
          const isDone = Boolean(nodeSteps);
          const isActive = index === activeIndex;
          const skipped = shortCircuit && !isDone && index > 0;
          return (
            <li key={node.id} className="flex min-w-0 flex-1 items-center gap-1.5">
              <div
                className={`relative flex min-w-0 flex-1 items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors ${
                  handedOff ? 'border-transparent bg-med-soft text-fg' : isDone ? 'border-transparent bg-accent-soft text-accent-text' : isActive ? 'border-accent text-fg' : skipped ? 'border-dashed border-line text-fg-3 opacity-60' : 'border-line text-fg-3'
                }`}
                title={nodeSteps?.map(step => step.detail).join(' · ')}
              >
                {isActive && <span className="absolute inset-0 rounded-md ring-2 ring-accent motion-safe:animate-pulse" aria-hidden="true" />}
                <span className="shrink-0">{handedOff ? <Headset className="h-4 w-4" aria-hidden="true" /> : isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : node.icon}</span>
                <span className={`truncate ${compact ? 'hidden sm:inline' : ''}`}>{handedOff ? 'Security Team' : node.label}</span>
                {node.id === 'generate' && retried && <span className="bm-chip bm-sev bm-sev-med !px-1.5 !py-0 text-[0.7rem]">x{done.get('generate')?.length}</span>}
              </div>
              {index < MAIN.length - 1 && <span className={`h-px w-2 shrink-0 ${isDone ? 'bg-accent' : 'bg-line'}`} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {!compact && (shortCircuit || done.has('extractive') || retried) && (
        <p className="flex items-center gap-2 text-xs text-fg-3">
          <CornerDownRight className="h-3.5 w-3.5" aria-hidden="true" />
          {escalated
            ? 'Approved content does not answer this with confidence, so no answer was generated. The question went to the Security Team.'
            : shortCircuit ? 'The guard routed this question to a safe response, so retrieval was skipped.' : done.has('extractive') ? 'The draft failed verification twice, so the graph fell back to a fully cited extract.' : 'Verification sent the draft back for a stricter rewrite.'}
        </p>
      )}

      <p className="text-xs text-fg-3" aria-live="polite">
        {last ? (
          <>
            <span className="font-semibold text-fg-2">{LABELS[last.node] ?? last.node}:</span> {last.detail}
            {!running && total > 0 && <span className="font-mono"> · {total} ms total</span>}
          </>
        ) : running ? (
          'Starting the pipeline…'
        ) : (
          'Ask a question to see the pipeline run.'
        )}
      </p>
    </section>
  );
};

export const STEP_LABELS = LABELS;
