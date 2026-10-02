import React, { useState } from 'react';
import { KeyRound, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { ThemeToggle } from '../common/theme-toggle';
import { BrandLogo } from '../common/brand-logo';
import { AuthRole } from '../../shared-types';
import { confirmPasswordResetApi, loginApi, registerApi, requestPasswordResetApi } from '../../services/local-api';

interface LoginPanelProps {
  onLogin: (user: { id: string; name: string; email: string; role: AuthRole }) => void;
  initialName?: string;
  sessionMessage?: string;
}

const PRESET_ROLES: AuthRole[] = [
  'Incident Commander',
  'Threat Hunter',
  'SOC Security Lead',
  'Cloud Security Architect',
];

type PanelMode = 'login' | 'register' | 'reset-request' | 'reset-confirm';
const COMPANY_EMAIL_MESSAGE = 'Only @stewart.com email addresses are allowed.';
const USERNAME_EMAIL_MESSAGE = 'Username must match your company email username.';
const PASSWORD_POLICY_MESSAGE = 'Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
const CONFIRM_PASSWORD_MESSAGE = 'Passwords do not match. Please confirm your password.';
const COMMON_PASSWORDS = new Set(['password', 'password123', 'password123!', 'qwerty', 'qwerty123', 'letmein', 'welcome', 'admin', 'admin123', 'changeme', 'iloveyou', '12345678', '123456789']);

export const LoginPanel: React.FC<LoginPanelProps> = ({ onLogin, initialName = '', sessionMessage }) => {
  const [name, setName] = useState<string>(initialName);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AuthRole>(PRESET_ROLES[0]);
  const [mode, setMode] = useState<PanelMode>('login');
  const [message, setMessage] = useState<string>(sessionMessage ?? '');
  const [isError, setIsError] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isAuthorizing) return;

    setIsAuthorizing(true);
    setMessage('');
    setIsError(false);
    try {
      if (mode === 'login') {
        const result = await loginApi(email, password);
        setMessage(result.message ?? 'Login successful.');
        await new Promise((resolve) => window.setTimeout(resolve, 350));
        onLogin(result.user);
      }
      if (mode === 'register') {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();
        const emailMatchesCompany = /^[^\s@]+@stewart\.com$/.test(normalizedEmail);
        if (!emailMatchesCompany) throw new Error(COMPANY_EMAIL_MESSAGE);
        if (normalizedUsername !== normalizedEmail.slice(0, normalizedEmail.indexOf('@'))) throw new Error(USERNAME_EMAIL_MESSAGE);
        const passwordIsStrong = password.length >= 8 && password.length <= 64 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
        const passwordIdentifiers = [normalizedUsername, normalizedEmail, name.trim().toLowerCase()].filter(Boolean);
        if (!passwordIsStrong || COMMON_PASSWORDS.has(password.toLowerCase()) || passwordIdentifiers.some(identifier => password.toLowerCase().includes(identifier))) throw new Error(PASSWORD_POLICY_MESSAGE);
        if (!confirmPassword || password !== confirmPassword) throw new Error(CONFIRM_PASSWORD_MESSAGE);
        const result = await registerApi(name, username, email, selectedRole, password, confirmPassword);
        setMessage(result.message);
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
      if (mode === 'reset-request') {
        const result = await requestPasswordResetApi(email);
        setMessage(result.message);
        setMode('reset-confirm');
      }
      if (mode === 'reset-confirm') {
        const result = await confirmPasswordResetApi(resetToken, password);
        setMessage(result.message);
        setMode('login');
        setPassword('');
        setResetToken('');
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Unable to complete authentication request.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const isRegistration = mode === 'register';
  const isReset = mode === 'reset-request' || mode === 'reset-confirm';
  const changeMode = (nextMode: PanelMode) => { setMode(nextMode); setMessage(''); setIsError(false); setPassword(''); setConfirmPassword(''); };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-y-auto px-4 py-6 bg-[#030712] light:bg-[#f8fafc]">
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_42%)]" />

      <main className="w-full max-w-md pt-14">
        <section className="rounded-3xl p-6 sm:p-8 vengeance-glass border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white">
          <header className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
            <BrandLogo size="sm" withText={true} showVersion={false} subtitle="Training access" />
            <ThemeToggle size={6.5} />
          </header>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                {isRegistration ? 'Create training account' : isReset ? 'Reset password' : 'Sign in to training'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{isReset ? 'Use the local training account recovery flow' : 'Use your local training profile'}</p>
            </div>
          </div>

          {message && <p role={isError ? 'alert' : 'status'} className={`mb-4 rounded-xl border px-3 py-2 text-xs ${isError ? 'border-rose-500/40 bg-rose-500/10 text-rose-300' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'}`}>{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistration && <div className="space-y-2">
              <label
                htmlFor="register-name-input"
                className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <UserRound className="w-3.5 h-3.5 text-cyan-400" />
                Full name
              </label>
              <input
                id="register-name-input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                maxLength={80}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none transition-all"
                autoFocus
              />
            </div>}

            {isRegistration && <div className="space-y-2">
              <label htmlFor="register-username-input" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5 text-cyan-400" />Username</label>
              <input id="register-username-input" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Your Stewart username" maxLength={120} required className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none transition-all" />
            </div>}

            <div className="space-y-2">
              <label htmlFor="auth-email-input" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5 text-cyan-400" />{isRegistration ? 'Company email' : 'Username or company email'}</label>
              <input id="auth-email-input" type={isRegistration ? 'email' : 'text'} value={email} onChange={(event) => setEmail(event.target.value)} placeholder={isRegistration ? 'name@stewart.com' : 'Username or name@stewart.com'} maxLength={254} required className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none transition-all" autoFocus={!isRegistration} />
            </div>

            {mode === 'reset-confirm' && <div className="space-y-2"><label htmlFor="reset-token-input" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">Development reset token</label><input id="reset-token-input" type="text" value={resetToken} onChange={(event) => setResetToken(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm outline-none transition-all" /></div>}

            {mode !== 'reset-request' && <div className="space-y-2">
              <label
                htmlFor="auth-password-input"
                className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <LockKeyhole className="w-3.5 h-3.5 text-cyan-400" />
                Password
              </label>
              <input
                id="auth-password-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                maxLength={64}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none transition-all"
              />
              {(isRegistration || mode === 'reset-confirm') && <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4"><li>8-64 characters</li><li>Uppercase and lowercase letters</li><li>A number and special character</li><li>Must not contain your email or a common password</li></ul>}
            </div>}

            {isRegistration && <div className="space-y-2">
              <label htmlFor="register-confirm-password-input" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><LockKeyhole className="w-3.5 h-3.5 text-cyan-400" />Confirm password</label>
              <input id="register-confirm-password-input" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter password" maxLength={64} required className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none transition-all" />
            </div>}

            {isRegistration && <div className="space-y-2">
              <label
                htmlFor="login-role-select"
                className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Your role
              </label>
              <select
                id="login-role-select"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value as AuthRole)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white text-sm outline-none transition-all"
              >
                {PRESET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>}

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <KeyRound className="w-4 h-4" />
              {isAuthorizing ? 'Processing...' : mode === 'login' ? 'Start Training' : mode === 'register' ? 'Create Account' : mode === 'reset-request' ? 'Send Reset Request' : 'Set New Password'}
            </button>
          </form>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => changeMode(isRegistration ? 'login' : 'register')}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
            >
              {isRegistration ? 'Back to sign in' : 'Register'}
            </button>
            {mode === 'login' && (
              <button type="button" onClick={() => changeMode('reset-request')} className="px-3 py-2 text-xs text-cyan-400 hover:underline">
                Forgot password?
              </button>
            )}
            {isReset && (
              <button type="button" onClick={() => changeMode('login')} className="px-3 py-2 text-xs text-cyan-400 hover:underline">
                Back to sign in
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
