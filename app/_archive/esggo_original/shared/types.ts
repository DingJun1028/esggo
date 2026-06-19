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
 * @description 證據佐證庫 - 紀錄 5T 檢驗元數據。
 */
export interface IEvidence {
  /** 🟢 可感知 (Tangible)：具體指標定義 */
  tangible_metric: string;
  /** 🟢 可溯源 (Traceable)：原始資料路徑 (Source Origin) */
  source_origin: string;
  /** 🟢 可追蹤 (Trackable)：數據流轉日誌 (Lifecycle Hooks) */
  lifecycle_hooks: string[];
  /** 🟢 可透明驗算 (Transparent)：[ISO-14064-1] 等公式來源 */
  formula_ref: string;
}

/**
 * @interface IComponentCore
 * @description 萬能元件心核 (SSOT 契約) - 系統之立身之本。
 */
export interface IComponentCore {
  readonly uuid: string;              // 萬能永憶主體唯一識別碼 (Traceable)
  readonly version: string;           // 語義化版本控制
  readonly timestamp: number;         // 刻印時間戳 (Trackable)
  readonly formula: string;           // 碳排與影響力計算公式 (Transparent)
  readonly impact_metric: string;     // 具體影響力指標 (Tangible)
  readonly status: "Trustworthy";     // 唯一的不可狀態 (Trustworthy)
  readonly hash_lock: string;         // 數據真理哈希鎖
  readonly evidence: IEvidence[];     // 證據佐證庫
}

// ============================================================
// 3. 永恆記憶與智庫 (Eternal Memory & Think Tank)
// ============================================================

export enum EternalMemoryType {
  EPISODIC = 'EPISODIC',
  SEMANTIC = 'SEMANTIC',
  PROCEDURAL = 'PROCEDURAL',
  SPATIAL = 'SPATIAL',
  EMOTIONAL = 'EMOTIONAL',
  CREATIVE = 'CREATIVE'
}

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
