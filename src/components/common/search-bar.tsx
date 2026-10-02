import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, BookOpen, Scale, ArrowRight, X } from 'lucide-react';

export interface SearchRecommendation {
  id: string;
  title: string;
  category: 'Security Policy' | 'Code of Conduct' | 'Threat Vector';
  badge: string;
  sourceDoc: 'IT Security Policy v7.0' | 'Code of Business Conduct';
  queryText: string;
}

export const DEFAULT_SEARCH_RECOMMENDATIONS: SearchRecommendation[] = [
  {
    id: 'rec-1',
    title: 'GenAI & Escrow PII Data Protection',
    category: 'Security Policy',
    badge: 'Section 5',
    sourceDoc: 'IT Security Policy v7.0',
    queryText: 'Artificial Intelligence',
  },
  {
    id: 'rec-2',
    title: 'Phish-Resistant MFA & AiTM Bypass',
    category: 'Security Policy',
    badge: 'Section 3',
    sourceDoc: 'IT Security Policy v7.0',
    queryText: 'Authentication',
  },
  {
    id: 'rec-3',
    title: '1-Hour Incident Reporting (Zero-Blame)',
    category: 'Security Policy',
    badge: 'Section 9',
    sourceDoc: 'IT Security Policy v7.0',
    queryText: 'Incident Reporting',
  },
  {
    id: 'rec-4',
    title: 'Shadow IT & WhatsApp Comms Ban',
    category: 'Security Policy',
    badge: 'Section 8',
    sourceDoc: 'IT Security Policy v7.0',
    queryText: 'Shadow IT',
  },
  {
    id: 'rec-5',
    title: 'Lost Laptop 1-Hour Wipe Window',
    category: 'Security Policy',
    badge: 'Section 6',
    sourceDoc: 'IT Security Policy v7.0',
    queryText: 'Lost Laptop',
  },
  {
    id: 'rec-6',
    title: 'Personal Cloud (Google Drive) Ban',
    category: 'Security Policy',
    badge: 'Section 2',
    sourceDoc: 'IT Security Policy v7.0',
    queryText: 'Cloud Storage',
  },
  {
    id: 'rec-7',
    title: 'RESPA Kickbacks & Honest Customer Dealings',
    category: 'Code of Conduct',
    badge: 'Pillar 2',
    sourceDoc: 'Code of Business Conduct',
    queryText: 'RESPA',
  },
  {
    id: 'rec-8',
    title: 'Anti-Bribery, FCPA & Business Gifts',
    category: 'Code of Conduct',
    badge: 'Pillar 3',
    sourceDoc: 'Code of Business Conduct',
    queryText: 'Bribery',
  },
  {
    id: 'rec-9',
    title: 'Insider Trading & Material Non-Public Info',
    category: 'Code of Conduct',
    badge: 'Pillar 4',
    sourceDoc: 'Code of Business Conduct',
    queryText: 'Insider Trading',
  },
  {
    id: 'rec-10',
    title: 'Non-Retaliation & EthicsPoint Hotline',
    category: 'Code of Conduct',
    badge: 'Ethics',
    sourceDoc: 'Code of Business Conduct',
    queryText: 'EthicsPoint',
  },
];

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  onFilterClick?: () => void;
  onSelectRecommendation?: (rec: SearchRecommendation) => void;
  placeholder?: string;
  className?: string;
  recommendations?: SearchRecommendation[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSubmit,
  onFilterClick,
  onSelectRecommendation,
  placeholder = 'Search modules, directives & threats...',
  className = '',
  recommendations = DEFAULT_SEARCH_RECOMMENDATIONS,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Security Policy' | 'Code of Conduct'>('All');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSubmit) {
        onSubmit(value);
      }
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  const handleSelectRec = (rec: SearchRecommendation) => {
    onChange?.(rec.queryText);
    onSubmit?.(rec.queryText);
    onSelectRecommendation?.(rec);
  };

  const handleClear = () => {
    onChange?.('');
    onSubmit?.('');
  };

  // Filter recommendations based on active query and selected category
  const filteredRecs = recommendations.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesQuery = !value.trim() || 
      r.title.toLowerCase().includes(value.toLowerCase()) ||
      r.queryText.toLowerCase().includes(value.toLowerCase()) ||
      r.badge.toLowerCase().includes(value.toLowerCase()) ||
      r.category.toLowerCase().includes(value.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const securityCount = recommendations.filter(r => r.category === 'Security Policy').length;
  const conductCount = recommendations.filter(r => r.category === 'Code of Conduct').length;

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Conic Search Bar */}
      <div className="SearchBar-wrApper relative w-full">
        <div className="SearchBar-grid"></div>
        <div id="SearchBar" className="w-full">
          <div className="SearchBar-white"></div>
          <div className="relative w-full flex items-center">
            <div id="SearchBar-search-icon">
              <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>

            <input
              placeholder={placeholder}
              type="text"
              className="SearchBar-input"
              value={value}
              onChange={(e) => {
                onChange?.(e.target.value);
                if (!isExpanded && e.target.value.trim().length > 0) {
                  setIsExpanded(true);
                }
              }}
              onFocus={() => {
                if (value.trim().length > 0) {
                  setIsExpanded(true);
                }
              }}
              onKeyDown={handleKeyDown}
            />

            {/* Right Action Controls: Flex row with vertical centering, guaranteed zero overlap */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                id="SearchBar-filter-icon"
                onClick={() => {
                  setIsExpanded(prev => !prev);
                  onFilterClick?.();
                }}
                title={isExpanded ? 'Collapse Directive Explorer' : 'Expand Directive Explorer & Filters'}
                aria-label="Filter"
                className={`transition-all ${isExpanded ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50' : ''}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Recommendations (In-flow layout - zero overlApping) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 shrink-0 pr-1">
            <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />
            Directives:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-200/80 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300'
            }`}
          >
            All ({recommendations.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('Security Policy')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'Security Policy'
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : 'bg-slate-200/80 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-blue-500'
            }`}
          >
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span>IT Security v7.0 ({securityCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('Code of Conduct')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'Code of Conduct'
                ? 'bg-[#9B2743]/25 border-[#9B2743]/60 text-rose-300 shadow-[0_0_10px_rgba(155,39,67,0.2)]'
                : 'bg-slate-200/80 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-rose-400'
            }`}
          >
            <Scale className="w-3 h-3 text-rose-400" />
            <span>Code of Conduct ({conductCount})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          {isExpanded ? 'Hide Directives Panel ▲' : 'Show All Directives ▼'}
        </button>
      </div>

      {/* Quick Recommendation Chips: Responsive horizontal wrap */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {recommendations.slice(0, 5).map((rec) => {
          const isSelected = value.toLowerCase() === rec.queryText.toLowerCase();
          return (
            <button
              key={rec.id}
              type="button"
              onClick={() => handleSelectRec(rec)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102 active:scale-98 ${
                isSelected
                  ? 'bg-cyan-500/25 border-cyan-500/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-200/90 dark:bg-white/5 hover:bg-cyan-500/15 dark:hover:bg-cyan-500/15 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300'
              }`}
            >
              <span className={`text-[10px] font-mono px-1 rounded ${
                rec.category === 'Security Policy'
                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                  : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
              }`}>
                {rec.badge}
              </span>
              <span className="text-[11px] font-medium">{rec.title}</span>
            </button>
          );
        })}
      </div>

      {/* In-Flow Directive Results Panel (Never overlaps with subsequent sections!) */}
      {isExpanded && (
        <div className="mt-2 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/15 shadow-xl overflow-hidden animate-in fade-in duration-150">
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              Verified Stewart Directives &amp; Policy Queries
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {filteredRecs.length} Directives Match
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                title="Collapse"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
            {filteredRecs.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-slate-500">
                No handbook directives match "{value}". Press Enter to search live telemetry modules.
              </div>
            ) : (
              filteredRecs.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => handleSelectRec(rec)}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                      rec.category === 'Security Policy'
                        ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                        : 'bg-[#9B2743]/20 border-[#9B2743]/50 text-rose-400'
                    }`}>
                      {rec.category === 'Security Policy' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <Scale className="w-4 h-4" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-sans truncate">
                          {rec.title}
                        </span>
                        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                          rec.category === 'Security Policy'
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        }`}>
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {rec.sourceDoc} • Filter query: "{rec.queryText}"
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
