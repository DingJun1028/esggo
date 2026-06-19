/**
 * 🏛️ Omni Core Types - UUID Development Framework
 * Version: v1.1.0-Universe
 * 
 * 這是 InfoOne 平台所有組件的單一型別真理來源。
 * 貫徹「服務即教學，知識即資產」與 5T 協議。
 */

export type ReportStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Archived';

/**
 * 🧬 永續元件心核 (IComponentCore)
 * 所有動態生成的報告組件底層皆須實作此介面以支持 UUID 溯源性。
 */
export interface IComponentCore {
    readonly uuid: string;        // 永續永憶主體分發的唯一識別碼 (SSoT)
    readonly version: string;     // 語義化版本控制 (e.g. "1.1.0")
    readonly timestamp: number;   // 刻印時間戳 (Epoch Time)
    readonly domain: string;      // 所屬服務域 (e.g. "Data Forge")
    evidence?: string[];          // [5T: Traceable] 證據佐證庫連結 (Evidence Vault URLs)
}

/**
 * 📊 報告元數據 (Report Metadata)
 */
export interface IReportMetadata extends IComponentCore {
    name: string;
    description: string;
    status: ReportStatus;
    ownerId: string;
    tags: string[];
}

/**
 * 5T 協議狀態 (5T Protocol Alignment)
 */
export interface IFiveTStatus {
    tangible: boolean;    // 可感知 (UI/UX)
    traceable: boolean;   // 可溯源 (Source Origin)
    trackable: boolean;   // 可追蹤 (Lifecycle Logs)
    transparent: boolean; // 可驗算 (Logic/Formula)
    trustworthy: boolean; // 不可篡改 (Hash Lock)
}
