/**
 * ESG GO | 🏛️ 終始矩陣：語義治理規範 (Semantic Governance Protocol)
 * v1.1 | 英標為骨 (American English Foundation)，繁博為魂 (Traditional Chinese Soul)
 * 
 * This matrix maps the 5T Integrity Gates against the full lifecycle of ESG data,
 * ensuring compliance with BS 8001:2017 principles and Berkeley 5T standards.
 */

import { T5Status } from './core.types';

/**
 * @type MatrixLifecycleStage
 * @description The evolutionary trajectory of an ESG component.
 * @note 繁博註釋：紀錄組件在混沌中開闢秩序的生命週期。
 */
export type MatrixLifecycleStage = 
  | 'ORIGIN'      // 源起：數據之起始 (Source Foundation)
  | 'EXTRACTION'  // 提取：煉金過程 (Semantic Harvesting)
  | 'VERIFICATION'// 驗證：真理辯證 (Gate Validation)
  | 'SEALING'     // 封印：誠信刻印 (Immutable Locking)
  | 'REPORTING'   // 發布：光影流變 (Manifestation)
  | 'ARCHIVING';  // 歸檔：永恆記憶 (Eternal Resting)

/**
 * @type MatrixGateStatus
 * @description The current state of an integrity gate.
 */
export type MatrixGateStatus = 'PASS' | 'FAIL' | 'PENDING' | 'LOCKED';

/**
 * @interface MatrixCell
 * @description A single node in the Semantic Governance Matrix.
 */
export interface MatrixCell {
  /** @property status 門徑狀態 */
  status: MatrixGateStatus;
  /** @property timestamp 刻印時間戳 */
  timestamp: number;
  /** @property actorId 行動者識別 */
  actorId: string;
  /** @property hashLock 數據真理哈希鎖 (T5 Trustworthy) */
  hashLock?: string;
  /** @property evolutionNote 演化歷史紀錄：運用中文深度描述系統的複雜演進 */
  evolutionNote?: string;
}

/**
 * @interface EndToEndMatrix
 * @description 終始矩陣：語義治理結構之基石。
 */
export interface EndToEndMatrix {
  /** @property projectId 專案識別號 (English Standardized) */
  projectId: string;
  /** @property version 語義化版本 (Holy Code Contract) */
  version: string;
  /** @property grid 矩陣網格：英標為緯，繁博為經 */
  grid: Record<MatrixLifecycleStage, Record<T5Status, MatrixCell>>;
  /** @property complianceScore 誠信得分：熵減秩序值 */
  complianceScore: number;
  /** @property lastAudit 最終溯源稽核時間 */
  lastAudit: number;
}

/**
 * Request/Response Types for Bi-directional Safety
 */
export interface MatrixQueryRequest {
  projectId: string;
  includeLogs?: boolean;
}

export interface MatrixQueryResponse {
  /** @property matrix 終始矩陣核心 */
  matrix: EndToEndMatrix;
  /** @property auditTrail 溯源日誌：包含「源起」、「流轉路徑」與「哈希鎖定狀態」的解釋 */
  auditTrail: Array<{
    stage: MatrixLifecycleStage;
    gate: T5Status;
    action: string;
    descriptionZh: string; // 繁博說明
    timestamp: number;
  }>;
}
