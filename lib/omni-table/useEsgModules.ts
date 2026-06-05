'use client';

/**
 * OmniBlueTable 領域 Hooks — ESG 核心模組集合
 * ═══════════════════════════════════════════
 * 每個 hook 封裝對應 Datasheet 的 CRUD + 業務邏輯
 * 5T Protocol: Traceable · Transparent · Tangible · Trackable · Trustworthy
 *
 * 模組清單:
 *   useNotesTasks          → 萬能筆記 - 任務管理
 *   useDailyIntelligence   → 商情中心 - 每日情資
 *   useEsgRiskAudit        → ESG 風險稽核庫
 *   useComplianceEngine    → 合規引擎 - 掃描結果
 *   useGovernanceAudit     → 治理稽核 - 事件日誌
 *   useSupplierIntegrity   → 供應鏈誠信評估
 *   useVaultOmni           → Vault Omni 封存索引
 *   useSwarmConsensus      → OmniSwarm 蜂群共識
 */

import { useState, useCallback, useEffect } from 'react';

// ─── Env Key Mappings ──────────────────────────────────────────────────────────

export const OMNITABLE_ENV_KEYS = {
  notes_tasks:         'OMNITABLE_TASKS_DATASHEET_ID',
  daily_intelligence:  'OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID',
  esg_risk:            'OMNITABLE_ESG_RISK_DATASHEET_ID',
  compliance:          'OMNITABLE_COMPLIANCE_DATASHEET_ID',
  governance:          'OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID',
  supplier:            'OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID',
  vault:               'OMNITABLE_VAULT_OMNI_DATASHEET_ID',
  swarm:               'OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID',
} as const;

export type OmniModuleKey = keyof typeof OMNITABLE_ENV_KEYS;

// ─── Base Hook Factory ─────────────────────────────────────────────────────────

interface UseModuleOptions {
  pageSize?: number;
  autoLoad?: boolean;
  viewId?: string;
}

export interface ModuleRecord {
  recordId: string;
  fields: Record<string, unknown>;
  createdAt?: number;
  updatedAt?: number;
}

interface UseModuleReturn<T extends ModuleRecord = ModuleRecord> {
  records: T[];
  loading: boolean;
  error: string | null;
  total: number;
  refresh: () => Promise<void>;
  createRecord: (fields: Partial<Omit<T, 'recordId' | 'createdAt' | 'updatedAt'>>) => Promise<T>;
  updateRecord: (recordId: string, fields: Partial<Omit<T, 'recordId'>>) => Promise<void>;
  deleteRecord: (recordId: string) => Promise<void>;
}

async function omniGet<T>(datasheetId: string, opts?: { pageSize?: number; viewId?: string }): Promise<{ records: T[]; total: number }> {
  const params = new URLSearchParams({ action: 'records', datasheetId });
  if (opts?.pageSize) params.set('pageSize', String(opts.pageSize));
  if (opts?.viewId) params.set('viewId', opts.viewId);
  const res = await fetch(`/api/omni-table?${params}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Fetch failed');
  return { records: json.data?.records ?? [], total: json.data?.total ?? 0 };
}

async function omniCreate<T>(datasheetId: string, fields: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/omni-table', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createRecords', datasheetId, records: [{ fields }] }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Create failed');
  return json.data?.[0] as T;
}

async function omniUpdate(datasheetId: string, recordId: string, fields: Record<string, unknown>): Promise<void> {
  const res = await fetch('/api/omni-table', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'updateRecords', datasheetId, records: [{ recordId, fields }] }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Update failed');
}

async function omniDelete(datasheetId: string, recordId: string): Promise<void> {
  const res = await fetch('/api/omni-table', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'deleteRecords', datasheetId, recordIds: [recordId] }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Delete failed');
}

function useOmniModule<T extends ModuleRecord = ModuleRecord>(
  datasheetId: string | undefined,
  opts: UseModuleOptions = {}
): UseModuleReturn<T> {
  const { pageSize = 100, autoLoad = true, viewId } = opts;
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const refresh = useCallback(async () => {
    if (!datasheetId) { setError('Datasheet ID 未設定，請執行 omni:setup 初始化'); return; }
    setLoading(true); setError(null);
    try {
      const { records: r, total: t } = await omniGet<T>(datasheetId, { pageSize, viewId });
      setRecords(r); setTotal(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally { setLoading(false); }
  }, [datasheetId, pageSize, viewId]);

  useEffect(() => { if (autoLoad) refresh(); }, [autoLoad, refresh]);

  const createRecord = useCallback(async (fields: Partial<Omit<T, 'recordId' | 'createdAt' | 'updatedAt'>>) => {
    if (!datasheetId) throw new Error('Datasheet ID not set');
    const record = await omniCreate<T>(datasheetId, fields as Record<string, unknown>);
    setRecords(prev => [...prev, record]);
    return record;
  }, [datasheetId]);

  const updateRecord = useCallback(async (recordId: string, fields: Partial<Omit<T, 'recordId'>>) => {
    if (!datasheetId) throw new Error('Datasheet ID not set');
    await omniUpdate(datasheetId, recordId, fields as Record<string, unknown>);
    setRecords(prev => prev.map(r => r.recordId === recordId ? { ...r, fields: { ...r.fields, ...fields } } : r));
  }, [datasheetId]);

  const deleteRecord = useCallback(async (recordId: string) => {
    if (!datasheetId) throw new Error('Datasheet ID not set');
    await omniDelete(datasheetId, recordId);
    setRecords(prev => prev.filter(r => r.recordId !== recordId));
  }, [datasheetId]);

  return { records, loading, error, total, refresh, createRecord, updateRecord, deleteRecord };
}

// ─── ESG Risk Audit ────────────────────────────────────────────────────────────

export interface EsgRiskRecord extends ModuleRecord {
  fields: {
    '風險標題': string;
    '風險類別': 'E-環境' | 'S-社會' | 'G-治理';
    '嚴重程度': '低' | '中' | '高' | '緊急';
    '狀態': '待評估' | '評估中' | '已緩解' | '已關閉';
    '稽核員': string;
    '描述': string;
    '緩解措施': string;
    '來源': string;
    '5T_Hash': string;
    '建立時間': string;
  };
}

export function useEsgRiskAudit(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_ESG_RISK_DATASHEET_ID;
  return useOmniModule<EsgRiskRecord>(datasheetId, opts);
}

// ─── Compliance Engine ─────────────────────────────────────────────────────────

export interface ComplianceRecord extends ModuleRecord {
  fields: {
    '條款名稱': string;
    '框架': 'GRI' | 'SASB' | 'TCFD' | 'CBAM' | 'ISSB' | '內部';
    '合規狀態': '合規' | '不合規' | '部分合規' | '待審查';
    '嚴重等級': '低' | '中' | '高';
    '掃描日期': string;
    '下次審查日': string;
    '負責部門': string;
    '說明': string;
    '建議行動': string;
    '5T_Hash': string;
  };
}

export function useComplianceEngine(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_COMPLIANCE_DATASHEET_ID;
  return useOmniModule<ComplianceRecord>(datasheetId, opts);
}

// ─── Governance Audit ──────────────────────────────────────────────────────────

export interface GovernanceRecord extends ModuleRecord {
  fields: {
    '事件標題': string;
    '事件類型': 'ADR決策' | '違規事件' | 'Heal修復' | '策略更新' | '稽核日誌';
    '狀態': '待處理' | '處理中' | '已解決' | '已關閉';
    '優先級': '低' | '中' | '高' | '緊急';
    '發起者': string;
    '負責代理': string;
    '事件描述': string;
    '解決方案': string;
    '5T_Hash': string;
    '事件時間': string;
  };
}

export function useGovernanceAudit(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID;
  return useOmniModule<GovernanceRecord>(datasheetId, opts);
}

// ─── Supplier Integrity ────────────────────────────────────────────────────────

export interface SupplierRecord extends ModuleRecord {
  fields: {
    '供應商名稱': string;
    '供應商層級': 'Tier 1' | 'Tier 2' | 'Tier 3';
    '國家地區': string;
    '誠信評分': number;
    '認證狀態': '已認證' | '審查中' | '警告' | '停權';
    '最後稽核日': string;
    '主要風險': string;
    '改善建議': string;
    '5T_Hash': string;
  };
}

export function useSupplierIntegrity(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID;
  return useOmniModule<SupplierRecord>(datasheetId, opts);
}

// ─── Vault Omni ────────────────────────────────────────────────────────────────

export interface VaultRecord extends ModuleRecord {
  fields: {
    '封存標題': string;
    '資產類型': 'ESG報告' | 'ADR文件' | '碳足跡' | '合規證明' | '稽核記錄' | '其他';
    '封存狀態': '有效' | '已過期' | '撤銷';
    '5T_Hash': string;
    'SHA256': string;
    '封存時間': string;
    '到期時間': string;
    '作者': string;
    '描述': string;
    '原始URL': string;
  };
}

export function useVaultOmni(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_VAULT_OMNI_DATASHEET_ID;
  return useOmniModule<VaultRecord>(datasheetId, opts);
}

// ─── Swarm Consensus ──────────────────────────────────────────────────────────

export interface SwarmRecord extends ModuleRecord {
  fields: {
    '決策主題': string;
    '提案代理': string;
    '共識狀態': '投票中' | '通過' | '否決' | '待審';
    '同意票數': number;
    '否決票數': number;
    '棄權票數': number;
    '決策理由': string;
    '投票截止': string;
    '最終決議': string;
    '5T_Hash': string;
  };
}

export function useSwarmConsensus(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID;
  return useOmniModule<SwarmRecord>(datasheetId, opts);
}

// ─── Notes & Tasks ─────────────────────────────────────────────────────────────

export interface NoteTaskRecord extends ModuleRecord {
  fields: {
    '任務標題': string;
    '狀態': '待辦' | '進行中' | '已完成' | '已取消';
    '優先級': '低' | '中' | '高';
    '指派對象': string;
    '截止日期': string;
    '標籤': string;
    '備註': string;
  };
}

export function useNotesTasks(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_TASKS_DATASHEET_ID;
  return useOmniModule<NoteTaskRecord>(datasheetId, opts);
}

// ─── Daily Intelligence ────────────────────────────────────────────────────────

export interface IntelRecord extends ModuleRecord {
  fields: {
    '標題': string;
    '情資類別': string;
    '重要程度': '低' | '中' | '高' | '緊急';
    '來源': string;
    '摘要': string;
    '標籤': string;
    '日期': string;
    '處理狀態': '未讀' | '已讀' | '已處理';
  };
}

export function useDailyIntelligence(opts?: UseModuleOptions) {
  const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID;
  return useOmniModule<IntelRecord>(datasheetId, opts);
}
