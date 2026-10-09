import React, { useState } from 'react';
import { Check, Copy, Download, Lock, Sparkles } from 'lucide-react';
import { LeakedSecretFinding, SAMPLE_INPUTS, SamplePreset, scanForSecrets } from '../../services/secret-scanner';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { Dialog } from '../ui/dialog';
import { SeverityBadge } from '../ui/severity';

interface ConfessionAirlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const PRESETS: Array<{ id: SamplePreset; label: string }> = [
  { id: 'AWS', label: 'Leaked AWS key' },
  { id: 'GITHUB', label: 'GitHub token in Git' },
  { id: 'OPENAI', label: 'OpenAI secret key' },
  { id: 'PHISHING', label: 'Clicked a suspicious link' },
];

const SEVERITY = { CRITICAL: 'CRITICAL', HIGH: 'HIGH', MEDIUM: 'ELEVATED' } as const;

export const ConfessionAirlockModal: React.FC<ConfessionAirlockModalProps> = ({ isOpen, onClose, userName = 'Intern / New Joiner' }) => {
  const [input, setInput] = useState('');
  const [findings, setFindings] = useState<LeakedSecretFinding[]>([]);
  const [scanned, setScanned] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { soundEnabled } = useAlerts();

  const play = (action: () => void) => {
    if (soundEnabled) action();
  };

  const clear = () => {
    setInput('');
    setFindings([]);
    setScanned(false);
  };

  const scan = () => {
    play(() => soundManager.playPurge());
    setFindings(scanForSecrets(input));
    setScanned(true);
    play(() => soundManager.playSuccess());
  };

  const copy = (key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const downloadReport = () => {
    const body = `# BREACHMIRROR: ZERO-BLAME PRACTICE REPORT\n\nRECIPIENT: ${userName}\nDATE: ${new Date().toISOString()}\nNOTE: Training simulation. Not an official record.\n\nSUMMARY:\n${findings
      .map((finding, index) => `${index + 1}. [${finding.riskSeverity}] ${finding.type}\n   Possible impact: ${finding.blastRadius}`)
      .join('\n\n')}\n\nTAKEAWAYS:\n- Security is a team sport, never individual blame.\n- Reporting early prevents most catastrophic damage.\n`;
    const url = URL.createObjectURL(new Blob([body], { type: 'text/markdown' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `zero_blame_practice_report_${userName.toLowerCase().replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Private security check"
      description="Made a mistake or shared a secret? Check it here for practice and get clear next steps. Nothing leaves your browser."
      size="lg"
    >
      <div className="bm-ds space-y-5 p-5">
        <p className="flex items-start gap-2 rounded-md bg-safe-soft p-3 text-sm text-fg">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-safe" aria-hidden="true" />
          <span><strong>A supportive place to practice.</strong> This local simulator keeps your input in your browser. In a real incident, report it quickly so the team can help. Do not paste real credentials here.</span>
        </p>

        <section aria-labelledby="airlock-presets">
          <h3 id="airlock-presets" className="bm-eyebrow mb-2">Try a sample situation</h3>
          <ul className="flex flex-wrap gap-2">
            {PRESETS.map(preset => (
              <li key={preset.id}>
                <button
                  type="button"
                  className="bm-btn bm-btn-sm"
                  onClick={() => {
                    play(() => soundManager.playBlip(720));
                    setInput(SAMPLE_INPUTS[preset.id]);
                    setFindings([]);
                    setScanned(false);
                  }}
                >
                  {preset.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-2">
          <label htmlFor="airlock-input" className="text-sm font-semibold text-fg">Paste code, a secret token, or a suspicious link</label>
          <textarea
            id="airlock-input"
            rows={5}
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder="Paste a code snippet containing credentials, secret keys, or a phishing email…"
            className="w-full resize-y rounded-md border border-line-strong bg-surface p-3 font-mono text-xs text-fg placeholder:text-fg-3"
          />
          <div className="flex items-center justify-between gap-3">
            <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={clear}>Clear input</button>
            <button type="button" className="bm-btn bm-btn-primary" onClick={scan} disabled={!input.trim()}>
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Check and get next steps
            </button>
          </div>
        </div>

        <div aria-live="polite">
          {scanned && (
            <section aria-labelledby="airlock-results" className="bm-pop space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
                <h3 id="airlock-results" className="text-sm font-semibold text-fg">Check results ({findings.length} {findings.length === 1 ? 'item' : 'items'} found)</h3>
                <button type="button" className="bm-btn bm-btn-sm" onClick={downloadReport}>
                  <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download practice report
                </button>
              </div>
              {findings.map((finding, index) => (
                <article key={`${finding.type}-${index}`} className="space-y-3 rounded-lg border border-line bg-surface-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-fg">{finding.type}</h4>
                    <SeverityBadge severity={SEVERITY[finding.riskSeverity]} />
                  </div>
                  <div className="rounded-md bg-crit-soft p-3">
                    <p className="bm-eyebrow text-crit">Possible impact</p>
                    <p className="mt-0.5 text-sm text-fg">{finding.blastRadius}</p>
                  </div>
                  {([['1. Run the cleanup script', finding.remediationScript, `${index}-a`], ['2. Replace and disable the exposed credential', finding.rotationCommand, `${index}-b`]] as const).map(([label, code, key]) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-fg-2">{label}</span>
                        <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" onClick={() => copy(key, code)}>
                          {copied === key ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                          {copied === key ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="overflow-x-auto rounded-md border border-line bg-sunken p-3 font-mono text-xs text-fg" tabIndex={0}>{code}</pre>
                    </div>
                  ))}
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    </Dialog>
  );
};
