// src/core/rectification/types.ts

export type EntropyLevel = 'ZERO' | 'LOW' | 'HIGH' | 'CRITICAL';
export type HealingStrategy = 'PASS_THROUGH' | 'GAP_FILLING' | 'ROLLBACK' | 'ALERT_ONLY';

export interface PurifiedArtifact<T> {
  data: T;
  originalData: T;
  entropy: EntropyLevel;
  strategyUsed: HealingStrategy;
  witnessSignature: string; // "FORGE-{timestamp}-{strategy}"
}
