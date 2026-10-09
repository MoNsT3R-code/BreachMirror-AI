import { useCallback, useEffect, useState } from 'react';
import { SupportSummary, supportApi } from '../../services/local-api';

/** Badge counts for Security Support: polled while the tab is visible, refreshed on demand. */
export function useSupportSummary(enabled: boolean) {
  const [summary, setSummary] = useState<SupportSummary | null>(null);

  const refresh = useCallback(() => {
    if (!enabled) return;
    supportApi.summary().then(setSummary).catch(() => undefined);
  }, [enabled]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 45_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { summary, refresh };
}
