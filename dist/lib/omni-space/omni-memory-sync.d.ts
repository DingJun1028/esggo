export interface EpisodicMemory {
    id?: string;
    sourceOrigin: string;
    eventType: string;
    content: string;
    metadata?: Record<string, any>;
    embedding?: number[];
    createdAt?: string;
}
export declare class OmniMemorySync {
    /**
     * Syncs an episodic event to the database (and optionally extracts/generates vector embeddings)
     */
    static syncEpisodicMemory(memory: EpisodicMemory, options?: {
        signal?: AbortSignal;
    }): Promise<void>;
    /**
     * Listen to OmniEventStore and auto-sync events as Episodic Memories
     */
    static initAutoSync(): void;
}
//# sourceMappingURL=omni-memory-sync.d.ts.map