/**
 * ESG 數據單據總清單類型定義
 * ============================
 * 定義所有必要的數據單據、上傳規範、檢核規則
 */

export type ESGCategory = 'Environment' | 'Social' | 'Governance';
export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected' | 'missing';
export type Framework = 'GRI' | 'SASB' | 'TCFD' | 'CDP' | 'ESRS';
export type Urgency = 'critical' | 'high' | 'medium' | 'low';

/**
 * 單據定義
 */
export interface DocumentDefinition {
  id: string;
  name: string;
  nameEn: string;
  category: ESGCategory;
  subcategory: string;
  description: string;
  requiredBy: Framework[];
  acceptedFormats: string[];
  maxSizeMB: number;
  required: boolean;
  urgency: Urgency;
  validationRules: ValidationRule[];
  exampleUrl?: string;
  notes?: string;
}

/**
 * 驗證規則
 */
export interface ValidationRule {
  type: 'format' | 'size' | 'content' | 'naming' | 'completeness';
  description: string;
  validator: (file: File) => Promise<ValidationResult>;
}

/**
 * 驗證結果
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * 上傳的單據實例
 */
export interface DocumentInstance {
  id: string;
  documentDefId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  status: DocumentStatus;
  validationResult?: ValidationResult;
  metadata: {
    year?: number;
    quarter?: number;
    department?: string;
    version?: string;
    [key: string]: any;
  };
}

/**
 * 檢核清單
 */
export interface DocumentChecklist {
  companyId: string;
  reportYear: number;
  reportType: string;
  createdAt: Date;
  updatedAt: Date;
  documents: DocumentInstance[];
  summary: ChecklistSummary;
}

/**
 * 檢核摘要
 */
export interface ChecklistSummary {
  totalRequired: number;
  uploaded: number;
  verified: number;
  pending: number;
  missing: number;
  rejected: number;
  completeness: number; // 0-100%
  readyForReport: boolean;
  criticalIssues: string[];
  warnings: string[];
}

/**
 * 上傳請求
 */
export interface DocumentUploadRequest {
  documentDefId: string;
  file: File;
  metadata: {
    year: number;
    quarter?: number;
    department?: string;
    notes?: string;
  };
}

/**
 * 批次檢核結果
 */
export interface BatchValidationResult {
  totalDocuments: number;
  validDocuments: number;
  invalidDocuments: number;
  results: Map<string, ValidationResult>;
  overallScore: number;
  canProceed: boolean;
}
