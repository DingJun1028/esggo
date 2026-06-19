/**
 * 🏛️ Omni ESG Core — 5T Architecture Foundation
 * 
 * 核心哲學：真 (Truth) 與 信 (Trust) 的數據契約
 * 所有的資料流都必須遵循此合約，確保來源與不可篡改性。
 */

import { IComponentCore as IBaseCore } from "@/core/IComponentCore";

export interface IComponentCore<T = any> extends IBaseCore<T> {}

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
