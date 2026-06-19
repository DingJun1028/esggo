// ESGss JunAiKey - Core Service Interfaces
// MECE Classification 24 Services Architecture

import {
  BaseEntity,
  UserEntity,
  UserPreferences,
  TrendData,
  Achievement,
  ContactInfo,
  Language,
  Theme,
  ServiceStatus,
  SubscriptionTier,
} from './index';

// Re-export basic types for convenience
export type {
  Language,
  Theme,
  ServiceStatus,
  SubscriptionTier,
  BaseEntity,
  UserEntity,
  UserPreferences,
  TrendData,
  Achievement,
  ContactInfo,
};

// ===== 1. Cognitive Intelligence Services (5 Services) =====

// 1.1 Personal ESG Dashboard
export interface ESGDashboard extends UserEntity {
  serviceType: 'esg-dashboard';
  personalMetrics: ESGMetrics;
  trends: TrendData[];
  goals: PersonalGoal[];
  achievements: Achievement[];
  peerComparison: PeerData;
}

export interface ESGMetrics {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  lastUpdated: Date;
}

export interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  category: 'environmental' | 'social' | 'governance';
}

export interface PeerData {
  percentile: number;
  rank: number;
  totalUsers: number;
  comparisonMetrics: ESGMetrics;
}

// 1.2 AI Strategy Hub
export interface AIStrategyHub extends UserEntity {
  serviceType: 'ai-strategy-hub';
  analysis: StrategicAnalysis;
  recommendations: StrategyRecommendation[];
  stakeholderRadar: StakeholderData;
  insights: AIGeneratedInsight[];
}

export interface StrategicAnalysis {
  id: string;
  currentStatus: string;
  opportunities: Opportunity[];
  risks: Risk[];
  maturityLevel: number;
  generatedAt: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeline: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface StrategyRecommendation {
  id: string;
  priority: number;
  title: string;
  description: string;
  expectedOutcome: string;
  implementationSteps: string[];
  kpis: string[];
}

export interface StakeholderData {
  stakeholders: Stakeholder[];
  relationships: Relationship[];
  influenceMatrix: InfluencePoint[];
}

export interface Stakeholder {
  id: string;
  name: string;
  type: 'investor' | 'employee' | 'customer' | 'supplier' | 'regulator' | 'community';
  influence: number;
  interest: number;
  currentAlignment: number;
}

export interface Relationship {
  from: string;
  to: string;
  strength: number;
  type: string;
}

export interface InfluencePoint {
  stakeholder: string;
  influence: number;
  interest: number;
  quadrant: 'high' | 'low';
}

export interface AIGeneratedInsight {
  id: string;
  title: string;
  content: string;
  confidence: number;
  dataSource: string[];
  generatedAt: Date;
}

// 1.3 Daily ESG Briefing
export interface DailyESGBriefing extends UserEntity {
  serviceType: 'daily-esg-briefing';
  briefings: DailyBriefing[];
  sentimentAnalysis: SentimentData;
  impactAssessments: ImpactAssessment[];
  readingHistory: ReadingRecord[];
}

export interface DailyBriefing {
  id: string;
  date: Date;
  headline: string;
  summary: string;
  articles: NewsArticle[];
  keyInsights: string[];
  relevanceScore: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  esgRelevance: number;
  summary: string;
  keywords: string[];
}

export interface SentimentData {
  overall: number;
  byCategory: {
    environmental: number;
    social: number;
    governance: number;
  };
  trend: number[];
  lastUpdated: Date;
}

export interface ImpactAssessment {
  articleId: string;
  potentialImpact: 'high' | 'medium' | 'low';
  affectedAreas: string[];
  timeline: string;
  recommendations: string[];
}

export interface ReadingRecord {
  articleId: string;
  readAt: Date;
  readTime: number;
  rating?: number;
  shared: boolean;
}

// 1.4 ESG AI Assistant
export interface ESGAIAssistant extends UserEntity {
  serviceType: 'esg-ai-assistant';
  conversations: Conversation[];
  knowledgeBase: KnowledgeItem[];
  recommendations: AssistantRecommendation[];
  learningResources: LearningResource[];
}

export interface Conversation {
  id: string;
  messages: Message[];
  context: ConversationContext;
  startedAt: Date;
  resolvedAt?: Date;
  satisfaction?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  confidence?: number;
}

export interface ConversationContext {
  industry?: string;
  companySize?: string;
  region?: string;
  topic?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Attachment {
  type: 'document' | 'image' | 'data';
  url: string;
  name: string;
  size: number;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  source: string;
  relevanceScore: number;
}

export interface AssistantRecommendation {
  id: string;
  title: string;
  description: string;
  applicableScenarios: string[];
  implementationGuide: string;
  relatedResources: string[];
  effectiveness: number;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'tool';
  url: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  tags: string[];
}

// 1.5 Trend Prediction Engine
export interface TrendPredictionEngine extends UserEntity {
  serviceType: 'trend-prediction-engine';
  predictions: Prediction[];
  riskAlerts: RiskAlert[];
  opportunities: OpportunityWindow[];
  modelAccuracy: ModelAccuracyData;
}

export interface Prediction {
  id: string;
  title: string;
  category: 'environmental' | 'social' | 'governance';
  timeframe: 'short' | 'medium' | 'long';
  confidence: number;
  currentValue: number;
  predictedValue: number;
  scenarios: Scenario[];
  generatedAt: Date;
  lastUpdated: Date;
}

export interface Scenario {
  name: string;
  probability: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  assumptions: string[];
}

export interface RiskAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  indicator: string;
  threshold: number;
  currentValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
  triggeredAt: Date;
  acknowledgedAt?: Date;
}

export interface OpportunityWindow {
  id: string;
  title: string;
  description: string;
  category: string;
  timeframe: string;
  potentialValue: number;
  requirements: string[];
  competitionLevel: 'low' | 'medium' | 'high';
  expiresAt?: Date;
}

export interface ModelAccuracyData {
  overallAccuracy: number;
  byCategory: {
    environmental: number;
    social: number;
    governance: number;
  };
  byTimeframe: {
    short: number;
    medium: number;
    long: number;
  };
  lastEvaluated: Date;
  sampleSize: number;
}

// ===== 2. Excellence & Sustainability Services (5 Services) =====

// 2.1 Corporate Health Check
export interface CorporateHealthCheck extends UserEntity {
  serviceType: 'corporate-health-check';
  healthScore: HealthScore;
  vitalSigns: VitalSign[];
  diagnostics: Diagnostic[];
  treatmentPlans: TreatmentPlan[];
}

export interface HealthScore {
  overall: number;
  byCategory: {
    environmental: number;
    social: number;
    governance: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  lastAssessed: Date;
}

export interface VitalSign {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: number[];
  lastMeasured: Date;
}

export interface Diagnostic {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  rootCauses: string[];
  affectedAreas: string[];
  urgency: 'immediate' | 'short' | 'medium' | 'long';
}

export interface TreatmentPlan {
  id: string;
  title: string;
  description: string;
  steps: TreatmentStep[];
  timeline: string;
  resources: Resource[];
  expectedOutcome: string;
  progress: number;
}

export interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  assignedTo?: string;
}

export interface Resource {
  type: 'personnel' | 'financial' | 'technological' | 'external';
  description: string;
  quantity: number;
  cost?: number;
}

// 2.2 Carbon Inventory Management
export interface CarbonInventoryManagement extends UserEntity {
  serviceType: 'carbon-inventory-management';
  inventory: CarbonInventory;
  emissionSources: EmissionSource[];
  hotspots: Hotspot[];
  reductionPathways: ReductionPathway[];
  sbtiTargets: SBTITarget[];
}

export interface CarbonInventory {
  id: string;
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  scope3Breakdown: Scope3Breakdown;
  total: number;
  baselineYear?: number;
  reductionPercentage?: number;
  verified: boolean;
  lastUpdated: Date;
}

export interface Scope3Breakdown {
  purchasedGoods: number;
  capitalGoods: number;
  fuelEnergy: number;
  transportDistribution: number;
  wasteGenerated: number;
  businessTravel: number;
  employeeCommuting: number;
  upstreamLeased: number;
  downstreamTransport: number;
  processingSold: number;
  useSoldProducts: number;
  endOfLifeTreatment: number;
  downstreamLeased: number;
  franchises: number;
  investments: number;
}

export interface EmissionSource {
  id: string;
  name: string;
  category: 'scope1' | 'scope2' | 'scope3';
  subcategory?: string;
  activityData: number;
  emissionFactor: number;
  emissions: number;
  unit: string;
  dataSource: string;
  lastUpdated: Date;
  uncertainty?: number;
}

export interface Hotspot {
  id: string;
  sourceId: string;
  sourceName: string;
  emissions: number;
  percentageOfTotal: number;
  reductionPotential: number;
  costBenefit: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ReductionPathway {
  id: string;
  title: string;
  description: string;
  targetReduction: number;
  timeframe: number;
  initiatives: Initiative[];
  totalCost: number;
  expectedSavings: number;
  roi: number;
}

export interface Initiative {
  id: string;
  name: string;
  description: string;
  emissionsReduction: number;
  cost: number;
  timeline: number;
  feasibility: 'high' | 'medium' | 'low';
  dependencies: string[];
}

export interface SBTITarget {
  id: string;
  targetType: 'absolute' | 'intensity';
  baselineYear: number;
  targetYear: number;
  reductionPercentage: number;
  scope: ['scope1', 'scope2', 'scope3'];
  status: 'committed' | 'submitted' | 'approved' | 'achieved';
  submittedAt?: Date;
  approvedAt?: Date;
}

// 2.3 Impact Restoration Lab
export interface ImpactRestorationLab extends UserEntity {
  serviceType: 'impact-restoration-lab';
  projects: RestorationProject[];
  simulations: RestorationSimulation[];
  blockchainProofs: BlockchainProof[];
  healingProtocols: HealingProtocol[];
}

export interface RestorationProject {
  id: string;
  title: string;
  description: string;
  location: GeoLocation;
  impactArea: ImpactArea;
  status: 'planning' | 'implementation' | 'monitoring' | 'completed';
  progress: number;
  baselineData: BaselineData;
  currentData: CurrentData;
  targetOutcomes: TargetOutcome[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  region?: string;
  country?: string;
}

export interface ImpactArea {
  type: 'water' | 'soil' | 'air' | 'biodiversity' | 'ecosystem';
  size: number;
  unit: string;
  severity: 'high' | 'medium' | 'low';
  affectedStakeholders: string[];
}

export interface BaselineData {
  measurementDate: Date;
  indicators: EnvironmentalIndicator[];
  quality: number;
  sources: string[];
}

export interface CurrentData {
  measurementDate: Date;
  indicators: EnvironmentalIndicator[];
  quality: number;
  sources: string[];
}

export interface EnvironmentalIndicator {
  name: string;
  value: number;
  unit: string;
  benchmark?: number;
  status: 'good' | 'fair' | 'poor';
}

export interface TargetOutcome {
  indicator: string;
  targetValue: number;
  currentValue: number;
  achievementDate?: Date;
  achieved: boolean;
}

export interface RestorationSimulation {
  id: string;
  projectId: string;
  scenario: string;
  parameters: SimulationParameter[];
  results: SimulationResult[];
  confidence: number;
  createdAt: Date;
}

export interface SimulationParameter {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface SimulationResult {
  indicator: string;
  baseline: number;
  projected: number;
  improvement: number;
  timeframe: number;
  confidence: number;
}

export interface BlockchainProof {
  id: string;
  projectId: string;
  dataHash: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  verified: boolean;
  metadata: ProofMetadata;
}

export interface ProofMetadata {
  dataType: string;
  source: string;
  collector: string;
  verificationMethod: string;
}

export interface HealingProtocol {
  id: string;
  name: string;
  description: string;
  applicableImpactTypes: string[];
  steps: ProtocolStep[];
  successCriteria: SuccessCriterion[];
  caseStudies: CaseStudy[];
}

export interface ProtocolStep {
  order: number;
  title: string;
  description: string;
  duration: number;
  resources: string[];
  risks: string[];
}

export interface SuccessCriterion {
  indicator: string;
  threshold: number;
  measurementMethod: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  outcome: string;
  lessons: string[];
  applicability: number;
}

// ===== Continue with remaining services in next file =====
