// 更新 IComponentCore 介面
// lib/core-types.ts

export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  formula: string;           // 必填
  impact_metric: string;       // 必填
  evidence: IEvidence[];
}

// 更新 IEvidence 介面
interface IEvidence {
  id: string;
  source_origin: string;
  iso_standard_ref: string;
  hash_value: string;
  lifecycle_path: string[];
  formula_ref?: string;      // 新增公式引用
  formula: string;           // 必填
  impact_metric: string;     // 必填
  lifecycle_hooks?: any[];
}