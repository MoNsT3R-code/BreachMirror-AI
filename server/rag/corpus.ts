import { XYZ_CODE_MARKDOWN_EXPORT, XYZ_CODE_PILLARS, XYZ_KNOW_THE_CODE_SCENARIOS } from '../../src/data/conduct-content';
import { XYZ_POLICY_METADATA, XYZ_POLICY_SECTIONS } from '../../src/data/handbook-content';
import { splitSentences, tokenize } from './text';

/**
 * Chunking: sentence-aware windows of about 700 characters with a one-sentence
 * overlap, so a rule that straddles two chunks is still retrievable. Each chunk
 * keeps its document, section and heading for citations.
 */

export interface Chunk {
  id: string;
  /** 'faq' chunks are answers approved by the Security Team (see knowledge-base.ts). */
  doc: 'policy' | 'conduct' | 'faq';
  label: string;
  heading: string;
  sectionId?: string;
  text: string;
  terms: string[];
  termCounts: Map<string, number>;
}

const TARGET_LENGTH = 700;

function windows(text: string): string[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return text.trim() ? [text.trim()] : [];
  const out: string[] = [];
  let current: string[] = [];
  let length = 0;
  for (const sentence of sentences) {
    if (length + sentence.length > TARGET_LENGTH && current.length > 0) {
      out.push(current.join(' '));
      const overlap = current[current.length - 1];
      current = [overlap];
      length = overlap.length;
    }
    current.push(sentence);
    length += sentence.length + 1;
  }
  if (current.length > 0) out.push(current.join(' '));
  return out;
}

function counts(terms: string[]): Map<string, number> {
  const map = new Map<string, number>();
  terms.forEach(term => map.set(term, (map.get(term) ?? 0) + 1));
  return map;
}

function makeChunks(doc: Chunk['doc'], label: string, heading: string, text: string, idBase: string, sectionId?: string): Chunk[] {
  return windows(text).map((chunk, index) => {
    const terms = tokenize(`${heading} ${chunk}`);
    return { id: `${idBase}#${index + 1}`, doc, label, heading, sectionId, text: chunk, terms, termCounts: counts(terms) };
  });
}

export function buildCorpus(): Chunk[] {
  const policy = XYZ_POLICY_SECTIONS.flatMap(section =>
    makeChunks(
      'policy',
      `${XYZ_POLICY_METADATA.documentTitle} ${XYZ_POLICY_METADATA.version} — Section ${section.number}: ${section.title}`,
      section.title,
      [section.summary, ...section.keyDirectives, section.fullText].join(' '),
      section.id,
      section.id,
    ),
  );
  const conduct = XYZ_CODE_MARKDOWN_EXPORT.split(/(?=^#{1,3}\s)/m)
    .map(block => block.trim())
    .filter(Boolean)
    .flatMap((block, blockIndex) => {
      const heading = block.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim() ?? 'Code of Business Conduct';
      const body = block.replace(/^#{1,3}\s+.+$/m, '').replace(/[*_`>#|-]+/g, ' ');
      return makeChunks('conduct', `XYZ Code of Business Conduct — ${heading}`, heading, body, `conduct-${blockIndex + 1}`);
    });
  // The structured pillars carry rules the markdown export summarises away (for example gifts during an RFP).
  const sentence = (value: string) => (/[.!?]$/.test(value.trim()) ? value.trim() : `${value.trim()}.`);
  const pillars = XYZ_CODE_PILLARS.flatMap(pillar =>
    pillar.subtopics.flatMap(sub =>
      makeChunks(
        'conduct',
        `XYZ Code of Business Conduct — ${pillar.number}. ${sub.title}`,
        sub.title,
        [sub.summary, ...sub.keyRules, sub.fullNarrative, ...(sub.keyTerms ?? []).map(item => `${item.term}: ${item.definition}`)].map(sentence).join(' '),
        `conduct-${sub.id}`,
      ),
    ),
  );
  const scenarios = XYZ_KNOW_THE_CODE_SCENARIOS.flatMap(scenario =>
    makeChunks(
      'conduct',
      `XYZ Code of Business Conduct — Know the Code: ${scenario.topicTitle}`,
      scenario.topicTitle,
      [scenario.question, scenario.answer, scenario.explanation, ...scenario.actionProtocol, scenario.relevantContact].map(sentence).join(' '),
      `conduct-${scenario.id}`,
    ),
  );
  return [...policy, ...conduct, ...pillars, ...scenarios].filter(chunk => chunk.terms.length > 3);
}

export const CORPUS: Chunk[] = buildCorpus();
