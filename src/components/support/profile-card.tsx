import React, { useEffect, useState } from 'react';
import { Check, IdCard, Lock } from 'lucide-react';
import { EmployeeProfile, supportApi } from '../../services/local-api';

const INPUT_CLASS = 'min-h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-3';
const EMPTY: Omit<EmployeeProfile, 'updatedAt'> = { employeeId: '', department: '', businessUnit: '', phone: '', shareContact: false };

/** The employee decides what the Security Team sees; contact details stay private unless they opt in. */
export const ProfileCard: React.FC = () => {
  const [profile, setProfile] = useState(EMPTY);
  const [state, setState] = useState<'loading' | 'idle' | 'saving' | 'saved'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    supportApi
      .profile()
      .then(result => setProfile(result.profile ? { ...EMPTY, ...result.profile } : EMPTY))
      .catch(() => undefined)
      .finally(() => setState('idle'));
  }, []);

  const update = (field: keyof typeof EMPTY, value: string | boolean) => {
    setProfile(current => ({ ...current, [field]: value }));
    setState('idle');
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setState('saving');
    try {
      const result = await supportApi.saveProfile(profile);
      setProfile({ ...EMPTY, ...result.profile });
      setState('saved');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save your details.');
      setState('idle');
    }
  };

  return (
    <section className="bm-card space-y-4 p-4" aria-labelledby="profile-title">
      <div className="flex items-start gap-3">
        <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
        <div>
          <h2 id="profile-title" className="bm-h font-display text-base font-semibold text-fg">Details for the Security Team</h2>
          <p className="text-xs text-fg-3">Shared with the Security Team only when you have a request, so they can help faster.</p>
        </div>
      </div>
      <form onSubmit={save} className="space-y-3" aria-busy={state === 'loading'}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs font-medium text-fg-2">
            Employee ID
            <input className={INPUT_CLASS} value={profile.employeeId} onChange={event => update('employeeId', event.target.value)} maxLength={20} placeholder="E-12345" autoComplete="off" />
          </label>
          <label className="space-y-1 text-xs font-medium text-fg-2">
            Department
            <input className={INPUT_CLASS} value={profile.department} onChange={event => update('department', event.target.value)} maxLength={80} placeholder="Title Operations" />
          </label>
          <label className="space-y-1 text-xs font-medium text-fg-2">
            Business unit
            <input className={INPUT_CLASS} value={profile.businessUnit} onChange={event => update('businessUnit', event.target.value)} maxLength={80} placeholder="Commercial Services" />
          </label>
          <label className="space-y-1 text-xs font-medium text-fg-2">
            Phone (optional)
            <input className={INPUT_CLASS} value={profile.phone} onChange={event => update('phone', event.target.value)} maxLength={25} inputMode="tel" autoComplete="tel" placeholder="+1 713 555 0100" />
          </label>
        </div>
        <label className="flex items-start gap-2.5 text-sm text-fg">
          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--bm-accent)]" checked={profile.shareContact} onChange={event => update('shareContact', event.target.checked)} />
          <span>
            Allow the Security Team to see my email address and phone number
            <span className="block text-xs text-fg-3">If unchecked, they can still reply here, in your request.</span>
          </span>
        </label>
        {error && <p role="alert" className="rounded-md bg-crit-soft p-2.5 text-sm text-fg">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" className="bm-btn bm-btn-primary bm-btn-sm" disabled={state === 'saving' || state === 'loading'}>
            {state === 'saving' ? 'Saving…' : 'Save details'}
          </button>
          {state === 'saved' && (
            <span role="status" className="flex items-center gap-1 text-xs text-fg-2">
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Saved
            </span>
          )}
        </div>
      </form>
      <p className="flex gap-2 border-t border-line pt-3 text-xs text-fg-3">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        For their privacy, Security Team members appear only by their Security Agent ID (for example SEC-1042). Your requests are encrypted at rest and every access is audited.
      </p>
    </section>
  );
};
