export interface LeakedSecretFinding {
  type: string;
  matchedString: string;
  riskSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  blastRadius: string;
  remediationScript: string;
  rotationCommand: string;
}

export type SamplePreset = 'AWS' | 'GITHUB' | 'OPENAI' | 'PHISHING';

export const SAMPLE_INPUTS: Record<SamplePreset, string> = {
  AWS: 'const s3 = new AWS.S3({\n  accessKeyId: "AKIAIOSFODNN7EXAMPLE",\n  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\n});',
  GITHUB: 'export GITHUB_TOKEN="ghp_984hf82h4f82hf893hf289hf892h3f8923h";\n// Pushed accidentally to public repository origin/main',
  OPENAI: 'const client = new OpenAI({\n  apiKey: "sk-proj-abc123xyz987def456uvw1234567890"\n});',
  PHISHING: 'Received urgent email from "it-support@corp-payroll-security.com":\nClicked link: http://okta-auth-verify.corp-payroll-security.com/login?session=a83f9',
};

/**
 * Lightweight, local-only detector used for training. It is a demonstration,
 * not a replacement for a real secret scanner.
 */
export function scanForSecrets(text: string): LeakedSecretFinding[] {
  const results: LeakedSecretFinding[] = [];

  if (/AKIA[0-9A-Z]{16}/.test(text)) {
    results.push({
      type: 'AWS IAM user access key (AKIA...)',
      matchedString: text.match(/AKIA[0-9A-Z]{16}/)?.[0] ?? 'AKIA...',
      riskSeverity: 'CRITICAL',
      blastRadius: 'Potential full cloud compute takeover, S3 bucket enumeration and illicit cryptomining within 15 minutes of commit.',
      remediationScript: "# 1. Scrub the commit from local git history\ngit filter-repo --replace-text <(echo 'AKIA==>REDACTED') --force\ngit push origin --force --all",
      rotationCommand: '# 2. Invalidate immediately via the AWS CLI\naws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive\naws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE',
    });
  }

  if (/gh[pousr]_[A-Za-z0-9_]{36,}/.test(text) || text.includes('ghp_')) {
    results.push({
      type: 'GitHub personal access token (PAT)',
      matchedString: text.match(/gh[pousr]_[A-Za-z0-9_]+/)?.[0] ?? 'ghp_...',
      riskSeverity: 'CRITICAL',
      blastRadius: 'An attacker can clone private source code, inject backdoor pull requests and poison CI/CD workflows.',
      remediationScript: '# Purge git cache\ngit rm --cached config.js\ngit commit -m "security: strip accidental token [zero-blame]"',
      rotationCommand: '# Revoke the token instantly via the GitHub API\ncurl -X DELETE -H "Authorization: token ghp_..." https://api.github.com/Applications/{client_id}/grant',
    });
  }

  if (/sk-[A-Za-z0-9_-]{20,}/.test(text) || text.includes('sk-')) {
    results.push({
      type: 'OpenAI API secret key',
      matchedString: text.match(/sk-[A-Za-z0-9_-]+/)?.[0] ?? 'sk-...',
      riskSeverity: 'HIGH',
      blastRadius: 'Exhaustion of the organization LLM budget and potential scraping of internal system prompts.',
      remediationScript: '# Move to an environment variable immediately\necho "OPENAI_API_KEY=your_key" >> .env\necho ".env" >> .gitignore',
      rotationCommand: '# Generate a new key at platform.openai.com/api-keys\n# The old key is invalidated by the provider',
    });
  }

  if (text.includes('http') || text.includes('okta-auth-verify') || text.includes('payroll')) {
    results.push({
      type: 'Suspected adversary-in-the-middle (AiTM) phishing click',
      matchedString: 'Phishing domain link clicked or credentials entered',
      riskSeverity: 'HIGH',
      blastRadius: 'An adversary may have intercepted your session cookies and could impersonate your browser even with MFA enabled.',
      remediationScript: '# Immediate self-service session flush:\n1. Open your enterprise SSO dashboard\n2. Select "Sign out of all devices"\n3. Inform the Security hotline (no disciplinary action)',
      rotationCommand: '# Admin endpoint to revoke tokens:\naz ad user revoke-sign-in-sessions --id user@company.com',
    });
  }

  if (results.length === 0 && text.trim().length > 0) {
    results.push({
      type: 'General confidential data or sensitive string',
      matchedString: `${text.substring(0, 40)}...`,
      riskSeverity: 'MEDIUM',
      blastRadius: 'Internal business logic or confidential customer identifiers placed into an untrusted scope.',
      remediationScript: '# Add the file to .gitignore\necho "sensitive_file.txt" >> .gitignore\ngit rm --cached sensitive_file.txt',
      rotationCommand: '# Verify the repository status\ngit status',
    });
  }

  return results;
}
