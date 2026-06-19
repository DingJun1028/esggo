/**
 * 數據來源與可驗證性類型定義
 * --------------------------------------------------
 * [核心原則] 真善美 - Truth, Goodness, Beauty
 * [協議] 4+1 Protocol (Traceable, Trackable, Calculable, Immutable)
 */

export type DataSourceType = 'realtime' | 'calculated' | 'demo' | 'certified' | 'user_input';
export type ConfidenceLevel = 'verified' | 'estimated' | 'demo' | 'unverified';

/**
 * 數據來源標註
 * 確保所有數據都可溯源、可追蹤、可驗證
 */
export interface DataSource {
  // 可溯源 (Traceable)
  sourceType: DataSourceType;
  sourceOrigin: string; // 數據來源描述

  // 可追蹤 (Trackable)
  timestamp: number;
  lastUpdated: number;
  updateFrequency?: string; // 例如: '每日', '實時', '手動'

  // 可驗證 (Verifiable)
  verificationMethod?: string;
  certificationNumber?: string;
  certifyingBody?: string;
  certificateUrl?: string;
  expiryDate?: number;

  // 透明化 (Transparent)
  calculationMethod?: string;
  rawDataReference?: string;
  disclaimer?: string;

  // 不可篡改 (Immutable)
  dataHash?: string;
  blockchainAnchor?: string;
}

/**
 * 可驗證指標
 * 將數值與其來源綁定
 */
export interface VerifiableMetric<T = number | string> {
  value: T;
  unit?: string;
  dataSource: DataSource;
  confidenceLevel: ConfidenceLevel;
  displayWarning?: boolean; // 是否顯示警告標籤
}

/**
 * 認證資訊（真實認證）
 */
export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  certificationNumber: string;
  issueDate: number;
  expiryDate: number;
  certificateUrl?: string;
  scope: string;
  status: 'valid' | 'expired' | 'pending';
  verificationUrl?: string; // 第三方驗證連結
}

/**
 * 成就徽章（平台內部，非官方認證）
 */
export interface AchievementBadge {
  id: string;
  name: string;
  recipientUuid: string;
  issueDate: string;
  hashLock: string;
  issuingAuthority: string;
  disclaimer: string; // 必須明確說明非官方認證
  officialCertification: Certification | null;
}

/**
 * ESG 評分（可驗證）
 */
export interface VerifiableESGScore {
  overall: VerifiableMetric<string>; // 例如 "A+", "B", etc.
  environmental: VerifiableMetric<number>;
  social: VerifiableMetric<number>;
  governance: VerifiableMetric<number>;
  lastAssessmentDate: number;
  assessmentBody?: string; // 評分機構
  assessmentStandard?: string; // 評分標準 (如 MSCI, Sustainalytics)
}

/**
 * 創建示範數據來源
 */
export function createDemoDataSource(description: string): DataSource {
  return {
    sourceType: 'demo',
    sourceOrigin: description,
    timestamp: Date.now(),
    lastUpdated: Date.now(),
    disclaimer: '此為示範數據，僅供展示系統功能。實際使用時需替換為真實數據。',
  };
}

/**
 * 創建計算數據來源
 */
export function createCalculatedDataSource(
  calculationMethod: string,
  rawDataRef: string
): DataSource {
  return {
    sourceType: 'calculated',
    sourceOrigin: '系統計算',
    timestamp: Date.now(),
    lastUpdated: Date.now(),
    calculationMethod,
    rawDataReference: rawDataRef,
  };
}

/**
 * 創建認證數據來源
 */
export function createCertifiedDataSource(
  certifyingBody: string,
  certNumber: string,
  certUrl?: string
): DataSource {
  return {
    sourceType: 'certified',
    sourceOrigin: `${certifyingBody} 認證`,
    timestamp: Date.now(),
    lastUpdated: Date.now(),
    certifyingBody,
    certificationNumber: certNumber,
    certificateUrl: certUrl,
  };
}
