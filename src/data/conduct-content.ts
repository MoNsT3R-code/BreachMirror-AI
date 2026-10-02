import { 
  StewartCodePillar, 
  StewartEthicalQuestion, 
  StewartKnowTheCodeScenario 
} from '../shared-types';

export const STEWART_CORP_METADATA = {
  documentTitle: 'Our Code of Business Conduct',
  tagline: 'INTEGRITY IS AT HOME HERE',
  companyName: 'Stewart Information Services Corporation',
  founded: '1893 in Houston, Texas (130+ years of trust)',
  headquarters: {
    address: '1360 Post Oak Blvd., Suite 100',
    cityStateZip: 'Houston, TX 77056',
    phone: '(800) STEWART',
    website: 'stewart.com',
  },
  leadership: {
    ceo: 'Fred Eppinger',
    ceoTitle: 'Chief Executive Officer',
    cco: 'Chief Compliance Officer',
    clo: 'Chief Legal Officer',
  },
  mission: 'At Stewart, we are committed to becoming the Premier Title Services Company. That is the mission and vision that unites and drives our people every day to uphold our reputation, serve our customers with excellence and remain open to new thinking that fuels innovation.',
  copyright: '© 2026 Stewart. All rights reserved.',
  hotlines: {
    ethicsPointPhone: '(866) 384-4277',
    ethicsPointWeb: 'www.ethicspoint.com',
    complianceEmail: 'ethics@stewart.com',
    legalEmail: 'compliance@stewart.com',
    aiCouncilEmail: 'AICouncil@stewart.com',
  },
};

export const STEWART_DNA = [
  {
    id: 'dna-winning',
    title: 'We Have a Winning Approach',
    shortDesc: 'Relentless drive for excellence, customer success, and innovative industry leadership.',
    color: 'from-amber-500 to-yellow-600',
    icon: 'Trophy',
  },
  {
    id: 'dna-team',
    title: 'We Work As a Team',
    shortDesc: 'Collaborative, supportive, cross-functional unity built on mutual respect and shared goals.',
    color: 'from-blue-500 to-indigo-600',
    icon: 'Users',
  },
  {
    id: 'dna-accountable',
    title: 'We Are Accountable',
    shortDesc: 'We take ownership of outcomes, deliver on promises, learn from mistakes, and act with transparency.',
    color: 'from-rose-600 to-red-700',
    icon: 'ShieldCheck',
  },
  {
    id: 'dna-courageous',
    title: 'We Are Courageous and Honest',
    shortDesc: 'Speaking up without fear, acting with integrity, doing what is right even when difficult.',
    color: 'from-purple-500 to-pink-600',
    icon: 'Heart',
  },
  {
    id: 'dna-customer',
    title: 'We Are Customer-Oriented',
    shortDesc: 'Protecting property ownership worldwide with unmatched service quality and honesty.',
    color: 'from-cyan-500 to-teal-600',
    icon: 'Target',
  },
];

export const STEWART_ETHICAL_QUESTIONS: StewartEthicalQuestion[] = [
  {
    id: 'eth-1',
    number: 1,
    question: 'Would it violate the Code or any of our policies?',
    category: 'Policy Compliance',
    riskIfYes: 'Direct violation of Stewart operating principles and internal governance standards.',
    guidance: 'Stop immediately. Review the Applicable policy or contact ethics@stewart.com.',
  },
  {
    id: 'eth-2',
    number: 2,
    question: 'Would it violate any Applicable laws or regulations?',
    category: 'Legal & Regulatory',
    riskIfYes: 'Exposes both you and Stewart to severe civil penalties, regulatory sanctions, or criminal liability.',
    guidance: 'Cease the proposed action and seek immediate counsel from the Legal Department (compliance@stewart.com).',
  },
  {
    id: 'eth-3',
    number: 3,
    question: 'Would it result in improper influence or unfair advantage?',
    category: 'Fair Competition & Anti-Corruption',
    riskIfYes: 'Breaches RESPA, anti-bribery regulations, and fair market competition mandates.',
    guidance: 'We win business strictly through superior service, never improper influence or unearned kickbacks.',
  },
  {
    id: 'eth-4',
    number: 4,
    question: 'Would it be contrary to Stewart\'s best interests?',
    category: 'Fiduciary Duty',
    riskIfYes: 'Undermines company objectives, brand equity, shareholder value, or financial integrity.',
    guidance: 'Stewart assets and relationships must serve legitimate business purposes only.',
  },
  {
    id: 'eth-5',
    number: 5,
    question: 'Would it cause you or Stewart reputational harm?',
    category: 'Brand & Reputation',
    riskIfYes: 'Erodes over 130 years of client trust in the title and real estate settlement industry.',
    guidance: 'Ask how this would look on the front page of the news or if disclosed publicly.',
  },
  {
    id: 'eth-6',
    number: 6,
    question: 'Would it cause harm to others or the environment?',
    category: 'Human Rights & Sustainability',
    riskIfYes: 'Contradicts our commitment to safe workplaces, human dignity, and environmental responsibility.',
    guidance: 'Stewart prioritizes human health, safety, and sustainable community stewardship above all else.',
  },
  {
    id: 'eth-7',
    number: 7,
    question: 'Would it be dishonest or cause others to distrust you if revealed?',
    category: 'Honesty & Transparency',
    riskIfYes: 'Destroys peer and customer trust, violating our Stewart DNA of courage and honesty.',
    guidance: 'Transparency is non-negotiable. If you must hide or obfuscate your actions, they are not ethical.',
  },
  {
    id: 'eth-8',
    number: 8,
    question: 'Would it lead others to question your judgment or reconsider working with you or Stewart?',
    category: 'Professional Integrity',
    riskIfYes: 'Compromises professional standing and jeopardizes key business partner relationships.',
    guidance: 'Take a step back. Seek guidance from your manager, Compliance, or raise anonymously via EthicsPoint.',
  },
];

export const STEWART_CODE_PILLARS: StewartCodePillar[] = [
  {
    id: 'pillar-1',
    number: 1,
    title: 'WE ARE ACCOUNTABLE',
    tagline: 'We are accountable for our actions and decisions.',
    pageRange: 'Pages 1 – 6',
    summary: 'Establishes the binding authority of our Code globally, outlines responsibilities of all personnel and managers, mandates the 8-question ethical test, and defines our continuous Ethics & Compliance framework.',
    corePillars: [
      'Understand and carry out responsibilities under the Code',
      'Be open, transparent, and act like business owners',
      'Take personal responsibility for outcomes and performance',
      'Deliver on promises and learn from mistakes',
      'Apply the 8-question ethical decision framework whenever uncertain',
    ],
    subtopics: [
      {
        id: 'sub-1-1',
        title: 'Our Code of Conduct Scope & Authority',
        page: 2,
        summary: 'Applies globally to every employee, officer, and director of Stewart Information Services Corporation, Stewart Title Guaranty Company, Stewart Title Company, and all affiliates, as well as suppliers and vendors.',
        keyRules: [
          'Applies to all conduct relating to or affecting Stewart business, reputation, colleagues, customers, or vendors.',
          'Covers remote work from home, business travel, company social functions, and business dinners.',
          'Drives both public and private conduct whenever our actions could reflect on Stewart.',
          'Administered by the Chief Compliance Officer; any waivers for executive officers require Board of Directors Approval.',
        ],
        fullNarrative: 'Our Code of Conduct is Stewart’s commitment to ethical and legal conduct. It sets our expectations for conduct when acting on Stewart’s behalf. We want everyone to know that Stewart takes ethics and the law seriously, and we expect the same of anyone who works for us or on our behalf. By championing compliance, we maintain the trust of our customers, investors, business partners and other stakeholders.',
      },
      {
        id: 'sub-1-2',
        title: 'Everyone\'s & Managers\' Responsibilities',
        page: 3,
        summary: 'Defines universal compliance requirements for every associate and distinct supervisory mandates for people managers.',
        keyRules: [
          'All personnel: Review, understand, and comply with Code, policies, and local laws; report suspected violations promptly.',
          'Conflicts with local laws: Immediately notify a Compliance Officer at ethics@stewart.com.',
          'Managers: Act as ethical role models, foster open environments where reports are welcomed without fear of retaliation.',
          'Training: Managers must ensure all direct and indirect reports complete required compliance training on time.',
        ],
        fullNarrative: 'Regardless of position or location, every associate must comply with our policies and laws. Managers carry unique obligations to serve as role models, encourage reporting, remind teams that good-faith reporting carries zero retaliation risk, and enforce mandatory training completion.',
      },
      {
        id: 'sub-1-3',
        title: 'Consequences of Non-Compliance',
        page: 4,
        summary: 'Violations of the Code jeopardize our business reputation and carry strict disciplinary, civil, and criminal consequences.',
        keyRules: [
          'Disciplinary action up to and including immediate termination of employment.',
          'Referral to regulatory bodies and law enforcement where statutory laws are broken.',
          'Civil lawsuits and criminal prosecution for fraud, insider trading, anti-bribery, or competition violations.',
        ],
        fullNarrative: 'Failure to comply with our Code or policies can result in discipline, up to and including termination of employment. If the incident is also a violation of the law or regulations, it could lead to civil or even criminal penalties.',
      },
      {
        id: 'sub-1-4',
        title: 'We Make Ethical Decisions (The 8-Question Filter)',
        page: 5,
        summary: 'An actionable self-audit framework for evaluating difficult choices in daily business operations.',
        keyRules: [
          'Ask the 8 ethical filter questions before proceeding with ambiguous decisions.',
          'If the answer to ANY question is "YES", take a step back and reconsider.',
          'Escalate to management, Compliance (ethics@stewart.com), Legal (compliance@stewart.com), or EthicsPoint ((866) 384-4277).',
        ],
        fullNarrative: 'When facing gray areas, our 8-point ethical decision test provides an objective moral compass to evaluate harm, lawfulness, conflict of interest, honesty, and reputational risk.',
      },
      {
        id: 'sub-1-5',
        title: 'Ethics and Compliance at Stewart',
        page: 6,
        summary: 'Our structured compliance architecture: quarterly committee oversight, comprehensive policies, continuous education, and robust enforcement.',
        keyRules: [
          'Quarterly Compliance Committee reviews emerging risks and regulatory updates across all business units.',
          'Continuous training programs keep employees current with antitrust, anti-fraud, privacy, and data security.',
          'Auditing, monitoring, and investigative procedures identify vulnerabilities and enforce remediation.',
        ],
        fullNarrative: 'Stewart\'s ethics and compliance program involves a structured Approach promoting legal and ethical conduct across the organization through active oversight, clear policies, continuous education, and fair enforcement.',
      },
    ],
  },
  {
    id: 'pillar-2',
    number: 2,
    title: 'WE SPEAK UP',
    tagline: 'We speak up against disrespectful, unethical, or unlawful conduct without fear.',
    pageRange: 'Pages 7 – 11',
    summary: 'Guarantees comprehensive whistleblower protections, zero tolerance for retaliation, multiple independent reporting channels, and confidential investigations.',
    corePillars: [
      'Report any suspected misconduct or policy breach without fear of retribution',
      'Confidential and anonymous reporting available 24/7 via EthicsPoint',
      'Absolute prohibition against retaliation against good-faith reporters',
      'Thorough, objective investigations conducted on a strict need-to-know basis',
    ],
    subtopics: [
      {
        id: 'sub-2-1',
        title: 'How to Report Concerns & Available Channels',
        page: 8,
        summary: 'Four accessible, confidential avenues to raise compliance, ethical, or legal questions.',
        keyRules: [
          'Channel 1: Direct Manager or Human Resources representative.',
          'Channel 2: Compliance Officer via email at ethics@stewart.com.',
          'Channel 3: Stewart Legal Department at compliance@stewart.com.',
          'Channel 4: EthicsPoint toll-free hotline (866) 384-4277 or online at www.ethicspoint.com (100% anonymous option).',
          'Stewart protects privacy and confidentiality to the fullest extent possible.',
        ],
        fullNarrative: 'We report violations or suspected ones, whether committed by colleagues, supervisors, officers, vendors, or customers. Available resources are open 24/7 to ensure every voice is heard safely.',
      },
      {
        id: 'sub-2-2',
        title: 'What HAppens When We Report an Issue?',
        page: 9,
        summary: 'The lifecycle of an investigation: impartial fact-finding, strict confidentiality, and prompt corrective actions.',
        keyRules: [
          'Reporting an issue does not automatically mean a violation has occurred.',
          'All associates must cooperate fully and truthfully with internal and external investigations.',
          'Information is shared solely on a strict need-to-know basis.',
        ],
        fullNarrative: 'Stewart investigates suspected violations of our Code or policies as Appropriate and necessary. Everyone involved must cooperate fully. Investigations are kept as confidential as possible.',
      },
      {
        id: 'sub-2-3',
        title: 'We Do Not Tolerate Retaliation',
        page: 10,
        summary: 'Stewart\'s strict No Retaliation Policy covers reports, investigations, and all legally protected activities.',
        keyRules: [
          'Zero tolerance for treating reporters or participants differently in any way.',
          'Retaliation includes overt acts (termination, demotion) and subtle acts (exclusion from meetings, poor reviews, cold-shouldering).',
          'Report any suspected retaliation immediately to EthicsPoint or Compliance.',
        ],
        fullNarrative: 'Everyone should feel free to speak up in good faith without fear of punishment. Having a strong policy against retaliation helps us uphold the values of our Code by encouraging each other to speak up.',
      },
      {
        id: 'sub-2-4',
        title: 'Good Faith Reporting & Understanding Retaliation',
        page: 11,
        summary: 'Clarifying the legal and ethical definition of "good faith" and identifying subtle retaliatory behaviors.',
        keyRules: [
          'Good Faith: Sincere belief that a violation occurred, even if later proven factually mistaken.',
          'Mistakes made honestly in good faith are fully protected from any discipline.',
          'Subtle Retaliation: Refusing to cooperate with a coworker or isolating them because they reported a concern is prohibited retaliation.',
        ],
        fullNarrative: 'Good faith means an accusation or report is made because the person sincerely believes a violation occurred. So long as the report was honest, it is protected.',
      },
    ],
  },
  {
    id: 'pillar-3',
    number: 3,
    title: 'WE VALUE OUR PEOPLE',
    tagline: 'Treat each other with respect, dignity, and ensure fair, safe working environments.',
    pageRange: 'Pages 12 – 19',
    summary: 'Focuses on workplace inclusion, zero tolerance for harassment and bullying, physical health and safety, and fair labor standards.',
    corePillars: [
      'Embrace inclusion, cultural backgrounds, preferred pronouns, and diverse life experiences',
      'Provide reasonable accommodations for disability, religion, military, pregnancy, and lactation',
      'Zero tolerance for harassment, discrimination, and hostile work environments',
      'Workplace safety: report injuries, hazards, substance impairment, and violence threats immediately',
      'Fair labor practices: wage & hour compliance, mandatory meal breaks, and burnout prevention',
    ],
    subtopics: [
      {
        id: 'sub-3-1',
        title: 'We Embrace Inclusion and Belonging',
        page: 13,
        summary: 'Building a workplace culture of respect, broad recruiting, pronoun awareness, and reasonable accommodations.',
        keyRules: [
          'Regard diverse backgrounds as assets to learn from and grow with.',
          'Mindful communications: respect gender identities, preferred pronouns, and accurate name pronunciations.',
          'Accommodations: provide adjustments for disabilities, religious holidays, military duties, pregnancy, and lactation.',
        ],
        fullNarrative: 'We are committed to an inclusive workplace that fosters a deep sense of pride, passion, respect and belonging. Inclusive workforce practices help us cooperate effectively and serve diverse customers worldwide.',
      },
      {
        id: 'sub-3-2',
        title: 'We Prevent Harassment, Discrimination, and Bullying',
        page: 14,
        summary: 'Prohibits adverse employment decisions based on protected characteristics and eliminates hostile workplace conduct.',
        keyRules: [
          'Protected characteristics: race, color, national origin, religion, sex, gender identity/expression, sexual orientation, marital status, age, disability.',
          'Harassment evaluated by its impact on the recipient, regardless of the speaker’s intent.',
          'Bullying: abusive humiliation, intimidation, or spiteful conduct is strictly forbidden.',
          'Job candidate interviews: never ask questions regarding marital status, children, family plans, or national origin.',
        ],
        fullNarrative: 'Workplace discrimination and harassment based on personal characteristics are illegal and toxic. Keeping this conduct, as well as bullying, out of our workplace is vital to team trust.',
      },
      {
        id: 'sub-3-3',
        title: 'Workplace Safety, Health, and Physical Security',
        page: 16,
        summary: 'Safeguarding mental and physical health, eliminating safety hazards, and responding to violence threats.',
        keyRules: [
          'Follow safety procedures for any hazardous work; report injuries and physical hazards immediately.',
          'Stay home when experiencing contagious illnesses to protect colleagues.',
          'Seek help for mental illness or substance dependency; prohibit alcohol or illicit drugs on duty.',
          'Report any threats of violence, weapons, or aggressive intent to Security immediately.',
        ],
        fullNarrative: 'Safety, health and well-being are the foundation of productive work life. Whether working from home or in the office, staying safe and healthy plays an essential role in daily operations.',
      },
      {
        id: 'sub-3-4',
        title: 'Fair Labor Practices & Wage Compliance',
        page: 18,
        summary: 'Upholding wage and hour laws, tracking non-exempt hours, mandating rest breaks, and preventing employee burnout.',
        keyRules: [
          'Accurate hour tracking for all non-exempt (hourly) associates with overtime paid according to law.',
          'Mandatory meal and rest breaks; strictly forbid pressure to work through lunch or rest periods.',
          'Prevent excessive hours: respect downtime away from work communication devices outside scheduled hours.',
          'Paid time off: provide generous time off for illness and rejuvenation.',
        ],
        fullNarrative: 'Stewart complies with all Applicable labor laws and cares about employee well-being. Non-exempt employees must record all hours worked, and managers must never pressure associates to skip meals or work off the clock.',
      },
    ],
  },
  {
    id: 'pillar-4',
    number: 4,
    title: 'WE SERVE OUR CUSTOMERS',
    tagline: 'Compete honestly, prevent bribery, follow real estate settlement laws, and respect sanctions.',
    pageRange: 'Pages 20 – 27',
    summary: 'Governs our customer interactions: strict anti-bribery measures, RESPA and TRID compliance, international sanctions screening, and antitrust fair competition.',
    corePillars: [
      'Zero tolerance for bribes, kickbacks, unearned fees, and improper referral arrangements',
      'Strict adherence to RESPA and TRID settlement disclosure regulations',
      'Safeguard escrow funds exclusively for authorized transaction instructions',
      'Comply with U.S. Anti-Boycott laws and OFAC economic trade sanctions',
      'Compete fairly: no price-fixing, market allocation, or no-poach understandings with competitors',
    ],
    subtopics: [
      {
        id: 'sub-4-1',
        title: 'We Prevent Bribery and Corruption (RESPA & Anti-Kickback)',
        page: 21,
        summary: 'Prohibits improper payments, referral fees, kickbacks, unearned settlement fees, and conversion of escrow funds.',
        keyRules: [
          'Kickbacks & Referral Fees: Never give or accept anything of value in exchange for settlement service referrals.',
          'No gift cards, prize trips, or above-market rent/joint advertising paid to real estate agents or lenders for referrals.',
          'Unearned fees barred: Cannot charge borrowers fees for services not performed (e.g. courier fee when borrower picked up files).',
          'Escrow funds protection: Escrow funds may only be disbursed pursuant to authorized written instructions.',
          'Neutral provider lists: If asked for professional recommendations (realtor, lawyer), provide a neutral list; never single out one provider.',
          'TRID Disclosures: Preserve and retain evidence of compliance for all consumer mortgage disclosures.',
        ],
        fullNarrative: 'Bribery and corruption damage reputation beyond repair and constitute severe federal crimes. We avoid kickbacks, referral fees, unearned fees, and follow strict accounting controls for escrow funds.',
      },
      {
        id: 'sub-4-2',
        title: 'International Business with Integrity (Anti-Boycott & OFAC)',
        page: 24,
        summary: 'Enforces compliance with U.S. Anti-Boycott laws and OFAC economic trade sanctions.',
        keyRules: [
          'Anti-Boycott: Never participate in unsanctioned boycotts against U.S. allies; report any boycott requests immediately.',
          'Trade Sanctions: Never conduct business with countries, entities, or individuals on U.S. trade sanctions lists.',
          'Screening: Screen prospective business partners against OFAC Specially Designated Nationals (SDN) and Foreign Sanctions Evaders lists.',
          'Due Diligence: Perform thorough screening before entering new international markets.',
        ],
        fullNarrative: 'We promote fair global trade and comply with U.S. trade sanctions administered by OFAC, performing rigorous due diligence before transacting with foreign entities.',
      },
      {
        id: 'sub-4-3',
        title: 'We Compete Honestly and Fairly (Antitrust & Competition)',
        page: 26,
        summary: 'Strict adherence to competition/antitrust laws: no price-fixing, market division, or "no-poach" pacts.',
        keyRules: [
          'Independent pricing: Never discuss, fix, or stabilize prices, fees, rates, or commissions with competitors.',
          'No market division: Never agree with competitors to divide customer accounts, territories, or lines of business.',
          'No-Poach pacts: Strictly prohibited from agreeing with competitors not to recruit or hire each other’s employees.',
          'Industry conferences: If competitors bring up pricing or rates during coffee or social events, immediately excuse yourself and report it.',
        ],
        fullNarrative: 'We compete fairly through superior offerings and pricing. Antitrust laws protect open competition; agreements with competitors on prices or market allocation carry severe felony penalties.',
      },
    ],
  },
  {
    id: 'pillar-5',
    number: 5,
    title: 'WE EXCEL IN OUR MARKETPLACE',
    tagline: 'Avoid conflicts of interest, trade ethically, and exchange gifts responsibly.',
    pageRange: 'Pages 28 – 36',
    summary: 'Addresses conflicts of interest, AfBA disclosures, responsible business entertainment, insider trading prohibitions, and vendor integrity.',
    corePillars: [
      'Avoid actual and Apparent conflicts between personal interests and Stewart\'s best interests',
      'Disclose Affiliated Business Arrangements (AfBA) whenever ownership exceeds 1%',
      'Exchange gifts and meals responsibly: never cash, never lavish, never during contract bidding',
      'Strict prohibition on insider trading and tipping material non-public information',
      'Require business partners to agree to our Supplier/Vendor Code of Conduct',
    ],
    subtopics: [
      {
        id: 'sub-5-1',
        title: 'We Avoid Conflicts of Interest & AfBA Rules',
        page: 29,
        summary: 'Recognize situations of divided loyalty: hiring relatives, outside employment, corporate opportunities, and AfBA disclosures.',
        keyRules: [
          'Relatives & Friends: Never hire or supervise family members without full compliance disclosure.',
          'Outside Employment: Must not compete with Stewart, interfere with job duties, or utilize company time/equipment.',
          'Speaking Honoraria: Normal job duty; employees must not request or accept speaking fees from event organizers.',
          'Inventions & IP: Written permission from Compliance Officer required before developing business-related software or IP.',
          'AfBA Disclosures: Required whenever referring a borrower in a 1-to-4 unit residential transaction where Stewart or an employee owns >1% in the settlement provider.',
          'Board of Directors: Must disclose personal interest to Chief Legal Officer and recuse from related decisions.',
        ],
        fullNarrative: 'We do not let personal interests get in the way of our decisions on behalf of Stewart. Avoiding conflicts builds trust with clients, partners, and communities.',
      },
      {
        id: 'sub-5-2',
        title: 'Gifts and Entertainment Responsibly',
        page: 31,
        summary: 'Guidelines for business gifts, meals, and entertainment: win on merit, never improper influence.',
        keyRules: [
          'Cash & Cash Equivalents (gift cards, prepaid cards): Strictly prohibited under all circumstances.',
          'Bidding & Negotiations: Never offer or accept gifts/meals during an active RFP or contract negotiation.',
          'Government Officials: Prior written Approval from Chief Compliance Officer required; facilitating payments barred.',
          'Meals & Entertainment: Must serve legitimate business purpose, be reasonable in price, and a Stewart employee must attend.',
        ],
        fullNarrative: 'We win business through superior offerings, not improper gifts or lavish entertainment. Gifts must be modest, lawful, and properly recorded in accounting ledgers.',
      },
      {
        id: 'sub-5-3',
        title: 'We Avoid Insider Trading & Illegal Tipping',
        page: 34,
        summary: 'Prohibits buying/selling securities based on Material Non-Public Information (MNPI) or tipping family and friends.',
        keyRules: [
          'Material Non-Public Information: Earnings, dividend changes, mergers, acquisitions, major customer wins, litigation, or security breaches.',
          'Trading Barred: Never trade securities while in possession of non-public confidential information.',
          'No Tipping: Never share inside information with family members (including spouses), friends, or colleagues.',
        ],
        fullNarrative: 'Insider trading destroys market integrity and is a serious federal offense. If you possess material confidential information, you must not trade or disclose it until publicly announced.',
      },
      {
        id: 'sub-5-4',
        title: 'Partnering with Suppliers Who Share Our Values',
        page: 36,
        summary: 'Enforcing the Stewart Supplier/Vendor Code of Conduct across our supply chain.',
        keyRules: [
          'Screen all suppliers for history of ethical or legal compliance before contracting.',
          'Require vendors to contractually commit to our Supplier/Vendor Code of Conduct.',
          'Ensure vendors maintain clear channels to report suspected violations.',
        ],
        fullNarrative: 'Our suppliers and vendors play a vital role in our business operations. We expect all partners to mirror our dedication to integrity and human dignity.',
      },
    ],
  },
  {
    id: 'pillar-6',
    number: 6,
    title: 'WE SAFEGUARD OUR COMPANY',
    tagline: 'Protect financial assets, trade secrets, customer privacy, AI tools, and corporate reputation.',
    pageRange: 'Pages 37 – 49',
    summary: 'Details fraud detection, Anti-Money Laundering (AML), record retention, intellectual property, data privacy, responsible Generative AI use, and media relations.',
    corePillars: [
      'Execute Stewart\'s Anti-Fraud Plan and prevent wire fraud and money laundering',
      'Comply with record retention schedules and never destroy records subject to legal hold',
      'Safeguard proprietary trade secrets, customer lists, and respect former employers\' IP',
      'Protect customer and employee Personal Information (PII) under privacy laws',
      'Use Generative AI responsibly: never input sensitive data into public tools, obtain AI Council Approval',
      'Safeguard brand reputation: only authorized spokespersons speak to media',
    ],
    subtopics: [
      {
        id: 'sub-6-1',
        title: 'Safeguard Financial Assets (Anti-Fraud & AML)',
        page: 38,
        summary: 'Executing Stewart\'s Anti-Fraud Plan, anti-money laundering controls, wire fraud prevention, and record preservation.',
        keyRules: [
          'Anti-Fraud Plan: Proactively detect, investigate, and report insurance fraud, wire fraud, and escrow diversion.',
          'Anti-Money Laundering: Scrutinize unusual transaction structures, complex offshore entities, and rush closing demands.',
          'Record Retention & Legal Holds: Never destroy, alter, or relocate records subject to pending or threatened litigation/investigations.',
        ],
        fullNarrative: 'Fraud prevention and asset protection are core responsibilities. Theft, waste, and financial crimes jeopardize our stability and client trust.',
      },
      {
        id: 'sub-6-2',
        title: 'Protect Confidential & Proprietary Information',
        page: 41,
        summary: 'Protecting trade secrets, system designs, pricing strategies, and customer transaction details.',
        keyRules: [
          'Trade Secrets: Protect sales plans, forecasts, pricing matrices, system architectures, and referral sources.',
          'Customer Identity: Even the fact that an entity is a Stewart customer is confidential information.',
          'Former Employers: Never use or disclose confidential information from former employers in your work for Stewart.',
          'Recording Devices: No cameras, phones, or webcams to capture trade secrets or confidential displays.',
        ],
        fullNarrative: 'We maintain competitive advantage by protecting proprietary assets. Customer transaction details must never be discussed outside a legitimate need-to-know basis.',
      },
      {
        id: 'sub-6-3',
        title: 'We Secure Personal Information (PII & Privacy)',
        page: 44,
        summary: 'Compliance with data protection laws, data minimization, secure sharing, and phishing defense.',
        keyRules: [
          'Data Minimization: Collect only the minimum necessary personal data needed for legitimate business purposes.',
          'Third-Party Sharing: Disclose PII only pursuant to written agreements, legal orders, or express authorization.',
          'Security Training: Mandatory participation in phishing awareness and cybersecurity training modules.',
        ],
        fullNarrative: 'Mishandling personal information can lead to identity theft, severe fines, and reputational collapse. We protect customer, partner, and employee PII rigorously.',
      },
      {
        id: 'sub-6-4',
        title: 'We Use Technology Wisely & Generative AI Governance',
        page: 47,
        summary: 'Responsible adoption of emerging technologies, Generative AI guidelines, and AI Council oversight.',
        keyRules: [
          'Approved AI Tools: Use only AI Applications vetted and Approved by IT or the AI Council.',
          'Data Protection: NEVER input confidential, proprietary, or customer-specific data into public AI tools (ChatGPT, Claude, Grok, DALL-E).',
          'AI Bots in Meetings: Never allow AI note-taking bots to record meetings without prior notice and express consent.',
          'AI Transparency: Clearly disclose when customer-facing or regulatory content was created or assisted by AI.',
          'AI Council Approval: Consult AICouncil@stewart.com before launching any new AI-assisted initiative.',
        ],
        fullNarrative: 'We embrace technology to enhance productivity while balancing opportunity with responsibility. Misuse of generative AI can trigger data leaks, copyright infringement, and biased outcomes.',
      },
      {
        id: 'sub-6-5',
        title: 'We Safeguard Our Reputation (Media & Social Media)',
        page: 49,
        summary: 'Rules for public communications, press inquiries, and personal social media participation.',
        keyRules: [
          'Media Inquiries: Refer all journalists to the Communications Manager; no unauthorized statements.',
          'Social Media: Postings reflect on Stewart; clarify that online posts represent personal views only.',
          'Copyrights & IP: Never post Stewart copyrighted graphics, internal slides, or confidential information online.',
        ],
        fullNarrative: 'Only designated spokespersons may speak for Stewart with written authorization from the Communications Manager or Chief Legal Officer. Responsible social media behavior protects our collective brand.',
      },
    ],
  },
  {
    id: 'pillar-7',
    number: 7,
    title: 'WE CARE FOR OUR WORLD',
    tagline: 'Support communities, protect the environment, respect human rights, and political integrity.',
    pageRange: 'Pages 50 – 55',
    summary: 'Outlines our corporate citizenship: The Stewart Title Foundation, 2 days paid volunteering, environmental sustainability via NotaryCam, human rights, and political neutrality.',
    corePillars: [
      'Engage communities through The Stewart Title Foundation, Inc. and 2 paid volunteer days annually',
      'Reduce environmental footprint through renewable energy and NotaryCam paperless signings',
      'Zero tolerance for human trafficking, modern slavery, and child labor in our operations and supply chains',
      'Respect individual political participation on personal time/funds while prohibiting use of company assets',
      'Obtain Chief Legal Officer authorization before running for public office or lobbying',
    ],
    subtopics: [
      {
        id: 'sub-7-1',
        title: 'We Engage with Our Communities (Stewart Title Foundation)',
        page: 51,
        summary: 'Philanthropic programs, employee volunteerism, Community Service Awards, and charitable partnerships.',
        keyRules: [
          'Paid Time Off for Volunteering: 2 days of paid time off annually for every eligible employee globally.',
          'Community Service Awards: Funding employee-designated charities across all 50 U.S. states and DC.',
          'Charitable Partners: Rebuilding Together® for home repairs and Feeding America® for hunger relief.',
          'The Stewart Scholarship Class empowering next-generation students.',
        ],
        fullNarrative: 'Our business depends on thriving communities. Through The Stewart Title Foundation, Inc., we empower associates to give back with paid volunteer days and matching initiatives.',
      },
      {
        id: 'sub-7-2',
        title: 'We Work Toward a Sustainable Future',
        page: 52,
        summary: 'Environmental stewardship, carbon footprint reduction, and paperless real estate technology.',
        keyRules: [
          'Powering Stewart home offices with renewable energy sources.',
          'Tree conservation through digital workflows and paperless title processing.',
          'NotaryCam® subsidiary: Remote Online Notarization (RON) eliminates travel emissions and paper waste.',
        ],
        fullNarrative: 'Stewart strives to be part of the solution in maintaining a healthy environment and reducing our carbon footprint through technology innovation and renewable energy.',
      },
      {
        id: 'sub-7-3',
        title: 'We Respect Human Rights',
        page: 53,
        summary: 'Enforcing human dignity, zero tolerance for modern slavery or child labor, and supply chain due diligence.',
        keyRules: [
          'Never tolerate human trafficking, forced labor, or child labor anywhere in our supply chain.',
          'Rigorous screening and due diligence of domestic and international vendors.',
          'Protect vulnerable and marginalized individuals, prioritizing equality for women and minority groups.',
        ],
        fullNarrative: 'Human rights are fundamental to human well-being. We hold ourselves and our partners accountable to our Human Rights Policy globally.',
      },
      {
        id: 'sub-7-4',
        title: 'We Support Participation in the Political Process',
        page: 54,
        summary: 'Protecting individual civic participation while maintaining strict corporate political neutrality.',
        keyRules: [
          'Participate on personal time with personal money and resources only.',
          'Stewart facilities, work hours, and funds must NEVER be used for political campaigns without Chief Compliance Officer Approval.',
          'Running for public office requires prior written Approval from the Chief Legal Officer.',
          'Lobbying on Stewart’s behalf requires express written authorization from the Chief Legal Officer.',
          'Never represent personal political opinions as company positions during client meetings.',
        ],
        fullNarrative: 'Stewart respects individual political engagement. However, employees must draw a sharp line between personal political activities and Stewart company business.',
      },
    ],
  },
];

export const STEWART_KNOW_THE_CODE_SCENARIOS: StewartKnowTheCodeScenario[] = [
  {
    id: 'ktc-11',
    page: 11,
    pillarId: 'pillar-2',
    pillarTitle: 'We Speak Up',
    topicTitle: 'Retaliation & Team Ostracization',
    question: 'Ever since one of our colleagues reported a suspected violation, my team has been divided over the issue. Some team members refuse to cooperate with them and have tried to make things difficult for them because the coworker made the report. Could this be retaliation?',
    answer: 'YES. Subtle ostracization and refusal to cooperate constitute illegal retaliation.',
    explanation: 'Retaliation is not limited to termination or demotion. It includes subtler forms like refusing to cooperate, giving inaccurate reviews, or freezing a colleague out of meetings or communications. Any report made in good faith is fully protected. Report this retaliatory behavior immediately.',
    actionProtocol: [
      'Do not participate in isolating or ignoring the coworker.',
      'Report the retaliatory conduct to a Compliance Officer at ethics@stewart.com or via EthicsPoint.',
      'Managers must intervene to restore a cooperative, retaliation-free team environment.',
    ],
    relevantContact: 'ethics@stewart.com | EthicsPoint (866) 384-4277',
  },
  {
    id: 'ktc-13',
    page: 13,
    pillarId: 'pillar-3',
    pillarTitle: 'We Value Our People',
    topicTitle: 'Religious Holiday Accommodation',
    question: 'A coworker asked for time off to observe a religious holiday not marked on the official company calendar. Does this mean we cannot honor their request?',
    answer: 'NO. Stewart provides reasonable accommodations for religious observances.',
    explanation: 'Stewart provides reasonable accommodations for employees\' sincerely held religious practices and holidays, even if they are not listed on the standard company holiday schedule, provided it does not cause undue operational disruption.',
    actionProtocol: [
      'Encourage the employee to submit an accommodation request through their manager or HR.',
      'Consult HR to arrange flexible scheduling, shift swaps, or PTO allocation.',
      'Foster an inclusive atmosphere respecting all cultural and religious backgrounds.',
    ],
    relevantContact: 'Human Resources Department',
  },
  {
    id: 'ktc-15',
    page: 15,
    pillarId: 'pillar-3',
    pillarTitle: 'We Value Our People',
    topicTitle: 'InAppropriate Job Interview Questions',
    question: 'Our team is drafting a list of interview questions for job candidates. Some team members say the list contains questions that are inAppropriate, such as those that ask whether the candidate is married or has children and where the person grew up. Is there anything wrong with these questions?',
    answer: 'YES. Inquiring about marital status, children, or national origin violates anti-discrimination laws.',
    explanation: 'Questions regarding marital status, family planning, children, age, religion, or place of origin touch upon protected characteristics. They introduce bias and expose Stewart to discrimination liability. Interviews must focus solely on job-related skills and qualifications.',
    actionProtocol: [
      'Remove all questions regarding marriage, children, pregnancy, and hometown immediately.',
      'Utilize standardized, competency-based interview questions vetted by HR.',
      'Review Stewart Employee Policies on equal opportunity and hiring.',
    ],
    relevantContact: 'Human Resources / Talent Acquisition',
  },
  {
    id: 'ktc-17',
    page: 17,
    pillarId: 'pillar-3',
    pillarTitle: 'We Value Our People',
    topicTitle: 'Workplace Threat & Weapon Mention',
    question: 'A coworker has been making aggressive remarks and recently mentioned something about bringing a weapon to work. Should I tell someone, even if it seems like they might just be venting?',
    answer: 'YES, IMMEDIATELY. Threats of violence or weapons must never be dismissed as "just venting".',
    explanation: 'Workplace safety is paramount. Any remark about bringing a weapon or committing violence—regardless of whether intended as a joke or emotional venting—must be reported immediately to Security and Management so preventative assessments can occur.',
    actionProtocol: [
      'Contact Stewart Corporate Security or Facilities immediately.',
      'If there is immediate danger to life, alert emergency services (911) right away.',
      'Notify your supervisor and report via EthicsPoint.',
    ],
    relevantContact: 'Stewart Security | Emergency Services',
  },
  {
    id: 'ktc-19',
    page: 19,
    pillarId: 'pillar-3',
    pillarTitle: 'We Value Our People',
    topicTitle: 'Non-Exempt Working Through Lunch & Burnout',
    question: 'A colleague of mine on another team says that their team is consistently pressured to work through lunch, even those who are non-exempt. Non-exempt employees are expected to answer emails or texts on evenings and weekends. They have almost no downtime outside of sleep and are considering quitting. They\'re afraid to complain, though. Should I speak up?',
    answer: 'YES. Pressuring hourly workers to work off-the-clock violates wage laws and labor policy.',
    explanation: 'Under labor laws and Stewart policy, non-exempt (hourly) employees must be compensated for all hours worked and are entitled to uninterrupted meal breaks. Expecting off-the-clock work or creating severe burnout conditions violates company policy and federal regulations.',
    actionProtocol: [
      'Speak up on their behalf to HR or a Compliance Officer at ethics@stewart.com.',
      'Report anonymously through EthicsPoint if concern for retaliation exists.',
      'Management will audit team timekeeping and enforce proper break and overtime practices.',
    ],
    relevantContact: 'ethics@stewart.com | HR Representative',
  },
  {
    id: 'ktc-23',
    page: 23,
    pillarId: 'pillar-4',
    pillarTitle: 'We Serve Our Customers',
    topicTitle: 'Real Estate Agent Business Cards & RESPA',
    question: 'A real estate agent wants to leave their business cards at my office for customers to take if they are interested. Is this OK?',
    answer: 'CAUTION: Permissible ONLY if non-exclusive, neutral, and with NO referral fee or kickback.',
    explanation: 'Under RESPA and Stewart anti-bribery policies, we must never give or accept kickbacks, referral fees, or Appear to endorse a single preferred agent in exchange for business referrals. Displaying materials must be managed neutrally with open access for all local providers without favor.',
    actionProtocol: [
      'Ensure Stewart is not receiving any discount, fee, or preferential referrals in return.',
      'Do not endorse any specific agent over others; provide multiple cards or a neutral directory.',
      'Consult a Compliance Officer (ethics@stewart.com) if any arrangement involves mutual referrals.',
    ],
    relevantContact: 'Compliance Officer (ethics@stewart.com)',
  },
  {
    id: 'ktc-25',
    page: 25,
    pillarId: 'pillar-4',
    pillarTitle: 'We Serve Our Customers',
    topicTitle: 'New International Market & OFAC Sanctions',
    question: 'My team is considering doing business with a company based in a country with which we currently have no business. What is my team\'s obligation here as far as trade sanctions are concerned?',
    answer: 'MANDATORY SCREENING: Must conduct OFAC sanctions and Anti-Boycott due diligence first.',
    explanation: 'The U.S. Office of Foreign Assets Control (OFAC) enforces strict economic trade sanctions. Before engaging in any new international jurisdiction, Stewart must screen the entity, its principals, and banks against OFAC\'s Specially Designated Nationals (SDN) and Foreign Sanctions Evaders lists.',
    actionProtocol: [
      'Submit the proposed partner details to the Legal Department (compliance@stewart.com).',
      'Perform mandatory screening against OFAC SDN and Anti-Boycott watchlists.',
      'Obtain formal written legal clearance before signing any agreement or accepting funds.',
    ],
    relevantContact: 'Legal Department (compliance@stewart.com)',
  },
  {
    id: 'ktc-27',
    page: 27,
    pillarId: 'pillar-4',
    pillarTitle: 'We Serve Our Customers',
    topicTitle: 'Coffee with Competitors Discussing Pricing',
    question: 'While we\'re attending a trade conference, my team goes out for coffee with a group that includes some of our competitors. The conversation flows to the topic of inflation and the pricing of offerings. What should we do?',
    answer: 'IMMEDIATELY OBJECT & LEAVE: Refuse to discuss pricing; demand your departure be noted.',
    explanation: 'Antitrust laws strictly prohibit any formal or informal discussion among competitors regarding pricing, fees, commission rates, discounts, or market margins. Even casual conversations about inflation adjustments can be prosecuted as illegal price-fixing.',
    actionProtocol: [
      'State loudly and clearly: "Stewart policy prohibits discussing pricing or fees with competitors."',
      'Immediately excuse yourself and walk away from the table.',
      'Report the conversation immediately to the Legal Department (compliance@stewart.com).',
    ],
    relevantContact: 'Legal Department (compliance@stewart.com)',
  },
  {
    id: 'ktc-30',
    page: 30,
    pillarId: 'pillar-5',
    pillarTitle: 'We Excel in Our Marketplace',
    topicTitle: 'Hiring Sibling\'s Contracting Company (Conflict of Interest)',
    question: 'We are looking for a company to provide employee contracting services. My sibling owns a company that provides this service. Can I hire my sibling\'s company?',
    answer: 'NO, you cannot make the hiring decision. You must disclose and completely recuse yourself.',
    explanation: 'Hiring a family member\'s business creates an acute conflict of interest. While the sibling\'s company may submit a bid, you must disclose the relationship to Compliance and recuse yourself completely from vendor selection, evaluation, negotiation, and ongoing supervision.',
    actionProtocol: [
      'Disclose the family relationship to management and ethics@stewart.com.',
      'Recuse yourself from reviewing bids, voting, pricing discussions, and contracting.',
      'Procurement must independently evaluate the bid against fair market competitors.',
    ],
    relevantContact: 'ethics@stewart.com | Procurement Team',
  },
  {
    id: 'ktc-33',
    page: 33,
    pillarId: 'pillar-5',
    pillarTitle: 'We Excel in Our Marketplace',
    topicTitle: 'Foreign Agent Offering Off-the-Books Payments',
    question: 'My team is doing business in a country new to us. An "agent" Approaches us and offers to help us get through some legal processes that they claim usually require some kind of off-the-books payments to push through. The agent charges a modest fee for the service. Should we accept the offer?',
    answer: 'STRICTLY NO: Off-the-books and facilitating payments violate anti-bribery laws (FCPA).',
    explanation: 'Facilitating payments and "off-the-books" payments to officials or intermediaries violate the U.S. Foreign Corrupt Practices Act (FCPA) and Stewart\'s zero-tolerance anti-corruption policy. Paying a third-party agent to pass bribes exposes Stewart to criminal prosecution.',
    actionProtocol: [
      'Reject the agent\'s proposal immediately.',
      'Do not authorize any cash payments or off-the-books disbursements.',
      'Report the incident to the Chief Compliance Officer at ethics@stewart.com.',
    ],
    relevantContact: 'Chief Compliance Officer (ethics@stewart.com)',
  },
  {
    id: 'ktc-35',
    page: 35,
    pillarId: 'pillar-5',
    pillarTitle: 'We Excel in Our Marketplace',
    topicTitle: 'Sharing Unreleased Partner Merger with Spouse (Insider Trading)',
    question: 'I recently discovered that one of our business partners is about to merge with another company, but the information has not yet been released to the public. Even though it is confidential, could it still violate insider trading laws if I mentioned it in private to a family member, such as my spouse?',
    answer: 'YES. Disclosing material non-public info to family constitutes illegal "tipping".',
    explanation: 'Sharing confidential, material non-public information with anyone—even a spouse or close relative—is illegal "tipping" under federal securities laws. If the family member trades or shares it with another who trades, both you and they face civil fines and criminal imprisonment.',
    actionProtocol: [
      'Keep all non-public acquisition, merger, and earnings information strictly confidential.',
      'Never discuss confidential Stewart or partner business with family or friends.',
      'Observe all corporate blackout windows and securities trading policies.',
    ],
    relevantContact: 'Chief Legal Officer / Securities Policy',
  },
  {
    id: 'ktc-40',
    page: 40,
    pillarId: 'pillar-6',
    pillarTitle: 'We Safeguard Our Company',
    topicTitle: 'Offshore Real Estate Buyer in a Rush (AML Red Flag)',
    question: 'A customer is trying to purchase real estate through procedures that Appear unusually complex, involving offshore companies whose ownership is difficult to trace. This customer is also in a rush to get it all done without going through all our procedures. What should I do?',
    answer: 'HALT & REPORT: Classic red flag for Money Laundering and fraudulent escrow diversion.',
    explanation: 'Unusually convoluted offshore corporate structures, hidden beneficial owners, and urgent demands to bypass standard closing procedures are primary indicators of money laundering and wire fraud. Never bypass due diligence under customer pressure.',
    actionProtocol: [
      'Do not bypass standard closing, escrow, or verification procedures.',
      'Demand full beneficial ownership documentation according to AML guidelines.',
      'Report the suspicious activity to Stewart\'s Anti-Fraud Team and ethics@stewart.com.',
    ],
    relevantContact: 'Stewart Anti-Fraud Plan Team | ethics@stewart.com',
  },
  {
    id: 'ktc-43',
    page: 43,
    pillarId: 'pillar-6',
    pillarTitle: 'We Safeguard Our Company',
    topicTitle: 'Publishing Internal Presentations (Copyright & Trade Secrets)',
    question: 'I would like to take a portion of an internal business presentation I created for Stewart and make it available to the public. However, I\'m not sure who is considered the copyright holder or whether the presentation contains trade secrets or other confidential information. Since I created the work, can I decide where and when to present it?',
    answer: 'NO. Work created during employment belongs to Stewart; Approval is required.',
    explanation: 'Under law and company policy, work products created for Stewart are "works made for hire" owned exclusively by Stewart. Internal slides often contain confidential financial metrics, roadmaps, or trade secrets. You must obtain written Approval from Communications and Legal before public disclosure.',
    actionProtocol: [
      'Submit the presentation to the Communications Manager and Legal Department.',
      'Verify that all proprietary systems, pricing models, and client names are removed.',
      'Do not post slides on LinkedIn, SlideShare, or personal portfolios without clearance.',
    ],
    relevantContact: 'Communications Manager | Legal Department',
  },
  {
    id: 'ktc-46',
    page: 46,
    pillarId: 'pillar-6',
    pillarTitle: 'We Safeguard Our Company',
    topicTitle: 'Vendor Requesting Excessive Customer Data Spreadsheet',
    question: 'A vendor has requested a spreadsheet that contains personal information about a large segment of our customer base. They have worked with us in the past and said this is routine. The spreadsheet contains more information than is needed. Should I send it to the vendor?',
    answer: 'DO NOT SEND: Violates data protection laws and data minimization principles.',
    explanation: 'Privacy regulations require "data minimization"—sharing only the absolute minimum personal data necessary for contracted services. Sending unneeded personal customer data creates immense regulatory liability, GDPR/CCPA violations, and breach risk.',
    actionProtocol: [
      'Refuse to send the full spreadsheet; strip out all non-essential columns and PII.',
      'Confirm that an active Non-Disclosure Agreement (NDA) and Data Protection Agreement exist.',
      'Consult a Compliance Officer or Privacy Counsel before transmitting customer data.',
    ],
    relevantContact: 'Privacy Officer | ethics@stewart.com',
  },
  {
    id: 'ktc-49',
    page: 49,
    pillarId: 'pillar-6',
    pillarTitle: 'We Safeguard Our Company',
    topicTitle: 'Colleague Social Media Post with Copyrighted Stewart Content',
    question: 'A post on my colleague\'s social media account contains some material that is likely copyrighted by Stewart. What should I do?',
    answer: 'REPORT TO COMPLIANCE/LEGAL: Do not engage in a public dispute online.',
    explanation: 'Employees must not post copyrighted Stewart materials or confidential information on personal social media accounts. Rather than arguing online or commenting publicly, escalate the post privately to your manager, Communications Manager, or Compliance so it can be handled Appropriately.',
    actionProtocol: [
      'Do not comment on or repost the public update.',
      'Take a screenshot of the post with timestamp and URL.',
      'Forward the evidence to the Communications Manager or ethics@stewart.com.',
    ],
    relevantContact: 'Communications Manager | ethics@stewart.com',
  },
  {
    id: 'ktc-55',
    page: 55,
    pillarId: 'pillar-7',
    pillarTitle: 'We Care for Our World',
    topicTitle: 'Sharing Personal Political Views During Client Meetings',
    question: 'During a recent client meeting, a political topic came up, and I shared some of my personal views. Is that OK?',
    answer: 'NO. Keep personal political views separate from Stewart business discussions.',
    explanation: 'While Stewart respects everyone\'s right to participate in the political process as private citizens, you must draw a sharp line during company business. Injecting personal political opinions into client interactions can alienate customers, create discomfort, and blur personal views with Stewart\'s corporate stance.',
    actionProtocol: [
      'Politely redirect conversations with clients back to business services and title solutions.',
      'Never use client meetings or company communications to promote political candidates or causes.',
      'Remember that you represent Stewart whenever interacting in a professional capacity.',
    ],
    relevantContact: 'Ethics & Compliance Officer',
  },
];

export const STEWART_CODE_MARKDOWN_EXPORT = `# Stewart /// Our Code of Business Conduct
**Theme:** INTEGRITY IS AT HOME HERE  
**Publisher:** Stewart Information Services Corporation  
**Headquarters:** 1360 Post Oak Blvd., Suite 100, Houston, TX 77056  
**Phone:** (800) STEWART | **Web:** stewart.com  
**Copyright:** © 2026 Stewart. All rights reserved.

---

## A Message from our CEO (Fred Eppinger)
At Stewart, we are committed to becoming the Premier Title Services Company. That is the mission and vision that unites and drives our people every day to uphold our reputation, serve our customers with excellence and remain open to new thinking that fuels innovation.

Our success over the past 130-plus years has been built on a foundation of values and principles that we call our Stewart DNA. These are the attributes we hold ourselves and each other to, ensuring that we operate with the highest standards of integrity, responsibility and respect.

As you review our Code of Business Conduct and Ethics, understand it is not only a reflection of our past but a blueprint for how we will continue to thrive in the future. It is our commitment to always doing the right thing and maintaining the highest ethical standards and practices in all aspects of our work, protecting our people and serving our customers.

---

## Stewart DNA: Our Core Values
1. **We Have a Winning Approach:** Relentless dedication to market leadership, customer excellence, and continuous improvement.
2. **We Work As a Team:** Cross-functional collaboration, mutual trust, and shared accomplishment.
3. **We Are Accountable:** Ownership of outcomes, transparency, delivering on commitments, learning from mistakes.
4. **We Are Courageous and Honest:** Uncompromising ethical behavior, doing what is right even when difficult, zero fear of speaking up.
5. **We Are Customer-Oriented:** Protecting property ownership worldwide through superior service and honesty.

---

## The 7 Core Pillars of our Code

### 1. We Are Accountable (Pages 1 – 6)
- Global scope covering employees, officers, directors, and suppliers across all operations.
- Administered by the Chief Compliance Officer; waivers require Board of Directors Approval.
- Zero tolerance for non-compliance; discipline up to termination and criminal penalties.
- **The 8-Question Ethical Test:** Ask whether an action causes reputational harm, violates policy, breaks laws, offers improper influence, harms the environment, or breaches trust. If YES to any, stop and seek guidance!

### 2. We Speak Up (Pages 7 – 11)
- Strict No Retaliation Policy: Full protection for good-faith reports and investigation participants.
- Available 24/7 channels: HR, Management, \`ethics@stewart.com\`, \`compliance@stewart.com\`, and **EthicsPoint at (866) 384-4277** (anonymous).
- Objective, fair investigations conducted on a strict need-to-know basis.

### 3. We Value Our People (Pages 12 – 19)
- Inclusion, belonging, respecting preferred pronouns, names, and cultural backgrounds.
- Reasonable accommodations for disabilities, religious holidays, military obligations, pregnancy, and lactation.
- Zero tolerance for discrimination, sexual harassment, hostile work environments, or bullying.
- Workplace safety, substance abuse reporting, and zero tolerance for violence or weapons threats.
- Wage & hour compliance, tracking non-exempt hours, mandatory meal breaks, and burnout prevention.

### 4. We Serve Our Customers (Pages 20 – 27)
- Zero tolerance for bribery, kickbacks, unearned fees, or personal conversion of escrow funds.
- Strict RESPA and TRID mortgage disclosure compliance.
- Compliance with U.S. Anti-Boycott laws and OFAC trade sanctions (SDN watchlist screening).
- Antitrust fair competition: never discuss pricing, fees, or split markets with competitors; no "no-poach" agreements.

### 5. We Excel in Our Marketplace (Pages 28 – 36)
- Avoid conflicts of interest: disclose hiring of relatives, outside employment, and corporate opportunities.
- Affiliated Business Arrangement (AfBA) Disclosures required for >1% ownership in 1-4 unit residential transactions.
- Responsible gifts and entertainment: never cash, never lavish, never during bidding; Approval required for government officials.
- Insider trading prohibition: Material Non-Public Information (MNPI) protection and strict ban on illegal tipping to family or spouse.
- Supplier/Vendor Code of Conduct enforcement.

### 6. We Safeguard Our Company (Pages 37 – 49)
- Stewart's Anti-Fraud Plan and Anti-Money Laundering (AML) controls against wire fraud and complex offshore entities.
- Record retention compliance: never destroy or alter records subject to pending or threatened legal claims.
- Protect trade secrets, system designs, pricing strategies, and customer identity confidentiality.
- Safeguard customer and employee Personal Information (PII); strictly enforce data minimization.
- **Generative AI Governance:** Never input customer or confidential data into public AI (ChatGPT, Claude, Grok, DALL-E). Obtain AI Council Approval at \`AICouncil@stewart.com\`.
- Reputation & Media: only authorized spokespersons may speak for Stewart with Communications Manager Approval.

### 7. We Care for Our World (Pages 50 – 55)
- The Stewart Title Foundation, Inc.: 2 days of paid time off annually for volunteering globally.
- Community Service Awards Program in all 50 states + DC, Rebuilding Together®, Feeding America®.
- Sustainability: Renewable energy in home offices, paper reduction via NotaryCam® Remote Online Notarization.
- Respecting Human Rights: zero tolerance for human trafficking, modern slavery, or child labor in supply chains.
- Political process: personal time and funds only; no company resources without Chief Compliance Officer Approval; Chief Legal Officer clearance required for public office or lobbying.

---

## Ethics & Reporting Directory
- **EthicsPoint Whistleblower Hotline (Anonymous 24/7):** (866) 384-4277 | www.ethicspoint.com
- **Compliance Officer Email:** ethics@stewart.com
- **Legal Department Email:** compliance@stewart.com
- **AI Council Governance:** AICouncil@stewart.com
- **Corporate Headquarters:** 1360 Post Oak Blvd., Suite 100, Houston, TX 77056 | (800) STEWART
`;
