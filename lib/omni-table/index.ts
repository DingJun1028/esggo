/**
 * OmniTable Integration — Barrel Export
 * ═══════════════════════════════════
 * Re-exports all OmniTable types, client, and hooks
 */

export { OmniTableClient, OmniTableError, getOmniTableServerClient } from './client';
export { useOmniTable } from './useOmniTable';

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
