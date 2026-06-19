export interface IVirtueFingerprint {
  wisdom: number;      // 智 (Wisdom)
  benevolence: number; // 仁 (Benevolence)
  courage: number;     // 勇 (Courage)
  integrity: number;   // 誠 (Integrity)
  temperance: number;  // 節 (Temperance/Moderation)
  harmony: number;     // 和 (Harmony)
  efficiency?: number; // Added for backwards compatibility
  moderation?: number; // Added for backwards compatibility
}

/**
 * 💡 OmniProtocol 5T: 萬能宇宙憲法 (Pentagonal Symbiosis)
 * 真 (Truth) | 善 (Goodness) | 美 (Beauty) | 信 (Trust) | 通 (Flow)
 */

// 1. 真 (Truth) - OmniOrigin (Traceable)
export interface ITraceable {
  originHash: string;      // 原始起點
  genealogy: string[];     // 父代族譜
  readonly sourceOrigin?: string;    // 起源地/設備
  extractionMethod?: 'OCR' | 'IoT' | 'Manual'; // 數據擷取方式
}

/** 🧬 Lifecycle Event: Trackable action on an atom */
export interface ILifecycleEvent<T = Record<string, unknown>> {
  event: 'CREATED' | 'UPDATED' | 'VALIDATED' | 'LOCKED' | 'SEALED' | 'EVOLVED';
  actor: string;           // 操作者 (User ID or Agent ID)
  time: number;
  delta?: Partial<T>;      // 變更內容差異
  reason?: string;         // 更動理由
}

/** 證據佐證庫 (Evidence Vault) */
export interface IEvidenceMap {
  tangible?: {
    metricName: string;
    metricValue: string | number | boolean;
    visualRef?: string;
  };
  traceable?: {
    sourceOrigin: string;
    authorSignature: string;
  };
  trackable?: {
    currentHookId: string;
    pathLog: Array<{
      timestamp: number;
      nodeId: string;
      action: string;
    }>;
  };
  transparent?: {
    standardRef: string;
    formula: string;
    isVerified: boolean;
  };
  [key: string]: string | number | boolean | object | undefined;
}

export type IEvidence = IEvidenceMap;

// 2. 善 (Goodness) - OmniLogic (Transparent)
export interface ITransparent {
  algorithmId: string;     // 使用的邏輯 ID
  verificationProof: string; // 零幻覺驗算證明
  formula: string;         // $E = \sum (AD \times EF)$
}

// 3. 美 (Beauty) - OmniAura (Tasteful)
export interface ITasteful {
  renderType: 'LiquidGlass' | 'Hologram' | 'Shattered'; // 美學風格
  interaction: 'Fluid' | 'Haptic';        // 互動質感
  auraColor: string;                      // #63a6b0 (Aqua Flow)
}

// 4. 信 (Trust) - OmniState (Trustworthy)
export interface ITrustworthy {
  isFrozen: boolean;       // 絕對鎖定
  signerKey: string;       // OmniKey (元鑰) 簽名
  consensusTimestamp: number;
  contentHash: string;     // SHA-256
}

// 5. 通 (Flow) - OmniCircle (Transcendent)
export interface ITranscendent {
  circleId: string;        // 循環生態圈 ID
  interoperability: boolean; // 是否跨鏈/跨平台
  nextEvolution: () => IOmniAtom<Record<string, unknown>>; // 循環：當前終點即為下個起點
}

import { IComponentCore } from './IComponentCore';
export type { IComponentCore };

export interface IOmniSeed<T = Record<string, unknown>> {
  intent: string;
  type: "Note" | "Transaction" | "Identity" | "Contract" | "Galaxy" | "Star" | "Satellite" | "Intelligence" | "Accomplishment";
  payload: T;
  domainRef: string;
  tags?: string[];
  authorSecret?: string;
  parentAtom?: string;
  formula?: string;
  impactMetric?: string;
  sourceOrigin?: string;
  async?: boolean;
  entropy?: number;   // [HEP] Dimension 13
  harmony?: number;   // [HEP] Dimension 14
  phase?: 'FORGE' | 'VERIFY' | 'FOUNDRY' | 'AGORA' | 'EVOLVE';
  resonance?: number;
}

/** 📍 OmniSpaceTime: 萬能時空座標系統 (Precision: Space(cm), Time(ns)) */
export interface IOmniSpaceTime {
  timestamp: {
    iso: string;
    epochNanoseconds: string;
    timeZone: string;
  };
  location: {
    geo?: { latitude: number; longitude: number; altitude: number; accuracy: number; };
    local?: { beaconId: string; relativeX: number; relativeY: number; relativeZ: number; };
    digital?: { serverRegion: string; blockHeight?: number; };
  };
  proof: {
    method: 'GPS-Sign' | 'WiFi-Triangulation' | 'User-Biometric' | 'Atomic-Sync' | 'Hyper-Phase-Sync';
    signature: string;
  };
  w?: number; // [HEP] 4th Dimension: Hyper-Phase (0-1)
}

/** 🏷️ OmniTag: 萬能標籤 (Quantum Space-Time Anchor) */
export interface IOmniTag {
  id: string;
  semantic: string;        // e.g., "#ESG_Verification"
  dimension: string;       // Context, Time, Priority, AI_Inferred
  weight: number;          // 關聯權重 (0-1)
  spaceTime?: IOmniSpaceTime;
  category?: 'Identity' | 'Process' | 'Asset' | 'Insight'; // 標籤分類
  reliability?: number;    // 標籤置信度 (0-1)
}

/**
 * 🌐 5W1H Framework: Grand Unification Context (大統一脈絡)
 * Who (人) | What (物) | When (時) | Where (地) | Why (由) | How (如何)
 */
export interface IContext5W1H {
  uuid?: string;    // [可溯源] 脈絡唯一標識
  who: string;      // Actor / Identity
  what: string;     // Entity / Payload
  when: string;     // Temporal / Epoch
  where: string;    // Spatial / Domain
  why: string;      // Intent / Causality
  how: string;      // Method / Logic
}

export type OmniStatus = "Potential" | "Active" | "Trustworthy" | "Archived" | "Tangible" | "Traceable" | "Trackable" | "Transparent";
// import { T5Status } from './IComponentCore';

/**
 * ⚛️ OmniAtom: 萬能原子 (Sentient Fully-Integrated Atom)
 * 真善美信通 的完美結晶
 */
export interface IOmniAtom<T = Record<string, unknown>> extends
  IComponentCore<T>,
  ITraceable,
  ITransparent,
  ITasteful,
  ITrustworthy,
  ITranscendent {
  readonly quality: number;     // [資產品質] v2.1.0 核心評分 (0-10)
  readonly domainRef: string;
  readonly tags: IOmniTag[];
  readonly spaceTime?: IOmniSpaceTime; // [HEP] 4D Logic Anchor
  readonly payload: T;
  readonly signature: string;
  readonly hash_lock: string;      // [不可篡改] 5T 封印
  readonly intent: string;         // [可溯源] 原始意圖/描述
  protocol: IProtocol5T;         // [5T 協議狀態]

  /** 🛰️ Lifecycle tracking (The Golden Thread) */
  lifecycle: ILifecycleEvent<T>[];

  // --- v12.0 Philosophical Pillars ---
  heritage?: {
    parentUuid?: string;        // [傳承] 父代 UUID
    lineage: string[];         // [迭代] 完整族譜
    version: number;           // 版本號
    branches?: string[];       // [分支代碼]
    timestamp?: string;        // [迭代時間戳]
    signature?: string;        // [傳承簽名]
  };
  context5W1H?: IContext5W1H;   // [大統一脈絡]
  bridge?: {
    pastLink?: string;          // [承上] 連結過去
    futureIntent?: string;      // [啟下] 嚮導未來
    causalEntropy?: number;     // 因果熵值 (0-1)
  };
  integration?: {
    sourcePlatform: string;     // [接軌] 來源平台
    adapterRef: string;         // 適配器參考
    mappingStatus: 'Perfect' | 'Lossy' | 'Partial' | 'Seamless';
    syncTimestamp?: string;     // [同步時間戳]
  };
  sustainability?: {
    longevityScore: number;     // [永續] 存續評分 (0-100)
    impactHorizon: string;      // 影響力視界 (e.g., "50y")
    evolutionPotential: number; // 演進潛力 (0-1)
  };
  hypercube: IHypercubeProtocol; // [HEP] 多維演化協議
  notarization?: any;
  sentientState?: {
    entropy: number;
    harmony: number;
    resonance: number;
    phase: string;
  };
}

/** 📊 IImpactMetric: Quantitative and qualitative impact descriptors */
export interface IImpactMetric {
  wisdom: number;
  integrity: number;
  harmony: number;
  courage?: number;
  benevolence?: number;
  efficiency?: number;
  description?: string;
}

/** 🧠 ICognitiveTrend: AI-Inferred Strategy Insights */
export interface ICognitiveTrend {
  trend: string;
  probability: number;
  recommendation: string;
}

/** 🌿 IIntelNode: Knowledge Node for Graph Visualization */
export interface IIntelNode {
  id: string;
  label: string;
  type: 'Domain' | 'Concept' | 'Metric' | 'Entity';
  val: number;
  domain: string;
  metadata?: Record<string, any>;
  source?: string;
  timestamp?: number;
  sentiment?: number;
  category?: string;
  content?: string;
}

/** 🗺️ IStrategicPosture: Strategic Positioning for AI Analysis */
export interface IStrategicPosture {
  currentStatus: string;
  targetGoal: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendations: string[];
  alignmentScore?: number;
  entity?: any;
}

/** 🌿 ICarbonScopeData: Carbon scope measurement structure */
export interface ICarbonScopeData {
  scope: 1 | 2 | 3;
  emissions: number;
  unit: 'tCO2e' | 'kgCO2e';
  breakdown: Record<string, number>;
}

/** ⚒️ IForgeIndicator: Indicator for report generation */
export interface IForgeIndicator {
  code: string;
  name: string;
  value: number;
  unit: string;
  confidence: number;
}

/** 📜 IStrategyResult: AI Generated Action Strategy */
export interface IStrategyResult {
  title: string;
  content: string;
  category: "ESG" | "Compliance" | "Growth" | "Risk" | "Innovation";
}

/** 🏛️ IReportForgeResult: The output of a forging operation */
export interface IReportForgeResult {
  uuid: string;
  title: string;
  indicators: IForgeIndicator[];
  evidence5T: IEvidenceMap;
  status: OmniStatus;
  complianceScore: number;
}

// --- 👤 Avatar & Assessment Interfaces (Epic 8) ---

/** 🏺 IAvatarCore: 數位分身核心狀態 */
export interface IAvatarCore extends IComponentCore {
  nickname: string;
  avatarType: 'SOVEREIGN' | 'SENTIENT' | 'OMNI';
  level: number;
  exp: number;
  rank: string;       // 稱號 (e.g., "初學者", "永續先鋒")
  virtues: IVirtueFingerprint;
  natureLaw: string;  // 自然共鳴律
  closingLaw: string; // 誠信閉環律
  visualAssets: {
    baseIcon: string;
    auraEffect: string;
    rankBadge: string;
  };
}

/** 📝 IAssessmentRecord: 全人評測紀錄 */
export interface IAssessmentRecord extends IComponentCore {
  targetAtomUuid: string;    // 對應的學習資產 (Knowledge Atom)
  category: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';
  virtueGains: Partial<IVirtueFingerprint>;
  summary: string;           // 評測總結
  timestamp: number;
  expGain?: number;          // 額外的 EXP 獲得
}

/** 📜 IReportManifest: 報告顯化配置 */
export interface IReportManifest {
  reportId: string;
  standards: string[];       // 如 GRI, SASB
  targetDomain: 'E' | 'S' | 'G' | 'OMNI';
  atomsIncluded: string[];   // 被包含的 Atom UUIDs
  generatedDraft?: string;   // AI 生成的草稿內容
  manifestDate: number;
}

/** 🧠 IKnowledgeMastery: 知識精進程度 (Triple-Seal) */
export interface IKnowledgeMastery {
  level: 0 | 1 | 2 | 3;      // 0: None, 1: Perception, 2: Gnosis, 3: Manifestation
  perceptionDate?: number;    // 一重封印日期
  gnosisDate?: number;        // 二重封印日期
  manifestationDate?: number; // 三重封印日期
  challengeHistory: Array<{
    timestamp: number;
    question: string;
    answer: string;
    isPassed: boolean;
    score: number;
  }>;
}

/** 📚 IKnowledgePoint: 知識點定義 */
export interface IKnowledgePoint {
  id?: string;
  uuid?: string;
  title: string;
  summary: string;
  category: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';
  expReward: number;
  mastery?: IKnowledgeMastery;
}

// --- v12.0 Protocol State Machine ---
export interface IProtocol5T {
  traceable: { status: 'pending' | 'verified' | 'failed'; timestamp: string; evidence: string };
  trackable: { status: 'pending' | 'verified' | 'failed'; timestamp: string; evidence: string };
  transparent: { status: 'pending' | 'verified' | 'failed'; timestamp: string; evidence: string };
  tangible: { status: 'pending' | 'verified' | 'failed'; timestamp: string; evidence: string };
  trustworthy: { status: 'pending' | 'verified' | 'failed'; timestamp: string; evidence: string };
  sustainability: { status: 'pending' | 'verified' | 'failed'; timestamp: string; evidence: string };
}

/** 🎴 INexusCard: 靈魂卡牌 (Soul Card) - 5T 知識資產的戰鬥型態 */
export interface INexusCard extends IComponentCore {
  originAtomUuid: string;    // [可溯源] 連結的 5T 知識原子
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Omni';
  element: 'Environment' | 'Social' | 'Governance' | 'Nexus';
  attributes: IVirtueFingerprint; // 戰鬥數值直接繼承自六德指紋
  abilities: Array<{
    id: string;
    name: string;
    description: string;
    power: number;
    cooldown: number;
  }>;
  visualUrl?: string;        // 預計由 AI 生成的卡牌形象
  isEquipped: boolean;
}

/** ⚔️ IGameSession: 善向對決會話 (Nexus Battle/Reflection Session) */
export interface IGameSession extends IComponentCore {
  participants: {
    user: string;            // User UUID
    opponent: 'Dr_Thoth' | 'AI_Shadow' | string; // 導師或競爭對手
  };
  deck: string[];            // 使用的卡牌 UUID 列表
  logs: Array<{
    turn: number;
    actor: string;
    action: string;
    impact: number;
    description: string;
  }>;
  result: {
    winner: string;
    finalImpactScore: number;
    virtueGains: Partial<IVirtueFingerprint>;
    expGain: number;
  };
  gameStatus: 'PENDING' | 'ACTIVE' | 'CONCLUDED' | 'ABORTED';
}

/** 💠 IHypercubeProtocol: 多維演化座標 (Dimensions 13-16) */
export interface IHypercubeProtocol {
  entropy: number;        // D13: 系統熵值 (0-1, 愈低愈序)
  harmony: number;        // D14: 系統和諧度 (0-1, 愈高愈平衡)
  singularity: string;    // D15: 奇點識別碼 (用於感知顯化)
  tesseractHash: string;  // D16: 超立方體雜湊 (4D 時空封裝)
  phase: 'FORGE' | 'VERIFY' | 'FOUNDRY' | 'AGORA' | 'EVOLVE'; // 當前演化階段
}

/** 📜 I5TProof: Evidence Proof for 5T Compliance */
export interface I5TProof {
  atomUuid: string;
  timestamp: number;
  hashLock: string;
  complianceScore: number;
  verifier: string;
  evidenceChain: string[];
}

// --- Missing Interfaces Added for Compilation ---
export interface IEntropyReport { [key: string]: any; }
export interface ISelfCorrectionProposal { [key: string]: any; }
export interface ICrossChainManifest { [key: string]: any; }
export interface TangibleDashboard { [key: string]: any; }
export interface IAgenticTwin { [key: string]: any; }
export interface I5TMetadata {
  tangible: { score: number; details: string; visualRef?: string };
  traceable: { score: number; details: string; sourceOrigin: string };
  trackable: { score: number; details: string; hookId: string };
  transparent: { score: number; details: string; formula: string };
  trustworthy: { score: number; details: string; hashLock: string };
}

export interface IAgenticTwin extends IComponentCore {
  twinName: string;
  twinType: 'STRATEGIC' | 'OPERATIONAL' | 'FINANCIAL' | 'RISK' | 'SUSTAINABILITY';
  parentEntityId: string;
  modelConfig: {
    modelId: string;
    temperature: number;
    maxTokens: number;
  };
  decisionPatterns: Array<{
    patternId: string;
    description: string;
    confidence: number;
    lastUpdated: string;
  }>;
  predictions: IGnosisPrediction[];
  simulations: any[];
  virtues: IVirtueFingerprint;
  evidence: any[];
  status: 'Active' | 'Potential' | 'Trustworthy' | 'Archived';
  protocol: IProtocol5T;
}

export interface ITwinDecision {
  decisionId: string;
  timestamp: number;
  recommendation: string;
  confidence: number;
  status: 'PENDING' | 'VALIDATED' | 'EXECUTED' | 'FAILED';
  alternatives?: string[];
  context?: Record<string, any>;
  sourceOrigin?: string;
  metadata5T?: I5TMetadata;
  impactMetrics?: IImpactMetric;
}
export interface ITwinScenario {
  scenarioId: string;
  twinUuid: string;
  name: string;
  description: string;
  variables: Array<{ name: string; value: number }>;
  constraints: string[];
  expectedOutcomes: Array<{
    metric: string;
    projectedValue: number;
    confidenceInterval: [number, number];
  }>;
  createdAt: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}
export interface IGnosisPrediction {
  id?: string;
  targetUuid?: string;
  horizon?: string;
  timeHorizon?: string;
  probability: number;
  impactType?: 'Opportunity' | 'Risk' | 'Neutral';
  description?: string;
  recommendation?: string;
  signalStrength?: number;
  timestamp?: number;
  scenario?: string;
  impactDelta?: number;
}

export interface IOmniGnosisAtom<T = Record<string, unknown>> extends IOmniAtom<T> {
  predictions: IGnosisPrediction[];
  status: OmniStatus;
}

export interface IOmniVector {
  id: string;
  values: number[];       // Embedding array
  payload: string;        // Text content represented
  metadata?: Record<string, any>;
}

export interface IOmniscienceQuery {
  text: string;
  topK?: number;
  threshold?: number;
}
export interface IGovernanceProposal { [key: string]: any; }
export interface IImpactTrade { [key: string]: any; }
export interface ESGRecord { [key: string]: any; }
export interface LockedRecord { [key: string]: any; }
export interface IAssessmentEngineConfig { [key: string]: any; }
export interface IOmniDomain { [key: string]: any; }
export interface IOmniKPI { [key: string]: any; }
export interface IOmniOKR { [key: string]: any; }
export interface IOmniRouter { [key: string]: any; }
export interface IOmniUserBiSyncCenter { [key: string]: any; }
export interface IOmniSyncStatus { [key: string]: any; }
export interface IIntegrationBridge { [key: string]: any; }

export interface IKeyResult { [key: string]: any; }
