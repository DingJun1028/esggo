export interface MemoryRecord {
    id: string;
    agentName: string;
    task: string;
    context: unknown;
    result: string;
    success: boolean;
    timestamp: string;
    tags: string[];
    embedding?: number[];
}
export declare class MemoryStore {
    private static instance;
    private memories;
    private initialized;
    private constructor();
    static getInstance(): MemoryStore;
    init(): Promise<void>;
    add(record: Omit<MemoryRecord, 'id' | 'timestamp'>): Promise<MemoryRecord>;
    getByAgent(agentName: string): Promise<MemoryRecord[]>;
    search(query: string, limit?: number): Promise<MemoryRecord[]>;
    getSimilar(task: string, agentName?: string, limit?: number): Promise<MemoryRecord[]>;
    private calculateSimilarity;
    clear(): void;
    getAll(): Promise<MemoryRecord[]>;
}
export declare const memoryStore: MemoryStore;
//# sourceMappingURL=memory-store.d.ts.map