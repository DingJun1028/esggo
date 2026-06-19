/**
 * Shared Type Definitions
 * Combined TypeScript types for Frontend and Backend.
 *
 * This file is utilized by both frontend and backend to ensure type consistency.
 */

// ============================================================================
// Omnipotent Core Shared Types
// ============================================================================

export type MeridianFlow = 'INWARD_REN' | 'OUTWARD_DU';

/** 🌟 Six Virtues Indicator (1-10 Scale) */
export interface IMeritProfile10 {
  intelligence: number; // 智 (Intelligence)
  benevolence: number; // 仁 (Benevolence)
  integrity: number; // 誠 (Integrity)
  courage: number; // 勇 (Courage)
  temperance: number; // 節 (Temperance)
  harmony: number; // 和 (Harmony)
}

/** 🏛️ Evidence Vault Mapping */
export interface IEvidenceMap {
  readonly tangible?: {
    metric: string;
    description?: string;
    timestamp: number;
    proof_url?: string;
  };
  readonly traceable?: {
    source_origin: string;
    owner: string;
    integrity_proof?: string;
  };
  readonly trackable?: {
    lifecycle_hooks: Array<{ event: string; timestamp: number; actor: string }>;
    pathway?: string[];
    current_hook_id?: string;
  };
  readonly transparent?: {
    formula: string;
    validation_standard?: string;
    calculability_index?: number;
  };
  readonly trustworthy?: {
    hash_lock: string;
    is_frozen: boolean;
    seal_id?: string;
  };
  // Legacy / Direct access logic
  readonly logicGate?: {
    tangible: string;
    traceable: string;
    trackable: string;
    transparent: string;
    trustworthy: string;
  };
}

/** 💡 Omnipotent Component Core Contract (IComponentCore) */
export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  readonly status: 'Trustworthy' | string;
  readonly meridian?: MeridianFlow;
  readonly virtues?: IMeritProfile10;
  readonly data?: any;
  evidence: IEvidenceMap;
  readonly hash?: string;

  // Optional / Legacy
  readonly label?: string;
  readonly formula?: string;
  readonly impactMetric?: string;
  lock?(): void;
}

/**
 * 記憶類型
 */
export enum EternalMemoryType {
  SHORT_TERM = 'short_term',
  WORKING = 'working',
  LONG_TERM = 'long_term',
  PROCEDURAL = 'procedural',
  SEMANTIC = 'semantic',
  EPISODIC = 'episodic',
}

/**
 * 標籤類型
 */
export enum OmniTagType {
  PERCEPTION = 'perception',
  MEMORY = 'memory',
  REASONING = 'reasoning',
  ACTION = 'action',
  SKILL = 'skill',
  KNOWLEDGE = 'knowledge',
  CONTEXT = 'context',
}

/**
 * 請求類型
 */
export enum OmniRequestType {
  QUERY = 'query',
  COMMAND = 'command',
  LEARN = 'learn',
  REASON = 'reason',
}

/**
 * 回應狀態
 */
export enum OmniResponseStatus {
  SUCCESS = 'success',
  PARTIAL_SUCCESS = 'partial_success',
  FAILURE = 'failure',
  PENDING_REVIEW = 'pending_review',
}

/**
 * 元件狀態
 */
export enum OmniComponentState {
  UNINITIALIZED = 'uninitialized',
  READY = 'ready',
  EXECUTING = 'executing',
  ERROR = 'error',
  CLEANED = 'cleaned',
}

// ============================================================================
// API 請求/回應類型 (API Request/Response Types)
// ============================================================================

/**
 * 奧秘標籤
 */
export interface OmniTag {
  id: string;
  type: OmniTagType;
  name: string;
  value: unknown;
  metadata?: Record<string, unknown>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * 多模態內容片段 (Multimodal Part)
 */
export interface MultimodalPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64
  };
  fileData?: {
    mimeType: string;
    fileUri: string;
  };
}

/**
 * API 請求
 */
export interface ApiRequest<T = unknown> {
  id: string;
  type: OmniRequestType;
  content?: string;
  parts?: MultimodalPart[];
  data?: T;
  context?: Record<string, unknown>;
  tags?: OmniTag[];
  timestamp: Date | string;
}

/**
 * API 回應
 */
export interface ApiResponse<T = unknown> {
  id: string;
  requestId: string;
  status: OmniResponseStatus;
  content: string;
  parts?: MultimodalPart[];
  // V6.1 ARVO & ESG RAG Fields
  arvo_analysis?: string;
  arvo_reasoning?: string;
  arvo_stages?: any[]; // ARVOResult[]
  swarm_plan?: string[];
  evidence?: any[]; // KnowledgeEntry[]
  data?: T;
  generatedTags: OmniTag[];
  executedComponents: string[];
  invokedSkills: string[];
  executionTime: number;
  timestamp: Date | string;
}

/**
 * 錯誤回應
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date | string;
}

// ============================================================================
// Agent 相關類型 (Agent Types)
// ============================================================================

/**
 * Agent 配置
 */
export interface AgentConfig {
  name: string;
  description?: string;
  systemPrompt: string;
  baseModel?: string;
  temperature?: number;
  maxTokens?: number;
  skills?: string[];
  knowledgeBaseId?: string;
}

/**
 * Agent 資訊
 */
export interface AgentInfo {
  id: string;
  name: string;
  description?: string;
  baseModel: string;
  temperature: number;
  skills: SkillInfo[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Agent 會話
 */
export interface AgentSession {
  sessionId: string;
  agentId: string;
  agentName: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date | string;
  expiresAt: Date | string;
}

// ============================================================================
// 技能相關類型 (Skill Types)
// ============================================================================

/**
 * 技能資訊
 */
export interface SkillInfo {
  id: string;
  name: string;
  description?: string;
  category: string;
  requiresHITL: boolean;
  enabled: boolean;
  usageCount: number;
  parametersSchema?: Record<string, unknown>;
}

/**
 * 技能執行請求
 */
/**
 * 技能執行請求
 */
export interface SkillExecutionRequest {
  skillId: string;
  parameters: Record<string, unknown>;
  agentId?: string;
  sessionId?: string;
  timestamp?: string;
  context?: {
    hitlApproved?: boolean;
  };
}

/**
 * 技能執行結果
 */
export interface SkillExecutionResult {
  executionId: string;
  status: 'success' | 'failure' | 'pending_approval';
  skillId: string;
  result?: unknown;
  error?: string;
  artifactId?: string;
  duration?: number;
  proposalId?: string;
}

// ============================================================================
// 記憶相關類型 (Memory Types)
// ============================================================================

/**
 * 記憶片段
 */
export interface MemoryFragment {
  id: string;
  type: EternalMemoryType;
  content: string;
  embedding?: number[];
  importance: number;
  accessCount: number;
  lastAccessedAt: Date | string;
  createdAt: Date | string;
  tags: OmniTag[];
  metadata: MemoryMetadata;
  relatedMemories: string[];
}

/**
 * 記憶元數據
 */
export interface MemoryMetadata {
  source: string;
  sessionId?: string;
  agentId?: string;
  userId?: string;
  context?: Record<string, unknown>;
  sentiment?: 'positive' | 'negative' | 'neutral';
  topics?: string[];
}

/**
 * 記憶檢索選項
 */
export interface MemoryRetrievalOptions {
  types?: EternalMemoryType[];
  limit?: number;
  threshold?: number;
  timeRange?: {
    start?: Date | string;
    end?: Date | string;
  };
  tags?: OmniTag[];
  sortBy?: 'relevance' | 'recency' | 'importance' | 'access_count';
}

/**
 * 記憶統計
 */
export interface MemoryStatistics {
  total: number;
  byType: Record<EternalMemoryType, number>;
  averageImportance: number;
  mostAccessed: MemoryFragment[];
  mostRecent: MemoryFragment[];
  storageUsed: {
    bytes: number;
    formatted: string;
  };
}

// ============================================================================
// 知識庫相關類型 (Knowledge Base Types)
// ============================================================================

/**
 * 知識庫資訊
 */
export interface KnowledgeBaseInfo {
  id: string;
  name: string;
  description?: string;
  totalChunks: number;
  totalSizeBytes: number;
  embeddingModel: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * 知識片段
 */
export interface KnowledgeChunk {
  id: string;
  content: string;
  embedding?: number[];
  similarity?: number;
  metadata: Record<string, unknown>;
  source: string;
  createdAt: Date | string;
}

/**
 * 知識注入請求
 */
export interface KnowledgeIngestRequest {
  kbId: string;
  content: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 知識檢索請求
 */
export interface KnowledgeRetrievalRequest {
  kbId: string;
  query: string;
  topK?: number;
  threshold?: number;
}

// ============================================================================
// ARVO 相關類型 (ARVO Types)
// ============================================================================

/**
 * ARVO 處理結果
 */
export interface ARVOProcessResult {
  status: 'success' | 'error';
  arvoAnalysis?: string;
  arvoReasoning?: string;
  arvoVerification?: string;
  actionsTaken?: Array<{
    skill_name: string;
    parameters: Record<string, unknown>;
  }>;
  executionResults?: SkillExecutionResult[];
  response: string;
  rawOutput?: string;
  error?: string;
}

// ============================================================================
// WebSocket 事件類型 (WebSocket Event Types)
// ============================================================================

/**
 * WebSocket 事件類型
 */
export enum WSEventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  THOUGHT = 'thought',
  SKILL_CALL = 'skill_call',
  RAG_CONTEXT = 'rag_context',
  ERROR = 'error',
}

/**
 * WebSocket 訊息
 */
export interface WSMessage {
  type: WSEventType;
  content: unknown;
  timestamp: Date | string;
}

// ============================================================================
// 工具函數類型 (Utility Types)
// ============================================================================

/**
 * 分頁選項
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分頁結果
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  questions?: any[]; // For compatibility
}

/**
 * 時間範圍
 */
export interface TimeRange {
  start: Date | string;
  end: Date | string;
}

/**
 * 健康檢查回應
 */
export interface HealthCheckResponse {
  status: 'online' | 'offline' | 'degraded';
  service: string;
  version: string;
  timestamp: Date | string;
  database?: {
    status: 'healthy' | 'unhealthy';
    version?: string;
  };
  sessions?: number;
}

// ============================================================================
// AI 夥伴遊戲化系統 (AI Partner Gamification Types)
// ============================================================================

// 屬性與成長

export interface PartnerAttributes {
  // 核心德行與戰鬥屬性映射 (1-10 分制)
  // [任脈]
  intelligence: number; // 智 (Intelligence) -> 🔮 MP
  benevolence: number; // 仁 (Benevolence) -> ❤️ HP
  courage: number; // 勇 (Courage) -> ⚔️ ATK

  // [督脈/核心]
  integrity: number; // 誠 (Integrity) -> 🛡️ DEF
  temperance: number; // 節 (Temperance) -> 能源效率/減量
  harmony: number; // 和 (Harmony) -> 生態協作

  // 傳統 1-100 屬性 (保留作為底層計算，但 UI 以 1-10 為主)
  wisdom: number;
  creativity: number;
  precision: number;
  efficiency: number;
  luck: number;
  charisma: number;
}

export interface GrowthParameters {
  totalSkillsUsed: number;
  questsCompleted: number;
  cardsCollected: number;
  epicAbilitiesUnlocked: number;
  legendaryAbilitiesUnlocked: number;
  totalPlayTime: number;
}

export interface AIPartner {
  id: string;
  userId: string;
  name: string;

  // 等級系統
  level: number;
  experience: number;
  experienceToNext: number;

  // 屬性
  attributes: PartnerAttributes;

  // 成長參數
  growth: GrowthParameters;

  // 天賦點數
  talentPoints: {
    available: number;
    total: number;
    spent: number;
  };

  // 時間戳
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

// 技能系統

export enum SkillType {
  ACTIVE = 'active',
  PASSIVE = 'passive',
}

export enum Rarity {
  COMMON = 'common', // 普通
  UNCOMMON = 'uncommon', // 非凡
  BASIC = 'basic', // 基礎
  RARE = 'rare', // 稀有
  EPIC = 'epic', // 史詩
  LEGEND = 'legend', // 傳說
  LEGENDARY = 'legendary', // 傳說 (alias for compatibility)
  MYTHIC = 'mythic', // 神話
  ZENITH = 'zenith', // 巔峰
  EMERGENT = 'emergent', // 湧現
}

export interface SkillAffix {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  bonuses: {
    effectivenessBonus?: number;
    speedBonus?: number;
    qualityBonus?: number;
    criticalChance?: number;
    criticalDamage?: number;
  };
  dropChance: number;
  obtainedAt: Date;
}

export interface SkillEffect {
  type: string;
  value: number;
  duration?: number;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  rarity: Rarity;
  level: number;
  experience: number;
  experienceToNext: number;
  affixes: SkillAffix[];
  effects: SkillEffect[];
  requirements: {
    partnerLevel: number;
    talentPoints?: number;
    prerequisiteSkills?: string[];
  };
  usageCount: number;
  lastUsedAt?: Date;
  unlockedAt: Date;
}

// 天賦星盤

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  constellation:
  | 'knowledge'
  | 'action'
  | 'harmony'
  | 'perception'
  | 'memory'
  | 'reasoning'
  | 'communication'
  | 'safety'
  | 'learning';
  tier: number;
  position: {
    x: number;
    y: number;
  };
  requires: string[];
  cost: number;
  bonuses: AttributeBonus[];
  unlockedSkills?: string[];
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface AttributeBonus {
  attribute: keyof PartnerAttributes | 'all';
  value: number;
  type: 'flat' | 'percentage';
}

export interface StarChart {
  partnerId: string;
  nodes: Record<string, TalentNode>;
  talentPoints: {
    available: number;
    total: number;
    spent: number;
  };
  stats: {
    knowledgeNodesUnlocked: number;
    actionNodesUnlocked: number;
    harmonyNodesUnlocked: number;
  };
}

// 奧義系統

export enum UltimateTier {
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface UltimateEffect {
  type: string;
  power: number;
  duration?: number;
  description: string;
}

export interface UltimateAbility {
  id: string;
  name: string;
  description: string;
  tier: UltimateTier;
  unlockConditions: {
    questId?: string;
    level?: number;
    skillsRequired?: string[];
    cardsRequired?: string[];
  };
  effects: UltimateEffect[];
  cooldown: number;
  lastUsedAt?: Date;
  unlocked: boolean;
  unlockedAt?: Date;
  usageCount: number;
}

// 卡牌系統

export enum CardType {
  SKILL = 'skill',
  ABILITY = 'ability',
  EQUIPMENT = 'equipment',
  ITEM = 'item',
  ARTIFACT = 'artifact',
  ESG = 'esg',
}

export interface CardEffect {
  type: string;
  value: number;
  description: string;
}

export interface OmniCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  artwork: string;
  description: string;
  flavorText: string;
  effects: CardEffect[];
  serialNumber?: number;
  totalPrinted?: number;
  collectedAt?: Date;
  isEquipped: boolean;
}

export interface ESGCard extends OmniCard {
  type: CardType.ESG;
  esgCategory: 'environmental' | 'social' | 'governance';
  framework: 'GRI' | 'TCFD' | 'SASB' | 'SDGs';
  bonuses: {
    knowledgeBonus?: number;
    reportQuality?: number;
    complianceBonus?: number;
  };
}

export interface CardSet {
  id: string;
  name: string;
  description: string;
  cards: string[];
  setBonus: {
    cardsRequired: number;
    bonus: AttributeBonus[];
  };
  collected: number;
  total: number;
  completed: boolean;
}

export interface CardCollection {
  partnerId: string;
  cards: OmniCard[];
  totalCards: number;
  collectedCards: number;
  completionRate: number;
  byType: Record<CardType, number>;
  byRarity: Record<Rarity, number>;
  sets: CardSet[];
}

// 裝備系統

export enum EquipmentSlot {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY_1 = 'accessory_1',
  ACCESSORY_2 = 'accessory_2',
  ARTIFACT = 'artifact',
}

export interface EquipmentEffect {
  type: string;
  value: number;
  description: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  rarity: Rarity;
  level: number;
  maxLevel: number;
  stats: AttributeBonus[];
  specialEffects: EquipmentEffect[];
  upgradeMaterials?: Material[];
  equipped: boolean;
  equippedAt?: Date;
  obtainedAt: Date;
}

// Quest System

export enum QuestType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  STORY = 'story',
}

export interface QuestObjective {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  experience: number;
  talentPoints?: number;
  cards?: string[];
  equipment?: string[];
  gold?: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  objectives: QuestObjective[];
  rewards: QuestReward;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  expiresAt?: Date;
}

export interface ExperienceGain {
  amount: number;
  source: string;
  timestamp: Date;
}

// Trivia & Quiz

export enum TriviaDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  MASTER = 'master',
}

export interface TriviaQuestion {
  id: string;
  category: 'environmental' | 'social' | 'governance' | 'sdgs' | 'framework';
  difficulty: TriviaDifficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedCardId?: string;
}

export interface QuizChallenge {
  id: string;
  partnerId: string;
  targetCardId: string;
  difficulty: TriviaDifficulty;
  questions: TriviaQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  startedAt: Date;
  completedAt?: Date;
  passed: boolean;
}

// Calculation Functions

export function calculateExperienceToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function calculateTotalExperience(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateExperienceToNextLevel(i);
  }
  return total;
}

// ============================================================================
// 社群系統 (Social System)
// ============================================================================

/**
 * 師徒關係
 */
export interface Mentorship {
  id: string;
  mentorId: string; // 師父 ID
  apprenticeId: string; // 徒弟 ID
  status: 'active' | 'graduated' | 'terminated'; // Active | Graduated | Terminated
  formedAt: Date;
  graduatedAt?: Date;

  // 傳承記錄
  inheritedKnowledgeIds: string[]; // 已傳承的知識 ID
  inheritedAbilityIds: string[]; // 已傳承的奧義 ID
}

/**
 * Guild System
 */
export interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  leaderId: string; // Leader ID
  members: GuildMember[];

  // 資源
  treasury: {
    gold: number;
    tokens: number;
    materials: Record<string, number>;
  };

  // 科技/加成
  technologies: GuildTechnology[];

  createdAt: Date;
}

export interface GuildMember {
  userId: string;
  partnerId: string; // 代表夥伴
  role: 'leader' | 'officer' | 'member' | 'recruit';
  joinedAt: Date;
  contribution: number; // Contribution
}

export interface GuildTechnology {
  id: string;
  name: string;
  level: number;
  effect: AttributeBonus; // 加成效果
}

// ============================================================================
// 經濟與訂閱系統 (Economy & Subscription)
// ============================================================================

/**
 * 訂閱層級
 */
export enum SubscriptionTier {
  FREE = 'FREE',
  PLUS = 'PLUS',
  PRO = 'PRO',
  SUBSCRIBER = 'SUBSCRIBER',
  SOVEREIGN = 'SOVEREIGN',
}

/**
 * 使用者帳戶/訂閱狀態
 */
export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'expired' | 'canceled';
  expiresAt?: Date;

  // 特權限制
  limits: {
    maxPartners: number; // 最大夥伴數
    maxInventorySlots: number; // 最大倉庫格數
    dailyEnergyMax: number; // 每日體力上限
    dailyGachaLimit: number; // 每日抽卡上限
  };

  // 當前狀態
  currentEnergy: number; // 當前體力
  lastEnergyRegenAt: Date; // 上次體力恢復時間

  // 錢包 (New)
  wallet: Wallet;
}

/**
 * Goodness Sustainable Coin (GSC) System
 */
export interface Wallet {
  balance: number; // Current balance (GSC)
  totalEarned: number; // Total earned
  transactions: Transaction[];
}

export enum TransactionType {
  REWARD = 'reward', // Reward (Daily login, learning)
  PURCHASE = 'purchase', // Purchase (Equipment, cards)
  DONATION = 'donation', // Donation (Guild)
  MENTORSHIP = 'mentorship', // Mentorship reward
  REFERRAL = 'referral', // Referral reward
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
}

// ============================================================================
// Alliance & Ambassador System
// ============================================================================

export enum Faction {
  TERRA_GUARDIANS = 'Terra Guardians', // (Environment)
  HUMANITY_UNITED = 'Humanity United', // (Social)
  FUTURE_ARCHITECTS = 'Future Architects', // (Governance)
}

export interface AmbassadorProfile {
  userId: string;
  faction: Faction;
  referralCode: string;
  totalReferrals: number;
  totalEarnedGSC: number;
  rank: 'Ambassador' | 'Consul' | 'Minister'; // Ambassador -> Consul -> Minister
}

// ============================================================================
// Career System
// ============================================================================

export enum CareerPath {
  NONE = 'None',
  CARBON_AUDITOR = 'Carbon Auditor', // (E Specialty)
  IMPACT_INVESTOR = 'Impact Investor', // (S Specialty)
  ETHICS_COMPLIANCE = 'Ethics Officer', // (G Specialty)
  ESG_STRATEGIST = 'ESG Strategist', // (All-rounder)
}

export interface CareerProfile {
  path: CareerPath;
  level: number; // Career Level
  experience: number; // Career Experience
  title: string; // Title (e.g. "Senior Carbon Auditor")
  specialties: string[]; // Specialties (e.g. "ISO 14064", "SROI")
  passiveBonuses: {
    stat: string;
    value: number;
  }[];
}

export interface UserProfileExtension {
  career?: CareerProfile;
  // ... other extended profile data
}

// ============================================================================
// Content & Narrative System
// ============================================================================

export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  unlockLevel: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  scenes: StoryScene[];
  rewards: {
    gsc: number;
    exp: number;
    items?: string[];
  };
}

export interface StoryScene {
  id: string;
  background: string; // URL or style class
  characters: {
    name: string;
    avatar: string;
    position: 'left' | 'center' | 'right';
  }[];
  dialogue: {
    speaker: string;
    text: string;
  };
  choices?: {
    text: string;
    nextSceneId: string;
    effect?: string;
  }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  date: string;
  category: 'Environment' | 'Social' | 'Governance' | 'Tech' | 'Policy';
  impactScore: number; // 1-10
  imageUrl?: string;
}

export interface CaseStudy {
  id: string;
  companyName: string;
  industry: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
  tags: string[]; // e.g. ["Circular Economy", "Carbon Neutral"]
}

/**
 * Warehouse Expansion
 */
export interface Warehouse {
  userId: string;
  slots: number; // Current slots
  maxSlots: number; // Max slots (affected by subscription)
  items: OmniCard[];
}

// ============================================================================
// Rune Arts System
// ============================================================================

export enum RuneCategory {
  PERCEPTION = 'perception',
  MEMORY = 'memory',
  REASONING = 'reasoning',
  ACTION = 'action',
  COMMUNICATION = 'communication',
  SECURITY = 'security',
  LEARNING = 'learning',
  ULTIMATE = 'ultimate',
  MYSTIC = 'mystic',
}

export enum ProficiencyLevel {
  NOVICE = 'novice', // Novice
  APPRENTICE = 'apprentice', // Apprentice
  ADEPT = 'adept', // Adept
  EXPERT = 'expert', // Expert
  MASTER = 'master', // Master
  GRANDMASTER = 'grandmaster', // Grandmaster
}

export interface Rune {
  id: string;
  name: string;
  description: string;
  category: RuneCategory;
  proficiency: {
    level: ProficiencyLevel;
    usageCount: number;
    successRate: number;
    lastUsedAt?: Date | string;
  };
  unlockedAt: Date | string;
  basePower: number;
  complexity: number;
  metadata?: Record<string, unknown>;
}

/**
 * Ultimate - Awakened Composite Runes
 */
export interface UltimateRune extends Rune {
  type: 'composite';
  ultimate: {
    tier: 'epic' | 'legendary' | 'mythic';
    power: number;
    cooldown: number;
    energyCost: number;
  };
  enlightenment?: {
    triggerCondition: string;
    probability: number;
    requiredProficiency: ProficiencyLevel;
  };
  inheritance?: {
    canTeach: boolean;
    learnDifficulty: number;
    prerequisites: string[];
  };
}

// ============================================================================
// Constellations & Truth System
// ============================================================================

export interface TruthDataLabel {
  id: string;
  sourceIds: string[];
  verificationHash: string;
  timestamp: Date;
  confidenceScore: number;
  verifiedBy: string[]; // Verifier IDs
  isImmutable: boolean;
}

export interface ZeroHallucinationRAG {
  enabled: boolean;
  strictMode: boolean;
  truthLabels: TruthDataLabel[];
  blockedSources: string[];
  verificationLevel: 'high' | 'medium' | 'low';
}

export type Language = 'en' | 'zh-TW';

// ============================================================================
// Mission System
// ============================================================================

export type MissionType = 'DAILY' | 'WEEKLY' | 'CAREER' | 'CHALLENGE';
export type MissionRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type MissionStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED' | 'CLAIMED';

export interface MissionReward {
  gsc?: number;
  exp?: number;
  items?: string[]; // Item IDs
  badges?: string[]; // Badge IDs
}

export interface Mission {
  id: string;
  type: MissionType;
  rarity: MissionRarity;
  title: string;
  description: string;
  status: MissionStatus;

  // 進度
  progress: number;
  target: number;
  unit?: string; // e.g., "times", "GSC", "Energy"

  // 獎勵
  rewards: MissionReward;

  // 時效 (可選)
  expiresAt?: Date;
  resetAt?: Date;

  // 關聯 (可選)
  relatedSkillId?: string;
  relatedBadgeId?: string;
}

// ============================================================================
// Personalization & Home System
// ============================================================================

export interface UserProfile {
  nickname: string;
  avatarUrl?: string; // Optional custom avatar
  badges: string[]; // Displayed or owned badge IDs
  homeData: HomeData;
}

export interface HomeData {
  themeId: string;
  furniture: FurniturePlacement[];
  visitors: number;
}

export interface Furniture {
  id: string;
  name: string;
  type: 'WALL' | 'FLOOR' | 'DECORATION' | 'FURNITURE';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number; // GSC
}

export interface FurniturePlacement {
  furnitureId: string;
  position: { x: number; y: number };
}

// ============================================================================
// Advanced Game Mechanics (Phase 8)
// ============================================================================

// 1. World Events
export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  totalProgress: number;
  targetProgress: number;
  unit: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  expiresAt: Date;
  rewards: {
    buff: string; // Server-wide buff description
    item?: string;
  };
  participants: number;
}

// 2. Partner Evolution
export type EvolutionStage = 'FORM_0' | 'FORM_1' | 'FORM_2' | 'FORM_3';
export interface PartnerVisual {
  stage: EvolutionStage;
  variant: string; // e.g., 'forest_guardian', 'tech_sage' based on CareerPath
  auraColor: string;
  accessoryId?: string; // Digital pet or item
}

// 3. Leaderboards
export interface LeaderboardEntry {
  userId: string;
  nickname: string;
  score: number;
  rank: number;
  guildName?: string;
  avatarUrl?: string;
}

export type LeaderboardType = 'EXP' | 'GSC' | 'CONTRIBUTION' | 'CARBON_SAVED';

// 4. Debate Arena
export interface DebateCard {
  id: string;
  name: string;
  type: 'ATTACK' | 'DEFENSE' | 'BUFF';
  value: number;
  cost: number;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC';
}

export interface DebateState {
  playerHP: number;
  playerAP: number;
  enemyHP: number;
  round: number;
  playerHand: DebateCard[];
  playerDeck: DebateCard[];
  discardPile: DebateCard[];
  status: 'PLAYER_TURN' | 'ENEMY_TURN' | 'VICTORY' | 'DEFEAT';
  logs: string[];
  enemyIntent?: 'ATTACK' | 'DEFENSE'; // Added optional property
}

// 5. 奧秘卡牌 (LegendaryOmniCard) - Partner Legends
export interface LegendaryOmniCard {
  id: string;
  title: string;
  description: string;
  partnerName: string; // e.g., 'Lingostep', 'Wangdao'
  partnerUrl: string; // External link
  rarity: 'LEGENDARY';
  effectType: 'PASSIVE' | 'ACTIVE';
  effectValue: string; // Description of the special effect
  imageUrl?: string;
}

// 6. AVG Affinity & Map System
export type LocationID =
  | 'esg_tower'
  | 'wangdao_citadel'
  | 'samwells_lab'
  | 'freetime_cabin'
  | 'lingostep_hub';

export interface PartnerAffinity {
  partnerId: string; // e.g., 'esg_sunshine', 'wangdao'
  level: number;
  currentHearts: number;
  maxHearts: number;
  unlockedDialogs: string[];
  isMaxed: boolean;
}

export interface WorldLocation {
  id: LocationID;
  name: string;
  description: string;
  partnerId: string;
  coordinates: { x: number; y: number }; // For visual map placement (0-100%)
  backgroundImage?: string;
  availableActions: ('TALK' | 'GIFT' | 'QUEST')[];
}
