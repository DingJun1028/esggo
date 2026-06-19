// src/core/knowledge/types.ts

export type EventType = 'IMMUNITY_HEAL' | 'AUTOMATION_TRIGGER' | 'SYSTEM_DRIFT';

export interface EvolutionLog {
  id: string;
  timestamp: number;
  type: EventType;

  // 觸發源 (例如: "Carbon-Cell-01")
  sourceId: string;
  sourceLabel: string;

  // 核心數據
  payload: {
    entropyLevel?: string;      // 用於免疫事件
    strategyUsed?: string;      // 用於免疫事件 (GAP_FILLING, ROLLBACK)
    provider?: string;          // 用於自動化事件 (Make, Boost.space)
    executionTimeMs?: number;   // 執行耗時
    aiConfidence?: number;      // AI 置信度
  };

  // 語義標籤 (用於未來的 RAG 檢索)
  tags: string[]; // ["#熵減", "#數據修復", "#自動化成功"]
}