export enum ESGKnowledgeBase {
  ESG_STANDARDS = 'esg_standards',
  GRI_STANDARDS = 'gri_standards',
  TCFD_FRAMEWORK = 'tcfd_framework',
  SASB_STANDARDS = 'sasb_standards',
  SDGS_GOALS = 'sdgs_goals',
  CARBON_EMISSION = 'carbon_emission',
  ESG_REGULATIONS = 'esg_regulations',
  BEST_PRACTICES = 'best_practices',
}

export enum ARVOStage {
  ANALYZE = 'ANALYZE',
  REASON = 'REASON',
  VERIFY = 'VERIFY',
  ORCHESTRATE = 'ORCHESTRATE',
}

export enum SkillCategory {
  ESG_ANALYSIS = 'ESG_ANALYSIS',
  CARBON_ACCOUNTING = 'CARBON_ACCOUNTING',
  REGULATORY_COMPLIANCE = 'REGULATORY_COMPLIANCE',
  STAKEHOLDER_ENGAGEMENT = 'STAKEHOLDER_ENGAGEMENT',
  DATA_VERIFICATION = 'DATA_VERIFICATION',
}

export enum MasteryLevel {
  NOVICE = 'NOVICE',
  APPRENTICE = 'APPRENTICE',
  JOURNEYMAN = 'JOURNEYMAN',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER',
}

export interface IKnowledgeRecord {
  id: string;
  content: string;
  source: string;
  kb: ESGKnowledgeBase;
  metadata?: Record<string, any>;
  embedding?: number[];
  createdAt: number;
}

export interface IRAGResult {
  answer: string;
  sources: { content: string; source: string; score: number }[];
  confidence: number;
  tokensUsed?: number;
}

export interface IARVOPlan {
  taskId: string;
  currentStage: ARVOStage;
  findings: string[];
  reasoning: string;
  verificationStatus: 'PENDING' | 'PASSED' | 'FAILED';
  skillsRequired: string[];
}

export interface IAgentProfile {
  id: string;
  name: string;
  role: string;
  skills: string[];
  status: 'IDLE' | 'BUSY' | 'EVOLVING';
  memory_pt: number;
}

export interface ISkillNode {
  id: string;
  uuid?: string;
  name: string;
  layer: number; // 0-7
  category: SkillCategory;
  description: string;
  hitlRequired: boolean;
  level: MasteryLevel;
  experience: number;
  unlocked_at?: string;
  certificate_hash?: string;
}

export interface IAwakeningResult {
  thought: string;
  action: string;
  reasoning: string;
  confidence: number;
  metadata?: Record<string, any>;
  skill_points_earned?: number;
}

export interface IHITLProposal {
  id: string;
  agentId: string;
  action: string;
  parameters: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rationale: string;
}

export interface IServiceModule {
  id: string;
  uuid: string;
  name: string;
  route: string;
  domain: string;
}

export interface IEsgMetric {
  id: string;
  metric_id?: string;
  category: "E" | "S" | "G";
  year: number;
  name: string;
  metric_name?: string;
  value: number;
  target_value?: number;
  unit: string;
  status: string;
}

export interface IEvidenceRecord {
  id: string;
  record_id: string;
  type: string;
  timestamp: string;
  hash: string;
  status: string;
  variant: "optimal" | "critical" | "lethal";
  owner_id?: string;
}

export interface IMaterialityTopic {
  id: string;
  topic_name: string;
  category: "E" | "S" | "G";
  business_impact: number;
  stakeholder_importance: number;
  description?: string;
}

export interface ISupplyChainVendor {
  id: string;
  vendor_name: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  compliance_score: number;
  carbon_emission: number;
  risk_level: "Low" | "Medium" | "High" | "Critical";
  last_audit_date: string;
  status: "Active" | "Under Review" | "Suspended";
}

export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  goodness_coins: number;
  sustainability_gems: number;
}

export interface ICommunityPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  likes: number;
  created_at: string;
}

export interface IVillageMember {
  id: string;
  user_id: string;
  village_name: string;
  level: number;
  title: string;
  reputation: number;
}

export interface IOmniNote {
  id: string;
  note_id: string;
  type: "no-action" | "insight";
  title: string;
  content: string;
  variant: "optimal" | "critical" | "lethal";
  dimensions: {
    truthful: number;
    transferful: number;
    thankful: number;
    tasteful: number;
    trustful: number;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
  spirit_feedback?: string;
  hash?: string;
}

export interface IApiResult<T> {
  data: T;
  error?: any;
}
