/**
 * Nexus Core: External Sync Service
 * 用於將 OmniCore 的數據 (如知識入庫、使用者回饋) 同步至外部系統 (OmniTable.ai, OmniBlue 等)
 */
export interface SyncPayload {
    source: string;
    timestamp: string;
    [key: string]: unknown;
}
export interface HealingGuardianEvent {
    type: 'healing';
    data: {
        message: string;
        originalQuery?: string;
        actionTaken: string;
        success: boolean;
        timestamp: string;
    };
}
export interface FeedbackEvent {
    type: 'feedback';
    data: {
        messageId?: string;
        query: string;
        answer?: string;
        feedback: number | string;
        timestamp: string;
    };
}
export interface IngestionEvent {
    type: 'ingestion';
    data: {
        documentId: string;
        status: string;
        timestamp: string;
    };
}
export type EvolutionEvent = HealingGuardianEvent | FeedbackEvent | IngestionEvent;
export declare class ExternalSyncService {
    private static instance;
    private constructor();
    static getInstance(): ExternalSyncService;
    /**
     * 同步至 OmniTable.ai (知識聖殿的數據基石)
     */
    syncToOmniTable(datasheetId: string, payload: unknown): Promise<boolean>;
    /**
     * 同步至 OmniBlue (企業核心控制 / ERP CRM)
     */
    syncToOmniBlue(endpoint: string, payload: unknown): Promise<boolean>;
    /**
     * 觸發萬能進化環 (Evolution Loop) 的聯合同步
     * 當系統獲得使用者回饋，或是核心資料庫更新時觸發
     */
    triggerEvolutionSync(event: EvolutionEvent): Promise<void>;
}
//# sourceMappingURL=external-sync-service.d.ts.map