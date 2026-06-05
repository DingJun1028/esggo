import { NextRequest, NextResponse } from 'next/server';
export declare function GET(_req: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        modules: ({
            status: "unconfigured";
            recordCount: number;
            key: "governance" | "compliance" | "vault" | "swarm" | "notes_tasks" | "daily_intelligence" | "esg_risk" | "supplier";
            label: "萬能筆記 - 任務管理" | "商情中心 - 每日情資庫" | "ESG 風險稽核庫" | "合規引擎 - 掃描結果" | "治理稽核 - 事件日誌" | "供應鏈誠信評估庫" | "Vault Omni 封存索引" | "OmniSwarm 蜂群共識";
            icon: "🏛️" | "🔐" | "✅" | "⚠️" | "📝" | "📡" | "🔗" | "🐝";
            envKey: "OMNITABLE_TASKS_DATASHEET_ID" | "OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID" | "OMNITABLE_ESG_RISK_DATASHEET_ID" | "OMNITABLE_COMPLIANCE_DATASHEET_ID" | "OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID" | "OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID" | "OMNITABLE_VAULT_OMNI_DATASHEET_ID" | "OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID";
            datasheetId: string | null;
            configured: boolean;
        } | {
            status: "active";
            recordCount: number;
            key: "governance" | "compliance" | "vault" | "swarm" | "notes_tasks" | "daily_intelligence" | "esg_risk" | "supplier";
            label: "萬能筆記 - 任務管理" | "商情中心 - 每日情資庫" | "ESG 風險稽核庫" | "合規引擎 - 掃描結果" | "治理稽核 - 事件日誌" | "供應鏈誠信評估庫" | "Vault Omni 封存索引" | "OmniSwarm 蜂群共識";
            icon: "🏛️" | "🔐" | "✅" | "⚠️" | "📝" | "📡" | "🔗" | "🐝";
            envKey: "OMNITABLE_TASKS_DATASHEET_ID" | "OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID" | "OMNITABLE_ESG_RISK_DATASHEET_ID" | "OMNITABLE_COMPLIANCE_DATASHEET_ID" | "OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID" | "OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID" | "OMNITABLE_VAULT_OMNI_DATASHEET_ID" | "OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID";
            datasheetId: string | null;
            configured: boolean;
        } | {
            status: "error";
            recordCount: number;
            error: string;
            key: "governance" | "compliance" | "vault" | "swarm" | "notes_tasks" | "daily_intelligence" | "esg_risk" | "supplier";
            label: "萬能筆記 - 任務管理" | "商情中心 - 每日情資庫" | "ESG 風險稽核庫" | "合規引擎 - 掃描結果" | "治理稽核 - 事件日誌" | "供應鏈誠信評估庫" | "Vault Omni 封存索引" | "OmniSwarm 蜂群共識";
            icon: "🏛️" | "🔐" | "✅" | "⚠️" | "📝" | "📡" | "🔗" | "🐝";
            envKey: "OMNITABLE_TASKS_DATASHEET_ID" | "OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID" | "OMNITABLE_ESG_RISK_DATASHEET_ID" | "OMNITABLE_COMPLIANCE_DATASHEET_ID" | "OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID" | "OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID" | "OMNITABLE_VAULT_OMNI_DATASHEET_ID" | "OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID";
            datasheetId: string | null;
            configured: boolean;
        })[];
        summary: {
            total: number;
            active: number;
            unconfigured: number;
            error: number;
            apiConfigured: boolean;
            spaceConfigured: boolean;
            timestamp: string;
        };
    };
}>>;
//# sourceMappingURL=route.d.ts.map