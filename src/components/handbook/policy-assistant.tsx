import React from 'react';
import { CopilotWorkspace } from '../copilot/copilot-workspace';

interface PolicyAssistantProps {
  onSelectSection?: (sectionId: string) => void;
}

/** The handbook's "Ask a question" mode: the Policy Copilot in its compact layout. */
export const PolicyAssistant: React.FC<PolicyAssistantProps> = ({ onSelectSection }) => (
  <div className="bm-ds space-y-3">
    <div>
      <h3 className="bm-h font-display text-xl font-semibold text-fg">Policy Copilot</h3>
      <p className="mt-1 text-sm text-fg-3">Hybrid retrieval and a LangGraph agent answer from the policy text only, with every statement cited and verified.</p>
    </div>
    <CopilotWorkspace compact onOpenSection={onSelectSection} />
  </div>
);
