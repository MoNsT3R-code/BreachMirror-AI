export interface ThreatVectorGuide {
  id: string;
  aliases?: string[];
  sectionNumber: number;
  title: string;
  category: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  targetAudienceNote: string;
  audioSignature: {
    name: string;
    acousticProfile: string;
    decibelLevel: string;
    sirenTone: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  };
  anatomySteps: {
    phase: 'Trigger' | 'Exploit Pipeline' | 'Blast Radius';
    title: string;
    description: string;
    actor: string;
  }[];
  codeComparison?: {
    language: string;
    badCode: string;
    badLabel: string;
    badReason: string;
    goodCode: string;
    goodLabel: string;
    goodReason: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  howBreachOccurs: {
    summary: string;
    commonScenarios: string[];
    mechanics: string;
  };
  downstreamBlastRadius: {
    businessImpact: string;
    dataAtRisk: string;
    legalOrCompliance: string;
  };
  howToPrevent: {
    goldenRules: string[];
    ApprovedAlternatives: string[];
    doList: string[];
    dontList: string[];
  };
}

export interface StewartPolicySection {
  id: string;
  number: number;
  title: string;
  page: string;
  summary: string;
  fullText: string;
  keyDirectives: string[];
}

export const STEWART_POLICY_METADATA = {
  documentTitle: 'Information Technology Security and Usage',
  version: 'v7.0',
  lastRevised: '04/01/2026',
  copyright: '©Stewart Information Services Corporation 2026',
  scope: 'This policy Applies to all individuals who access Stewart resources, including employees (full-time, part-time, and temporary), contractors, consultants, vendors, and third parties. It governs the use of all devices—whether company-issued or personal—that access Stewart systems, networks, data, or facilities. While this policy refers to an “employee” throughout the document, it is Applicable in its entirety to all others with access to Stewart systems, resources, or data.',
  incidentEmail: 'itsecurity@stewart.com',
  ethicsHotline: '(866) 384-4277 (EthicsPoint)',
};

export const STEWART_POLICY_SECTIONS: StewartPolicySection[] = [
  {
    id: 'stewart-sec-01',
    number: 1,
    title: 'Information Classification and Acceptable Use',
    page: 'Pages 1 - 3',
    summary: 'Establishes Stewart’s 3-tier information classification (Public, Internal Use, Confidential), acceptable personal use parameters, strictly prohibited activities, credential separation, and external communications/social media standards.',
    keyDirectives: [
      'Public Information may be shared freely; Internal Use is for routine operations; Confidential Information requires encryption outside the network, business need, and dual Approvals.',
      'Personal use permitted during non-working hours with manager Approval; strictly no streaming during business hours, gambling, commercial ventures, or personal hotspots.',
      'Zero tolerance for security circumvention, tampering with monitoring/EDR, credential sharing, or unauthorized VPNs/proxies.',
      'Strict separation: Never use Stewart email/credentials for personal services; password reuse across personal and business accounts is forbidden.',
      'No expectation of privacy for personal data stored on Stewart resources; company reserves right to delete non-business data without notice.',
      'Social media: Personal opinions must disclaim representation of Stewart; confidential info disclosure is forbidden; only authorized spokespersons speak for Stewart.'
    ],
    fullText: `Information Classification and Acceptable Use

Information Classification Framework
Stewart’s information assets are classified according to sensitivity level to ensure Appropriate protection measures:
• Public Information may be freely disclosed and shared without restriction. This includes marketing materials, press releases, and content intended for public consumption.
• Internal Use Information is intended for routine business operations and may be shared with Stewart personnel and authorized business partners. While not publicly available, its unauthorized disclosure would not cause significant harm to the organization. Examples include internal policies, organizational charts, and general business communications.
• Confidential Information requires protection due to its sensitive nature. Unauthorized disclosure could result in harm to Stewart, customers, or employees, or could violate regulatory requirements. This category includes financial data, customer information, employee personal information, strategic business plans, and proprietary processes. Confidential information must be encrypted when transmitted outside Stewart's network and shared only with authorized individuals who have documented business need and Appropriate Approvals.

Acceptable Personal Use
Stewart recognizes that incidental personal use of company information resources may occur. Such use is permitted provided it occurs primarily during non-working hours (breaks, lunch periods, before or after scheduled work time), does not consume significant system resources, does not interfere with job performance or productivity, and complies with all provisions of this policy. Personal use privileges require manager Approval and may be revoked if abused.
Personal use is expressly prohibited for: video or audio streaming during business hours, commercial activities or personal business ventures, gambling, accessing inAppropriate or offensive content, using company mobile devices for personal hotspot/tethering, or any activity that violates Applicable laws or regulations.

Prohibited Activities
The following activities are strictly prohibited on Stewart information systems:
• Security Circumvention: Attempting to bypass, disable, or circumvent security controls; installing unauthorized software or Applications; tampering with security software, monitoring systems, or logging mechanisms; sharing authentication credentials; connecting unauthorized devices to Stewart networks; or using unauthorized VPN, proxy, or anonymization services.
• Malicious Conduct: Creating, distributing, or executing malicious code or exploits; intentionally degrading system or network performance; conducting denial-of-service activities; unauthorized access to systems, networks, or data; or exfiltration of company information.
• InAppropriate Content: Accessing, storing, distributing, or transmitting sexually explicit material, hate speech, discriminatory content, harassing or threatening communications, pirated software or media, or content promoting violence or illegal activities.
• Misrepresentation: Falsifying electronic communications or documents, impersonating others, misrepresenting oneself or the organization, or making unauthorized public statements on behalf of Stewart.

Account and Credential Separation
Employees must maintain strict separation between personal and business accounts. Stewart’s email addresses and credentials must never be used to register for personal services, websites, or Applications. Personal passwords or variations thereof must not be reused for Stewart business accounts. Employees found reusing passwords across personal and business systems will be required to reset all Stewart passwords immediately.

Personal Data on Company Systems
Stewart reserves the right to delete any non-business information stored on company information resources without notice. Employees should not store personal files, documents, media, or communications on Stewart systems with any expectation of privacy, retention, or recovery services.

External Communications and Social Media
Employees accessing personal social media during Approved personal use time must clearly indicate that personal views expressed do not represent Stewart’s positions. Confidential information must not be disclosed on social media platforms or public forums. Only authorized spokespersons may represent Stewart in public communications or respond to media inquiries. Employees must not engage in online conduct that could harm Stewart's reputation or business interests.`
  },
  {
    id: 'stewart-sec-02',
    number: 2,
    title: 'Information Protection Standards',
    page: 'Pages 3 - 4',
    summary: 'Mandates physical security, clean desk protocols, Microsoft 365 repository enforcement, email and file transmission encryption, software Approval procedures, and financial systems access controls.',
    keyDirectives: [
      'Physical Security: Auto-lock after 15 minutes of inactivity; manual locking mandatory whenever stepping away; work surfaces cleared overnight.',
      'Portable devices containing Confidential/Restricted data must be under direct physical control or secured; never left visible in vehicles.',
      'Approved storage: Stewart Microsoft 365 tenant (OneDrive for individual files, SharePoint for team collaboration, Teams for project work).',
      'Prohibited storage: Personal Dropbox, Google Drive, iCloud, personal devices, or removable media without IT Security exception.',
      'Transmission encryption: Mandatory for external transmissions via Outlook built-in encryption, Zix, or secure SharePoint. Confidential data requires CISO and Legal Approval.',
      'Software installation forbidden without written IT Security Approval. Tampering with or disabling security software (antivirus, EDR, DLP) constitutes grounds for immediate termination.',
      'Financial systems: Access strictly segregated; requires dual Approval from employee’s manager and the Controller or Chief Financial Officer.'
    ],
    fullText: `Information Protection Standards

Physical Security Requirements
Computing devices must be locked when unattended, even briefly. Systems will automatically lock after 15 minutes of inactivity, but manual locking is required when leaving workstations. Portable devices containing Confidential or Restricted information must remain under the user's direct physical control or be secured in locked storage when not in use. Devices must not be left in vehicles in a clear view or unsecured locations.
Confidential and Restricted documents must be secured in locked storage when not in active use. Documents must not be left on desks or in open areas overnight. Work surfaces containing sensitive information (whiteboards, monitors, documents) must be cleared before leaving the work area.

Information Storage and Transmission
All business information must be stored in Approved locations within Stewart's Microsoft 365 environment: OneDrive for individual files, SharePoint for team collaboration, and Teams for project-based work. These locations provide automatic backup, version control, and security controls.
Storage of work-related information is prohibited on: personal cloud storage services (personal Dropbox, Google Drive, iCloud, etc.), personal computing devices, removable media (except encrypted devices Approved for specific business purposes), or any unApproved third-party services unless the exception is filed and Approved by IT Security.
Confidential and Restricted information transmitted outside Stewart's network must be encrypted using Approved methods. For most users, this involves utilizing built-in encryption features in Outlook email, using Zix encryption or secure sharing capabilities in SharePoint. External sharing of Confidential or Internal information requires documented business justification, an executed Non-Disclosure Agreement (NDA), and Approval from the data owner and manager. Confidential information additionally requires CISO and Legal department Approval.

Software Installation and Management
Employees are not allowed to download, install, or use software or Applications without written Approval from IT Security. This restriction Applies to computer (server and desktop) Applications, browser extensions, mobile Apps on company devices, and utilities. The IT Department maintains a list of Approved software and Applications. Requests for software not on the Approved list must be submitted through the IT service management system with a business justification and manager Approval. Such requests will be reviewed and Approved by IT Security.
Tampering with, disabling, or attempting to remove security software (antivirus, endpoint detection and response, data loss prevention, or monitoring agents) constitutes grounds for immediate termination.

Financial Systems Access
Access to financial information in company accounting systems is restricted to individuals whose job responsibilities require such access. This restriction maintains Appropriate segregation of duties and internal controls. Access to financial systems requires dual Approval from both the employee's manager and the Controller or Chief Financial Officer.`
  },
  {
    id: 'stewart-sec-03',
    number: 3,
    title: 'Authentication and Access Management',
    page: 'Page 4',
    summary: 'Specifies 16+ character password requirements, bans browser password managers, enforces phish-resistant MFA as the sole standard, and governs least privilege access.',
    keyDirectives: [
      'Passwords must be at least 16 characters, combining uppercase, lowercase, numbers, and special characters. No dictionary words or reused passwords.',
      'Passwords must NEVER be written down, saved in documents/spreadsheets, or saved in browser password managers. Use Stewart’s enterprise password manager.',
      'Password sharing is strictly prohibited under all circumstances; users are fully accountable for all activities under their credentials.',
      'Multi-Factor Authentication (MFA) is mandatory for remote access, cloud Applications, VPNs, privileged accounts, and financial systems.',
      'Stewart has adopted "phish-resistant authentication" as the only allowed MFA standard. Push notifications without user-initiated logins must be denied.',
      'Access control: Strictly follows least privilege and need-to-know. Privileged access outside role-based defaults requires CISO Approval.'
    ],
    fullText: `Authentication and Access Management

Password Requirements and Management
Passwords for Stewart systems must meet minimum complexity requirements: at least 16 characters, including a combination of uppercase and lowercase letters, numbers, and special characters. Passwords must not include easily guessable or dictionary words, predictable patterns, personal information, or previously used passwords. Password reuse across multiple systems is prohibited.
Passwords must never be written down, saved in documents or spreadsheets, or stored in browser password managers. Approved storage methods include Stewart's enterprise password manager (where Applicable) or commercial password managers that employ strong master passwords and multi-factor authentication. Password sharing is prohibited under all circumstances. Each user is fully accountable for all activities conducted under their credentials.

Multi-Factor Authentication
Multi-factor authentication (MFA) is required for all remote access to Stewart networks and Applications, access to cloud-based enterprise Applications, VPN connections, administrative or privileged accounts, systems containing Confidential data, and financial systems.
MFA requires two distinct forms of verification: typically, a password combined with a time-based code from a hardware security key, authenticator Application, or push notification to a registered mobile device. Stewart adopted “phish-resistant authentication” as the only allowed MFA. Access to certain highly privileged systems, services, or accounts may require multiple authentication factors (more than two).

Access Control Principles
Access to Stewart’s information resources follows the principles of least privilege and need-to-know. Users receive the minimum access necessary to perform their job functions. Additional access requests require Approval from the employee's direct manager and the relevant data owner or system custodian. Administrative or privileged access outside of Approved role-based permission requires CISO Approval. All access Approvals must be documented and retained for audit purposes.`
  },
  {
    id: 'stewart-sec-04',
    number: 4,
    title: 'Ownership, Monitoring, and Privacy',
    page: 'Pages 4 - 5',
    summary: 'Clarifies Stewart’s absolute ownership of all communications and assets, establishes zero expectation of privacy, defines continuous monitoring scope, and mandates immediate return of property.',
    keyDirectives: [
      'All data created, sent, received, or stored on Stewart resources is Stewart property, regardless of business or personal nature.',
      'Zero expectation of privacy: Stewart systems are private corporate resources. Stewart reserves the right to monitor, review, copy, and disclose any activity without prior notice.',
      'Monitoring covers emails (business & personal), web browsing, instant messages, chat logs, files, voice/voicemail, video meetings, and access logs.',
      'Real-time and historical monitoring; deleted files and communications remain recoverable and subject to audit and investigation.',
      'Email communications may be archived indefinitely and forwarded to managers during employee absence, transition, or leave.',
      'Upon termination: Immediately return all devices, badges, keys, cards, and data; wipe Stewart data from personal devices. Post-termination access is subject to criminal prosecution.'
    ],
    fullText: `Ownership, Monitoring, and Privacy

Ownership of Information and Resources
All information created, transmitted, received, or stored using Stewart information resources is the property of Stewart, regardless of whether the content is business-related or personal in nature. This includes all electronic communications (email, messages, voicemail, video conferences), documents, files, and data stored on Stewart systems or with third-party service providers where Stewart is the subscriber.

Monitoring and Privacy Expectations
Stewart Information systems are private corporate resources, not public forums. Users have no expectation of privacy when using Stewart systems. Stewart reserves the right to monitor, access, review, copy, store, and disclose any information or communications on its systems at any time without prior notice.
Monitoring encompasses email communications (both business and personal content), internet browsing activity, instant messages and chat logs, files and documents, voice communications and voicemail, video conferences, Application usage, and system access logs. Monitoring may occur in real-time or historically, and deleted content may be recoverable and subject to review.
This monitoring serves legitimate business purposes, including protecting company assets and confidential information; ensuring compliance with legal and regulatory requirements; investigating policy violations or security incidents; responding to legal proceedings or government requests; and maintaining system security and integrity.

Email Retention and Forwarding
Stewart may archive all email communications indefinitely for compliance, legal, and business purposes. Email may be forwarded to managers or other authorized personnel when operationally necessary (such as during employee absence, leave, or transition). Employees consent to such monitoring and forwarding through their use of Stewart systems.

Return of Company Property
Upon termination of employment or contract, individuals must immediately return all Stewart property, including: computing devices (laptops, tablets, mobile phones), access credentials (badges, security tokens, keys), corporate credit cards, and any documents or data (physical or electronic) containing Stewart information. All Stewart information must be deleted from personal devices. Continued access to Stewart systems following termination is prohibited and may result in civil or criminal prosecution.`
  },
  {
    id: 'stewart-sec-05',
    number: 5,
    title: 'Artificial Intelligence and Emerging Technologies',
    page: 'Pages 5 - 6',
    summary: 'Prohibits feeding Internal or Confidential data into public AI chatbots (ChatGPT, Claude, Gemini, Perplexity, public Copilot), outlines strictly banned data types, Approves generic public research, and governs enterprise AI.',
    keyDirectives: [
      'Strictly prohibited: Inputting Internal or Confidential information into public AI tools (ChatGPT, Claude, Gemini, Perplexity, public Copilot).',
      'Prohibited data in AI: Customer data, employee PII, financial metrics, strategic plans, source code, technical architecture, legal work product, trade secrets, and partner/vendor NDA data.',
      'Approved public AI use: Public research, learning/skills using public info, and drafting assistance with generic public concepts only.',
      'AI-Generated Content Standards: All AI output for business must be reviewed, fact-checked, and validated by qualified personnel; employees remain fully accountable.',
      'Material substantially created by AI should be identified as such where relevant to context or recipients.',
      'Enterprise AI Solutions: Only AI tools on the IT Department’s Approved enterprise agreement list may process proprietary work.'
    ],
    fullText: `Artificial Intelligence and Emerging Technologies

Use of AI Tools and Services
Employees must not input Internal or Confidential information into public artificial intelligence tools and services, including but not limited to ChatGPT, Claude, Gemini, Perplexity, publicly accessible versions of Copilot, or similar large language models and AI platforms. These services may retain, learn from, or expose input data to unauthorized parties.

Prohibited Data in AI Systems
The following information types must never be entered into public AI services: customer data, employee personally identifiable information, financial data and business performance metrics, strategic plans and proprietary business processes, source code and technical architecture, legal documents and attorney work product, trade secrets, vendor or partner confidential information, or any information subject to non-disclosure agreements or contractual confidentiality obligations.

Approved Uses of Public AI
Public AI tools may be used for: research on publicly available topics, general learning and skills development using public information, drafting assistance using only generic, publicly available information, or other purposes that do not involve Stewart’s confidential or proprietary information.

AI-Generated Content Standards
Content generated using AI tools for business purposes must be reviewed and validated by qualified personnel prior to use. Employees remain accountable for the accuracy and Appropriateness of AI-generated content. Material substantially created by AI should be identified as such where relevant to the context or recipient.

Enterprise AI Solutions
The IT Department maintains a list of AI solutions authorized and Approved to use under enterprise agreements.`
  },
  {
    id: 'stewart-sec-06',
    number: 6,
    title: 'Device Management and Telecommunications',
    page: 'Pages 6 - 7',
    summary: 'Enforces company-issued device protection, mandatory 1-hour reporting of lost/stolen devices, mobile driving safety bans (zero texting while driving), recording/wiretap consent laws, BYOD controls, and IoT restrictions.',
    keyDirectives: [
      'Company-issued devices must maintain all security agents (EDR, encryption, MDM); tampering or circumvention is prohibited.',
      'Lost or stolen devices must be reported to IT Security immediately within ONE HOUR of discovery for remote wipe evaluation.',
      'Company mobile devices may not be used for personal hotspot/tethering; international personal calls on company lines are prohibited.',
      'Driving safety: Texting while driving is strictly prohibited under all circumstances; use hands-free or pull over safely.',
      'Recording & photography: Prior consent from all parties is legally required; surreptitious recording constitutes grounds for immediate termination and criminal prosecution.',
      'BYOD standards: Must meet OS support, full encryption, screen locks, zero jailbreaking/rooting, and MDM installation with remote wipe consent.',
      'IoT: Smart speakers and voice assistants with recording capability are banned in areas where confidential discussions occur; wearables cannot record corporate secrets.'
    ],
    fullText: `Device Management and Telecommunications

Company-Issued Device Security
Company-issued computing devices are configured with required security software that must remain installed and operational. Security software includes endpoint protection, encryption, mobile device management agents, other security agents and monitoring tools. Users must not attempt to remove, disable, or circumvent security controls.
Lost or stolen devices must be reported to IT Security immediately (within one hour of discovery). IT Security will assess the need for remote device wipe to protect company data. The decision to remotely wipe a device will be based on the sensitivity of data present, the likelihood of recovery, and the risk of unauthorized access.

Telecommunications and Mobile Device Use
Personal use of company-issued mobile devices should be limited and occur primarily during non-working hours. Personal use must not interfere with job responsibilities. Company mobile devices may not be used for personal hotspot/tethering. International calling for personal purposes on company landlines or company-issued mobile devices is prohibited.
While operating vehicles, employees should refrain from using mobile devices for business communications when possible. If use is necessary, employees must comply with all Applicable state and local laws. Texting while driving is prohibited under all circumstances. Employees should utilize hands-free methods or, preferably, safely park before using mobile devices.

Recording and Photography
Audio or video recording requires prior consent from all parties being recorded. Recording is prohibited in locations where individuals have a reasonable expectation of privacy (restrooms, changing areas, private offices). Recording of confidential business discussions, trade secrets, or proprietary information without authorization is prohibited.
Surreptitious recording in violation of wiretap laws constitutes grounds for immediate termination and may result in criminal prosecution. Sharing of recorded audio, video, or photographs containing sensitive information requires management Approval and must use Approved secure transmission methods.

Personal Device Use for Business (BYOD)
Personal device use for business is permitted but limited in functionality. Stewart reserves the right to change access controls for non-Stewart-issued devices at any time.
Personal devices used to access Stewart's email or business Applications must meet minimum security requirements, including: a current, supported operating system; device encryption enabled; a screen lock with strong authentication; and no unauthorized modifications such as jailbreaking or rooting. Users may be required to install mobile device management software. Upon separation from employment, Stewart may remotely remove company data from personal devices.

Internet of Things (IoT) Devices
Personal IoT devices with audio recording capability (voice-activated assistants, smart speakers) are prohibited in areas where confidential discussions occur. Wearable devices (smartwatches, fitness trackers) must not be used to record, photograph, or transmit confidential information. Personal IoT devices may not be connected to Stewart's corporate network without IT Security Approval.`
  },
  {
    id: 'stewart-sec-07',
    number: 7,
    title: 'Network Access and Remote Connectivity',
    page: 'Pages 7 - 8',
    summary: 'Regulates remote connectivity via Approved VPN/Citrix VDI, home wireless WPA3/WPA2 standards, public Wi-Fi risks, rogue network equipment prohibitions, and privileged admin jump boxes.',
    keyDirectives: [
      'Remote access must use Approved tools only: Stewart VPN client or Citrix VDI with multi-factor authentication.',
      'Mandatory VPN: When accessing Stewart resources from potentially unsecured networks (home, public Wi-Fi, hotels), VPN connection is required.',
      'Home Wi-Fi standards: WPA3 encryption (or WPA2 minimum), strong non-default router password, current firmware, and isolated guest network for IoT/personal devices.',
      'Public Wi-Fi: Users must connect to Stewart VPN prior to accessing resources; avoid accessing highly sensitive information on public Wi-Fi.',
      'Network prohibitions: Strictly no unauthorized network gear (routers, switches, rogue APs), no personal VPNs/proxies, no traffic interception, no port scanning, no bridging.',
      'Administrative access: Restricted to authorized IT staff via dedicated privileged workstations/jump hosts, separate admin credentials, and higher-tier MFA.'
    ],
    fullText: `Network Access and Remote Connectivity

Remote Access Requirements
Remote access to Stewart systems must use only Approved methods: Stewart-provided VPN client, Citrix Virtual Desktop Infrastructure, web-based Applications with multi-factor authentication, or other methods explicitly Approved by IT Security. All remote access requires multi-factor authentication.
When accessing Stewart resources from potentially unsecured networks (home, public Wi-Fi, hotels), users must connect through Stewart's VPN to encrypt communications and protect data. Direct access to Stewart resources from public networks without VPN is prohibited.

Home Network Security
Employees working remotely must ensure home wireless networks meet minimum security standards: WPA3 encryption enabled (or WPA2 if WPA3 is unavailable), a strong Wi-Fi password configured (not the default router password), router firmware kept up to date, and, ideally, separate guest networks for personal and IoT devices.

Public Wireless Network Use
Public wireless networks in coffee shops, airports, hotels, and similar venues are inherently insecure. Users must connect to Stewart's VPN before accessing any Stewart resources when using public Wi-Fi. Even with VPN protection, access to highly sensitive information should be avoided on public networks when possible.

Network Security Prohibitions
The following activities are strictly prohibited: installing or operating unauthorized network equipment (routers, switches, wireless access points); creating unauthorized wireless networks or rogue access points; using personal VPN, proxy, or anonymization services to obscure activities; intercepting or monitoring network traffic; conducting port scanning or network reconnaissance; connecting unauthorized personal network equipment to Stewart infrastructure; or bridging Stewart networks to external networks.

Administrative Access
Administrative access to network infrastructure is restricted to authorized IT personnel. Administrative activities must be conducted from dedicated, privileged-access workstations or jump hosts, must be logged and monitored, and require separate administrative credentials and additional multi-factor authentication beyond standard user access.
Access to administrative interfaces for web Applications, remote management tools, or network infrastructure from personal or non-Stewart-managed devices is prohibited.`
  },
  {
    id: 'stewart-sec-08',
    number: 8,
    title: 'Cloud Services and Application Management',
    page: 'Pages 8 - 9',
    summary: 'Bans Shadow IT, details the formal cloud procurement Approval process, prohibits consumer cloud storage, bans personal messaging Apps (WhatsApp, Telegram, Signal, Discord) for business, and enforces phishing simulation testing consequences.',
    keyDirectives: [
      'Shadow IT is prohibited: Only IT Security-Approved cloud services may be used for Stewart business.',
      'Cloud Approval pipeline: Submit via ITSM; Vendor Risk Management assessment, SOC 2 Type II review, Privacy Impact Assessment for PII, and Approval from Procurement, IT Security, and Legal.',
      'Prohibited cloud storage: Personal Dropbox, Google Drive, OneDrive, iCloud, consumer file sharing (WeTransfer, SendSpace, file.io), and personal email transfers.',
      'Personal communication services (WhatsApp, Telegram, Signal, personal Slack/Discord) are strictly banned for Stewart business communications.',
      'All business data must reside in Stewart Microsoft 365 (OneDrive for Business, SharePoint, Teams) to guarantee backup, legal hold, and DLP controls.',
      'Security awareness testing: Phishing simulations conducted regularly; multiple failures trigger mandatory remedial training and manager escalation; high-risk actions lead to access restriction.'
    ],
    fullText: `Cloud Services and Application Management

Approved Cloud Services
Only IT Security-Approved cloud services may be used for Stewart’s business purposes. The IT Department maintains the current list of Approved services. Use of unauthorized cloud services—commonly referred to as "shadow IT"—creates security vulnerabilities, compliance risks, and data governance gaps.

Cloud Service Approval Process
Requests for new cloud services must be submitted through the IT service management system and include: business justification, data classification of information to be stored or processed, number of expected users, and estimated costs. All new vendors must be evaluated through Vendor Risk Management. IT Security will perform a security assessment that includes reviewing the vendor security questionnaire, examining SOC 2 Type II reports, conducting a privacy impact assessment if personally identifiable information is involved, and reviewing contracts with Legal. Final Approval requires authorization from Procurement, IT Security, and Legal.

Prohibited Cloud Storage Services
The following categories of cloud storage are prohibited for Stewart business data: personal accounts on cloud storage platforms (personal Dropbox, Google Drive, OneDrive, iCloud, etc.), consumer-grade file sharing services (WeTransfer, SendSpace, file.io), personal email for file attachment and transfer, or any cloud storage service not explicitly Approved by IT Security.

Personal Communication Services
Use of personal communication platforms for Stewart business is prohibited unless explicitly Approved by IT Security. This includes personal email accounts, personal messaging Applications (WhatsApp, Telegram, Signal), personal video conferencing accounts, and personal collaboration platforms (personal Slack workspaces, Discord servers).
Employees discovered using personal communication services for Stewart business may be required to provide written consent for third-party service providers to disclose content to Stewart. Such use may result in disciplinary action up to and including termination. Stewart may pursue Appropriate legal remedies to recover confidential information stored in unauthorized services.

Microsoft 365 as Primary Repository
All Stewart business data must reside in Approved locations within Stewart's Microsoft 365 tenant: OneDrive for Business for individual files, SharePoint for team and departmental content, or Microsoft Teams for project collaboration. This ensures proper backups, data-loss prevention controls, legal hold capability, and compliance with retention requirements.

Security Awareness Testing
Stewart conducts periodic security awareness testing, including simulated phishing campaigns, social engineering assessments, and/or physical security tests. Testing serves to assess organizational security posture, identify training gaps, and provide educational opportunities.
Multiple failures of phishing simulations within a specific period may trigger immediate remedial training. The manager will be notified of their employee’s assigned training and expected to see it completed in time.
Certain high-risk behaviors during testing (such as entering credentials on simulated phishing sites or downloading and executing attachments resembling malware) may warrant immediate escalation due to the severity of potential real-world consequences.
Users’ overall security behaviors are monitored and aggregated, and can be used to limit risky employee access to critical systems storing sensitive information.`
  },
  {
    id: 'stewart-sec-09',
    number: 9,
    title: 'Incident Reporting and Response',
    page: 'Pages 9 - 10',
    summary: 'Mandates immediate incident reporting to itsecurity@stewart.com (within 1 hr for critical, 4 hrs for others), establishes phishing reporting via Outlook button, defines unsolicited MFA prompt denial protocol, and guarantees whistleblower protection.',
    keyDirectives: [
      'Mandatory reporting to IT Security at itsecurity@stewart.com: Within 1 HOUR for critical incidents; within 4 BUSINESS HOURS for other incidents.',
      'Phishing email reporting: Use the dedicated “Report Email” button in Outlook (Desktop, Web, or Mobile).',
      'Unsolicited MFA prompts: Never Approve an MFA prompt you did not personally trigger; immediately deny and report to IT Security.',
      'Immediate employee action upon incident: Stop risky activity, disconnect network (unplug Ethernet / turn off Wi-Fi), preserve all evidence, do NOT delete files or shutdown.',
      'Never attempt self-initiated investigation or remediation; await direct coordination from IT Security personnel.',
      'Lost/stolen devices: Report within 1 hour with serial, location, data details, and police report number for remote wipe triage.',
      'Whistleblower Protection: Zero retaliation against good-faith reporters. Report concerns to HR, Legal, or EthicsPoint hotline at (866) 384-4277.'
    ],
    fullText: `Incident Reporting and Response

Mandatory Incident Reporting
Employees must immediately report suspected security incidents or events to IT Security at itsecurity@stewart.com. "Immediately" means within one hour for critical incidents and within four business hours for other incidents, from the time the user becomes aware of the issue. Any suspicious emails must be reported using the “Report Email” button in the Outlook Desktop client, Outlook for Web or Outlook for Mobile.

Reportable Incidents
Security incidents requiring immediate reporting include: lost or stolen devices containing company data, suspected malware infection or system compromise, phishing emails that were opened or acted upon, suspicious communications requesting passwords or sensitive information (including but not limited to email, chat, text or phone), unauthorized access to systems or data, inadvertent disclosure of confidential information (such as misdirected email), suspected policy violations by others, observed security vulnerabilities, unusual system behavior, or any situation that may pose security risk.
Attacks aimed at circumventing MFA are on the rise. An employee must never Approve a multi-factor unless the employee intentionally initiated the login. Any prompts for MFA that the employee did not intentionally trigger must be denied and reported to IT Security immediately.
When uncertain whether a situation constitutes a security incident, employees should err on the side of reporting. It is preferable to report a non-incident than to delay reporting an actual security event.

Incident Response Procedures
Upon discovering a potential security incident, employees should immediately: cease activities that may exacerbate the situation, disconnect affected devices from the network if safe to do so (disconnect Ethernet or disable Wi-Fi), preserve all evidence (do not delete files, clear browser history, or modify or shutdown the system), report to IT Security immediately, and await instructions from security personnel.
Employees must not attempt to investigate, remediate, or contain incidents independently. Self-initiated remediation attempts may destroy evidence or worsen the situation. All incident response activities should be coordinated by IT Security personnel.

Lost or Stolen Device Protocol
Loss or theft of company devices requires immediate notification to IT Security (within one hour), providing: device type and serial number if known, Approximate time and location of loss, circumstances of the incident, description of data stored on the device, and police report number if theft was reported to law enforcement.
IT Security will determine whether a remote device wipe is necessary based on data sensitivity, the likelihood of recovery, and the risk of harm to Stewart and/or individuals. If credentials were stored on the lost device, immediate password changes are required across all systems.

Employee Cooperation Requirements
During security investigations, employees must provide full cooperation, including: providing accurate and complete information during interviews, making devices and accounts available for examination as requested, preserving all relevant information and evidence, maintaining confidentiality regarding investigation details, and refraining from interfering with or obstructing investigation processes.
Failure to cooperate with security investigations constitutes a separate policy violation and may result in disciplinary action independent of the underlying incident.

Whistleblower Protection
Employees who report security incidents or policy violations in good faith are protected from retaliation. Stewart prohibits adverse employment actions, harassment, or intimidation against individuals who report concerns. Employees who believe they have experienced retaliation should contact Human Resources, the EthicsPoint hotline at (866) 384-4277, or the Legal Department.`
  },
  {
    id: 'stewart-sec-10',
    number: 10,
    title: 'Enforcement and Disciplinary Actions',
    page: 'Pages 10 - 12',
    summary: 'Establishes educational philosophy for good-faith mistakes, outlines 4 distinct violation categories (Minor, Moderate, Severe, Critical) and progressive consequences, defines mitigating/aggravating factors, and mandates strict CISO exception criteria.',
    keyDirectives: [
      'Enforcement philosophy: Education and correction for honest mistakes; proportionate progressive discipline for intentional or repeated disregard.',
      'Minor Violations (brief unlocked screen, non-sensitive doc misplacement): 1st verbal -> 2nd written -> 3rd formal personnel warning -> 4th suspension/termination.',
      'Moderate Violations (password sharing, unApproved cloud storage, unauthorized BYOD, overdue training, phishing failures): 1st written warning + training -> 2nd final warning + probation -> 3rd termination.',
      'Severe Violations (bypassing controls, rogue VPN, unauthorized access, tampering with EDR/logs, feeding Confidential info to AI): Immediate suspension, likely termination, civil referral.',
      'Critical Violations (data theft/exfiltration, deploying malware, selling trade secrets, fraud, backdoor creation, evidence tampering, whistleblower retaliation): Immediate termination, criminal prosecution, law enforcement referral, and civil litigation.',
      'Mitigating factors: First-time offense, self-reporting, full cooperation, no actual harm. Aggravating: Intentionality, prior infractions, concealment, actual harm.',
      'Exceptions require: Written justification, IT Security risk assessment, CISO Approval, documented risk acceptance, and strict expiration date.'
    ],
    fullText: `Enforcement and Disciplinary Actions

Enforcement Philosophy and Objectives
This policy exists to protect Stewart, its employees, and its customers from security threats and operational risks. Most policy violations result from unintentional errors or a lack of understanding. Stewart's Approach to enforcement emphasizes education and correction for good-faith mistakes while imposing Appropriate consequences for intentional violations or repeated disregard of security requirements.

Violation Categories and Consequences
Violations are categorized by severity, intent, and potential impact. Disciplinary responses are proportionate to the nature and severity of the violation.

• Minor Violations represent unintentional or negligent actions that create minimal risk. Examples include: briefly failing to lock an unattended workstation in a secure area, storing a non-sensitive document in an unApproved location, installing pre-Approved software without following formal request procedures, or brief excess personal use that does not affect productivity.
Progressive discipline for minor violations: first occurrence results in verbal counseling and training; second occurrence results in a written warning; third occurrence results in a formal written warning documented in the personnel file; fourth occurrence may result in suspension or termination.

• Moderate Violations demonstrate disregard for policy requirements or create moderate risk. Examples include: sharing passwords with colleagues, using unApproved cloud storage services for work files, connecting personal devices to corporate networks without authorization, failing to complete required security training beyond grace periods, downloading unauthorized software, excessive personal use affecting work performance, failing to report security incidents within required timeframes, or multiple phishing simulation failures.
Progressive discipline for moderate violations: first occurrence results in a written warning, mandatory training, and possible suspension; second occurrence results in a final written warning, suspension, and probationary period; third occurrence results in termination.

• Severe Violations involve intentional circumvention of security controls or actions that create significant organizational risk. Examples include: deliberately bypassing security controls or access restrictions, installing unauthorized VPN, proxy, or anonymization software, accessing systems or data without authorization, tampering with security software or system logs, using Stewart resources for illegal activities, deliberately sharing confidential information externally without Approval, inputting Confidential or Internal information into public AI tools, conducting unauthorized security testing or penetration testing, or sharing network credentials with unauthorized third parties.
Severe violations typically result in immediate suspension pending investigation, likely termination of employment, and potential referral to Legal for civil action.

• Critical Violations warrant immediate termination without prior warning. Examples include: intentional theft or exfiltration of Stewart data with intent to harm or benefit personally, deploying malware or conducting attacks against Stewart systems, selling or disclosing confidential information to competitors or unauthorized parties, accessing systems to commit fraud, embezzlement, or theft, creating backdoors or persistent unauthorized access mechanisms, destroying or tampering with evidence during investigations, retaliating against individuals who report security concerns or violations, or providing false or misleading information during security investigations.
Critical violations may additionally result in criminal prosecution, referral to law enforcement, civil litigation to recover damages, reporting to relevant regulatory authorities, and forfeiture of certain benefits to the extent permitted by law.

Factors Affecting Disciplinary Decisions
When determining Appropriate consequences, management considers multiple factors, including:
Mitigating factors that may reduce consequences: first-time offense, self-reporting of the violation, full cooperation with the investigation, no actual harm resulting from the violation, demonstrated good-faith effort to comply with policy, immediate corrective actions taken, and exemplary prior employment record.
Aggravating factors that may increase consequences: intentional or willful violation, prior violations of any security policy, attempts to conceal or cover up the violation, actual harm to Stewart or third parties, failure to report the violation when discovered, lack of cooperation with investigation, or abuse of privileged or trusted access.

Policy Exceptions
Exceptions to this policy may be granted only under extraordinary circumstances. Exception requests require: written business justification, a risk assessment conducted by IT Security, CISO Approval, documented risk acceptance, and a time limit with a specified expiration date.
Exceptions are granted rarely, and only where a compelling business need exists that cannot be addressed through Approved alternatives. Compensating controls must be implemented where feasible to mitigate risks associated with exceptions.`
  }
];

export const HANDBOOK_VECTORS: ThreatVectorGuide[] = [
  {
    id: 'stewart-sec-01',
    aliases: ['typosquat-npm-packages'],
    sectionNumber: 1,
    title: 'Information Classification & Acceptable Use',
    category: 'Information Classification',
    riskLevel: 'HIGH',
    targetAudienceNote: 'Section 1 Mandate: Adhere to Public, Internal Use, and Confidential tiers; separate personal and Stewart credentials strictly.',
    audioSignature: {
      name: 'Unauthorized Data Classification Ingress',
      acousticProfile: '520Hz Pulse Tone with Periodic Credential Check Strobe',
      decibelLevel: '78 dB SPL (Compliance Priority)',
      sirenTone: 'HIGH',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Classification Failure & Credential Reuse',
        actor: 'Employee / Contractor',
        description: 'Shares internal operational schemas publicly or registers for a personal external web service using a Stewart corporate email address and password.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Credential Stuffing & Data Leak',
        actor: 'External Threat Actor / Scraper',
        description: 'Third-party site breach exposes Stewart credentials; automated botnets attempt credential stuffing across corporate portals.'
      },
      {
        phase: 'Blast Radius',
        title: 'Unauthorized Stewart Perimeter Access',
        actor: 'Adversary Network',
        description: 'Confidential business data exposed; mandatory immediate company-wide password revocation and audit logging initiated.'
      }
    ],
    codeComparison: {
      language: 'policy',
      badCode: `// ❌ INSECURE: Reusing Stewart Corporate Account for Personal Services\nEmail: jsmith@stewart.com\nPassword: Summer2026!Stewart (same as internal SSO)\nService: Personal travel booking & consumer subscription forum`,
      badLabel: 'Violates Section 1: Credential Intermingling',
      badReason: 'A compromise of the external service instantly gives attackers valid credentials to attack Stewart systems.',
      goodCode: `// ✅ COMPLIANT: Strict Credential Separation\nStewart SSO: jsmith@stewart.com | [16+ Char Complex via Enterprise Password Manager]\nPersonal Accounts: jsmith.personal@gmail.com | [Independent master key]\nZero password overlap across corporate & personal domains.`,
      goodLabel: 'Compliant Section 1 Separation',
      goodReason: 'Adheres to Stewart mandate: Stewart email/passwords never registered on personal services.'
    },
    quiz: {
      question: 'Under Stewart Information Classification standards, when is incidental personal use of company equipment permitted?',
      options: [
        'At any time, including streaming Netflix during business hours as long as your tasks are done.',
        'Primarily during non-working hours (breaks, lunch, before/after work), provided it has manager Approval, consumes minimal resources, and does not violate policy.',
        'Never under any circumstances; company laptops cannot even be touched during lunch.',
        'Whenever you connect your personal hotspot to the company device.'
      ],
      correctIndex: 1,
      explanation: 'Per Section 1 (Acceptable Personal Use), incidental personal use is allowed during non-working hours with manager Approval, provided it consumes minimal resources and avoids prohibited activities like streaming during business hours or tethering.'
    },
    howBreachOccurs: {
      summary: 'Misclassifying Confidential documents or reusing corporate credentials across external consumer web platforms enables rapid unauthorized exfiltration.',
      commonScenarios: [
        'Using Stewart corporate email to register on coupon, gaming, or personal shopping sites.',
        'Sending unencrypted customer financial records or employee personal data to external unApproved parties.',
        'Streaming video/audio entertainment during business hours, degrading corporate network bandwidth.',
        'Posting internal company policies or organizational charts to public social media groups.'
      ],
      mechanics: 'Third-party consumer breaches leak database dumps. Attackers run automated dictionaries against enterprise portals, succeeding whenever passwords match.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Regulatory fines, reputational impairment, loss of customer trust, and operational disruption.',
      dataAtRisk: 'Customer personal information, financial records, employee PII, and internal proprietary workflows.',
      legalOrCompliance: 'Violation of state privacy regulations, GLBA, and Stewart contractual confidentiality agreements.'
    },
    howToPrevent: {
      goldenRules: [
        'Maintain absolute separation between Stewart accounts and personal accounts.',
        'Encrypt all Confidential information before transmitting outside Stewart’s network.',
        'Never install unauthorized software, proxy tools, or attempt to circumvent security controls.'
      ],
      ApprovedAlternatives: [
        'Stewart Enterprise Password Manager',
        'Built-in Outlook Encryption',
        'Zix Email Encryption Gateway'
      ],
      doList: [
        'Classify all documents as Public, Internal Use, or Confidential.',
        'Ensure personal social media posts explicitly state views are your own and not Stewart’s.',
        'Limit personal use to non-working hours with manager Approval.'
      ],
      dontList: [
        'Never reuse Stewart business passwords for personal online accounts.',
        'Never stream video or audio during business hours.',
        'Never use company mobile devices for personal hotspot/tethering.'
      ]
    }
  },
  {
    id: 'stewart-sec-02',
    aliases: ['git-secrets-code'],
    sectionNumber: 2,
    title: 'Information Protection Standards',
    category: 'Information Protection',
    riskLevel: 'CRITICAL',
    targetAudienceNote: 'Section 2 Mandate: Lock devices when stepping away; store business files in M365 (OneDrive/SharePoint/Teams); never tamper with security software.',
    audioSignature: {
      name: 'Physical & Endpoint Tamper Alarm',
      acousticProfile: '640Hz Strobe Pulse + Endpoint Heartbeat Check',
      decibelLevel: '85 dB SPL (High Priority)',
      sirenTone: 'CRITICAL',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Unattended Workstation / Personal Cloud Sync',
        actor: 'Employee',
        description: 'Steps away from workstation in an open area without locking, or copies confidential files to a personal Google Drive or unencrypted USB stick.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Physical Ingress or Sync Exfiltration',
        actor: 'Unauthorized Visitor / Shadow IT Crawler',
        description: 'Unattended screen provides instant access to financial records; unApproved cloud sync bypasses corporate data loss prevention.'
      },
      {
        phase: 'Blast Radius',
        title: 'DLP Violation & Immediate Disciplinary Action',
        actor: 'Stewart IT Security / SOC',
        description: 'Workstation quarantined; tampering with security agents triggers immediate employment termination protocol.'
      }
    ],
    codeComparison: {
      language: 'storage-config',
      badCode: `// ❌ INSECURE: Storing Stewart files in Personal Cloud\nSync-Path: ~/Personal-Google-Drive/Stewart-Customer-Records/\nBackup: Personal Dropbox auto-sync enabled\nScreen-Lock: "Never lock when stepping out for coffee"`,
      badLabel: 'Violates Section 2: UnApproved Storage',
      badReason: 'Storing business data on personal cloud services circumvents corporate legal hold, DLP, and encryption controls.',
      goodCode: `// ✅ COMPLIANT: Stewart Microsoft 365 Tenant Storage\nIndividual Files: Stewart OneDrive for Business (Managed)\nTeam Collaboration: Stewart SharePoint with Zix / Outlook Encryption\nAuto-Lock: 15-minute system timeout + Immediate manual Win+L / Cmd+Ctrl+Q`,
      goodLabel: 'Compliant Section 2 Standard',
      goodReason: 'Ensures centralized audit logs, automated backups, and access control governance.'
    },
    quiz: {
      question: 'What is the policy consequence if an employee deliberately disables, tampers with, or attempts to remove security software (antivirus, EDR, DLP)?',
      options: [
        'A verbal reminder during their next quarterly review.',
        'A minor fine deducted from their travel allowance.',
        'Constitutes grounds for immediate termination of employment.',
        'Mandatory assignment to install extra RAM on server racks.'
      ],
      correctIndex: 2,
      explanation: 'Per Section 2 (Software Installation and Management): "Tampering with, disabling, or attempting to remove security software (antivirus, endpoint detection and response, data loss prevention, or monitoring agents) constitutes grounds for immediate termination."'
    },
    howBreachOccurs: {
      summary: 'Leaving workstations unlocked, storing work data in personal cloud accounts, or attempting to shut off security agents compromises endpoint defense.',
      commonScenarios: [
        'Leaving a laptop unlocked on a desk while taking a 20-minute coffee break.',
        'Storing customer transaction files on personal Dropbox or Google Drive to work from home.',
        'Attempting to kill EDR or antivirus background processes to speed up a local compile.',
        'Leaving confidential financial documents exposed on office whiteboards or desks overnight.'
      ],
      mechanics: 'Physical access allows anyone passing by to view or extract data. Personal cloud services lack Stewart DLP, MFA enforcement, and retention compliance.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Uncontrolled data leakage, loss of SOC 2 certification, and potential civil liability.',
      dataAtRisk: 'Confidential customer files, internal financial ledgers, and trade secrets.',
      legalOrCompliance: 'Regulatory non-compliance, breach of customer NDAs, and termination of employment.'
    },
    howToPrevent: {
      goldenRules: [
        'Lock your computer manually every single time you step away, even for 30 seconds.',
        'Store ALL business information exclusively in Stewart’s Microsoft 365 tenant.',
        'Never attempt to disable or uninstall security agents or monitoring tools.'
      ],
      ApprovedAlternatives: [
        'Stewart OneDrive for Business',
        'Stewart SharePoint Online',
        'Stewart Microsoft Teams'
      ],
      doList: [
        'Manually lock your device (Win+L / Cmd+Ctrl+Q) when leaving your seat.',
        'Clear whiteboards and desks of sensitive documents before leaving the work area.',
        'Obtain written IT Security Approval before installing any software or browser extension.'
      ],
      dontList: [
        'Never store work-related data on personal cloud drives (Dropbox, personal Drive, iCloud).',
        'Never leave laptops or portable devices visible inside an unattended vehicle.',
        'Never bypass dual Approval requirements for financial accounting systems access.'
      ]
    }
  },
  {
    id: 'stewart-sec-03',
    aliases: ['aitm-phishing-mfa'],
    sectionNumber: 3,
    title: 'Authentication & Access Management',
    category: 'Authentication & Access',
    riskLevel: 'CRITICAL',
    targetAudienceNote: 'Section 3 Mandate: Minimum 16-character passwords; phish-resistant MFA mandatory; least privilege access model.',
    audioSignature: {
      name: 'Adversary-in-the-Middle Authentication Beacon',
      acousticProfile: '440Hz / 880Hz Dual Tone with FIDO2 WebAuthn Verification Pulse',
      decibelLevel: '90 dB SPL (Critical Alert)',
      sirenTone: 'CRITICAL',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'MFA Fatigue / Browser Password Storage',
        actor: 'Employee',
        description: 'Saves passwords in consumer browser autofill or receives unsolicited push notification prompts late at night.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Session Hijacking / Credential Capture',
        actor: 'AiTM Phishing Proxy',
        description: 'Adversary uses reverse proxy to harvest session cookies and bypass non-phish-resistant authentication.'
      },
      {
        phase: 'Blast Radius',
        title: 'Privileged Corporate Infiltration',
        actor: 'Attacker Group',
        description: 'Adversary accesses enterprise cloud services; mitigated only when hardware phish-resistant MFA is strictly enforced.'
      }
    ],
    codeComparison: {
      language: 'auth-policy',
      badCode: `// ❌ INSECURE: Weak password & Browser Storage\nPassword: "Password123!" (11 chars, dictionary word)\nStorage: Saved in Google Chrome browser password autofill\nMFA Response: Approved unexpected push alert at 11:30 PM`,
      badLabel: 'Violates Section 3 Standards',
      badReason: 'Browser password managers are vulnerable to malware info-stealers; Approving unexpected MFA allows session takeover.',
      goodCode: `// ✅ COMPLIANT: Stewart Section 3 Standards\nPassword: 16+ characters, uppercase, lowercase, numbers, symbols\nStorage: Stewart enterprise password manager with master key & MFA\nMFA: Phish-resistant hardware security key / WebAuthn token\nRule: Reject & immediately report any unsolicited MFA prompt to IT Security`,
      goodLabel: 'Compliant Section 3 Protection',
      goodReason: 'Meets Stewart mandate of 16+ characters and phish-resistant authentication.'
    },
    quiz: {
      question: 'What are the minimum password complexity requirements for Stewart systems under Section 3?',
      options: [
        'At least 8 characters with at least one number.',
        'At least 12 characters with any combination of letters.',
        'At least 16 characters, combining uppercase, lowercase, numbers, and special characters, with no dictionary words or reused passwords.',
        'Any length, as long as it is saved in your browser’s autofill.'
      ],
      correctIndex: 2,
      explanation: 'Section 3 states: "Passwords for Stewart systems must meet minimum complexity requirements: at least 16 characters, including a combination of uppercase and lowercase letters, numbers, and special characters. Passwords must not include easily guessable or dictionary words, predictable patterns, personal information, or previously used passwords."'
    },
    howBreachOccurs: {
      summary: 'Weak or reused passwords, browser storage, and falling victim to MFA prompt bombing allows adversaries to hijack corporate sessions.',
      commonScenarios: [
        'Approving an authenticator push notification that popped up when you were not actively logging in.',
        'Saving corporate passwords in browser autofill where info-stealer trojans can siphon them in seconds.',
        'Sharing an administrative login with a colleague to complete an urgent ticket.',
        'Writing down passwords on sticky notes attached to monitors or in unsecured local text files.'
      ],
      mechanics: 'Adversaries harvest credentials via phishing and trigger repeated MFA push notifications. Phish-resistant hardware tokens prevent this attack vector entirely.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Unrestricted perimeter access, corporate email compromise, and unauthorized wire transfers.',
      dataAtRisk: 'All cloud enterprise Applications, customer escrow data, and employee identity records.',
      legalOrCompliance: 'Severe regulatory breach disclosure mandates, audit failures, and potential civil penalties.'
    },
    howToPrevent: {
      goldenRules: [
        'Always use passwords of at least 16 characters with complex characters.',
        'Stewart requires phish-resistant authentication as the only Approved MFA standard.',
        'NEVER Approve an MFA prompt you did not personally and intentionally trigger.'
      ],
      ApprovedAlternatives: [
        'Stewart Enterprise Password Manager',
        'FIDO2 Hardware Security Keys (YubiKey)',
        'Phish-Resistant Authenticator Apps'
      ],
      doList: [
        'Use at least 16 characters with numbers, symbols, and mixed case.',
        'Deny and immediately report any unexpected MFA prompts to itsecurity@stewart.com.',
        'Follow least privilege: request only the minimum access needed for your job.'
      ],
      dontList: [
        'Never write down passwords or store them in browser password managers.',
        'Never share your credentials with colleagues, contractors, or IT personnel.',
        'Never reuse passwords across personal and business systems.'
      ]
    }
  },
  {
    id: 'stewart-sec-04',
    aliases: ['ownership-monitoring-privacy'],
    sectionNumber: 4,
    title: 'Ownership, Monitoring, and Privacy',
    category: 'Ownership & Privacy',
    riskLevel: 'HIGH',
    targetAudienceNote: 'Section 4 Mandate: Zero expectation of privacy; Stewart monitors all corporate resources; all data is Stewart property.',
    audioSignature: {
      name: 'System Audit & Telemetry Sweep',
      acousticProfile: 'Continuous 300Hz Low-Pass Resonance with Audit Trail Sync',
      decibelLevel: '72 dB SPL (System Telemetry)',
      sirenTone: 'HIGH',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Storing Personal Files on Work Systems',
        actor: 'Employee',
        description: 'Stores personal tax documents, sensitive photos, or private communications on company laptops with the expectation of privacy.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Audit Review / Termination Archival',
        actor: 'Corporate Audit / E-Discovery',
        description: 'Routine logging, incident investigations, or employee transitions index and review all communications on company systems.'
      },
      {
        phase: 'Blast Radius',
        title: 'Personal Data Disclosure & Property Retention',
        actor: 'Stewart Systems Administration',
        description: 'Company exercises legal ownership; all data retained or deleted without notice upon employment conclusion.'
      }
    ],
    codeComparison: {
      language: 'legal-directive',
      badCode: `// ❌ MISCONCEPTION: Assuming Privacy on Work Machines\nUser: "I can store personal tax returns on my Stewart laptop because it's in my personal folder."\nAction: Demanding privacy from IT monitoring during an incident investigation.`,
      badLabel: 'Violates Section 4 Governance',
      badReason: 'Stewart systems are private corporate resources; employees have zero legal expectation of privacy.',
      goodCode: `// ✅ COMPLIANT: Complete Separation of Personal Life\nWork Device: Strictly Stewart business documents and authorized data.\nPersonal Life: Managed exclusively on personal devices and personal cloud.\nUnderstanding: Stewart may monitor, copy, review, and disclose all system data.`,
      goodLabel: 'Compliant Section 4 Understanding',
      goodReason: 'Recognizes Stewart property ownership and corporate monitoring rights.'
    },
    quiz: {
      question: 'What expectation of privacy do users have when using Stewart information systems, email, and networks?',
      options: [
        'Full privacy, protected by standard employee confidentiality.',
        'Users have NO expectation of privacy; Stewart reserves the right to monitor, access, review, and disclose any information at any time without notice.',
        'Privacy Applies only to emails marked "Personal" in the subject line.',
        'Privacy is guaranteed after normal business hours.'
      ],
      correctIndex: 1,
      explanation: 'Section 4 explicitly establishes: "Stewart Information systems are private corporate resources, not public forums. Users have no expectation of privacy when using Stewart systems. Stewart reserves the right to monitor, access, review, copy, store, and disclose any information or communications on its systems at any time without prior notice."'
    },
    howBreachOccurs: {
      summary: 'Failing to recognize that all information created or stored on Stewart resources is company property leads to data conflicts and legal exposure.',
      commonScenarios: [
        'Storing personal medical or financial documents on company OneDrive.',
        'Using corporate email for personal dispute communications.',
        'Failing to return corporate laptops or access badges immediately upon termination.',
        'Attempting to access Stewart systems after resigning or being separated.'
      ],
      mechanics: 'Stewart continuous monitoring logs emails, web browsing, instant messages, and Application usage in real time for business and legal compliance.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Legal discovery exposure, regulatory audit sanctions, and property recovery costs.',
      dataAtRisk: 'Corporate communications, intellectual property, and internal records.',
      legalOrCompliance: 'Immediate return of property is legally binding; post-termination access results in civil or criminal prosecution.'
    },
    howToPrevent: {
      goldenRules: [
        'Recognize that all data on Stewart systems belongs exclusively to Stewart.',
        'Never store personal files or communications on company computers or cloud tenants.',
        'Immediately return all company equipment, credentials, and cards upon termination.'
      ],
      ApprovedAlternatives: [
        'Personal Cloud Storage on Personal Devices',
        'Independent Personal Email Accounts'
      ],
      doList: [
        'Keep all personal files strictly on personal hardware.',
        'Understand that all emails, chats, and browsing are logged and auditable.',
        'Surrender all company devices and access badges immediately upon separation.'
      ],
      dontList: [
        'Never expect privacy when using Stewart email, internet, or computing systems.',
        'Never retain Stewart data on personal devices after employment ends.',
        'Never attempt to log in to Stewart systems following contract or employment termination.'
      ]
    }
  },
  {
    id: 'stewart-sec-05',
    aliases: ['genai-llm-leaks'],
    sectionNumber: 5,
    title: 'Artificial Intelligence & Emerging Technologies',
    category: 'AI & Machine Learning',
    riskLevel: 'CRITICAL',
    targetAudienceNote: 'Section 5 Mandate: NEVER input Internal or Confidential information into public AI tools (ChatGPT, Claude, Gemini, Perplexity, public Copilot).',
    audioSignature: {
      name: 'Neural Model Exfiltration Alarm',
      acousticProfile: '466Hz Tritone Dissonance + 2.4kHz Token Scraping Sweep',
      decibelLevel: '86 dB SPL (Critical Threat)',
      sirenTone: 'CRITICAL',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Prompt Ingestion of Sensitive Data',
        actor: 'Employee / Internee',
        description: 'Pastes customer records, source code, database connection strings, or financial spreadsheets into public ChatGPT to draft a summary.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Model Absorption & Third-Party Retention',
        actor: 'Public AI Infrastructure & Crawlers',
        description: 'Input tokens enter external vendor log retention queues and potential fine-tuning pipelines outside Stewart’s control.'
      },
      {
        phase: 'Blast Radius',
        title: 'Permanent Corporate IP & Customer PII Leak',
        actor: 'Adversary Extraction / Model Training',
        description: 'Confidential business processes, customer data, or security keys become permanently discoverable or exposed in public completions.'
      }
    ],
    codeComparison: {
      language: 'typescript',
      badCode: `// ❌ INSECURE: Pasting Stewart Customer Data into Public AI\n// Prompt pasted into public ChatGPT:\nconst prompt = \`Summarize this customer escrow file:\nCustomer: John Doe, SSN: 123-45-6789, Escrow Balance: $450,000\nStewart Account No: STW-991204\`;`,
      badLabel: 'Violates Section 5: Public AI Ingestion',
      badReason: 'Submits live customer PII and financial records to public AI vendors that retain and learn from prompt data.',
      goodCode: `// ✅ COMPLIANT: Generic Public Research & Sanitized Workflows\n// Public AI permitted ONLY for generic learning on public topics:\nconst prompt = "Explain the difference between OAuth 2.0 and SAML 2.0 protocols in simple terms.";\n// Internal/Confidential data: Processed ONLY via Approved Enterprise AI solutions.`,
      goodLabel: 'Compliant Section 5 AI Usage',
      goodReason: 'Zero customer or proprietary information transmitted to public third-party models.'
    },
    quiz: {
      question: 'Which of the following information types is PERMITTED to be entered into public AI tools like ChatGPT, Claude, or Gemini under Stewart policy?',
      options: [
        'Customer data and employee personally identifiable information.',
        'Stewart proprietary source code and technical architecture diagrams.',
        'Publicly available topics for research and general learning with no Stewart confidential data.',
        'Draft strategic business plans and financial performance metrics.'
      ],
      correctIndex: 2,
      explanation: 'Section 5 specifies that public AI may only be used for research on publicly available topics, general learning, or drafting assistance with generic public information. Entering customer data, PII, source code, financial metrics, or strategic plans is strictly prohibited.'
    },
    howBreachOccurs: {
      summary: 'Entering confidential business information into public AI models sends proprietary data outside corporate boundaries where it may be retained or exposed.',
      commonScenarios: [
        'Pasting customer transaction lists into ChatGPT to format into an Excel table.',
        'Uploading internal codebases or database schemas to public Claude to debug errors.',
        'Asking Perplexity to summarize an internal NDA-protected partner agreement.',
        'Using unApproved public AI plugins in consumer web browsers.'
      ],
      mechanics: 'Public AI vendors log prompts to server clusters. Unless protected by explicit enterprise agreements, inputs may be used for model evaluation or training.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Severe breach of non-disclosure agreements, customer lawsuits, and loss of intellectual property.',
      dataAtRisk: 'Customer PII, proprietary code, financial ledgers, trade secrets, and legal work product.',
      legalOrCompliance: 'Violates privacy laws (GDPR, CCPA), financial disclosure rules, and Stewart customer contracts.'
    },
    howToPrevent: {
      goldenRules: [
        'NEVER input Internal or Confidential information into public AI tools.',
        'Use public AI strictly for generic research and skills development on public topics.',
        'Always validate and review AI-generated content before using it for business purposes.'
      ],
      ApprovedAlternatives: [
        'Approved Stewart Enterprise AI Solutions',
        'Sanctioned Internal Development Gateways',
        'Generic Public Documentation & Learning'
      ],
      doList: [
        'Use public AI only for publicly available learning concepts.',
        'Review and take personal accountability for any AI-assisted business output.',
        'Identify material substantially created by AI where relevant to context.'
      ],
      dontList: [
        'Never paste customer data or employee PII into any public chatbot.',
        'Never upload Stewart source code, architecture schemas, or financial data to public AI.',
        'Never input legal documents, trade secrets, or vendor confidential information into AI tools.'
      ]
    }
  },
  {
    id: 'stewart-sec-06',
    aliases: ['untrusted-usb-devices'],
    sectionNumber: 6,
    title: 'Device Management & Telecommunications',
    category: 'Device Management',
    riskLevel: 'HIGH',
    targetAudienceNote: 'Section 6 Mandate: Report lost/stolen devices within 1 HOUR; no texting while driving; wiretap/recording consent laws; BYOD standards.',
    audioSignature: {
      name: 'Lost Device & Remote Wipe Siren',
      acousticProfile: 'Dual Tone Frequency Shift 600Hz-1200Hz with Strobe Beacon',
      decibelLevel: '82 dB SPL (Hardware Alert)',
      sirenTone: 'HIGH',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Lost Device / Unreported Theft',
        actor: 'Employee',
        description: 'Leaves company laptop in a car in plain view or fails to report a missing phone immediately.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Delayed Notification & Physical Attack',
        actor: 'Physical Thief / Adversary',
        description: 'Because reporting was delayed past the 1-hour window, IT Security cannot trigger an immediate remote wipe before device is taken offline.'
      },
      {
        phase: 'Blast Radius',
        title: 'Unauthorized Data Extraction',
        actor: 'Adversary',
        description: 'Physical storage extracted; credentials dumped; mandatory breach disclosures triggered.'
      }
    ],
    codeComparison: {
      language: 'device-policy',
      badCode: `// ❌ INSECURE: Delayed Loss Notification & Mobile Misuse\nEvent: Laptop stolen from car backseat at 8:00 PM\nAction: "I'll wait until Monday morning 9:00 AM to tell IT helpdesk."\nMobile: Using company phone as personal hotspot for family streaming.`,
      badLabel: 'Violates Section 6 Protocols',
      badReason: 'Violates the mandatory 1-hour reporting window; hotspot misuse consumes company resources.',
      goodCode: `// ✅ COMPLIANT: Immediate 1-Hour Loss Reporting\nAction: Immediately notify itsecurity@stewart.com within 1 hour.\nDetails provided: Serial number, location, circumstances, data description.\nIT Security Response: Assesses and executes instant remote wipe.\nMobile Driving: Zero texting while driving; hands-free only or safely parked.`,
      goodLabel: 'Compliant Section 6 Protocol',
      goodReason: 'Enables rapid remote wipe and prevents unauthorized perimeter intrusion.'
    },
    quiz: {
      question: 'Within what timeframe must an employee report a lost or stolen company device to IT Security under Section 6?',
      options: [
        'Within 24 hours of returning to the office.',
        'Immediately, within ONE HOUR of discovery.',
        'By the end of the current work week.',
        'Only after a formal police report has been filed and mailed.'
      ],
      correctIndex: 1,
      explanation: 'Section 6 explicitly mandates: "Lost or stolen devices must be reported to IT Security immediately (within one hour of discovery). IT Security will assess the need for remote device wipe to protect company data."'
    },
    howBreachOccurs: {
      summary: 'Failing to secure physical equipment, ignoring the 1-hour reporting window, texting while driving, or using unauthorized recording devices creates acute liability.',
      commonScenarios: [
        'Leaving a laptop bag in clear view on a car seat while dining.',
        'Waiting until the next business day to report a lost corporate smartphone.',
        'Texting or typing emails on a mobile phone while driving a vehicle.',
        'Recording meetings or conversations without the consent of all participants (wiretap violation).'
      ],
      mechanics: 'Lost devices allow physical attacks against local drives. Surreptitious recording violates state and federal wiretap statutes, resulting in immediate termination and criminal charges.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Severe regulatory penalties, physical hardware theft costs, and potential criminal prosecution.',
      dataAtRisk: 'Local cached credentials, email archives, and customer documents stored on the endpoint.',
      legalOrCompliance: 'State wiretap statute violations, vehicle safety violations, and contractual breach notifications.'
    },
    howToPrevent: {
      goldenRules: [
        'Report lost or stolen devices to IT Security within ONE HOUR of discovery.',
        'Texting while driving is prohibited under all circumstances.',
        'Audio/video recording requires prior consent from all parties.'
      ],
      ApprovedAlternatives: [
        'Immediate IT Security Notification (itsecurity@stewart.com)',
        'Hands-Free Mobile Driving Sets',
        'Official Stewart Mobile Device Management (MDM)'
      ],
      doList: [
        'Report lost or stolen devices immediately with serial, time, and circumstances.',
        'Safely park before conducting mobile phone communications while traveling.',
        'Ensure BYOD personal devices meet current OS, encryption, and screen lock rules.'
      ],
      dontList: [
        'Never leave laptops or devices visible in unattended vehicles.',
        'Never record conversations in private areas or without consent of all parties.',
        'Never connect personal IoT smart speakers to the corporate network.'
      ]
    }
  },
  {
    id: 'stewart-sec-07',
    aliases: ['remote-connectivity-vpn'],
    sectionNumber: 7,
    title: 'Network Access & Remote Connectivity',
    category: 'Network & Remote Access',
    riskLevel: 'HIGH',
    targetAudienceNote: 'Section 7 Mandate: Mandatory VPN on unsecured/public Wi-Fi; home network WPA3/WPA2 standards; no rogue access points.',
    audioSignature: {
      name: 'Rogue Network Access Point Detection',
      acousticProfile: '580Hz Frequency Hopping Sweep + Packet Sniff Intercept',
      decibelLevel: '79 dB SPL (Network Perimeter Alert)',
      sirenTone: 'HIGH',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Direct Connection to Public Wi-Fi Without VPN',
        actor: 'Remote Employee',
        description: 'Connects company laptop to an unencrypted coffee shop or hotel Wi-Fi and accesses internal portals without launching the Stewart VPN.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Man-in-the-Middle Network Sniffing',
        actor: 'Attacker on Same Wi-Fi',
        description: 'Adversary operates a rogue access point (Evil Twin) to intercept unencrypted packets and redirect DNS queries.'
      },
      {
        phase: 'Blast Radius',
        title: 'Traffic Eavesdropping & Token Extraction',
        actor: 'Network Adversary',
        description: 'Session tokens and internal hostnames captured; compromised credentials leveraged for network traversal.'
      }
    ],
    codeComparison: {
      language: 'network-config',
      badCode: `// ❌ INSECURE: Direct Public Wi-Fi Access & Rogue Gear\nNetwork: "Starbucks_Guest_Free" (No password, unencrypted)\nStewart VPN: Disabled / Disconnected\nHome Router: Default admin password, WEP encryption, no firmware updates\nRogue Gear: Plugged personal Wi-Fi router into office wall Ethernet jack`,
      badLabel: 'Violates Section 7 Security',
      badReason: 'Exposes unencrypted packets to eavesdropping; rogue equipment bridges internal Stewart network.',
      goodCode: `// ✅ COMPLIANT: Stewart Mandatory VPN & Secure Home Wi-Fi\nPublic Network: Connect to Stewart VPN BEFORE accessing any resources\nHome Network: WPA3 (or WPA2) enabled, strong unique password, updated router firmware\nGuest Network: IoT and personal devices isolated from work laptop\nGear: Strictly authorized IT equipment; zero rogue APs or personal proxies`,
      goodLabel: 'Compliant Section 7 Architecture',
      goodReason: 'Ensures all communications across public networks are fully encrypted via corporate tunnel.'
    },
    quiz: {
      question: 'When accessing Stewart resources from a public wireless network (such as a coffee shop, airport, or hotel), what is required under Section 7?',
      options: [
        'Nothing, modern browsers are secure enough without extra protection.',
        'Users must connect through Stewart’s VPN before accessing any Stewart resources.',
        'Only check email, but avoid accessing internal financial databases.',
        'Users must disable their firewall to speed up connectivity.'
      ],
      correctIndex: 1,
      explanation: 'Section 7 mandates: "Public wireless networks in coffee shops, airports, hotels, and similar venues are inherently insecure. Users must connect to Stewart\'s VPN before accessing any Stewart resources when using public Wi-Fi."'
    },
    howBreachOccurs: {
      summary: 'Connecting to untrusted public Wi-Fi without VPN encryption or plugging rogue access points into corporate ports exposes traffic to eavesdropping.',
      commonScenarios: [
        'Working from an airport gate without connecting to Stewart VPN.',
        'Using weak WEP or default administrative passwords on home remote routers.',
        'Installing unauthorized personal Wi-Fi repeaters in corporate branch offices.',
        'Using personal VPN or proxy services to obscure activity on company laptops.'
      ],
      mechanics: 'Rogue access points capture traffic passing over public radio frequencies. Encrypted VPN tunnels wrap all traffic in cryptographically secure IPsec/SSL layers.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Network compromise, lateral movement across corporate VPCs, and data interception.',
      dataAtRisk: 'Internal hostnames, transit session tokens, and intranet portal contents.',
      legalOrCompliance: 'Non-compliance with financial data transmission standards and PCI-DSS requirements.'
    },
    howToPrevent: {
      goldenRules: [
        'Always connect to Stewart VPN when on public, hotel, or home wireless networks.',
        'Ensure home routers use WPA3 or WPA2 encryption and strong unique passwords.',
        'Never install rogue networking hardware, personal VPNs, or proxy software.'
      ],
      ApprovedAlternatives: [
        'Stewart GlobalProtect / Corporate VPN Client',
        'Citrix Virtual Desktop Infrastructure (VDI)',
        'MFA-Protected Web Portals'
      ],
      doList: [
        'Launch Stewart VPN immediately upon joining any Wi-Fi network outside the office.',
        'Update home router firmware regularly and set a strong Wi-Fi password.',
        'Maintain a separate guest Wi-Fi network at home for personal and IoT devices.'
      ],
      dontList: [
        'Never access Stewart resources over public Wi-Fi without active VPN.',
        'Never connect personal routers, switches, or access points to Stewart infrastructure.',
        'Never conduct port scanning, packet sniffing, or network reconnaissance.'
      ]
    }
  },
  {
    id: 'stewart-sec-08',
    aliases: ['cloud-share-dlp'],
    sectionNumber: 8,
    title: 'Cloud Services & Application Management',
    category: 'Cloud & Applications',
    riskLevel: 'HIGH',
    targetAudienceNote: 'Section 8 Mandate: Shadow IT prohibited; ban on personal messaging (WhatsApp, Telegram, Signal, Discord) for business; M365 primary repository.',
    audioSignature: {
      name: 'Shadow IT Cloud Ingress Siren',
      acousticProfile: '750Hz Pulsed Warble with Cloud DLP Sync',
      decibelLevel: '80 dB SPL (Cloud Perimeter Warning)',
      sirenTone: 'HIGH',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Shadow IT Adoption / Personal Messaging Use',
        actor: 'Employee / Project Team',
        description: 'Creates a project chat on personal WhatsApp/Telegram or signs up for an unApproved consumer cloud service (WeTransfer, personal Dropbox) to move files.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Governance Void & Data Exfiltration',
        actor: 'Unvetted Vendor / External Adversary',
        description: 'UnApproved cloud provider lacks SOC 2 compliance and DLP controls; communications are stored beyond Stewart legal hold capability.'
      },
      {
        phase: 'Blast Radius',
        title: 'Contractual Breach & Termination Risk',
        actor: 'Stewart Compliance & Legal',
        description: 'Employee subject to disciplinary action; company must petition third-party providers to recover confidential data.'
      }
    ],
    codeComparison: {
      language: 'cloud-policy',
      badCode: `// ❌ INSECURE: Shadow IT & Personal Messaging for Business\nCommunication: "Hey team, let's discuss this customer closing on WhatsApp."\nFile Sharing: Uploading escrow packet to WeTransfer / personal SendSpace\nCollaboration: Storing project files on an unauthorized personal Slack workspace`,
      badLabel: 'Violates Section 8 Mandate',
      badReason: 'Bypasses corporate data retention, DLP filters, legal holds, and security monitoring.',
      goodCode: `// ✅ COMPLIANT: Stewart Microsoft 365 Centralized Tenant\nIndividual Files: OneDrive for Business\nTeam Collaboration: Stewart SharePoint Online\nProject Comms: Stewart Microsoft Teams (Monitored & Archived)\nNew Cloud Tool: Submit ITSM request for Vendor Risk, SOC 2, and Legal review`,
      goodLabel: 'Compliant Section 8 Standard',
      goodReason: 'Guarantees automatic backups, version control, legal hold compliance, and SOC 2 adherence.'
    },
    quiz: {
      question: 'Which of the following communication platforms is Approved for conducting Stewart business communications without prior written IT Security authorization?',
      options: [
        'Personal WhatsApp messaging groups.',
        'Personal Telegram or Signal chats.',
        'Stewart’s corporate Microsoft 365 environment (Teams, Outlook).',
        'Personal Discord servers or personal Slack workspaces.'
      ],
      correctIndex: 2,
      explanation: 'Section 8 strictly prohibits personal messaging Applications (WhatsApp, Telegram, Signal), personal email, and personal collaboration platforms (personal Slack, Discord) for Stewart business, mandating Microsoft 365 (Teams, SharePoint, OneDrive) as the primary corporate repository.'
    },
    howBreachOccurs: {
      summary: 'Adopting Shadow IT tools or conducting corporate business on personal messaging Apps bypasses compliance, backup, and security visibility.',
      commonScenarios: [
        'Discussing sensitive customer transactions over personal WhatsApp or Signal.',
        'Using WeTransfer or file.io to bypass email attachment size limits.',
        'Setting up an unauthorized cloud SaaS tool on a departmental corporate credit card.',
        'Failing repeated simulated phishing tests conducted by IT Security.'
      ],
      mechanics: 'Consumer cloud tools lack enterprise encryption keys, SOC 2 Type II validation, and audit trail APIs required for legal compliance and breach defense.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Massive compliance fines, loss of corporate record retention, and inability to satisfy legal discovery.',
      dataAtRisk: 'Customer transactions, executive strategy, and project roadmaps.',
      legalOrCompliance: 'Spoliation of evidence under federal court rules, vendor contract violations, and regulatory fines.'
    },
    howToPrevent: {
      goldenRules: [
        'Use only IT Security-Approved cloud services for Stewart business.',
        'Conduct all team collaboration inside Stewart’s Microsoft 365 tenant.',
        'Never use personal messaging Apps (WhatsApp, Signal, Telegram) for company work.'
      ],
      ApprovedAlternatives: [
        'Microsoft Teams for Business',
        'SharePoint Online',
        'OneDrive for Business'
      ],
      doList: [
        'Submit requests for new cloud services through the IT service management system.',
        'Participate diligently in periodic phishing awareness tests.',
        'Store all corporate project files in Approved SharePoint and OneDrive locations.'
      ],
      dontList: [
        'Never use consumer file sharing (WeTransfer, SendSpace, file.io) for work data.',
        'Never conduct business over personal WhatsApp, Telegram, or Signal.',
        'Never enter company credentials into simulated phishing sites or untrusted portals.'
      ]
    }
  },
  {
    id: 'stewart-sec-09',
    aliases: ['social-engineering-bec'],
    sectionNumber: 9,
    title: 'Incident Reporting and Response',
    category: 'Incident Reporting',
    riskLevel: 'CRITICAL',
    targetAudienceNote: 'Section 9 Mandate: Mandatory reporting to itsecurity@stewart.com (1 hr critical / 4 hrs other); Outlook Report Email button; EthicsPoint (866) 384-4277.',
    audioSignature: {
      name: 'Critical Incident Rapid Triage Siren',
      acousticProfile: '800Hz / 1600Hz Alternating Emergency Klaxon',
      decibelLevel: '94 dB SPL (Emergency Dispatch)',
      sirenTone: 'CRITICAL',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Suspected Incident / Phishing Click / Missing Device',
        actor: 'Employee / Internee',
        description: 'Accidentally clicks an attachment in a phishing email, notices unusual system behavior, or loses a laptop.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Speed of Escalation vs Concealment',
        actor: 'Security Operations Center (SOC)',
        description: 'When reported immediately within 1 hour, SOC isolates the host, revokes tokens, and blocks C2 traffic before exfiltration occurs.'
      },
      {
        phase: 'Blast Radius',
        title: 'Containment vs Catastrophic Compromise',
        actor: 'IT Security Incident Team',
        description: 'Immediate reporting neutralizes attack in minutes; concealed incidents expand into enterprise-wide ransomware or mass data theft.'
      }
    ],
    codeComparison: {
      language: 'incident-procedure',
      badCode: `// ❌ INSECURE: Concealment or Self-Remediation\nEvent: Clicked suspicious email attachment; system fan spinning loudly\nWrong Action 1: "I'll run CCleaner and clear my browser history." (Destroys forensic evidence)\nWrong Action 2: Keeping quiet out of fear of getting in trouble.\nWrong Action 3: Approving unexpected MFA prompts to make the phone stop buzzing.`,
      badLabel: 'Violates Section 9 Procedures',
      badReason: 'Self-remediation destroys forensic artifacts; concealment turns a minor containment into a catastrophic breach.',
      goodCode: `// ✅ COMPLIANT: Stewart Mandatory Incident Response\n1. CEASE activities immediately.\n2. DISCONNECT affected device from network (unplug Ethernet / turn off Wi-Fi).\n3. PRESERVE evidence (do NOT delete files, history, or shut down).\n4. REPORT immediately: itsecurity@stewart.com | Within 1 HOUR (critical).\n5. PHISHING: Click "Report Email" button in Outlook.\n6. WHISTLEBLOWER: Zero retaliation. EthicsPoint hotline: (866) 384-4277.`,
      goodLabel: 'Compliant Section 9 Protocol',
      goodReason: 'Guarantees rapid containment and protects good-faith reporting under whistleblower rules.'
    },
    quiz: {
      question: 'When an employee discovers a potential security incident, what are the first immediate steps required under Section 9?',
      options: [
        'Reboot the computer, format the hard drive, and re-install Windows.',
        'Cease activities, disconnect the device from the network (unplug Ethernet/turn off Wi-Fi), preserve all evidence, and report immediately to itsecurity@stewart.com.',
        'Call colleagues on Slack to see if their computers are behaving strangely too.',
        'Post about the anomaly on LinkedIn to seek technical advice.'
      ],
      correctIndex: 1,
      explanation: 'Section 9 mandates: "Upon discovering a potential security incident, employees should immediately: cease activities that may exacerbate the situation, disconnect affected devices from the network if safe to do so (disconnect Ethernet or disable Wi-Fi), preserve all evidence (do not delete files, clear browser history, or modify or shutdown the system), report to IT Security immediately, and await instructions from security personnel."'
    },
    howBreachOccurs: {
      summary: 'Delaying incident notification or trying to hide/remediate an attack independently allows adversaries to establish persistence across the corporate perimeter.',
      commonScenarios: [
        'Clicking an unknown macro attachment and closing the laptop hoping nothing hAppened.',
        'Receiving unsolicited MFA prompts and Approving them just to silence notifications.',
        'Deleting event logs or running registry cleaners after suspecting malware.',
        'Failing to report a misdirected confidential email sent to an external recipient.'
      ],
      mechanics: 'Adversaries rely on delayed reporting. Rapid host network isolation prevents command-and-control communication and lateral credential dumping.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Uncontained ransomware deployment, operational shutdown, and multi-million dollar recovery costs.',
      dataAtRisk: 'All corporate databases, Active Directory forest, and customer escrow accounts.',
      legalOrCompliance: 'Mandatory state and federal breach notifications with strict statutory deadlines.'
    },
    howToPrevent: {
      goldenRules: [
        'Report suspected incidents to itsecurity@stewart.com immediately (within 1 hour for critical).',
        'Use the “Report Email” button in Outlook for any suspicious emails.',
        'Disconnect from the network and preserve evidence; never attempt independent remediation.'
      ],
      ApprovedAlternatives: [
        'IT Security Incident Desk (itsecurity@stewart.com)',
        'Outlook “Report Email” Plugin',
        'EthicsPoint Whistleblower Hotline: (866) 384-4277'
      ],
      doList: [
        'Report immediately: err on the side of reporting even if uncertain.',
        'Disconnect Ethernet and disable Wi-Fi immediately upon noticing suspicious activity.',
        'Cooperate fully and transparently with security investigation personnel.'
      ],
      dontList: [
        'Never delete files, clear browser caches, or shut down a compromised machine.',
        'Never attempt self-initiated remediation or containment independently.',
        'Never Approve an MFA prompt you did not intentionally initiate.'
      ]
    }
  },
  {
    id: 'stewart-sec-10',
    aliases: ['enforcement-disciplinary-actions'],
    sectionNumber: 10,
    title: 'Enforcement and Disciplinary Actions',
    category: 'Enforcement & Discipline',
    riskLevel: 'CRITICAL',
    targetAudienceNote: 'Section 10 Mandate: Progressive discipline for good-faith errors; immediate termination for critical/severe circumvention; CISO exception process.',
    audioSignature: {
      name: 'Disciplinary Escalation & Compliance Klaxon',
      acousticProfile: '900Hz Square Wave Alert with Legal Hold Strobe',
      decibelLevel: '88 dB SPL (Compliance Enforcement)',
      sirenTone: 'CRITICAL',
    },
    anatomySteps: [
      {
        phase: 'Trigger',
        title: 'Policy Violation (Minor, Moderate, Severe, or Critical)',
        actor: 'Individual',
        description: 'Engages in an action that violates Stewart security policy, ranging from failing to lock a workstation to intentional data exfiltration.'
      },
      {
        phase: 'Exploit Pipeline',
        title: 'Triage, Intent Evaluation & Investigation',
        actor: 'Management, IT Security & HR',
        description: 'Evaluates severity tier, assesses mitigating factors (self-reporting, cooperation) versus aggravating factors (concealment, malice).'
      },
      {
        phase: 'Blast Radius',
        title: 'Proportionate Disciplinary Enforcement',
        actor: 'Stewart Executive Committee / Legal',
        description: 'Applies progressive discipline (counseling -> written warning -> suspension -> termination -> legal prosecution).'
      }
    ],
    codeComparison: {
      language: 'enforcement-matrix',
      badCode: `// ❌ AGGRAVATING BEHAVIOR: Concealment & Willful Circumvention\nAction: Deliberately installed unauthorized VPN to bypass DLP controls.\nResponse: Attempted to hide logs and lied during the internal security interview.\nOutcome: CRITICAL VIOLATION -> Immediate termination, criminal referral, forfeiture of benefits.`,
      badLabel: 'Critical Violation Path',
      badReason: 'Intentional circumvention and concealment eliminates good-faith corrective opportunities.',
      goodCode: `// ✅ MITIGATING BEHAVIOR: Honest Mistake & Immediate Self-Reporting\nAction: Accidentally sent an internal spreadsheet to the wrong recipient.\nResponse: Immediately reported to itsecurity@stewart.com within 15 minutes; fully cooperated.\nOutcome: MINOR VIOLATION with Mitigating Factors -> Verbal counseling and corrective coaching.`,
      goodLabel: 'Good-Faith Corrective Path',
      goodReason: 'Stewart enforcement philosophy emphasizes education and correction for good-faith, self-reported errors.'
    },
    quiz: {
      question: 'Which violation category under Section 10 warrants immediate termination of employment without prior progressive warnings?',
      options: [
        'Minor Violations, such as briefly forgetting to lock a workstation in a secure office.',
        'Moderate Violations, such as missing an initial deadline for annual compliance training.',
        'Critical Violations, such as intentional data exfiltration, deploying malware, selling trade secrets, or retaliating against whistleblowers.',
        'Any violation of any kind.'
      ],
      correctIndex: 2,
      explanation: 'Section 10 categorizes violations into Minor, Moderate, Severe, and Critical. Critical Violations (intentional theft/exfiltration of Stewart data, deploying malware, selling data to competitors, fraud, backdoor creation, evidence tampering, or whistleblower retaliation) warrant immediate termination without prior warning, as well as criminal and civil referral.'
    },
    howBreachOccurs: {
      summary: 'Intentional circumvention of security controls, willful disregard of policies, or concealment of infractions triggers severe disciplinary and legal remedies.',
      commonScenarios: [
        'Minor: Briefly failing to lock a workstation or brief excess personal use.',
        'Moderate: Sharing passwords with a coworker or using unApproved cloud storage.',
        'Severe: Deliberately installing unauthorized VPN/proxy software or inputting Confidential data into public AI.',
        'Critical: Stealing company data, deploying exploits, tampering with evidence, or retaliating against someone who reported a breach.'
      ],
      mechanics: 'Stewart weighs mitigating factors (self-reporting, first-time offense, cooperation) and aggravating factors (willful malice, concealment, repeated infractions) in all disciplinary actions.'
    },
    downstreamBlastRadius: {
      businessImpact: 'Organizational instability, employment termination, and civil litigation.',
      dataAtRisk: 'Entire Stewart data perimeter and employee personnel records.',
      legalOrCompliance: 'Criminal prosecution, law enforcement referral, and regulatory reporting.'
    },
    howToPrevent: {
      goldenRules: [
        'Self-report mistakes immediately: prompt reporting is the primary mitigating factor.',
        'Never attempt to conceal or cover up a policy violation or security incident.',
        'Policy exceptions require written justification, IT Security risk assessment, and CISO Approval.'
      ],
      ApprovedAlternatives: [
        'IT Security Exception Request via ITSM',
        'CISO Formal Risk Acceptance Process',
        'EthicsPoint Reporting Hotline: (866) 384-4277'
      ],
      doList: [
        'Report accidental violations immediately to benefit from good-faith corrective policies.',
        'Provide 100% truthful, complete cooperation during any security investigation.',
        'Follow formal exception procedures with CISO sign-off before deviating from policy.'
      ],
      dontList: [
        'Never retaliate against an employee who reports a security concern in good faith.',
        'Never provide false or misleading information during an internal investigation.',
        'Never attempt to bypass security controls or install unauthorized anonymization tools.'
      ]
    }
  }
];

export const ZERO_BLAME_POLICY = {
  title: 'Stewart IT Security Enforcement & Whistleblower Protection',
  tagline: 'Education and correction for good-faith mistakes; strict zero-retaliation for prompt incident reporting.',
  principles: [
    {
      title: 'Prompt Reporting is Mitigating and Protected',
      description: 'Stewart’s Approach emphasizes education and correction for good-faith mistakes. Immediate self-reporting is an explicit mitigating factor that reduces disciplinary consequences.',
    },
    {
      title: 'Strict Whistleblower Retaliation Ban',
      description: 'Employees who report security incidents or policy violations in good faith are strictly protected from adverse employment actions, harassment, or intimidation.',
    },
    {
      title: 'Concealment and Malice are Strictly Punished',
      description: 'Disciplinary escalation (suspension, termination, criminal prosecution) is reserved for intentional circumvention, repeated disregard, or concealing known incidents.',
    },
  ],
  emergencyContacts: [
    { channel: 'IT Security Incident Email', handle: 'itsecurity@stewart.com', responseTime: '< 1 hour (Critical) / 4 hours (Other)' },
    { channel: 'Outlook Email Client', handle: '“Report Email” Button', responseTime: 'Instant SOC Phishing Triage' },
    { channel: 'EthicsPoint Whistleblower Hotline', handle: '(866) 384-4277 (Toll-Free 24/7)', responseTime: 'Independent Confidential Hotline' },
  ],
};

export const HANDBOOK_MARKDOWN_EXPORT = `# Information Technology Security and Usage
**Document Version:** v7.0  
**Last Revised:** 04/01/2026  
**Publisher:** Stewart Information Services Corporation  
**Copyright:** ©Stewart Information Services Corporation 2026

---

## Table of Contents
1. [Information Classification and Acceptable Use](#1-information-classification-and-acceptable-use) (Page 1)
2. [Information Protection Standards](#2-information-protection-standards) (Page 3)
3. [Authentication and Access Management](#3-authentication-and-access-management) (Page 4)
4. [Ownership, Monitoring, and Privacy](#4-ownership-monitoring-and-privacy) (Page 4)
5. [Artificial Intelligence and Emerging Technologies](#5-artificial-intelligence-and-emerging-technologies) (Page 5)
6. [Device Management and Telecommunications](#6-device-management-and-telecommunications) (Page 6)
7. [Network Access and Remote Connectivity](#7-network-access-and-remote-connectivity) (Page 7)
8. [Cloud Services and Application Management](#8-cloud-services-and-Application-management) (Page 8)
9. [Incident Reporting and Response](#9-incident-reporting-and-response) (Page 9)
10. [Enforcement and Disciplinary Actions](#10-enforcement-and-disciplinary-actions) (Page 10)

---

## Policy Scope
This policy Applies to all individuals who access Stewart resources, including employees (full-time, part-time, and temporary), contractors, consultants, vendors, and third parties. It governs the use of all devices—whether company-issued or personal—that access Stewart systems, networks, data, or facilities. While this policy refers to an “employee” throughout the document, it is Applicable in its entirety to all others with access to Stewart systems, resources, or data.

---

${STEWART_POLICY_SECTIONS.map((section) => `
### ${section.number}. ${section.title}
*Location in Official Policy: ${section.page}*

${section.fullText}

#### Key Directives:
${section.keyDirectives.map((d) => `- ${d}`).join('\n')}

---
`).join('\n')}

## Emergency Contacts & Reporting
- **IT Security Incident Email:** \`itsecurity@stewart.com\` (Mandatory reporting within 1 hour for critical incidents, 4 business hours for others)
- **Outlook Phishing Reporting:** Use the \`Report Email\` button in Outlook Desktop, Web, or Mobile
- **EthicsPoint Whistleblower Hotline:** \`(866) 384-4277\` (Confidential 24/7)
- **Legal Department & Human Resources:** Available for confidential whistleblower reports
`;
