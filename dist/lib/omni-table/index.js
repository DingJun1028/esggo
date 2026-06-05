/**
 * OmniTable Integration — Barrel Export
 * ═══════════════════════════════════
 * Re-exports all OmniTable types, client, and hooks
 */
export { OmniTableClient, OmniTableError, getOmniTableServerClient } from './client';
export { useOmniTable } from './useOmniTable';
// ── Domain-specific ESG hooks ──────────────────────────────────────────────────
export { useEsgRiskAudit, useComplianceEngine, useGovernanceAudit, useSupplierIntegrity, useVaultOmni, useSwarmConsensus, useNotesTasks, useDailyIntelligence, OMNITABLE_ENV_KEYS, } from './useEsgModules';
//# sourceMappingURL=index.js.map