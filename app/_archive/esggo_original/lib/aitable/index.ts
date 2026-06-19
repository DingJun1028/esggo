/**
 * AITable Integration — Barrel Export
 * ═══════════════════════════════════
 * Re-exports all AITable types, client, and hooks
 */

export { AITableClient, AITableError, getAITableServerClient } from './client';
export { useAITable } from './useAITable';

export type {
  AITableSpace,
  AITableNode,
  AITableField,
  AITableView,
  AITableRecord,
  AITableAttachment,
  AITableRecordsResponse,
  AITableResponse,
  GetRecordsParams,
  CreateRecordPayload,
  UpdateRecordPayload,
} from './client';
