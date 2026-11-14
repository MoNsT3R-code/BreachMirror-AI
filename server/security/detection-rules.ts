import type { EndpointSeverity } from './endpoint-security';

export interface DetectionResult {
  eventType: string;
  severity: EndpointSeverity;
  summary: string;
  ruleId: string;
}

const RULES: Array<{ id: string; eventType: string; severity: EndpointSeverity; patterns: RegExp[]; summary: string }> = [
  { id: 'BM-AUTH-001', eventType: 'suspicious_login', severity: 'HIGH', patterns: [/impossible travel/i, /multiple failed login/i, /new country/i], summary: 'Suspicious authentication activity detected.' },
  { id: 'BM-MAL-001', eventType: 'malware_detected', severity: 'CRITICAL', patterns: [/malware/i, /ransomware/i, /trojan/i, /unsigned executable/i], summary: 'Potential malware activity detected.' },
  { id: 'BM-SEC-001', eventType: 'credential_exposure', severity: 'CRITICAL', patterns: [/secret/i, /token/i, /api key/i, /password/i, /credential/i], summary: 'Potential credential exposure detected.' },
  { id: 'BM-POL-001', eventType: 'policy_violation', severity: 'MEDIUM', patterns: [/policy/i, /unapproved/i, /blocked/i], summary: 'A policy control reported a violation.' },
];

export function detectSecurityEvent(input: string): DetectionResult {
  const text = input.slice(0, 500);
  const rule = RULES.find(candidate => candidate.patterns.some(pattern => pattern.test(text)));
  return rule
    ? { eventType: rule.eventType, severity: rule.severity, summary: rule.summary, ruleId: rule.id }
    : { eventType: 'unknown', severity: 'LOW', summary: 'Unclassified security telemetry received.', ruleId: 'BM-GEN-001' };
}
