// ESGss JunAiKey - Remaining Service Interfaces (Services 9-24)
// MECE Classification 24 Services Architecture - Part 2

import { UserEntity } from './index';

// ===== 2.4 Sustainability Transformation Advisor =====
export interface SustainabilityTransformationAdvisor extends UserEntity {
  serviceType: 'sustainability-transformation-advisor';
  transformation: TransformationRoadmap;
  businessModelRedesign: BusinessModelDesign;
  stakeholderAlignment: StakeholderAlignment;
  changeManagement: ChangeManagementPlan;
}

export interface TransformationRoadmap {
  id: string;
  vision: string;
  currentMaturity: number;
  targetMaturity: number;
  phases: TransformationPhase[];
  milestones: TransformationMilestone[];
  timeline: string;
  budget: number;
}

export interface TransformationPhase {
  id: string;
  name: string;
  description: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  deliverables: string[];
  dependencies: string[];
  progress: number;
}

export interface TransformationMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'pending' | 'completed' | 'delayed';
  criteria: string[];
}

export interface BusinessModelDesign {
  id: string;
  currentValueProposition: string;
  targetValueProposition: string;
  revenueStreams: RevenueStream[];
  costStructures: CostStructure[];
  sustainabilityIntegration: SustainabilityIntegration;
}

export interface RevenueStream {
  id: string;
  type: 'product' | 'service' | 'subscription' | 'licensing';
  description: string;
  sustainability: 'high' | 'medium' | 'low';
  potentialRevenue: number;
}

export interface CostStructure {
  id: string;
  category: 'fixed' | 'variable';
  description: string;
  amount: number;
  sustainabilityImpact: 'positive' | 'negative' | 'neutral';
}

export interface SustainabilityIntegration {
  environmental: IntegrationLevel;
  social: IntegrationLevel;
  governance: IntegrationLevel;
}

export interface IntegrationLevel {
  current: number;
  target: number;
  initiatives: string[];
  kpis: string[];
}

export interface StakeholderAlignment {
  stakeholders: TransformationStakeholder[];
  engagementPlan: EngagementPlan[];
  feedbackLoop: FeedbackLoop[];
}

export interface TransformationStakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'high' | 'medium' | 'low';
  support: 'supportive' | 'neutral' | 'resistant';
  concerns: string[];
  engagementPlan: string;
}

export interface EngagementPlan {
  stakeholderId: string;
  activities: EngagementActivity[];
  timeline: string;
  owner: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface EngagementActivity {
  type: 'meeting' | 'workshop' | 'training' | 'communication';
  title: string;
  description: string;
  date: Date;
  participants: string[];
  outcome?: string;
}

export interface FeedbackLoop {
  id: string;
  channel: string;
  frequency: string;
  metrics: string[];
  lastCollected: Date;
  actionTaken: string[];
}

export interface ChangeManagementPlan {
  readinessAssessment: ReadinessAssessment;
  communicationStrategy: CommunicationStrategy;
  trainingPrograms: TrainingProgram[];
  resistanceManagement: ResistanceManagement;
}

export interface ReadinessAssessment {
  overallScore: number;
  dimensions: {
    leadership: number;
    culture: number;
    capabilities: number;
    processes: number;
  };
  gaps: string[];
  recommendations: string[];
}

export interface CommunicationStrategy {
  keyMessages: string[];
  channels: string[];
  timeline: CommunicationTimeline[];
  metrics: string[];
}

export interface CommunicationTimeline {
  phase: string;
  message: string;
  channel: string;
  date: Date;
  audience: string[];
}

export interface TrainingProgram {
  id: string;
  title: string;
  targetAudience: string[];
  content: string[];
  duration: number;
  delivery: 'online' | 'in-person' | 'hybrid';
  completionRate: number;
  effectiveness: number;
}

export interface ResistanceManagement {
  resistanceSources: ResistanceSource[];
  mitigationStrategies: MitigationStrategy[];
  monitoringPlan: MonitoringPlan;
}

export interface ResistanceSource {
  source: string;
  impact: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  description: string;
}

export interface MitigationStrategy {
  resistanceSourceId: string;
  strategy: string;
  owner: string;
  timeline: string;
  effectiveness: 'high' | 'medium' | 'low';
}

export interface MonitoringPlan {
  indicators: string[];
  frequency: string;
  responsible: string[];
  reporting: string;
}

// 2.5 Green Financing Assistant
export interface GreenFinancingAssistant extends UserEntity {
  serviceType: 'green-financing-assistant';
  financingOpportunities: FinancingOpportunity[];
  applications: FinancingApplication[];
  complianceChecks: ComplianceCheck[];
  investorConnections: InvestorConnection[];
}

export interface FinancingOpportunity {
  id: string;
  title: string;
  provider: string;
  type: 'grant' | 'loan' | 'equity' | 'bond' | 'fund';
  amount: {
    min: number;
    max: number;
    currency: string;
  };
  eligibility: EligibilityCriteria[];
  applicationDeadline: Date;
  processTimeline: string;
  requirements: string[];
  sustainabilityScore: number;
  status: 'available' | 'closed' | 'archived';
}

export interface EligibilityCriteria {
  category: 'industry' | 'size' | 'revenue' | 'region' | 'esg_score' | 'certification';
  requirement: string;
  required: boolean;
  weight?: number;
}

export interface FinancingApplication {
  id: string;
  opportunityId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Date;
  decisionDate?: Date;
  documents: ApplicationDocument[];
  checklists: ApplicationChecklist[];
  communications: ApplicationCommunication[];
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: 'financial_statement' | 'esg_report' | 'business_plan' | 'project_proposal' | 'legal';
  status: 'required' | 'submitted' | 'approved' | 'rejected';
  uploadedAt?: Date;
  reviewedAt?: Date;
  feedback?: string;
}

export interface ApplicationChecklist {
  id: string;
  category: string;
  items: ChecklistItem[];
  completion: number;
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface ApplicationCommunication {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  sentAt: Date;
  type: 'inquiry' | 'request' | 'response' | 'notification';
}

export interface ComplianceCheck {
  id: string;
  applicationId: string;
  framework: string;
  requirements: ComplianceRequirement[];
  overallScore: number;
  gaps: string[];
  recommendations: string[];
  lastChecked: Date;
}

export interface ComplianceRequirement {
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial';
  evidence?: string;
  severity: 'high' | 'medium' | 'low';
}

export interface InvestorConnection {
  id: string;
  investor: Investor;
  applicationId: string;
  status: 'identified' | 'contacted' | 'interested' | 'negotiating' | 'invested';
  interactions: InvestorInteraction[];
  terms?: InvestmentTerms;
}

export interface Investor {
  id: string;
  name: string;
  type: 'venture_capital' | 'private_equity' | 'institutional' | 'impact_investor' | 'bank';
  focus: string[];
  geography: string[];
  investmentRange: {
    min: number;
    max: number;
  };
  esgRequirements: string[];
  contact: ContactInfo;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface InvestorInteraction {
  id: string;
  date: Date;
  type: 'meeting' | 'call' | 'email' | 'conference';
  participants: string[];
  summary: string;
  outcomes: string[];
  nextSteps: string[];
}

export interface InvestmentTerms {
  amount: number;
  currency: string;
  equity: number;
  valuation: number;
  conditions: string[];
  timeline: string;
  esgConditions: string[];
}

// ===== 3. Governance & Compliance Services (5 Services) =====

// 3.1 Automated Report Generation
export interface AutomatedReportGeneration extends UserEntity {
  serviceType: 'automated-report-generation';
  reports: ESGReport[];
  templates: ReportTemplate[];
  standards: ReportingStandard[];
  generationSettings: GenerationSettings;
}

export interface ESGReport {
  id: string;
  title: string;
  framework: 'GRI' | 'SASB' | 'TCFD' | 'CSRD' | 'combined';
  year: number;
  status: 'draft' | 'review' | 'approved' | 'published';
  completionRate: number;
  sections: ReportSection[];
  metadata: ReportMetadata;
  generatedAt: Date;
  lastUpdated: Date;
}

export interface ReportSection {
  id: string;
  title: string;
  standard?: string;
  content: string;
  status: 'complete' | 'in_progress' | 'missing';
  dataSource: string[];
  indicators: string[];
  lastUpdated: Date;
}

export interface ReportMetadata {
  company: string;
  reportingPeriod: string;
  assuranceProvider?: string;
  coverage: string[];
  boundaries: string[];
  materialTopics: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  framework: string;
  version: string;
  sections: TemplateSection[];
  industry?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  dataPoints: string[];
  order: number;
  parentSection?: string;
}

export interface ReportingStandard {
  id: string;
  name: string;
  version: string;
  description: string;
  requirements: StandardRequirement[];
  lastUpdated: Date;
}

export interface StandardRequirement {
  id: string;
  category: string;
  requirement: string;
  dataPoints: string[];
  mandatory: boolean;
  guidance?: string;
}

export interface GenerationSettings {
  autoRefresh: boolean;
  refreshFrequency: 'daily' | 'weekly' | 'monthly';
  dataSources: string[];
  approvalWorkflow: ApprovalWorkflow;
  notifications: NotificationPreferences;
}

export interface ApprovalWorkflow {
  enabled: boolean;
  reviewers: Reviewer[];
  steps: WorkflowStep[];
}

export interface Reviewer {
  userId: string;
  name: string;
  role: string;
  permissions: ('review' | 'approve' | 'edit')[];
}

export interface WorkflowStep {
  order: number;
  name: string;
  type: 'review' | 'approval' | 'edit';
  assignees: string[];
  required: boolean;
  timeout?: number;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  events: NotificationEvent[];
}

export interface NotificationEvent {
  event: string;
  enabled: boolean;
  recipients: string[];
}

// 3.2 Immutable Evidence Vault
export interface ImmutableEvidenceVault extends UserEntity {
  serviceType: 'immutable-evidence-vault';
  evidence: EvidenceItem[];
  collections: EvidenceCollection[];
  verifications: Verification[];
  blockchainRecords: BlockchainRecord[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'data';
  category: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  hash: string;
  uploadedAt: Date;
  uploadedBy: string;
  verified: boolean;
  blockchainAnchored: boolean;
  blockchainAnchor?: BlockchainAnchor;
  metadata: EvidenceMetadata;
  tags: string[];
  collections: string[];
}

export interface EvidenceMetadata {
  date: Date;
  location?: string;
  author?: string;
  source: string;
  confidence: number;
  relevance: number;
  expirationDate?: Date;
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
}

export interface BlockchainAnchor {
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  network: string;
  confirmationCount: number;
}

export interface EvidenceCollection {
  id: string;
  name: string;
  description: string;
  evidenceIds: string[];
  purpose: string;
  sharingSettings: SharingSettings;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

export interface SharingSettings {
  public: boolean;
  sharedWith: string[];
  permissions: ('view' | 'download' | 'share')[];
  expiryDate?: Date;
}

export interface Verification {
  id: string;
  evidenceId: string;
  type: 'hash' | 'blockchain' | 'third_party' | 'manual';
  status: 'pending' | 'verified' | 'failed';
  result?: VerificationResult;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface VerificationResult {
  valid: boolean;
  confidence: number;
  details: string;
  evidence?: string;
}

export interface BlockchainRecord {
  id: string;
  hash: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  network: string;
  data: string;
  verified: boolean;
  gasUsed?: number;
}

// 3.3 Integrity Passport
export interface IntegrityPassport extends UserEntity {
  serviceType: 'integrity-passport';
  passport: PassportProfile;
  fourPillars: FourPillars;
  badges: TrustBadge[];
  qrCode: QRCodeData;
  verificationHistory: VerificationHistory[];
}

export interface PassportProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  trustScore: number;
  reputationScore: number;
  verified: boolean;
  createdAt: Date;
  lastUpdated: Date;
  publicProfile: boolean;
  bio?: string;
  avatar?: string;
}

export interface FourPillars {
  selfAwareness: PillarScore;
  enlightenment: PillarScore;
  selfReliance: PillarScore;
  altruism: PillarScore;
}

export interface PillarScore {
  score: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  achievements: Achievement[];
  lastAssessed: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  points: number;
  category: string;
}

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  earnedAt: Date;
  expiresAt?: Date;
  verifiedBy: string;
  criteria: string[];
}

export interface QRCodeData {
  data: string;
  url: string;
  generatedAt: Date;
  expiresAt: Date;
  version: string;
  scanCount: number;
}

export interface VerificationHistory {
  id: string;
  verifierId: string;
  verifierName: string;
  verifiedAt: Date;
  method: 'qr_scan' | 'nfc' | 'manual' | 'api';
  location?: string;
  purpose: string;
  result: 'verified' | 'failed' | 'pending';
}

// ===== Continue with remaining services in next file =====
