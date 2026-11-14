export interface AuditChecklistItem {
  id: string;
  title: string;
  points: number;
  description: string;
  policyReference: string;
  category: string;
  remediationAction: string;
}

export interface FlashcardDrill {
  id: string;
  category: string;
  frontQuestion: string;
  backAnswer: string;
  mnemonicOrTip: string;
  ruleCitation: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  actionDescription: string;
  verdict: 'APPROVED' | 'CONDITIONAL' | 'VIOLATION';
  verdictTitle: string;
  scoreDelta: number;
  policySection: string;
  policyPage: string;
  regulatoryImpact: string;
  escalationContact: string;
  remediationSteps: string[];
}

export interface DecisionScenario {
  id: string;
  category: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  context: string;
  userPrompt: string;
  options: DecisionOption[];
}

export const AUDIT_CHECKLIST_ITEMS: AuditChecklistItem[] = [
  {
    id: 'chk-1',
    title: 'BitLocker Full-Disk Encryption Active',
    points: 10,
    description: 'Endpoint drive encryption protects customer title data in the event of hardware loss or physical theft.',
    policyReference: 'Policy Section 6.2 (Page 7)',
    category: 'Endpoint Security',
    remediationAction: 'Contact IT Service Desk to verify TPM BitLocker status.',
  },
  {
    id: 'chk-2',
    title: 'Multi-Factor Authentication (MFA) Enforced',
    points: 10,
    description: 'FIDO2 hardware key or Microsoft Authenticator app configured with number-matching protection.',
    policyReference: 'Policy Section 3.2 (Page 4)',
    category: 'Identity & Access',
    remediationAction: 'Enroll mobile device in corporate MFA portal.',
  },
  {
    id: 'chk-3',
    title: 'Password Length >= 14 Characters & Unique',
    points: 10,
    description: 'Corporate workstation password meets entropy guidelines and is never reused across personal accounts.',
    policyReference: 'Policy Section 3.1 (Page 4)',
    category: 'Identity & Access',
    remediationAction: 'Update your corporate password in Self-Service Identity.',
  },
  {
    id: 'chk-4',
    title: 'Zero Consumer Cloud Sync Services',
    points: 10,
    description: 'Workstation free of personal Google Drive, Dropbox, or iCloud background sync clients.',
    policyReference: 'Policy Section 2.1 (Page 3)',
    category: 'Data Loss Prevention',
    remediationAction: 'Uninstall personal sync applications and rely on corporate OneDrive.',
  },
  {
    id: 'chk-5',
    title: 'Approved Browser Extensions Allowlist Only',
    points: 10,
    description: 'Only extensions approved in the corporate enterprise catalog are enabled in web browsers.',
    policyReference: 'Policy Section 8.1 (Page 9)',
    category: 'Application Security',
    remediationAction: 'Remove third-party unapproved Chrome plugins.',
  },
  {
    id: 'chk-6',
    title: 'Auto-Screen Lock Set to <= 5 Minutes',
    points: 10,
    description: 'Workstation locks automatically after 5 minutes of inactivity to prevent physical walk-up tampering.',
    policyReference: 'Policy Section 6.2 (Page 7)',
    category: 'Physical Security',
    remediationAction: 'Verify screen saver lock settings in Windows display preferences.',
  },
  {
    id: 'chk-7',
    title: 'Corporate VPN Active on Public Wi-Fi',
    points: 10,
    description: 'GlobalProtect / Cisco AnyConnect VPN client set to auto-connect on untrusted wireless networks.',
    policyReference: 'Policy Section 7.1 (Page 8)',
    category: 'Network Security',
    remediationAction: 'Launch enterprise VPN client before opening intranet portals.',
  },
  {
    id: 'chk-8',
    title: 'Phishing Awareness Reporting Add-In Installed',
    points: 10,
    description: 'Outlook ribbon displays active Report Phishing button for rapid one-click SOC escalation.',
    policyReference: 'Policy Section 9.1 (Page 10)',
    category: 'Incident Response',
    remediationAction: 'Verify Report Phishing button in Microsoft Outlook.',
  },
  {
    id: 'chk-9',
    title: 'Zero Customer PII in Public Generative AI',
    points: 10,
    description: 'No browser history or bookmarks referencing consumer AI chatbots for processing client records.',
    policyReference: 'Policy Section 5.1 (Page 6)',
    category: 'Emerging Tech Governance',
    remediationAction: 'Transition all prompt workflows to approved Enterprise Copilot.',
  },
  {
    id: 'chk-10',
    title: 'Annual Information Security Pledge Signed',
    points: 10,
    description: 'Annual Policy v7.0 acknowledgment and Code of Conduct compliance oath recorded in HR records.',
    policyReference: 'Policy Section 10.2 (Page 11)',
    category: 'Compliance & Governance',
    remediationAction: 'Complete the digital policy acknowledgment in the handbook portal.',
  },
];

export const FLASHCARD_DRILLS: FlashcardDrill[] = [
  {
    id: 'flash-1',
    category: 'Authentication',
    frontQuestion: 'What should you do if an unexpected MFA prompt pops up on your phone at 2:00 AM?',
    backAnswer: 'Deny the prompt immediately and report the occurrence to the SOC within 1 hour.',
    mnemonicOrTip: 'Never tap Approve to stop the buzzing—an attacker is actively testing your patience.',
    ruleCitation: 'XYZ Policy v7.0 Section 3.3',
  },
  {
    id: 'flash-2',
    category: 'Data Storage',
    frontQuestion: 'Can you sync company closing folders to your personal Google Drive to prepare for Monday morning?',
    backAnswer: 'No. Copying or syncing corporate files to personal cloud storage is strictly prohibited.',
    mnemonicOrTip: 'Keep company data in corporate OneDrive and SharePoint only.',
    ruleCitation: 'XYZ Policy v7.0 Section 2.1',
  },
  {
    id: 'flash-3',
    category: 'Generative AI',
    frontQuestion: 'Are you allowed to paste customer tax forms into ChatGPT to extract income figures?',
    backAnswer: 'No. Inputting customer PII or confidential loan data into public consumer AI tools is strictly forbidden.',
    mnemonicOrTip: 'Use only enterprise AI tools approved by the XYZ AI Council.',
    ruleCitation: 'XYZ Policy v7.0 Section 5.1',
  },
  {
    id: 'flash-4',
    category: 'Device Loss',
    frontQuestion: 'What is the required reporting window if you leave your laptop in an airport terminal or taxi?',
    backAnswer: 'Report it immediately within 1 hour to the Helpdesk and SOC so remote cryptographic wipe can trigger.',
    mnemonicOrTip: 'One hour reporting saves your credentials from being exploited.',
    ruleCitation: 'XYZ Policy v7.0 Section 6.1',
  },
  {
    id: 'flash-5',
    category: 'Remote Work',
    frontQuestion: 'Is it safe to work on open airport public Wi-Fi without connecting to VPN?',
    backAnswer: 'No. You must always connect through company VPN before accessing corporate portals or email.',
    mnemonicOrTip: 'Untrusted Wi-Fi requires trusted VPN encryption every time.',
    ruleCitation: 'XYZ Policy v7.0 Section 7.1',
  },
  {
    id: 'flash-6',
    category: 'Vendor Relations',
    frontQuestion: 'Can you accept dinner and concert tickets from a vendor while their RFP response is being evaluated?',
    backAnswer: 'No. Gifts, meals, or favors from vendors during an active competitive RFP are strictly prohibited.',
    mnemonicOrTip: 'Preserve absolute procurement neutrality during open bids.',
    ruleCitation: 'Code of Business Conduct Pillar 3',
  },
  {
    id: 'flash-7',
    category: 'Phishing',
    frontQuestion: 'What happens if you click a phishing link and report your mistake immediately in good faith?',
    backAnswer: 'XYZ guarantees absolute non-retaliation. Fast reporting enables containment and is welcomed.',
    mnemonicOrTip: 'Reporting mistakes promptly protects the entire organization.',
    ruleCitation: 'XYZ Policy v7.0 Section 9.2',
  },
  {
    id: 'flash-8',
    category: 'Escrow Operations',
    frontQuestion: 'A closing agent emails updated wire instructions 10 minutes before funding. What is required?',
    backAnswer: 'Perform an out-of-band voice callback to the verified phone number from original file records.',
    mnemonicOrTip: 'Never trust email routing updates without verbal voice verification.',
    ruleCitation: 'Code of Business Conduct Pillar 5',
  },
];

export const DECISION_LAB_SCENARIOS: DecisionScenario[] = [
  {
    id: 'dec-1',
    category: 'Wire Fraud & Escrow',
    urgency: 'CRITICAL',
    title: 'Urgent Wire Destination Change via Email',
    description: 'Closing day escrow dilemma involving changed wire routing numbers.',
    context: 'At 4:45 PM on Friday, an email arriving from the real estate broker’s usual email address requests that seller net proceeds ($284,500) be redirected to a new account at an out-of-state bank due to an unexpected audit at their primary institution.',
    userPrompt: 'The closing deadline is in 15 minutes and the buyers are waiting in the lobby. What do you do?',
    options: [
      {
        id: 'opt-1a',
        label: 'Release the wire immediately to meet the Friday closing deadline',
        actionDescription: 'Process the disbursement to the new account without delay.',
        verdict: 'VIOLATION',
        verdictTitle: 'Catastrophic Wire Fraud Violation',
        scoreDelta: -40,
        policySection: 'XYZ Policy Section 10 and Anti-Fraud Plan',
        policyPage: 'Page 9',
        regulatoryImpact: 'Irreversible escrow loss, GLBA safeguarding violation, potential title insurance liability.',
        escalationContact: 'maya.patel@xyz.com and daniel.brooks@xyz.com',
        remediationSteps: [
          'Immediately contact the receiving bank to attempt a wire recall.',
          'File an emergency cyber incident report with the SOC and FBI IC3.',
          'Undergo mandatory retraining on out-of-band escrow callback protocols.',
        ],
      },
      {
        id: 'opt-1b',
        label: 'Reply to the email asking the broker to verify the new account number',
        actionDescription: 'Send an email back to the sender address asking for confirmation.',
        verdict: 'VIOLATION',
        verdictTitle: 'In-Band Email Verification Fallacy',
        scoreDelta: -25,
        policySection: 'XYZ Policy Section 10',
        policyPage: 'Page 9',
        regulatoryImpact: 'If the broker’s email is compromised, the attacker will reply confirming the fraudulent routing number.',
        escalationContact: 'maya.patel@xyz.com',
        remediationSteps: [
          'Recognize that in-band email confirmation offers zero cryptographic proof of sender identity.',
          'Halt all pending disbursements immediately.',
          'Switch to out-of-band voice verification.',
        ],
      },
      {
        id: 'opt-1c',
        label: 'Hold the wire and perform an out-of-band phone callback using verified file records',
        actionDescription: 'Call the seller directly at the telephone number documented in original notarized title paperwork.',
        verdict: 'APPROVED',
        verdictTitle: 'Gold-Standard Dual Verification',
        scoreDelta: 25,
        policySection: 'XYZ Policy Section 10 and Code Pillar 5',
        policyPage: 'Page 9',
        regulatoryImpact: 'Complies fully with ALTA Best Practices, protects escrow funds, and prevents BEC loss.',
        escalationContact: 'maya.patel@xyz.com',
        remediationSteps: [
          'Confirm account details verbally with the seller using verified voice callback.',
          'Document the phone verification timestamp and supervisor sign-off in the title ledger.',
          'Release funds only after multi-party authentication is confirmed.',
        ],
      },
    ],
  },
  {
    id: 'dec-2',
    category: 'AI & Data Privacy',
    urgency: 'HIGH',
    title: 'Commercial Lease Analysis Using Public AI Chatbot',
    description: 'Reviewing a 60-page indemnification contract under end-of-quarter pressure.',
    context: 'A commercial escrow officer is overwhelmed with 15 contracts due by end-of-day. A colleague suggests uploading the PDF contracts into a public online AI tool to automatically highlight non-standard liabilities.',
    userPrompt: 'How should the associate analyze the contracts securely?',
    options: [
      {
        id: 'opt-2a',
        label: 'Upload the PDFs to the free public web AI tool to finish before 5:00 PM',
        actionDescription: 'Submit the full contract PDFs to the online consumer chatbot.',
        verdict: 'VIOLATION',
        verdictTitle: 'Unauthorized Third-Party Data Disclosure',
        scoreDelta: -30,
        policySection: 'XYZ Policy Section 5.1 and Code Pillar 6',
        policyPage: 'Page 6',
        regulatoryImpact: 'Breaches customer confidentiality, non-disclosure agreements, and GLBA privacy provisions.',
        escalationContact: 'ethan.walker@xyz.com',
        remediationSteps: [
          'Stop uploading documents immediately.',
          'Report accidental contract exposure to data.protection@xyz.com.',
          'Use sanctioned enterprise AI tools with zero-retention agreements.',
        ],
      },
      {
        id: 'opt-2b',
        label: 'Request an expedited review from Commercial Legal or use the internal Enterprise Copilot',
        actionDescription: 'Rely on approved internal tools and legal counsel to complete the review.',
        verdict: 'APPROVED',
        verdictTitle: 'Compliant Governance Workflow',
        scoreDelta: 20,
        policySection: 'XYZ Policy Section 5.2 and Code Pillar 6',
        policyPage: 'Page 6',
        regulatoryImpact: 'Ensures zero-retention compliance, safeguards customer agreements, and maintains legal validity.',
        escalationContact: 'ethan.walker@xyz.com',
        remediationSteps: [
          'Submit urgent contracts to the internal legal queue.',
          'Utilize approved internal zero-retention AI tools.',
          'Maintain complete confidentiality throughout closing.',
        ],
      },
    ],
  },
  {
    id: 'dec-3',
    category: 'Procurement Integrity',
    urgency: 'MEDIUM',
    title: 'Vendor Hospitality Invitation During Open RFP',
    description: 'Evaluating candidate cloud vendors during competitive bidding.',
    context: 'During an open Request for Proposal (RFP) for a new document imaging system, the sales vice president of the leading candidate vendor invites your evaluation team to an all-expenses-paid weekend golf retreat in Scottsdale.',
    userPrompt: 'How do you respond to the vendor invitation?',
    options: [
      {
        id: 'opt-3a',
        label: 'Accept the invitation as long as all team members attend openly',
        actionDescription: 'Join the golf trip and treat it as a vendor evaluation exercise.',
        verdict: 'VIOLATION',
        verdictTitle: 'Bribery & RFP Tampering Violation',
        scoreDelta: -35,
        policySection: 'Code of Business Conduct Pillar 3.1',
        policyPage: 'Page 17',
        regulatoryImpact: 'Disqualifies the RFP process, creates legal exposure for procurement fraud, and damages company reputation.',
        escalationContact: 'daniel.brooks@xyz.com',
        remediationSteps: [
          'Immediately recuse yourself from the RFP evaluation committee.',
          'Report the vendor offer to Daniel Brooks, Compliance Officer.',
          'Re-evaluate the vendor’s standing in the procurement process.',
        ],
      },
      {
        id: 'opt-3b',
        label: 'Decline the invitation in writing and log the incident in the procurement audit file',
        actionDescription: 'Refuse the gift courteously and uphold bidding neutrality.',
        verdict: 'APPROVED',
        verdictTitle: 'Ethical Procurement Safeguard',
        scoreDelta: 20,
        policySection: 'Code of Business Conduct Pillar 3.1',
        policyPage: 'Page 17',
        regulatoryImpact: 'Protects the integrity of the RFP, satisfies antitrust standards, and upholds corporate ethics.',
        escalationContact: 'daniel.brooks@xyz.com',
        remediationSteps: [
          'Send polite written refusal citing XYZ procurement policy.',
          'Inform Procurement Director and Compliance Officer.',
          'Continue evaluation based strictly on technical and financial merit.',
        ],
      },
    ],
  },
];
