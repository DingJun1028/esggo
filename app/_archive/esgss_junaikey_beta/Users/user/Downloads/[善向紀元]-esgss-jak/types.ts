
import { z } from 'zod';

export type Language = 'zh-TW' | 'en-US';
export type ThemeMode = 'light' | 'dark' | 'cosmic' | 'system';

export enum View {
    MY_ESG = 'my_esg',
    DASHBOARD = 'dashboard',
    BUSINESS_INTEL = 'business_intel',
    STRATEGY = 'strategy',
    STRATEGY_HUB = 'strategy_hub',
    REGENERATIVE = 'regenerative',
    CARBON = 'carbon',
    CARBON_ASSET = 'carbon_asset',
    CARBON_WALLET = 'carbon_wallet',
    REPORT = 'report',
    REPORT_GEN = 'report_gen',
    ADAN_ZONE = 'adan_zone',
    YANG_BO = 'yang_bo',
    ACADEMY = 'academy',
    PARTNER_PORTAL = 'partner_portal',
    VAULT = 'vault',
    RESTORATION = 'restoration',
    CARD_GAME_ARENA = 'card_game_arena',
    CARD_GAME_ARENA_NEW = 'card_game_arena_new',
    USER_JOURNAL = 'user_journal',
    ABOUT_US = 'about_us',
    TECHNICAL_DOCS = 'technical_docs',
    API_ZONE = 'api_zone',
    UNIVERSAL_BACKEND = 'universal_backend',
    RESEARCH_HUB = 'research_hub',
    ANALYTICS_DASHBOARD = 'analytics_dashboard',
    DIAGNOSTICS = 'diagnostics',
    TALENT = 'talent',
    TALENT_PASSPORT = 'talent_passport',
    INTEGRATION = 'integration',
    INTEGRATION_HUB = 'integration_hub',
    CULTURE = 'culture',
    CULTURE_BOT = 'culture_bot',
    FINANCE = 'finance',
    FINANCE_SIM = 'finance_sim',
    AUDIT = 'audit',
    AUDIT_TRAIL = 'audit_trail',
    GOODWILL = 'goodwill',
    GOODWILL_COIN = 'goodwill_coin',
    GAMIFICATION = 'gamification',
    SETTINGS = 'settings',
    HEALTH_CHECK = 'health_check',
    UNIVERSAL_TOOLS = 'universal_tools',
    UNIVERSAL_SYSTEM = 'universal_system',
    THINK_TANK = 'think_tank',
    ALUMNI_ZONE = 'alumni_zone',
    LIBRARY = 'library',
    SOUL_FORGE = 'soul_forge',
    AGENT_ARENA = 'agent_arena',
    AGENT_TRAINING = 'agent_training',
    PROXY_MARKET = 'proxy_market',
    PALACE = 'palace',
    AFFILIATE = 'affiliate',
    GLOBAL_OPS = 'global_ops',
    WORKFLOW_LAB = 'workflow_lab',
    MCP_CONFIG = 'mcp_config',
    IMPACT_PROJECTS = 'impact_projects',
    UNIVERSAL_NOTES = 'universal_notes',
    HYPERCUBE_LAB = 'hypercube_lab',
    ADMIN_PANEL = 'admin_panel',
    ECOSYSTEM_RADAR = 'ecosystem_radar',
    FLOWLU_INTEGRATION = 'flowlu_integration',
    SUPPLIER_CRM = 'supplier_crm',
    SUPPLIER_SURVEY = 'supplier_survey',
    MARKETING_STRATEGY = 'marketing_strategy',
    ENTERPRISE_SERVICES = 'enterprise_services',
    AGENT_TASKS = 'agent_tasks',
    UNIVERSAL_CREATOR_DASHBOARD = 'universal_creator_dashboard',
    OMNI_MANAGER = 'omni_manager',
    CARD_ARENA = 'card_arena',
    UNIVERSAL_AGENT = 'universal_agent',
    ESG_AI_ASSISTANT = 'esg_ai_assistant'
}

export const TaskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export const TaskPrioritySchema = z.nativeEnum(TaskPriority);
export type TaskPriorityType = z.infer<typeof TaskPrioritySchema>;

export const AgentTaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    assigneeId: z.string(),
    status: TaskStatusSchema,
    progress: z.number(),
    createdAt: z.number(),
    dueDate: z.string(),
    priority: TaskPrioritySchema,
    locationId: z.string(),
    dependencies: z.array(z.string()).optional(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

export type DimensionID = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10' | 'A11' | 'A12';

export interface Course {
    id: string;
    title: string;
    thumbnail: string;
    level: string;
    category: string;
    progress: number;
}

export const CourseSchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    level: z.string(),
    category: z.string(),
    progress: z.number(),
});

export const UniversalCrystalSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['Perception', 'Cognition', 'Memory', 'Expression', 'Nexus']),
    description: z.string(),
    state: z.enum(['Fragmented', 'Crystallizing', 'Restored', 'Perfected']),
    integrity: z.number(),
    fragmentsCollected: z.number(),
    fragmentsRequired: z.number(),
});
export type UniversalCrystal = z.infer<typeof UniversalCrystalSchema>;

export const UserTitleSchema = z.object({
    id: z.string(),
    text: z.string(),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']),
    bonusEffect: z.string().optional(),
    description: z.string().optional(),
});
export type UserTitle = z.infer<typeof UserTitleSchema>;

export const BadgeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.enum(['Milestone', 'Achievement', 'Social']),
    unlockedAt: z.number().optional(),
});
export type Badge = z.infer<typeof BadgeSchema>;

export const OfficialEventSchema = z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    status: z.enum(['Upcoming', 'Participating', 'Completed']),
    xpReward: z.number(),
});
export type OfficialEvent = z.infer<typeof OfficialEventSchema>;

export interface ReportSection {
    id: string;
    title: string;
    template?: string;
    example?: string;
    griStandards?: string;
    subSections?: ReportSection[];
}

export const EsgCardRaritySchema = z.enum(['Common', 'Rare', 'Epic', 'Legendary']);
export type EsgCardRarity = z.infer<typeof EsgCardRaritySchema>;

export const EsgCardAttributeSchema = z.enum(['Vision', 'Governance', 'Knowledge']);
export type EsgCardAttribute = z.infer<typeof EsgCardAttributeSchema>;

export type MasteryLevel = 'Novice' | 'Intermediate' | 'Advanced' | 'Master';

export const EsgCardTypeSchema = z.enum(['Knowledge', 'Case', 'Action', 'Event']);
export type EsgCardType = z.infer<typeof EsgCardTypeSchema>;

export const EsgCardSchema = z.object({
    id: z.string(),
    title: z.string(),
    term: z.string(),
    definition: z.string(),
    description: z.string(),
    rarity: EsgCardRaritySchema,
    attribute: EsgCardAttributeSchema,
    cardType: EsgCardTypeSchema,
    collectionSet: z.string(),
    stats: z.object({ defense: z.number(), offense: z.number() }),
    imageUrl: z.string().optional(),
});
export type EsgCard = z.infer<typeof EsgCardSchema>;

// Sample ESG Cards data
const sampleEsgCards: EsgCard[] = [
    {
        id: '1',
        title: '永續發展',
        term: 'Sustainable Development',
        definition: '滿足當代需求而不損害後代滿足需求的能力',
        description: '實現經濟、社會和環境三方面的平衡發展',
        rarity: 'Legendary',
        attribute: 'Vision',
        cardType: 'Knowledge',
        collectionSet: 'Core ESG',
        stats: { defense: 95, offense: 85 }
    },
    {
        id: '2',
        title: '碳足跡',
        term: 'Carbon Footprint',
        definition: '個人、組織或產品的溫室氣體排放總量',
        description: '衡量活動對氣候變化的影響',
        rarity: 'Epic',
        attribute: 'Governance',
        cardType: 'Case',
        collectionSet: 'Climate',
        stats: { defense: 80, offense: 75 }
    },
    {
        id: '3',
        title: '企業社會責任',
        term: 'Corporate Social Responsibility',
        definition: '企業對社會和環境的責任',
        description: '超越法律要求的自願行動',
        rarity: 'Rare',
        attribute: 'Knowledge',
        cardType: 'Action',
        collectionSet: 'Corporate',
        stats: { defense: 70, offense: 65 }
    }
];

export const getEsgCards = (language: Language): EsgCard[] => {
    // In a real implementation, this would filter/localize based on language
    return sampleEsgCards;
};

export interface ScriptureNode {
    id: string;
    code: string;
    title: string;
    en: string;
    content: string;
    category: string;
    tags: { zh: string; en: string }[];
}

export interface EvolutionLogEntry {
    id: string;
    timestamp: number;
    action: string;
    details?: string;
    type: 'OPTIMIZATION' | 'ALERT' | 'INFO';
}

export interface TrinityState {
    perception: number;
    cognition: number;
    action: number;
}

export interface OperationalKpi {
    efficiency: { hoursSaved: number; reportLatency: number; commFriction: number };
    sanctity: { ocrAccuracy: number; gapCoverage: number };
    resonance: { actionFrequency: number; autoInterventions: number };
    integrity: { apiSyncRate: number; responseDelay: number };
}

export interface SystemVital {
    evolutionStage: number;
    contextLoad: number;
    activeThreads: number;
    memoryNodes: number;
    entropy: number;
    integrityScore: number;
    trinity: TrinityState;
    synergyLevel: number;
    activeCircuits: number;
    isEvolving?: boolean;
    kpis: OperationalKpi;
}

export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    source: string;
    growth?: ComponentGrowth;
    label?: any;
}

export interface UniversalKnowledgeNode {
    id: string;
    type: 'component' | 'concept' | 'data';
    label: UniversalLabel;
    currentValue: any;
    traits: OmniEsgTrait[];
    confidence: OmniEsgConfidence;
    lastInteraction: number;
    interactionCount: number;
    memory: { history: any[]; aiInsights: any[] };
    growth: ComponentGrowth;
}

export interface DimensionProtocol {
    id: DimensionID;
    name: string;
    description: string;
    status: 'stable' | 'unstable' | 'optimizing';
    integrity: number;
}

export interface UnitTestResult {
    id: string;
    name: string;
    status: 'pass' | 'fail';
    details: string;
    timestamp: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'reward';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}

export type OmniEsgTrait = 'learning' | 'optimization' | 'bridging' | 'evolution' | 'seamless' | 'gap-filling';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list' | 'compact' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'cyan' | 'rose' | 'slate';

export interface UniversalLabel {
    text: string;
    definition?: string;
    formula?: string;
    rationale?: string;
    id?: string; // For node registration
}

export interface LogicWitness {
    witnessHash: string;
}

export interface McpRunActionOutput {
    success: boolean;
    result: any;
    error: string | null;
}

export interface SemanticContext {
    keywords: string[];
}

export interface NeuralSignal {
    id: string;
    origin: string;
    type: 'DATA_COLLISION' | 'LOGIC_RESONANCE' | 'ENTROPY_PURGE' | 'RUNE_ACTIVATION' | 'CIRCUIT_TRIP' | 'MEMORY_COMMITTED';
    intensity: number;
    payload?: any;
    timestamp: number;
}

export interface McpServer {
    id: string;
    name: string;
    url: string;
    status: 'connected' | 'connecting' | 'failed';
    transport: 'sse' | 'streamable_http';
    auth: 'none' | 'oauth';
    latency: number;
    tools: { name: string; description: string }[];
    documentationUrl?: string;
}

export interface ComponentGrowth {
    heat: number;
    evolutionLevel: number;
    lastInteraction: number;
    circuitStatus: CircuitStatus;
}

export type CircuitStatus = 'OPEN' | 'CLOSED';

export interface FinancialEntry {
    date: string;
    amount: number;
    category: string;
    description: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details: string;
    hash: string;
}

export interface LifeEsgQuest {
    id: string;
    category: string;
    title: string;
    enTitle: string;
    impactDesc: string;
    xpReward: number;
    gwcReward: number;
    traitBonus: { trait: string; value: number };
    status: 'ready' | 'completed';
    icon: any;
    verifiedHash?: string;
    rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    desc?: string;
    type?: string;
}

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface WebhookConfig {
    id: string;
    eventType: string;
    url: string;
    status: 'active' | 'inactive';
}

export interface WebhookDelivery {
    id: string;
    webhookId: string;
    timestamp: number;
    status: number;
    response: string;
}

export interface KernelLog {
    id: string;
    timestamp: number;
    source: 'KERNEL' | 'MCP' | 'EVOLUTION' | 'BACKEND' | 'AUTH' | 'MANIFEST' | 'SYNC' | 'RAG' | 'LOGIC' | 'SEC' | 'FINANCE';
    operation: string;
    level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    metadata?: any;
}

export interface AppFile {
    id: string;
    name: string;
    size: number;
    type: string;
    category: string;
    uploadedAt: number;
    url: string;
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

export interface DigitalSoulAsset {
    id: string;
    name: string;
    traits: SoulForgeConfig;
    resonance: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    forgedAt: number;
    ownerId: string;
}

export interface SoulForgeConfig {
    altruism: number;
    pragmatism: number;
    innovation: number;
    stability: number;
}

export interface TrainingDoc {
    id: string;
    name: string;
    status: 'parsing' | 'ready' | 'error';
    type: string;
    atomsCount: number;
}

export interface AdanDisciple {
    alignment: number;
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

export interface EntityPlanet {
    taxId: string;
}

export interface UserJournalEntry {
    id: string;
    title: string;
    impact: string;
    xpGained: number;
    timestamp: number;
    type: 'milestone' | 'action' | 'insight';
    tags: string[];
}

export interface AgentCertification {
    id: string;
    title: string;
    status: 'Locked' | 'In_Progress' | 'Certified';
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

// JunAiKey 五維靈魂架構 - 深度整合
export enum SoulDimension {
  COVENANT = 'COVENANT',      // 聖約層 - 系統指引與道德準則
  ESSENCE = 'ESSENCE',        // 本質層 - 角色人設與性格定義
  MEMORY = 'MEMORY',          // 記憶層 - 知識庫與RAG資料
  POWER = 'POWER',            // 權能層 - 技能樹與工具調用
  SPIRIT_BASE = 'SPIRIT_BASE' // 靈基層 - 模型參數與運算配置
}

export enum SkillType {
  ACTIVE = 'ACTIVE',          // 主動技 - 顯式調用工具
  PASSIVE = 'PASSIVE',        // 被動技 - 隱式持續效果
  COMPOSITE = 'COMPOSITE'     // 組合技 - 多技能協同
}

export enum EntropyLevel {
  ZERO = 'ZERO',              // 秩序 - 數據正常
  LOW = 'LOW',                // 輕微混亂 - 小問題
  HIGH = 'HIGH',              // 嚴重混亂 - 大問題
  CRITICAL = 'CRITICAL'       // 完全混沌 - 系統級問題
}

export enum HealingStrategy {
  PASS_THROUGH = 'PASS_THROUGH',    // 直通 - 數據正常
  FORMAT_FIX = 'FORMAT_FIX',        // 格式修復 - 修復數據格式
  GAP_FILLING = 'GAP_FILLING',      // 填補 - 使用預測值
  AI_ENHANCEMENT = 'AI_ENHANCEMENT', // AI增強 - 智慧修復
  ROLLBACK = 'ROLLBACK'             // 回滾 - 使用安全值
}

export interface SoulContract {
  id: string;
  prompt: string;                    // 系統指引詞
  safetyRules: string[];             // 安全約束規則
  ethicalBoundaries: string[];       // 道德邊界
  behavioralLimits: string[];        // 行為限制
}

export interface SoulEssence {
  id: string;
  name: string;                      // 代理名稱
  archetype: string;                 // 原型分類
  tone: string;                      // 語氣風格
  backstory: string;                 // 背景故事
  personalityTraits: string[];       // 性格特質
  communicationStyle: string;        // 溝通風格
}

export interface SoulMemory {
  id: string;
  knowledgeBaseIds: string[];        // 知識庫ID列表
  vectorStoreIds: string[];          // 向量存儲ID
  retentionPolicy: {
    maxAge: number;                  // 最大保留時間(天)
    compressionThreshold: number;    // 壓縮閾值
    archiveStrategy: string;         // 歸檔策略
  };
  contextWindow: number;             // 上下文窗口大小
}

export interface SoulSkill {
  id: string;
  name: string;                      // 技能名稱
  type: SkillType;                   // 技能類型
  description: string;               // 技能描述
  parameters: Record<string, any>;   // 參數配置
  cooldown?: number;                 // 冷卻時間(秒)
  energyCost: number;                // 能量消耗
  mastery: number;                   // 熟練度(0-100)
  lastUsed?: number;                 // 最後使用時間
}

export interface SoulAuthority {
  id: string;
  skills: SoulSkill[];               // 技能樹
  permissions: string[];             // 權限列表
  accessLevel: number;               // 訪問等級
  rateLimits: {
    requestsPerMinute: number;       // 每分鐘請求數
    tokensPerRequest: number;        // 每請求token數
  };
}

export interface SoulFoundation {
  id: string;
  modelConfig: {
    provider: 'openai' | 'gemini' | 'claude' | 'local';
    model: string;                   // 模型名稱
    temperature: number;             // 創造性(0-2)
    maxTokens: number;               // 最大token數
    topP?: number;                   // 核取樣參數
    frequencyPenalty?: number;       // 頻率懲罰
  };
  performanceMetrics: {
    responseTime: number;            // 平均響應時間
    tokenEfficiency: number;         // token使用效率
    accuracy: number;                // 準確率
  };
}

export interface SoulAvatar {
  id: string;
  baseAgentId: string;               // 基礎代理ID
  personaMask: Record<string, any>;  // 人設面具
  capabilityFilter: string[];        // 能力過濾器
  contextOverride?: Record<string, any>; // 上下文覆蓋
  sessionIsolation: boolean;         // 會話隔離
  lifetime: number;                  // 生命週期(秒)
  createdAt: number;
}

export interface SoulResonance {
  agentId: string;
  avatarId: string;
  interactionCount: number;
  resonanceScore: number;            // 共鳴分數(0-100)
  entropyHistory: number[];          // 熵值歷史
  evolutionLog: Array<{
    timestamp: number;
    action: string;
    entropyDelta: number;
  }>;
}

export interface EvolutionProposal {
  id: string;
  pattern: string;                   // 檢測到的模式
  confidence: number;                // 信心度
  suggestedSkill: SoulSkill;         // 建議技能
  trainingData: any[];               // 訓練數據
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  createdAt: number;
}

// 完整的五維靈魂架構
export interface AgentSoul5D {
  id: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'TRAINING' | 'ARCHIVED';

  // 五維靈魂結構
  covenant: SoulContract;            // 聖約層
  essence: SoulEssence;              // 本質層
  memory: SoulMemory;                // 記憶層
  authority: SoulAuthority;          // 權能層
  foundation: SoulFoundation;        // 靈基層

  // 動態化身支持
  avatars: SoulAvatar[];             // 可用的化身
  activeAvatar?: string;             // 當前活動化身ID

  // 進化與學習
  resonance: SoulResonance;          // 共鳴數據
  evolutionProposals: EvolutionProposal[]; // 進化建議

  // 元數據
  createdAt: number;
  lastModified: number;
  creator: string;
  tags: string[];
}

// 超立方進化協議
export interface TesseractEvolutionProtocol {
  targetAgent: string;

  // 四維統一目標
  optimization: {
    performanceTarget: number;       // 效能提升目標(%)
    compressionTarget: number;       // 體積壓縮目標(%)
    simplicityScore: number;         // 簡單性評分
  };

  expansion: {
    newFeatures: string[];           // 新功能衍生
    resilienceImprovements: string[];// 韌性增強
  };

  integration: {
    modularCompliance: boolean;      // 模組化合規性
    standardInterfaces: string[];    // 標準介面
  };

  innovation: {
    paradigmShifts: string[];        // 範式轉移
    adaptiveCapabilities: string[];  // 自適應能力
  };

  status: 'PLANNING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  progress: number;
}

// 雙向同步橋接器
export interface BidirectionalSyncBridge {
  sourceSystem: 'ESG_SYSTEM' | 'BOOST_SPACE' | 'JUNAIKEY_HUB';
  targetSystem: 'ESG_SYSTEM' | 'BOOST_SPACE' | 'JUNAIKEY_HUB';

  mappings: {
    entityMappings: Record<string, string>;    // 實體映射
    fieldMappings: Record<string, string>;     // 字段映射
    workflowMappings: Record<string, string>;  // 工作流映射
  };

  syncRules: {
    triggerEvents: string[];          // 觸發事件
    conflictResolution: 'SOURCE_WINS' | 'TARGET_WINS' | 'MERGE' | 'MANUAL';
    frequency: 'REAL_TIME' | 'MINUTELY' | 'HOURLY' | 'DAILY';
  };

  healthMetrics: {
    lastSync: number;
    successRate: number;
    latency: number;
    errorCount: number;
  };
}

export interface SkillNode {
    id: string;
    name: string;
    type: 'Active' | 'Passive' | 'Composite';
    description: string;
    mastery: number;
    status: 'Ready' | 'Cooldown' | 'Locked';
}



export interface CarbonMarketHistory {
    time: string;
    price: number;
}

export interface CarbonAssetPackage {
    assetId: string;
    totalValue: number;
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
    metrics: { electricity_total: number; renewable_percent: number; iso_certified: boolean; safety_incidents: number; gender_pay_ratio: number; ethics_signed: boolean };
    flowluMapping: { crm_account_id: string; custom_fields: any };
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

export type NoteLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface NoteItem {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    tags: string[];
    level: NoteLevel;
    aiMetadata?: { summary?: string; insights?: string[] };
    manifestedContent?: string;
    imageUrl?: string;
}

export interface ImpactProject {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
    impactXP: number;
    sdgs: number[];
    logicModel: { inputs: string[]; activities: string[]; outputs: string[]; outcomes: string[]; impact: string };
    milestones: ProjectMilestone[];
    financials: { budget: number; spent: number; revenue_projected: number; roi_projected: number };
    impactMetrics: { label: string; current: number; target: number; unit: string; proxy_value: number }[];
    sroi: number;
}

export interface ProjectMilestone {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    xpReward: number;
    description: string;
    verifiedHash?: string;
}

export type VocationType = 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';

// User Roles and Permissions
export enum Permission {
    ADMIN_ACCESS = 'ADMIN_ACCESS',
    VIEW_MY_ESG = 'VIEW_MY_ESG',
    VIEW_DASHBOARD = 'VIEW_DASHBOARD',
    VIEW_RESEARCH_HUB = 'VIEW_RESEARCH_HUB',
    VIEW_AUDIT = 'VIEW_AUDIT',
    VIEW_UNIVERSAL_AGENT = 'VIEW_UNIVERSAL_AGENT',
    VIEW_ARCHITECT_CONSOLE = 'VIEW_ARCHITECT_CONSOLE',
    VIEW_FIREWALL_GUARDIAN = 'VIEW_FIREWALL_GUARDIAN',
    VIEW_SITUATION_LOGS = 'VIEW_SITUATION_LOGS',
    VIEW_OMNIPOTENT_MATRIX = 'VIEW_OMNIPOTENT_MATRIX',
    VIEW_UNIVERSAL_MODULE_12A = 'VIEW_UNIVERSAL_MODULE_12A',
    VIEW_ESG_WAR_ROOM = 'VIEW_ESG_WAR_ROOM',
    VIEW_ANNUAL_REPORT_GENERATOR = 'VIEW_ANNUAL_REPORT_GENERATOR',
    // Core System Permissions
    VIEW_GENESIS_PRIME_OS = 'VIEW_GENESIS_PRIME_OS',
    VIEW_OMNI_CONTEXT_ENGINE = 'VIEW_OMNI_CONTEXT_ENGINE',
    VIEW_OMNI_SOVEREIGN_GOVERNANCE = 'VIEW_OMNI_SOVEREIGN_GOVERNANCE',
    VIEW_FOUNDATIONAL_INTELLIGENCE = 'VIEW_FOUNDATIONAL_INTELLIGENCE',
}

export enum AnalysisType {
    STATISTICAL = 'STATISTICAL',
    TREND = 'TREND',
    CORRELATION = 'CORRELATION',
    COMPARISON = 'COMPARISON',
    DISTRIBUTION = 'DISTRIBUTION',
    CUSTOM = 'CUSTOM'
}

export enum UserRole {
    ADMIN = 'ADMIN',
    ESG_MANAGER = 'ESG_MANAGER',
    ANALYST = 'ANALYST',
    AUDITOR = 'AUDITOR',
    VIEWER = 'VIEWER',
}

export const RolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: Object.values(Permission),
    [UserRole.ESG_MANAGER]: [
        Permission.VIEW_MY_ESG,
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_RESEARCH_HUB,
        Permission.VIEW_AUDIT,
        Permission.VIEW_UNIVERSAL_AGENT,
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
        Permission.VIEW_UNIVERSAL_AGENT,
        Permission.VIEW_ARCHITECT_CONSOLE,
        Permission.VIEW_SITUATION_LOGS,
        Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE,
        Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
    ],
    [UserRole.VIEWER]: [
        Permission.VIEW_MY_ESG,
        Permission.VIEW_DASHBOARD,
    ],
};

// Additional Type Definitions for Modern React Development

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp?: number;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ComponentProps {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent) => void;
    onChange?: (event: React.ChangeEvent) => void;
}

export interface ChartDataPoint {
    x: number | string;
    y: number;
    label?: string;
    color?: string;
}

export interface DashboardWidget {
    id: string;
    title: string;
    type: 'chart' | 'metric' | 'list' | 'table';
    size: 'small' | 'medium' | 'large';
    position: { x: number; y: number };
    data?: any;
    config?: Record<string, any>;
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
}

export interface UserPreferences {
    language: Language;
    theme: ThemeMode;
    notifications: NotificationSettings;
    timezone: string;
    dateFormat: string;
}

export interface SearchFilters {
    query?: string;
    category?: string;
    dateRange?: { start: string; end: string };
    status?: string;
    tags?: string[];
}

export interface ExportOptions {
    format: 'pdf' | 'excel' | 'csv' | 'json';
    includeCharts: boolean;
    includeData: boolean;
    dateRange?: { start: string; end: string };
}

export interface ValidationRule {
    field: string;
    rule: string;
    value?: any;
    message: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
    required?: boolean;
    placeholder?: string;
    validation?: ValidationRule[];
    options?: { label: string; value: any }[];
    defaultValue?: any;
}

export interface ModalConfig {
    title: string;
    content: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    closable?: boolean;
    footer?: React.ReactNode;
    onClose?: () => void;
    onConfirm?: () => void;
}

export interface LoadingState {
    isLoading: boolean;
    progress?: number;
    message?: string;
}

export interface ErrorState {
    hasError: boolean;
    error?: Error;
    message?: string;
    retry?: () => void;
}

export interface AsyncState<T = any> extends LoadingState, ErrorState {
    data?: T;
    refetch?: () => Promise<void>;
}

// Additional API-related types
export interface ApiEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    parameters?: Record<string, any>;
    response?: Record<string, any>;
    authentication?: boolean;
}

// Context types for better type safety
export interface ThemeContextValue {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

export interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

export interface AuthContextValue {
    user: any;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    permissions: Permission[];
}

// Additional utility types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type ValueOf<T> = T[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;