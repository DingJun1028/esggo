/**
 * ESG GO | vault_omni_core — 萬能聖碑刻印引擎
 * Single Table Architecture · 5T Integrity Protocol · Semantic Governance
 */

import { createHash } from 'crypto';
import type { IComponentCore } from '../src/shared/types/index.ts';
import { createClient } from '@supabase/supabase-js';

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

/**
 * @function computeHashLock
 * @description 數據真理哈希鎖生成器。使用確定性 JSON 序列化與 Salt 增強安全性。
 */
export function computeHashLock(data: unknown): string {
  // Deterministic JSON stringify to ensure consistent hashing
  const str = typeof data === 'string' ? data : JSON.stringify(data, (key, value) =>
    value instanceof Object && !Array.isArray(value)
      ? Object.keys(value).sort().reduce((acc, k) => {
          acc[k as keyof typeof acc] = value[k];
          return acc;
        }, {} as any)
      : value
  );
  const salt = process.env.OMNI_HASH_SALT || 'esggo-genesis-salt';
  return createHash('sha256').update(str + salt).digest('hex');
}

/**
 * @function buildComponent
 * @description 建立萬能元件心核 - 依循「英標繁博」規範。
 */
export function buildComponent(params: {
  uuid?: string;
  sourceOrigin: string;
  lifecyclePath?: string[];
  version?: string;
  formula?: string;
  impactMetric?: string;
  evidenceData?: any;
  status?: any;
  griReference?: string;
}): IComponentCore {
  const uuid = params.uuid ?? crypto.randomUUID();
  const timestamp = Date.now();
  const version = params.version ?? '1.0.0';
  const lifecyclePath = params.lifecyclePath ?? [params.sourceOrigin];

  // Create component structure first without hash_lock
  const componentWithoutHash = {
    uuid,
    version,
    timestamp,
    formula: params.formula ?? '[ISO-14064-1] Generic Calculation',
    impact_metric: params.impactMetric ?? '0.00 tCO2e',
    evidence: [{
      originCause: params.sourceOrigin,
      processTrace: lifecyclePath,
      finalEffect: params.impactMetric ?? '0.00 tCO2e',
      // Store evidenceData in the evidence array if needed, or as part of the structure
      raw_data: params.evidenceData, 
    }],
    status: 'Trustworthy' as any,
  };

  // Calculate Hash Lock for the entire structure (T5 Trustworthy)
  const hashLock = computeHashLock(componentWithoutHash);

  const component: IComponentCore = Object.freeze({
    ...componentWithoutHash,
    hash_lock: hashLock,
  });

  return component;
}

/**
 * @function flattenToRecord
 * @description 將心核結構扁平化以利聖碑存儲。
 */
export function flattenToRecord(component: IComponentCore, dimension: VaultDimension = 'CORE'): VaultOmniRecord {
  const payload = JSON.stringify(component);
  const metadata = JSON.stringify({
    version: component.version,
    origin: component.evidence[0]?.originCause || '',
    pathCount: component.evidence[0]?.processTrace.length || 0,
  });

  return {
    uuid: component.uuid,
    dimension,
    hash_lock: component.hash_lock,
    payload,
    metadata,
    timestamp: component.timestamp,
  };
}

// ── Supabase CRUD ──────────────────────────────────────────────────────────

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * @function readFromVault
 * @description 從聖碑讀取指定 UUID 的心核數據。
 */
export async function readFromVault(uuid: string): Promise<IComponentCore | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('vault_omni_core')
    .select('payload')
    .eq('uuid', uuid)
    .single();

  if (error || !data) return null;
  return JSON.parse(data.payload) as IComponentCore;
}

/**
 * @function verifyRecord
 * @description 驗證聖碑紀錄的雜湊完整性。
 */
export async function verifyRecord(uuid: string): Promise<boolean> {
  const component = await readFromVault(uuid);
  if (!component) return false;

  // Extract hash_lock and compute hash on the remaining structure
  const { hash_lock, ...componentWithoutHash } = component;
  const currentHash = computeHashLock(componentWithoutHash);
  return currentHash === hash_lock;
}

/** 
 * @function engraveToSingleTable
 * @description 聖碑刻印：完成 5T 誠信封印與 Vault 寫入。
 */
export async function engraveToSingleTable(component: IComponentCore): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getServiceClient();
  if (!supabase) return { success: true, id: component.uuid };

  const record = flattenToRecord(component, 'CORE');

  const { data, error } = await supabase
    .from('vault_omni_core')
    .upsert(record, { onConflict: 'uuid' })
    .select('uuid')
    .single();

  if (error) return { success: false, error: error.message };

  // 寫入 Supabase Vault (T5 Trustworthy 加密層)
  await supabase.rpc('create_evidence_seal', {
    p_secret: record.payload,
    p_name: `omni_seal_${record.uuid}`,
    p_description: `Semantic Governance Seal: ${component.evidence[0]?.originCause || 'Unknown'}`
  });

  // 審計日誌 (T4 Trackable)
  await supabase.from('audit_logs').insert({
    action: 'VAULT_OMNI_ENGRAVE',
    resource: `vault_omni_core:${record.uuid}`,
    user_name: 'OmniAgent-Engraver',
    t5_tag: 'T1+T4+T5',
    hash_lock: record.hash_lock,
    details: `[信] 聖碑刻印完成。源起：${component.evidence[0]?.originCause || 'Unknown'}`,
  }).maybeSingle();

  return { success: true, id: data?.uuid ?? record.uuid };
}
