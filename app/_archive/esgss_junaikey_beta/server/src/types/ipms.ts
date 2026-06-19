/**
 * 📋 影響力項目管理系統 (IPMS) 類型定義
 * --------------------------------------------------
 * 定義 ESG 項目的核心接口與生命週期狀態。
 */

export interface IImpactProject {
  id?: string;
  uuid: string;
  title: string;
  description?: string;
  lifecycle_state: 'TRACEABLE' | 'VERIFIED' | 'IMMUTABLE';

  // 影響力目標
  impact_goals: {
    current_value: number;
    target_value: number;
    target_metric: string; // e.g., "tCO2e Saved"
  };

  // 資源分配
  resources: {
    budget_allocated: number;
    budget_currency: string;
  };

  progress?: number;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export enum ProjectState {
  TRACEABLE = 'TRACEABLE',  // 初期追蹤
  VERIFIED = 'VERIFIED',    // 已驗證
  IMMUTABLE = 'IMMUTABLE'   // 不可篡改（封印）
}
