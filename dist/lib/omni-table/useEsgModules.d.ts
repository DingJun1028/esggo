export declare const OMNITABLE_ENV_KEYS: {
    readonly notes_tasks: "OMNITABLE_TASKS_DATASHEET_ID";
    readonly daily_intelligence: "OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID";
    readonly esg_risk: "OMNITABLE_ESG_RISK_DATASHEET_ID";
    readonly compliance: "OMNITABLE_COMPLIANCE_DATASHEET_ID";
    readonly governance: "OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID";
    readonly supplier: "OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID";
    readonly vault: "OMNITABLE_VAULT_OMNI_DATASHEET_ID";
    readonly swarm: "OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID";
};
export type OmniModuleKey = keyof typeof OMNITABLE_ENV_KEYS;
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
export declare function useEsgRiskAudit(opts?: UseModuleOptions): UseModuleReturn<EsgRiskRecord>;
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
export declare function useComplianceEngine(opts?: UseModuleOptions): UseModuleReturn<ComplianceRecord>;
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
export declare function useGovernanceAudit(opts?: UseModuleOptions): UseModuleReturn<GovernanceRecord>;
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
export declare function useSupplierIntegrity(opts?: UseModuleOptions): UseModuleReturn<SupplierRecord>;
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
export declare function useVaultOmni(opts?: UseModuleOptions): UseModuleReturn<VaultRecord>;
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
export declare function useSwarmConsensus(opts?: UseModuleOptions): UseModuleReturn<SwarmRecord>;
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
export declare function useNotesTasks(opts?: UseModuleOptions): UseModuleReturn<NoteTaskRecord>;
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
export declare function useDailyIntelligence(opts?: UseModuleOptions): UseModuleReturn<IntelRecord>;
export {};
//# sourceMappingURL=useEsgModules.d.ts.map