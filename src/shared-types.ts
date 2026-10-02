export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MONITORED';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  category: string;
  categoryLabel: string;
  severity: ThreatSeverity;
  sourceEndpoint: string;
  userCohort: string;
  actionDetected: string;
  status: 'PREVENTED' | 'QUARANTINED' | 'RESOLVED';
  ruleViolated: string;
  rootCause: string;
  remediationGuidance: string;
  blastRadius: string;
}

export type PlaybookDomain = 
  | 'ALL' 
  | 'AI_TOOLS' 
  | 'GIT_SECRETS' 
  | 'CREDENTIALS_MFA' 
  | 'DEVICES_PHYSICAL' 
  | 'CLOUD_STORAGE';

export interface DoDontItem {
  id: string;
  domain: PlaybookDomain;
  domainLabel: string;
  policyCode: string;
  ruleTitle: string;
  doText: string;
  dontText: string;
  rationale: string;
  realPrecedent: string;
  sanctionedAlternative: string;
}

export interface ChecklistMilestone {
  id: string;
  dayTarget: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface DilemmaChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  scoreDelta: number;
  feedback: string;
  digitalMirrorTimeline: {
    hour0: string;
    day2: string;
    day5: string;
    day10: string;
    businessImpact: string;
  };
}

export interface SecurityDilemma {
  id: string;
  title: string;
  policyCode: string;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  scenarioText: string;
  codeSnippet?: string;
  choices: DilemmaChoice[];
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  role: string;
  avatarSeed: string;
  loginTime?: string;
}

export type AuthRole = 'Incident Commander' | 'Threat Hunter' | 'SOC Security Lead' | 'Cloud Security Architect';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

export interface WidgetConfig {
  id: string;
  title: string;
  subtitle: string;
  category: 'telemetry' | 'playbook' | 'analytics' | 'simulator';
  visible: boolean;
  order: number;
  width: 'full' | 'half';
  closable: boolean;
}

export interface StewartCodeSubtopic {
  id: string;
  title: string;
  page: number;
  summary: string;
  keyRules: string[];
  fullNarrative: string;
  keyTerms?: { term: string; definition: string }[];
  associatedPolicies?: string[];
}

export interface StewartCodePillar {
  id: string;
  number: number;
  title: string;
  tagline: string;
  pageRange: string;
  summary: string;
  corePillars: string[];
  subtopics: StewartCodeSubtopic[];
}

export interface StewartEthicalQuestion {
  id: string;
  number: number;
  question: string;
  category: string;
  riskIfYes: string;
  guidance: string;
}

export interface StewartKnowTheCodeScenario {
  id: string;
  page: number;
  pillarId: string;
  pillarTitle: string;
  topicTitle: string;
  question: string;
  answer: string;
  explanation: string;
  actionProtocol: string[];
  relevantContact: string;
}

export interface ComprehensiveQuizQuestion {
  id: string;
  sourceDoc: 'IT_SECURITY_POLICY_V7' | 'CODE_OF_BUSINESS_CONDUCT';
  sourceTitle: string;
  sectionOrPillar: string;
  pageCitation: string;
  topicTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  policyDirectives: string[];
  contactOrAction: string;
}

