import React, { useState } from 'react';
import { Headset, ShieldCheck } from 'lucide-react';
import { AgentConsole } from './agent-console';
import { EmployeeRequests } from './employee-requests';

interface SupportCenterProps {
  isSecurityAgent: boolean;
  securityAgentId?: string;
  /** A request to open, e.g. from the Copilot's "Track this request". */
  initialTicketId?: string;
  onOpenSection?: (sectionId: string) => void;
  /** Called after anything that may change the header badge counts. */
  onActivity?: () => void;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ isSecurityAgent, securityAgentId, initialTicketId, onOpenSection, onActivity }) => {
  const [view, setView] = useState<'mine' | 'console'>('mine');
  return (
    <div className="bm-ds space-y-5">
      {isSecurityAgent && (
        <div className="bm-glass inline-flex rounded-lg p-1" role="tablist" aria-label="Security Support views">
          {[
            { id: 'mine' as const, label: 'My requests', icon: <Headset className="h-4 w-4" aria-hidden="true" /> },
            { id: 'console' as const, label: 'Security Team console', icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
          ].map(tab => (
            <button key={tab.id} type="button" role="tab" aria-selected={view === tab.id} onClick={() => setView(tab.id)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium ${view === tab.id ? 'bg-accent text-accent-fg' : 'text-fg-2 hover:bg-surface-2'}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}
      {view === 'console' && isSecurityAgent ? (
        <AgentConsole agentId={securityAgentId} onOpenSection={onOpenSection} onActivity={onActivity} />
      ) : (
        <EmployeeRequests initialTicketId={initialTicketId} onOpenSection={onOpenSection} onActivity={onActivity} />
      )}
    </div>
  );
};
