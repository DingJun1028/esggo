import { OmniEvent } from '@/src/shared/types';
/**
 * OmniMemorySync: 萬能永憶同步器
 * 負責監聽 EventStore (GPL)，並將狀態同步至向量資料庫 (Vector DB) 或 AI 記憶庫，
 * 讓 Genkit / JunAIKey 擁有基於真實數據流的「情節記憶 (Episodic Memory)」。
 */
export declare class OmniMemorySync {
    constructor();
    private handleEventSaved;
    private syncWithRetry;
    private syncToVectorDB;
    syncToAITable(event: OmniEvent): Promise<void>;
    private syncToOmniTable;
    private saveToDeadLetterQueue;
    replayDLQ(): Promise<{
        processed: number;
        succeeded: number;
        failed: number;
    }>;
}
export declare const globalOmniMemorySync: OmniMemorySync;
//# sourceMappingURL=OmniMemorySync.d.ts.map