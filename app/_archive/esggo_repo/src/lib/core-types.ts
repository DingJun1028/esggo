// lib/core-types.ts
// ESG Go v8.5.1 - Core Data Interfaces

export interface IComponentCore {
  uuid: string;
  version: string;
  formula: string;
  impact_metric: string;
  status: string;
  hash_lock: string;
  evidence: IEvidence[];
}

export interface IEvidence {
  originCause: string;
  finalEffect: string;
  processTrace: string[];
  hash_lock: string;
  timestamp: number;
}

export type T5CoreComponents = IComponentCore;
export type T5Evidence = IEvidence;
// 原則參考CONFIG小心
export const T5_CORE_CONFIG = {
  requiredComponents: ['T5ProtocolCore', 'EvidenceRegistry', 'HealingServer'],
  validationRules: {
    core: ['uuid', 'hash_lock', 'status'],
    evidence: ['timestamp', 'hash_lock', 'originCause']
  }
};