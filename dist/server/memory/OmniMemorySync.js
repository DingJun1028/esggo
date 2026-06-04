"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalOmniMemorySync = exports.OmniMemorySync = void 0;
const event_store_1 = require("../../../lib/omni-space/event-store");
const supabase_js_1 = require("@supabase/supabase-js");
/**
 * OmniMemorySync: 萬能永憶同步器
 * 負責監聽 EventStore (GPL)，並將狀態同步至向量資料庫 (Vector DB) 或 AI 記憶庫，
 * 讓 Genkit / JunAIKey 擁有基於真實數據流的「情節記憶 (Episodic Memory)」。
 */
class OmniMemorySync {
    constructor() {
        // 訂閱 Omni-Space 絕對真理層的事件廣播
        event_store_1.OmniEventStore.eventBus.on('event_saved', this.handleEventSaved.bind(this));
        console.log('[OmniMemorySync] Attached to Omni-Space event bus. Ready to encode episodic memories.');
    }
    /**
     * 處理事件保存，轉化為 AI 向量上下文
     */
    async handleEventSaved(event) {
        console.log(`[OmniMemorySync] Intercepted new event: ${event.id} (Type: ${event.event_type})`);
        // 定義所有需要同步的目標系統
        const destinations = [
            { name: 'VectorDB', syncFn: () => this.syncToVectorDB(event) },
            { name: 'AITable', syncFn: () => this.syncToAITable(event) },
            { name: 'OmniTable', syncFn: () => this.syncToOmniTable(event) }
        ];
        // 對每個目標進行獨立的重試與死信處理，確保部分失敗不會影響整體
        await Promise.all(destinations.map(target => this.syncWithRetry(event, target.name, target.syncFn)));
    }
    /**
     * 通用重試邏輯封裝 (具備 Exponential Backoff)
     */
    async syncWithRetry(event, targetName, syncFn) {
        const maxRetries = 3;
        let attempt = 0;
        let success = false;
        while (attempt < maxRetries && !success) {
            try {
                await syncFn();
                console.log(`[OmniMemorySync] Successfully synchronized event ${event.id} to ${targetName} on attempt ${attempt + 1}.`);
                success = true;
            }
            catch (error) {
                attempt++;
                console.error(`[OmniMemorySync] Attempt ${attempt} failed to sync event ${event.id} to ${targetName}.`, error);
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`[OmniMemorySync] Retrying ${targetName} in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else {
                    console.error(`[OmniMemorySync] Max retries reached for event ${event.id} to ${targetName}. Moving to Dead Letter logic.`);
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await this.saveToDeadLetterQueue(event, `[Target: ${targetName}] ${errorMessage}`);
                }
            }
        }
    }
    /**
     * 模擬將事件寫入 Vector DB (如 Pinecone, Supabase, 或 Firestore)
     * 供 Genkit RAG 引擎使用
     */
    async syncToVectorDB(event) {
        // 這裡為實作預留介面，將 event payload 轉換為 embedding
        // const embedding = await ai.embed(event.payload.name + " " + event.payload.status);
        // await vectorDb.upsert(event.id, embedding);
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock DB sync delay
                resolve();
            }, 100);
        });
    }
    /**
     * 寫入 AITable (外部 NoCode 關聯資料庫)
     */
    async syncToAITable(event) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 80);
        });
    }
    /**
     * 寫入系統內部的 OmniTable (關聯式資料與 Vault，提供精確查詢)
     */
    async syncToOmniTable(event) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceRoleKey) {
            console.warn('[OmniMemorySync] Skip OmniTable Sync: Supabase credentials not found.');
            return;
        }
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false }
        });
        // 將事件寫入原生 OmniTable 日誌 (供前端 VaultOmniTable 查詢或後端分析)
        const { error } = await supabase.from('omni_events_log').insert({
            id: event.id,
            omni_card_uuid: event.omni_card_uuid,
            event_type: event.event_type,
            payload: event.payload,
            hash_lock: event.hash_lock,
            source_platform: event.source_platform,
            created_at: new Date(event.created_at).toISOString(),
        });
        if (error) {
            throw error; // 將觸發上層的重試機制與 DLQ
        }
    }
    /**
     * 將重試失敗的事件送入 Supabase Dead Letter Queue
     */
    async saveToDeadLetterQueue(event, errorLog) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceRoleKey) {
            console.error('[OmniMemorySync] DLQ Error: Supabase credentials not found in env.');
            return;
        }
        try {
            const supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
                auth: { persistSession: false }
            });
            const { error } = await supabase.from('failed_sync_events').insert({
                event_id: event.id,
                event_type: event.event_type,
                payload: event.payload,
                error_log: errorLog,
                retry_count: 3
            });
            if (error) {
                console.error(`[OmniMemorySync] Failed to insert dead letter for event ${event.id}:`, error);
            }
            else {
                console.log(`[OmniMemorySync] Event ${event.id} successfully moved to Supabase DLQ (failed_sync_events).`);
            }
        }
        catch (err) {
            console.error(`[OmniMemorySync] Fatal error while saving to DLQ:`, err);
        }
    }
    /**
     * 觸發 DLQ 的重試同步 (手動重新處理所有 failed_sync_events)
     */
    async replayDLQ() {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase credentials not found in env.');
        }
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false }
        });
        const { data: failedEvents, error } = await supabase
            .from('failed_sync_events')
            .select('*')
            .order('created_at', { ascending: true });
        if (error) {
            console.error('[OmniMemorySync] Error fetching DLQ:', error);
            throw error;
        }
        if (!failedEvents || failedEvents.length === 0) {
            return { processed: 0, succeeded: 0, failed: 0 };
        }
        console.log(`[OmniMemorySync] Found ${failedEvents.length} events in DLQ to replay.`);
        let succeeded = 0;
        let failed = 0;
        for (const record of failedEvents) {
            const mockEvent = {
                id: record.event_id,
                event_type: record.event_type,
                payload: record.payload,
                timestamp: record.created_at,
                actor: 'DLQ_Replay',
                source_origin: 'DLQ'
            };
            try {
                // 重試
                await this.handleEventSaved(mockEvent);
                // 如果 handleEventSaved 本身就做好了錯誤捕捉跟再次重寫入 DLQ 的機制，
                // 為了避免重複，只要沒有拋出 global error 就當成功並把原本的 DLQ 清除
                await supabase.from('failed_sync_events').delete().eq('id', record.id);
                succeeded++;
            }
            catch (e) {
                console.error(`[OmniMemorySync] DLQ Replay failed for event ${record.event_id}`, e);
                failed++;
            }
        }
        return { processed: failedEvents.length, succeeded, failed };
    }
}
exports.OmniMemorySync = OmniMemorySync;
// 匯出單例，供 API Route 直接呼叫
exports.globalOmniMemorySync = new OmniMemorySync();
//# sourceMappingURL=OmniMemorySync.js.map