import React, { useId, useState } from 'react';
import { Award, BookOpen, Eye, EyeOff, Loader2, Radio } from 'lucide-react';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { BrandMark } from '../shell/brand-mark';
import { SceneryBackground } from '../shell/scenery-background';
import { XYZBackdrop } from '../shell/xyz-backdrop';
import { useTheme } from '../../context/theme-context';
import { AuthRole } from '../../shared-types';
import { confirmPasswordResetApi, loginApi, registerApi, requestPasswordResetApi } from '../../services/local-api';

interface LoginPanelProps {
  onLogin: (user: { id: string; name: string; email: string; role: AuthRole }) => void;
  initialName?: string;
  sessionMessage?: string;
}

const PRESET_ROLES: AuthRole[] = ['Incident Commander', 'Threat Hunter', 'SOC Security Lead', 'Cloud Security Architect'];

type PanelMode = 'login' | 'register' | 'reset-request' | 'reset-confirm';
const COMPANY_EMAIL_MESSAGE = 'Only @xyz.com email addresses are allowed.';
const USERNAME_EMAIL_MESSAGE = 'Username must match your company email username.';
const PASSWORD_POLICY_MESSAGE = 'Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
const CONFIRM_PASSWORD_MESSAGE = 'Passwords do not match. Please confirm your password.';
const COMMON_PASSWORDS = new Set(['password', 'password123', 'password123!', 'qwerty', 'qwerty123', 'letmein', 'welcome', 'admin', 'admin123', 'changeme', 'iloveyou', '12345678', '123456789']);

const INPUT_CLASS = 'min-h-11 w-full rounded-md border border-line-strong bg-surface px-3.5 text-sm text-fg placeholder:text-fg-3';

const Field: React.FC<{ label: string; htmlFor: string; hint?: React.ReactNode; children: React.ReactNode }> = ({ label, htmlFor, hint, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="text-sm font-medium text-fg">{label}</label>
    {children}
    {hint && <div className="text-xs text-fg-3">{hint}</div>}
  </div>
);

/** Large mirrored shield: the threat (dashed outline) and you (solid), with a faint reflection below. */
const MirrorIllustration: React.FC = () => (
  <svg viewBox="0 0 240 340" className="mx-auto w-48 max-w-full lg:w-60" role="img" aria-label="A shield split down the middle: a dashed outline on the left for the threat and a solid half on the right for you">
    <defs>
      <linearGradient id="refl-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--bm-fg)" stopOpacity="0.14" />
        <stop offset="100%" stopColor="var(--bm-fg)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g>
      <path d="M120 20 L30 52 V120 C30 172 68 214 120 236 Z" fill="none" stroke="var(--bm-fg-3)" strokeWidth="3" strokeLinejoin="round" strokeDasharray="7 6" />
      <path d="M120 20 L210 52 V120 C210 172 172 214 120 236 Z" fill="var(--bm-accent)" />
      <path d="M120 14 V242" stroke="var(--bm-bg)" strokeWidth="3" />
    </g>
    <g transform="translate(0 472) scale(1 -1)" opacity="0.5" aria-hidden="true">
      <path d="M120 236 C68 214 30 172 30 120 V52 L120 20" fill="none" stroke="url(#refl-fade)" strokeWidth="3" />
      <path d="M120 236 C172 214 210 172 210 120 V52 L120 20 Z" fill="url(#refl-fade)" />
    </g>
  </svg>
);

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { resolvedTheme, scenery } = useTheme();
  const messageId = useId();

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
        await new Promise(resolve => window.setTimeout(resolve, 350));
        onLogin(result.user);
      }
      if (mode === 'register') {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();
        const emailMatchesCompany = /^[^\s@]+@xyz\.com$/.test(normalizedEmail);
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
  const changeMode = (nextMode: PanelMode) => {
    setMode(nextMode);
    setMessage('');
    setIsError(false);
    setPassword('');
    setConfirmPassword('');
  };

  const title = isRegistration ? 'Create your training account' : isReset ? 'Reset your password' : 'Sign in';
  const subtitle = isRegistration ? 'Use your @xyz.com email. Accounts are stored locally for this training app.' : isReset ? 'Use the local training account recovery flow.' : 'Welcome back. Pick up where you left off.';
  const submitLabel = isAuthorizing ? 'Working…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : mode === 'reset-request' ? 'Send reset request' : 'Set new password';
  const describedBy = message ? messageId : undefined;

  return (
    <div className="relative isolate grid min-h-screen grid-cols-[minmax(0,1fr)] text-fg lg:grid-cols-[1.05fr_1fr]">
      <XYZBackdrop />
      {resolvedTheme === 'light' && scenery && <SceneryBackground />}

      <aside className="bm-ds bm-glass relative z-10 hidden flex-col justify-between !rounded-none border-y-0 border-l-0 p-10 lg:flex xl:p-14">
        <BrandMark size={32} />
        <div className="space-y-8">
          <MirrorIllustration />
          <div className="mx-auto max-w-md space-y-3">
            <h2 className="bm-h font-display text-display font-semibold text-fg">See your security habits reflected.</h2>
            <p className="bm-p text-base text-fg-2">BreachMirror is a safe place to practice real security decisions, learn XYZ policy and earn your certification, with zero blame.</p>
          </div>
          <ul className="mx-auto grid max-w-md gap-3 text-sm text-fg-2">
            <li className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-md bg-accent-soft text-accent-text"><Radio className="h-4 w-4" aria-hidden="true" /></span>Practice against simulated threats</li>
            <li className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-md bg-accent-soft text-accent-text"><BookOpen className="h-4 w-4" aria-hidden="true" /></span>Learn the policy with drills and an assistant</li>
            <li className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-md bg-accent-soft text-accent-text"><Award className="h-4 w-4" aria-hidden="true" /></span>Pass the exam and earn a certificate</li>
          </ul>
        </div>
        <p className="text-xs text-fg-3">Training simulation · XYZ Information Services Corp</p>
      </aside>

      <main id="main-content" tabIndex={-1} className="relative z-10 flex min-w-0 flex-col px-5 py-6 sm:px-10">
        <div className="bm-ds flex items-center justify-between gap-3">
          <span className="lg:invisible"><BrandMark size={26} /></span>
          <ThemeSwitcher />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="bm-glass-strong rounded-2xl p-6 sm:p-8">
          <div className="bm-ds space-y-1.5">
            <h1 className="bm-h font-display text-3xl font-semibold tracking-tight text-fg">{title}</h1>
            <p className="bm-p text-sm text-fg-3">{subtitle}</p>
          </div>

          <div aria-live="polite" className="bm-ds">
            {message && (
              <p id={messageId} role={isError ? 'alert' : 'status'} className={`mt-5 rounded-md px-3.5 py-2.5 text-sm ${isError ? 'bg-crit-soft text-crit' : 'bg-safe-soft text-safe'}`}>
                {message}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="bm-ds mt-6 space-y-4" noValidate={false}>
            {isRegistration && (
              <Field label="Full name" htmlFor="register-name-input">
                <input id="register-name-input" type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Your name" maxLength={80} required autoComplete="name" autoFocus aria-invalid={isError} aria-describedby={describedBy} className={INPUT_CLASS} />
              </Field>
            )}

            {isRegistration && (
              <Field label="Username" htmlFor="register-username-input" hint="Must match the part of your email before the @.">
                <input id="register-username-input" type="text" value={username} onChange={event => setUsername(event.target.value)} placeholder="Your XYZ username" maxLength={120} required autoComplete="username" aria-invalid={isError} className={INPUT_CLASS} />
              </Field>
            )}

            <Field label={isRegistration ? 'Company email' : 'Username or company email'} htmlFor="auth-email-input">
              <input
                id="auth-email-input"
                type={isRegistration ? 'email' : 'text'}
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder={isRegistration ? 'jordan.lee@xyz.com' : 'Username or jordan.lee@xyz.com'}
                maxLength={254}
                required
                autoComplete={isRegistration ? 'email' : 'username'}
                autoFocus={!isRegistration}
                aria-invalid={isError}
                aria-describedby={!isRegistration ? describedBy : undefined}
                className={INPUT_CLASS}
              />
            </Field>

            {mode === 'reset-confirm' && (
              <Field label="Development reset token" htmlFor="reset-token-input" hint="Printed in the dev server log; it is never shown in the app.">
                <input id="reset-token-input" type="text" value={resetToken} onChange={event => setResetToken(event.target.value)} required autoComplete="one-time-code" className={INPUT_CLASS} />
              </Field>
            )}

            {mode !== 'reset-request' && (
              <Field
                label={mode === 'reset-confirm' ? 'New password' : 'Password'}
                htmlFor="auth-password-input"
                hint={
                  (isRegistration || mode === 'reset-confirm') && (
                    <ul className="list-disc space-y-0.5 pl-4">
                      <li>8-64 characters</li>
                      <li>Uppercase and lowercase letters</li>
                      <li>A number and a special character</li>
                      <li>Must not contain your email or a common password</li>
                    </ul>
                  )
                }
              >
                <div className="relative">
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Enter password"
                    maxLength={64}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    aria-invalid={isError}
                    className={`${INPUT_CLASS} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded text-fg-3 hover:bg-sunken hover:text-fg"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
              </Field>
            )}

            {isRegistration && (
              <Field label="Confirm password" htmlFor="register-confirm-password-input">
                <input id="register-confirm-password-input" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Re-enter password" maxLength={64} required autoComplete="new-password" aria-invalid={isError} className={INPUT_CLASS} />
              </Field>
            )}

            {isRegistration && (
              <Field label="Your role" htmlFor="login-role-select">
                <select id="login-role-select" value={selectedRole} onChange={event => setSelectedRole(event.target.value as AuthRole)} className={INPUT_CLASS}>
                  {PRESET_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </Field>
            )}

            <button type="submit" disabled={isAuthorizing} className="bm-btn bm-btn-primary min-h-11 w-full text-base">
              {isAuthorizing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {submitLabel}
            </button>
          </form>

          <div className="bm-ds mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            {isRegistration || isReset ? (
              <button type="button" onClick={() => changeMode('login')} className="rounded px-1 py-1.5 font-medium text-accent-text hover:underline">Back to sign in</button>
            ) : (
              <>
                <span className="text-fg-3">
                  New here?{' '}
                  <button type="button" onClick={() => changeMode('register')} className="rounded px-0.5 py-1.5 font-medium text-accent-text hover:underline">Create an account</button>
                </span>
                <button type="button" onClick={() => changeMode('reset-request')} className="rounded px-1 py-1.5 font-medium text-accent-text hover:underline">Forgot password?</button>
              </>
            )}
          </div>
          </div>
        </div>

        <p className="bm-ds bm-glass mx-auto rounded-full px-4 py-1.5 text-center text-xs text-fg-3 lg:hidden">Training simulation · XYZ Information Services Corp</p>
      </main>
    </div>
  );
};
