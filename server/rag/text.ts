/** Tokenising, light stemming and security-domain query expansion shared by every retriever. */

const STOP_WORDS = new Set(['a', 'about', 'after', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'could', 'do', 'does', 'for', 'from', 'get', 'got', 'has', 'have', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'our', 'please', 'should', 'so', 'that', 'the', 'their', 'them', 'then', 'there', 'they', 'this', 'to', 'under', 'up', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your']);

export function stem(term: string): string {
  if (['store', 'stored', 'storing', 'storage'].includes(term)) return 'stor';
  if (term.endsWith('ies') && term.length > 4) return `${term.slice(0, -3)}y`;
  if (term.endsWith('ing') && term.length > 5) return term.slice(0, -3);
  if (term.endsWith('ed') && term.length > 4) return term.slice(0, -2);
  if (term.endsWith('es') && term.length > 4 && /(sh|ch|x|ss)es$/.test(term)) return term.slice(0, -2);
  if (term.endsWith('s') && term.length > 4 && !term.endsWith('ss')) return term.slice(0, -1);
  return term;
}

export function tokenize(value: string): string[] {
  return (value.toLowerCase().match(/[a-z0-9']+/g) ?? [])
    .map(term => term.replace(/'s$/, '').replace(/'/g, ''))
    .filter(term => term.length > 1 && !STOP_WORDS.has(term))
    .map(stem);
}

/**
 * Synonyms people use for the concepts in the policy. Expansion only adds
 * terms (weighted lower by the retrievers); it never removes the user's words.
 */
const SYNONYMS: Array<string[]> = [
  ['laptop', 'device', 'computer', 'workstation', 'endpoint', 'phone', 'mobile', 'tablet', 'hardware'],
  ['lost', 'lose', 'losing', 'stolen', 'steal', 'missing', 'theft', 'misplaced'],
  ['password', 'credential', 'passphrase', 'login', 'sign'],
  ['mfa', 'multifactor', 'authentication', 'authenticator', 'otp', '2fa'],
  ['ai', 'chatgpt', 'llm', 'genai', 'generative', 'gemini', 'copilot', 'claude', 'chatbot'],
  ['usb', 'removable', 'flash', 'thumb', 'drive', 'media'],
  ['phishing', 'phish', 'suspicious', 'scam', 'spoof', 'fraud'],
  ['email', 'mail', 'outlook', 'message'],
  ['wifi', 'wi', 'fi', 'wireless', 'network', 'vpn', 'hotspot', 'public'],
  ['cloud', 'dropbox', 'drive', 'onedrive', 'sharepoint', 'icloud', 'box'],
  ['report', 'incident', 'notify', 'escalate', 'tell', 'contact'],
  ['confidential', 'sensitive', 'pii', 'personal', 'customer', 'private', 'classified'],
  ['gift', 'entertainment', 'dinner', 'hospitality', 'bribe', 'kickback'],
  ['conflict', 'interest', 'relative', 'family', 'sibling'],
  ['whatsapp', 'messaging', 'chat', 'shadow', 'unapproved', 'personal'],
  ['wire', 'escrow', 'payment', 'bank', 'transfer', 'funds'],
  ['delete', 'wipe', 'erase', 'remote'],
  ['software', 'app', 'application', 'install', 'download', 'tool'],
  ['ethic', 'hotline', 'whistleblower', 'retaliation', 'speak'],
  ['terminate', 'termination', 'leave', 'separation', 'offboard', 'former'],
  ['violate', 'violation', 'breach', 'noncompliance', 'disciplinary', 'discipline', 'consequence', 'penalty', 'sanction', 'enforcement'],
  ['monitor', 'monitoring', 'surveillance', 'privacy', 'track', 'inspect'],
  ['classify', 'classification', 'label', 'tier', 'category'],
];

const SYNONYM_INDEX = new Map<string, Set<string>>();
for (const group of SYNONYMS) {
  const stems = group.map(stem);
  for (const term of stems) {
    const set = SYNONYM_INDEX.get(term) ?? new Set<string>();
    stems.forEach(other => other !== term && set.add(other));
    SYNONYM_INDEX.set(term, set);
  }
}

/** Related (synonym) stems for one stemmed term. */
export function relatedTerms(term: string): string[] {
  return [...(SYNONYM_INDEX.get(term) ?? [])];
}

/** Returns the original terms plus related terms (deduplicated, originals first). */
export function expandTerms(terms: string[], limitPerTerm = 3): string[] {
  const out = new Set(terms);
  for (const term of terms) {
    let added = 0;
    for (const related of SYNONYM_INDEX.get(term) ?? []) {
      if (added >= limitPerTerm) break;
      if (!out.has(related)) {
        out.add(related);
        added += 1;
      }
    }
  }
  return [...out];
}

export function splitSentences(text: string): string[] {
  return (text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [])
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 25);
}
