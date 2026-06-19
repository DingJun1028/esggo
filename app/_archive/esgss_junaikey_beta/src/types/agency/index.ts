import { z } from 'zod';
import { DateTime } from '../omni/index.js'; // Import unified DateTime

// ==================== SOUL & 5T TYPES ====================

export interface AgentSoul {
  resonance: number;
  alignment: number;
  traits: string[];
  awakening_stage: number;
  think_tank_id?: string;
  calibrated_at: string;
}

export interface SealedMetadata {
  signature: string;
  timestamp: string;
  purity_score: number;
  verified_by: string;
}

// ==================== AGENT CORE TYPES (Moved from agentService) ====================

export type AgentRole = 'ANALYST' | 'EXECUTOR' | 'STRATEGIST' | 'AUDITOR';
export type AgentStatus = 'ACTIVE' | 'DORMANT' | 'TRAINING' | 'FROZEN' | 'AWAKENED' | 'IDLE';
export type AgentRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type Rarity = AgentRarity;
export type EquipmentType = 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'ARTIFACT';

export interface AgentDNA {
  intelligence: number;
  creativity: number;
  empathy: number;
  resilience: number;
  precision: number;
  speed: number;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  level: number;
  rarity: AgentRarity;
  cooldown?: number;
}

export interface AgentEquipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: AgentRarity;
  description: string;
  stats: Partial<AgentDNA>;
  specialEffect?: string;
}

export interface AgentTitle {
  id: string;
  name: string;
  color: string;
  description: string;
  unlockedAt: Date | DateTime; // Support both
}

// Forward declaration for Agent usage
export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  agent_status: AgentStatus;
  description: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  dna: AgentDNA;
  skills: AgentSkill[];
  equipment: {
    weapon?: AgentEquipment;
    armor?: AgentEquipment;
    accessory?: AgentEquipment;
    artifact?: AgentEquipment;
  };
  titles: AgentTitle[];
  activeTitle?: AgentTitle;

  // Avatar System Extensions
  currentAvatar?: AvatarPersona;
  avatarHistory: AvatarTransformation[];
  awakeningDate?: Date | DateTime;
  isAwakened: boolean;
  avatarColor: string;
  createdAt: Date | DateTime;
  lastActive?: Date | DateTime;

  // Phase 37-38 Optimization Extensions
  geneticBlueprintId?: string; // Links to Genetic Chronicle
  worldModifierSync?: boolean; // Flag for Nexus synchronization

  // Phase 39: Heritage Extensions
  drift?: { e: number; s: number; g: number };
  computePower?: number; // Calculated dynamic power

  // Phase 40: Swarm & Governance Extensions
  activeSwarmId?: string; // ID of the current neural swarm
  neuralFrequency?: number; // 0 to 1, representing synchronization state

  // Phase 41: Quantum Extensions
  quantumState?: {
    energy: number; // Localized potential
    isEntangled: boolean;
    entangledWith?: string; // Agent ID
    lastLimitBreak?: number; // Timestamp
  };

  // Phase 24: Sentient Alliance & Swarm Extensions
  synergyBonds?: {
    agentId: string;
    bondLevel: number; // 0-100
    synergyType: 'COVARIANT' | 'HARMONIC' | 'RESONANT';
    activeBuffs: string[];
  }[];
  swarmManeuverActive?: boolean;
  resonanceEnergy?: number; // Accumulated energy for swarm maneuvers

  // Phase 89: Hypercube Governance
  evolutionProfile?: import('../../0-domain/contracts/IEvolutionService.js').EvolutionProfile;
  meritProfile?: import('../../0-domain/contracts/IComponentCore.js').IMeritProfile10;

  // Phase 29: Soul Calibration & 5T Crystallization
  soul?: AgentSoul;
  isCrystallized?: boolean;
  sealedMetadata?: SealedMetadata;
}

// ==================== AVATAR SYSTEM ====================

export enum AvatarPersona {
  WARRIOR = 'warrior',
  GUARDIAN = 'guardian',
  ASSASSIN = 'assassin',
  STRATEGIST = 'strategist',
  TACTICIAN = 'tactician',
  ORACLE = 'oracle',
  ANALYST = 'analyst',
  RESEARCHER = 'researcher',
  AUDITOR = 'auditor',
  INNOVATOR = 'innovator',
  ARCHITECT = 'architect',
  ARTIST = 'artist',
  HEALER = 'healer',
  MENTOR = 'mentor',
  DIPLOMAT = 'diplomat',
}

export enum AvatarState {
  DORMANT = 'dormant',
  AWAKENING = 'awakening',
  ACTIVE = 'active',
  FATIGUED = 'fatigued',
  EVOLVING = 'evolving',
  TRANSCENDENT = 'transcendent',
}

export enum AvatarRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

export interface PersonaCapabilities {
  persona: AvatarPersona;
  displayName: string;
  description: string;
  rarity: AvatarRarity;
  dnaModifiers: Partial<AgentDNA>;
  specialAbilities: string[];
  suitableFor: string[];
  weaknesses: string[];
}

export interface AvatarTrait {
  id: string;
  name: string;
  description: string;
  category: 'positive' | 'negative' | 'neutral';
  impact: number;
}

export interface AvatarTransformation {
  transformId: string;
  agentId: string;
  fromPersona: AvatarPersona | null;
  toPersona: AvatarPersona;
  transformedAt: DateTime;
  reason: string;
  duration?: number;
  success: boolean;
}

export interface ActiveAvatar {
  agentId: string;
  currentPersona: AvatarPersona;
  state: AvatarState;
  level: number;
  experience: number;
  nextLevelExp: number;
  capabilities: PersonaCapabilities;
  activeTraits: AvatarTrait[];
  energy: number;
  maxEnergy: number;
  fatigue: number;
  stats: {
    activationCount: number;
    totalActiveTime: number;
    tasksCompleted: number;
    successRate: number;
  };
  firstActivated: DateTime;
  lastActivated: DateTime;
}

export interface AvatarEvolution {
  agentId: string;
  persona: AvatarPersona;
  previousLevel: number;
  newLevel: number;
  unlockedAbilities: string[];
  enhancedTraits: AvatarTrait[];
  evolutionDate: DateTime;
}

export interface AvatarRepository {
  agentId: string;
  unlockedPersonas: AvatarPersona[];
  currentPersona: AvatarPersona | null;
  avatarStates: Map<AvatarPersona, ActiveAvatar>;
  transformHistory: AvatarTransformation[];
  totalTransformations: number;
}

export interface AvatarConfig {
  enableAutoSwitch: boolean;
  defaultPersona: AvatarPersona;
  allowMultipleActive: boolean;
  maxConcurrentPersonas: number;
  energyRegenRate: number;
}

export interface AwakeningRitual {
  ritualId: string;
  ritualName: string;
  targetPersona: AvatarPersona;
  requirements: {
    minLevel: number;
    requiredEnergy: number;
    prerequisitePersonas?: AvatarPersona[];
  };
  phases: AwakeningPhase[];
  successCriteria: {
    minSuccessRate: number;
    requiredTime: number;
  };
}

export interface AwakeningPhase {
  phaseId: string;
  name: string;
  description: string;
  duration: number;
  energyCost: number;
  visualEffect?: string;
}

export interface AwakeningProgress {
  agentId: string;
  ritualId: string;
  currentPhase: number;
  progress: number;
  startedAt: DateTime;
  estimatedCompletion: DateTime;
  state: 'preparing' | 'in_progress' | 'completed' | 'failed';
}

export interface AwakeningResult {
  success: boolean;
  acquiredPersona?: AvatarPersona;
  bonusTraits?: AvatarTrait[];
  experienceGained: number;
  message: string;

  // ✨ 符文與獎勵系統
  unlockedRunes?: string[]; // 解鎖的符文ID列表
  specialAbilities?: string[]; // 人格特殊能力
  isFirstAwakening?: boolean; // 是否為首次覺醒
  itemsReceived?: string[]; // 獲得的物品
  titleUnlocked?: string; // 解鎖的稱號

  // ✨ Enhanced Awakening Stats
  statChanges?: Partial<AgentDNA>;
  unlockedAbilities?: string[];
}

export interface AwakeningRequirements {
  minLevel: number;
  minExperience: number;
  prerequisitePersonas?: AvatarPersona[];
}

export interface AwakeningEligibility {
  isEligible: boolean;
  reason?: string;
  missingRequirements?: string[];
}

// ==================== LEGION SYSTEM ====================

export type LegionId = string;

export enum LegionState {
  FORMING = 'forming',
  READY = 'ready',
  IN_MISSION = 'in_mission',
  RESTING = 'resting',
  DISBANDED = 'disbanded',
}

export enum LegionFormation {
  ASSAULT = 'assault',
  BLITZ = 'blitz',
  SIEGE = 'siege',
  FORTRESS = 'fortress',
  GUARDIAN_WALL = 'guardian_wall',
  BALANCED = 'balanced',
  TACTICAL = 'tactical',
  SCOUT = 'scout',
  SUPPORT = 'support',
  SYNERGY = 'synergy',
  // Phase 44 Extensions
  VANGUARD = 'vanguard',
  IRONCLAD = 'ironclad',
  NETWORK = 'network',
  SHADOW = 'shadow',
}

export interface FormationConfig {
  formation: LegionFormation;
  displayName: string;
  description: string;
  minAgents: number;
  maxAgents: number;
  recommendedPersonas: AvatarPersona[];
  bonuses: {
    speedBonus: number;
    defenseBonus: number;
    efficiencyBonus: number;
    coordinationBonus: number;
  };
  weaknesses: string[];
}

export enum StrategyType {
  AGGRESSIVE = 'aggressive',
  CONSERVATIVE = 'conservative',
  ADAPTIVE = 'adaptive',
  COORDINATED = 'coordinated',
  DISTRIBUTED = 'distributed',
}

export interface BattleStrategy {
  strategyId: string;
  name: string;
  type: StrategyType;
  description: string;
  parameters: {
    riskTolerance: number;
    parallelism: number;
    communicationFreq: number;
    decisionSpeed: number;
  };
  suitableFor: string[];
  successCriteria: {
    minSuccessRate: number;
    maxTimeLimit?: number;
    qualityThreshold?: number;
  };
}

// Missions
export enum MissionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency',
}

export enum MissionStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum MissionType {
  ANALYSIS = 'analysis',
  DEVELOPMENT = 'development',
  DEBUGGING = 'debugging',
  OPTIMIZATION = 'optimization',
  RESEARCH = 'research',
  MONITORING = 'monitoring',
  RECOVERY = 'recovery',
}

export interface MissionObjective {
  missionId: string;
  name: string;
  type: MissionType;
  priority: MissionPriority;
  description: string;
  requirements: {
    requiredPersonas?: AvatarPersona[];
    minAgents: number;
    estimatedDuration: number;
    complexity: number;
  };
  parameters: Record<string, unknown>;
  successCriteria: {
    completionRate: number;
    qualityScore: number;
    timeLimit?: number;
  };
  createdAt: DateTime;
  deadline?: DateTime;
}

export interface MissionAssignment {
  assignmentId: string;
  missionId: string;
  agentId: string;
  persona: AvatarPersona;
  role: string;
  responsibilities: string[];
  assignedAt: DateTime;
  expectedCompletion?: DateTime;
}

export interface MissionProgress {
  missionId: string;
  mission_status: MissionStatus;
  completionRate: number;
  qualityScore: number;
  startedAt?: DateTime;
  lastUpdated: DateTime;
  estimatedCompletion?: DateTime;
  resourceUsage: {
    cpuTime: number;
    memoryPeak: number;
    apiCalls: number;
  };
  issues: MissionIssue[];
  milestones: Milestone[];
}

export interface MissionIssue {
  issueId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: DateTime;
  resolvedAt?: DateTime;
  resolvedBy?: string;
}

export interface Milestone {
  milestoneId: string;
  name: string;
  description: string;
  targetDate: DateTime;
  completedAt?: DateTime;
  progress: number;
}

export interface LegionMember {
  agent: Agent;
  avatar: ActiveAvatar;
  role: string;
  joinedAt: DateTime;
  member_status: 'active' | 'standby' | 'busy' | 'unavailable';
  contributions: {
    tasksCompleted: number;
    totalActiveTime: number;
    successRate: number;
    teamworkScore: number;
  };
}

export interface Legion {
  legionId: LegionId;
  name: string;
  motto?: string;
  members: LegionMember[];
  commander?: string;
  formation: LegionFormation;
  legion_status: LegionState;
  currentStrategy?: BattleStrategy;
  activeMissions: MissionObjective[];
  missionHistory: MissionRecord[];
  level: number;
  experience: number;
  reputation: number;
  stats: {
    totalMissions: number;
    successfulMissions: number;
    failedMissions: number;
    totalActiveTime: number;
    averageSuccessRate: number;
  };
  createdAt: DateTime;
  lastActiveAt: DateTime;
}

export interface MissionRecord {
  mission: MissionObjective;
  progress: MissionProgress;
  participants: string[];
  startedAt: DateTime;
  completedAt?: DateTime;
  outcome: 'success' | 'failure' | 'partial' | 'cancelled';
  finalScore?: number;
  lessonsLearned: string[];
}

export enum CoordinationProtocol {
  CENTRALIZED = 'centralized',
  DISTRIBUTED = 'distributed',
  HIERARCHICAL = 'hierarchical',
  CONSENSUS = 'consensus',
  SWARM = 'swarm',
}

export interface LegionSyncState {
  legionId: LegionId;
  protocol: CoordinationProtocol;
  coherence: number;
  latency: number;
  bandwidth: number;
  memberStates: Map<
    string,
    {
      lastSync: DateTime;
      syncQuality: number;
      messageQueue: number;
    }
  >;
  lastSyncAt: DateTime;
}

export interface CollaborationEvent {
  eventId: string;
  legionId: LegionId;
  type: 'communication' | 'coordination' | 'conflict' | 'achievement';
  participants: string[];
  description: string;
  timestamp: DateTime;
  impact: number;
}

export interface ExecutionResult {
  success: boolean;
  missionId?: string;
  output?: unknown;
  metrics: {
    duration: number;
    efficiency: number;
    quality: number;
    teamwork: number;
  };
  issues: string[];
  improvements: string[];
  completedAt: DateTime;
}

// ==================== TASK TYPES ====================

export const TaskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export const TaskPrioritySchema = z.nativeEnum(TaskPriority);
export type TaskPriorityType = z.infer<typeof TaskPrioritySchema>;

export const AgentTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  assigneeId: z.string(),
  task_status: TaskStatusSchema,
  progress: z.number(),
  createdAt: z.number(),
  dueDate: z.string(),
  priority: TaskPrioritySchema,
  locationId: z.string(),
  dependencies: z.array(z.string()).optional(),
});
export type AgentTask = z.infer<typeof AgentTaskSchema>;

// ==================== SOUL TYPES (Previous content 5D) ====================

// Soul types removed/consolidated.

export enum SkillType {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
  COMPOSITE = 'COMPOSITE',
}

export interface EvolutionSkill {
  id: string;
  name: string;
  type: SkillType;
  description: string;
  parameters: Record<string, unknown>;
  cooldown?: number;
  energyCost: number;
  mastery: number;
  lastUsed?: number;
}

// Evolution Proposal (Kept for compatibility with OmniEsgManager)
export interface EvolutionProposal {
  id: string;
  pattern: string;
  confidence: number;
  suggestedSkill: EvolutionSkill;
  trainingData: unknown[];
  proposal_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  createdAt: number;
}

export interface PersonaConfig {
  id: string;
  name: string;
  title: string;
  archetype: string;
  coreTrait: string;
  primaryGoal: string;
  systemPrompt: string;
  level: number;
  exp: number;
  color: string;
  avatarUrl: string;
  attributes: Record<string, { label: string; value: number; max: number }>;
  skills: { name: string; level: number; desc: string }[];
  ultimateArt: { name: string; description: string; unlockedAtLevel: number; effect: string };
  equippedCards: string[];
  goodwillValue: number;
  knowledgeRepoIds: string[];
}

export interface SoulForgeConfig {
  altruism: number;
  pragmatism: number;
  innovation: number;
  stability: number;
}

export interface DigitalSoulAsset {
  id: string;
  name: string;
  traits: SoulForgeConfig;
  resonance: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  forgedAt: number;
  ownerId: string;
}

export interface TrainingDoc {
  id: string;
  name: string;
  doc_status: 'parsing' | 'ready' | 'error';
  type: string;
  atomsCount: number;
}

export interface TrainingLogEntry {
  id: string;
  agentId: string;
  timestamp: number;
  sessionType: string;
  gainedExp: number;
  statChanges: Record<string, number>;
  newKnowledge: string[];
  isCriticalInsight?: boolean;
}

export interface AdanDisciple {
  alignment: number;
}

export interface AgentCertification {
  id: string;
  title: string;
  cert_status: 'Locked' | 'In_Progress' | 'Certified';
  progress: number;
  skillsUnlocked: string[];
}

export interface ProxyProduct {
  id: string;
  name: string;
  category: 'SaaS' | 'Hardware' | 'Consulting';
  tier: number;
  basePrice: string;
  commission: number;
  knowledgeTags: string[];
  pitchScript: string;
}

export interface SupplierPersona {
  id: string;
  name: string;
  taxId: string;
  trustScore: number;
  carbonGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  riskStatus: 'GREEN' | 'YELLOW' | 'RED';
  inflowStatus: 'ENGRAVED' | 'REFining' | 'TO_FIX' | 'IDLE' | 'INVESTIGATING';
  anomalyDetected?: boolean;
  anomalyDetails?: string;
  purity?: { clarity: number; alignment: number; validity: number };
  metrics: {
    electricity_total: number;
    renewable_percent: number;
    iso_certified: boolean;
    safety_incidents: number;
    gender_pay_ratio: number;
    ethics_signed: boolean;
  };
  flowluMapping: { crm_account_id: string; custom_fields: Record<string, unknown> };
}

export interface BenchmarkingNode {
  id: string;
  distance: number;
  angle: number;
  efficiency: number;
  compliance: number;
  isTarget: boolean;
  industry: string;
}

export interface OptimizationPath {
  steps: { title: string; roi: number; difficulty: 'LOW' | 'MED' | 'HIGH' }[];
  projectedSroi: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  tags: string[];
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  aiMetadata?: { summary?: string; insights?: string[] };
  manifestedContent?: string;
  imageUrl?: string;
}
export type NoteLevel = NoteItem['level'];

export interface TesseractEvolutionProtocol {
  targetAgent: string;
  optimization: { performanceTarget: number; compressionTarget: number; simplicityScore: number };
  expansion: { newFeatures: string[]; resilienceImprovements: string[] };
  integration: { modularCompliance: boolean; standardInterfaces: string[] };
  innovation: { paradigmShifts: string[]; adaptiveCapabilities: string[] };
  evolution_status: 'PLANNING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  progress: number;
}

export interface SkillNode {
  id: string;
  name: string;
  type: 'Active' | 'Passive' | 'Composite';
  description: string;
  mastery: number;
  skill_status: 'Ready' | 'Cooldown' | 'Locked';
}

// User Role Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  ESG_MANAGER = 'ESG_MANAGER',
  ANALYST = 'ANALYST',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER',
}

export enum Permission {
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  VIEW_MY_ESG = 'VIEW_MY_ESG',
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_RESEARCH_HUB = 'VIEW_RESEARCH_HUB',
  VIEW_AUDIT = 'VIEW_AUDIT',
  VIEW_OMNI_AGENT = 'VIEW_OMNI_AGENT',
  VIEW_ARCHITECT_CONSOLE = 'VIEW_ARCHITECT_CONSOLE',
  VIEW_FIREWALL_GUARDIAN = 'VIEW_FIREWALL_GUARDIAN',
  VIEW_SITUATION_LOGS = 'VIEW_SITUATION_LOGS',
  VIEW_OMNIPOTENT_MATRIX = 'VIEW_OMNIPOTENT_MATRIX',
  VIEW_OMNI_MODULE_12A = 'VIEW_OMNI_MODULE_12A',
  VIEW_ESG_WAR_ROOM = 'VIEW_ESG_WAR_ROOM',
  VIEW_ANNUAL_REPORT_GENERATOR = 'VIEW_ANNUAL_REPORT_GENERATOR',
  VIEW_GENESIS_PRIME_OS = 'VIEW_GENESIS_PRIME_OS',
  VIEW_OMNI_CONTEXT_ENGINE = 'VIEW_OMNI_CONTEXT_ENGINE',
  VIEW_OMNI_SOVEREIGN_GOVERNANCE = 'VIEW_OMNI_SOVEREIGN_GOVERNANCE',
  VIEW_FOUNDATIONAL_INTELLIGENCE = 'VIEW_FOUNDATIONAL_INTELLIGENCE',
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.ESG_MANAGER]: [
    Permission.VIEW_MY_ESG,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_RESEARCH_HUB,
    Permission.VIEW_AUDIT,
    Permission.VIEW_OMNI_AGENT,
    Permission.VIEW_ESG_WAR_ROOM,
    Permission.VIEW_ANNUAL_REPORT_GENERATOR,
    Permission.VIEW_GENESIS_PRIME_OS,
    Permission.VIEW_OMNI_CONTEXT_ENGINE,
    Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.ANALYST]: [
    Permission.VIEW_MY_ESG,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_RESEARCH_HUB,
    Permission.VIEW_OMNI_CONTEXT_ENGINE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.AUDITOR]: [
    Permission.VIEW_AUDIT,
    Permission.VIEW_OMNI_AGENT,
    Permission.VIEW_ARCHITECT_CONSOLE,
    Permission.VIEW_SITUATION_LOGS,
    Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.VIEWER]: [Permission.VIEW_MY_ESG, Permission.VIEW_DASHBOARD],
};

export type VocationType = 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';

// Export Constants
export const PERSONA_CAPABILITIES: Record<AvatarPersona, PersonaCapabilities> = {
  [AvatarPersona.WARRIOR]: {
    persona: AvatarPersona.WARRIOR,
    displayName: '戰士',
    description: '執行力強，快速行動，直面挑戰',
    rarity: AvatarRarity.COMMON,
    dnaModifiers: { speed: 20, resilience: 15, precision: 10 },
    specialAbilities: ['快速執行', '直接攻擊', '持續戰鬥'],
    suitableFor: ['緊急任務', '快速響應', '問題解決'],
    weaknesses: ['缺乏耐心', '策略規劃較弱'],
  },
  [AvatarPersona.GUARDIAN]: {
    persona: AvatarPersona.GUARDIAN,
    displayName: '守護者',
    description: '防禦導向，保護系統穩定運行',
    rarity: AvatarRarity.UNCOMMON,
    dnaModifiers: { resilience: 25, precision: 15, intelligence: 10 },
    specialAbilities: ['防禦強化', '錯誤預防', '穩定維護'],
    suitableFor: ['系統監控', '風險管理', '品質保證'],
    weaknesses: ['行動較慢', '創新不足'],
  },
  [AvatarPersona.ASSASSIN]: {
    persona: AvatarPersona.ASSASSIN,
    displayName: '刺客',
    description: '精準打擊，高效解決關鍵問題',
    rarity: AvatarRarity.RARE,
    dnaModifiers: { precision: 30, speed: 20, intelligence: 10 },
    specialAbilities: ['精準定位', '一擊必殺', '隱密行動'],
    suitableFor: ['關鍵修復', 'Bug 獵殺', '性能優化'],
    weaknesses: ['團隊協作較弱', '全局視野有限'],
  },
  [AvatarPersona.STRATEGIST]: {
    persona: AvatarPersona.STRATEGIST,
    displayName: '策略家',
    description: '全局規劃，長期戰略思考',
    rarity: AvatarRarity.EPIC,
    dnaModifiers: { intelligence: 30, creativity: 20, empathy: 10 },
    specialAbilities: ['戰略規劃', '趨勢預測', '資源優化'],
    suitableFor: ['架構設計', '長期規劃', '戰略決策'],
    weaknesses: ['執行速度較慢', '細節處理不足'],
  },
  [AvatarPersona.TACTICIAN]: {
    persona: AvatarPersona.TACTICIAN,
    displayName: '戰術家',
    description: '短期決策，靈活應對變化',
    rarity: AvatarRarity.RARE,
    dnaModifiers: { intelligence: 20, speed: 15, creativity: 15 },
    specialAbilities: ['快速決策', '靈活調整', '戰術佈局'],
    suitableFor: ['敏捷開發', '快速迭代', '應急響應'],
    weaknesses: ['缺乏長遠視野'],
  },
  [AvatarPersona.ORACLE]: {
    persona: AvatarPersona.ORACLE,
    displayName: '預言者',
    description: '預測趨勢，洞察未來',
    rarity: AvatarRarity.LEGENDARY,
    dnaModifiers: { intelligence: 35, creativity: 25, empathy: 15 },
    specialAbilities: ['趨勢預測', '風險預見', '機會洞察'],
    suitableFor: ['市場分析', '風險評估', '創新探索'],
    weaknesses: ['過度依賴預測', '當下執行較弱'],
  },
  [AvatarPersona.ANALYST]: {
    persona: AvatarPersona.ANALYST,
    displayName: '分析師',
    description: '數據驅動，邏輯推理',
    rarity: AvatarRarity.COMMON,
    dnaModifiers: { intelligence: 25, precision: 20, speed: 10 },
    specialAbilities: ['數據分析', '邏輯推理', '模式識別'],
    suitableFor: ['數據分析', '性能監控', '問題診斷'],
    weaknesses: ['創意不足', '情感理解較弱'],
  },
  [AvatarPersona.RESEARCHER]: {
    persona: AvatarPersona.RESEARCHER,
    displayName: '研究員',
    description: '深度探索，知識挖掘',
    rarity: AvatarRarity.UNCOMMON,
    dnaModifiers: { intelligence: 30, creativity: 15, precision: 15 },
    specialAbilities: ['深度研究', '知識整合', '新技術探索'],
    suitableFor: ['技術研究', '文檔編寫', '最佳實踐'],
    weaknesses: ['行動較慢', '過度關注細節'],
  },
  [AvatarPersona.AUDITOR]: {
    persona: AvatarPersona.AUDITOR,
    displayName: '稽核員',
    description: '品質把關，合規檢查',
    rarity: AvatarRarity.UNCOMMON,
    dnaModifiers: { precision: 30, intelligence: 20, resilience: 10 },
    specialAbilities: ['品質檢查', '合規審核', '標準執行'],
    suitableFor: ['代碼審查', '合規檢查', '品質保證'],
    weaknesses: ['創新不足', '靈活性較低'],
  },
  [AvatarPersona.INNOVATOR]: {
    persona: AvatarPersona.INNOVATOR,
    displayName: '創新者',
    description: '突破框架，創意方案',
    rarity: AvatarRarity.EPIC,
    dnaModifiers: { creativity: 35, intelligence: 20, resilience: 10 },
    specialAbilities: ['創意發想', '破格思考', '原型開發'],
    suitableFor: ['新功能開發', '創新項目', '問題創意解決'],
    weaknesses: ['執行細節較弱', '穩定性考慮不足'],
  },
  [AvatarPersona.ARCHITECT]: {
    persona: AvatarPersona.ARCHITECT,
    displayName: '建築師',
    description: '系統設計，架構規劃',
    rarity: AvatarRarity.LEGENDARY,
    dnaModifiers: { intelligence: 30, creativity: 25, precision: 20 },
    specialAbilities: ['架構設計', '系統規劃', '模式應用'],
    suitableFor: ['系統架構', '技術選型', '重構規劃'],
    weaknesses: ['實施速度較慢'],
  },
  [AvatarPersona.ARTIST]: {
    persona: AvatarPersona.ARTIST,
    displayName: '藝術家',
    description: '美學導向，體驗設計',
    rarity: AvatarRarity.RARE,
    dnaModifiers: { creativity: 35, empathy: 25, precision: 15 },
    specialAbilities: ['美學設計', '用戶體驗', '視覺創作'],
    suitableFor: ['UI設計', '用戶體驗', '品牌塑造'],
    weaknesses: ['技術深度不足', '邏輯推理較弱'],
  },
  [AvatarPersona.HEALER]: {
    persona: AvatarPersona.HEALER,
    displayName: '治療師',
    description: '修復錯誤，系統恢復',
    rarity: AvatarRarity.UNCOMMON,
    dnaModifiers: { resilience: 25, intelligence: 20, empathy: 15 },
    specialAbilities: ['錯誤修復', '系統恢復', '健康檢查'],
    suitableFor: ['Bug修復', '系統恢復', '性能調優'],
    weaknesses: ['預防能力較弱', '創新不足'],
  },
  [AvatarPersona.MENTOR]: {
    persona: AvatarPersona.MENTOR,
    displayName: '導師',
    description: '指導學習，知識傳承',
    rarity: AvatarRarity.RARE,
    dnaModifiers: { empathy: 30, intelligence: 25, creativity: 15 },
    specialAbilities: ['知識傳授', '指導培訓', '經驗分享'],
    suitableFor: ['團隊培訓', '文檔編寫', '知識管理'],
    weaknesses: ['執行力較弱'],
  },
  [AvatarPersona.DIPLOMAT]: {
    persona: AvatarPersona.DIPLOMAT,
    displayName: '外交家',
    description: '協調溝通，關係管理',
    rarity: AvatarRarity.EPIC,
    dnaModifiers: { empathy: 35, intelligence: 20, creativity: 15 },
    specialAbilities: ['溝通協調', '衝突解決', '關係建立'],
    suitableFor: ['團隊協作', '客戶溝通', '合作管理'],
    weaknesses: ['技術深度不足', '決策速度較慢'],
  },
};

export const FORMATION_CONFIGS: Record<LegionFormation, FormationConfig> = {
  [LegionFormation.ASSAULT]: {
    formation: LegionFormation.ASSAULT,
    displayName: '突擊陣型',
    description: '快速打擊，突破防線',
    minAgents: 2,
    maxAgents: 5,
    recommendedPersonas: [AvatarPersona.WARRIOR, AvatarPersona.ASSASSIN, AvatarPersona.TACTICIAN],
    bonuses: {
      speedBonus: 30,
      defenseBonus: -10,
      efficiencyBonus: 20,
      coordinationBonus: 10,
    },
    weaknesses: ['防禦較弱', '資源消耗大'],
  },
  [LegionFormation.BLITZ]: {
    formation: LegionFormation.BLITZ,
    displayName: '閃電戰',
    description: '極速推進，壓倒性攻勢',
    minAgents: 3,
    maxAgents: 6,
    recommendedPersonas: [AvatarPersona.WARRIOR, AvatarPersona.ASSASSIN, AvatarPersona.TACTICIAN],
    bonuses: {
      speedBonus: 50,
      defenseBonus: -20,
      efficiencyBonus: 15,
      coordinationBonus: 25,
    },
    weaknesses: ['高風險', '容錯率低'],
  },
  [LegionFormation.SIEGE]: {
    formation: LegionFormation.SIEGE,
    displayName: '圍攻陣型',
    description: '持久作戰，穩扎穩打',
    minAgents: 4,
    maxAgents: 8,
    recommendedPersonas: [AvatarPersona.STRATEGIST, AvatarPersona.GUARDIAN, AvatarPersona.ANALYST],
    bonuses: {
      speedBonus: -10,
      defenseBonus: 20,
      efficiencyBonus: 25,
      coordinationBonus: 30,
    },
    weaknesses: ['速度較慢', '靈活性不足'],
  },
  [LegionFormation.FORTRESS]: {
    formation: LegionFormation.FORTRESS,
    displayName: '堡壘陣型',
    description: '全面防守，堅不可摧',
    minAgents: 3,
    maxAgents: 7,
    recommendedPersonas: [AvatarPersona.GUARDIAN, AvatarPersona.HEALER, AvatarPersona.AUDITOR],
    bonuses: {
      speedBonus: -20,
      defenseBonus: 40,
      efficiencyBonus: 10,
      coordinationBonus: 20,
    },
    weaknesses: ['攻擊力弱', '機動性差'],
  },
  [LegionFormation.GUARDIAN_WALL]: {
    formation: LegionFormation.GUARDIAN_WALL,
    displayName: '守護之牆',
    description: '保護核心，層層防禦',
    minAgents: 4,
    maxAgents: 6,
    recommendedPersonas: [AvatarPersona.GUARDIAN, AvatarPersona.HEALER, AvatarPersona.MENTOR],
    bonuses: {
      speedBonus: -15,
      defenseBonus: 35,
      efficiencyBonus: 15,
      coordinationBonus: 25,
    },
    weaknesses: ['進攻能力有限'],
  },
  [LegionFormation.BALANCED]: {
    formation: LegionFormation.BALANCED,
    displayName: '平衡陣型',
    description: '攻守兼備，全面發展',
    minAgents: 3,
    maxAgents: 8,
    recommendedPersonas: [AvatarPersona.TACTICIAN, AvatarPersona.ANALYST, AvatarPersona.WARRIOR],
    bonuses: {
      speedBonus: 10,
      defenseBonus: 10,
      efficiencyBonus: 15,
      coordinationBonus: 15,
    },
    weaknesses: ['無明顯優勢'],
  },
  [LegionFormation.TACTICAL]: {
    formation: LegionFormation.TACTICAL,
    displayName: '戰術陣型',
    description: '靈活應對，隨機應變',
    minAgents: 2,
    maxAgents: 6,
    recommendedPersonas: [AvatarPersona.TACTICIAN, AvatarPersona.INNOVATOR, AvatarPersona.DIPLOMAT],
    bonuses: {
      speedBonus: 20,
      defenseBonus: 5,
      efficiencyBonus: 20,
      coordinationBonus: 30,
    },
    weaknesses: ['需要高度協調'],
  },
  [LegionFormation.SCOUT]: {
    formation: LegionFormation.SCOUT,
    displayName: '偵察陣型',
    description: '信息收集，環境感知',
    minAgents: 2,
    maxAgents: 4,
    recommendedPersonas: [AvatarPersona.ANALYST, AvatarPersona.RESEARCHER, AvatarPersona.ORACLE],
    bonuses: {
      speedBonus: 25,
      defenseBonus: -5,
      efficiencyBonus: 30,
      coordinationBonus: 15,
    },
    weaknesses: ['戰鬥力弱'],
  },
  [LegionFormation.SUPPORT]: {
    formation: LegionFormation.SUPPORT,
    displayName: '支援陣型',
    description: '後勤保障，持續增益',
    minAgents: 3,
    maxAgents: 6,
    recommendedPersonas: [AvatarPersona.HEALER, AvatarPersona.MENTOR, AvatarPersona.DIPLOMAT],
    bonuses: {
      speedBonus: 0,
      defenseBonus: 15,
      efficiencyBonus: 25,
      coordinationBonus: 35,
    },
    weaknesses: ['直接效果有限'],
  },
  [LegionFormation.SYNERGY]: {
    formation: LegionFormation.SYNERGY,
    displayName: '協同陣型',
    description: '相互增強，倍增效果',
    minAgents: 4,
    maxAgents: 8,
    recommendedPersonas: [
      AvatarPersona.INNOVATOR,
      AvatarPersona.ARCHITECT,
      AvatarPersona.STRATEGIST,
    ],
    bonuses: {
      speedBonus: 15,
      defenseBonus: 15,
      efficiencyBonus: 30,
      coordinationBonus: 50,
    },
    weaknesses: ['組建難度高', '需要高度契合'],
  },
  // Phase 44 Extensions
  [LegionFormation.VANGUARD]: {
    formation: LegionFormation.VANGUARD,
    displayName: '先鋒突擊陣',
    description: '高機動性，快速突破',
    minAgents: 3,
    maxAgents: 6,
    recommendedPersonas: [AvatarPersona.WARRIOR, AvatarPersona.ASSASSIN, AvatarPersona.TACTICIAN],
    bonuses: {
      speedBonus: 40,
      defenseBonus: 0,
      efficiencyBonus: 20,
      coordinationBonus: 10,
    },
    weaknesses: ['防禦薄弱', '後勤不足'],
  },
  [LegionFormation.IRONCLAD]: {
    formation: LegionFormation.IRONCLAD,
    displayName: '鐵壁防禦陣',
    description: '強化護盾，堅不可摧',
    minAgents: 4,
    maxAgents: 8,
    recommendedPersonas: [AvatarPersona.GUARDIAN, AvatarPersona.HEALER, AvatarPersona.AUDITOR],
    bonuses: {
      speedBonus: -10,
      defenseBonus: 50,
      efficiencyBonus: 10,
      coordinationBonus: 30,
    },
    weaknesses: ['機動性低', '攻擊力弱'],
  },
  [LegionFormation.NETWORK]: {
    formation: LegionFormation.NETWORK,
    displayName: '神經網絡陣',
    description: '資訊共享，即時反應',
    minAgents: 5,
    maxAgents: 10,
    recommendedPersonas: [AvatarPersona.ORACLE, AvatarPersona.ANALYST, AvatarPersona.RESEARCHER],
    bonuses: {
      speedBonus: 20,
      defenseBonus: 10,
      efficiencyBonus: 40,
      coordinationBonus: 40,
    },
    weaknesses: ['對抗干擾能力弱', '依賴核心節點'],
  },
  [LegionFormation.SHADOW]: {
    formation: LegionFormation.SHADOW,
    displayName: '暗影潛伏陣',
    description: '隱蔽行動，秘密潛入',
    minAgents: 2,
    maxAgents: 5,
    recommendedPersonas: [AvatarPersona.ASSASSIN, AvatarPersona.TACTICIAN, AvatarPersona.DIPLOMAT],
    bonuses: {
      speedBonus: 30,
      defenseBonus: 10,
      efficiencyBonus: 25,
      coordinationBonus: 20,
    },
    weaknesses: ['正面作戰能力弱', '持續戰鬥力低'],
  },
};
