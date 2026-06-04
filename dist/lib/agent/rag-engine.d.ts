export interface KnowledgeDocument {
    id: string;
    source: string;
    text: string;
    metadata?: unknown;
    embedding?: number[];
}
/**
 * 1. 文本切割器 (Semantic Text Splitter)
 */
export declare function chunkText(text: string, chunkSize?: number, overlap?: number): string[];
/**
 * 2. 向量嵌入生成 (Gemini Embedding API)
 */
export declare function generateEmbedding(text: string): Promise<number[]>;
/**
 * 3. 核心：文獻寫入與向量化
 */
export declare function ingestDocument(title: string, content: string, type?: string, metadata?: unknown): Promise<any>;
/**
 * 4. 檢索智庫 (Hybrid Search)
 */
export declare function searchKnowledgeBase(query: string, limit?: number): Promise<any>;
/**
 * 5. 聯動代理人推理
 */
export declare function queryWithIntelligence(query: string): Promise<{
    answer: string;
    sources: any;
}>;
/**
 * Compatibility: Query with history
 */
export declare function queryKnowledgeBase(query: string, history?: unknown[]): Promise<{
    answer: string;
    sources: any;
}>;
/**
 * Compatibility: Process PDF
 */
export declare function processPDFAndIngest(buffer: Buffer, fileName: string): Promise<number>;
/**
 * Compatibility: Add direct items
 */
export declare function addToKnowledgeBase(documents: unknown[]): Promise<void>;
//# sourceMappingURL=rag-engine.d.ts.map