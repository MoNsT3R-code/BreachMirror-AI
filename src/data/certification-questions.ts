import { ComprehensiveQuizQuestion } from '../shared-types';

export const COMPREHENSIVE_QUIZ_QUESTIONS: ComprehensiveQuizQuestion[] = [
  // =========================================================================
  // PDF 1: Stewart Information Technology Security and Usage Policy (v7.0)
  // SECTIONS 1 - 10
  // =========================================================================
  {
    id: 'quiz-sec-01',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 1',
    pageCitation: 'Pages 1 - 3',
    topicTitle: 'Information Classification & Acceptable Personal Use',
    question: 'Under Stewart’s 3-tier Information Classification framework, which category of information requires encryption whenever it is transmitted outside the company network and mandates dual managerial authorization for external dissemination?',
    options: [
      'Public Information (e.g., promotional press releases, published brochures)',
      'Internal Use Information (e.g., standard organizational charts, departmental memos)',
      'Confidential Information (e.g., customer PII, escrow records, financial reports, strategic business plans)',
      'Any non-proprietary marketing draft shared over standard personal email'
    ],
    correctIndex: 2,
    explanation: 'Section 1 explicitly mandates that Confidential Information requires protection due to its sensitive nature. Unauthorized disclosure could cause serious harm or violate regulations. It must be encrypted whenever transmitted outside the company network and shared only with documented business need and Appropriate Approvals.',
    policyDirectives: [
      'Public Information may be shared freely; Internal Use is restricted to Stewart operational personnel.',
      'Confidential Information mandates encryption outside the Stewart network and documented Approval.',
      'Personal use of Stewart systems is permitted only during non-working hours with manager consent, and strictly prohibits video/audio streaming during work hours, gambling, or commercial ventures.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-02',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 2',
    pageCitation: 'Pages 3 - 4',
    topicTitle: 'Data Protection & Authorized Cloud Storage',
    question: 'An employee needs to work on a title settlement spreadsheet while traveling over the weekend. Which storage method complies with Stewart’s Data Protection Policy?',
    options: [
      'Uploading the customer closing spreadsheet to a personal Google Drive account for convenient mobile access',
      'Saving the spreadsheet to Stewart-managed OneDrive or SharePoint within the corporate Microsoft 365 tenant',
      'Syncing the folder with a personal Dropbox account using a web browser',
      'Attaching the unencrypted settlement file to a personal Gmail address to review on a home iPad'
    ],
    correctIndex: 1,
    explanation: 'Section 2 designates corporate OneDrive and SharePoint within Stewart’s Microsoft 365 tenant as the sole Approved repositories for corporate documents and customer data. Transferring or syncing company data to personal cloud storage (Google Drive, Dropbox, iCloud, Box) is strictly prohibited.',
    policyDirectives: [
      'Corporate OneDrive and SharePoint are the only Approved cloud repositories.',
      'Synchronization with personal cloud storage accounts is strictly forbidden.',
      'Confidential customer data must remain within the boundary of Stewart-monitored environments.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-03',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 3',
    pageCitation: 'Pages 4 - 6',
    topicTitle: 'Authentication, Phish-Resistant MFA & AiTM Threats',
    question: 'Which of the following statements reflects Stewart’s mandatory authentication standard and password security directive?',
    options: [
      'Sharing credentials with an IT technician or direct supervisor is permitted during urgent closing emergencies',
      'Phish-resistant Multi-Factor Authentication (MFA) is mandatory for accessing Stewart resources, and credential reuse across personal accounts is strictly prohibited',
      'Employees may reuse their Stewart domain password on external real estate partner portals if the password is at least 14 characters long',
      'SMS-based authentication codes can be forwarded to assistants if designated in writing'
    ],
    correctIndex: 1,
    explanation: 'Section 3 establishes that Phish-resistant MFA is required for all individuals accessing Stewart resources to defend against Adversary-in-the-Middle (AiTM) attacks. Credentials must never be shared under any circumstances—even with IT staff or supervisors—and passwords must never be reused across personal and corporate accounts.',
    policyDirectives: [
      'Phish-resistant MFA is mandatory for all Stewart system access.',
      'Credentials must never be shared under any circumstances (including with IT or supervisors).',
      'Password reuse across personal and business accounts is expressly forbidden.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-04',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 4',
    pageCitation: 'Pages 6 - 7',
    topicTitle: 'Device Ownership, Return & Privacy Expectations',
    question: 'What is Stewart’s legal policy regarding personal data stored on company-issued laptops, phones, and email servers?',
    options: [
      'Employees retain complete privacy rights over any personal files kept in a folder labeled "Personal" on their desktop',
      'Stewart owns all equipment, data, emails, and files; employees have no expectation of privacy on any Stewart resource, and access is revoked immediately upon separation',
      'Stewart will archive and mail an employee all personal photos and emails following resignation',
      'Monitoring software may only be activated if an employee gives written consent each week'
    ],
    correctIndex: 1,
    explanation: 'Section 4 states that all devices, hardware, networks, data, and electronic communications are the exclusive property of Stewart. Users have no expectation of privacy regarding their use of Stewart resources. Upon termination or separation, all devices must be returned immediately, and access is terminated without delay.',
    policyDirectives: [
      'All equipment, files, and communications are Stewart property.',
      'No expectation of privacy on any Stewart device, network, or communication system.',
      'Upon separation, all physical devices must be returned immediately, and credentials are decommissioned.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-05',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 5',
    pageCitation: 'Pages 7 - 8',
    topicTitle: 'Artificial Intelligence (AI) & Escrow Data Protection',
    question: 'A title examiner wants to summarize a 40-page purchase agreement containing customer Social Security numbers, escrow figures, and property legal descriptions. How must this task be handled under Section 5?',
    options: [
      'Paste the agreement into free public ChatGPT or Claude because it speeds up closing turnaround times',
      'Use only Stewart-Approved enterprise AI solutions, ensuring customer escrow data, PII, and financial information are NEVER entered into public, unvetted AI tools',
      'Upload the contract into any online PDF AI summarizer as long as the browser is in incognito mode',
      'Shorten the buyer’s name to initials before uploading the full unredacted wire routing numbers to a public generative AI'
    ],
    correctIndex: 1,
    explanation: 'Section 5 strictly forbids pasting customer PII, escrow figures, wire details, or confidential Stewart property records into public, unvetted AI models or chatbots. Only Stewart-sanctioned enterprise AI platforms with strict data escrow safeguards may be utilized, following review by the Stewart AI Council.',
    policyDirectives: [
      'Confidential customer data and PII must never be entered into public generative AI tools.',
      'Only Stewart-Approved AI systems evaluated by the Stewart AI Council are authorized.',
      'Incognito mode does not protect prompts from being ingested by public AI training pipelines.'
    ],
    contactOrAction: 'AICouncil@stewart.com'
  },
  {
    id: 'quiz-sec-06',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 6',
    pageCitation: 'Pages 8 - 9',
    topicTitle: 'Physical Endpoint Security & Lost Laptop Reporting Window',
    question: 'While dining at a café, an employee’s company laptop bag is stolen from their vehicle. What is the mandatory protocol under Section 6?',
    options: [
      'Wait 48 hours to see if local police find the vehicle before bothering the company security operations center',
      'Report the loss or theft within ONE (1) hour to itsecurity@stewart.com so IT can initiate remote encryption verification and device wipe protocols',
      'Attempt to locate the laptop using a third-party consumer "Find My" App on a personal device without alerting Stewart',
      'Buy a replacement laptop from an electronics store and restore work files from a flash drive'
    ],
    correctIndex: 1,
    explanation: 'Section 6 requires that any lost or stolen Stewart device (laptop, tablet, smartphone) must be reported within ONE (1) hour of discovery to itsecurity@stewart.com. Rapid reporting enables IT Security to execute remote cryptographic locks and data wipe commands before disk encryption can be attacked.',
    policyDirectives: [
      'Mandatory 1-hour reporting window for any lost or stolen company device.',
      'Workstation screens must be locked (Windows+L / Cmd+Ctrl+Q) whenever leaving a desk.',
      'Clean desk policy requires physical documents and sensitive files to be locked in drawers.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-07',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 7',
    pageCitation: 'Pages 9 - 10',
    topicTitle: 'Network & Remote Access Security',
    question: 'When an employee works remotely from an airport lounge or hotel with open public Wi-Fi, what security control is mandatory before accessing Stewart email or systems?',
    options: [
      'Using an unauthorized commercial proxy or split-tunneling service to bypass security inspection',
      'Connecting through Stewart’s corporate Virtual Private Network (VPN) to ensure all traffic is securely encrypted',
      'Connecting directly without VPN as long as websites display the HTTPS padlock icon in the browser',
      'Sharing the company cellular phone’s tethering hotspot with other travelers'
    ],
    correctIndex: 1,
    explanation: 'Section 7 mandates that all remote access from public or untrusted Wi-Fi networks (hotels, airports, coffee shops) must route through Stewart’s Approved corporate VPN. Split-tunneling and unauthorized proxies are strictly prohibited, and tethering company-paid phones for non-business devices is barred.',
    policyDirectives: [
      'Corporate VPN is mandatory when connecting from public or untrusted Wi-Fi networks.',
      'Split-tunneling, unauthorized proxies, and VPN circumvention are strictly forbidden.',
      'Company mobile hotspot/tethering is reserved exclusively for authorized business needs.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-08',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 8',
    pageCitation: 'Pages 10 - 11',
    topicTitle: 'Cloud, Applications & Shadow IT (WhatsApp Ban)',
    question: 'A real estate broker asks an escrow officer to send closing settlement statements via WhatsApp because it is faster on their phone. How must the escrow officer respond under Section 8?',
    options: [
      'Agree and send the PDFs over WhatsApp as long as they are deleted from chat history afterwards',
      'Politely decline and use Stewart-Approved communications channels (corporate Outlook/Teams), because unApproved messaging Apps like WhatsApp and Telegram are strictly banned for Stewart business',
      'Install a WhatsApp web desktop extension on the Stewart laptop without IT Approval',
      'Send screenshots of the closing figures through consumer social media direct messages'
    ],
    correctIndex: 1,
    explanation: 'Section 8 strictly prohibits the use of unauthorized Applications, unApproved software, and consumer messaging platforms (such as WhatsApp, Telegram, or WeChat) for conducting Stewart business or transmitting client documentation. All software must undergo formal IT procurement and security evaluation.',
    policyDirectives: [
      'Consumer messaging Apps (WhatsApp, Telegram, Signal) are strictly prohibited for company communications.',
      'Only IT-Approved software and browser extensions may be installed on company endpoints.',
      'All customer closing files and records must flow through authorized corporate channels.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-09',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 9',
    pageCitation: 'Pages 11 - 12',
    topicTitle: 'Incident Reporting & Zero-Blame Non-Punitive Window',
    question: 'An employee mistakenly clicks on an email link that Appears to be from Microsoft 365, enters their domain password, and realizes moments later that the URL was a deceptive phishing site. What should the employee do?',
    options: [
      'Immediately delete the browser history, power off the laptop, and hope IT security does not notice',
      'Immediately report the event within ONE (1) hour to itsecurity@stewart.com; under Stewart’s zero-blame policy, honest mistakes reported promptly are treated constructively without disciplinary penalties',
      'Try to run a third-party antivirus cleaner downloaded from the internet to clean the machine silently',
      'Wait until end-of-month review to report the event to their team manager'
    ],
    correctIndex: 1,
    explanation: 'Section 9 highlights Stewart’s commitment to a Zero-Blame security culture: employees who make an honest mistake (like falling for a realistic phishing attack) will NOT face disciplinary consequences if they report the incident immediately within the 1-hour window to itsecurity@stewart.com. Prompt reporting allows IT to revoke session tokens and prevent lateral movement.',
    policyDirectives: [
      'Mandatory 1-hour incident reporting window to itsecurity@stewart.com.',
      'Zero-Blame culture protects employees who promptly report honest errors or suspected compromises.',
      'Never attempt self-remediation, log deletion, or concealment.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },
  {
    id: 'quiz-sec-10',
    sourceDoc: 'IT_SECURITY_POLICY_V7',
    sourceTitle: 'Information Technology Security & Usage Policy (v7.0)',
    sectionOrPillar: 'Section 10',
    pageCitation: 'Pages 12 - 13',
    topicTitle: 'Policy Enforcement, Disciplinary Actions & Whistleblower Protection',
    question: 'What are the consequences of intentional non-compliance, unauthorized credential sharing, or disabling security monitoring software at Stewart?',
    options: [
      'A verbal reminder with no permanent record or HR involvement',
      'Disciplinary actions up to and including immediate termination of employment, forfeiture of rights, and potential civil or criminal legal liability',
      'Loss of internet privileges for two business days while remaining on full salary',
      'Transfer to a remote branch without further review'
    ],
    correctIndex: 1,
    explanation: 'Section 10 establishes that compliance with IT Security Policies is a condition of employment. Willful non-compliance, disabling endpoint protection, or intentionally compromising company data subjects individuals to disciplinary action up to termination and legal prosecution.',
    policyDirectives: [
      'Compliance is mandatory for all employees, contractors, and third-party users.',
      'Violations may lead to immediate termination and legal action.',
      'Good faith reporting of violations is strictly protected against retaliation.'
    ],
    contactOrAction: 'itsecurity@stewart.com'
  },

  // =========================================================================
  // PDF 2: Stewart Our Code of Business Conduct ("INTEGRITY IS AT HOME HERE")
  // PILLARS 1 - 5 + SPEAKING UP & ETHICS
  // =========================================================================
  {
    id: 'quiz-coc-01',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 1: Integrity at Work',
    pageCitation: 'Pages 6 - 8',
    topicTitle: 'Anti-Harassment, Equal Opportunity & Mutual Respect',
    question: 'How does Stewart define its standards regarding workplace harassment, discriminatory remarks, and equal employment opportunity?',
    options: [
      'Jokes and comments regarding protected characteristics are acceptable if made off-site during casual after-work drinks',
      'Stewart has zero tolerance for harassment, discrimination, or offensive conduct of any kind; all employees are entitled to a respectful, inclusive work environment based on dignity and merit',
      'Complaints must only be submitted if multiple employees witness the incident simultaneously',
      'Only executive supervisors can be held accountable for workplace harassment'
    ],
    correctIndex: 1,
    explanation: 'Pillar 1 (Integrity at Work) states that Stewart is committed to providing an inclusive, diverse workplace free from all forms of discrimination and harassment. Offensive remarks, slurs, unwanted physical contact, or intimidation based on race, sex, sexual orientation, disability, or religion are strictly forbidden.',
    policyDirectives: [
      'Zero tolerance for discriminatory comments, microaggressions, and harassment.',
      'Equal opportunity governs all hiring, evaluation, promotion, and compensation decisions.',
      'Reports can be made confidentially to HR or the EthicsPoint hotline.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-02',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 1: Integrity at Work',
    pageCitation: 'Pages 8 - 10',
    topicTitle: 'Workplace Safety, Violence Prevention & Substance-Free Standards',
    question: 'Which of the following activities is strictly prohibited on all Stewart properties, customer settlement branches, and company-sponsored events?',
    options: [
      'Bringing licensed firearms or dangerous weapons onto company premises (except for authorized law enforcement)',
      'Possessing, using, or distributing illegal substances or unauthorized alcohol on company work premises',
      'Threatening, intimidating, or engaging in acts of violence against co-workers, clients, or visitors',
      'All of the above are strictly prohibited under Stewart’s Code of Business Conduct'
    ],
    correctIndex: 3,
    explanation: 'Pillar 1 mandates a safe, secure, and substance-free environment. Stewart strictly bans weapons, violence, threats of bodily harm, and unauthorized drug or alcohol use across all facilities, parking lots, and corporate events.',
    policyDirectives: [
      'Weapons and firearms are banned on Stewart premises.',
      'Substance-free workplace prohibits illicit drug and alcohol impairment.',
      'Any threat of violence must be reported immediately to management or corporate security.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-03',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 2: Integrity with Customers',
    pageCitation: 'Pages 11 - 13',
    topicTitle: 'RESPA Compliance & Anti-Kickback Standards',
    question: 'A mortgage loan officer promises to send all their refinance title orders to Stewart if the Stewart escrow officer pays for the lender’s upcoming marketing flyers. Under RESPA Section 8 and Stewart policy, what must the escrow officer do?',
    options: [
      'Accept the deal if the marketing flyer amount is under $500',
      'Politely refuse and report the request; RESPA Section 8 and Stewart policy strictly forbid providing anything of value (including marketing subsidies, cash, or unearned fees) in exchange for title business referrals',
      'Pay for the flyers from personal funds so company accounts are not involved',
      'Split the flyer costs with a local real estate agent to conceal the payment'
    ],
    correctIndex: 1,
    explanation: 'Under Pillar 2 (Integrity with Customers) and federal RESPA Section 8 laws, Stewart prohibits giving, offering, or receiving any referral fee, kickback, unearned portion of closing charges, or thing of value in exchange for title, escrow, or settlement services.',
    policyDirectives: [
      'RESPA Section 8 prohibits paying or receiving anything of value for customer referrals.',
      'Marketing co-op programs must reflect fair market value and comply with legal guidelines.',
      'Violations expose Stewart and individuals to criminal penalties, fines, and license revocation.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-04',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 2: Integrity with Customers',
    pageCitation: 'Pages 13 - 15',
    topicTitle: 'Fiduciary Duty: Escrow Trust Accounts & Wire Security',
    question: 'How does Stewart treat client escrow deposits, earnest money, and settlement trust funds?',
    options: [
      'Escrow funds can be temporarily transferred to the branch operational account to cover payroll during banking holidays',
      'Escrow funds are sacred fiduciary assets that must be held in segregated trust accounts, never commingled with operating funds, and disbursed strictly according to verified written instructions',
      'Wire instructions received via an unverified personal Yahoo email may be processed immediately if the closing date is today',
      'Earnest money balances may be invested in short-term speculative securities to generate interest for branch improvements'
    ],
    correctIndex: 1,
    explanation: 'Stewart’s Code emphasizes our fiduciary duty to protect customer escrow funds. Escrow and earnest money funds must be held in dedicated, segregated trust accounts, never commingled with company operating accounts, and disburse only with validated payoff and wire verification protocols.',
    policyDirectives: [
      'Escrow funds must be kept strictly segregated in authorized trust accounts.',
      'Zero commingling of customer deposits with Stewart operating revenue.',
      'Strict multi-step telephone wire verification required before releasing closing funds.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-05',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 3: Integrity with Business Partners',
    pageCitation: 'Pages 16 - 18',
    topicTitle: 'Anti-Bribery & Foreign Corrupt Practices Act (FCPA)',
    question: 'A foreign government land registry clerk requests a $250 "expediting facilitation cash fee" to process a pending title recording in an international jurisdiction. What does Stewart’s Anti-Bribery Policy mandate?',
    options: [
      'Pay the cash fee from petty cash because expediting fees are customary in some foreign markets',
      'The payment is strictly prohibited; Stewart enforces zero tolerance for bribes, kickbacks, or facilitation payments to government officials, foreign or domestic, under the FCPA and UK Bribery Act',
      'Give the clerk a Stewart promotional pen set with $250 wrApped inside',
      'Authorize a local contractor to pay the fee without recording the invoice'
    ],
    correctIndex: 1,
    explanation: 'Pillar 3 (Anti-Bribery & FCPA) prohibits giving, promising, or offering anything of value—including facilitation or "grease" payments—to any government official or private partner to secure an improper business advantage or speed up government action.',
    policyDirectives: [
      'Zero tolerance for bribes, kickbacks, and corrupt facilitation payments worldwide.',
      'Applies to all domestic and foreign government officials and commercial transactions.',
      'Accurate accounting records required for all international disbursements without exception.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-06',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 3: Integrity with Business Partners',
    pageCitation: 'Pages 18 - 20',
    topicTitle: 'Business Gifts, Meals & Hospitality',
    question: 'A software vendor currently participating in an active RFP bidding process invites a Stewart procurement manager to an all-expenses-paid weekend golf resort retreat. How should the manager handle this invitation?',
    options: [
      'Accept the weekend retreat because networking builds strong vendor relationships',
      'Decline the invitation; gifts, meals, or entertainment that are lavish, or offered during an active vendor selection/contract negotiation, create an improper conflict of interest',
      'Accept, but pay for the golf cart rental while the vendor pays for the hotel and flights',
      'Accept quietly without mentioning it to colleagues'
    ],
    correctIndex: 1,
    explanation: 'Stewart policy mandates that business gifts, meals, and entertainment must be reasonable, modest, infrequent, and never given or accepted when they could improperly influence—or Appear to influence—business decisions, especially during active contract bidding.',
    policyDirectives: [
      'Gifts must be modest, infrequent, and legally permissible.',
      'Never accept gifts or lavish hospitality during active contract bidding or RFP reviews.',
      'Gifts to government officials are strictly prohibited without prior written Legal Approval.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-07',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 3: Integrity with Business Partners',
    pageCitation: 'Pages 20 - 22',
    topicTitle: 'Fair Competition & Antitrust Laws',
    question: 'During a local real estate industry dinner, a competitor title company manager suggests that both companies agree not to discount title insurance premiums in the county. What should the Stewart employee do?',
    options: [
      'Agree informally to prevent a price war between the two companies',
      'Immediately and clearly state that discussing pricing or rates is illegal, refuse to participate, terminate the conversation, leave the table, and immediately report the incident to Stewart Legal',
      'Stay quiet and nod to avoid making the competitor uncomfortable',
      'Take notes and bring the agreement back to the branch manager to implement quietly'
    ],
    correctIndex: 1,
    explanation: 'Antitrust laws strictly prohibit competitors from agreeing to fix prices, divide markets, rig bids, or allocate customers. Any conversation regarding pricing, discounts, or geographic territories with competitors is unlawful. Employees must audibly object, exit immediately, and notify Legal.',
    policyDirectives: [
      'Strict prohibition on price-fixing, market allocation, and bid-rigging with competitors.',
      'Never discuss rates, premiums, fees, or territory divisions with competing title firms.',
      'Immediately report any competitor anti-competitive Approaches to Legal.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-08',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 4: Integrity for Shareholders',
    pageCitation: 'Pages 23 - 25',
    topicTitle: 'Accurate Books, Financial Integrity & Internal Controls',
    question: 'A manager asks an accountant to delay recording a legitimate vendor invoice until the next fiscal quarter in order to meet this quarter’s branch operating profit target. Is this acceptable?',
    options: [
      'Yes, if the branch will easily make up the difference in the next quarter',
      'No. Stewart requires all financial transactions, expenses, and liabilities to be recorded accurately, completely, and in the correct accounting period under Sarbanes-Oxley (SOX) and GAAP rules',
      'Yes, as long as the vendor agrees to resend the invoice date later',
      'Yes, if Approved verbally by a senior field vice president'
    ],
    correctIndex: 1,
    explanation: 'Pillar 4 emphasizes Stewart’s uncompromising commitment to transparent, complete, and accurate financial reporting. Deferring expenses, falsifying records, maintaining "slush funds", or misrepresenting earnings is illegal and violates the Code of Conduct.',
    policyDirectives: [
      'All books, records, accounts, and invoices must reflect transactions accurately and timely.',
      'No off-the-books funds, deceptive accounts, or deferred liabilities permitted.',
      'Strict compliance with Sarbanes-Oxley (SOX) and internal accounting controls.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-09',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 4: Integrity for Shareholders',
    pageCitation: 'Pages 25 - 27',
    topicTitle: 'Insider Trading & Material Non-Public Information (MNPI)',
    question: 'An employee learns in an internal operational meeting that Stewart is about to acquire a major regional title agency next week, which has not yet been announced publicly. What does Stewart’s Insider Trading policy prohibit?',
    options: [
      'Buying or selling Stewart stock or options before the acquisition is publicly announced',
      'Tipping off family members, friends, or broker acquaintances so they can purchase stock ahead of the news',
      'Trading in the stock of the target company being acquired while in possession of non-public knowledge',
      'All of the above are strictly prohibited insider trading violations'
    ],
    correctIndex: 3,
    explanation: 'Under securities laws and Stewart policy, trading or tipping others based on Material Non-Public Information (MNPI) is illegal. Information is "material" if a reasonable investor would consider it important in making an investment decision.',
    policyDirectives: [
      'Strict prohibition on trading Stewart or partner securities while possessing MNPI.',
      'Tipping family, friends, or colleagues carries criminal and civil liability.',
      'Trading window blackout periods Apply to designated corporate personnel.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-10',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Pillar 4: Integrity for Shareholders',
    pageCitation: 'Pages 27 - 29',
    topicTitle: 'Conflicts of Interest & Outside Business Activities',
    question: 'An escrow officer’s spouse owns a commercial document courier and mobile notary business. The escrow officer wants to award the branch’s courier contract to their spouse’s company. What must hAppen first?',
    options: [
      'The escrow officer can sign the contract immediately as long as the spouse’s price is competitive',
      'The conflict of interest must be disclosed in writing to the Chief Compliance Officer, and the officer must recuse themselves entirely from vendor evaluation and Approval',
      'The officer can use an alias for the spouse’s company on the invoice to avoid paperwork',
      'No disclosure is required if the contract value is under $10,000 annually'
    ],
    correctIndex: 1,
    explanation: 'A conflict of interest occurs when personal relationships or financial interests conflict with Stewart’s best interests. Any business relationship involving an employee’s family member or outside business must be formally disclosed to the Chief Compliance Officer for evaluation.',
    policyDirectives: [
      'All actual or potential conflicts of interest must be disclosed in writing to Compliance.',
      'Employees must recuse themselves from vendor selections involving family members.',
      'Outside employment must never interfere with Stewart job duties or compete with Stewart.'
    ],
    contactOrAction: 'compliance@stewart.com'
  },
  {
    id: 'quiz-coc-11',
    sourceDoc: 'CODE_OF_BUSINESS_CONDUCT',
    sourceTitle: 'Our Code of Business Conduct: Integrity is at Home Here',
    sectionOrPillar: 'Speaking Up & Ethics Hotline',
    pageCitation: 'Pages 3 - 5, Page 32',
    topicTitle: 'Speaking Up, EthicsPoint Hotline & Non-Retaliation Policy',
    question: 'An employee suspects that their manager is altering escrow reconciliations. The employee fears that reporting the issue might cost them their job. What protections and channels does Stewart provide?',
    options: [
      'Stewart has a strict Non-Retaliation Policy protecting anyone who reports concerns in good faith, and reports can be made 24/7 anonymously via EthicsPoint at (866) 384-4277 or ethicspoint.com',
      'Employees are required to confront their manager first before reporting to any corporate department',
      'Retaliation is legally permitted if the employee’s report turns out to be unproven upon investigation',
      'Anonymous complaints are discarded without investigation'
    ],
    correctIndex: 0,
    explanation: 'Stewart strictly prohibits retaliation of any kind against anyone who speaks up or reports a known or suspected violation in good faith. Reports can be submitted 24/7/365 confidentially or anonymously via EthicsPoint ((866) 384-4277 or ethicspoint.com), or through HR and Compliance.',
    policyDirectives: [
      'Zero tolerance for retaliation against anyone speaking up in good faith.',
      'EthicsPoint offers 24/7/365 confidential and anonymous reporting.',
      'Direct compliance email: ethics@stewart.com or phone (866) 384-4277.'
    ],
    contactOrAction: '(866) 384-4277 (EthicsPoint)'
  }
];

export const TOTAL_QUESTIONS_COUNT = COMPREHENSIVE_QUIZ_QUESTIONS.length;
export const IT_SECURITY_QUESTIONS_COUNT = COMPREHENSIVE_QUIZ_QUESTIONS.filter(q => q.sourceDoc === 'IT_SECURITY_POLICY_V7').length;
export const CODE_OF_CONDUCT_QUESTIONS_COUNT = COMPREHENSIVE_QUIZ_QUESTIONS.filter(q => q.sourceDoc === 'CODE_OF_BUSINESS_CONDUCT').length;
