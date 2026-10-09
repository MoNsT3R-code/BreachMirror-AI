import React from 'react';
import { Check, ExternalLink, Mail, PhoneCall, ShieldAlert, ShieldCheck } from 'lucide-react';
import { XYZ_POLICY_METADATA, XYZ_POLICY_SECTIONS } from '../../data/handbook-content';

export const HandbookDocument: React.FC<{ onOpenSection: (sectionId: string) => void }> = ({ onOpenSection }) => (
  <div className="bm-ds mx-auto max-w-4xl space-y-6">
    <header className="space-y-4 rounded-lg border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="bm-eyebrow">Official policy document</p>
          <h1 className="bm-h mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">Information Technology Security and Usage</h1>
        </div>
        <ul className="space-y-0.5 text-right font-mono text-xs text-fg-3">
          <li>Version <span className="font-semibold text-fg">v7.0</span></li>
          <li>Revised <span className="font-semibold text-fg">04/01/2026</span></li>
          <li>XYZ Information Services Corp</li>
        </ul>
      </div>

      <nav aria-label="Contents" className="space-y-2">
        <p className="bm-eyebrow">Contents (10 sections)</p>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {XYZ_POLICY_SECTIONS.map(section => (
            <li key={section.id}>
              <a href={`#sec-${section.number}`} className="flex items-center justify-between gap-2 rounded-md border border-line bg-surface-2 px-3 py-2 text-sm hover:bg-sunken">
                <span className="truncate font-medium text-fg">{section.number}. {section.title}</span>
                <span className="shrink-0 font-mono text-xs text-fg-3">{section.page}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="rounded-md bg-accent-soft p-4 text-sm text-fg">
        <p className="bm-eyebrow text-accent-text">Where this policy applies</p>
        <p className="mt-1">{XYZ_POLICY_METADATA.scope}</p>
      </div>
    </header>

    {XYZ_POLICY_SECTIONS.map(section => (
      <article key={section.id} id={`sec-${section.number}`} className="scroll-mt-4 space-y-4 rounded-lg border border-line bg-surface p-5 sm:p-6" aria-labelledby={`sec-title-${section.number}`}>
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="bm-eyebrow">Section {section.number} · {section.page}</p>
            <h2 id={`sec-title-${section.number}`} className="bm-h font-display text-xl font-semibold text-fg">{section.title}</h2>
          </div>
          <button type="button" className="bm-btn bm-btn-sm" onClick={() => onOpenSection(section.id)}>
            Open this section <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="whitespace-pre-line text-sm leading-relaxed text-fg-2">{section.fullText}</div>
        <div className="rounded-md bg-safe-soft p-4">
          <p className="bm-eyebrow text-safe">Key requirements</p>
          <ul className="mt-2 space-y-1.5 text-sm text-fg">
            {section.keyDirectives.map(directive => (
              <li key={directive} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-safe" aria-hidden="true" />{directive}</li>
            ))}
          </ul>
        </div>
      </article>
    ))}

    <section aria-labelledby="doc-emergency" className="space-y-4 rounded-lg border border-line bg-surface-2 p-5 sm:p-6">
      <h2 id="doc-emergency" className="bm-h flex items-center gap-2 font-display text-lg font-semibold text-fg">
        <ShieldCheck className="h-5 w-5 text-safe" aria-hidden="true" /> Emergency reporting and protection
      </h2>
      <p className="text-sm text-fg-2">XYZ does not tolerate retaliation against employees, contractors or partners who report security incidents or policy concerns in good faith.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-fg"><Mail className="h-4 w-4 text-accent-text" aria-hidden="true" /> IT security help desk</p>
          <p className="mt-1 font-mono text-sm text-fg">maya.patel@xyz.com</p>
          <p className="mt-1 text-xs text-fg-3">Report within 1 hour for critical issues or 4 hours for other issues.</p>
        </div>
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-fg"><ShieldAlert className="h-4 w-4 text-accent-text" aria-hidden="true" /> Outlook report button</p>
          <p className="mt-1 text-sm text-fg">“Report Email” button</p>
          <p className="mt-1 text-xs text-fg-3">Available in Outlook on desktop, web and mobile.</p>
        </div>
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-fg"><PhoneCall className="h-4 w-4 text-accent-text" aria-hidden="true" /> EthicsPoint hotline</p>
          <p className="mt-1 font-mono text-sm text-fg">(800) 555-0199</p>
          <p className="mt-1 text-xs text-fg-3">Free, 24/7, anonymous reporting.</p>
        </div>
      </div>
    </section>
  </div>
);
