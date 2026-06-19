/**
 * 🏛️ Omni ESG Core — 5T Architecture Foundation
 * 
 * 核心哲學：真 (Truth) 與 信 (Trust) 的數據契約
 * 所有的資料流都必須遵循此合約，確保來源與不可篡改性。
 */

export interface IComponentCore<T> {
    /** 模組或實體的唯一識別碼 */
    readonly uuid: string;

    /** 資料版本控制，例如 "1.0.0" */
    readonly version: string;

    /** 建立或最後更新的 UNIX Timestamp */
    readonly timestamp: number;

    /** 證據朔源屬性 */
    readonly evidence: {
        origin_id: string;      // 來源識別碼 (例如：Sensor ID, User ID, 或 API)
        origin_hash: string;    // 上傳或建立時的 SHA-256 Hash
        extraction_method: string; // 提取方式 (例如："manual", "api", "iot")
    };

    /** 生命週期事件追蹤紀錄 */
    lifecycle_events: Array<{
        status: string;
        timestamp: number;
        actor: string;
        signature?: string;
    }>;

    /** 實際的業務資料承載 */
    data: T;

    /** 是否已經鎖定 (Freeze) 且不可篡改 */
    isFrozen: boolean;
}

/** 5T 維度枚舉 */
export type T5TDimension =
    | "Tangible"
    | "Traceable"
    | "Trackable"
    | "Transparent"
    | "Trustworthy";

/** 數據來源提取方式 */
export type ExtractionMethod =
    | "OCR"
    | "IoT"
    | "Manual"
    | "Agent"
    | "API"
    | "SmartContract";

/** 證據朔源詳細介面 */
export interface IEvidenceTraceable {
    readonly origin_id: string;
    readonly origin_hash: string;
    readonly extraction_method: ExtractionMethod;
    readonly source_origin: string;
    readonly extraction_timestamp: number;
    readonly quality_score: number;
    readonly metadata: Record<string, unknown>;
}
