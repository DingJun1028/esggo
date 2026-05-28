/**
 * ESG GO | Shared Sacred Types 🌌
 * v2.1 | Ultimate P0 Genesis Alignment
 * 
 * 英標為骨 (American English Core)，繁博為魂 (Traditional Chinese Soul)
 * 遵循「4可1不可」狀態機 (The 4+1 State Machine)
 */

// ============================================================
// 1. 5T 協議門：數據治理矩陣 (The 5T Protocol)
// ============================================================

/**
 * @interface I5TGovernance
 * @description ESG Sunshine 平台之核心數據治理協議。
 * 🔴 不可篡改 (Trustworthy) 是唯一的終態。
 */
export interface I5TGovernance {
  readonly traceable: boolean;    // 真 (Truth)：數據源頭可溯源 (Origin-verified)
  readonly transparent: boolean;  // 善 (Goodness)：算法可驗證且透明 (ISO-14064-1)
  readonly tangible: boolean;     // 美 (Beauty)：視覺呈現直觀且具質感 (UI/UX Excellence)
  readonly trackable: boolean;    // 通 (Transferful)：數據路徑可追蹤 (Lifecycle-aware)
  readonly trustworthy: boolean;  // 信 (Trust)：數據不可篡改 (Hash Locked)
}

export type T5GateState = I5TGovernance;


/** 5T 門徑代碼 */
export type T5Status =
  | 'Traceable'    // 真
  | 'Transparent'  // 善
  | 'Tangible'     // 美
  | 'Trackable'    // 通
  | 'Trustworthy';  // 信

// ============================================================
// 2. 萬能元件心核 (Omni Component Core)
// ============================================================

/**
 * @interface IEvidence
 * @description 證據佐證庫 - 紀錄 5T 檢驗元數據 (觀因循果修復版)
 */
export interface IEvidence {
  // 觀因循果結構
  originCause: string;    // 因：原始觸發條件
  processTrace: string[]; // 循：InfoOne 流轉路徑
  finalEffect: string;    // 果：最終執行結果與狀態

  // 兼容舊版 5T 屬性 (逐步汰除或整合)
  tangible_metric?: string;
  source_origin?: string;
  lifecycle_hooks?: string[];
  formula_ref?: string;
  causality?: {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
  };
}

/**
 * 萬能元件心核 - 觀因循果修復版
 * 確保數據從因到果的完整性與不可篡改性 (SSOT 契約)
 */
export interface IComponentCore {
  // 萬能永憶主體唯一識別碼 (Immutable)
  readonly uuid: string; 
  // 語義化版本控制
  readonly version: string; 
  // 刻印時間戳 (溯源起點)
  readonly timestamp: number; 
  
  // 5T 必備屬性
  readonly formula: string;           // 碳排與影響力計算公式 (Transparent)
  readonly impact_metric: string;     // 具體影響力指標 (Tangible)
  readonly status: "Trustworthy";     // 唯一的不可狀態 (Trustworthy)
  readonly hash_lock: string;         // 數據真理哈希鎖
  
  // 證據左證庫 (儲存觀因循果的執行軌跡)
  evidence: IEvidence[];
}

/**
 * @interface IRestorationProtocol
 * @description 萬能修復協議 (Omni Restoration Protocol)
 * 當偵測到系統熵增（亂碼、錯誤）時觸發的最高權限自癒協議。
 */
export interface IRestorationProtocol {
  /** 鏈式校驗 (Chain Validation) */
  validateChain(uuid: string): Promise<boolean>;
  /** 殘影重組 (Ghost Recomposition) */
  recompose(hashLock: string): Promise<IComponentCore>;
  /** 語義修正 (Semantic Alignment) */
  align(target: IComponentCore): Promise<IComponentCore>;
}

/** 萬能修復輸入數據結構 */
export interface RestorationInput {
  metric?: string;
  source?: string;
  formula?: string;
  trigger?: string;
  [key: string]: unknown;
}

/** 記憶整合結果結構 */
export interface ConsolidationResult {
  success: boolean;
  summary: string;
  count: number;
  error?: string;
}

// ============================================================
// 3. 永恆記憶與智庫 (Eternal Memory & Think Tank)
// ============================================================

export const EternalMemoryType = {
  EPISODIC: 'EPISODIC',
  SEMANTIC: 'SEMANTIC',
  PROCEDURAL: 'PROCEDURAL',
  SPATIAL: 'SPATIAL',
  EMOTIONAL: 'EMOTIONAL',
  CREATIVE: 'CREATIVE'
} as const;

export type EternalMemoryType = typeof EternalMemoryType[keyof typeof EternalMemoryType];

export interface EternalMemory {
  id: string;
  type: EternalMemoryType;
  content: string;
  tags: string[];
  timestamp: number;
  hash_lock: string;
  consolidated: boolean;
}

// ============================================================
// 4. API 請求/回應 (Bi-directional API)
// ============================================================

export type OmniRequestType =
  | 'query'
  | 'seal'
  | 'verify'
  | 'manifest'
  | 'remember'
  | 'analyze';

export type OmniResponseStatus =
  | 'success'
  | 'processing'
  | 'sealed'
  | 'verified'
  | 'error';

export interface ApiRequest<T = unknown> {
  id: string;
  type: OmniRequestType;
  content: string;
  data?: T;
  timestamp: number;
  session_id?: string;
}

export interface ApiResponse<T = unknown> {
  id: string;
  status: OmniResponseStatus;
  t5_tag?: T5Status;
  content: string;
  data?: T;
  hash_lock?: string; // 該次操作的密碼學指紋
  timestamp: number;
  component?: IComponentCore;
  meta?: {
    node: string;
    timestamp: number;
  };
}

export interface AgentSession {
  id: string;
  name: string;
  persona: 'compliance' | 'harmony' | 'innovation' | 'entropy' | 'junaikey';
  created_at: number;
  memory_count: number;
}
