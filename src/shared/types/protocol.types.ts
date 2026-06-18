/**
 * ESG GO | 🏛️ 5T 誠信協議門 (The 5T Protocol: Data Governance Framework)
 * v2.1 | Ultimate Minimalist Alignment
 *
 * 5T 協議又稱為「真善美信通」
 *
 * 英文命名（正確）：Tangible, Traceable, Trackable, Transparent, Trustworthy
 * 中文命名（正確）：美, 真, 信, 善, 通
 *
 * 對應關係（按技術編號 T1-T5）：
 * T1 - Tangible (美)     - 抽象數據轉化為具體治理指標
 * T2 - Traceable (真)    - 每筆數據與原始憑證精確關聯
 * T3 - Trackable (信)    - 完整編輯軌跡與生命週期追蹤
 * T4 - Transparent (善)  - 主動掃描綠漂風險，算法公開
 * T5 - Trustworthy (通)  - SHA-256 雜湊鎖定，不可篡改
 *
 * 注意：「真善美信通」是中文口訣，順序非 T1-T5 技術編號順序
 */

import { I5TGovernance } from './core.types';

export type ProtocolGateCode = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export interface IProtocolGate {
  readonly code: ProtocolGateCode;
  readonly labelZh: string;
  readonly propertyEn: keyof I5TGovernance;
  readonly titleZh: string;
  readonly descriptionEn: string;
  readonly color: string;
}

/**
 * @const SACRED_GATES
 * @description 5T 協議門之創世定義 v2.1
 * 5T = 真善美信通 = Tangible · Traceable · Trackable · Transparent · Trustworthy
 */
export const SACRED_GATES: Record<ProtocolGateCode, IProtocolGate> = {
  T1: {
    code: 'T1',
    labelZh: '美',
    propertyEn: 'tangible',
    titleZh: '美 (Tangible)',
    descriptionEn: '抽象數據轉化為具體治理指標：Bento Grid 視覺化 + Skeleton Loader。',
    color: '#06B6D4', // Cyan-core
  },
  T2: {
    code: 'T2',
    labelZh: '真',
    propertyEn: 'traceable',
    titleZh: '真 (Traceable)',
    descriptionEn: '每筆數據與原始憑證精確關聯：evidence_id 外鍵 + source_origin 欄位。',
    color: '#10B981', // Emerald-soul
  },
  T3: {
    code: 'T3',
    labelZh: '信',
    propertyEn: 'trackable',
    titleZh: '信 (Trackable)',
    descriptionEn: '完整編輯軌跡與生命週期追蹤：audit_logs 表 + 生命週期 Hook。',
    color: '#219EBC', // Optimal-blue
  },
  T4: {
    code: 'T4',
    labelZh: '善',
    propertyEn: 'transparent',
    titleZh: '善 (Transparent)',
    descriptionEn: '主動掃描綠漂風險，算法公開：AI 合規引擎 + GRI 對齊檢查。',
    color: '#FFB703', // Critical-amber
  },
  T5: {
    code: 'T5',
    labelZh: '通',
    propertyEn: 'trustworthy',
    titleZh: '通 (Trustworthy)',
    descriptionEn: 'SHA-256 雜湊鎖定，不可篡改：hash_lock 欄位 + Object.freeze()。',
    color: '#003262', // Berkeley-blue
  },
};

export interface GateValidationResult {
  readonly gate: ProtocolGateCode;
  readonly passed: boolean;
  readonly timestamp: number;
  readonly evidencePath: string;
  readonly messageZh: string;
  readonly hashLock?: string;
}
