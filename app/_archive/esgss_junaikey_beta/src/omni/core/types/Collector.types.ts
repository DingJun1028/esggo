import { Protocol5T } from './InfoOne.types.js';

/**
 * 奧秘採集來源類型
 */
export type OmniCollectionSource = 'document' | 'manual' | 'iot' | 'api';

/**
 * 奧秘採集任務狀態
 */
export type OmniCollectionStatus = 'pending' | 'processing' | 'verifying' | 'completed' | 'failed';

/**
 * 奧秘採集任務接口
 */
export interface IOmniCollectionTask {
    readonly id: string;
    readonly source: OmniCollectionSource;
    readonly status: OmniCollectionStatus;
    readonly timestamp: number;
    readonly metadata: {
        fileName?: string;
        fileType?: string;
        fileSize?: number;
        externalId?: string;
        [key: string]: any;
    };
    readonly resultId?: string;
}

/**
 * 奧秘採集結果接口 (LLM 結構化後的輸出)
 */
export interface IOmniCollectionResult {
    readonly id: string;
    readonly taskId: string;
    readonly rawContent: string;
    readonly structuredContent: string; // 經過 LLM 格式化清心後的段落
    readonly metrics: Array<{
        key: string;
        value: number | string;
        unit?: string;
        category: 'E' | 'S' | 'G';
        confidence: number;
    }>;
    readonly evidenceId?: string; // 關聯至 Evidence Vault
    readonly correlationScore: number; // [系統判別] 證明相連關聯程度高低 (0.0 to 1.0)
    readonly frameworks?: string[]; // 已識別的 ESG 框架 (GRI, SASB, etc.)
    readonly tags: Protocol5T[];
    readonly timestamp: number;
}

/**
 * 奧秘採集實時進度介面
 */
export interface IOmniCollectionProgress {
    readonly taskId: string;
    readonly stage: 'OCR_START' | 'AI_ANALYSIS' | 'EVIDENCE_GEN' | 'COMPLETED' | 'ERROR';
    readonly message: string;
    readonly percentage: number;
    readonly timestamp: number;
}
