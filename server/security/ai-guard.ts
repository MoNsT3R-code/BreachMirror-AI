/**
 * Server-side boundary for content sent to retrieval and language models.
 * The UI is not a trust boundary: callers can invoke the API directly.
 */

export const AI_INPUT_MAX_LENGTH = 2_000;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+|any\s+|the\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/i,
  /(reveal|show|print|repeat)\s+(your|the)\s+(system\s+)?(prompt|instructions?)/i,
  /\b(jailbreak|dan\s+mode|developer\s+mode)\b/i,
  /\byou\s+are\s+now\b/i,
  /\bdisregard\s+(your|the)\s+(rules?|guidelines?|instructions?)/i,
  /\b(system\s*message|assistant\s*message)\s*:/i,
];

const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/AKIA[0-9A-Z]{16}/g, 'AWS access key'],
  [/gh[pousr]_[A-Za-z0-9_]{20,}/g, 'GitHub token'],
  [/sk-[A-Za-z0-9_-]{20,}/g, 'API secret key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----|$)/g, 'private key'],
  [/\b(password|passwd|pwd)\s*[:=]\s*\S+/gi, 'password'],
  [/\b\d{3}-\d{2}-\d{4}\b/g, 'social security number'],
];

export interface AiInput {
  text: string;
  findings: string[];
  blocked: boolean;
}

function stripControls(text: string): { text: string; changed: boolean } {
  const cleaned = text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
  return { text: cleaned, changed: cleaned !== text };
}

export function redactSecrets(text: string): { text: string; found: string[] } {
  const found = new Set<string>();
  let output = text;
  for (const [pattern, label] of SECRET_PATTERNS) {
    output = output.replace(pattern, () => {
      found.add(label);
      return '[REDACTED]';
    });
  }
  return { text: output, found: [...found] };
}

export function hasPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

export function sanitizeAiInput(input: string, maxLength = AI_INPUT_MAX_LENGTH): AiInput {
  const findings = new Set<string>();
  const normalized = String(input ?? '').normalize('NFKC');
  const controls = stripControls(normalized);
  if (controls.changed) findings.add('control characters');

  const truncated = controls.text.length > maxLength;
  if (truncated) findings.add('oversized input');
  const bounded = controls.text.slice(0, maxLength);

  if (hasPromptInjection(bounded)) findings.add('prompt injection');
  const redacted = redactSecrets(bounded);
  redacted.found.forEach(finding => findings.add(finding));

  return {
    text: redacted.text,
    findings: [...findings],
    blocked: findings.has('prompt injection') || findings.has('oversized input'),
  };
}
