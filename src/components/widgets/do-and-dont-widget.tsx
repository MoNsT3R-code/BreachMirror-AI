import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronDown, CheckCircle2, Cloud, Copy, Cpu, FileCode, HardDrive, Lock, Search, XCircle } from 'lucide-react';
import { PlaybookDomain } from '../../shared-types';
import { PLAYBOOK_RULES } from '../../data/sample-data';

const DOMAINS: Array<{ id: PlaybookDomain; label: string; icon: React.ReactNode }> = [
  { id: 'ALL', label: 'All', icon: <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> },
  { id: 'AI_TOOLS', label: 'AI and LLM', icon: <Cpu className="h-3.5 w-3.5" aria-hidden="true" /> },
  { id: 'GIT_SECRETS', label: 'Git and code', icon: <FileCode className="h-3.5 w-3.5" aria-hidden="true" /> },
  { id: 'CREDENTIALS_MFA', label: 'MFA and auth', icon: <Lock className="h-3.5 w-3.5" aria-hidden="true" /> },
  { id: 'DEVICES_PHYSICAL', label: 'Hardware', icon: <HardDrive className="h-3.5 w-3.5" aria-hidden="true" /> },
  { id: 'CLOUD_STORAGE', label: 'Cloud DLP', icon: <Cloud className="h-3.5 w-3.5" aria-hidden="true" /> },
];

export const DoAndDontWidget: React.FC = () => {
  const [domain, setDomain] = useState<PlaybookDomain>('ALL');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(PLAYBOOK_RULES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rules = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PLAYBOOK_RULES.filter(rule => {
      if (domain !== 'ALL' && rule.domain !== domain) return false;
      return !needle || [rule.ruleTitle, rule.doText, rule.dontText, rule.policyCode].some(field => field.toLowerCase().includes(needle));
    });
  }, [domain, query]);

  const copy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="bm-ds space-y-4" id="dos-and-donts-playbook">
      <div className="space-y-2">
        <label className="relative block">
          <span className="sr-only">Search directives</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search directives and policies…"
            className="min-h-10 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-3"
          />
        </label>
        <div role="radiogroup" aria-label="Filter by topic" className="flex flex-wrap gap-1.5">
          {DOMAINS.map(item => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={domain === item.id}
              onClick={() => setDomain(item.id)}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold ${domain === item.id ? 'border-accent bg-accent-soft text-accent-text' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1" tabIndex={0} aria-label="Security directives">
        {rules.length === 0 && <li className="rounded-md border border-dashed border-line-strong px-4 py-8 text-center text-sm text-fg-3">No directives match. Clear the search or choose All.</li>}
        {rules.map(rule => {
          const open = openId === rule.id;
          return (
            <li key={rule.id} className="rounded-lg border border-line bg-surface-2">
              <h4 className="m-0">
                <button type="button" aria-expanded={open} aria-controls={`rule-${rule.id}`} onClick={() => setOpenId(open ? null : rule.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="bm-chip font-mono">{rule.policyCode}</span>
                    <span className="truncate font-display text-sm font-semibold text-fg">{rule.ruleTitle}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-fg-3">
                    <span className="hidden sm:inline">{rule.domainLabel}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </span>
                </button>
              </h4>

              <div className="grid gap-3 px-4 pb-4 md:grid-cols-2">
                <div className="rounded-md bg-safe-soft p-3.5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-safe">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> What to do
                  </p>
                  <p className="mt-1.5 text-sm text-fg">{rule.doText}</p>
                </div>
                <div className="rounded-md bg-crit-soft p-3.5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-crit">
                    <XCircle className="h-4 w-4" aria-hidden="true" /> What to avoid
                  </p>
                  <p className="mt-1.5 text-sm text-fg">{rule.dontText}</p>
                </div>
              </div>

              {open && (
                <div id={`rule-${rule.id}`} className="space-y-3 border-t border-line p-4 text-sm">
                  <p className="text-fg-2"><span className="font-semibold text-fg">Why this matters:</span> {rule.rationale}</p>
                  <p className="text-fg-2"><span className="font-semibold text-fg">Example:</span> {rule.realPrecedent}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                    <p className="min-w-0 text-xs text-fg-3">
                      Recommended option: <code className="rounded bg-sunken px-1.5 py-0.5 font-mono text-fg">{rule.sanctionedAlternative}</code>
                    </p>
                    <button type="button" className="bm-btn bm-btn-sm" onClick={() => copy(rule.id, rule.sanctionedAlternative)}>
                      {copiedId === rule.id ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                      {copiedId === rule.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
