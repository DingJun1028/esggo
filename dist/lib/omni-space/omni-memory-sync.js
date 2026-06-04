import { getSupabaseClient } from '../supabase';
import { OmniEventStore } from './event-store';
import { genkit } from 'genkit';
import { googleAI, textEmbedding004 } from '@genkit-ai/googleai';
// Initialize Genkit
const ai = genkit({
    plugins: [googleAI()], // Assumes process.env.GEMINI_API_KEY is available or setup elsewhere
});
export class OmniMemorySync {
    /**
     * Syncs an episodic event to the database (and optionally extracts/generates vector embeddings)
     */
    static async syncEpisodicMemory(memory, options) {
        const signal = options?.signal;
        // 1. 執行前檢查：如果任務已取消，直接中斷，節省 Token 與算力
        if (signal?.aborted) {
            console.log(`[OmniMemorySync] Operation aborted before starting: ${memory.sourceOrigin}`);
            return;
        }
        console.log(`[OmniMemorySync] Syncing memory for source: ${memory.sourceOrigin}`);
        let vector = memory.embedding;
        try {
            if (!vector && memory.content) {
                console.log('[OmniMemorySync] Generating embedding via Genkit...');
                const embedPromise = ai.embed({
                    embedder: textEmbedding004,
                    content: memory.content,
                }).then(res => res[0].embedding);
                // 2. 執行中攔截：利用 Promise.race 讓任務能在等待模型回應期間被強行中斷
                if (signal) {
                    vector = await Promise.race([
                        embedPromise,
                        new Promise((_, reject) => {
                            const onAbort = () => reject(new Error('AbortError: Genkit embedding request was cancelled by client'));
                            signal.addEventListener('abort', onAbort);
                            // 清理監聽器，避免 Memory Leak
                            embedPromise.finally(() => signal.removeEventListener('abort', onAbort));
                        })
                    ]);
                }
                else {
                    vector = await embedPromise;
                }
                console.log('[OmniMemorySync] Embedding generated successfully.');
            }
        }
        catch (err) {
            console.warn('[OmniMemorySync] Failed to generate embedding:', err);
        }
        const client = getSupabaseClient();
        if (!client) {
            console.warn('[OmniMemorySync] Supabase client not available, skipping db sync.');
            return;
        }
        try {
            const { data, error } = await client.from('episodic_memories').insert({
                source_origin: memory.sourceOrigin,
                event_type: memory.eventType,
                content: memory.content,
                metadata: memory.metadata || {},
                embedding: vector || null,
                created_at: memory.createdAt || new Date().toISOString()
            });
            if (error) {
                console.error('[OmniMemorySync] Failed to sync to Supabase:', error.message);
            }
        }
        catch (err) {
            console.error('[OmniMemorySync] Sync error:', err);
        }
    }
    /**
     * Listen to OmniEventStore and auto-sync events as Episodic Memories
     */
    static initAutoSync() {
        OmniEventStore.eventBus.on('event_saved', (event) => {
            this.syncEpisodicMemory({
                sourceOrigin: event.source_platform,
                eventType: event.event_type,
                content: JSON.stringify(event.payload),
                metadata: {
                    omni_card_uuid: event.omni_card_uuid,
                    hash_lock: event.hash_lock
                },
                createdAt: new Date(event.created_at).toISOString()
            }).catch((err) => {
                console.error(`[OmniMemorySync] Auto-sync failed for event ${event.id}:`, err);
            });
        });
        console.log('[OmniMemorySync] Auto-sync initialized.');
    }
}
//# sourceMappingURL=omni-memory-sync.js.map