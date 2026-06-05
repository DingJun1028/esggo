import { NextResponse } from 'next/server';
import { getOmniTableServerClient } from '@/lib/omni-table/client';
/**
 * OmniTable Setup Status API
 * GET /api/omni-table/status
 *
 * 回傳所有已設定的 OmniBlueTable 模組狀態
 * 供 Admin Dashboard 使用
 */
const MODULE_CONFIGS = [
    { key: 'notes_tasks', label: '萬能筆記 - 任務管理', envKey: 'OMNITABLE_TASKS_DATASHEET_ID', icon: '📝' },
    { key: 'daily_intelligence', label: '商情中心 - 每日情資庫', envKey: 'OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID', icon: '📡' },
    { key: 'esg_risk', label: 'ESG 風險稽核庫', envKey: 'OMNITABLE_ESG_RISK_DATASHEET_ID', icon: '⚠️' },
    { key: 'compliance', label: '合規引擎 - 掃描結果', envKey: 'OMNITABLE_COMPLIANCE_DATASHEET_ID', icon: '✅' },
    { key: 'governance', label: '治理稽核 - 事件日誌', envKey: 'OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID', icon: '🏛️' },
    { key: 'supplier', label: '供應鏈誠信評估庫', envKey: 'OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID', icon: '🔗' },
    { key: 'vault', label: 'Vault Omni 封存索引', envKey: 'OMNITABLE_VAULT_OMNI_DATASHEET_ID', icon: '🔐' },
    { key: 'swarm', label: 'OmniSwarm 蜂群共識', envKey: 'OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID', icon: '🐝' },
];
export async function GET(_req) {
    const apiKey = process.env.OMNITABLE_API_KEY;
    const spaceId = process.env.OMNITABLE_SPACE_ID;
    const modules = await Promise.all(MODULE_CONFIGS.map(async (mod) => {
        const datasheetId = process.env[mod.envKey];
        const base = {
            key: mod.key,
            label: mod.label,
            icon: mod.icon,
            envKey: mod.envKey,
            datasheetId: datasheetId ?? null,
            configured: Boolean(datasheetId),
        };
        if (!datasheetId || !apiKey) {
            return { ...base, status: 'unconfigured', recordCount: 0 };
        }
        try {
            const client = getOmniTableServerClient();
            const result = await client.getRecords(datasheetId, { pageSize: 1 });
            return {
                ...base,
                status: 'active',
                recordCount: result.total ?? 0,
            };
        }
        catch (err) {
            return {
                ...base,
                status: 'error',
                recordCount: 0,
                error: err instanceof Error ? err.message : 'Unknown error',
            };
        }
    }));
    const summary = {
        total: modules.length,
        active: modules.filter(m => m.status === 'active').length,
        unconfigured: modules.filter(m => m.status === 'unconfigured').length,
        error: modules.filter(m => m.status === 'error').length,
        apiConfigured: Boolean(apiKey),
        spaceConfigured: Boolean(spaceId),
        timestamp: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, data: { modules, summary } });
}
//# sourceMappingURL=route.js.map