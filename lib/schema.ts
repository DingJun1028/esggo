/**
 * ESG GO | 全端雙向 TypeScript 型別定義 (Shared Schema)
 * 遵守英標繁博 (British Standard) 之精密數據結構
 */

export type ESGModule = 'Environment' | 'Social' | 'Governance' | 'Innovation';
export type VerificationStatus = 'Pending' | 'Sealed' | 'Verified' | 'Flagged';

export interface ESGDataPoint {
  id: string;
  code: string; // e.g., GRI 401-1
  module: ESGModule;
  label: string;
  value: number | string;
  unit: string;
  confidence: number; // 0-1
  status: VerificationStatus;
  timestamp: string;
  evidenceId: string;
  tags: string[];
}

export interface StakeholderEngagement {
  id: string;
  group: 'Employees' | 'Investors' | 'Suppliers' | 'Customers' | 'Government' | 'Community';
  frequency: 'Daily' | 'Monthly' | 'Quarterly' | 'Annually';
  concernLevel: number; // 1-10
  keyIssues: string[];
  sentimentScore: number; // -1 to 1
}

export interface AuditRecord {
  txnId: string;
  timestamp: string;
  actor: string;
  action: string;
  hash: string;
  status: VerificationStatus;
}

export interface FinanceMetric {
  id: string;
  label: string;
  amount: number;
  currency: string;
  category: 'Revenue' | 'Tax' | 'Investment' | 'Fine';
  jurisdiction: string;
}