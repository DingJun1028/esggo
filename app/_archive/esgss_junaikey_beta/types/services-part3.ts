// ESGss JunAiKey - Final Service Interfaces (Services 16-24)
// MECE Classification 24 Services Architecture - Part 3

import { UserEntity, ContactInfo, TrendData, Achievement } from './index';

// ===== 3.2 Immutable Evidence Vault =====
export interface ImmutableEvidenceVault extends UserEntity {
  serviceType: 'immutable-evidence-vault';
  evidenceChain: EvidenceChain[];
  securityLevel: SecurityLevel;
  accessControls: AccessControl[];
  verificationHistory: VerificationHistory[];
  lastVerification?: Date;
}

export interface EvidenceChain {
  id: string;
  title: string;
  description: string;
  category: string;
  blockchainHash: string;
  timestamp: Date;
  status: EvidenceChainStatus;
  metadata: EvidenceMetadata;
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  verifications: Verification[];
}

export enum EvidenceChainStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export interface EvidenceMetadata {
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  originalName: string;
  checksum: string;
  tags: string[];
  location: string;
}

export interface Verification {
  id: string;
  timestamp: Date;
  verifiedBy: string;
  result: 'valid' | 'invalid' | 'tampered';
  details: string;
  blockchainVerified: boolean;
}

export interface SecurityLevel {
  overallScore: number;
  encryptionLevel: 'standard' | 'high' | 'military';
  multiFactorAuth: boolean;
  auditTrail: boolean;
  lastAssessment: Date;
}

export interface AccessControl {
  userId: string;
  permissionLevel: 'read' | 'write' | 'admin' | 'owner';
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  restrictions: string[];
}

export interface VerificationHistory {
  id: string;
  evidenceId: string;
  verificationType: 'blockchain' | 'checksum' | 'manual';
  result: 'pass' | 'fail' | 'warning';
  timestamp: Date;
  verifiedBy: string;
  details: string;
}

// ===== 3.3 Integrity Passport =====
export interface IntegrityPassport extends UserEntity {
  serviceType: 'integrity-passport';
  passportData: PassportData;
  credentials: Credential[];
  verificationStatus: VerificationStatus;
  auditTrail: AuditEntry[];
  sharingSettings: SharingSettings;
}

export interface PassportData {
  passportId: string;
  holder: string;
  organization: string;
  issuedAt: Date;
  expiresAt: Date;
  version: string;
  blockchainAddress: string;
  digitalSignature: string;
}

export interface Credential {
  id: string;
  type: 'certification' | 'achievement' | 'verification' | 'endorsement';
  title: string;
  issuer: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationCode: string;
  blockchainVerified: boolean;
  metadata: CredentialMetadata;
}

export interface CredentialMetadata {
  category: string;
  level: string;
  score?: number;
  description: string;
  evidence: string[];
  tags: string[];
}

export interface VerificationStatus {
  overallStatus: 'verified' | 'pending' | 'expired' | 'suspended';
  score: number;
  lastVerified: Date;
  nextVerificationDue: Date;
  verifiedBy: string;
  flags: VerificationFlag[];
}

export interface VerificationFlag {
  type: 'warning' | 'error' | 'info';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  blockchainRecorded: boolean;
}

export interface SharingSettings {
  publicProfile: boolean;
  shareCredentials: boolean;
  shareVerificationStatus: boolean;
  allowedRecipients: string[];
  expirationSettings: ExpirationSettings;
}

export interface ExpirationSettings {
  autoExpire: boolean;
  expireAfterViews?: number;
  expireAfterDays?: number;
  customExpireDate?: Date;
}

// ===== 3.4 Compliance Risk Monitoring =====
export interface ComplianceRiskMonitoring extends UserEntity {
  serviceType: 'compliance-risk-monitoring';
  risks: ComplianceRisk[];
  alerts: RiskAlert[];
  regulations: Regulation[];
  monitoringSettings: MonitoringSettings;
}

export interface ComplianceRisk {
  id: string;
  title: string;
  category: 'environmental' | 'social' | 'governance' | 'financial' | 'operational';
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  impact: number;
  description: string;
  affectedRegulations: string[];
  mitigationPlan: MitigationPlan;
  status: 'active' | 'mitigated' | 'accepted' | 'closed';
  assignedTo: string;
  identifiedAt: Date;
  lastReviewed: Date;
}

export interface MitigationPlan {
  id: string;
  riskId: string;
  actions: MitigationAction[];
  timeline: string;
  budget: number;
  owner: string;
  progress: number;
}

export interface MitigationAction {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  assignedTo: string;
  dueDate: Date;
  evidence?: string;
}

export interface RiskAlert {
  id: string;
  riskId: string;
  type: 'new_risk' | 'risk_escalation' | 'regulation_change' | 'deadline_approaching';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  recipients: string[];
  readBy: string[];
}

export interface Regulation {
  id: string;
  name: string;
  description: string;
  jurisdiction: string;
  category: string;
  effectiveDate: Date;
  status: 'active' | 'pending' | 'superseded' | 'repealed';
  requirements: RegulationRequirement[];
  lastUpdated: Date;
  changes: RegulationChange[];
}

export interface RegulationRequirement {
  id: string;
  description: string;
  mandatory: boolean;
  deadline?: Date;
  penalties?: string;
  evidence: string[];
}

export interface RegulationChange {
  type: 'new' | 'amended' | 'repealed';
  description: string;
  effectiveDate: Date;
  previousVersion?: string;
}

export interface MonitoringSettings {
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  scope: string[];
  alertThresholds: AlertThreshold[];
  autoAssignment: boolean;
  reporting: ReportingSettings;
}

export interface AlertThreshold {
  riskType: string;
  severity: string;
  threshold: number;
  action: 'alert' | 'escalate' | 'auto_assign';
}

export interface ReportingSettings {
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'email' | 'dashboard' | 'pdf';
}

// 3.5 Board Dashboard
export interface BoardDashboard extends UserEntity {
  serviceType: 'board-dashboard';
  kpis: BoardKPI[];
  riskHeatmap: RiskHeatmap;
  peerComparison: PeerComparison;
  decisionSupport: DecisionSupport[];
}

export interface BoardKPI {
  id: string;
  title: string;
  category: 'financial' | 'esg' | 'operational' | 'strategic';
  currentValue: number;
  targetValue: number;
  trend: 'improving' | 'stable' | 'declining';
  variance: number;
  lastUpdated: Date;
  unit: string;
  importance: 'high' | 'medium' | 'low';
}

export interface RiskHeatmap {
  risks: HeatmapRisk[];
  categories: string[];
  impactLevels: string[];
  probabilityLevels: string[];
  lastGenerated: Date;
}

export interface HeatmapRisk {
  id: string;
  title: string;
  impact: number;
  probability: number;
  category: string;
  description: string;
  owner: string;
}

export interface PeerComparison {
  company: string;
  metrics: ComparisonMetric[];
  benchmark: string;
  lastUpdated: Date;
}

export interface ComparisonMetric {
  metric: string;
  company: number;
  peerAverage: number;
  peerBest: number;
  percentile: number;
}

export interface DecisionSupport {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  recommendation: string;
  confidence: number;
  dataSources: string[];
  generatedAt: Date;
}

export interface DecisionOption {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  impact: {
    financial: number;
    esg: number;
    risk: number;
  };
  timeline: string;
}

// ===== 4. Agency & Automation Services (4 Services) =====

// 4.1 AI Agent Forge
export interface AIAgentForge extends UserEntity {
  serviceType: 'ai-agent-forge';
  agents: AIAgent[];
  agentTemplates: AgentTemplate[];
  deployments: AgentDeployment[];
  performanceMetrics: AgentPerformance[];
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: 'task_automation' | 'data_analysis' | 'communication' | 'monitoring';
  purpose: string;
  capabilities: string[];
  personality: AgentPersonality;
  logic: AgentLogic;
  training: AgentTraining;
  status: 'training' | 'ready' | 'deployed' | 'inactive';
  createdAt: Date;
  version: string;
}

export interface AgentPersonality {
  tone: 'professional' | 'friendly' | 'formal' | 'casual';
  responseStyle: 'concise' | 'detailed' | 'conversational';
  language: string[];
  culturalContext: string[];
  empathy: number;
  proactivity: number;
}

export interface AgentLogic {
  rules: LogicRule[];
  workflows: AgentWorkflow[];
  integrations: AgentIntegration[];
  failoverBehavior: string;
}

export interface LogicRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
}

export interface WorkflowStep {
  order: number;
  type: 'action' | 'decision' | 'integration' | 'notification';
  config: any;
  timeout?: number;
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'manual' | 'webhook';
  config: any;
}

export interface AgentIntegration {
  id: string;
  type: 'api' | 'database' | 'file_system' | 'messaging';
  config: any;
  authentication: any;
}

export interface AgentTraining {
  datasets: string[];
  trainingProgress: number;
  accuracy: number;
  lastTrained: Date;
  trainingSchedule: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  predefinedLogic: AgentLogic;
  defaultPersonality: AgentPersonality;
  requiredIntegrations: string[];
  useCases: string[];
}

export interface AgentDeployment {
  id: string;
  agentId: string;
  environment: 'development' | 'staging' | 'production';
  config: DeploymentConfig;
  deployedAt: Date;
  deployedBy: string;
  status: 'running' | 'stopped' | 'error';
}

export interface DeploymentConfig {
  resources: ResourceAllocation;
  scaling: ScalingConfig;
  monitoring: MonitoringConfig;
}

export interface ResourceAllocation {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetUtilization: number;
}

export interface MonitoringConfig {
  metrics: string[];
  alerts: string[];
  logs: boolean;
}

export interface AgentPerformance {
  agentId: string;
  metrics: PerformanceMetric[];
  lastUpdated: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  threshold?: number;
}

// 4.2 Mission Matrix
export interface MissionMatrix extends UserEntity {
  serviceType: 'mission-matrix';
  missions: Mission[];
  taskLists: TaskList[];
  executions: MissionExecution[];
  analytics: MissionAnalytics;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  assignedTo: string[];
  tasks: string[];
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  progress: number;
}

export interface TaskList {
  id: string;
  missionId: string;
  name: string;
  tasks: Task[];
  order: number;
  completedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
  tags: string[];
  evidence?: string[];
  verification?: TaskVerification;
}

export interface TaskVerification {
  required: boolean;
  method: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  result: 'pass' | 'fail' | 'pending';
  notes?: string;
}

export interface MissionExecution {
  id: string;
  missionId: string;
  executor: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  results: ExecutionResult[];
  logs: ExecutionLog[];
}

export interface ExecutionResult {
  taskName: string;
  outcome: 'success' | 'failure' | 'partial';
  details: string;
  evidence?: string[];
  timestamp: Date;
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  context?: any;
}

export interface MissionAnalytics {
  totalMissions: number;
  completedMissions: number;
  successRate: number;
  averageCompletionTime: number;
  byCategory: CategoryAnalytics[];
  byAssignee: AssigneeAnalytics[];
  trends: TrendData[];
}

export interface CategoryAnalytics {
  category: string;
  total: number;
  completed: number;
  successRate: number;
  averageTime: number;
}

export interface AssigneeAnalytics {
  userId: string;
  name: string;
  assigned: number;
  completed: number;
  successRate: number;
  averageTime: number;
}

// 4.3 Intelligent Workflow
export interface IntelligentWorkflow extends UserEntity {
  serviceType: 'intelligent-workflow';
  workflows: Workflow[];
  executions: WorkflowExecution[];
  integrations: WorkflowIntegration[];
  performance: WorkflowPerformance[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  status: 'draft' | 'active' | 'inactive';
  createdBy: string;
  createdAt: Date;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision' | 'integration' | 'delay' | 'notification';
  position: { x: number; y: number };
  config: any;
  metadata: {
    name: string;
    description?: string;
  };
}

export interface WorkflowConnection {
  id: string;
  sourceNode: string;
  targetNode: string;
  condition?: string;
  label?: string;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: any;
  description?: string;
  scope: 'global' | 'execution';
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  triggeredBy: string;
  variables: Record<string, any>;
  nodeExecutions: NodeExecution[];
  errors: WorkflowError[];
}

export interface NodeExecution {
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  input?: any;
  output?: any;
  error?: string;
}

export interface WorkflowError {
  nodeId: string;
  message: string;
  timestamp: Date;
  stack?: string;
}

export interface WorkflowIntegration {
  id: string;
  name: string;
  type: 'api' | 'database' | 'email' | 'file' | 'webhook';
  configuration: any;
  authentication: any;
  status: 'active' | 'inactive' | 'error';
  lastTested?: Date;
  testResult?: TestResult;
}

export interface TestResult {
  success: boolean;
  responseTime: number;
  message: string;
  timestamp: Date;
}

export interface WorkflowPerformance {
  workflowId: string;
  totalExecutions: number;
  successRate: number;
  averageDuration: number;
  errorRate: number;
  lastUpdated: Date;
  byDay: DailyPerformance[];
}

export interface DailyPerformance {
  date: Date;
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
}

// 4.4 Smart Notification System
export interface SmartNotificationSystem extends UserEntity {
  serviceType: 'smart-notification-system';
  notifications: Notification[];
  channels: NotificationChannel[];
  notificationPreferences: NotificationPreferences;
  analytics: NotificationAnalytics;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  recipients: NotificationRecipient[];
  channels: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  metadata: NotificationMetadata;
}

export interface NotificationRecipient {
  userId: string;
  channelPreferences: string[];
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  error?: string;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in_app' | 'webhook' | 'slack' | 'teams';
  configuration: any;
  enabled: boolean;
  status: 'active' | 'inactive' | 'error';
  lastTested?: Date;
}

export interface NotificationMetadata {
  source: string;
  relatedEntity?: string;
  entityType?: string;
  actionUrl?: string;
  imageUrl?: string;
  tags: string[];
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  categories: CategoryPreference[];
  globalSettings: GlobalNotificationSettings;
  schedule: NotificationSchedule;
}

export interface CategoryPreference {
  category: string;
  enabled: boolean;
  channels: string[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: QuietHours;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  weekends: boolean;
}

export interface GlobalNotificationSettings {
  doNotDisturb: boolean;
  digestMode: boolean;
  maxPerDay: number;
  language: string;
}

export interface NotificationSchedule {
  enabled: boolean;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
    days: number[];
  };
}

export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  deliveryRate: number;
  readRate: number;
  byType: TypeAnalytics[];
  byChannel: ChannelAnalytics[];
  byCategory: CategoryAnalytics[];
  trends: TrendData[];
}

export interface TypeAnalytics {
  type: string;
  sent: number;
  delivered: number;
  read: number;
  readRate: number;
}

export interface ChannelAnalytics {
  channel: string;
  sent: number;
  delivered: number;
  read: number;
  deliveryRate: number;
  readRate: number;
}

export interface CategoryAnalytics {
  category: string;
  sent: number;
  delivered: number;
  read: number;
  readRate: number;
}

// ===== 5. Ecosystem & Collaboration Services (5 Services) =====

// 5.1 Partner Alliance Portal
export interface PartnerAlliancePortal extends UserEntity {
  serviceType: 'partner-alliance-portal';
  alliances: Alliance[];
  partners: Partner[];
  sharedResources: SharedResource[];
  collaborationProjects: CollaborationProject[];
}

export interface Alliance {
  id: string;
  name: string;
  description: string;
  purpose: string;
  status: 'forming' | 'active' | 'inactive' | 'dissolved';
  partners: string[];
  governance: AllianceGovernance;
  sharedGoals: SharedGoal[];
  collaborations: string[];
  createdAt: Date;
  createdBy: string;
}

export interface AllianceGovernance {
  leadership: AllianceLeadership[];
  decisionMaking: DecisionMakingProcess;
  votingRights: VotingRights[];
  contributions: Contribution[];
}

export interface AllianceLeadership {
  partnerId: string;
  role: string;
  responsibilities: string[];
  termStart: Date;
  termEnd?: Date;
}

export interface DecisionMakingProcess {
  consensusRequired: boolean;
  votingMethod: 'majority' | 'supermajority' | 'unanimous';
  quorum: number;
  vetoPower: string[];
}

export interface VotingRights {
  partnerId: string;
  votes: number;
  votingCategories: string[];
}

export interface Contribution {
  partnerId: string;
  type: 'financial' | 'resources' | 'expertise' | 'technology' | 'network';
  value: number;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annual';
  status: 'committed' | 'delivered' | 'overdue';
}

export interface SharedGoal {
  id: string;
  title: string;
  description: string;
  category: 'esg' | 'business' | 'innovation' | 'social';
  targets: GoalTarget[];
  metrics: GoalMetric[];
  deadline: Date;
  progress: number;
}

export interface GoalTarget {
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  dueDate: Date;
  responsible: string[];
}

export interface GoalMetric {
  name: string;
  value: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
}

export interface Partner {
  id: string;
  name: string;
  type: 'corporate' | 'ngo' | 'academic' | 'government' | 'individual';
  industry: string;
  location: string;
  contact: PartnerContact;
  capabilities: string[];
  esgScore?: number;
  reliability: number;
  responseTime: number;
}

export interface PartnerContact {
  primaryContact: ContactInfo;
  alternativeContacts: ContactInfo[];
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface SharedResource {
  id: string;
  allianceId: string;
  title: string;
  description: string;
  type: 'document' | 'tool' | 'data' | 'expertise' | 'funding';
  url?: string;
  accessLevel: 'public' | 'alliance' | 'restricted';
  permissions: ResourcePermission[];
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
}

export interface ResourcePermission {
  partnerId: string;
  permissions: ('view' | 'download' | 'edit' | 'share')[];
  grantedAt: Date;
  grantedBy: string;
  expiresAt?: Date;
}

export interface CollaborationProject {
  id: string;
  allianceId: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  partners: string[];
  timeline: ProjectTimeline;
  budget: ProjectBudget;
  deliverables: Deliverable[];
  progress: number;
  createdBy: string;
  createdAt: Date;
}

export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  deliverables: string[];
  responsible: string[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  achievedDate?: Date;
  criteria: string[];
  status: 'pending' | 'achieved' | 'overdue';
}

export interface ProjectBudget {
  total: number;
  currency: string;
  contributions: BudgetContribution[];
  expenses: BudgetExpense[];
  remaining: number;
}

export interface BudgetContribution {
  partnerId: string;
  amount: number;
  committed: boolean;
  received: boolean;
  receivedAt?: Date;
}

export interface BudgetExpense {
  category: string;
  amount: number;
  approved: boolean;
  spent: number;
  date: Date;
  description: string;
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  type: 'report' | 'tool' | 'service' | 'outcome';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string[];
  dueDate: Date;
  completedAt?: Date;
  quality: number;
}

// ===== Continue with remaining services in next file =====
