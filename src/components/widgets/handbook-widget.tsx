import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, Radio, Scale } from 'lucide-react';
import { HANDBOOK_VECTORS, HANDBOOK_MARKDOWN_EXPORT } from '../../data/handbook-content';
import { XYZ_CODE_PILLARS } from '../../data/conduct-content';
import { SeverityBadge } from '../ui/severity';

interface HandbookWidgetProps {
  onOpenFullHandbook: () => void;
  onOpenCodeOfConduct?: () => void;
  userRole?: string;
  onTrackOnRadar?: (vectorId: string) => void;
}

type Tab = 'itSecurity' | 'codeOfConduct';

export const HandbookWidget: React.FC<HandbookWidgetProps> = ({ onOpenFullHandbook, onOpenCodeOfConduct, onTrackOnRadar }) => {
  const [tab, setTab] = useState<Tab>('itSecurity');
  const [vectorIndex, setVectorIndex] = useState(0);
  const [pillarIndex, setPillarIndex] = useState(0);

  const vector = HANDBOOK_VECTORS[vectorIndex];
  const pillar = XYZ_CODE_PILLARS[pillarIndex];

  const download = () => {
    const blob = new Blob([HANDBOOK_MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'xyz-it-security-and-usage-v7.0.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'itSecurity', label: 'IT security v7.0', icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
    { id: 'codeOfConduct', label: 'Code of conduct', icon: <Scale className="h-4 w-4" aria-hidden="true" /> },
  ];

  return (
    <div className="bm-ds space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Handbook" className="inline-flex rounded-md border border-line-strong bg-sunken p-0.5">
          {tabs.map(item => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`hb-tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls="hb-panel"
              onClick={() => setTab(item.id)}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold ${tab === item.id ? 'bg-surface text-fg shadow-card' : 'text-fg-3 hover:text-fg'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {tab === 'itSecurity' ? (
            <>
              <button type="button" className="bm-btn bm-btn-sm" onClick={download}>
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download
              </button>
              <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onOpenFullHandbook}>
                Open handbook <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            onOpenCodeOfConduct && (
              <button type="button" className="bm-btn bm-btn-sm bm-btn-primary" onClick={onOpenCodeOfConduct}>
                Open code <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )
          )}
        </div>
      </div>

      <div id="hb-panel" role="tabpanel" aria-labelledby={`hb-tab-${tab}`} className="space-y-4">
        {tab === 'itSecurity' ? (
          <>
            <div role="radiogroup" aria-label="Policy sections" className="flex flex-wrap gap-1.5">
              {HANDBOOK_VECTORS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={index === vectorIndex}
                  title={item.title}
                  aria-label={`Section ${item.sectionNumber}: ${item.title}`}
                  onClick={() => setVectorIndex(index)}
                  className={`min-h-8 min-w-8 rounded-md border px-2 font-mono text-xs font-semibold ${index === vectorIndex ? 'border-accent bg-accent-soft text-accent-text' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}
                >
                  {item.sectionNumber}
                </button>
              ))}
            </div>
            <section className="space-y-3 rounded-lg border border-line bg-surface-2 p-4" aria-label={`Section ${vector.sectionNumber}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bm-chip">Section {vector.sectionNumber}</span>
                <SeverityBadge severity={vector.riskLevel} />
                <span className="text-xs text-fg-3">{vector.category}</span>
              </div>
              <h4 className="bm-h font-display text-lg font-semibold text-fg">{vector.title}</h4>
              <p className="text-sm text-fg-2">{vector.targetAudienceNote}</p>
              <div>
                <p className="bm-eyebrow mb-1">Golden rules</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-fg-2">
                  {vector.howToPrevent.goldenRules.slice(0, 3).map(rule => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
              {onTrackOnRadar && (
                <button type="button" className="bm-btn bm-btn-sm" onClick={() => onTrackOnRadar(vector.id)}>
                  <Radio className="h-3.5 w-3.5" aria-hidden="true" /> Track on radar
                </button>
              )}
            </section>
          </>
        ) : (
          <>
            <div role="radiogroup" aria-label="Pillars" className="flex flex-wrap gap-1.5">
              {XYZ_CODE_PILLARS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={index === pillarIndex}
                  aria-label={`Pillar ${item.number}: ${item.title}`}
                  title={item.title}
                  onClick={() => setPillarIndex(index)}
                  className={`min-h-8 min-w-8 rounded-md border px-2 font-mono text-xs font-semibold ${index === pillarIndex ? 'border-accent bg-accent-soft text-accent-text' : 'border-line bg-surface text-fg-2 hover:bg-sunken'}`}
                >
                  {item.number}
                </button>
              ))}
            </div>
            <section className="space-y-3 rounded-lg border border-line bg-surface-2 p-4" aria-label={`Pillar ${pillar.number}`}>
              <span className="bm-chip">Pillar {pillar.number} · {pillar.pageRange}</span>
              <h4 className="bm-h font-display text-lg font-semibold text-fg">{pillar.title}</h4>
              <p className="text-sm italic text-fg-2">{pillar.tagline}</p>
              <p className="text-sm text-fg-2">{pillar.summary}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-fg-2">
                {pillar.corePillars.slice(0, 4).map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
