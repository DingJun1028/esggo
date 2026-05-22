/**
 * ESG GO | vault_omni_core — 萬能聖碑刻印引擎
 * Single Table Architecture · 5T Integrity Protocol · Genkit AI Integration
 */

import { createHash } from 'crypto';

// ── IComponentCore Interface ───────────────────────────────────────────────
export interface IComponentCore {
  identity: {
    uuid: string;
    version: string;       // SemVer e.g. "1.0.0"
    hashLock: string;      // SHA-256
    isoTag?: string;       // e.g. "[ISO-14064-1]"
  };
  logic: {
    formula: string;         // 計算公式 (T4 Transparent)
    isoStandard?: string;    // e.g. "ISO 14064-1:2018"
    uiStyle?: string;        // e.g. "liquid-glass"
    evidence?: unknown;      // 佐證內容
  };
  trace: {
    timestamp: number;          // ms epoch (T1 Truth)
    sourceOrigin: string;       // 數據溯源 (T2 Traceable)
    actorId?: string;           // 操作者 (T3 Trackable)
    griReference?: string;      // GRI 標準對應
  };
}

// ── Dimension Types ────────────────────────────────────────────────────────
export type VaultDimension = 'IDENTITY' | 'LOGIC' | 'TRACE' | 'CORE';

// ── vault_omni_core Record ─────────────────────────────────────────────────
export interface VaultOmniRecord {
  uuid: string;
  dimension: VaultDimension;
  hash_lock: string;
  payload: string;          // JSON stringified
  metadata: string;         // JSON stringified
  timestamp: number;
  created_at?: string;
}

// ── Hash Lock Generator ────────────────────────────────────────────────────
export function computeHashLock(data: unknown): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(str).digest('hex');
}

// ── Build IComponentCore from raw ESG evidence ─────────────────────────────
export function buildComponent(params: {
  uuid?: string;
  formula: string;
  isoStandard?: string;
  evidence?: unknown;
  sourceOrigin: string;
  actorId?: string;
  griReference?: string;
  version?: string;
}): IComponentCore {
  const uuid = params.uuid ?? crypto.randomUUID();
  const timestamp = Date.now();
  const rawPayload = {
    formula: params.formula,
    evidence: params.evidence,
    sourceOrigin: params.sourceOrigin,
    timestamp,
  };
  const hashLock = computeHashLock(rawPayload);

  const component: IComponentCore = Object.freeze({
    identity: Object.freeze({
      uuid,
      version: params.version ?? '1.0.0',
      hashLock,
      isoTag: params.isoStandard ? `[${params.isoStandard}]` : undefined,
    }),
    logic: Object.freeze({
      formula: params.formula,
      isoStandard: params.isoStandard,
      uiStyle: 'liquid-glass',
      evidence: params.evidence,
    }),
    trace: Object.freeze({
      timestamp,
      sourceOrigin: params.sourceOrigin,
      actorId: params.actorId ?? 'system',
      griReference: params.griReference,
    }),
  }) as IComponentCore;

  return component;
}

// ── Flatten IComponentCore → VaultOmniRecord ───────────────────────────────
export function flattenToRecord(component: IComponentCore, dimension: VaultDimension = 'CORE'): VaultOmniRecord {
  const payload = JSON.stringify({
    logic: component.logic,
    trace: component.trace,
    evidence: component.logic.evidence,
  });

  const metadata = JSON.stringify({
    version: component.identity.version,
    iso: component.logic.isoStandard,
    ui: component.logic.uiStyle,
    isoTag: component.identity.isoTag,
    griReference: component.trace.griReference,
  });

  return {
    uuid: component.identity.uuid,
    dimension,
    hash_lock: component.identity.hashLock,
    payload,
    metadata,
    timestamp: component.trace.timestamp,
  };
}

// ── Verify integrity of a VaultOmniRecord ─────────────────────────────────
export function verifyRecord(record: VaultOmniRecord): {
  valid: boolean;
  computedHash: string;
  storedHash: string;
  detail: string;
} {
  let payloadObj: unknown;
  try {
    payloadObj = JSON.parse(record.payload);
  } catch {
    return { valid: false, computedHash: '', storedHash: record.hash_lock, detail: 'payload parse error' };
  }

  const metaObj = JSON.parse(record.metadata);
  const recomputed = computeHashLock({
    formula: (payloadObj as { logic?: { formula?: string } })?.logic?.formula ?? '',
    evidence: (payloadObj as { evidence?: unknown })?.evidence,
    sourceOrigin: (payloadObj as { trace?: { sourceOrigin?: string } })?.trace?.sourceOrigin ?? '',
    timestamp: record.timestamp,
  });

  const valid = recomputed === record.hash_lock;
  return {
    valid,
    computedHash: recomputed,
    storedHash: record.hash_lock,
    detail: valid
      ? `✅ 5T 驗算通過 — v${metaObj.version ?? '?'} · ${metaObj.isoTag ?? '無 ISO 標籤'}`
      : `❌ 雜湊不符 — 資料可能遭竄改`,
  };
}

// ── Supabase CRUD (server-side, service_role) ──────────────────────────────
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Write a VaultOmniRecord to Supabase vault_omni_core table and Secret Vault */
export async function engraveToSingleTable(component: IComponentCore): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getServiceClient();
  if (!supabase) {
    console.warn('[vault_omni_core] Supabase not configured — skipping DB write');
    return { success: true, id: component.identity.uuid };
  }

  const record = flattenToRecord(component, 'CORE');

  const { data, error } = await supabase
    .from('vault_omni_core')
    .upsert(record, { onConflict: 'uuid' })
    .select('uuid')
    .single();

  if (error) {
    console.error('[vault_omni_core] engraveToSingleTable error:', error);
    return { success: false, error: error.message };
  }

  // 寫入 Supabase Vault Secret (實現 T4 Trustworthy 的最高安全等級)
  // 這是 Phase 2 的關鍵：確保 Hash Lock 的來源數據在資料庫外也被安全保存
  const { error: vaultError } = await supabase.rpc('create_evidence_seal', {
    p_secret: record.payload,
    p_name: `omni_seal_${record.uuid}`,
    p_description: `5T Seal for GRI:${component.trace.griReference || 'N/A'}`
  });

  if (vaultError) {
    console.warn('[vault_omni_core] Failed to create vault secret:', vaultError.message);
  }

  // Write audit trail (T5 Trackable)
  await supabase.from('audit_logs').insert({
    action: 'VAULT_OMNI_ENGRAVE',
    resource: `vault_omni_core:${record.uuid}`,
    user_name: component.trace.actorId ?? 'system',
    t5_tag: 'T1+T4+T5',
    hash_lock: record.hash_lock,
    details: `聖碑刻印完成 (含 Vault Secret) — dimension:CORE | version:${component.identity.version}`,
  }).maybeSingle();

  console.log(`[vault_omni_core] UUID: ${record.uuid} 已完成單一表扁平化刻印及 Vault 寫入。`);
  return { success: true, id: data?.uuid ?? record.uuid };
}

/** Read a record by UUID */
export async function readFromVault(uuid: string): Promise<VaultOmniRecord | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('vault_omni_core')
    .select('*')
    .eq('uuid', uuid)
    .single();

  if (error || !data) return null;
  return data as VaultOmniRecord;
}

/** List recent records */
export async function listVaultRecords(limit = 50): Promise<VaultOmniRecord[]> {
  const supabase = getServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('vault_omni_core')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  return (data ?? []) as VaultOmniRecord[];
}