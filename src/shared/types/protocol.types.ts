/**
 * ESG GO | 🏛️ 5T 誠信協議門 (The 5T Protocol: Data Governance Framework)
 * v2.1 | Ultimate Minimalist Alignment
 *
 * 5T 協議又稱為「真善美信通」
 * 英文命名（正確）：Tangible, Traceable, Trackable, Transparent, Trustworthy
 * 中文命名（正確）：真, 善, 美, 信, 通
 *
 * 對應關係：
 * T1 - Tangible (真)     - 可感知/具體化
 * T2 - Traceable (善)    - 可溯源/透明
 * T3 - Trackable (美)    - 可追蹤/可感知
 * T4 - Transparent (信)  - 可透明驗算/信賴
 * T5 - Trustworthy (通)  - 不可篡改/可傳遞
 */

import { I5TGovernance } from './core.types';

export type ProtocolGateCode = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export interface IProtocolGate {
  readonly code: ProtocolGateCode;
  readonly labelZh: string; // 繁博：真、善、美、信、通
  readonly propertyEn: keyof I5TGovernance;
  readonly titleZh: string;
  readonly descriptionEn: string;
  readonly color: string; // Minimalist Palette
}

/**
 * @const SACRED_GATES
 * @description 5T 協議門之創世定義 v2.1 - 極致簡約版。
 * 5T = 真善美信通 = Tangible · Traceable · Trackable · Transparent · Trustworthy
 */
export const SACRED_GATES: Record<ProtocolGateCode, IProtocolGate> = {
  T1: {
    code: 'T1',
    labelZh: '真',
    propertyEn: 'tangible',
    titleZh: '真 (Tangible)',
    descriptionEn: '可感知/具體化：將抽象的永續願景轉化為具體的指標成果與實作項目。',
    color: '#06B6D4', // Cyan-core
  },
  T2: {
    code: 'T2',
    labelZh: '善',
    propertyEn: 'traceable',
    titleZh: '善 (Traceable)',
    descriptionEn: '可溯源：鏈式日誌必須包含原始資料來源 (source_origin) 備註。',
    color: '#10B981', // Emerald-soul
  },
  T3: {
    code: 'T3',
    labelZh: '美',
    propertyEn: 'trackable',
    titleZh: '美 (Trackable)',
    descriptionEn: '可追蹤：利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。',
    color: '#219EBC', // Optimal-blue
  },
  T4: {
    code: 'T4',
    labelZh: '信',
    propertyEn: 'transparent',
    titleZh: '信 (Transparent)',
    descriptionEn: '可透明驗算：算法公式公開化，且必須通過「零幻覺驗證」。',
    color: '#FFB703', // Critical-amber (for awareness)
  },
  T5: {
    code: 'T5',
    labelZh: '通',
    propertyEn: 'trustworthy',
    titleZh: '通 (Trustworthy)',
    descriptionEn: '不可篡改：數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。',
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
