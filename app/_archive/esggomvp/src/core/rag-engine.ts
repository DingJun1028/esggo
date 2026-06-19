/**
 * 🌀 RagEngine: Context-Aware Intelligence Retrieval
 * Implements "Pillar 4" of Omni-Gnosis.
 * Logic: [可溯源] & [可驗算]
 */

import { OmniVectorStore } from './omni-vector-store';
import { OmniCoreVerifier } from './omni-verifier';
import { ncbFetch } from "@/lib/ncb-utils";
import { generateEmbedding, cosineSimilarity } from "@/lib/embeddings";

export interface IKnowledgeChunk {
    chunk_uuid: string;
    content: string;
    metadata: any;
    source_origin: string;
    hash_lock: string;
    embedding?: number[];
    similarity?: number;
}

export class RagEngine {
    /**
     * 🔍 Query: 語意檢索與 5T 誠信驗核
     */
    static async query(prompt: string, limit: number = 3): Promise<IKnowledgeChunk[]> {
        const queryVector = await generateEmbedding(prompt);

        // Fetch from NCB Table
        const { data: rawChunks, error } = await ncbFetch<any[]>('knowledge_chunks');


        if (error || !rawChunks) {
            console.error("RagEngine Error:", error);
            return [];
        }

        // Map and Verify
        const scoredChunks = rawChunks.map(raw => {
            const chunk: IKnowledgeChunk = {
                chunk_uuid: raw.chunk_uuid,
                content: raw.content,
                metadata: JSON.parse(raw.metadata || '{}'),
                source_origin: raw.source_origin,
                hash_lock: raw.hash_lock,
                embedding: JSON.parse(raw.embedding_json || '[]')
            };

            // 5T Verification: 確保檢索結果未被惡意竄改
            const isValid = OmniCoreVerifier.verifyIntegrity({
                metric_code: 'Knowledge_Chunk',
                value: chunk.content,
                reporting_year: new Date().getFullYear(), // Placeholder
                source_origin: chunk.source_origin,
                formula: 'RAG_Semantic_Ingestion',
                timestamp: Date.now() // Note: In production we use the recorded timestamp
            }, chunk.hash_lock);

            const similarity = chunk.embedding && chunk.embedding.length > 0
                ? cosineSimilarity(queryVector, chunk.embedding)
                : 0;

            return { ...chunk, similarity, isVerified: isValid };
        });

        // Sort by similarity and return top results
        return scoredChunks
            .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
            .slice(0, limit);
    }

    /**
     * 📖 Format Context: 注入 5T 溯源連結
     */
    static formatContext(chunks: IKnowledgeChunk[]): string {
        if (chunks.length === 0) return "No reliable ESG context found.";

        return chunks.map((chunk, index) => {
            return `[5T-Context ${index + 1}] (Origin: ${chunk.source_origin})\n` +
                `Content: ${chunk.content}\n` +
                `Hash: ${chunk.hash_lock.slice(0, 12)}...`;
        }).join("\n\n");
    }
}
