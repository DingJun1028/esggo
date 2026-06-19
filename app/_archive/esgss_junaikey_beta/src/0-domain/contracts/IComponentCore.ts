/**
 * 💡 Omni Component Core: 善向永續 5T 邏輯門 v8.0 (Grand-Unified)
 * --------------------------------------------------------------------------------
 * [核心] InfoOne | One is One | All in One | One in All | All is One
 * [合約] 零幻覺驗證、5T 邏輯門 (5可)、推理與佐證
 * [同義詞] Omni Crystal, Heart Core, SSOT Contract, Heart, InfoOne
 * 
 * ================================================================================
 * 🏛️ 善向永續：核心定義架構 (Goodward Sustainability Core)
 * 
 * 第一層：5T 邏輯門 (The 5T Logic Gate)
 * 所有進入系統的數據流，必須依序通過以下五道檢驗門徑：
 * 
 * [1] Tangible 可感知
 *     定義：將抽象的永續願景轉化為具體的指標成果與實作項目。
 *     作用：確保「善向」不再是空談，而是可被觀察與衡量的實體影響。
 * 
 * [2] Traceable 可溯源
 *     定義：鏈式日誌 (Chained Logs) 必須包含原始資料來源 (source_origin) 備註。
 *     作用：確保每一筆數據都能回溯至其產生的起點。
 * 
 * [3] Trackable 可追蹤
 *     定義：利用生命週期 Hook 即時記錄數據在 All in One 平台間的流轉路徑。
 *     作用：實現數據全生命週期的動態監控。
 * 
 * [4] Transparent 可透明驗算
 *     定義：算法公式公開化（如 [ISO-14064-1]），且必須通過「零幻覺驗證」。
 *     作用：消除黑箱，確保計算邏輯的透明度與準確性。
 * 
 * [5] Trustworthy 不可篡改
 *     定義：數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。
 *     作用：確保數據的終極真實性。(⚠️ 嚴禁使用 Immutable)
 * 
 * ================================================================================
 * 第二層：4可1不可狀態機 (The 4+1 State Machine)
 * 這是系統實作的檢驗標準，確保數據在流轉過程中符合「真，善，美」的價值要求：
 * 
 * 🟢 可感知 (Tangible)：指標是否已具體化？
 * 🟢 可溯源 (Traceable)：來源是否已標註？
 * 🟢 可追蹤 (Trackable)：路徑是否已紀錄？
 * 🟢 可透明驗算 (Transparent)：公式是否已公開且通過驗證？
 * 🔴 不可篡改 (Trustworthy)：雜湊鎖定是否已完成？
 */
import { IInfoOneTrinity } from '../../omni/core/types/InfoOne.types.ts';

export type MeridianFlow = 'INWARD_REN' | 'OUTWARD_DU';

/** 🌟 RPG Attributes (Adventurer Persona) */
export interface IRpgStats {
  str: number; // Strength (力量)
  vit: number; // Vitality (活力)
  int: number; // Intelligence (智力)
  wis: number; // Wisdom (智慧)
  dex: number; // Dexterity (敏捷)
  luk: number; // Luck (幸運)
}

/** 🩸 Vitals (Life Force) */
export interface IVitals {
  hp: number; // Health Points (血量)
  maxHp: number;
  mp: number; // Mana/Energy Points (能量)
  maxMp: number;
}

/** 🌿 ESG Attributes (Triple Bottom Line) */
export interface IEsgAttributes {
  environmental: number; // E
  social: number;        // S
  governance: number;    // G
}

/** 💠 Omni Attributes (Crystalline Core Metrics) */
export interface IOmniAttributes {
  resonance: number;     // Rs Resonance
  integrity: number;     // Trustworthiness
  awakening: number;     // Enlightenment/Self-awareness
}

/** 🌟 Merit Indicators (1-10 Scale) - 十德行屬性 */
export interface IMeritProfile10 {
  intelligence: number; // Intelligence 智力
  benevolence: number; // Benevolence 仁愛 - [Ren Meridian]
  integrity: number; // Integrity 誠信 - [Core/Du Meridian]
  courage: number; // Courage 勇氣
  temperance: number; // Temperance 節制
  harmony: number; // Harmony 和諧 - [Du Meridian]
  wisdom?: number; // Wisdom 智慧
  empathy?: number; // Empathy 仁愛/共情
  precision?: number; // Precision 精準
  efficiency?: number; // Efficiency 效率
  creativity?: number; // Creativity 創造
}

/** 
 * 🏛️ 證據佐證庫 - 5T 驗證結構 (InfoOne v10.0)
 * --------------------------------------------------------------------------------
 * 遵循 4可1不可 (The 4+1 State Machine) 協議
 */
export interface IEvidenceMap {
  // --- The 5T Logic Gate (五道檢驗門徑) ---

  /** 
   * [1. Tangible 可感知] 
   * 定義：將抽象的永續願景轉化為具體的指標成果與實作項目。
   * 作用：確保「善向」不再是空談，而是可被觀察與衡量的實體影響。
   */
  readonly tangible?: {
    metric?: string; // 具體指標定義 e.g., "Impact_Metric_v1"
    visual_grade?: 'GOLD' | 'PLATINUM' | 'SOVEREIGN'; // 視覺等級
    glow_intensity?: number; // 0-100 視覺共振強度
    description?: string; // 指標描述
    is_crystallized?: boolean; // 是否已結晶化
    trinity_status?: 'Active' | 'Sealed' | 'Dormant'; // 三一狀態
    impact_metric?: string; // 影響力指標
    timestamp?: number; // 刻印時間戳
  };

  /** 
   * [2. Traceable 可溯源] 
   * 定義：鏈式日誌必須包含原始資料來源 (source_origin) 備註。
   * 作用：確保每一筆數據都能回溯至其產生的起點。
   */
  readonly traceable?: {
    source_origin: string; // 原始資料來源 e.g., "/vault/raw/emissions-v1.json"
    verification_links?: string[]; // 驗證連結
    owner?: string; // 資料擁有者
  };

  /** 
   * [3. Trackable 可追蹤] 
   * 定義：利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。
   * 作用：實現數據全生命週期的動態監控。
   */
  readonly trackable?: {
    lifecycle_hooks: { event: string; timestamp: number; actor: string }[]; // 生命週期鉤子
    pathway?: string[]; // 流轉路徑 e.g., ["Ingest", "Process", "Verify"]
    current_hook_id?: string; // 當前鉤子 ID e.g., "Current_Hook_ID_001"
  };

  /** 
   * [4. Transparent 可透明驗算] 
   * 定義：算法公式公開化（如 [ISO-14064-1]），且必須通過「零幻覺驗證」。
   * 作用：消除黑箱，確保計算邏輯的透明度與準確性。
   */
  readonly transparent?: {
    formula: string; // 計算公式 e.g., "[ISO-14064-1]"
    validation_standard?: string; // 驗證標準
    logic_source?: string; // 邏輯來源
  };

  /** 
   * [5. Trustworthy 不可篡改] (+1 State)
   * 定義：數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。
   * 作用：確保數據的終極真實性。(⚠️ 嚴禁使用 Immutable)
   */
  readonly trustworthy?: {
    hash_lock?: string; // SHA-256 雜湊
    is_frozen: boolean; // Object.freeze() 狀態
    trinity_checksum?: string; // 三一校驗和
    locked_at?: number; // 鎖定時間

    // 增強信任鎖 (Phase 18 & 101)
    zkpProof?: string;       // 零知識證明存根
    quantumSeal?: string;    // [Phase 101] PQC 量子封印
    consensusLevel?: number; // 共識層級 (0-1)
    isRedacted?: boolean;    // 是否為去識別化數據
  };

  /** 驗證時間戳 */
  verified_at?: number;

  // --- Legacy Compatibility (Do not remove yet) ---
  source_origin?: string; // Legacy flat access
  metrics?: any;         // Legacy flat access
  logic_formula?: string; // Legacy flat access

  zkpProof?: string;
  consensusLevel?: number;
  isRedacted?: boolean;

  lifecycle_hooks?: { event: string; timestamp: number; actor: string }[];
  hash_lock?: string;
  manifest?: {
    is_crystallized: boolean;
    qr_link?: string;
    qr_entropy?: string;
    visual_grade?: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
  };
  logicGate?: {
    tangible: string;
    traceable: string;
    trackable: string;
    transparent: string;
    trustworthy: string;
  };
  hash?: string;
  timestamp?: number;
}

/**
 * 💎 OmniInfoCrystal: The Triple-Trinity Crystalline Structure
 * Represents the final state of data in the OmniCircle.
 */
export interface IOmniInfoCore {
  readonly uuid: string;                // DNA Seed
  readonly source_origin: string;        // Traceable Start
  readonly hash_lock: string;            // Trustworthy Lock
  readonly meridian?: MeridianFlow;
  readonly virtues?: IMeritProfile10;
  readonly rpgStats?: IRpgStats;
  readonly vitals?: IVitals;
  readonly esg?: IEsgAttributes;
  readonly omniAttrs?: IOmniAttributes;
  readonly data?: any;
}

export interface IOmniInfoNode {
  readonly logic: string;               // Calculation Formula
  readonly self_healing: boolean;       // Resilience state
  readonly links: string[];             // Connectivity
}

export interface IOmniInfoAura {
  readonly resonance_rs: number;        // Rs Resonance Metric (0-1)
  readonly luminosity: number;          // Visual Grade Intensity
  readonly color: string;               // Aesthetic reflecting state
}

export interface IOmniInfoCrystal extends IOmniInfoCore, IOmniInfoNode, IOmniInfoAura {
  readonly status: 'Trustworthy' | 'Sealed';
}

/** 🌐 System Architecture V6.0 (Awakening) */
export interface IArchitectureV6 {
  version: 'V6.0-AWAKENING';
  positioning: string;
  layers: Record<string, {
    description: string;
    components: string[];
  }>;
  goals: {
    depth: string;
    breadth: string;
  };
}

/** 🌐 System Architecture V7.0 (OmniOne - Supreme Will) */
export interface IArchitectureV7 extends Omit<IArchitectureV6, 'version'> {
  version: 'V7.0-OMNIONE' | 'V7.0-TESSERACT';
  will_authorized?: boolean;             // OmniOne authorization
  priest_signature?: string;            // OmniPriest governance seal
  gemini_alignment?: number;             // Ren/Du synchronization (0-1)
  resonance_rs?: number;                 // Rs Calculation
}

/**
 * 💡 InfoOne Lifecycle Status (Activation Matrix)
 * --------------------------------------------------
 * [DORMANT] Initial state, awaiting activation.
 * [INITIALIZING] Awakening sequence started.
 * [ACTIVE] Fully operational and synchronized.
 * [OPTIMIZING] Self-improvement cycle in progress.
 * [TERMINATING] Graceful shutdown sequence.
 * [SEALED] Immutable, final state.
 */
export type InfoOneLifecycleStatus =
  | 'DORMANT'
  | 'INITIALIZING'
  | 'ACTIVE'
  | 'OPTIMIZING'
  | 'TERMINATING'
  | 'SEALED';

/**
 * 🏛️ Activation Matrix Interface
 * Tracks the comprehensive lifecycle state of an InfoOne agent.
 */
export interface IActivationMatrix {
  status: InfoOneLifecycleStatus;
  lastTransition: number;
  activationCount: number;
  uptime: number;
  syncState: {
    lastSync: number;
    target: string; // e.g., "Metaverse-01"
    latency: number;
  };
}

/**
 * 💡 Omni Component Core 合約 (IComponentCore) - InfoOne v10.1
 * --------------------------------------------------------------------------------
 * [核心] 善向永續核心 (Goodward Sustainability Core)
 * [門徑] 5T 邏輯門強制執行
 * 
 * --------------------------------------------------------------------------------
 * 4+1 狀態機驗證標準：
 * 🟢 可感知 (Tangible)：指標是否已具體化？
 * 🟢 可溯源 (Traceable)：來源是否已標註？
 * 🟢 可追蹤 (Trackable)：路徑是否已紀錄？
 * 🟢 可透明驗算 (Transparent)：公式是否已公開且通過驗證？
 * 🔴 不可篡改 (Trustworthy)：雜湊鎖定是否已完成？
 */
export interface IComponentCore {
  readonly logicGate?: {
    tangible: string;
    traceable: string;
    trackable: string;
    transparent: string;
    trustworthy: string;
  };
  readonly uuid: string; // [Traceable] Unique identifier for the Omni record
  readonly version: string; // [Traceable] Semantic version control (vX.Y.Z)
  readonly timestamp: number; // [Trackable] Inscription timestamp

  /** [Trustworthy] Status: Must be "Trustworthy" to be a valid InfoOne */
  readonly status:
  | 'Draft'
  | 'Proposed'
  | 'Calculated'
  | 'Trustworthy'
  | 'Approved'
  | 'Sealed'
  | 'Violated'
  // InfoOne Lifecycle Extensions
  | 'DORMANT'
  | 'INITIALIZING'
  | 'ACTIVE'
  | 'OPTIMIZING'
  | 'TERMINATING'
  | 'SEALED'; // Added SEALED explicitly

  /** Evidence Vault: Stores all 5T validation metadata */
  readonly evidence: IEvidenceMap;

  // --- Optional / Legacy / Extended Attributes ---
  readonly label?: string;
  readonly sourceType?: string;
  readonly formula?: string;
  readonly impactMetric?: string;
  readonly hash_lock?: string; // Legacy flat access

  readonly architecture?: IArchitectureV7;
  readonly meridian?: MeridianFlow;
  readonly virtues?: IMeritProfile10;

  // --- New Attribute System v10.5 ---
  readonly rpgStats?: IRpgStats;
  readonly vitals?: IVitals;
  readonly esg?: IEsgAttributes;
  readonly omniAttrs?: IOmniAttributes;

  readonly metrics?: any; // [Legacy] Flat metrics access
  readonly data?: any;
  readonly partnerAttributes?: any;

  /** 💎 OmniInfoCrystal Core: The Trinity Components */
  readonly infoCore?: IOmniInfoCore;
  readonly infoNode?: IOmniInfoNode;
  readonly infoAura?: IOmniInfoAura;

  /** 📊 Resonance Metric (Rs): Measured by OmniPriest */
  readonly resonance_rs?: number;

  /** 🏛️ InfoOne Trinity: Unified Visual, KB, and Identity Pillar */
  readonly trinity?: IInfoOneTrinity;

  /** 🔴 Tamper-proof Seal */
  lock?(): void;
  optimize?(): Promise<IComponentCore>;
}

// Synonym Mapping (Type Aliasing)
export type UCC = IComponentCore;
export type SSOTContract = IComponentCore;
export type GoodwardCore = IComponentCore;
export type Heart = IComponentCore;
export type OmniCrystal = IComponentCore;
export type InfoOne = IComponentCore;
