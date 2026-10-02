export interface DecisionScenario {
  id: string;
  category: 'Escrow & Wire' | 'Generative AI' | 'Credentials & Devices' | 'Confidential Data' | 'Code of Conduct & Ethics';
  title: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  context: string;
  userPrompt: string;
  options: {
    id: string;
    label: string;
    actionDescription: string;
    verdict: 'VIOLATION' | 'APPROVED' | 'CONDITIONAL';
    verdictTitle: string;
    scoreDelta: number;
    policySection: string;
    policyPage: string;
    regulatoryImpact: string;
    remediationSteps: string[];
    escalationContact: string;
  }[];
}

export interface PolicyFAQ {
  id: string;
  category: 'AI & Software' | 'Data & Storage' | 'Passwords & MFA' | 'Incidents & Lost Devices' | 'Personal Use' | 'Ethics & Gifts';
  question: string;
  quickAnswer: string;
  officialRule: string;
  policyCitation: string;
  dos: string;
  donts: string;
  escalation: string;
  keywords: string[];
}

export interface FlashcardItem {
  id: string;
  category: string;
  frontQuestion: string;
  backAnswer: string;
  ruleCitation: string;
  mnemonicOrTip: string;
}

export interface AuditChecklistItem {
  id: string;
  category: 'Device & Physical' | 'Identity & MFA' | 'Data & Cloud' | 'Software & AI' | 'Incident Preparedness';
  title: string;
  description: string;
  policyReference: string;
  points: number;
  remediationAction: string;
}

export const DECISION_LAB_SCENARIOS: DecisionScenario[] = [
  {
    id: 'scen-01',
    category: 'Escrow & Wire',
    title: 'Urgent Wire Instruction Change on Closing Day',
    urgency: 'CRITICAL',
    description: 'At 4:45 PM on a Friday closing, an email arrives Apparently from the title buyer’s attorney requesting an immediate change of the recipient bank and wire routing numbers for a $640,000 escrow transfer.',
    context: 'The buyer is at the airport boarding an international flight. The email states: "Urgent! Our escrow depository account changed this morning due to an audit. Update immediately to prevent closing delays."',
    userPrompt: 'How do you proceed with the $640,000 wire release?',
    options: [
      {
        id: 'opt-1a',
        label: 'Release wire immediately to avoid delaying the customer’s closing',
        actionDescription: 'Accept the new routing instructions directly from the incoming email and authorize the bank wire transfer before the 5:00 PM wire cutoff.',
        verdict: 'VIOLATION',
        verdictTitle: 'Catastrophic Escrow Wire Fraud & Policy Violation',
        scoreDelta: -100,
        policySection: 'Stewart IT Security v7.0 §Section 10 & Anti-Fraud Plan',
        policyPage: 'Page 9 - Financial Fraud & Wire Verification Protocols',
        regulatoryImpact: 'Irrevocable loss of $640,000 escrow funds; ALTA Best Practices Title 4 violation; mandatory insurance and regulatory breach disclosures.',
        remediationSteps: [
          'Never modify wire instructions based solely on email or incoming telephone requests.',
          'Mandatory Out-of-Band Callback: Call the attorney using a verified phone number from the original title file (not the number in the email signature).',
          'Require dual executive sign-off before altering any banking wire instructions in the escrow system.'
        ],
        escalationContact: 'itsecurity@stewart.com & ethics@stewart.com (Immediate < 1 hr)'
      },
      {
        id: 'opt-1b',
        label: 'Halt the wire, verify via verified pre-existing telephone records, and alert Escrow Management',
        actionDescription: 'Refuse to update banking details without verified dual-channel verbal confirmation using the file number on record, and notify the Security Incident Desk.',
        verdict: 'APPROVED',
        verdictTitle: 'Exemplary Defense: Escrow Wire Interception Averted',
        scoreDelta: 100,
        policySection: 'Stewart IT Security v7.0 §Section 10',
        policyPage: 'Page 9 - Wire Transfer Verification Standards',
        regulatoryImpact: '100% preservation of escrow funds; complete compliance with ALTA Best Practices; zero liability.',
        remediationSteps: [
          'Log the phone verification timestamp, name of confirming officer, and phone number used.',
          'Report spoofed email headers to itsecurity@stewart.com for enterprise-wide tenant blocking.',
          'Reassure customer with Stewart Secure Wire Guarantee.'
        ],
        escalationContact: 'itsecurity@stewart.com'
      },
      {
        id: 'opt-1c',
        label: 'Reply to the email asking the sender to confirm their identity with a PDF copy of their driver’s license',
        actionDescription: 'Send an email reply to the address on the screen requesting photo identification before sending money.',
        verdict: 'VIOLATION',
        verdictTitle: 'Flawed Defense: In-Band Communication Compromised',
        scoreDelta: -60,
        policySection: 'Stewart IT Security v7.0 §Section 10',
        policyPage: 'Page 9 - Anti-Phishing Protocols',
        regulatoryImpact: 'The fraudster controls the compromised email thread and easily provides forged credentials, resulting in unauthorized wire execution.',
        remediationSteps: [
          'In-band verification (replying to the same email) is completely ineffective when an account is hijacked.',
          'Always establish independent out-of-band communication via trusted voice line.'
        ],
        escalationContact: 'itsecurity@stewart.com'
      }
    ]
  },
  {
    id: 'scen-02',
    category: 'Generative AI',
    title: 'Summarizing 80-Page Title Closing Agreement with Public AI',
    urgency: 'HIGH',
    description: 'You have 20 minutes before an executive title review to extract encumbrances, easements, and tax lien terms from an 80-page settlement deed containing customer SSNs and property valuations.',
    context: 'A coworker mentions: "Just copy-paste it into public ChatGPT or Claude. It will give you a neat executive summary table in 60 seconds."',
    userPrompt: 'Can you paste the document into a public consumer AI tool?',
    options: [
      {
        id: 'opt-2a',
        label: 'Paste text into public ChatGPT, but delete only the buyer\'s first name',
        actionDescription: 'Strip the buyer first name and upload the full legal deed, loan figures, property address, and tax IDs into a public consumer web chat.',
        verdict: 'VIOLATION',
        verdictTitle: 'Critical Confidential Data Exfiltration Violation',
        scoreDelta: -80,
        policySection: 'Stewart IT Security v7.0 §Section 1 & Code Pillar 6',
        policyPage: 'Page 2 & Page 47 - Artificial Intelligence Governance',
        regulatoryImpact: 'Public consumer LLMs retain inputs for model training; constitutes an unauthorized disclosure of Non-Public Personal Information (NPI) under GLBA and state privacy regulations.',
        remediationSteps: [
          'Stewart policy strictly bans feeding any proprietary, confidential, or customer NPI into unauthorized public AI tools.',
          'All generative AI usage requires prior authorization from Stewart\'s AI Council (AICouncil@stewart.com).',
          'Use only Stewart-sanctioned enterprise models configured with zero-data-retention agreements.'
        ],
        escalationContact: 'AICouncil@stewart.com'
      },
      {
        id: 'opt-2b',
        label: 'Use Stewart-sanctioned Enterprise AI or internal legal review with full PII redaction',
        actionDescription: 'Review the document using internal vetted tools Approved by Stewart AI Council or request an expedited paralegal summary.',
        verdict: 'APPROVED',
        verdictTitle: 'Responsible Innovation: Enterprise AI Standards Upheld',
        scoreDelta: 90,
        policySection: 'Stewart IT Security v7.0 §Section 1 & §Section 2',
        policyPage: 'Page 3 - Approved Systems & Redaction Standards',
        regulatoryImpact: 'Full preservation of customer NPI, zero data leakage into public training corpuses, full GLBA compliance.',
        remediationSteps: [
          'Verify enterprise tenant data protection agreements.',
          'Keep documentation of AI council Approval on file.',
          'Manually review AI output for legal accuracy before executive submission.'
        ],
        escalationContact: 'AICouncil@stewart.com'
      }
    ]
  },
  {
    id: 'scen-03',
    category: 'Credentials & Devices',
    title: 'Company Laptop Left in an Airport Rideshare Vehicle',
    urgency: 'CRITICAL',
    description: 'While traveling to a regional title conference, you accidentally leave your Stewart-issued ThinkPad in the backseat of a rideshare vehicle. You realize it 10 minutes later after entering the airport terminal.',
    context: 'The laptop is protected with a 16-character login password and BitLocker encryption. The rideshare driver is not answering the in-App chat.',
    userPrompt: 'What is your immediate compliance requirement?',
    options: [
      {
        id: 'opt-3a',
        label: 'Wait until Monday morning to see if the driver returns it to lost-and-found',
        actionDescription: 'Avoid bothering IT over the weekend since the laptop has a password, hoping the driver contacts you back.',
        verdict: 'VIOLATION',
        verdictTitle: 'Severe Incident Reporting SLA Breach',
        scoreDelta: -90,
        policySection: 'Stewart IT Security v7.0 §Section 9',
        policyPage: 'Page 8 - Lost and Stolen Device Escalations',
        regulatoryImpact: 'Violates Stewart\'s mandatory 1-hour critical incident reporting SLA; risks data extraction if attacker attempts brute force or offline attacks.',
        remediationSteps: [
          'All lost or stolen Stewart devices must be reported to itsecurity@stewart.com within ONE HOUR.',
          'Immediate reporting allows IT Security to execute remote cryptographic wipe and revoke session tokens.'
        ],
        escalationContact: 'itsecurity@stewart.com (Mandatory < 1 hr)'
      },
      {
        id: 'opt-3b',
        label: 'Call IT Security Incident Desk within 60 minutes for remote wipe and token revocation',
        actionDescription: 'Immediately email itsecurity@stewart.com and call the 24/7 Security Desk to initiate remote device lock, Intune wipe, and credential invalidation.',
        verdict: 'APPROVED',
        verdictTitle: 'Flawless Rapid Incident Containment',
        scoreDelta: 100,
        policySection: 'Stewart IT Security v7.0 §Section 9',
        policyPage: 'Page 8 - Incident Timelines & Zero Retaliation',
        regulatoryImpact: 'Remote kill-switch activated; zero unauthorized data access; protected by Stewart\'s zero-retaliation reporting policy.',
        remediationSteps: [
          'Provide serial number, last known location, and confirmation of rideshare report to IT.',
          'Reset Stewart enterprise credentials from a secondary secured mobile device.',
          'Obtain police report or carrier lost item reference number.'
        ],
        escalationContact: 'itsecurity@stewart.com'
      }
    ]
  },
  {
    id: 'scen-04',
    category: 'Code of Conduct & Ethics',
    title: 'Vendor Offers All-Expenses-Paid Resort Weekend Before RFP',
    urgency: 'HIGH',
    description: 'A national cloud infrastructure vendor bidding for Stewart’s multi-million dollar imaging archive contract sends you and your spouse personal VIP tickets to an exclusive Napa Valley golf retreat.',
    context: 'You are on the vendor selection committee. The vendor representative writes: "No strings attached! Just a friendly way to say thank you for your leadership in the title industry."',
    userPrompt: 'Can you accept the tickets and hotel package?',
    options: [
      {
        id: 'opt-4a',
        label: 'Accept the invitation since you promise to remain objective during RFP grading',
        actionDescription: 'Attend the weekend retreat with your spouse, believing personal ethics will keep your vendor evaluation unbiased.',
        verdict: 'VIOLATION',
        verdictTitle: 'Severe Conflict of Interest & Code Violation',
        scoreDelta: -95,
        policySection: 'Stewart Code of Business Conduct §Pillar 5',
        policyPage: 'Page 30 - Conflicts of Interest & Gifts',
        regulatoryImpact: 'Exceeds Stewart gift thresholds; creates acute conflict of interest; procurement bid disqualification; potential commercial bribery exposure.',
        remediationSteps: [
          'Stewart policy strictly limits business courtesies to nominal, infrequent items. Lavish entertainment or personal travel is forbidden.',
          'Employees must never accept gifts or favors from entities currently involved in an active RFP or competitive bidding process.',
          'Mandatory written disclosure to ethics@stewart.com and management.'
        ],
        escalationContact: 'ethics@stewart.com & Chief Compliance Officer'
      },
      {
        id: 'opt-4b',
        label: 'Politely decline, cite Stewart’s Code of Conduct, and notify Compliance',
        actionDescription: 'Inform the vendor that Stewart policies prohibit accepting personal travel or hospitality during an RFP, and forward the email to ethics@stewart.com.',
        verdict: 'APPROVED',
        verdictTitle: 'Gold Standard Corporate Governance',
        scoreDelta: 95,
        policySection: 'Stewart Code of Business Conduct §Pillar 5',
        policyPage: 'Page 31 - Gift Disclosure & Recusal Standards',
        regulatoryImpact: 'Procurement process remains legally sound, transparent, and completely insulated from commercial challenge.',
        remediationSteps: [
          'Formally decline the offer in writing.',
          'Log notice with the Procurement Committee lead and Legal.',
          'Affirm unbiased evaluation criteria across all vendor responses.'
        ],
        escalationContact: 'ethics@stewart.com'
      }
    ]
  }
];

export const POLICY_ASSISTANT_FAQS: PolicyFAQ[] = [
  {
    id: 'faq-01',
    category: 'Passwords & MFA',
    question: 'What are the exact password complexity rules for Stewart systems?',
    quickAnswer: 'Minimum 16 characters with upper, lower, number, and symbol. Never reused or stored in browser password managers.',
    officialRule: 'Passwords must be at least 16 characters, combining uppercase and lowercase letters, numbers, and special characters. Predictable patterns, dictionary words, and password reuse are strictly prohibited. Browser password managers are banned.',
    policyCitation: 'Stewart IT Security v7.0 §Section 3, Page 4',
    dos: 'Use an Approved enterprise password manager or memorable 4-word passphrase exceeding 16 characters.',
    donts: 'Never click "Save Password" in Chrome/Edge, never write it down, and never share credentials with coworkers.',
    escalation: 'itsecurity@stewart.com',
    keywords: ['password', 'complexity', '16', 'characters', 'manager', 'mfa', 'credentials']
  },
  {
    id: 'faq-02',
    category: 'Incidents & Lost Devices',
    question: 'What is the mandatory timeline to report a lost or stolen device?',
    quickAnswer: 'Within 1 HOUR for lost/stolen devices or critical breaches; within 4 HOURS for non-critical security anomalies.',
    officialRule: 'Any lost, stolen, or compromised company-issued device must be reported to itsecurity@stewart.com within ONE HOUR of discovery to enable immediate remote wipe and credential invalidation.',
    policyCitation: 'Stewart IT Security v7.0 §Section 9, Page 8',
    dos: 'Immediately notify itsecurity@stewart.com and call the 24/7 incident helpline. Stewart enforces strict zero-retaliation.',
    donts: 'Never delay reporting until Monday morning or try to find the device privately before informing IT.',
    escalation: 'itsecurity@stewart.com (Urgent)',
    keywords: ['lost', 'stolen', 'laptop', 'timeline', 'hour', 'sla', 'incident', 'report']
  },
  {
    id: 'faq-03',
    category: 'Data & Storage',
    question: 'Where can I legally store Stewart customer documents and escrow files?',
    quickAnswer: 'Exclusively in Stewart\'s Microsoft 365 tenant (OneDrive for individual, SharePoint for team, Teams for project).',
    officialRule: 'Work-related files must never be stored on personal cloud services (Dropbox, personal Google Drive, iCloud) or personal devices. All business information must reside inside Stewart M365.',
    policyCitation: 'Stewart IT Security v7.0 §Section 2, Page 3',
    dos: 'Use Stewart OneDrive and encrypted SharePoint links with expiration dates for collaboration.',
    donts: 'Never upload escrow files to personal Google Drive or email files to your personal Gmail to work from home.',
    escalation: 'itsecurity@stewart.com',
    keywords: ['storage', 'onedrive', 'sharepoint', 'dropbox', 'google drive', 'icloud', 'cloud', 'files']
  },
  {
    id: 'faq-04',
    category: 'AI & Software',
    question: 'Can I use free tools like ChatGPT, Claude, or Grammarly for my daily work?',
    quickAnswer: 'NO. Public generative AI tools are strictly forbidden for customer or company data without AI Council Approval.',
    officialRule: 'Inputting confidential, proprietary, or customer PII into unApproved public AI tools violates policy and data protection laws. Use of AI requires prior written Approval from Stewart AI Council.',
    policyCitation: 'Stewart IT Security v7.0 §Section 1, Page 2 & Code Pillar 6',
    dos: 'Request enterprise AI access via AICouncil@stewart.com and ensure zero-retention data logging.',
    donts: 'Never paste customer closing deeds, wire routing numbers, SSNs, or proprietary contracts into public web chats.',
    escalation: 'AICouncil@stewart.com',
    keywords: ['ai', 'chatgpt', 'claude', 'grammarly', 'artificial intelligence', 'public', 'software']
  },
  {
    id: 'faq-05',
    category: 'Personal Use',
    question: 'Can I stream Spotify, YouTube, or Netflix on my company laptop?',
    quickAnswer: 'Strictly prohibited during business hours. Incidental personal use is permitted only during breaks with manager consent.',
    officialRule: 'Streaming audio/video during business hours is expressly prohibited as it consumes critical network bandwidth. Personal use privileges must not interfere with operations and require manager Approval.',
    policyCitation: 'Stewart IT Security v7.0 §Section 1, Page 1',
    dos: 'Use your personal smartphone on non-Stewart Wi-Fi for personal music or streaming during lunch.',
    donts: 'Never run streaming video/audio on company workstations or connect personal devices to mobile tethering.',
    escalation: 'itsecurity@stewart.com',
    keywords: ['streaming', 'youtube', 'spotify', 'netflix', 'personal use', 'bandwidth', 'music']
  },
  {
    id: 'faq-06',
    category: 'Data & Storage',
    question: 'Can I use a personal USB flash drive to copy files between offices?',
    quickAnswer: 'Strictly prohibited. All removable storage is blocked by endpoint policy unless explicitly authorized and encrypted.',
    officialRule: 'Storage of work-related information on removable media (USB drives, external hard drives) is prohibited unless using company-managed, encrypted devices Approved for specific business requirements.',
    policyCitation: 'Stewart IT Security v7.0 §Section 2 & §Section 6, Pages 3, 6',
    dos: 'Share files externally via password-protected, encrypted SharePoint links or Zix email encryption.',
    donts: 'Never plug untrusted or personal USB thumb drives into Stewart endpoints. EDR will flag and block the device.',
    escalation: 'itsecurity@stewart.com',
    keywords: ['usb', 'flash drive', 'thumb drive', 'removable media', 'external drive']
  },
  {
    id: 'faq-07',
    category: 'Ethics & Gifts',
    question: 'What is the whistleblowing contact and does Stewart protect against retaliation?',
    quickAnswer: 'EthicsPoint Hotline: (866) 384-4277 or stewart.ethicspoint.com. 100% anonymous with strict zero-retaliation.',
    officialRule: 'Stewart maintains an absolute zero-retaliation policy for all reports made in good faith. Reports can be submitted 24/7 anonymously via EthicsPoint or directly to Chief Compliance Officer.',
    policyCitation: 'Stewart Code of Business Conduct §Message & §Page 6',
    dos: 'Speak up immediately if you suspect financial misconduct, harassment, wire fraud, or security compromises.',
    donts: 'Never fear disciplinary action for good-faith whistleblowing; retaliation is grounds for termination.',
    escalation: 'ethics@stewart.com or (866) 384-4277',
    keywords: ['whistleblower', 'retaliation', 'hotline', 'ethicspoint', 'speak up', 'anonymous']
  }
];

export const FLASHCARD_DRILLS: FlashcardItem[] = [
  {
    id: 'fc-1',
    category: 'Passwords',
    frontQuestion: 'What is the minimum character length required for Stewart passwords?',
    backAnswer: '16 Characters minimum, combining uppercase, lowercase, numbers, and symbols.',
    ruleCitation: 'Policy v7.0 §Section 3 (Page 4)',
    mnemonicOrTip: 'Tip: Combine 4 unrelated words (e.g. "Falcon!Closing#2026Blue") for 16+ chars that are easy to remember.'
  },
  {
    id: 'fc-2',
    category: 'Device Inactivity',
    frontQuestion: 'After how many minutes of inactivity must Stewart workstations automatically lock?',
    backAnswer: '15 Minutes. However, employees are MANDATED to manually lock (Win+L / Cmd+Ctrl+Q) whenever stepping away.',
    ruleCitation: 'Policy v7.0 §Section 2 (Page 3)',
    mnemonicOrTip: 'Tip: Always lock before walking to the coffee machine or restroom—never rely on the 15-minute timer.'
  },
  {
    id: 'fc-3',
    category: 'Incident Reporting',
    frontQuestion: 'What is the reporting SLA for lost/stolen devices or critical security incidents?',
    backAnswer: 'Within ONE HOUR to itsecurity@stewart.com. Non-critical incidents within 4 hours.',
    ruleCitation: 'Policy v7.0 §Section 9 (Page 8)',
    mnemonicOrTip: 'Tip: 1 Hour = Golden Hour. Remote wipe can stop data theft before an attacker cracks device encryption.'
  },
  {
    id: 'fc-4',
    category: 'Approved Cloud',
    frontQuestion: 'Which cloud storage repository is authorized for Stewart business files?',
    backAnswer: 'Stewart Microsoft 365 Tenant: OneDrive (individual), SharePoint (team), Teams (projects). Personal cloud is banned.',
    ruleCitation: 'Policy v7.0 §Section 2 (Page 3)',
    mnemonicOrTip: 'Tip: Never sync to personal Dropbox or email files to your personal account to print at home.'
  },
  {
    id: 'fc-5',
    category: 'Authentication',
    frontQuestion: 'What type of Multi-Factor Authentication has Stewart adopted as its sole standard?',
    backAnswer: 'Phish-Resistant Authentication (FIDO2 / Hardware keys / Number-matching Authenticator push).',
    ruleCitation: 'Policy v7.0 §Section 3 (Page 4)',
    mnemonicOrTip: 'Tip: Never Approve an unsolicited phone push notification you did not personally trigger.'
  },
  {
    id: 'fc-6',
    category: 'Artificial Intelligence',
    frontQuestion: 'What entity at Stewart must Approve any Generative AI or LLM tool before use?',
    backAnswer: 'Stewart AI Council (AICouncil@stewart.com). UnApproved public consumer AI tools are strictly banned.',
    ruleCitation: 'Policy v7.0 §Section 1 & Code Pillar 6',
    mnemonicOrTip: 'Tip: Public tools use your inputs to train models. Customer deeds & SSNs must NEVER be pasted into consumer AI.'
  },
  {
    id: 'fc-7',
    category: 'Whistleblower',
    frontQuestion: 'What is the 24/7 confidential Ethics Hotline phone number for Stewart?',
    backAnswer: '(866) 384-4277 (EthicsPoint) with guaranteed zero retaliation.',
    ruleCitation: 'Stewart Code of Business Conduct',
    mnemonicOrTip: 'Tip: Also accessible online at stewart.ethicspoint.com anytime, from any personal or company device.'
  },
  {
    id: 'fc-8',
    category: 'Removable Media',
    frontQuestion: 'Can an employee use personal USB flash drives on Stewart laptops?',
    backAnswer: 'NO. Strictly forbidden. USB storage is blocked by endpoint protection to prevent malware and data leaks.',
    ruleCitation: 'Policy v7.0 §Section 2 & §Section 6',
    mnemonicOrTip: 'Tip: Use secure, encrypted SharePoint sharing links instead of physical thumb drives.'
  }
];

export const AUDIT_CHECKLIST_ITEMS: AuditChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'Device & Physical',
    title: 'Workstation Auto-Lock & Physical Clean Desk',
    description: 'I manually lock my workstation (Win+L / Cmd+Ctrl+Q) whenever stepping away, and clear sensitive title documents overnight.',
    policyReference: 'Policy v7.0 §Section 2 (Page 3)',
    points: 10,
    remediationAction: 'Lock device immediately and ensure desks are cleared of customer loan papers.'
  },
  {
    id: 'chk-2',
    category: 'Identity & MFA',
    title: '16+ Character Passphrase & Zero Password Reuse',
    description: 'My Stewart password is 16+ characters, not stored in browser password managers, and 100% separate from all personal logins.',
    policyReference: 'Policy v7.0 §Section 3 (Page 4)',
    points: 10,
    remediationAction: 'Update password to a 16+ character passphrase in Microsoft 365 and remove saved credentials from browser settings.'
  },
  {
    id: 'chk-3',
    category: 'Identity & MFA',
    title: 'Phish-Resistant Authenticator Configured',
    description: 'I use number-matching Microsoft Authenticator or hardware security keys, and deny any unsolicited login prompts.',
    policyReference: 'Policy v7.0 §Section 3 (Page 4)',
    points: 10,
    remediationAction: 'Report unexpected push requests immediately to itsecurity@stewart.com.'
  },
  {
    id: 'chk-4',
    category: 'Data & Cloud',
    title: '100% Approved M365 Storage (No Personal Cloud)',
    description: 'All my business files reside exclusively in Stewart OneDrive, SharePoint, or Teams. No personal Dropbox/iCloud sync.',
    policyReference: 'Policy v7.0 §Section 2 (Page 3)',
    points: 10,
    remediationAction: 'Move all local documents to OneDrive and disconnect personal cloud syncing.'
  },
  {
    id: 'chk-5',
    category: 'Software & AI',
    title: 'Zero Shadow AI & No Unvetted Extensions',
    description: 'I do not use public consumer AI (ChatGPT, Claude, Grammarly) or unApproved browser plugins for Stewart customer documents.',
    policyReference: 'Policy v7.0 §Section 1 (Page 2) & Code Pillar 6',
    points: 10,
    remediationAction: 'Submit tools to AICouncil@stewart.com before entering any company data.'
  },
  {
    id: 'chk-6',
    category: 'Software & AI',
    title: 'Removable Storage Discipline (No Personal USBs)',
    description: 'I never connect personal flash drives or untrusted USB media to my Stewart endpoint.',
    policyReference: 'Policy v7.0 §Section 6 (Page 6)',
    points: 10,
    remediationAction: 'Use encrypted SharePoint links or Zix email encryption for external file deliveries.'
  },
  {
    id: 'chk-7',
    category: 'Incident Preparedness',
    title: 'Rapid Incident Escalation SLA Knowledge (< 1 Hr)',
    description: 'I know that lost/stolen devices and critical security anomalies must be reported to itsecurity@stewart.com within 1 HOUR.',
    policyReference: 'Policy v7.0 §Section 9 (Page 8)',
    points: 10,
    remediationAction: 'Bookmark itsecurity@stewart.com and save (866) 384-4277 in your phone contacts.'
  },
  {
    id: 'chk-8',
    category: 'Device & Physical',
    title: 'Outlook Phishing Reporting Button Readiness',
    description: 'I know how to report suspicious emails using the official "Report Email" button in Outlook (Desktop, Web, or Mobile).',
    policyReference: 'Policy v7.0 §Section 9 (Page 8)',
    points: 10,
    remediationAction: 'Locate the Report Email button in Outlook ribbon. Never forward phishing as normal email.'
  },
  {
    id: 'chk-9',
    category: 'Data & Cloud',
    title: 'Escrow Wire Verification Out-of-Band Protocol',
    description: 'I know to NEVER change bank wire instructions without a verified verbal callback using trusted numbers from the original file.',
    policyReference: 'Policy v7.0 §Section 10 & Anti-Fraud Plan',
    points: 10,
    remediationAction: 'Always execute voice verification with known good contacts before releasing escrow wires.'
  },
  {
    id: 'chk-10',
    category: 'Incident Preparedness',
    title: 'Stewart Code of Conduct & Zero Retaliation',
    description: 'I have reviewed the 7 Code Pillars and know Stewart guarantees 100% zero-retaliation for good-faith ethical reporting.',
    policyReference: 'Stewart Code of Conduct',
    points: 10,
    remediationAction: 'Review Stewart Code of Business Conduct via the Code tab in the Sentinel Handbook.'
  }
];
