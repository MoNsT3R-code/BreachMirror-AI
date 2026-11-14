import {
  XYZCodePillar,
  XYZCodeSubtopic,
  XYZEthicalQuestion,
  XYZKnowTheCodeScenario,
} from '../shared-types';

export const XYZ_CORP_METADATA = {
  tagline: 'Integrity Is at Home Here',
  founded: '1893',
  copyright: 'XYZ Information Services Corp © 2026',
  leadership: {
    ceo: 'Marcus Vance',
    ceoTitle: 'President and Chief Executive Officer',
  },
  headquarters: {
    address: '100 Heritage Plaza, Suite 900',
    cityStateZip: 'Anytown, USA 77002',
    phone: '(800) 555-0100',
    copyright: 'XYZ Information Services Corp © 2026',
  },
};

export const XYZ_DNA = [
  { id: 'dna-1', title: 'Integrity First', shortDesc: 'We do what is right, even when no one is watching.' },
  { id: 'dna-2', title: 'Customer Commitment', shortDesc: 'We protect customer assets and build enduring trust.' },
  { id: 'dna-3', title: 'Continuous Vigilance', shortDesc: 'We maintain relentless discipline against cyber and operational threats.' },
  { id: 'dna-4', title: 'Open Candor', shortDesc: 'We speak up openly without fear of retaliation.' },
  { id: 'dna-5', title: 'Excellence in Execution', shortDesc: 'We deliver accurate, compliant title and technology services.' },
];

export const XYZ_CODE_PILLARS: XYZCodePillar[] = [
  {
    id: 'pillar-1',
    number: 1,
    title: 'We Protect Our Workplace and People',
    tagline: 'Safety, dignity, and mutual respect for all associates',
    pageRange: 'Pages 6–10',
    summary: 'Ensuring an inclusive, harassment-free workplace where diversity is valued and every individual is treated with dignity.',
    corePillars: [
      'Maintain zero tolerance for discrimination, harassment, and bullying.',
      'Ensure equal employment opportunity in hiring, promotions, and compensation.',
      'Provide a physically secure and psychologically safe working environment.',
      'Support accessibility and accommodations for associates of all abilities.',
    ],
    subtopics: [
      {
        id: '1-1',
        title: 'Diversity, Equity, and Inclusion',
        page: 6,
        summary: 'We celebrate diverse perspectives and provide equitable growth opportunities.',
        keyRules: [
          'Treat all associates, contractors, and candidates with dignity and respect.',
          'Base employment decisions solely on merit, qualifications, and business needs.',
        ],
        fullNarrative: 'XYZ thrives because of the diverse backgrounds, skills, and perspectives of our people. We foster an inclusive culture where everyone can contribute authentically.',
        keyTerms: [{ term: 'Inclusion', definition: 'Creating an environment where all associates feel valued and empowered.' }],
      },
      {
        id: '1-2',
        title: 'Zero Tolerance for Harassment',
        page: 8,
        summary: 'Harassment and hostile conduct of any form are strictly prohibited.',
        keyRules: [
          'Never engage in unwelcome verbal, physical, or visual conduct based on protected characteristics.',
          'Report harassment immediately through management or the confidential hotline.',
        ],
        fullNarrative: 'We are committed to maintaining a workplace free from harassment, intimidation, and offensive behaviors. All complaints are investigated promptly and thoroughly.',
        keyTerms: [{ term: 'Harassment', definition: 'Unwelcome conduct that creates an intimidating or hostile work environment.' }],
      },
    ],
  },
  {
    id: 'pillar-2',
    number: 2,
    title: 'We Safeguard Corporate Assets and Information',
    tagline: 'Fiduciary responsibility and responsible asset use',
    pageRange: 'Pages 11–16',
    summary: 'Protecting tangible company equipment and intangible intellectual property, records, and systems.',
    corePillars: [
      'Use corporate computers, networks, and tools solely for authorized business purposes.',
      'Protect intellectual property, patents, algorithms, and confidential workflows.',
      'Retain and archive business records strictly according to legal schedules.',
      'Prevent waste, loss, theft, and unauthorized distribution of company resources.',
    ],
    subtopics: [
      {
        id: '2-1',
        title: 'Proper Use of Company Property',
        page: 11,
        summary: 'Laptops, mobile devices, and systems are company property.',
        keyRules: [
          'Do not use company property for external personal businesses or commercial gain.',
          'Keep hardware secure and return all equipment upon separation.',
        ],
        fullNarrative: 'Associates must exercise reasonable care in safeguarding company-issued assets. Loss or theft of devices must be reported immediately.',
      },
      {
        id: '2-2',
        title: 'Intellectual Property Protection',
        page: 14,
        summary: 'Proprietary title algorithms and software belong exclusively to XYZ.',
        keyRules: [
          'Never distribute company software code or proprietary documentation externally.',
          'Respect third-party copyrights, licenses, and software patents.',
        ],
        fullNarrative: 'Inventions, trade secrets, software designs, and documentation developed during employment are corporate intellectual property.',
      },
    ],
  },
  {
    id: 'pillar-3',
    number: 3,
    title: 'We Avoid Conflicts of Interest and Unethical Gifts',
    tagline: 'Independence, loyalty, and objective business judgment',
    pageRange: 'Pages 17–22',
    summary: 'Ensuring personal relationships, side investments, and vendor gifts never compromise business objectivity.',
    corePillars: [
      'Disclose any potential conflict of interest to the Compliance Officer.',
      'Never accept gifts, meals, or entertainment from a vendor during an active RFP or bidding process.',
      'Never offer or accept bribes, kickbacks, or improper gratuities under any circumstances.',
      'Obtain prior written approval before taking outside employment or advisory roles.',
    ],
    subtopics: [
      {
        id: '3-1',
        title: 'Vendor Relations and Bidding Integrity',
        page: 17,
        summary: 'Strict standards for vendor selection, competitive bidding, and gift acceptance.',
        keyRules: [
          'A vendor offered me a gift during an RFP, can I accept it? No. Never accept gifts, gratuities, entertainment, or travel from any vendor participating in an active RFP or competitive bidding process.',
          'Gifts from vendors outside active RFPs must be nominal in value (under $50) and never in cash.',
          'Award contracts based strictly on objective vendor quality, security posture, and price.',
        ],
        fullNarrative: 'A vendor offered me a gift during an RFP, can I accept it? Absolutely not. During an active RFP or procurement negotiation, associates must refuse all gifts, meals, tickets, or favors from prospective vendors. Even the perception of favoritism compromises corporate integrity and violates bidding guidelines.',
        keyTerms: [{ term: 'RFP', definition: 'Request for Proposal; a formal competitive bidding process for selecting vendors.' }],
      },
      {
        id: '3-2',
        title: 'Personal Conflicts and Outside Business Activities',
        page: 20,
        summary: 'Managing personal investments, family connections, and outside work.',
        keyRules: [
          'Disclose business dealings with family members or close personal associates.',
          'Do not hold financial interests in competitors or direct suppliers without written approval.',
        ],
        fullNarrative: 'Associates must keep their personal interests separate from corporate duties. When a conflict or potential conflict arises, immediate transparent disclosure is required.',
      },
    ],
  },
  {
    id: 'pillar-4',
    number: 4,
    title: 'We Compete Fairly and Honor Antitrust Laws',
    tagline: 'Honest competition and market integrity',
    pageRange: 'Pages 23–27',
    summary: 'Complying with competition laws, preventing price-fixing, and avoiding unlawful market collusion.',
    corePillars: [
      'Never enter agreements with competitors regarding prices, fees, terms, or customer allocations.',
      'Gather competitive intelligence through ethical, legal, and public sources only.',
      'Avoid discussions of sensitive commercial terms during industry trade association events.',
      'Compete aggressively and fairly on service excellence and technology innovation.',
    ],
    subtopics: [
      {
        id: '4-1',
        title: 'Antitrust Compliance and Fair Dealing',
        page: 23,
        summary: 'Adhering to federal and international competition statutes.',
        keyRules: [
          'Never agree with competitors to divide territories, customers, or services.',
          'Never discuss escrow fee pricing or title premium splits with rival firms.',
        ],
        fullNarrative: 'Antitrust and competition laws preserve market choice and protect customers from collusive practices. Violations carry severe civil and criminal penalties.',
      },
    ],
  },
  {
    id: 'pillar-5',
    number: 5,
    title: 'We Champion Financial Integrity and Transparent Records',
    tagline: 'Honest accounting, accurate books, and strict anti-fraud controls',
    pageRange: 'Pages 28–33',
    summary: 'Maintaining impeccable financial books, accurate billing, and preventing fraud and wire tampering.',
    corePillars: [
      'Record all transactions accurately, timely, and in accordance with GAAP standards.',
      'Never alter wire instructions or bank disbursement details without verbal out-of-band verification.',
      'Cooperate fully with internal and external auditors and regulatory examiners.',
      'Prevent money laundering, unauthorized payments, and off-the-books transactions.',
    ],
    subtopics: [
      {
        id: '5-1',
        title: 'Escrow and Wire Transfer Safeguards',
        page: 28,
        summary: 'Rigorous dual-verification controls for customer fund disbursements.',
        keyRules: [
          'Always verify changed wire routing numbers via voice callback using trusted records.',
          'Never execute payment changes based solely on email instructions.',
        ],
        fullNarrative: 'Wire fraud is an existential risk in the title and escrow industry. Associates must verify all wire changes using verified out-of-band phone numbers.',
      },
      {
        id: '5-2',
        title: 'Accurate Books and Records',
        page: 31,
        summary: 'Truthful financial reporting and document authenticity.',
        keyRules: [
          'Never falsify timecards, expense reports, invoices, or journal entries.',
          'Maintain complete audit documentation for every title and escrow transaction.',
        ],
        fullNarrative: 'Integrity in financial reporting is fundamental to our public trust and regulatory obligations under Sarbanes-Oxley.',
      },
    ],
  },
  {
    id: 'pillar-6',
    number: 6,
    title: 'We Protect Privacy and Govern Emerging Technologies',
    tagline: 'Data stewardship, customer privacy, and ethical AI innovation',
    pageRange: 'Pages 34–39',
    summary: 'Respecting customer personal data privacy and applying human oversight to AI and automated tools.',
    corePillars: [
      'Collect and process customer records solely for legitimate business purposes.',
      'Comply with all state and federal privacy regulations, including GLBA and CCPA.',
      'Never input customer financial records into unauthorized public AI chatbots.',
      'Ensure transparency and fairness in automated title underwriting algorithms.',
    ],
    subtopics: [
      {
        id: '6-1',
        title: 'Customer Data Privacy and Confidentiality',
        page: 34,
        summary: 'Treating customer title and personal records with the highest security.',
        keyRules: [
          'Access customer files only when required for assigned transactions.',
          'Do not share non-public personal information (NPI) with unapproved parties.',
        ],
        fullNarrative: 'Our customers entrust us with sensitive personal data during home purchases. We protect that trust by safeguarding all non-public records.',
      },
      {
        id: '6-2',
        title: 'Responsible AI and Automated Decision-Making',
        page: 37,
        summary: 'Ethical use of AI tools under AI Council oversight.',
        keyRules: [
          'Consult the AI Council before deploying customer-facing AI agents.',
          'Maintain human review for high-impact title and escrow determinations.',
        ],
        fullNarrative: 'While AI enhances efficiency, it must never compromise customer privacy, introduce bias, or operate without human governance.',
      },
    ],
  },
  {
    id: 'pillar-7',
    number: 7,
    title: 'We Speak Up and Guarantee Non-Retaliation',
    tagline: 'Whistleblower protection and open ethical communication',
    pageRange: 'Pages 40–44',
    summary: 'Empowering associates to report ethical concerns with absolute protection against retaliation.',
    corePillars: [
      'Speak up promptly when observing misconduct, safety violations, or compliance breaches.',
      'Access the EthicsPoint independent hotline 24/7 anonymously at (800) 555-0199.',
      'XYZ strictly prohibits retaliation against any employee reporting in good faith.',
      'Managers must foster an open culture where questions and concerns are welcomed.',
    ],
    subtopics: [
      {
        id: '7-1',
        title: 'Speaking Up and Reporting Channels',
        page: 40,
        summary: 'Multiple secure pathways for raising questions and reporting violations.',
        keyRules: [
          'Report concerns to managers, HR, Compliance, or the 24/7 independent hotline.',
          'Hotline reports may be made completely anonymously online or by phone.',
        ],
        fullNarrative: 'Am I protected from retaliation if I report misconduct to the hotline? Yes. XYZ strictly protects associates from retaliation when reporting misconduct to the hotline. You can report concerns confidentially through EthicsPoint at (800) 555-0199 or online at www.ethicspoint.com without fear of negative employment repercussions.',
        keyTerms: [{ term: 'Whistleblower', definition: 'An associate who reports suspected illegal activity or policy misconduct in good faith.' }],
      },
      {
        id: '7-2',
        title: 'Absolute Non-Retaliation Commitment',
        page: 42,
        summary: 'Zero tolerance for any form of retaliation against good-faith reporters.',
        keyRules: [
          'Any associate who retaliates against someone reporting misconduct will be terminated.',
          'Good-faith reports will never harm your career, reviews, or employment standing.',
        ],
        fullNarrative: 'Am I protected from retaliation if I report misconduct to the hotline? Yes. Zero tolerance. Retaliation in any form—whether subtle marginalization, demotion, harassment, or schedule changes—is a severe policy violation leading to immediate termination.',
      },
    ],
  },
];

export const XYZ_ETHICAL_QUESTIONS: XYZEthicalQuestion[] = [
  {
    id: 'eth-1',
    number: 1,
    category: 'Legality',
    question: 'Is this action illegal or against industry regulations?',
    riskIfYes: 'Violating state insurance, title, or federal banking regulations creates corporate and personal legal liability.',
    guidance: 'Stop immediately. Consult Sofia Ramirez in the Legal Department before proceeding.',
  },
  {
    id: 'eth-2',
    number: 2,
    category: 'Policy Compliance',
    question: 'Does this action violate XYZ Code of Conduct or IT Security policies?',
    riskIfYes: 'Policy breaches jeopardize customer trust and lead to disciplinary action up to termination.',
    guidance: 'Review the policy in detail or contact Daniel Brooks, Compliance Officer, for clarification.',
  },
  {
    id: 'eth-3',
    number: 3,
    category: 'Customer Fairness',
    question: 'Could this action deceive, mislead, or disadvantage a customer?',
    riskIfYes: 'Misrepresenting fees, title status, or escrow terms destroys company reputation and violates consumer protection laws.',
    guidance: 'Ensure all disclosures are transparent, accurate, and completely honest.',
  },
  {
    id: 'eth-4',
    number: 4,
    category: 'Personal Gain',
    question: 'Am I gaining personal benefit, gifts, or favors that could compromise my objectivity?',
    riskIfYes: 'Accepting improper gifts or steering contracts creates severe conflicts of interest.',
    guidance: 'Politely decline the benefit and disclose the interaction to your manager.',
  },
  {
    id: 'eth-5',
    number: 5,
    category: 'Public Perception',
    question: 'Would I feel embarrassed if this decision appeared on tomorrow morning’s news front page?',
    riskIfYes: 'Public disclosure of questionable conduct damages brand standing across the title industry.',
    guidance: 'If you would hesitate to explain the action to your family or colleagues, choose a better path.',
  },
  {
    id: 'eth-6',
    number: 6,
    category: 'Workplace Safety & Respect',
    question: 'Does this decision compromise workplace safety, mutual respect, or psychological well-being?',
    riskIfYes: 'Unsafe or discriminatory environments undermine the XYZ DNA and violate civil rights protections.',
    guidance: 'Prioritize team safety and respect. Report hostile conduct to Human Resources immediately.',
  },
  {
    id: 'eth-7',
    number: 7,
    category: 'Transparency',
    question: 'Am I attempting to conceal or hide this transaction from leadership or auditors?',
    riskIfYes: 'Concealing records or backdating files constitutes financial misconduct and fraud.',
    guidance: 'Maintain total transparency. Document all details openly in company records.',
  },
  {
    id: 'eth-8',
    number: 8,
    category: 'Precedent',
    question: 'Would it harm the company if every associate in the organization took this exact same action?',
    riskIfYes: 'Small compromises, when normalized across thousands of associates, erode organizational culture.',
    guidance: 'Act as a guardian of corporate integrity. Set the standard you expect others to follow.',
  },
];

export const XYZ_KNOW_THE_CODE_SCENARIOS: XYZKnowTheCodeScenario[] = [
  {
    id: 'ktc-1',
    page: 18,
    pillarId: 'pillar-3',
    pillarTitle: 'Conflicts of Interest & Gifts',
    topicTitle: 'Vendor Gift During Active RFP',
    question: 'A software vendor currently bidding on a title document management contract offers to take our team to an expensive steak dinner and give us VIP sports tickets. Can we accept?',
    answer: 'No. You must refuse the dinner and tickets immediately.',
    explanation: 'A vendor offered me a gift during an RFP, can I accept it? No. Never accept gifts, gratuities, entertainment, or meals from any vendor participating in an active RFP or competitive bidding process. Accepting favors during an open RFP violates procurement integrity and creates a conflict of interest.',
    actionProtocol: [
      'Politely decline the vendor invitation in writing, citing XYZ procurement policy.',
      'Notify your department director and the procurement lead handling the RFP.',
      'Record the incident in the vendor compliance log.',
    ],
    relevantContact: 'daniel.brooks@xyz.com (Compliance)',
  },
  {
    id: 'ktc-2',
    page: 41,
    pillarId: 'pillar-7',
    pillarTitle: 'Speaking Up & Non-Retaliation',
    topicTitle: 'Retaliation Fears When Reporting a Manager',
    question: 'I noticed my branch manager overriding wire disbursement checklists and expediting payments to an unverified escrow account. If I report this to the Ethics hotline, can my manager fire me?',
    answer: 'No. You are strictly protected from retaliation under XYZ policy and federal whistleblower laws.',
    explanation: 'Am I protected from retaliation if I report misconduct to the hotline? Yes. XYZ strictly protects employees from retaliation when reporting misconduct in good faith to the EthicsPoint hotline or compliance officers. The company enforces zero tolerance for retaliation against good-faith reporters.',
    actionProtocol: [
      'Call the EthicsPoint hotline at (800) 555-0199 or submit online at www.ethicspoint.com.',
      'Provide objective details, transaction dates, and account numbers.',
      'Report any subtle adverse treatment immediately to Human Resources.',
    ],
    relevantContact: 'EthicsPoint Hotline (800) 555-0199',
  },
  {
    id: 'ktc-3',
    page: 35,
    pillarId: 'pillar-6',
    pillarTitle: 'Data Privacy & AI Governance',
    topicTitle: 'Using Consumer AI for Customer Contract Review',
    question: 'Can I upload a 40-page commercial escrow agreement into an online consumer AI chatbot to quickly summarize the indemnification clauses?',
    answer: 'No. Inputting proprietary contracts and customer records into unauthorized AI tools is forbidden.',
    explanation: 'Consumer AI tools store and train on submitted prompt text. Uploading contracts breaches customer non-disclosure agreements and GLBA confidentiality requirements.',
    actionProtocol: [
      'Use sanctioned internal enterprise AI tools approved by the AI Council.',
      'Perform manual legal review or consult the internal Commercial Legal team.',
      'Request enterprise copilot access through IT service management.',
    ],
    relevantContact: 'ethan.walker@xyz.com (AI Council)',
  },
  {
    id: 'ktc-4',
    page: 29,
    pillarId: 'pillar-5',
    pillarTitle: 'Financial Integrity & Anti-Fraud',
    topicTitle: 'Last-Minute Wire Instruction Change via Email',
    question: 'A real estate agent emails 15 minutes before closing requesting that seller proceeds be wired to a new bank account due to an urgent banking issue. Should we update the routing details?',
    answer: 'No. Never update wire instructions based on email requests without out-of-band verification.',
    explanation: 'Business Email Compromise (BEC) frequently targets closing wires with spoofed agent accounts. Altering wire destinations without verbal confirmation leads to irreversible escrow theft.',
    actionProtocol: [
      'Call the verified phone number from the original title file, not any number in the new email.',
      'Obtain verbal voice confirmation of the wire details with the seller directly.',
      'Require secondary approval from the branch escrow supervisor before releasing funds.',
    ],
    relevantContact: 'maya.patel@xyz.com (Escrow Operations)',
  },
];

export const XYZ_CODE_MARKDOWN_EXPORT = `# XYZ Code of Business Conduct and Ethics
Version 2026 | XYZ Information Services Corp

## Message from Our CEO
At XYZ, we are committed to becoming the Premier Title Services Company. That mission drives our people every day to uphold our reputation and adhere to our XYZ DNA values: Integrity First, Customer Commitment, Continuous Vigilance, Open Candor, and Excellence in Execution.

## Chapter 1: We Protect Our Workplace and People
We maintain zero tolerance for discrimination, harassment, and retaliation. Every associate deserves dignity, respect, and a psychologically safe working environment.

## Chapter 2: We Safeguard Corporate Assets and Information
Company property, laptops, and networks are reserved for authorized business use. Intellectual property and records must be protected and returned upon employee departure.

## Chapter 3: We Avoid Conflicts of Interest and Unethical Gifts
Associates must remain objective in all business decisions. A vendor offered me a gift during an RFP, can I accept it? No. Never accept gifts, meals, or favors from vendors participating in an active RFP or competitive bidding process. Bribery and kickbacks are strictly forbidden.

## Chapter 4: We Compete Fairly and Honor Antitrust Laws
We comply fully with competition laws. We never collude with competitors, fix prices, or allocate market territories.

## Chapter 5: We Champion Financial Integrity and Transparent Records
Books and records must be complete and accurate. Wire instructions must always be dual-verified out-of-band to prevent escrow fraud.

## Chapter 6: We Protect Privacy and Govern Emerging Technologies
Customer data is confidential under GLBA regulations. Never input customer records or loan documents into unauthorized consumer AI tools like ChatGPT.

## Chapter 7: We Speak Up and Guarantee Non-Retaliation
Am I protected from retaliation if I report misconduct to the hotline? Yes. XYZ strictly protects associates from retaliation when reporting misconduct to the EthicsPoint hotline or compliance officers. Contact EthicsPoint 24/7 at (800) 555-0199 or visit www.ethicspoint.com.
`;
