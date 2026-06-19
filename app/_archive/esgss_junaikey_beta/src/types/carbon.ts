/**
 * 💡 核心定義：Carbon Asset Identity
 * --------------------------------------------------
 * 定義組件核心介面與炭資產標準結構
 */

export interface IComponentCore {
  id: string; // UUID
  createdAt: number;
  version: string;
}

export type CarbonAssetStatus =
  | 'STATUS_UPLOADING'
  | 'STATUS_OCR_PROCESSING'
  | 'STATUS_VERIFIED'
  | 'STATUS_MINTED'
  | 'STATUS_FROZEN';

export interface ICarbonAsset extends IComponentCore {
  // 🟢 Traceable (來源可追溯)
  sourceOrigin: {
    fileName: string;
    fileHash: string; // SHA-256 of raw file
    uploadTimestamp: number;
    previewUrl?: string; // [NEW] Blob URL for UI Preview
  };

  // 🟠 Calculable (數值可運算)
  data: {
    rawText?: string;
    kwh?: number;
    co2e?: number;
    periodStart?: string;
    periodEnd?: string;
    contextSnippet?: string; // [NEW] Contextual text around the extracted number
    calculationFormula?: string; // [NEW] The exact formula used
    verification?: {
      methodology: string; // e.g. "ISO-14064-1:2018"
      evidenceLocation: string; // e.g. "Page 1, Row 4"
      ocrConfidence: number; // e.g. 0.98
    };
  };

  // 🔵 Trackable (狀態可追蹤)
  status: CarbonAssetStatus;
  auditLog: {
    action: string;
    timestamp: number;
    actor: string;
  }[];

  // 🔴 Immutable (不可篡改)
  evidenceHash?: string; // Final seal hash
  sealTimestamp?: number;
}
