// ESGss JunAiKey - Final Service Interfaces (Services 20-24)
// MECE Classification 24 Services Architecture - Part 4

import { UserEntity, ContactInfo, TrendData } from './index';

// ===== 5.2 Berkeley Certification Academy =====
export interface BerkeleyCertificationAcademy extends UserEntity {
  serviceType: 'berkeley-certification-academy';
  courses: Course[];
  enrollments: Enrollment[];
  assessments: Assessment[];
  certificates: Certificate[];
  progress: LearningProgress[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules: CourseModule[];
  prerequisites: string[];
  tags: string[];
  rating: number;
  enrollmentCount: number;
  activeEnrollments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  content: CourseContent[];
  order: number;
  duration: number;
  isRequired: boolean;
}

export interface CourseContent {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'assignment';
  title: string;
  description: string;
  url?: string;
  content: string;
  duration?: number;
  order: number;
  isCompleted: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress: number;
  completedModules: string[];
  currentModule?: string;
  estimatedCompletion?: Date;
  lastAccessedAt: Date;
}

export interface Assessment {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam';
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  maxAttempts: number;
  isGraded: boolean;
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  type: 'completion' | 'mastery' | 'excellence';
  issuedAt: Date;
  expiresAt?: Date;
  credentialId: string;
  verificationUrl: string;
  metadata: CertificateMetadata;
}

export interface CertificateMetadata {
  score: number;
  completionTime: number;
  instructor: string;
  skills: string[];
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface LearningProgress {
  userId: string;
  overallProgress: number;
  coursesCompleted: number;
  coursesInProgress: number;
  skillsAcquired: string[];
  xpPoints: number;
  level: number;
  badges: Badge[];
  streak: number;
  lastActiveAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date;
  level: number;
}

// ===== 5.3 Supply Chain Collaboration Platform =====
export interface SupplyChainCollaborationPlatform extends UserEntity {
  serviceType: 'supply-chain-collaboration-platform';
  suppliers: Supplier[];
  assessments: SupplierAssessment[];
  collaborations: SupplyChainCollaboration[];
  performance: SupplyChainPerformance[];
  improvements: ImprovementInitiative[];
}

export interface Supplier {
  id: string;
  name: string;
  type: 'raw_materials' | 'manufacturing' | 'logistics' | 'services';
  industry: string;
  location: string;
  contact: ContactInfo;
  esgScore: ESGLensScore;
  certifications: Certification[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'under_review';
  onboardedAt: Date;
  lastAssessed: Date;
}

export interface ESGLensScore {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  type: string;
  validFrom: Date;
  validTo?: Date;
  status: 'active' | 'expired' | 'pending';
  documentUrl?: string;
}

export interface SupplierAssessment {
  id: string;
  supplierId: string;
  type: 'initial' | 'annual' | 'targeted';
  methodology: string;
  scores: AssessmentScore[];
  findings: AssessmentFinding[];
  recommendations: string[];
  assessor: string;
  assessedAt: Date;
  nextAssessment: Date;
  status: 'in_progress' | 'completed' | 'review_required';
}

export interface AssessmentScore {
  category: string;
  score: number;
  maxScore: number;
  weight: number;
  details: string;
}

export interface AssessmentFinding {
  type: 'strength' | 'opportunity' | 'non_conformity';
  description: string;
  evidence: string[];
  impact: 'high' | 'medium' | 'low';
  requiredActions: string[];
}

export interface SupplyChainCollaboration {
  id: string;
  title: string;
  description: string;
  type: 'improvement' | 'innovation' | 'compliance' | 'sustainability';
  participants: string[];
  objectives: CollaborationObjective[];
  timeline: CollaborationTimeline;
  budget: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  owner: string;
  createdAt: Date;
}

export interface CollaborationObjective {
  id: string;
  description: string;
  target: string;
  currentValue: string;
  deadline: Date;
  responsible: string[];
  kpis: string[];
}

export interface CollaborationTimeline {
  startDate: Date;
  endDate: Date;
  milestones: CollaborationMilestone[];
}

export interface CollaborationMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  achievedDate?: Date;
  deliverables: string[];
}

export interface SupplyChainPerformance {
  supplierId: string;
  period: string;
  metrics: PerformanceMetric[];
  overallScore: number;
  ranking: number;
  improvement: number;
  lastUpdated: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  weight: number;
}

export interface ImprovementInitiative {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  impact: ImpactAssessment;
  implementation: ImplementationPlan;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
  owner: string;
  createdAt: Date;
}

export interface ImpactAssessment {
  environmental: number;
  social: number;
  economic: number;
  risk: number;
  timeline: string;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  resources: ImplementationResource[];
  budget: number;
  dependencies: string[];
}

export interface ImplementationResource {
  id: string;
  name: string;
  type: 'personnel' | 'equipment' | 'software' | 'facility' | 'external';
  quantity: number;
  cost: number;
  availability: string;
  allocatedTo: string[];
}

export interface ImplementationPhase {
  name: string;
  description: string;
  duration: number;
  tasks: Task[];
  deliverables: string[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  dependencies: string[];
}

// ===== 5.4 Investor Relations Platform =====
export interface InvestorRelationsPlatform extends UserEntity {
  serviceType: 'investor-relations-platform';
  investors: Investor[];
  communications: InvestorCommunication[];
  meetings: InvestorMeeting[];
  reporting: InvestorReporting[];
  engagement: EngagementMetrics;
}

export interface Investor {
  id: string;
  name: string;
  type: 'institutional' | 'retail' | 'private_equity' | 'venture_capital';
  category: string;
  aum: number;
  region: string;
  contact: InvestorContact;
  interests: string[];
  esgFocus: ESGFocus;
  relationship: RelationshipData;
  lastContact: Date;
}

export interface InvestorContact {
  primary: ContactInfo;
  team: ContactInfo[];
  preferredChannels: string[];
  language: string[];
}

export interface ESGFocus {
  priorities: string[];
  exclusions: string[];
  frameworks: string[];
  requirements: string[];
  reporting: string;
}

export interface RelationshipData {
  status: 'active' | 'prospect' | 'inactive';
  level: 'strategic' | 'primary' | 'secondary';
  since: Date;
  touchpoints: number;
  satisfaction: number;
}

export interface InvestorCommunication {
  id: string;
  type: 'newsletter' | 'report' | 'announcement' | 'webinar' | 'meeting';
  title: string;
  content: string;
  recipients: string[];
  channels: string[];
  scheduledAt: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  metrics: CommunicationMetrics;
}

export interface CommunicationMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounce: number;
  unsubscribe: number;
}

export interface InvestorMeeting {
  id: string;
  type: 'quarterly' | 'annual' | 'special' | 'roadshow';
  title: string;
  description: string;
  date: Date;
  duration: number;
  format: 'in_person' | 'virtual' | 'hybrid';
  participants: MeetingParticipant[];
  agenda: MeetingAgenda[];
  materials: MeetingMaterial[];
  followup: MeetingFollowup[];
  status: 'planned' | 'completed' | 'cancelled';
}

export interface MeetingParticipant {
  investorId: string;
  name: string;
  role: string;
  attendance: 'confirmed' | 'declined' | 'pending';
  notes?: string;
}

export interface MeetingAgenda {
  order: number;
  topic: string;
  description: string;
  presenter: string;
  duration: number;
  materials?: string[];
}

export interface MeetingMaterial {
  id: string;
  name: string;
  type: 'presentation' | 'report' | 'data' | 'video';
  url: string;
  version: string;
  language: string;
}

export interface MeetingFollowup {
  actionItem: string;
  responsible: string;
  deadline: Date;
  status: 'pending' | 'completed';
  notes: string;
}

export interface InvestorReporting {
  id: string;
  type: 'quarterly' | 'annual' | 'esg' | 'special';
  title: string;
  description: string;
  content: ReportContent;
  distribution: ReportDistribution;
  metrics: ReportMetrics;
  publishedAt: Date;
}

export interface ReportContent {
  sections: ReportSection[];
  charts: Chart[];
  tables: Table[];
  appendix: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  order: number;
  author: string;
}

export interface Chart {
  id: string;
  title: string;
  type: string;
  data: any;
  description: string;
}

export interface Table {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  description: string;
}

export interface ReportDistribution {
  channels: string[];
  recipients: number;
  downloads: number;
  views: number;
  shares: number;
}

export interface ReportMetrics {
  engagement: number;
  satisfaction: number;
  feedback: string[];
  improvements: string[];
}

export interface EngagementMetrics {
  overall: number;
  byInvestorType: Record<string, number>;
  byRegion: Record<string, number>;
  byTopic: Record<string, number>;
  trends: TrendData[];
  satisfaction: number;
  responseTime: number;
}

// ===== 5.5 Community Impact Network =====
export interface CommunityImpactNetwork extends UserEntity {
  serviceType: 'community-impact-network';
  communities: Community[];
  projects: ImpactProject[];
  members: CommunityMember[];
  resources: SharedResource[];
  impact: ImpactMetrics;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'local' | 'regional' | 'global' | 'thematic';
  focus: string[];
  members: string[];
  rules: CommunityRule[];
  privacy: 'public' | 'private' | 'invite_only';
  created: Date;
  activity: CommunityActivity;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
  type: 'guideline' | 'requirement' | 'prohibition';
  enforced: boolean;
}

export interface CommunityActivity {
  membersActive: number;
  postsCount: number;
  interactions: number;
  newMembers: number;
  growth: number;
}

export interface ImpactProject {
  id: string;
  title: string;
  description: string;
  category: string;
  sdgGoals: number[];
  location: string;
  beneficiaries: number;
  team: ProjectTeam[];
  timeline: ProjectTimeline;
  budget: ProjectBudget;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  impact: ProjectImpact;
  updates: ProjectUpdate[];
}

export interface ProjectTeam {
  members: string[];
  roles: string[];
  skills: string[];
  contributors: string[];
}

export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
}

export interface ProjectPhase {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  dependencies: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  achieved: boolean;
  achievedAt?: Date;
  evidence: string[];
}

export interface ProjectBudget {
  total: number;
  currency: string;
  breakdown: BudgetBreakdown[];
  funded: number;
  fundingSources: FundingSource[];
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface FundingSource {
  type: 'grant' | 'donation' | 'investment' | 'sponsorship';
  source: string;
  amount: number;
  confirmed: boolean;
}

export interface ProjectImpact {
  environmental: ImpactIndicator[];
  social: ImpactIndicator[];
  economic: ImpactIndicator[];
  longTerm: string[];
  scalability: string[];
}

export interface ImpactIndicator {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  baseline: number;
  measurementMethod: string;
  verification: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  type: 'progress' | 'milestone' | 'challenge' | 'success';
  media: UpdateMedia[];
  reactions: UpdateReaction[];
}

export interface UpdateMedia {
  type: 'image' | 'video' | 'document';
  url: string;
  description: string;
}

export interface UpdateReaction {
  userId: string;
  type: 'like' | 'support' | 'celebrate' | 'curious';
  timestamp: Date;
}

export interface CommunityMember {
  id: string;
  profile: MemberProfile;
  contributions: Contribution[];
  reputation: number;
  badges: MemberBadge[];
  activity: MemberActivity;
}

export interface MemberProfile {
  name: string;
  bio: string;
  expertise: string[];
  interests: string[];
  location: string;
  website?: string;
  social: SocialLink[];
  avatar?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Contribution {
  id: string;
  type: 'post' | 'comment' | 'project' | 'resource' | 'mentorship';
  title: string;
  content: string;
  communityId: string;
  projectId?: string;
  createdAt: Date;
  reactions: number;
  comments: number;
  shares: number;
}

export interface MemberBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date;
  level: number;
}

export interface MemberActivity {
  joinDate: Date;
  lastActive: Date;
  posts: number;
  comments: number;
  projects: number;
  hoursContributed: number;
  peopleImpacted: number;
}

export interface SharedResource {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'tool' | 'guide' | 'research' | 'best_practice';
  category: string;
  content: string;
  attachments: ResourceAttachment[];
  author: string;
  contributors: string[];
  ratings: ResourceRating[];
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceAttachment {
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface ResourceRating {
  userId: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface ImpactMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMembers: number;
  activeMembers: number;
  totalBeneficiaries: number;
  environmentalImpact: number;
  socialImpact: number;
  economicImpact: number;
  sdgAlignment: SDGAlignment[];
}

export interface SDGAlignment {
  goal: number;
  title: string;
  projects: number;
  impact: number;
  investment: number;
}
