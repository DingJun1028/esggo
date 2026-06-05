import { z } from 'zod';

/**
 * 5T 協議核心元件介面 (所有核心數據必須繼承此介面)
 */
export interface IEvidenceMap {
  [key: string]: {
    type: 'document' | 'record' | 'image';
    url: string;
    hash?: string;
  };
}

export interface IComponentCore {
  readonly uuid: string;          // [可溯源] 唯一識別碼
  readonly timestamp: number;     // [可追蹤] Unix 毫秒戳
  readonly source_origin: string; // [可溯源] 資料來源 (e.g., 'ERP', 'Survey', 'Manual')
  readonly status: "Draft" | "Trustworthy" | "Archived"; // [狀態]
  readonly hash_lock?: string;    // [不可篡改] SHA-256 封印
  evidence: IEvidenceMap;         // [可驗證] 關聯的佐證文件結構
}

/**
 * 萬能回報格式 (Nexus API 統一回傳結構)
 */
export const NexusResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.object({
    timestamp: z.number(),
    trustScore: z.number().min(0).max(100), // 系統當前信任指數
    transactionId: z.string().uuid(),
  })
});
export type NexusResponse = z.infer<typeof NexusResponseSchema>;
