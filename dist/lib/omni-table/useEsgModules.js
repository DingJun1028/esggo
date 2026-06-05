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
    notes_tasks: 'OMNITABLE_TASKS_DATASHEET_ID',
    daily_intelligence: 'OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID',
    esg_risk: 'OMNITABLE_ESG_RISK_DATASHEET_ID',
    compliance: 'OMNITABLE_COMPLIANCE_DATASHEET_ID',
    governance: 'OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID',
    supplier: 'OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID',
    vault: 'OMNITABLE_VAULT_OMNI_DATASHEET_ID',
    swarm: 'OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID',
};
async function omniGet(datasheetId, opts) {
    const params = new URLSearchParams({ action: 'records', datasheetId });
    if (opts?.pageSize)
        params.set('pageSize', String(opts.pageSize));
    if (opts?.viewId)
        params.set('viewId', opts.viewId);
    const res = await fetch(`/api/omni-table?${params}`);
    const json = await res.json();
    if (!json.success)
        throw new Error(json.error || 'Fetch failed');
    return { records: json.data?.records ?? [], total: json.data?.total ?? 0 };
}
async function omniCreate(datasheetId, fields) {
    const res = await fetch('/api/omni-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createRecords', datasheetId, records: [{ fields }] }),
    });
    const json = await res.json();
    if (!json.success)
        throw new Error(json.error || 'Create failed');
    return json.data?.[0];
}
async function omniUpdate(datasheetId, recordId, fields) {
    const res = await fetch('/api/omni-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRecords', datasheetId, records: [{ recordId, fields }] }),
    });
    const json = await res.json();
    if (!json.success)
        throw new Error(json.error || 'Update failed');
}
async function omniDelete(datasheetId, recordId) {
    const res = await fetch('/api/omni-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteRecords', datasheetId, recordIds: [recordId] }),
    });
    const json = await res.json();
    if (!json.success)
        throw new Error(json.error || 'Delete failed');
}
function useOmniModule(datasheetId, opts = {}) {
    const { pageSize = 100, autoLoad = true, viewId } = opts;
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const refresh = useCallback(async () => {
        if (!datasheetId) {
            setError('Datasheet ID 未設定，請執行 omni:setup 初始化');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { records: r, total: t } = await omniGet(datasheetId, { pageSize, viewId });
            setRecords(r);
            setTotal(t);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
    }, [datasheetId, pageSize, viewId]);
    useEffect(() => { if (autoLoad)
        refresh(); }, [autoLoad, refresh]);
    const createRecord = useCallback(async (fields) => {
        if (!datasheetId)
            throw new Error('Datasheet ID not set');
        const record = await omniCreate(datasheetId, fields);
        setRecords(prev => [...prev, record]);
        return record;
    }, [datasheetId]);
    const updateRecord = useCallback(async (recordId, fields) => {
        if (!datasheetId)
            throw new Error('Datasheet ID not set');
        await omniUpdate(datasheetId, recordId, fields);
        setRecords(prev => prev.map(r => r.recordId === recordId ? { ...r, fields: { ...r.fields, ...fields } } : r));
    }, [datasheetId]);
    const deleteRecord = useCallback(async (recordId) => {
        if (!datasheetId)
            throw new Error('Datasheet ID not set');
        await omniDelete(datasheetId, recordId);
        setRecords(prev => prev.filter(r => r.recordId !== recordId));
    }, [datasheetId]);
    return { records, loading, error, total, refresh, createRecord, updateRecord, deleteRecord };
}
export function useEsgRiskAudit(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_ESG_RISK_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useComplianceEngine(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_COMPLIANCE_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useGovernanceAudit(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useSupplierIntegrity(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useVaultOmni(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_VAULT_OMNI_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useSwarmConsensus(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useNotesTasks(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_TASKS_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
export function useDailyIntelligence(opts) {
    const datasheetId = process.env.NEXT_PUBLIC_OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID;
    return useOmniModule(datasheetId, opts);
}
//# sourceMappingURL=useEsgModules.js.map