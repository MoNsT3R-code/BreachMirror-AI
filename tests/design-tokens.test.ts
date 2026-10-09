import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

const css = fs.readFileSync(new URL('../src/styles/design-tokens.css', import.meta.url), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `missing ${selector} block`);
  const body = css.slice(start, css.indexOf('\n}', start));
  const out: Record<string, string> = {};
  for (const match of body.matchAll(/(--bm-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) out[match[1]] = match[2].toLowerCase();
  return out;
}

const light = block(':root');
const dark = { ...light, ...block('html.dark') };

function luminance(hex: string): number {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio]
const TEXT = 4.5;
const UI = 3;
const sev = ['crit', 'high', 'med', 'low', 'safe'];
const pairs: Array<[string, string, number]> = [
  ['--bm-fg', '--bm-bg', TEXT], ['--bm-fg', '--bm-surface', TEXT], ['--bm-fg', '--bm-sunken', TEXT],
  ['--bm-fg-2', '--bm-bg', TEXT], ['--bm-fg-2', '--bm-surface', TEXT], ['--bm-fg-2', '--bm-sunken', TEXT],
  ['--bm-fg-3', '--bm-bg', TEXT], ['--bm-fg-3', '--bm-surface', TEXT], ['--bm-fg-3', '--bm-surface-2', TEXT], ['--bm-fg-3', '--bm-sunken', TEXT],
  ['--bm-accent-fg', '--bm-accent', TEXT],
  ['--bm-accent-text', '--bm-bg', TEXT], ['--bm-accent-text', '--bm-surface', TEXT], ['--bm-accent-text', '--bm-accent-soft', TEXT],
  ['--bm-focus', '--bm-bg', UI], ['--bm-focus', '--bm-surface', UI],
  ['--bm-line-strong', '--bm-surface', UI],
  ...[1, 2, 3, 4, 5].flatMap((n): Array<[string, string, number]> => [[`--bm-s${n}`, '--bm-surface', UI], [`--bm-s${n}`, '--bm-sunken', UI]]),
  ...sev.flatMap((s): Array<[string, string, number]> => [
    [`--bm-${s}`, '--bm-surface', TEXT], [`--bm-${s}`, '--bm-bg', TEXT], [`--bm-${s}`, `--bm-${s}-soft`, TEXT],
  ]),
];

for (const [name, tokens] of [['light', light], ['dark', dark]] as const) {
  test(`WCAG AA contrast: ${name} theme`, () => {
    const failures: string[] = [];
    for (const [fg, bg, min] of pairs) {
      const value = ratio(tokens[fg], tokens[bg]);
      if (value < min) failures.push(`${fg} on ${bg}: ${value.toFixed(2)} < ${min}`);
    }
    assert.deepEqual(failures, []);
  });
}

// ---- Glass and ambient backdrop: text must stay readable over the worst case of every layer ----
function mix(base: string, over: string, amount: number): string {
  const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
  const part = (i: number) => Math.round(channel(base, i) * (1 - amount) + channel(over, i) * amount).toString(16).padStart(2, '0');
  return `#${part(1)}${part(3)}${part(5)}`;
}

for (const [name, tokens] of [['light', light], ['dark', dark]] as const) {
  test(`WCAG AA contrast over glass and ambient backdrop: ${name} theme`, () => {
    const blobAlpha = Number(tokens['--bm-blob-pct']) / 100;
    const glass = Number(tokens['--bm-glass-pct']) / 100;
    const glassStrong = Number(tokens['--bm-glass-strong-pct']) / 100;
    const failures: string[] = [];
    for (const gradient of ['--bm-bg-grad-1', '--bm-bg-grad-2']) {
      // Worst case: all three blobs overlap at the same point.
      const ambient = ['--bm-blob-a', '--bm-blob-b', '--bm-blob-c'].reduce((color, blob) => mix(color, tokens[blob], blobAlpha), tokens[gradient]);
      const layers: Array<[string, string]> = [
        ['ambient backdrop', ambient],
        ['glass', mix(ambient, tokens['--bm-glass-base'], glass)],
        ['strong glass', mix(ambient, tokens['--bm-glass-base'], glassStrong)],
      ];
      for (const [label, background] of layers) {
        const texts = label === 'ambient backdrop' ? ['--bm-fg', '--bm-fg-2', '--bm-fg-3', '--bm-accent-text'] : ['--bm-fg', '--bm-fg-2', '--bm-fg-3', '--bm-accent-text', '--bm-crit', '--bm-high', '--bm-med', '--bm-low', '--bm-safe'];
        for (const text of texts) {
          const value = ratio(tokens[text], background);
          if (value < TEXT) failures.push(`${text} on ${label} (${gradient}): ${value.toFixed(2)} < ${TEXT}`);
        }
      }
    }
    assert.deepEqual(failures, []);
  });
}

// ---- Optional XYZ photo behind Home and Sign in. Bare text uses fg/fg-2 only; everything else sits on glass. ----
for (const [name, tokens] of [['light', light], ['dark', dark]] as const) {
  test(`WCAG AA contrast over the veiled photo backdrop (worst-case black or white photo): ${name} theme`, () => {
    const veil = Number(tokens['--bm-photo-veil']) / 100;
    const glass = Number(tokens['--bm-glass-pct']) / 100;
    const glassStrong = Number(tokens['--bm-glass-strong-pct']) / 100;
    const failures: string[] = [];
    for (const photo of ['#000000', '#ffffff']) {
      const backdrop = mix(photo, tokens['--bm-bg'], veil);
      for (const text of ['--bm-fg', '--bm-fg-2']) {
        const value = ratio(tokens[text], backdrop);
        if (value < TEXT) failures.push(`${text} bare over ${photo} photo: ${value.toFixed(2)} < ${TEXT}`);
      }
      for (const [label, amount] of [['glass', glass], ['strong glass', glassStrong]] as const) {
        const surface = mix(backdrop, tokens['--bm-glass-base'], amount);
        for (const text of ['--bm-fg', '--bm-fg-2', '--bm-fg-3', '--bm-accent-text']) {
          const value = ratio(tokens[text], surface);
          if (value < TEXT) failures.push(`${text} on ${label} over ${photo} photo: ${value.toFixed(2)} < ${TEXT}`);
        }
      }
    }
    assert.deepEqual(failures, []);
  });
}
