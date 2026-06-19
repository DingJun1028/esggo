/**
 * Omni-Component Core Types (Server Side)
 * --------------------------------------------------
 * Synchronized with Frontend types for 5T Protocol.
 */

export type LogicState =
  | 'CALCULABLE'
  | 'TRACEABLE'
  | 'TRACKABLE'
  | 'IMMUTABLE'
  | 'VERIFIED'
  | 'REVOKED';

// 🌐 5T 善向永續協議核心 (4可1不可)
export type FiveTProtocol =
  | 'Traceable' // 🟢 可溯源 (真)
  | 'Trackable' // 🔵 可追蹤 (真)
  | 'Transparent' // 🟠 透明化/可驗算 (善)
  | 'Tangible' // 🟣 可感知 (善)
  | 'Trustworthy'; // 🔴 信實化/不可篡改 (美)

// ☯️ 任督二脈分類
export type MeridianFlow = 'INWARD_REN' | 'OUTWARD_DU';

// 🌟 善向六德指標 (1-10 分制)
export interface IMeritProfile10 {
  intelligence: number; // 智 (Intelligence)
  benevolence: number; // 仁 (Benevolence)
  integrity: number; // 誠 (Integrity)
  courage: number; // 勇 (Courage)
  temperance: number; // 節 (Temperance)
  harmony: number; // 和 (Harmony)
}

// 證據佐證庫 (Evidence Vault)
export interface IEvidence {
  readonly source_origin: string; // T1: 證據來源
  readonly verified_at?: number; // T2: 驗證時間戳
  readonly hash_lock: string; // T4: 雜湊鎖定碼
  readonly metadata?: Record<string, unknown>; // 額外的佐證數據

  // 5T Specific
  lifecycle_hooks?: string[];
  logic_formula?: string;
  tangible_manifest?: {
    is_crystallized: boolean;
    qr_link: string;
    visual_grade: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
  };

  // Legacy/Compat mappings if needed
  raw_data_hash?: string;
  verified_by?: string;
  timestamp?: number;
}

export interface IComponentCore {
  readonly uuid: string; // 奧秘永憶主體唯一識別碼
  readonly version: string; // Sentient v7.0
  readonly created_at?: number; // 刻印時間戳
  evidence: IEvidence;
}

// 泛型 ESG 資產 (Generic Asset) - 4T Compliant
export interface IImpactAsset<T> extends IComponentCore {
  asset_type: 'CARBON_CREDIT' | 'GOVERNANCE_TOKEN' | 'SOCIAL_CAPITAL' | 'ESG_SCORE';

  // ========== 脈絡與德行 ==========
  readonly meridian: MeridianFlow; // ☯️ 任督分流
  readonly virtues: IMeritProfile10; // 🌟 六德指標 (1-10)

  // ========== 數據載體 ==========
  data: T;

  // 顯示用：帝國金視覺權重 (0-100)
  gold_weight: number;

  // 4T 驗證狀態
  four_t_validated?: boolean;
  trustworthy_level?: 'verified' | 'estimated' | 'demo' | 'unverified';
}

/**
 * 💡 誠信證明 (ImpactProof) - 4+1 Protocol Aligned
 * --------------------------------------------------
 * 符合 5T 協議的外部驗證數據
 */
export interface ImpactProof {
  uuid: string;
  meridian: MeridianFlow;
  virtues: IMeritProfile10;
  evidence: {
    source_origin: string; // 🟢 Traceable
    lifecycle_hooks: string[]; // 🔵 Trackable
    logic_formula: string; // 🟠 Transparent

    tangible_manifest: {
      // 🟣 Tangible
      is_crystallized: boolean;
      qr_link: string;
      visual_grade: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
    };

    hash_lock: string; // 🔴 Trustworthy
  };
  verified_at: number;
}
