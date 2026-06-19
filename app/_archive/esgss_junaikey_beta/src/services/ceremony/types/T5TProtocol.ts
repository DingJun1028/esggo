/**
 * @esgss/jun-ai-ceremony
 * T5T Protocol (5T 協議) 類型定義
 * 
 * 第一層：5T 邏輯門 (The 5T Logic Gate)
 * [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
 * [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 (source_origin)
 * [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
 * [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 (ISO-14064-1)
 * [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
 * 
 * 第二層：4可1不可狀態機 (The 4+1 State Machine)
 * 🟢 可感知 | 🟢 可溯源 | 🟢 可追蹤 | 🟢 可透明驗算 | 🔴 不可篡改
 * 
 * 遵循 W4 聖典執行手冊規範
 */

/**
 * 5T 協議規範
 */
export interface IT5TProtocol {
  /** [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果 */
  tangible: ITangible;
  /** [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 */
  traceable: ITraceable;
  /** [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑 */
  trackable: ITrackable;
  /** [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 */
  transparent: ITransparent;
  /** [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze() */
  trustworthy: ITrustworthy;
}

/**
 * [1] Tangible 可感知性
 * 將抽象永續願景轉化為具體指標成果
 */
export interface ITangible {
  /** 是否已驗證 */
  verified: boolean;
  /** 驗證時間 */
  verified_at?: number;
  /** 驗證方法 */
  verification_method: string;
  /** 數位指紋 */
  fingerprint: string;
}

/**
 * [2] Traceable 可溯源性
 * 鏈式日誌包含原始資料來源 (source_origin)
 */
export interface ITraceable {
  /** 創建時間 */
  created_at: number;
  /** 創建者 */
  created_by: string;
  /** 修改歷史 */
  modification_history: ModificationRecord[];
  /** 原始來源 */
  origin_source: string;
}

/**
 * 修改記錄
 */
export interface ModificationRecord {
  /** 修改時間 */
  timestamp: number;
  /** 修改者 */
  modified_by: string;
  /** 修改類型 */
  modification_type: 'create' | 'update' | 'delete' | 'seal' | 'unseal';
  /** 修改摘要 */
  summary: string;
  /** 變更集 */
  changeset?: Record<string, unknown>;
}

/**
 * [3] Trackable 可追蹤性
 * 生命週期 Hook 記錄數據流轉路徑
 */
export interface ITrackable {
  /** 追蹤 ID */
  tracking_id: string;
  /** 當前狀態 */
  current_state: string;
  /** 狀態歷史 */
  state_history: StateRecord[];
  /** 監控指標 */
  metrics: TrackableMetrics;
}

/**
 * 狀態記錄
 */
export interface StateRecord {
  /** 狀態 */
  state: string;
  /** 進入時間 */
  entered_at: number;
  /** 離開時間 */
  exited_at?: number;
  /** 原因 */
  reason?: string;
}

/**
 * 監控指標
 */
export interface TrackableMetrics {
  /** 活躍度 */
  activity_level: number;
  /** 使用頻率 */
  usage_frequency: number;
  /** 最後活動時間 */
  last_activity_at?: number;
  /** 預測下次活動 */
  predicted_next_activity?: number;
}

/**
 * [4] Transparent 可透明驗算
 * 算法公式公開化，零幻覺驗證 (ISO-14064-1)
 */
export interface ITransparent {
  /** 公開策略 */
  visibility_policy: 'public' | 'private' | 'restricted';
  /** 存取控制列表 */
  access_control_list: AccessControlEntry[];
  /** 審計日誌 */
  audit_log: AuditEntry[];
  /** 透明性級別 */
  transparency_level: number;
}

/**
 * 存取控制條目
 */
export interface AccessControlEntry {
  /** 主體 */
  subject: string;
  /** 權限 */
  permissions: string[];
  /** 授權時間 */
  granted_at: number;
  /** 過期時間 */
  expires_at?: number;
}

/**
 * 審計條目
 */
export interface AuditEntry {
  /** 時間 */
  timestamp: number;
  /** 動作 */
  action: string;
  /** 執行者 */
  actor: string;
  /** 目標 */
  target: string;
  /** 結果 */
  result: 'success' | 'failure';
  /** 詳情 */
  details?: Record<string, unknown>;
}

/**
 * [5] Trustworthy 不可篡改性
 * Hash Lock + Object.freeze() - 4可1不可狀態機的🔴核心
 */
export interface ITrustworthy {
  /** 信任分數 */
  trust_score: number;
  /** 信任等級 */
  trust_level: 'low' | 'medium' | 'high' | 'very_high';
  /** 信任歷史 */
  trust_history: TrustRecord[];
  /** 認證列表 */
  certifications: Certification[];
}

/**
 * 信任記錄
 */
export interface TrustRecord {
  /** 時間 */
  timestamp: number;
  /** 事件 */
  event: string;
  /** 影響 */
  impact: number;
  /** 描述 */
  description: string;
}

/**
 * 認證
 */
export interface Certification {
  /** 認證類型 */
  type: string;
  /** 頒發者 */
  issuer: string;
  /** 頒發時間 */
  issued_at: number;
  /** 過期時間 */
  expires_at?: number;
  /** 認證標識 */
  credential_id: string;
}

/**
 * 5T 合規評估結果
 */
export interface T5TComplianceResult {
  /** 總分數 */
  overall_score: number;
  /** 各維度分數 */
  scores: {
    tangible: number;
    traceable: number;
    trackable: number;
    transparent: number;
    trustworthy: number;
  };
  /** 合規狀態 */
  compliance_status: 'compliant' | 'partial' | 'non_compliant';
  /** 改進建議 */
  recommendations: string[];
  /** 評估時間 */
  evaluated_at: number;
}

/**
 * 5T 協議工廠
 */
export class T5TProtocolFactory {
  /**
   * 創建完整的 5T 協議實例
   */
  static create(
    source_origin: string,
    creator: string
  ): IT5TProtocol {
    const timestamp = Date.now();
    const tracking_id = `TRACK-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    return {
      tangible: {
        verified: false,
        verification_method: 'initialization',
        fingerprint: ''
      },
      traceable: {
        created_at: timestamp,
        created_by: creator,
        modification_history: [{
          timestamp,
          modified_by: creator,
          modification_type: 'create',
          summary: 'Component created with T5T protocol'
        }],
        origin_source: source_origin
      },
      trackable: {
        tracking_id,
        current_state: 'active',
        state_history: [{
          state: 'active',
          entered_at: timestamp
        }],
        metrics: {
          activity_level: 1.0,
          usage_frequency: 0,
          last_activity_at: timestamp
        }
      },
      transparent: {
        visibility_policy: 'restricted',
        access_control_list: [{
          subject: creator,
          permissions: ['read', 'write', 'admin'],
          granted_at: timestamp
        }],
        audit_log: [{
          timestamp,
          action: 'create',
          actor: creator,
          target: source_origin,
          result: 'success'
        }],
        transparency_level: 0.8
      },
      trustworthy: {
        trust_score: 50,
        trust_level: 'medium',
        trust_history: [{
          timestamp,
          event: 'Initial trust score',
          impact: 50,
          description: 'Starting trust level'
        }],
        certifications: []
      }
    };
  }
  
  /**
   * 計算 5T 合規分數
   */
  static calculateCompliance(protocol: IT5TProtocol): T5TComplianceResult {
    const scores = {
      tangible: protocol.tangible.verified ? 100 : 50,
      traceable: protocol.traceable.modification_history.length > 0 ? 80 : 40,
      trackable: protocol.trackable.tracking_id ? 100 : 0,
      transparent: protocol.transparent.transparency_level * 100,
      trustworthy: protocol.trustworthy.trust_score
    };
    
    const overall_score = Math.round(
      (scores.tangible + scores.traceable + 
       scores.trackable + scores.transparent + 
       scores.trustworthy) / 5
    );
    
    const recommendations: string[] = [];
    
    if (scores.tangible < 70) {
      recommendations.push('需要驗證組件的可觸知性');
    }
    if (scores.traceable < 70) {
      recommendations.push('需要完善修改歷史記錄');
    }
    if (scores.transparent < 70) {
      recommendations.push('需要提高透明性級別');
    }
    if (scores.trustworthy < 70) {
      recommendations.push('需要建立信任機制');
    }
    
    return {
      overall_score,
      scores,
      compliance_status: overall_score >= 80 
        ? 'compliant' 
        : overall_score >= 50 
          ? 'partial' 
          : 'non_compliant',
      recommendations,
      evaluated_at: Date.now()
    };
  }
}
