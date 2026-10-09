import { useCallback, useEffect, useRef, useState } from 'react';
import { PipelineStep, PolicyRagResponse, streamPolicyAnswer, supportApi } from '../../services/local-api';
import { recordActivity } from '../../services/learning-progress';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status: 'streaming' | 'done' | 'error';
  steps: PipelineStep[];
  result?: PolicyRagResponse;
  question?: string;
  feedback?: 'up' | 'down';
  /** A request the employee sent to the Security Team from this answer. */
  handoff?: { state: 'sending' } | { state: 'sent'; ticketId: string; agentId: string | null; reused: boolean } | { state: 'error'; message: string };
}

const CONVERSATION_KEY = 'bm_copilot_conversation';
const FEEDBACK_KEY = 'bm_copilot_feedback';

function newConversationId(): string {
  return `c-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`.slice(0, 40);
}

function loadConversationId(): string {
  try {
    const saved = sessionStorage.getItem(CONVERSATION_KEY);
    if (saved) return saved;
    const id = newConversationId();
    sessionStorage.setItem(CONVERSATION_KEY, id);
    return id;
  } catch {
    return newConversationId();
  }
}

/** Conversation state for the Policy Copilot: streaming steps, tokens and the final cited answer. */
export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>(loadConversationId);
  const controller = useRef<AbortController | null>(null);
  const counter = useRef(0);
  const busy = messages.some(message => message.status === 'streaming');

  useEffect(() => () => controller.current?.abort(), []);

  const patch = useCallback((id: string, change: (message: CopilotMessage) => Partial<CopilotMessage>) => {
    setMessages(list => list.map(message => (message.id === id ? { ...message, ...change(message) } : message)));
  }, []);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || busy) return;
      counter.current += 1;
      const userId = `u${counter.current}`;
      const replyId = `a${counter.current}`;
      setMessages(list => [
        ...list,
        { id: userId, role: 'user', text: trimmed, status: 'done', steps: [] },
        { id: replyId, role: 'assistant', text: '', status: 'streaming', steps: [], question: trimmed },
      ]);
      recordActivity();
      controller.current = new AbortController();
      try {
        const result = await streamPolicyAnswer(
          trimmed,
          conversationId,
          {
            // When the graph withholds an answer, any streamed draft is discarded: it must never be shown.
            onStep: step => patch(replyId, message => ({ steps: [...message.steps, step], ...(step.node === 'escalate' ? { text: '' } : {}) })),
            onToken: token => patch(replyId, message => ({ text: message.text + token })),
          },
          controller.current.signal,
        );
        patch(replyId, () => ({ text: result.answer, status: 'done', result }));
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === 'AbortError';
        patch(replyId, message => ({ status: aborted && message.text ? 'done' : 'error', text: aborted ? message.text || 'Stopped.' : error instanceof Error ? error.message : 'The copilot is unavailable right now.' }));
      } finally {
        controller.current = null;
      }
    },
    [busy, conversationId, patch],
  );

  const stop = useCallback(() => controller.current?.abort(), []);

  const reset = useCallback(() => {
    controller.current?.abort();
    const id = newConversationId();
    try {
      sessionStorage.setItem(CONVERSATION_KEY, id);
    } catch {
      // ignore
    }
    setConversationId(id);
    setMessages([]);
  }, []);

  const retry = useCallback(
    (message: CopilotMessage) => {
      if (!message.question) return;
      setMessages(list => list.filter(item => item.id !== message.id && item.id !== message.id.replace(/^a/, 'u')));
      window.setTimeout(() => void ask(message.question as string), 0);
    },
    [ask],
  );

  const rate = useCallback((message: CopilotMessage, value: 'up' | 'down') => {
    patch(message.id, () => ({ feedback: value }));
    try {
      const stats = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? '{"up":0,"down":0}') as Record<string, number>;
      stats[value] = (stats[value] ?? 0) + 1;
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [patch]);

  /** Sends the question behind an answer to the Security Team for a human review. */
  const askSecurityTeam = useCallback(
    async (message: CopilotMessage) => {
      if (!message.question) return;
      patch(message.id, () => ({ handoff: { state: 'sending' } }));
      try {
        const { ticket, reused } = await supportApi.submit(message.question);
        patch(message.id, () => ({ handoff: { state: 'sent', ticketId: ticket.id, agentId: ticket.assignedAgentId, reused } }));
      } catch (error) {
        patch(message.id, () => ({ handoff: { state: 'error', message: error instanceof Error ? error.message : 'Could not reach the Security Team.' } }));
      }
    },
    [patch],
  );

  return { messages, busy, ask, stop, reset, retry, rate, askSecurityTeam };
}
