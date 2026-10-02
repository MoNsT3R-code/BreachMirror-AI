import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Mail, 
  Copy, 
  Check, 
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { POLICY_ASSISTANT_FAQS, PolicyFAQ } from '../../data/handbook-lab-content';
import { soundManager } from '../../services/sound-effects';
import { askPolicyRagApi, PolicyRagResponse } from '../../services/local-api';

interface PolicyAssistantProps {
  onSelectSection?: (sectionId: string) => void;
}

export const PolicyAssistant: React.FC<PolicyAssistantProps> = ({
  onSelectSection
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedFaqId, setExpandedFaqId] = useState<string>(POLICY_ASSISTANT_FAQS[0].id);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [ragQuestion, setRagQuestion] = useState<string>('');
  const [ragResult, setRagResult] = useState<PolicyRagResponse | null>(null);
  const [ragError, setRagError] = useState<string>('');
  const [isAskingPolicy, setIsAskingPolicy] = useState<boolean>(false);

  const categories = [
    { id: 'ALL', label: 'All Queries' },
    { id: 'Passwords & MFA', label: 'Passwords & MFA' },
    { id: 'Incidents & Lost Devices', label: 'Lost Devices & SLA' },
    { id: 'Data & Storage', label: 'M365 & Cloud' },
    { id: 'AI & Software', label: 'AI & Software' },
    { id: 'Personal Use', label: 'Personal Use' },
    { id: 'Ethics & Gifts', label: 'Ethics & Hotline' }
  ];

  const filteredFaqs = POLICY_ASSISTANT_FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      faq.question.toLowerCase().includes(q) ||
      faq.quickAnswer.toLowerCase().includes(q) ||
      faq.officialRule.toLowerCase().includes(q) ||
      faq.keywords.some(k => k.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleAskPolicy = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ragQuestion.trim() || isAskingPolicy) return;
    setIsAskingPolicy(true);
    setRagError('');
    setRagResult(null);
    try {
      setRagResult(await askPolicyRagApi(ragQuestion.trim()));
    } catch (error) {
      setRagError(error instanceof Error ? error.message : 'Unable to search the policy documents right now.');
    } finally {
      setIsAskingPolicy(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-[0_15px_40px_rgba(6,182,212,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
                Interactive Sentinel Assistant
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                Instant Policy Citations
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
              Ask Policy Sentinel: Rapid Compliance Q&amp;A
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl font-sans mt-1 leading-relaxed">
              Have a question about what is permissible on Stewart laptops, Microsoft 365, artificial intelligence, or reporting timelines? Find instant answers backed directly by Stewart Policy v7.0 and our Code of Conduct.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-right font-mono shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase">Incident SLA</span>
            <span className="text-sm font-bold text-rose-400">&lt; 1 Hour Report</span>
          </div>
        </div>
      </div>

      <section aria-label="Ask the security policy" className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-4 sm:p-5 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white">Ask the security policy</h4>
          <p className="mt-1 text-xs text-slate-400">Get an answer from the Stewart security policy and code of conduct, with source sections.</p>
        </div>
        <form onSubmit={handleAskPolicy} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={ragQuestion}
            onChange={event => setRagQuestion(event.target.value)}
            maxLength={500}
            placeholder="For example: Where should I store work files?"
            aria-label="Ask a question about company security policies"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!ragQuestion.trim() || isAskingPolicy}
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAskingPolicy ? 'Searching...' : 'Ask'}
          </button>
        </form>
        <p className="text-[11px] text-slate-500">
          Policy search runs locally. If Gemini is configured, your question and matching policy excerpts are sent to Google to draft the answer; otherwise, matching excerpts are shown without AI generation.
        </p>
        {ragError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">{ragError}</p>}
        {ragResult && (
          <div role="status" className="space-y-3 border-t border-white/10 pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{ragResult.answer}</p>
            {ragResult.mode === 'excerpts' && <p className="text-[11px] font-medium text-amber-300">Showing retrieved policy text; AI answer generation is not active.</p>}
            {ragResult.sources.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-cyan-200">Sources</h5>
                {ragResult.sources.map(source => (
                  <article key={source.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h6 className="text-xs font-semibold text-cyan-200">[{source.id}] {source.label}</h6>
                      {source.sectionId && onSelectSection && (
                        <button type="button" onClick={() => onSelectSection(source.sectionId!)} className="text-[11px] text-cyan-300 hover:underline">
                          Open section
                        </button>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300">{source.excerpt}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type any question (e.g., '16 character password', 'lost laptop', 'ChatGPT', 'Spotify', 'USB')..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundManager.playBlip(680);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items Accordion / Grid */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-950/40 border border-white/5 text-xs text-slate-400 space-y-2">
            <p>No policy guidelines found matching "{searchQuery}".</p>
            <p className="text-[11px] text-cyan-400 font-mono">
              Need immediate clarification? Email <span className="underline">itsecurity@stewart.com</span> or call (866) 384-4277.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = faq.id === expandedFaqId;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-950/90 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => {
                    setExpandedFaqId(isExpanded ? '' : faq.id);
                    soundManager.playBlip(isExpanded ? 500 : 750);
                  }}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 font-bold uppercase shrink-0">
                      {faq.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {faq.question}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      {faq.policyCitation}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-cyan-400' : ''}`} />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 space-y-4 border-t border-white/5 animate-in fade-in duration-150">
                    
                    {/* Quick Answer Banner */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 font-sans leading-relaxed flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-display text-xs mb-0.5">Quick Answer:</strong>
                        <span>{faq.quickAnswer}</span>
                      </div>
                    </div>

                    {/* Official Rule & Citation */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        Official Policy Rule ({faq.policyCitation}):
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {faq.officialRule}
                      </p>
                    </div>

                    {/* DO vs DONT Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-300 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Approved Protocol (DO)</span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {faq.dos}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-300 uppercase">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Strictly Prohibited (DON'T)</span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {faq.donts}
                        </p>
                      </div>
                    </div>

                    {/* Escalation Contact Footer */}
                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                      <div className="text-slate-400">
                        Official Escalation: <span className="text-cyan-300 font-bold">{faq.escalation}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(faq.escalation, faq.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        {isCopied === faq.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied === faq.id ? 'Copied' : 'Copy Contact'}</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
