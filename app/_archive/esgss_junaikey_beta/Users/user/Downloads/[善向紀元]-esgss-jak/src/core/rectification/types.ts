// src/core/rectification/types.ts

export type EntropyLevel =
  | 'ZERO'      // 絕對秩序：數據完美，來源可信
  | 'LOW'       // 輕微擾動：數據存在但格式有誤，或趨勢微偏
  | 'HIGH'      // 高度混亂：數據缺失 (Null/Undefined)，或嚴重離群
  | 'CRITICAL'; // 系統崩潰：API 失敗，依賴斷裂

export type HealingStrategy =
  | 'PASS_THROUGH'     // 無需干預
  | 'FORMAT_FIX'       // 格式微調 (如：補齊小數位)
  | 'GAP_FILLING'      // 空缺填補 (使用 AI 預測或歷史平均)
  | 'ROLLBACK'         // 回滾至上一個穩定狀態 (Time Travel)
  | 'ISOLATION';       // 隔離節點 (防止錯誤擴散)

export interface PurifiedArtifact<T> {
  data: T;                   // 修復後的數據
  originalData: T | null;    // 原始數據 (保留案底)
  entropy: EntropyLevel;     // 偵測到的熵值
  strategyUsed: HealingStrategy; // 使用的修復手段
  confidence: number;        // 修復後的置信度 (0-100)
  witnessSignature: string;  // 邏輯證人簽名 (Audit Trail)
}