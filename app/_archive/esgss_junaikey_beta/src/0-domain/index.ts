/**
 * 💡 0-Domain Layer: Core Contracts (核心契約層)
 * --------------------------------------------------
 * 統一匯出所有核心介面與類型定義
 * [版本] Sentient v7.0.0
 * [協議] 5T Sentinel Protocol
 */

// Re-export from centralized types
export * from './contracts/Omni-component-core.types';

export type {
  // Core Interfaces
  IComponentCore,
  IEvidenceMap, // Fixed: was IEvidence
  // I4TCompliant, // Deprecated: Use IEvidenceMap from esgss_schema
  IImpactAsset,
  ImpactProof,
  ImpactNexusCard,
  IAuthKey,
  IImpactLedger,

  // Merit & Protocol Types
  IMeritProfile10,
  MeridianFlow,
  FiveTProtocol,
  LifecycleHook,

  // Validation Types
  FiveTValidationResult,
  FiveTValidationReport,

  // Factory Types
  ComponentCoreFactory,
  EvidenceGenerator,
} from '../types/core';

// Domain Engines (will be populated as files are migrated)
// export { OmniKeyCore } from './engines/OmniKey';
// export { OmniBase } from './bases/OmniBase';
export * from './engines/Omnicrystal/Omnicrystal';
export * from './contracts/IOmnicrystal';
export * from './engines/SyncDomain';
export * from './contracts/ISyncDomain';
export * from './utils/withOmniProxy';
