/**
 * OmniTable Integration — Barrel Export
 * ═══════════════════════════════════
 * Re-exports all OmniTable types, client, and hooks
 */

export { OmniTableClient, OmniTableError, getOmniTableServerClient } from './client';
export { useOmniTable } from './useOmniTable';

// ── Domain-specific ESG hooks ──────────────────────────────────────────────────
export {
  useEsgRiskAudit,
  useComplianceEngine,
  useGovernanceAudit,
  useSupplierIntegrity,
  useVaultOmni,
  useSwarmConsensus,
  useNotesTasks,
  useDailyIntelligence,
  OMNITABLE_ENV_KEYS,
} from './useEsgModules';

export type {
  ModuleRecord,
  OmniModuleKey,
  EsgRiskRecord,
  ComplianceRecord,
  GovernanceRecord,
  SupplierRecord,
  VaultRecord,
  SwarmRecord,
  NoteTaskRecord,
  IntelRecord,
} from './useEsgModules';

export type {
  OmniTableSpace,
  OmniTableNode,
  OmniTableField,
  OmniTableView,
  OmniTableRecord,
  OmniTableAttachment,
  OmniTableRecordsResponse,
  OmniTableResponse,
  GetRecordsParams,
  CreateRecordPayload,
  UpdateRecordPayload,
} from './client';
