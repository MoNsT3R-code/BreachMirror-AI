import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { readSecureJson, writeSecureJson } from '../security/secure-store';
import { Chunk, CORPUS } from './corpus';
import { tokenize } from './text';

/* -------------------------------------------------------------------------- */
/* Sparse retriever: BM25 with precomputed document frequencies               */
/* -------------------------------------------------------------------------- */

const K1 = 1.2;
const B = 0.75;
const documentFrequency = new Map<string, number>();
CORPUS.forEach(chunk => new Set(chunk.terms).forEach(term => documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1)));
const averageLength = CORPUS.reduce((sum, chunk) => sum + chunk.terms.length, 0) / Math.max(CORPUS.length, 1);

export function idf(term: string): number {
  const df = documentFrequency.get(term) ?? 0;
  return Math.log(1 + (CORPUS.length - df + 0.5) / (df + 0.5));
}

export interface Ranked {
  chunk: Chunk;
  score: number;
}

/** BM25 over weighted query terms (expanded synonyms get a lower weight). */
export function bm25Search(weightedTerms: Map<string, number>, limit = 20): Ranked[] {
  const results: Ranked[] = [];
  for (const chunk of CORPUS) {
    let score = 0;
    for (const [term, weight] of weightedTerms) {
      const frequency = chunk.termCounts.get(term);
      if (!frequency) continue;
      score += weight * idf(term) * ((frequency * (K1 + 1)) / (frequency + K1 * (1 - B + (B * chunk.terms.length) / averageLength)));
    }
    if (score > 0) results.push({ chunk, score });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Dense retriever                                                            */
/*  - Gemini text embeddings when GEMINI_API_KEY is set (cached, encrypted)   */
/*  - otherwise a local hashed embedding of IDF-weighted words and character  */
/*    trigrams, which tolerates typos and word-form variation offline         */
/* -------------------------------------------------------------------------- */

const LOCAL_DIMENSIONS = 1024;

function hashIndex(feature: string): number {
  return crypto.createHash('md5').update(feature).digest().readUInt32LE(0) % LOCAL_DIMENSIONS;
}

function normalise(vector: Float32Array): Float32Array {
  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < vector.length; i += 1) vector[i] /= norm;
  return vector;
}

export function localEmbed(text: string): Float32Array {
  const vector = new Float32Array(LOCAL_DIMENSIONS);
  for (const term of tokenize(text)) {
    const weight = Math.min(idf(term), 6);
    vector[hashIndex(`w:${term}`)] += weight;
    const padded = `^${term}$`;
    for (let i = 0; i < padded.length - 2; i += 1) vector[hashIndex(`c:${padded.slice(i, i + 3)}`)] += weight * 0.35;
  }
  return normalise(vector);
}

export function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) dot += a[i] * b[i];
  return dot;
}

const localVectors = new Map<string, Float32Array>(CORPUS.map(chunk => [chunk.id, localEmbed(`${chunk.heading} ${chunk.text}`)]));
/** Always-available vectors, used for MMR redundancy checks. */
export const LOCAL_VECTORS = localVectors;

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL ?? 'gemini-embedding-001';
const EMBEDDING_CACHE = 'rag-embeddings.json';
let geminiVectors: Map<string, Float32Array> | null = null;
let geminiLoading: Promise<void> | null = null;

function contentKey(chunk: Chunk): string {
  return crypto.createHash('sha256').update(`${EMBEDDING_MODEL}|${chunk.heading}|${chunk.text}`).digest('hex').slice(0, 24);
}

async function embedBatch(ai: GoogleGenAI, texts: string[], taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'): Promise<Float32Array[]> {
  const response = await ai.models.embedContent({ model: EMBEDDING_MODEL, contents: texts, config: { taskType, outputDimensionality: 768 } });
  return (response.embeddings ?? []).map(embedding => normalise(Float32Array.from(embedding.values ?? [])));
}

/** Loads (or builds and caches) Gemini embeddings for the corpus. Safe to call repeatedly. */
export function warmGeminiIndex(apiKey: string): Promise<void> {
  if (geminiVectors) return Promise.resolve();
  if (geminiLoading) return geminiLoading;
  geminiLoading = (async () => {
    const cache = readSecureJson<Record<string, number[]>>(EMBEDDING_CACHE, {});
    const ai = new GoogleGenAI({ apiKey });
    const missing = CORPUS.filter(chunk => !cache[contentKey(chunk)]);
    for (let i = 0; i < missing.length; i += 50) {
      const batch = missing.slice(i, i + 50);
      const vectors = await embedBatch(ai, batch.map(chunk => `${chunk.heading}\n${chunk.text}`), 'RETRIEVAL_DOCUMENT');
      batch.forEach((chunk, index) => {
        if (vectors[index]?.length) cache[contentKey(chunk)] = Array.from(vectors[index], value => Math.round(value * 1e5) / 1e5);
      });
    }
    if (missing.length > 0) writeSecureJson(EMBEDDING_CACHE, cache);
    const map = new Map<string, Float32Array>();
    for (const chunk of CORPUS) {
      const values = cache[contentKey(chunk)];
      if (values) map.set(chunk.id, Float32Array.from(values));
    }
    if (map.size === CORPUS.length) geminiVectors = map;
  })().catch(() => {
    geminiLoading = null;
  });
  return geminiLoading ?? Promise.resolve();
}

export interface DenseResult {
  ranked: Ranked[];
  engine: 'gemini-embedding' | 'local-hashed';
  vectors: Map<string, Float32Array>;
}

export async function denseSearch(queries: string[], apiKey: string | undefined, limit = 20): Promise<DenseResult> {
  if (apiKey) {
    await warmGeminiIndex(apiKey);
    if (geminiVectors) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const queryVectors = await embedBatch(ai, queries, 'RETRIEVAL_QUERY');
        return { ranked: rankByVectors(queryVectors, geminiVectors, limit), engine: 'gemini-embedding', vectors: geminiVectors };
      } catch {
        // fall through to the local index
      }
    }
  }
  return { ranked: rankByVectors(queries.map(localEmbed), localVectors, limit), engine: 'local-hashed', vectors: localVectors };
}

function rankByVectors(queryVectors: Float32Array[], index: Map<string, Float32Array>, limit: number): Ranked[] {
  const results: Ranked[] = [];
  for (const chunk of CORPUS) {
    const vector = index.get(chunk.id);
    if (!vector) continue;
    const score = Math.max(...queryVectors.map(query => cosine(query, vector)));
    if (score > 0) results.push({ chunk, score });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Fusion and diversification                                                 */
/* -------------------------------------------------------------------------- */

export interface Candidate {
  chunk: Chunk;
  fused: number;
  sparse: number;
  dense: number;
  sparseRank?: number;
  denseRank?: number;
}

/** Reciprocal rank fusion: robust to the very different score scales of BM25 and cosine. */
export function reciprocalRankFusion(lists: Ranked[][], k = 60): Map<string, { chunk: Chunk; fused: number; ranks: number[]; scores: number[] }> {
  const fused = new Map<string, { chunk: Chunk; fused: number; ranks: number[]; scores: number[] }>();
  lists.forEach((list, listIndex) => {
    list.forEach((item, rank) => {
      const entry = fused.get(item.chunk.id) ?? { chunk: item.chunk, fused: 0, ranks: [], scores: [] };
      entry.fused += 1 / (k + rank + 1);
      entry.ranks[listIndex] = rank + 1;
      entry.scores[listIndex] = item.score;
      fused.set(item.chunk.id, entry);
    });
  });
  return fused;
}

/** Maximal marginal relevance: keeps the top hits relevant but not repetitive. */
export function maximalMarginalRelevance(candidates: Candidate[], vectors: Map<string, Float32Array>, take: number, lambda = 0.72): Candidate[] {
  const pool = [...candidates];
  const chosen: Candidate[] = [];
  const top = Math.max(...pool.map(candidate => candidate.fused), 1e-9);
  while (chosen.length < take && pool.length > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;
    pool.forEach((candidate, index) => {
      const vector = vectors.get(candidate.chunk.id) ?? localVectors.get(candidate.chunk.id);
      const redundancy = chosen.length === 0 || !vector ? 0 : Math.max(...chosen.map(other => cosine(vector, vectors.get(other.chunk.id) ?? localVectors.get(other.chunk.id) ?? vector)));
      const score = lambda * (candidate.fused / top) - (1 - lambda) * redundancy;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    chosen.push(pool.splice(bestIndex, 1)[0]);
  }
  return chosen;
}
