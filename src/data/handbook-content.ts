export interface PolicySection {
  id: string;
  number: number;
  title: string;
  page: string;
  summary: string;
  keyDirectives: string[];
  fullText: string;
}

export interface ThreatVectorGuide {
  id: string;
  sectionNumber: number;
  title: string;
  category: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  aliases?: string[];
  targetAudienceNote: string;
  howBreachOccurs: {
    summary: string;
    mechanics: string;
    commonScenarios: string[];
  };
  downstreamBlastRadius: {
    businessImpact: string;
    dataAtRisk: string;
    legalOrCompliance: string;
  };
  howToPrevent: {
    goldenRules: string[];
    doList: string[];
    dontList: string[];
    ApprovedAlternatives: string[];
  };
  anatomySteps: Array<{
    phase: string;
    title: string;
    description: string;
    actor: string;
  }>;
  codeComparison?: {
    language: string;
    badLabel: string;
    badCode: string;
    badReason: string;
    goodLabel: string;
    goodCode: string;
    goodReason: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const XYZ_POLICY_METADATA = {
  documentTitle: 'Information Technology Security and Usage',
  version: 'v7.0',
  effectiveDate: '2026-01-01',
  lastRevised: '2026-04-01',
  copyright: 'XYZ Information Services Corp © 2026',
  organization: 'XYZ Information Services Corp',
  scope: 'All XYZ Information Services Corp employees, contractors, endpoints, networks, and cloud environments.',
};

export const XYZ_POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'xyz-sec-01',
    number: 1,
    title: 'Information Classification and Data Handling',
    page: 'Page 2',
    summary: 'Defines mandatory classification levels for all corporate data and controls handling of sensitive customer records.',
    keyDirectives: [
      'All data must be classified into one of four tiers: Public, Internal, Confidential, or Restricted.',
      'Customer personally identifiable information (PII) and non-public financial records must always be classified as Confidential or Restricted.',
      'Confidential and Restricted data must never be stored in unapproved browser extensions, personal tools, or unencrypted local drives.',
      'Data classification markings must be preserved whenever information is exported, shared, or archived.',
    ],
    fullText: `Section 1: Information Classification and Data Handling.
1.1 Classification Tiers. All information assets created, received, or stored by XYZ Information Services Corp must be classified into four distinct levels: Public, Internal, Confidential, and Restricted. How confidential information should be classified: any information containing sensitive customer records, employee personal data, proprietary algorithms, financial accounts, or title documentation must be classified as Confidential or Restricted.
1.2 Labeling and Handling. Employees must label all electronic documents and physical repositories with their corresponding classification. Confidential data must be encrypted at rest and in transit.
1.3 Unapproved Tools and Browser Extensions. Personnel must never install or use unapproved browser extensions or unauthorized utilities that ingest, parse, or capture classified corporate data. Any plugin or extension must receive formal security clearance before installation.`,
  },
  {
    id: 'xyz-sec-02',
    number: 2,
    title: 'Information Protection and Storage Controls',
    page: 'Page 3',
    summary: 'Governs local and external storage, encryption requirements, and prohibitions on syncing work files to consumer services.',
    keyDirectives: [
      'Work documents and customer files must never be synced to personal Google Drive, personal Dropbox, iCloud, or unapproved external accounts.',
      'Removable storage media, including personal USB drives, are strictly prohibited on corporate workstations.',
      'Customer title documents and transaction records must be stored solely on encrypted corporate storage.',
      'Employees must use company-approved Microsoft OneDrive and SharePoint repositories with data loss prevention enabled.',
    ],
    fullText: `Section 2: Information Protection and Storage Controls.
2.1 Prohibition on Personal Cloud Storage. Can I sync work files to my personal Google Drive? No. Employees are strictly prohibited from copying, uploading, or syncing corporate files, customer data, or internal documentation to personal Google Drive, personal Dropbox, personal OneDrive, iCloud, or any consumer cloud storage service.
2.2 Removable Media. Connecting unauthorized USB flash drives, external hard drives, or personal storage hardware to corporate endpoints is strictly prohibited. All corporate endpoints enforce automated USB blocking.
2.3 Encryption Standards. All data resting on corporate endpoints or in cloud repositories must use AES-256 encryption. Files containing sensitive customer information must remain within sanctioned corporate repositories at all times.`,
  },
  {
    id: 'xyz-sec-03',
    number: 3,
    title: 'Authentication, Password Policy, and Access Control',
    page: 'Page 4',
    summary: 'Sets requirements for password length, multi-factor authentication (MFA), and incident protocols for unauthorized push notifications.',
    keyDirectives: [
      'Passwords must be at least 14 characters long and include uppercase, lowercase, numerals, and special symbols.',
      'Multi-factor authentication (MFA) is mandatory across all corporate accounts and services without exception.',
      'Employees must immediately reject and report any unexpected or unprompted MFA push notifications.',
      'Sharing credentials, reusing passwords across multiple accounts, or writing down passwords is strictly prohibited.',
    ],
    fullText: `Section 3: Authentication, Password Policy, and Access Control.
3.1 Password Requirements. What are the password requirements? All user accounts must use passwords that are at least 14 characters long, incorporating uppercase letters, lowercase letters, numbers, and special symbols. Passwords must not contain personal identifiers, dictionary words, or previously used sequences. Passwords must be changed immediately if compromise is suspected.
3.2 Multi-Factor Authentication (MFA). MFA is mandatory for all system access. Push notifications must only be approved when actively initiated by the user.
3.3 Unexpected MFA Prompts. I got an MFA prompt I did not trigger, what now? If an employee receives an MFA prompt or authentication push that they did not initiate, they must immediately deny the request and report the event within 1 hour to the Security Operations Center. Do not approve repeated prompts under any circumstance.`,
  },
  {
    id: 'xyz-sec-04',
    number: 4,
    title: 'Corporate Ownership, Privacy Expectations, and Asset Return',
    page: 'Page 5',
    summary: 'Clarifies that employees have no expectation of privacy on corporate systems and outlines mandatory hardware return upon separation.',
    keyDirectives: [
      'The company actively monitors work emails, messages, network traffic, and system activity; employees have no expectation of personal privacy.',
      'All issued hardware, laptops, monitors, and tokens remain the exclusive property of XYZ and must be returned upon termination.',
      'Employees must return all company property immediately on or before their final day of employment.',
      'Corporate communication channels must not be used for illegal activities or unauthorized business operations.',
    ],
    fullText: `Section 4: Corporate Ownership, Privacy Expectations, and Asset Return.
4.1 System Monitoring and Privacy Expectations. Does the company monitor my work email? Yes. All communications, files, email messages, internet traffic, and activities conducted on company-provided computers, mobile devices, and networks are company property. Employees should have no expectation of privacy when using corporate systems. XYZ reserves the right to audit, monitor, and review all communications.
4.2 Return of Company Assets. Do I have to return my laptop when I leave the company? Yes. All company-issued laptops, mobile phones, security keys, peripherals, and physical documents must be returned to IT asset management on or before an employee's separation date. Failure to return corporate assets may result in legal recovery action.`,
  },
  {
    id: 'xyz-sec-05',
    number: 5,
    title: 'Artificial Intelligence and Machine Learning Usage Policy',
    page: 'Page 6',
    summary: 'Governs the use of public generative AI, prohibiting pasting customer data into consumer tools like ChatGPT.',
    keyDirectives: [
      'Employees must never paste customer data, escrow numbers, confidential contracts, or trade secrets into public AI models like ChatGPT.',
      'Only enterprise AI tools approved by the XYZ AI Council may be used for work-related tasks.',
      'All prompts, inputs, and code generated by AI must be reviewed for security and IP compliance prior to deployment.',
      'AI tools must not be granted direct access to production databases or sensitive transaction pipelines.',
    ],
    fullText: `Section 5: Artificial Intelligence and Machine Learning Usage Policy.
5.1 Public Generative AI Tools. Can I paste customer data into ChatGPT? Absolutely not. Employees are strictly forbidden from inputting, pasting, or uploading customer personal data, loan amounts, title documents, proprietary source code, or confidential business details into consumer AI tools, including ChatGPT, Claude, Gemini consumer, or third-party web assistants.
5.2 Enterprise AI Governance. The use of generative AI tools is permitted only through sanctioned enterprise subscriptions reviewed and approved by the XYZ AI Council.
5.3 Review of AI Output. All work products assisted by AI tools must be independently verified by personnel for accuracy and security before being shared with clients or committed to repositories.`,
  },
  {
    id: 'xyz-sec-06',
    number: 6,
    title: 'Device Management and Physical Endpoint Security',
    page: 'Page 7',
    summary: 'Controls physical endpoint protection, screen locking, device encryption, and protocols for lost or stolen company laptops.',
    keyDirectives: [
      'Lost or stolen company laptops must be reported immediately to the Helpdesk and SOC within 1 hour.',
      'All endpoints must have full-disk BitLocker encryption active and enrolled in corporate MDM.',
      'Workstations must be locked whenever left unattended; screens must auto-lock after 5 minutes of inactivity.',
      'Laptops must never be left unattended in public vehicles, airport lounges, or unsecured hotel rooms.',
    ],
    fullText: `Section 6: Device Management and Physical Endpoint Security.
6.1 Lost or Stolen Equipment. What should I do if I lose my company laptop? If your company laptop, tablet, or phone is lost, stolen, or misplaced, you must report it immediately to the IT Helpdesk and Security Operations Center (SOC) within 1 hour. This prompt reporting allows security engineers to initiate remote wipe protocols and revoke active session tokens.
6.2 Physical Security and Screen Locking. Employees must lock their screens whenever stepping away from their desk. Laptops must be securely stored when traveling and never left visible in unattended vehicles.
6.3 Asset Recovery. Laptops and corporate equipment must be returned immediately upon termination of employment or when requested by management.`,
  },
  {
    id: 'xyz-sec-07',
    number: 7,
    title: 'Network Security and Remote Access Policy',
    page: 'Page 8',
    summary: 'Outlines rules for remote work, prohibiting unprotected public Wi-Fi usage and mandating corporate VPN.',
    keyDirectives: [
      'When working on airport public wifi, hotel Wi-Fi, or coffee shop networks, employees must always connect through corporate VPN.',
      'Direct transmission of sensitive credentials or work files over open, unencrypted wireless networks is strictly prohibited.',
      'Split-tunneling must not be disabled or circumvented on corporate laptops.',
      'Remote desktop access to internal resources is permitted only through authenticated, encrypted bastions.',
    ],
    fullText: `Section 7: Network Security and Remote Access Policy.
7.1 Remote Work and Public Networks. Is it OK to work on airport public wifi? Yes, but only when using the company-managed VPN. Employees working from airports, hotels, cafes, or public venues must connect to the corporate VPN before accessing any company email, portals, or customer data. Working on open, unsecured public Wi-Fi without VPN encryption is strictly prohibited.
7.2 Network Segmentation. Remote workers must ensure home Wi-Fi networks use WPA2 or WPA3 encryption with non-default administrator passwords.
7.3 Unauthorized Network Bridging. Bridging corporate networks with personal local area networks or connecting unauthorized hotspots to corporate laptops is prohibited.`,
  },
  {
    id: 'xyz-sec-08',
    number: 8,
    title: 'Cloud Applications, SaaS Software, and Browser Extensions',
    page: 'Page 9',
    summary: 'Regulates approved software installations, banning unvetted browser plugins and shadow IT cloud services.',
    keyDirectives: [
      'Employees must not install unauthorized browser extensions or third-party add-ons on corporate browsers.',
      'All cloud applications and SaaS vendors must complete a third-party risk assessment prior to handling company data.',
      'Syncing corporate data to personal cloud storage or unapproved collaboration tools is prohibited.',
      'Software installations require administrative elevation and approval from the IT Architecture board.',
    ],
    fullText: `Section 8: Cloud Applications, SaaS Software, and Browser Extensions.
8.1 Browser Extensions and Third-Party Plugins. Can I install a browser extension that is not approved? No. Employees must not install unapproved browser extensions, browser add-ons, or unvetted plugins. Many browser extensions harvest keystrokes, clipboard contents, and browsing history. Only extensions listed in the corporate enterprise catalog are permitted.
8.2 Shadow IT Prohibition. Employees are prohibited from signing up for third-party cloud tools, storage services, or SaaS platforms using corporate credentials without formal procurement and security assessment.
8.3 Cloud Data Storage. Work files must only be stored within corporate-managed cloud environments such as Microsoft 365, Azure, or approved Google Workspace instances.`,
  },
  {
    id: 'xyz-sec-09',
    number: 9,
    title: 'Incident Reporting, Phishing, and Non-Retaliation Policy',
    page: 'Page 10',
    summary: 'Mandates reporting of phishing attempts, lost devices, or suspicious events within 1 hour, guaranteeing non-retaliation for good-faith reports.',
    keyDirectives: [
      'Employees must report suspected phishing emails immediately using the Outlook Report Phishing button or by emailing security.',
      'Security breaches, anomalous MFA prompts, and misplaced laptops must be reported within 1 hour of discovery.',
      'XYZ strictly prohibits retaliation against any employee who makes a good-faith report of a security incident or policy breach.',
      'Employees must never attempt to investigate or interact with active malware or threat actors independently.',
    ],
    fullText: `Section 9: Incident Reporting, Phishing, and Non-Retaliation Policy.
9.1 Reporting Security Incidents. How do I report a phishing email? Employees who receive a suspicious email must report it immediately using the 'Report Phishing' button in the email client, or by forwarding the email as an attachment to phishing@xyz.com or security@xyz.com. Suspected malware, lost laptops, or anomalous MFA notifications must also be reported to the SOC within 1 hour.
9.2 Non-Retaliation Protection. Am I protected from retaliation if I report misconduct to the hotline or report a security mistake? Yes. XYZ maintains a zero-tolerance policy against retaliation. Any employee who reports a suspected security breach, accidental data exposure, or ethical violation in good faith will be protected from reprisal, harassment, or adverse employment consequences.
9.3 Incident Response Cooperation. Employees must fully cooperate with Security Operations personnel during incident triage and containment.`,
  },
  {
    id: 'xyz-sec-10',
    number: 10,
    title: 'Policy Enforcement, Disciplinary Actions, and Compliance',
    page: 'Page 11',
    summary: 'Specifies penalties and enforcement mechanisms for willful policy non-compliance and security infractions.',
    keyDirectives: [
      'Violations of this security policy may lead to disciplinary action up to and including immediate termination of employment.',
      'Willful data exfiltration or credential compromise may result in civil litigation and criminal referral.',
      'Managers are responsible for ensuring team compliance with all information security standards.',
      'Ignorance of policy directives does not excuse non-compliance.',
    ],
    fullText: `Section 10: Policy Enforcement, Disciplinary Actions, and Compliance.
10.1 Disciplinary Framework. What happens if I violate the security policy? Violations of this Information Technology Security Policy, whether through willful misconduct, gross negligence, or intentional circumvention of security controls, will result in disciplinary action up to and including termination of employment. In cases involving deliberate data theft, escrow fraud, or unauthorized disclosure, XYZ may pursue civil action and criminal prosecution.
10.2 Mandatory Annual Recertification. All employees must review and sign the annual Information Security Acknowledgment and pass the security exam.
10.3 Exceptions. Any temporary exception to these policies must be documented, approved by the Chief Information Security Officer (CISO), and reviewed periodically.`,
  },
];

export const HANDBOOK_VECTORS: ThreatVectorGuide[] = [
  {
    id: 'xyz-sec-01',
    sectionNumber: 1,
    title: 'Information Classification and Data Handling',
    category: 'Information Classification',
    riskLevel: 'HIGH',
    aliases: ['classification', 'data-handling'],
    targetAudienceNote: 'Applies to all associates handling customer files, escrow records, and confidential transaction details.',
    howBreachOccurs: {
      summary: 'Mishandling customer records or storing unclassified documents in public folders exposes sensitive borrower records.',
      mechanics: 'Unprotected repositories are indexed by external tools or accessed by unauthorized third parties without audit logging.',
      commonScenarios: [
        'An associate exports a list of customer loan amounts to an unsecured desktop folder.',
        'A spreadsheet containing Social Security numbers is shared via an open internal link.',
        'An unapproved PDF converter plugin uploads confidential contracts to an external server.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Regulatory fines under GLBA and state privacy statutes, plus customer loss of trust.',
      dataAtRisk: 'Customer PII, non-public financial records, title insurance policies.',
      legalOrCompliance: 'FTC Safeguards Rule, GLBA mandatory notification requirements, GDPR where applicable.',
    },
    howToPrevent: {
      goldenRules: [
        'Always classify every document into Public, Internal, Confidential, or Restricted.',
        'Encrypt all Confidential and Restricted files at rest and in transit.',
        'Store files only in sanctioned Microsoft 365 or SharePoint repositories.',
      ],
      doList: [
        'Apply sensitivity labels in Word, Excel, and Outlook before sending.',
        'Double-check recipient addresses before emailing confidential title records.',
        'Verify classification markings on exported reports.',
      ],
      dontList: [
        'Never upload customer information to free web-based converters or grammar tools.',
        'Do not remove classification banners from corporate documents.',
        'Never store unencrypted customer lists on desktop folders.',
      ],
      ApprovedAlternatives: ['Microsoft Purview Sensitivity Labels', 'Corporate SharePoint', 'Secure OneDrive'],
    },
    anatomySteps: [
      { phase: 'Discovery', title: 'Unlabeled File Created', description: 'User exports unclassified loan records to desktop.', actor: 'Internal User' },
      { phase: 'Exposure', title: 'File Shared Publicly', description: 'Document is copied into an open shared network folder.', actor: 'User Error' },
      { phase: 'Exfiltration', title: 'External Harvesting', description: 'Malicious actor accesses folder via credential stuffing.', actor: 'Threat Actor' },
    ],
    codeComparison: {
      language: 'typescript',
      badLabel: 'Unrestricted Data Ingestion',
      badCode: 'function exportReport(data: any) {\n  fs.writeFileSync("/tmp/customers.csv", data);\n}',
      badReason: 'Writes sensitive records to an unprotected, unencrypted temporary location.',
      goodLabel: 'Encrypted Classified Export',
      goodCode: 'function exportReport(data: ClassifiedRecord) {\n  auditLog("EXPORT", data.classification);\n  secureVault.writeEncrypted(data, AES_256);\n}',
      goodReason: 'Verifies data classification, writes encrypted bytes, and logs the access audit trail.',
    },
    quiz: {
      question: 'Which of the following is required when handling records classified as Confidential?',
      options: [
        'They can be stored anywhere as long as the filename includes the word private',
        'They must be encrypted at rest and stored only in approved corporate repositories',
        'They can be uploaded to personal Google Drive if needed for urgent weekend work',
        'They do not require any labeling once exported to PDF format',
      ],
      correctIndex: 1,
      explanation: 'Confidential and Restricted data must always be encrypted and stored only in approved company repositories.',
    },
  },
  {
    id: 'xyz-sec-02',
    sectionNumber: 2,
    title: 'Information Protection and Storage Controls',
    category: 'Information Protection',
    riskLevel: 'CRITICAL',
    aliases: ['storage', 'removable-media'],
    targetAudienceNote: 'Critical for all staff managing file transfers, external backups, and local workstation storage.',
    howBreachOccurs: {
      summary: 'Syncing corporate files to personal cloud drives or copying to USB sticks bypasses perimeter DLP controls.',
      mechanics: 'Consumer cloud storage accounts lack corporate access management, allowing files to persist indefinitely without encryption.',
      commonScenarios: [
        'An associate syncs work folders to a personal Google Drive to review over the weekend.',
        'A team member copies closing packets onto an unencrypted personal thumb drive.',
        'Files are backed up to a family Dropbox account.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Mass data exfiltration risk, loss of proprietary title records, immediate contractual breach.',
      dataAtRisk: 'Escrow ledgers, wire instructions, closing documentation.',
      legalOrCompliance: 'Breach notification obligations under state data protection acts.',
    },
    howToPrevent: {
      goldenRules: [
        'Never sync work documents to personal cloud drives or external accounts.',
        'Never connect unapproved USB drives or removable storage devices.',
        'Use only company-sanctioned OneDrive and SharePoint storage.',
      ],
      doList: [
        'Save all work items directly to corporate SharePoint document libraries.',
        'Report accidental saves to personal accounts immediately.',
        'Rely on corporate VPN for secure remote document access.',
      ],
      dontList: [
        'Never email corporate records to personal Gmail or Yahoo accounts.',
        'Do not plug personal phones or flash drives into work computers to charge.',
        'Never disable endpoint DLP agents.',
      ],
      ApprovedAlternatives: ['Company OneDrive for Business', 'SharePoint Online', 'Encrypted Enterprise File Sync'],
    },
    anatomySteps: [
      { phase: 'Initiation', title: 'Personal Sync Client Installed', description: 'User connects personal cloud storage tool to sync folder.', actor: 'Employee' },
      { phase: 'Transfer', title: 'Data Uploaded to Consumer Cloud', description: 'Customer loan files sync to personal account unencrypted.', actor: 'Sync Agent' },
      { phase: 'Compromise', title: 'Personal Account Hacked', description: 'Threat actor breaches personal account password.', actor: 'External Adversary' },
    ],
    codeComparison: {
      language: 'json',
      badLabel: 'Permissive Storage Sync',
      badCode: '{\n  "allowPersonalDriveSync": true,\n  "enforceRemovableMediaBlock": false\n}',
      badReason: 'Allows sensitive files to sync directly to unmonitored personal cloud storage.',
      goodLabel: 'Strict Endpoint Storage Policy',
      goodCode: '{\n  "allowPersonalDriveSync": false,\n  "enforceRemovableMediaBlock": true,\n  "authorizedTenants": ["xyz-corp.onmicrosoft.com"]\n}',
      goodReason: 'Restricts sync exclusively to the enterprise tenant and blocks removable media.',
    },
    quiz: {
      question: 'Is an employee permitted to sync corporate work files to their personal Google Drive?',
      options: [
        'Yes, provided they delete the files after the project completes',
        'Yes, if they need to work over the weekend and do not have VPN access',
        'No, syncing work files to personal cloud storage is strictly prohibited',
        'Yes, with written permission from their immediate team lead',
      ],
      correctIndex: 2,
      explanation: 'Policy strictly bans copying or syncing corporate documents to personal cloud storage under any circumstances.',
    },
  },
  {
    id: 'xyz-sec-03',
    sectionNumber: 3,
    title: 'Authentication, Password Policy, and Access Control',
    category: 'Authentication & Access',
    riskLevel: 'CRITICAL',
    aliases: ['passwords', 'mfa', 'access-control'],
    targetAudienceNote: 'Applies to all system users. Credentials are the primary vector targeted by automated cyber attacks.',
    howBreachOccurs: {
      summary: 'Weak passwords or MFA fatigue attacks allow threat actors to hijack legitimate associate sessions.',
      mechanics: 'Adversaries spray stolen passwords and spam user phones with MFA prompts until an approval is clicked.',
      commonScenarios: [
        'An associate reuses their Netflix password on corporate email.',
        'A user approves an unexpected MFA prompt at 2:00 AM thinking it is a system glitch.',
        'Credentials are typed into a realistic fake Microsoft login portal.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Full identity compromise, corporate email compromise (BEC), unauthorized wire transfers.',
      dataAtRisk: 'All accessible databases, emails, escrow systems, and customer documents.',
      legalOrCompliance: 'Sarbanes-Oxley access controls, AICPA SOC 2 trust principles.',
    },
    howToPrevent: {
      goldenRules: [
        'Use passwords of at least 14 characters with complex character sets.',
        'Never approve an MFA prompt you did not directly trigger.',
        'Report unrecognized authentication attempts to the SOC within 1 hour.',
      ],
      doList: [
        'Use enterprise password managers to generate long random phrases.',
        'Deny unexpected authentication pushes immediately.',
        'Change credentials immediately if phishing is suspected.',
      ],
      dontList: [
        'Never reuse corporate passwords on personal websites.',
        'Never share credentials with coworkers, contractors, or support reps.',
        'Do not write passwords on sticky notes.',
      ],
      ApprovedAlternatives: ['Enterprise SSO Portal', 'FIDO2 Hardware Keys', 'Authenticator Number Matching'],
    },
    anatomySteps: [
      { phase: 'Credential Harvest', title: 'Phishing Form Filled', description: 'User enters credentials on spoofed portal.', actor: 'Phishing Campaign' },
      { phase: 'MFA Bombing', title: 'Spamming Push Notifications', description: 'Attacker triggers 15 pushes in 2 minutes.', actor: 'Threat Actor' },
      { phase: 'Session Hijack', title: 'Accidental Approval', description: 'Fatigued user taps Approve; attacker gains session.', actor: 'User / Attacker' },
    ],
    codeComparison: {
      language: 'typescript',
      badLabel: 'Weak Password Validation',
      badCode: 'function checkPassword(p: string) {\n  return p.length >= 8;\n}',
      badReason: 'Allows short passwords without entropy or MFA validation.',
      goodLabel: 'Strict 14+ Character Policy',
      goodCode: 'function checkPassword(p: string) {\n  const valid = p.length >= 14 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);\n  return valid && !haveIBeenPwned(p);\n}',
      goodReason: 'Enforces 14 characters, symbol diversity, and checks against known breaches.',
    },
    quiz: {
      question: 'What should you do if your phone receives an MFA push notification that you did not initiate?',
      options: [
        'Approve it to make the alert stop buzzing',
        'Ignore it and wait for your password to expire naturally',
        'Deny the prompt immediately and report the event to the SOC within 1 hour',
        'Restart your phone to clear the notification queue',
      ],
      correctIndex: 2,
      explanation: 'An unexpected MFA push signals active credential misuse. You must deny it and alert the SOC immediately.',
    },
  },
  {
    id: 'xyz-sec-04',
    sectionNumber: 4,
    title: 'Corporate Ownership, Privacy Expectations, and Asset Return',
    category: 'Ownership & Privacy',
    riskLevel: 'HIGH',
    aliases: ['privacy', 'monitoring', 'asset-return'],
    targetAudienceNote: 'Governs acceptable use of corporate communication channels and offboarding asset return.',
    howBreachOccurs: {
      summary: 'Failure to return company equipment or assuming email is confidential leads to asset loss and regulatory exposure.',
      mechanics: 'Unreturned devices retain cached credentials, tokens, and corporate files outside management visibility.',
      commonScenarios: [
        'A departing contractor fails to return their corporate laptop for several weeks.',
        'An associate conducts personal business on corporate email expecting confidentiality.',
        'Former employees keep backup tokens after leaving the company.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Uncontrolled corporate assets in the wild, potential intellectual property leakage.',
      dataAtRisk: 'Locally cached emails, internal Slack histories, customer files.',
      legalOrCompliance: 'Contractual dispute, theft of corporate property.',
    },
    howToPrevent: {
      goldenRules: [
        'Understand that all emails and communications on company systems are monitored with no personal privacy.',
        'Return all company hardware on or before the final day of employment.',
        'Keep company communication channels strictly professional.',
      ],
      doList: [
        'Keep personal communications on your personal phone and accounts.',
        'Coordinate prompt return of equipment with IT asset logistics.',
        'Wipe any personal photos before turning in company hardware.',
      ],
      dontList: [
        'Never expect confidentiality for personal matters on corporate laptops.',
        'Do not retain corporate equipment after your official termination date.',
        'Never sell, transfer, or donate company computers.',
      ],
      ApprovedAlternatives: ['Company Asset Logistics Pre-Paid Return', 'MDM Remote Wipe Confirmation'],
    },
    anatomySteps: [
      { phase: 'Offboarding', title: 'Employee Resignation', description: 'Notice period ends without device check-in.', actor: 'Employee' },
      { phase: 'Lapse', title: 'Hardware Retained', description: 'Device remains at home location unmanaged.', actor: 'Ex-Employee' },
      { phase: 'Recovery', title: 'Remote Wipe Executed', description: 'SOC detects missing hardware and triggers cryptographic wipe.', actor: 'Security Ops' },
    ],
    quiz: {
      question: 'Does an employee have an expectation of privacy when using corporate email and workstations?',
      options: [
        'Yes, personal emails sent on company laptops are protected by federal privacy laws',
        'Yes, as long as the emails are marked Private in the subject line',
        'No, the company monitors all communications and activity on corporate systems',
        'Only between the hours of 9:00 AM and 5:00 PM',
      ],
      correctIndex: 2,
      explanation: 'All activity and communication on corporate equipment is company property and subject to automated monitoring.',
    },
  },
  {
    id: 'xyz-sec-05',
    sectionNumber: 5,
    title: 'Artificial Intelligence and Machine Learning Usage Policy',
    category: 'AI & Machine Learning',
    riskLevel: 'CRITICAL',
    aliases: ['ai', 'chatgpt', 'llm'],
    targetAudienceNote: 'Crucial for developers, underwriters, and operations staff interacting with AI copilots and LLM tools.',
    howBreachOccurs: {
      summary: 'Pasting sensitive title details or customer loan numbers into public web AI tools exposes confidential data to public training sets.',
      mechanics: 'Consumer AI platforms ingest prompt data for model retraining, making proprietary data extractable by external researchers.',
      commonScenarios: [
        'An underwriter pastes a customer tax return into ChatGPT to ask for a summary of income.',
        'A developer pastes private API keys and database queries into a public coding bot.',
        'An associate uploads an escrow agreement into a free online AI contract analyzer.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Mass regulatory breach, violation of GLBA safeguarding rules, corporate intellectual property loss.',
      dataAtRisk: 'Customer PII, proprietary pricing models, system source code, API credentials.',
      legalOrCompliance: 'Gramm-Leach-Bliley Act (GLBA), consumer privacy penalties, client contractual violations.',
    },
    howToPrevent: {
      goldenRules: [
        'Never paste customer data or proprietary code into consumer AI tools like ChatGPT.',
        'Use only enterprise AI tools vetted and approved by the XYZ AI Council.',
        'Verify all AI outputs for accuracy and security before production use.',
      ],
      doList: [
        'Request access to corporate enterprise AI environments with zero-retention agreements.',
        'Sanitize all example prompts to contain only synthetic, dummy data.',
        'Consult ethan.walker@xyz.com before adopting new AI tools.',
      ],
      dontList: [
        'Never upload customer loan files, tax returns, or deeds to public LLMs.',
        'Do not paste production API tokens or secret keys into public code helpers.',
        'Never automate critical escrow releases using unvetted AI prompts.',
      ],
      ApprovedAlternatives: ['XYZ Enterprise Copilot (Zero-Retention)', 'Sanctioned Azure OpenAI Tenant', 'Internal RAG Portal'],
    },
    anatomySteps: [
      { phase: 'Prompt Submission', title: 'Customer Record Pasted', description: 'Employee pastes borrower SSN and title deed into web LLM.', actor: 'Employee' },
      { phase: 'Model Ingestion', title: 'Data Absorbed into Corpus', description: 'Vendor server logs and caches prompt for future training.', actor: 'External AI Server' },
      { phase: 'Data Exposure', title: 'Information Extraction', description: 'External researchers elicit prompt data via model probing.', actor: 'Third Party' },
    ],
    codeComparison: {
      language: 'typescript',
      badLabel: 'Direct Public AI API Call',
      badCode: 'async function summarizeCustomer(customer: Customer) {\n  const res = await fetch("https://api.openai.com/v1/chat/completions", {\n    body: JSON.stringify({ prompt: `Summarize SSN ${customer.ssn}: ${customer.details}` })\n  });\n}',
      badReason: 'Exposes customer SSN and financial details to an unapproved external API endpoint.',
      goodLabel: 'Sanitized Enterprise AI Integration',
      goodCode: 'async function summarizeCustomer(customer: Customer) {\n  const anonymized = scrubPii(customer.details);\n  return enterpriseAiClient.generate({\n    prompt: anonymized,\n    dataRetention: "zero"\n  });\n}',
      goodReason: 'Redacts sensitive PII and uses enterprise zero-retention architecture.',
    },
    quiz: {
      question: 'Is it acceptable to paste customer title documents or loan amounts into ChatGPT for quick summarization?',
      options: [
        'Yes, as long as you clear the chat history after completing the task',
        'No, pasting customer data into public generative AI tools is strictly prohibited',
        'Yes, if the customer gave oral consent over the phone',
        'Yes, provided the document is less than 500 words',
      ],
      correctIndex: 1,
      explanation: 'Policy strictly prohibits pasting any customer records or proprietary data into unauthorized consumer AI tools.',
    },
  },
  {
    id: 'xyz-sec-06',
    sectionNumber: 6,
    title: 'Device Management and Physical Endpoint Security',
    category: 'Device Management',
    riskLevel: 'HIGH',
    aliases: ['laptops', 'lost-device', 'physical-security'],
    targetAudienceNote: 'Relevant to all mobile workers, traveling personnel, and hybrid office associates.',
    howBreachOccurs: {
      summary: 'Laptops stolen from car trunks or left at airport security checkpoints allow attackers to attempt hardware access.',
      mechanics: 'Physical theft provides unmonitored access to hardware components and local encrypted caches.',
      commonScenarios: [
        'A company laptop bag is left in the backseat of a rental car and stolen.',
        'An associate leaves their laptop at an airport TSA security bin.',
        'A workstation in a shared coworking space is left unlocked while the user gets coffee.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Potential compromise of cached corporate credentials, loss of expensive hardware assets.',
      dataAtRisk: 'Locally cached emails, temporary document downloads, browser session cookies.',
      legalOrCompliance: 'State lost-device notification thresholds if encryption status is uncertain.',
    },
    howToPrevent: {
      goldenRules: [
        'Report any lost or stolen company laptop within 1 hour to the Helpdesk and SOC.',
        'Ensure full disk encryption (BitLocker) is active and verified by IT.',
        'Always lock workstations when stepping away for any duration.',
      ],
      doList: [
        'Keep laptops in carry-on luggage only when traveling.',
        'Set screens to lock automatically after 5 minutes of inactivity.',
        'Store devices in locked drawers or secure hotel safes when not in use.',
      ],
      dontList: [
        'Never leave laptops visible inside unattended vehicles.',
        'Do not disable endpoint management software or BitLocker agents.',
        'Never lend corporate computers to family members or friends.',
      ],
      ApprovedAlternatives: ['BitLocker Full Disk Encryption', 'Microsoft Intune MDM Remote Wipe', 'Kensington Cable Locks'],
    },
    anatomySteps: [
      { phase: 'Physical Lapse', title: 'Device Left Unattended', description: 'Laptop left in rental car backseat while dining.', actor: 'Employee' },
      { phase: 'Theft', title: 'Window Broken, Device Taken', description: 'Thief steals backpack containing corporate laptop.', actor: 'Physical Thief' },
      { phase: 'Containment', title: 'Remote Wipe Triggered', description: 'Employee reports loss within 30 min; SOC issues MDM wipe command.', actor: 'SOC Analyst' },
    ],
    quiz: {
      question: 'What is the required action if your company laptop is misplaced or stolen while traveling?',
      options: [
        'Wait 48 hours to see if airport lost and found locates the item',
        'Report the incident immediately within 1 hour to the IT Helpdesk and SOC',
        'Purchase a replacement laptop at a retail electronics store and expense it',
        'Notify your team lead via Slack only on your next scheduled workday',
      ],
      correctIndex: 1,
      explanation: 'Prompt reporting within 1 hour enables security teams to initiate remote cryptographic wipe and revoke session tokens.',
    },
  },
  {
    id: 'xyz-sec-07',
    sectionNumber: 7,
    title: 'Network Security and Remote Access Policy',
    category: 'Network & Remote Access',
    riskLevel: 'HIGH',
    aliases: ['wifi', 'vpn', 'remote-work'],
    targetAudienceNote: 'Applies to remote, traveling, and hybrid personnel connecting from outside corporate facilities.',
    howBreachOccurs: {
      summary: 'Connecting to spoofed airport or hotel Wi-Fi without VPN exposes session cookies and passwords to eavesdropping.',
      mechanics: 'Adversaries deploy Evil Twin rogue access points to intercept unencrypted traffic and perform SSL stripping.',
      commonScenarios: [
        'An associate connects to Free_Airport_WiFi without turning on company VPN.',
        'A rogue access point in a hotel lobby intercepts login tokens.',
        'Home router default credentials remain unchanged, allowing local network compromise.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Network session hijacking, exposure of internal portal cookies, man-in-the-middle data theft.',
      dataAtRisk: 'Authentication tokens, intranet data, confidential emails in transit.',
      legalOrCompliance: 'PCI-DSS transit encryption mandates, SOC 2 network confidentiality requirements.',
    },
    howToPrevent: {
      goldenRules: [
        'Always connect to company VPN when using airport, hotel, or public Wi-Fi.',
        'Never connect to untrusted open networks without active VPN protection.',
        'Ensure home Wi-Fi uses WPA2 or WPA3 with a strong custom passphrase.',
      ],
      doList: [
        'Enable VPN auto-connect on corporate laptops.',
        'Use mobile phone cellular hotspot instead of open public networks when possible.',
        'Verify TLS certificate warnings before accessing internal resources.',
      ],
      dontList: [
        'Never disable the VPN client to increase download speeds.',
        'Do not click through browser certificate warning screens on public Wi-Fi.',
        'Never connect IoT smart devices to the same VLAN as your work laptop.',
      ],
      ApprovedAlternatives: ['Cisco AnyConnect / GlobalProtect VPN', 'Cellular Tethering Hotspot', 'WPA3 Enterprise Access'],
    },
    anatomySteps: [
      { phase: 'Lure', title: 'Rogue Access Point Broadcast', description: 'Attacker deploys fake "Airport_Guest_WiFi" hotspot.', actor: 'Threat Actor' },
      { phase: 'Connection', title: 'Unprotected Connection', description: 'Laptop connects without enabling corporate VPN.', actor: 'Employee' },
      { phase: 'Interception', title: 'Token Interception', description: 'Attacker sniffs transmission and attempts session hijack.', actor: 'Man-in-the-Middle' },
    ],
    quiz: {
      question: 'Is it acceptable to access corporate systems while connected to an airport public Wi-Fi network?',
      options: [
        'Yes, but only if you connect through the corporate VPN first',
        'No, working from airports is strictly forbidden',
        'Yes, airport networks are inherently secure by federal law',
        'Only if you use private browsing mode in Google Chrome',
      ],
      correctIndex: 0,
      explanation: 'Public Wi-Fi is acceptable only when protected by the encrypted corporate VPN tunnel.',
    },
  },
  {
    id: 'xyz-sec-08',
    sectionNumber: 8,
    title: 'Cloud Applications, SaaS Software, and Browser Extensions',
    category: 'Cloud & Applications',
    riskLevel: 'HIGH',
    aliases: ['extensions', 'shadow-it', 'plugins'],
    targetAudienceNote: 'Applies to all employees evaluating productivity utilities, browser extensions, and SaaS portals.',
    howBreachOccurs: {
      summary: 'Malicious browser extensions read form fields, steal passwords, and exfiltrate clipboard data unnoticed.',
      mechanics: 'Extensions require broad permissions to read and modify all data on websites you visit, enabling silent keylogging.',
      commonScenarios: [
        'An associate installs an unvetted PDF merger extension from the Chrome Web Store.',
        'A grammar checking plugin logs customer escrow wire instructions from the screen.',
        'A team signs up for an unsanctioned project management SaaS using company credit cards.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Silent exfiltration of credentials, clipboard hijacking, shadow IT vendor liabilities.',
      dataAtRisk: 'Keystrokes, session tokens, customer banking details, contract drafts.',
      legalOrCompliance: 'Vendor risk management failures, SOC 2 third-party risk non-compliance.',
    },
    howToPrevent: {
      goldenRules: [
        'Never install browser extensions or plugins that are not in the approved enterprise catalog.',
        'Do not adopt shadow IT cloud applications without Architecture and Security approval.',
        'Store files only in approved enterprise cloud repositories like OneDrive and SharePoint.',
      ],
      doList: [
        'Check the corporate software portal for sanctioned tools before looking online.',
        'Submit third-party security evaluation requests for new productivity utilities.',
        'Uninstall unapproved extensions immediately.',
      ],
      dontList: [
        'Never install third-party browser add-ons requesting permission to read all website data.',
        'Do not create team accounts on consumer SaaS tools with corporate email.',
        'Never bypass browser extension blocklists using developer mode.',
      ],
      ApprovedAlternatives: ['Enterprise Curated Chrome Extension Store', 'Microsoft 365 Enterprise Suite', 'Approved Adobe Acrobat Pro'],
    },
    anatomySteps: [
      { phase: 'Installation', title: 'Unapproved Extension Added', description: 'User installs free screen-recorder plugin from web store.', actor: 'Employee' },
      { phase: 'Permission Grant', title: 'Broad Access Conceded', description: 'Extension requests "read and change all data on websites".', actor: 'Extension Manifest' },
      { phase: 'Harvest', title: 'Credential Exfiltration', description: 'Plugin transmits form inputs and auth cookies to adversary server.', actor: 'Malicious Extension' },
    ],
    codeComparison: {
      language: 'json',
      badLabel: 'Unrestricted Extension Policy',
      badCode: '{\n  "ExtensionInstallBlocklist": [],\n  "ExtensionInstallAllowlist": ["*"]\n}',
      badReason: 'Allows employees to install any unvetted extension from public web stores.',
      goodLabel: 'Strict Curated Extension Allowlist',
      goodCode: '{\n  "ExtensionInstallBlocklist": ["*"],\n  "ExtensionInstallAllowlist": ["cjpalhdlnbpafiamejdnhcphjbkeiagm", "ghbmnnjldmmengfadnfkkimehkgflbbf"]\n}',
      goodReason: 'Blocks all extensions by default, permitting only thoroughly vetted enterprise items.',
    },
    quiz: {
      question: 'Can an associate install a third-party browser extension from the internet to speed up document formatting?',
      options: [
        'Yes, if the extension has at least 4.5 stars on the web store',
        'No, only extensions explicitly approved and listed in the enterprise catalog may be installed',
        'Yes, provided it is free and does not require credit card entry',
        'Yes, if they disable it at the end of each workday',
      ],
      correctIndex: 1,
      explanation: 'Unapproved browser extensions pose significant data-harvesting risks and are forbidden unless vetted by IT Security.',
    },
  },
  {
    id: 'xyz-sec-09',
    sectionNumber: 9,
    title: 'Incident Reporting, Phishing, and Non-Retaliation Policy',
    category: 'Incident Reporting',
    riskLevel: 'CRITICAL',
    aliases: ['phishing', 'reporting', 'incident-response', 'retaliation'],
    targetAudienceNote: 'The frontline security safeguard for all associates. Rapid reporting saves millions in potential breach damages.',
    howBreachOccurs: {
      summary: 'Hesitating to report a clicked phishing link allows attackers hours or days of unchecked lateral movement inside the network.',
      mechanics: 'Adversaries exploit dwell time between initial compromise and SOC awareness to elevate privileges and deploy ransomware.',
      commonScenarios: [
        'An associate clicks an urgent invoice link, realizes it looks suspicious, but closes the tab without telling anyone.',
        'A user receives a spoofed email from the CEO demanding urgent wire transfer changes.',
        'An employee fears getting in trouble after entering their password on an external page.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Network-wide ransomware encryption, business email compromise, catastrophic business interruption.',
      dataAtRisk: 'Entire corporate domain, database backups, active directory controllers.',
      legalOrCompliance: 'SEC 4-day disclosure rules, contractual customer notification deadlines.',
    },
    howToPrevent: {
      goldenRules: [
        'Report suspected phishing immediately using the Report Phishing button or emailing security.',
        'Report any security mistake or lost device within 1 hour; good-faith reporting is 100% protected against retaliation.',
        'Never feel ashamed to report a clicked link; rapid reporting is what prevents widespread disaster.',
      ],
      doList: [
        'Click the Report Phishing button on any unexpected email asking for credentials or urgency.',
        'Contact the SOC at (800) 555-0199 or security@xyz.com immediately if you clicked a suspicious link.',
        'Disconnect network cable if you notice files unexpectedly renaming themselves.',
      ],
      dontList: [
        'Never forward phishing emails to colleagues to ask if they think it is real.',
        'Never hide a security mistake or hope nobody notices.',
        'Do not reply to the sender or click unsubscribe links on suspicious messages.',
      ],
      ApprovedAlternatives: ['Outlook Report Phishing Add-In', 'Security Operations Hotline: (800) 555-0199', 'phishing@xyz.com'],
    },
    anatomySteps: [
      { phase: 'Bait', title: 'Deceptive Email Received', description: 'Urgent email arrives impersonating internal HR payroll system.', actor: 'Phishing Campaign' },
      { phase: 'Click', title: 'Link Triggered', description: 'Employee clicks link but notices odd URL and hesitates.', actor: 'Employee' },
      { phase: 'Rapid Alert', title: 'SOC Notification', description: 'Employee clicks Report Phishing within 2 minutes; SOC isolates endpoint.', actor: 'Employee / SOC' },
    ],
    quiz: {
      question: 'What is the corporate policy regarding an employee who reports clicking a suspicious email link in good faith?',
      options: [
        'The employee will receive an automatic disciplinary reprimand on their HR file',
        'The employee must pay the forensic triage fee',
        'XYZ maintains a strict non-retaliation policy; reporting in good faith is protected and welcomed',
        'The employee is prohibited from working remotely for 6 months',
      ],
      correctIndex: 2,
      explanation: 'XYZ guarantees non-retaliation for good-faith reports. Fast reporting is critical for rapid threat containment.',
    },
  },
  {
    id: 'xyz-sec-10',
    sectionNumber: 10,
    title: 'Policy Enforcement, Disciplinary Actions, and Compliance',
    category: 'Enforcement & Discipline',
    riskLevel: 'HIGH',
    aliases: ['enforcement', 'discipline', 'penalties'],
    targetAudienceNote: 'Applies to all personnel, establishing legal and professional accountability for policy adherence.',
    howBreachOccurs: {
      summary: 'Intentional circumvention of security controls or willful disregard of policy compromises enterprise defenses.',
      mechanics: 'Willful bypasses introduce unmonitored backdoors that bypass enterprise compliance audits.',
      commonScenarios: [
        'An engineer disables endpoint monitoring software to run personal gaming servers.',
        'A user deliberately transfers customer lists to a competing enterprise.',
        'An associate repeatedly ignores mandatory security training and policy acknowledgments.',
      ],
    },
    downstreamBlastRadius: {
      businessImpact: 'Direct corporate liability, criminal insider threat exposure, loss of regulatory licenses.',
      dataAtRisk: 'Core intellectual property, enterprise customer database.',
      legalOrCompliance: 'Criminal referral under the Computer Fraud and Abuse Act (CFAA), civil litigation.',
    },
    howToPrevent: {
      goldenRules: [
        'Comply fully with all security directives; violations lead to discipline up to termination.',
        'Understand that willful data exfiltration or fraud will lead to civil litigation and criminal referral.',
        'Complete annual policy recertifications and security assessments on time.',
      ],
      doList: [
        'Consult compliance or legal if you are uncertain about policy application.',
        'Participate actively in annual security awareness recertification.',
        'Request formal management exceptions for unusual technical requirements.',
      ],
      dontList: [
        'Never attempt to circumvent or disable corporate endpoint controls.',
        'Do not assume ignorance of policy rules will excuse serious violations.',
        'Never export company customer records for unauthorized commercial usage.',
      ],
      ApprovedAlternatives: ['Formal CISO Exception Process', 'HR / Compliance Consultation Channel'],
    },
    anatomySteps: [
      { phase: 'Violation', title: 'Intentional Bypass', description: 'User attempts to disable endpoint DLP agent.', actor: 'Bad Actor' },
      { phase: 'Alert', title: 'Audit Alert Triggered', description: 'Central SIEM flags tamper event and notifies leadership.', actor: 'Security Monitoring' },
      { phase: 'Discipline', title: 'Formal Disciplinary Action', description: 'Management reviews audit log and initiates termination proceedings.', actor: 'HR & Legal' },
    ],
    quiz: {
      question: 'What are the consequences of violating XYZ information security policies?',
      options: [
        'There are no consequences for internal security infractions',
        'Disciplinary action up to and including immediate termination of employment and possible legal prosecution',
        'A five dollar deduction from the associate payroll check',
        'A reminder email sent only after the fifth confirmed violation',
      ],
      correctIndex: 1,
      explanation: 'Policy violations result in disciplinary action up to termination of employment, plus potential civil and criminal penalties.',
    },
  },
];

export const HANDBOOK_MARKDOWN_EXPORT = `# XYZ Information Technology Security and Usage Policy v7.0
Revised: 04/01/2026 | XYZ Information Services Corp

## Section 1: Information Classification and Data Handling
All data created or processed by XYZ must be classified into one of four tiers: Public, Internal, Confidential, or Restricted. Confidential information includes customer PII, title records, and financial documents. Confidential data must be encrypted and must never be uploaded to unapproved browser extensions or personal utilities.

## Section 2: Information Protection and Storage Controls
Employees are strictly prohibited from syncing work documents or customer data to personal Google Drive, personal Dropbox, iCloud, or any personal cloud storage. Connecting unapproved USB flash drives or external storage to corporate workstations is forbidden.

## Section 3: Authentication, Password Policy, and Access Control
All passwords must be at least 14 characters long and include uppercase, lowercase, numbers, and symbols. Multi-factor authentication (MFA) is mandatory. If you receive an unexpected MFA prompt that you did not initiate, you must deny it immediately and report it to the SOC within 1 hour.

## Section 4: Corporate Ownership, Privacy Expectations, and Asset Return
Employees have no expectation of privacy on corporate systems. XYZ monitors email, network activity, and files. Laptops and all corporate assets remain company property and must be returned on or before an associate's final day of employment.

## Section 5: Artificial Intelligence and Machine Learning Usage Policy
Employees must never paste customer data, loan amounts, or proprietary code into consumer AI tools such as ChatGPT or Claude. Only enterprise AI tools approved by the XYZ AI Council may be used.

## Section 6: Device Management and Physical Endpoint Security
If a company laptop is lost or stolen, it must be reported within 1 hour to the IT Helpdesk and Security Operations Center (SOC). All endpoints must have BitLocker encryption enabled and auto-lock after 5 minutes of inactivity.

## Section 7: Network Security and Remote Access Policy
Working on airport public wifi, hotel Wi-Fi, or public networks is permitted only when connected to the company VPN. Never access internal systems on open networks without VPN encryption.

## Section 8: Cloud Applications, SaaS Software, and Browser Extensions
Employees must not install unapproved browser extensions or add-ons. Only vetted tools from the corporate software catalog are permitted. Shadow IT cloud software is strictly prohibited.

## Section 9: Incident Reporting, Phishing, and Non-Retaliation Policy
Suspected phishing emails must be reported immediately using the Report Phishing button or forwarded to phishing@xyz.com. Any security breach or lost laptop must be reported within 1 hour. XYZ guarantees non-retaliation for any good-faith report.

## Section 10: Policy Enforcement, Disciplinary Actions, and Compliance
Violations of this security policy may lead to disciplinary action up to and including termination of employment and criminal prosecution. All staff must complete annual recertification.
`;
