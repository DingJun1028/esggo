import React from 'react';
import { IComponentCore, IEvidenceMap, IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.js';
import { LifecycleHook } from '../esgss_schema.js';
import type { Language } from '../i18n.types.js';
export type { IComponentCore, IEvidenceMap, LifecycleHook, Language };

// ==================== BASIC TYPES ====================


export type ThemeMode = 'light' | 'dark' | 'cosmic' | 'system';

// ==================== LOGIC TYPES ====================

export type LogicState =
  | 'CALCULABLE'
  | 'TRACEABLE'
  | 'TRACKABLE'
  | 'TRUSTWORTHY' // 🔴 Tamper-proof (Trustworthy)
  | 'VERIFIED'
  | 'REVOKED';

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
  DR_THOTH = 'dr_thoth',
  ACADEMY = 'academy',
  SUSTAINABLE_VILLAGE = 'sustainable_village', // Phase 28: ESG Go Village
  PARTNER_PORTAL = 'partner_portal',
  VAULT = 'vault',
  RESTORATION = 'restoration',
  CARD_GAME_ARENA = 'card_game_arena',
  CARD_GAME_ARENA_NEW = 'card_game_arena_new',
  USER_JOURNAL = 'user_journal',
  ABOUT_US = 'about_us',
  TECHNICAL_DOCS = 'technical_docs',
  API_ZONE = 'api_zone',
  OMNI_BACKEND = 'omni_backend',
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
  OMNI_TOOLS = 'omni_tools',
  OMNI_SYSTEM = 'omni_system',
  THINK_TANK = 'think_tank',
  ALUMNI_ZONE = 'alumni_zone',
  LIBRARY = 'library',
  AGENT_TRAINING = 'agent_training',
  AGENT_ARENA = 'agent_arena',
  SOUL_FORGE = 'soul_forge',
  PROXY_MARKET = 'proxy_market',
  AGENT_FORGE = 'agent_forge',
  PALACE = 'palace',
  AFFILIATE = 'affiliate',
  GLOBAL_OPS = 'global_ops',
  WORKFLOW_LAB = 'workflow_lab',
  MCP_CONFIG = 'mcp_config',
  IMPACT_PROJECTS = 'impact_projects',
  OMNI_NOTES = 'omni_notes',
  HYPERCUBE_LAB = 'hypercube_lab',
  ADMIN_PANEL = 'admin_panel',
  ADMIN_FINANCE = 'admin_finance', // Administrative & Finance Management
  ECOSYSTEM_RADAR = 'ecosystem_radar',
  FLOWLU_INTEGRATION = 'flowlu_integration',
  SUPPLIER_CRM = 'supplier_crm',
  SUPPLIER_SURVEY = 'supplier_survey',
  MARKETING_STRATEGY = 'marketing_strategy',
  ENTERPRISE_SERVICES = 'enterprise_services',
  AGENT_TASKS = 'agent_tasks',
  OMNI_CREATOR_DASHBOARD = 'omni_creator_dashboard',
  OMNI_MANAGER = 'omni_manager',
  CARD_ARENA = 'card_arena',
  OMNI_AGENT = 'omni_agent',
  CELESTIAL_CHAT = 'celestial_chat',
  ESG_AI_ASSISTANT = 'esg_ai_assistant',
  GOVERNANCE = 'governance',
  COMPLIANCE = 'compliance',
  STAKEHOLDER = 'stakeholder',
  OMNI_CALENDAR = 'omni_calendar',
  OMNI_TASKS = 'omni_tasks',
  OMNI_PROJECTS = 'omni_projects',
  RESEARCH = 'research',
  NEWS = 'news',
  AVATAR = 'avatar',
  OMNI_LOGGER = 'omni_logger',
  DEV_PORTAL = 'dev_portal',
  FORTUNE_ENCOUNTER = 'fortune_encounter',
  EVIDENCE_VAULT = 'evidence_vault', // Phase 21: Evidence Browser
  BENTO_DASHBOARD = 'bento_dashboard', // Phase 22: Bento Box Adaptive Dashboard
  BENTO_BOX_DASHBOARD = 'bento_box_dashboard', // Phase 13: 4T Protocol Dashboard
  ESG_GO_GAME = 'esg_go_game', // ESG Go! Gamified Learning Platform
  AMICE_DASHBOARD = 'amice_dashboard', // AI Strategy Hub

  // High-End Educational Services (Phase 26 Custom UI)
  STRATEGY_ROADMAP = 'strategy_roadmap', // 0.0 Strategic Learning Roadmap
  EDU_DASHBOARD = 'edu_dashboard', // 1.1 Personal ESG Dashboard (Education)
  REPORT_GEN_V2 = 'report_gen_v2', // 1.3 ESG Disclosure Engine (High-End)
  CARBON_INVENTORY = 'carbon_inventory', // 2.2 Carbon Management
  RESTORATION_CENTER = 'restoration_center', // 3.2 ESG Restoration Center
  EXECUTIVE_DAILY = 'executive_daily', // 7.0 Executive News Daily
  ARCH_MONITOR = 'arch_monitor', // 7.1 Architecture Monitor
  COMPLIANCE_NEXUS = 'compliance_nexus', // 8.0 Global Compliance Nexus
  SERVICE_GUIDE = 'service_guide', // Interactive Service Guide
  TRUST_VERIFICATION = 'trust_verification', // 5T Trust Verification
  ACHIEVEMENT_GALLERY = 'achievement_gallery', // Impact Achievement Gallery
  MEDAL_DETAIL = 'medal_detail', // Achievement Detail

  // App.tsx Legacy/Specific Views
  TACTICAL = 'tactical',
  TEMPORAL = 'temporal',
  EXECUTION = 'execution',
  IMPACT = 'impact',
  VILLAGE = 'village',
  DISCLOSURE = 'disclosure',
  OCR_UPLOAD = 'ocr_upload',
  // New Services (Phase 14 Integration)
  INTEGRITY_PASSPORT = 'integrity_passport',
  COMPLIANCE_RISK = 'compliance_risk',
  BOARD_DASHBOARD = 'board_dashboard',
  MISSION_MATRIX = 'mission_matrix',
  SMART_NOTIFICATION = 'smart_notification',
  SUPPLY_CHAIN_PLATFORM = 'supply_chain_platform',
  INVESTOR_RELATIONS = 'investor_relations',
  COMMUNITY_NETWORK = 'community_network',
  COMPLIANCE_GUARDIAN = 'compliance_guardian', // Phase 29: Automated Compliance
  QUANTUM_VAULT = 'quantum_vault', // Phase 30: Quantum Entanglement
  LIQUID_NEURAL_NETWORK = 'liquid_neural_network', // Phase 31: Liquid Neural Networks
  SENTIENT_SYMPHONY = 'sentient_symphony', // Phase 32: Sentient Symphony
  AI_CULTIVATION_LAB = 'ai_cultivation_lab', // Phase 33: AI Cultivation Lab
  VIRTUE_HABIT = 'virtue_habit', // Phase 34: 21 Days of Virtue
  OMNI_MIND = 'omni_mind', // Phase 35: Omni-Mind (Meta-Audit)
  last_news = 'last_news',
  SYSTEM_ARCHITECTURE = 'system_architecture',

  DIGITAL_TWIN = 'digital_twin',
  DESIGN_SYSTEM = 'design_system',
  FINANCIAL_IMPACT = 'financial_impact',
  MARKET_INTELLIGENCE = 'market_intelligence',
  DATA_ROOM = 'data_room',
  SOVEREIGN_IDENTITY = 'sovereign_identity',
  SOVEREIGN_MENTOR = 'sovereign_mentor',
  MY_NORTH_STAR = 'my_north_star',
  QUANTUM_ETHICS = 'quantum_ethics',
  TIFFANY_SHOWCASE = 'tiffany_showcase',
  LEARNING_COMMAND = 'learning_command',
  KNOWLEDGE_VAULT = 'knowledge_vault',
  SKILL_MASTERY = 'skill_mastery',
  STRATEGIC_ORCHESTRATOR = 'strategic_orchestrator',
  ADK_LAB = 'adk_lab',
  LEARNING_ALCHEMY = 'learning_alchemy',
  DEBATE = 'debate',
  CARD_COLLECTION = 'card_collection',
  DECK_BUILDER = 'deck_builder',
  ACHIEVEMENTS = 'achievements',
  CALIBRATION = 'calibration',
  RESONANCE_CALIBRATION = 'resonance_calibration',
  STYLE_GUIDE = 'style_guide',
  SAFE_MODE = 'safe_mode',
  SYSTEM_STATUS = 'system_status',
  BERKELEY_TSISDA = 'berkeley_tsisda',
  MEDIA_GALLERY = 'media_gallery',
  SAFETY_AUDIT = 'safety_audit', // EntropyForge Demo: Safety Audit with Network Mocking
  SWARM_DASHBOARD = 'swarm_dashboard', // Phase 6: Omni-Swarm Intelligence Dashboard
  PLANETARY_MESH = 'planetary_mesh', // Phase 107: Planetary Mesh Visualization
  AGENT_PERSONA = 'agent_persona', // Agent Persona Configuration
  SUSTAINABILITY_REPORT_CENTER = 'sustainability_report_center', // 永續報告書智慧中心 (OCR, 圖表, 範本, 缺口分析)
  PERSONAL_HUB = 'personal_hub',
  PERSONAL_STORAGE = 'personal_storage', // 我的個人儲存倉
  OMNI_HARMONY = 'omni_harmony', // 奧秘圓通
  OMNI_DICTIONARY = 'omni_dictionary', // 萬能智典 4.0
  SUMMONER_AWAKENING = 'summoner_awakening', // 元鑰的呼喚：覺醒旅程
  SUMMONER_HUB = 'summoner_hub', // 萬能元鑰召喚使中心
  OMNI_EVOLUTION = 'omni_evolution', // 萬能極限性能晉級進化引擎
  OMNI_EPIC = 'omni_epic', // 聖典·創世之章：抗熵史詩
  TERMINUS_MATRIX = 'terminus_matrix', // 終始矩陣核心監控
  OMNI_HUB = 'omni_hub',
}

// ==================== AWAKENED IDENTITY ====================

export interface AwakenedProfile {
  user_id: string;
  name: string;
  email: string;

  // Awakened Stats
  xp: number;
  level: number;

  // The 4 Pillars (Truth Four Pillars)
  self_awareness_score: number;
  enlightenment_score: number;
  self_reliance_score: number;
  altruism_score: number;

  created_at?: string;
  updated_at?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Record<string, unknown>;
  response?: Record<string, unknown>;
  authentication?: boolean;
}

// ==================== COMPONENT PROPS & UI TYPES ====================

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
  data?: unknown;
  config?: Record<string, unknown>;
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

// ==================== FORM & VALIDATION ====================

export interface ValidationRule {
  field: string;
  rule: string;
  value?: unknown;
  message: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file';
  required?: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
  options?: { label: string; value: unknown }[];
  defaultValue?: unknown;
}

// ==================== STATE MANAGEMENT ====================

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

export interface AsyncState<T = unknown> extends LoadingState, ErrorState {
  data?: T;
  refetch?: () => Promise<void>;
}

// ==================== CONTEXT VALUES ====================

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
  user: unknown;
  isAuthenticated: boolean;
  login: (credentials: unknown) => Promise<void>;
  logout: () => void;
  permissions: unknown[]; // Permission[] is in agency
}

// ==================== USER PREFERENCES ====================

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

// ==================== UTILS ====================

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

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type ValueOf<T> = T[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;

// ==================== SYSTEM HEALTH ====================

/**
 * 🏥 Unified System Health Status (統一系統健康狀態)
 * --------------------------------------------------
 * 標準化健康狀態定義，所有服務應使用此類型
 * healthy: 正常運作 | warning: 需要注意 | critical: 嚴重問題
 */
export type SystemHealthStatus = 'healthy' | 'warning' | 'critical';

/**
 * 🏥 System Health Metrics (系統健康指標)
 * --------------------------------------------------
 * 提供系統健康檢查的標準介面
 */
export interface SystemHealthMetrics {
  status: SystemHealthStatus;
  uptime: number;
  activeUsers?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  lastChecked: number;
}

// ==================== TOAST ====================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'reward';


export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

// ==================== TESTING ====================

export interface UnitTestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail';
  details: string;
  timestamp: number;
}

// ==================== CORE COMPONENT LOGIC ====================

// 🌐 5T Goodward Sustainability Logic Gate (The 5T Logic Gate)
// 第一層：5T 邏輯門 (The 5T Logic Gate)
// [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
// [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 (source_origin)
// [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
// [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 (ISO-14064-1)
// [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
export type FiveTProtocol =
  | 'Tangible' // 🟢 Tangible - 將抽象永續願景轉化為具體指標成果
  | 'Traceable' // 🟢 Traceable - 鏈式日誌包含原始資料來源
  | 'Trackable' // 🟢 Trackable - 生命週期 Hook 記錄數據流轉路徑
  | 'Transparent' // 🟢 Transparent - 算法公式公開化，零幻覺驗證
  | 'Trustworthy'; // 🔴 Trustworthy - Hash Lock + Object.freeze()

// ☯️ Meridian Flow Classification
export type MeridianFlow = 'INWARD_REN' | 'OUTWARD_DU';

// 🌟 Merit Indicators (1-10 Scale) - Re-exported from IComponentCore for unified definition
export type { IMeritProfile10, IRpgStats, IVitals, IEsgAttributes, IOmniAttributes } from '../../0-domain/contracts/IComponentCore.js';

// 🏛️ Evidence Vault - 5T Validation Structure
// Imported from esgss_schema
// export interface IEvidenceMap ... (Removed)

/**
 * 💡 4T Protocol Compliance Interface (I4TCompliant)
 * --------------------------------------------------
 * Deprecated: Use IEvidenceMap from esgss_schema
 */
// export interface I4TCompliant ... (Removed)

/**
 * 💡 Core Algorithm: TruthGoodBeauty 5T Protocol Implementation (5 Can)
 * --------------------------------------------------
 * [Source] Reference: Omni Protocol Supplement - 5 Can standard
 * Imported from esgss_schema
 */
// export interface IComponentCore ... (Removed)

// Omni ESG Asset (Omni Asset) - 4T Compliant
// Extends IComponentCore but re-adds data/meridian/virtues that were previously in Core
export interface IImpactAsset<T> extends IComponentCore {
  asset_type: 'CARBON_CREDIT' | 'GOVERNANCE_TOKEN' | 'SOCIAL_CAPITAL' | 'ESG_SCORE';

  // ========== Meridian and Virtue (Moved from IComponentCore) ==========
  readonly meridian: MeridianFlow; // ☯️ Meridian Flow
  readonly virtues: IMeritProfile10; // 🌟 Merit Indicators (1-10)

  // ========== Data Carrier (Moved from IComponentCore) ==========
  data: T;

  // Display: Imperial Gold Visual Weight (0-100)
  gold_weight: number;

  // 4T Validation Status
  four_t_validated?: boolean;
  trustworthy_level?: 'verified' | 'estimated' | 'demo' | 'unverified';
}

/**
 * Component Core Factory Method Type
 */
export type ComponentCoreFactory = <T>(
  data: T,
  sourceOrigin: string,
  formulaReference?: string
) => IImpactAsset<T>;

/**
 * Evidence Generation Function Type
 */
export type EvidenceGenerator = (
  sourceOrigin: string,
  data: unknown,
  metadata?: Record<string, unknown>
) => IEvidenceMap;

/**
 * 5T Validation Result
 */
export interface FiveTValidationResult {
  protocol: FiveTProtocol;
  passed: boolean;
  checks: Record<string, boolean>;
  message: string;
}

/**
 * Complete 5T Validation Report
 */
export interface FiveTValidationReport {
  trustworthy: boolean; // Whether Trustworthy level is reached
  results: {
    t1: FiveTValidationResult;
    t2: FiveTValidationResult;
    t3: FiveTValidationResult;
    t4: FiveTValidationResult;
    t5: FiveTValidationResult;
  };
  summary: string;
  timestamp: number;
}

// ==================== IMPACT TRUST BADGE & NEXUS CARDS ====================

/**
 * 💡 Impact Proof (ImpactProof) - 5T Protocol Aligned (5 Can)
 * --------------------------------------------------
 * External validation data complying with 5T protocol
 */
export interface ImpactProof {
  uuid: string;
  meridian: MeridianFlow;
  virtues: IMeritProfile10;
  evidence: {
    source_origin: string; // 🟢 Traceable
    lifecycle_hooks: string[]; // 🔵 Trackable
    logic_formula: string; // 🟠 Transparent

    // 🟣 Tangible: Consistent with IComponentCore.evidence.manifest
    tangible_manifest?: {
      // Legacy support
      is_crystallized: boolean;
      qr_link: string;
      visual_grade: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
    };
    manifest?: {
      // Unified naming
      is_crystallized: boolean;
      qr_link?: string;
      qr_entropy?: string;
      visual_grade: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
    };

    hash_lock: string; // 🔴 Trustworthy
  };
  verified_at: number;
}

/**
 * 🃏 Impact Nexus Card (ImpactNexusCard)
 * --------------------------------------------------
 * Transforming ESG digital assets into gaming assets (1-10 Scale)
 */
export interface ImpactNexusCard {
  id: string;
  name: string;
  company: 'SHAN_XIANG' | 'SHAN_WEI' | 'STEPS' | 'HOLISTIC' | 'WANGDAO';
  rarity: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
  meridian: MeridianFlow;
  stats: {
    ATK: number; // Courage
    DEF: number; // Integrity
    MP: number; // Intelligence
    HP: number; // Benevolence
  };
  virtues: IMeritProfile10;
  ability: {
    name: string;
    description: string;
    mp_cost: number;
  };
  knowledge_points: string[]; // Corresponding ESG knowledge points
}

export interface ImpactTrustBadgeProps {
  proof: ImpactProof;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'premium' | 'minimal' | 'cosmic';
  onVerifyClick?: (uuid: string) => void;
}

// ==================== SUBSCRIPTION & SERVICE MODULARIZATION ====================

/**
 * 💡 Subscription Tier
 * --------------------------------------------------
 * Defines system service access permissions and functional boundaries
 */
export enum SubscriptionTier {
  FREE = 'FREE', // Initial Awakening
  SUBSCRIBER = 'SUBSCRIBER', // Path of Enlightenment
  SOVEREIGN = 'SOVEREIGN', // Sovereign Integration
  PRO = 'PRO', // Professional Grade
  PLUS = 'PLUS', // Plus Grade
  OMNI_AVATAR = 'OMNI_AVATAR', // Omni Avatar Tier
}

/**
 * 💡 Service Module - MECE Classification
 * --------------------------------------------------
 * Modular classification of integrated system features
 */
export enum ServiceModule {
  COGNITIVE = 'COGNITIVE', // Cognitive Intelligence
  EXCELLENCE = 'EXCELLENCE', // Excellence & Sustainability
  GOVERNANCE = 'GOVERNANCE', // Integrity Governance
  AGENCY = 'AGENCY', // Autonomous Agency
  ECOSYSTEM = 'ECOSYSTEM', // Collaborative Ecosystem
}

export interface ServiceItem {
  id: View;
  name: string;
  module: ServiceModule;
  tier_required: SubscriptionTier;
  procedure: string[]; // Service procedure
  cej_step: string; // Customer Experience Journey step
}

export interface UserSubscription {
  tier: SubscriptionTier;
  expires_at?: number;
  features_unlocked: View[];
  exclusive_perks: string[]; // Benefits/Early bird items
}

// ==================== LEGACY COMPATIBILITY ====================

export interface IAuthKey {
  type: 'JUN_AI_KEY' | 'TECH_ORACLE' | 'USER_KEY';
  signature: string;
}

export interface IImpactLedger {
  totalImpact: number;
  beneficiaries: string;
  signature: string;
}

// ==================== BUSINESS INTELLIGENCE CENTER ====================

/**
 * 💡 Market Trend Data (Market Trend)
 * --------------------------------------------------
 * Tracks industry market dynamics and key metric changes
 */
export interface MarketTrend {
  id: string;
  industry: string;
  region?: string;
  metric: string;
  value: number;
  change: number; // Percentage change
  changeDirection: 'up' | 'down' | 'stable';
  timestamp: string;
  source: string;
  confidence: number; // 0-1
}

/**
 * 💡 Competitor Profile (Competitor Profile)
 * --------------------------------------------------
 * Multidimensional analysis data of competitors
 */
export interface CompetitorProfile {
  id: string;
  name: string;
  taxId?: string;
  industry: string;
  region?: string;
  marketShare: number; // Percentage
  esgScore: number; // 0-100
  financialHealth: number; // 0-100
  recentNews: NewsItem[];
  strengths: string[];
  weaknesses: string[];
  lastUpdated: string;
}

/**
 * 💡 Industry Benchmark Data (Industry Benchmark)
 * --------------------------------------------------
 * Industry averages and benchmark enterprise data
 */
export interface IndustryBenchmark {
  industry: string;
  region?: string;
  metrics: {
    avgRevenue: string;
    avgGrowth: number;
    avgESGScore: number;
    avgRiskLevel: number;
    avgProfitMargin: number;
  };
  topPerformers: CompanySnapshot[];
  trends: string[];
  lastUpdated: string;
}

/**
 * 💡 Company Snapshot (Company Snapshot)
 * --------------------------------------------------
 * Simplified company information for list display
 */
export interface CompanySnapshot {
  id: string;
  name: string;
  industry: string;
  esgScore: number;
  rank?: number;
}

/**
 * 💡 News Analysis Results (News Analysis)
 * --------------------------------------------------
 * News sentiment analysis and trend tracking
 */
export interface NewsAnalysis {
  companyId: string;
  companyName: string;
  sentimentScore: number; // 0-100
  totalArticles: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  recentNews: NewsItem[];
  trendingTopics: string[];
  timeRange: {
    start: string;
    end: string;
  };
  lastUpdated: string;
}

/**
 * 💡 News Item (News Item)
 * --------------------------------------------------
 * Structured data for a single news article
 */
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // 0-100
  url: string;
  category?: string;
  impact?: 'high' | 'medium' | 'low';
}

/**
 * 💡 Risk Assessment Report (Risk Assessment Report)
 * --------------------------------------------------
 * Comprehensive risk assessment results for an enterprise
 */
export interface RiskAssessmentReport {
  companyId: string;
  companyName: string;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  categories: {
    environmental: RiskCategory;
    social: RiskCategory;
    governance: RiskCategory;
    financial: RiskCategory;
    operational: RiskCategory;
  };
  topRisks: RiskItem[];
  recommendations: string[];
  assessedAt: string;
}

/**
 * 💡 Risk Category (Risk Category)
 * --------------------------------------------------
 * Risk assessment for specific categories
 */
export interface RiskCategory {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  trend: 'improving' | 'stable' | 'worsening';
}

/**
 * 💡 Risk Item (Risk Item)
 * --------------------------------------------------
 * Single risk event or factor
 */
export interface RiskItem {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'Environment' | 'Social' | 'Governance' | 'Financial' | 'Operational';
  title: string;
  description: string;
  date: string;
  status: 'Open' | 'Monitoring' | 'Resolved' | 'Historical';
  impact: string;
  mitigation?: string;
}

/**
 * 💡 Market Trends Query Params
 * --------------------------------------------------
 * API query parameters
 */
export interface MarketTrendsParams {
  industry?: string;
  region?: string;
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics?: string[];
  limit?: number;
}

/**
 * 💡 Risk Assessment Params
 * --------------------------------------------------
 * Risk assessment request parameters
 */
export interface RiskAssessmentParams {
  companyId: string;
  categories?: ('environmental' | 'social' | 'governance' | 'financial' | 'operational')[];
  depth?: 'basic' | 'detailed' | 'comprehensive';
  includeRecommendations?: boolean;
}

/**
 * 💡 Regulatory Update (Regulatory Update)
 * --------------------------------------------------
 * Regulatory and compliance update information
 */
export interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  jurisdiction: string; // e.g., 'EU', 'US', 'CN', 'Global'
  category: 'Environmental' | 'Social' | 'Governance' | 'Financial' | 'Operational';
  effectiveDate: string;
  deadline?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedIndustries: string[];
  source: string;
  url?: string;
  publishedAt: string;
  lastUpdated: string;
}

/**
 * 💡 Risk Assessment (Risk Assessment)
 * --------------------------------------------------
 * Comprehensive risk assessment data
 */
export interface RiskAssessment {
  id: string;
  companyId: string;
  companyName: string;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  categories: {
    environmental: RiskCategory;
    social: RiskCategory;
    governance: RiskCategory;
    financial: RiskCategory;
    operational: RiskCategory;
  };
  topRisks: RiskItem[];
  recommendations: string[];
  assessedAt: string;
  lastUpdated: string;
}

/**
 * 💡 Competitor Analysis Params (Competitor Analysis Parameters)
 * --------------------------------------------------
 * Parameters for competitor analysis requests
 */
export interface CompetitorAnalysisParams {
  companyId: string;
  industry?: string;
  region?: string;
  limit?: number;
  includeFinancials?: boolean;
  includeESG?: boolean;
}

/**
 * 💡 Regulatory Updates Params (Regulatory Updates Parameters)
 * --------------------------------------------------
 * Parameters for regulatory updates requests
 */
export interface RegulatoryUpdatesParams {
  jurisdiction?: string;
  category?: 'Environmental' | 'Social' | 'Governance' | 'Financial' | 'Operational';
  industry?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * 💡 Benchmark Params (Benchmark Parameters)
 * --------------------------------------------------
 * Parameters for industry benchmark requests
 */
export interface BenchmarkParams {
  industry: string;
  region?: string;
  metrics?: string[];
  includeTopPerformers?: boolean;
  limit?: number;
}
// ==================== SOVEREIGN & SWARM (Phase 28) ====================

/**
 * 🏛️ Sovereign Data Packet (主權數據包)
 * --------------------------------------------------
 * 符合 Phase 28 標準的數據封裝，具備分散式錨定特性。
 */
export interface SovereignDataPacket<T = any> {
  cid: string;             // Content Identifier (IPFS-style hash)
  payload: T;              // 核心數據內容
  timestamp: number;       // 封裝時間戳
  did: string;             // 主權所有者 DID
  witnesses: string[];     // 參與共識驗證的見證者 DIDs
  anchoring: {
    status: 'local' | 'anchored' | 'consensus_reached';
    ledger_hash?: string;  // 後端帳本錨定 Hash
    anchored_at?: number;
  };
}

/**
 * 🐝 Swarm Resonance Result
 */
export interface SwarmResonance {
  consensusId: string;
  resonance_score: number; // 0-100
  witness_count: number;
  is_sovereign: boolean;
}
