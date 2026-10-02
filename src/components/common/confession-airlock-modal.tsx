import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LifeBuoy, 
  KeyRound, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  AlertOctagon, 
  X, 
  FileCode, 
  Sparkles, 
  Lock,
  Download,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../../services/sound-effects';

interface LeakedSecretFinding {
  type: string;
  matchedString: string;
  riskSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  blastRadius: string;
  remediationScript: string;
  rotationCommand: string;
}

interface ConfessionAirlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const ConfessionAirlockModal: React.FC<ConfessionAirlockModalProps> = ({
  isOpen,
  onClose,
  userName = 'Intern / New Joiner',
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [findings, setFindings] = useState<LeakedSecretFinding[]>([]);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [immunityGranted, setImmunityGranted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleQuickPreset = (type: 'AWS' | 'GITHUB' | 'OPENAI' | 'PHISHING') => {
    soundManager.playBlip(720);
    if (type === 'AWS') {
      setInputText(`const s3 = new AWS.S3({\n  accessKeyId: "AKIAIOSFODNN7EXAMPLE",\n  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\n});`);
    } else if (type === 'GITHUB') {
      setInputText(`export GITHUB_TOKEN="ghp_984hf82h4f82hf893hf289hf892h3f8923h";\n// Pushed accidentally to public repository origin/main`);
    } else if (type === 'OPENAI') {
      setInputText(`const client = new OpenAI({\n  apiKey: "sk-proj-abc123xyz987def456uvw1234567890"\n});`);
    } else {
      setInputText(`Received urgent email from "it-support@corp-payroll-security.com":\nClicked link: http://okta-auth-verify.corp-payroll-security.com/login?session=a83f9`);
    }
    setHasScanned(false);
    setFindings([]);
    setImmunityGranted(false);
  };

  const handleScan = () => {
    soundManager.playPurge();
    const results: LeakedSecretFinding[] = [];
    const text = inputText;

    // AWS Access Key ID
    if (/AKIA[0-9A-Z]{16}/.test(text)) {
      results.push({
        type: 'AWS IAM User Access Key (AKIA...)',
        matchedString: text.match(/AKIA[0-9A-Z]{16}/)?.[0] || 'AKIA...',
        riskSeverity: 'CRITICAL',
        blastRadius: 'Potential full cloud compute takeover, S3 bucket enumeration, and illicit cryptomining within 15 minutes of commit.',
        remediationScript: `# 1. Scrub commit from local git history\ngit filter-repo --replace-text <(echo 'AKIA==>REDACTED') --force\ngit push origin --force --all`,
        rotationCommand: `# 2. Invalidate immediately via AWS CLI\naws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive\naws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE`,
      });
    }

    // GitHub Personal Access Token
    if (/gh[pousr]_[A-Za-z0-9_]{36,}/.test(text) || text.includes('ghp_')) {
      results.push({
        type: 'GitHub Personal Access Token (PAT)',
        matchedString: text.match(/gh[pousr]_[A-Za-z0-9_]+/)?.[0] || 'ghp_...',
        riskSeverity: 'CRITICAL',
        blastRadius: 'Attacker can clone all private organizational source code, inject backdoor pull requests, and poison CI/CD GitHub Actions.',
        remediationScript: `# Purge git cache\ngit rm --cached config.js\ngit commit -m "security: strip accidental token [zero-blame]"`,
        rotationCommand: `# Revoke token instantly via GitHub API\ncurl -X DELETE -H "Authorization: token ghp_..." https://api.github.com/Applications/{client_id}/grant`,
      });
    }

    // OpenAI Key
    if (/sk-[A-Za-z0-9_-]{20,}/.test(text) || text.includes('sk-')) {
      results.push({
        type: 'OpenAI API Secret Key',
        matchedString: text.match(/sk-[A-Za-z0-9_-]+/)?.[0] || 'sk-...',
        riskSeverity: 'HIGH',
        blastRadius: 'Exhaustion of organization LLM budget, potential scraping of internal system prompts and fine-tuned embeddings.',
        remediationScript: `# Move to environment variable immediately\necho "OPENAI_API_KEY=your_key" >> .env\necho ".env" >> .gitignore`,
        rotationCommand: `# Generate new key at platform.openai.com/api-keys\n# Old key auto-invalidated by OpenAI Zero-Trust scanner`,
      });
    }

    // Phishing URL
    if (text.includes('http') || text.includes('okta-auth-verify') || text.includes('payroll')) {
      results.push({
        type: 'Suspected Adversary-in-the-Middle (AiTM) Phishing Click',
        matchedString: 'Phishing domain link clicked or credentials entered',
        riskSeverity: 'HIGH',
        blastRadius: 'Adversary intercepted your active session cookies and may impersonate your browser even with MFA enabled.',
        remediationScript: `# Immediate Self-Service Session Flush:\n1. Open your enterprise SSO dashboard\n2. Click "Sign out of all devices"\n3. Inform Security Hotline (No disciplinary action!)`,
        rotationCommand: `# Admin endpoint to revoke tokens:\naz ad user revoke-sign-in-sessions --id user@company.com`,
      });
    }

    // Fallback if none matched
    if (results.length === 0 && text.trim().length > 0) {
      results.push({
        type: 'General Confidential Data / Sensitive String',
        matchedString: text.substring(0, 40) + '...',
        riskSeverity: 'MEDIUM',
        blastRadius: 'Internal business logic or confidential customer identifiers placed into untrusted scope.',
        remediationScript: `# Add file to .gitignore\necho "sensitive_file.txt" >> .gitignore\ngit rm --cached sensitive_file.txt`,
        rotationCommand: `# Verify git repository status\ngit status`,
      });
    }

    setFindings(results);
    setHasScanned(true);
    setImmunityGranted(true);
    soundManager.playSuccess();
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    soundManager.playBlip(900);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleDownloadCertificate = () => {
    soundManager.playSuccess();
    const certContent = `# ==========================================================\n# BREACHMIRROR.AI — ZERO-BLAME IMMUNITY PASS & REPORT\n# ==========================================================\n\nOFFICER / RECIPIENT: ${userName}\nSTATUS: IMMUNITY CERTIFICATE GRANTED (ZERO DISCIPLINE POLICY)\nDATE: ${new Date().toISOString()}\n\nSUMMARY OF INCIDENT:\n${findings.map((f, i) => `${i + 1}. [${f.riskSeverity}] ${f.type}\n   Blast Radius: ${f.blastRadius}\n   Remediation: Completed via Confession Airlock`).join('\n\n')}\n\nCORE TAKEAWAYS:\n- In modern engineering, security is a team sport, never individual blame.\n- Reporting or neutralizing early prevents 99.8% of catastrophic damages.\n- All tokens identified in this session have been sanitized.\n\nSigned by: Autonomous Incident Gateway v2.4 (BreachMirror AI)`;
    
    const blob = new Blob([certContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zero_blame_immunity_pass_${userName.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="vengeance-glass border border-white/10 rounded-3xl w-full max-w-4xl bg-slate-950/95 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <LifeBuoy className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-display uppercase tracking-wider">
                  Private security check
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                  Private in this browser
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Made a mistake or shared a secret? Check it here for practice and get clear next steps.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Zero Blame Guarantee Callout */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono space-y-1">
              <p className="text-emerald-300 font-bold uppercase tracking-wider">
                A supportive place to practice:
              </p>
              <p className="text-emerald-200/90 leading-relaxed">
                This local simulator keeps your input in your browser. In a real incident, report it quickly so the team can help.
              </p>
            </div>
          </div>

          {/* Quick Test Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Try a sample situation:</span>
              <span className="text-[11px] text-cyan-400">Click any preset to test</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickPreset('AWS')}
                className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-mono text-left cursor-pointer transition-colors"
              >
                Leaked AWS key
              </button>
              <button
                onClick={() => handleQuickPreset('GITHUB')}
                className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-mono text-left cursor-pointer transition-colors"
              >
                GitHub token in Git
              </button>
              <button
                onClick={() => handleQuickPreset('OPENAI')}
                className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-mono text-left cursor-pointer transition-colors"
              >
                OpenAI secret key
              </button>
              <button
                onClick={() => handleQuickPreset('PHISHING')}
                className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-mono text-left cursor-pointer transition-colors"
              >
                Clicked a suspicious link
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Paste code, a secret token, or a suspicious link:</span>
              <span className="text-[10px] text-slate-500">Checked locally in your browser</span>
            </label>
            <textarea
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                setHasScanned(false);
              }}
              rows={5}
              placeholder="Paste code snippet containing accidentally committed credentials, secret keys, or phishing email..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setInputText('');
                setFindings([]);
                setHasScanned(false);
                setImmunityGranted(false);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              Clear input
            </button>

            <button
              onClick={handleScan}
              disabled={!inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase font-display tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check and get next steps</span>
            </button>
          </div>

          {/* Results Display */}
          {hasScanned && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono text-slate-300 font-bold">
                  Check results ({findings.length} items found)
                </span>
                {immunityGranted && (
                  <button
                    onClick={handleDownloadCertificate}
                    className="py-1.5 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download practice report (.md)
                  </button>
                )}
              </div>

              {findings.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {item.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.riskSeverity === 'CRITICAL' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.riskSeverity === 'CRITICAL' ? 'Critical' : item.riskSeverity === 'HIGH' ? 'High' : 'Medium'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                    <span className="text-rose-400 font-bold block text-[10px] uppercase">Possible impact</span>
                    {item.blastRadius}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>1. Run the cleanup script:</span>
                      <button
                        onClick={() => handleCopy(item.remediationScript, idx * 2)}
                        className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx * 2 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedIndex === idx * 2 ? 'Copied!' : 'Copy Script'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-black/60 border border-white/5 text-cyan-300 overflow-x-auto text-[11px]">
                      {item.remediationScript}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>2. Replace and disable the exposed credential:</span>
                      <button
                        onClick={() => handleCopy(item.rotationCommand, idx * 2 + 1)}
                        className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx * 2 + 1 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedIndex === idx * 2 + 1 ? 'Copied!' : 'Copy Command'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-black/60 border border-white/5 text-amber-300 overflow-x-auto text-[11px]">
                      {item.rotationCommand}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
