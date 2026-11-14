const counters = new Map<string, number>();

export function incrementMetric(name: string): void {
  counters.set(name, (counters.get(name) ?? 0) + 1);
}

export function metrics(): Record<string, number> {
  return Object.fromEntries(counters);
}

export function prometheusMetrics(): string {
  return Object.entries(counters)
    .map(([name, value]) => `breachmirror_${name.replace(/[^a-zA-Z0-9_]/g, '_')} ${value}`)
    .join('\n') + '\n';
}
