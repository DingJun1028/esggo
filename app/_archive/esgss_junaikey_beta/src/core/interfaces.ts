// [SHAN_XIANG_SSOT] Omni Component Core
// Note: This is maintained for legacy compatibility. For new code, use src/types/core/index.ts.
import { IComponentCore } from '../types/core';

export type EvidenceMap = Record<string, string>; // uuid -> hash/url

export type { IComponentCore };

/**
 * 🛠️ 善向永續 5T 數據誠信協議 (ESGss 5T Data Integrity Protocol)
 * --------------------------------------------------------------------------------
 * 核心哲學：以技術手段消除數據幻覺，建立創價型 ESG 的誠信基石
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
 */
export interface IProtocol5T {
  traceable: {
    sourceOrigin: string;
    rawDataPath: string;
    verified: boolean;
  };
  trackable: {
    lifecycleHooks: Array<{
      stage: string;
      timestamp: number;
      operator?: string;
    }>;
    tracked: boolean;
  };
  transparent: {
    algorithmFormula: string;
    verified: boolean;
  };
  tangible: {
    manifest: any;
    verified: boolean;
  };
  trustworthy: {
    hashLock: string;
    locked: boolean;
  };
}

export interface IAuthKey {
  type: 'JUN_AI_KEY' | 'TECH_ORACLE' | 'USER_KEY';
  signature: string;
}

export interface IImpactLedger {
  totalImpact: number;
  beneficiaries: string;
  signature: string;
}
