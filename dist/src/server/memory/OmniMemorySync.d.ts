/**
 * OmniMemorySync: 萬能永憶同步器
 * 負責監聽 EventStore (GPL)，並將狀態同步至向量資料庫 (Vector DB) 或 AI 記憶庫，
 * 讓 Genkit / JunAIKey 擁有基於真實數據流的「情節記憶 (Episodic Memory)」。
 */
export declare class OmniMemorySync {
    constructor();
    /**
     * 處理事件保存，轉化為 AI 向量上下文
     */
    private handleEventSaved;
    /**
     * 通用重試邏輯封裝 (具備 Exponential Backoff)
     */
    private syncWithRetry;
    /**
     * 模擬將事件寫入 Vector DB (如 Pinecone, Supabase, 或 Firestore)
     * 供 Genkit RAG 引擎使用
     */
    private syncToVectorDB;
    /**
     * 寫入 AITable (外部 NoCode 關聯資料庫)
     */
    private syncToAITable;
    /**
     * 寫入系統內部的 OmniTable (關聯式資料與 Vault，提供精確查詢)
     */
    private syncToOmniTable;
    /**
     * 將重試失敗的事件送入 Supabase Dead Letter Queue
     */
    private saveToDeadLetterQueue;
    /**
     * 觸發 DLQ 的重試同步 (手動重新處理所有 failed_sync_events)
     */
    replayDLQ(): Promise<{
        processed: number;
        succeeded: number;
        failed: number;
    }>;
}
export declare const globalOmniMemorySync: OmniMemorySync;
//# sourceMappingURL=OmniMemorySync.d.ts.map