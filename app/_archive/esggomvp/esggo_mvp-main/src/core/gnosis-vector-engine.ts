/**
 * 🏛️ GnosisVectorEngine (v9.0 Cloud Edition)
 * 定位: 萬能語義向量引擎 — NCBDB 雲端實作
 * 負責: 將 IOmniAtom 向量化並同步至 54686_esg_go_userdb/knowledge_chunks
 */

import { IOmniAtom, IOmniTag } from './omni-types';
// import { createHash } from 'crypto'; // Removed for browser compatibility
import { gnosisRAGApi, KnowledgeChunk } from '../lib/ncb-service';

export interface IGnosisVector {
    readonly atomUuid: string;
    readonly vector: number[];
    readonly magnitude: number;
    readonly metadata: {
        domain: string;
        tags: string[];
        impactLevel: number;
    };
}

export interface IGnosisSearchResult {
    atom_uuid: string;
    content: string;
    score: number;
    source: string;
}

export class GnosisVectorEngine {
    private static instance: GnosisVectorEngine;

    private constructor() { }

    public static getInstance(): GnosisVectorEngine {
        if (!GnosisVectorEngine.instance) {
            GnosisVectorEngine.instance = new GnosisVectorEngine();
        }
        return GnosisVectorEngine.instance;
    }

    /**
     * 🌀 Ingrain: 將原子刻印入位元雲端 (Cloud Ingestion)
     */
    public async ingrainAtom<T>(atom: IOmniAtom<T>): Promise<boolean> {
        try {
            const content = JSON.stringify(atom.payload);
            const pseudoVector = this.generatePseudoVector(content);

            const chunk: Omit<KnowledgeChunk, 'id'> = {
                atom_uuid: atom.uuid,
                content: content,
                embedding: JSON.stringify(pseudoVector),
                metadata: JSON.stringify({
                    domain: atom.domainRef,
                    tags: atom.tags.map(t => (typeof t === 'string' ? t : t.semantic)),
                    timestamp: atom.timestamp
                }),
                source_origin: atom.sourceOrigin || 'OmniNexus_Sentinel'
            };

            await gnosisRAGApi.ingrainChunk(chunk);
            return true;
        } catch (error) {
            console.error('[Gnosis] Cloud Ingrain failed:', error);
            return false;
        }
    }

    /**
     * 🔍 Seek: 雲端語義檢索 (Cloud Semantic Seek)
     */
    public async seek(query: string, limit: number = 5): Promise<IGnosisSearchResult[]> {
        try {
            const { data: response } = await gnosisRAGApi.searchChunks(query, limit);

            if (!response || !response.data) return [];

            const queryVector = this.generatePseudoVector(query);
            const queryMag = this.calculateMagnitude(queryVector);

            const results: IGnosisSearchResult[] = response.data.map((chunk: KnowledgeChunk) => {
                const chunkVector = chunk.embedding ? JSON.parse(chunk.embedding) : [];
                const chunkMag = this.calculateMagnitude(chunkVector);
                const score = this.cosineSimilarity(queryVector, queryMag, chunkVector, chunkMag);

                return {
                    atom_uuid: chunk.atom_uuid,
                    content: chunk.content,
                    score: score,
                    source: chunk.source_origin || 'Unknown'
                };
            });



            return results
                .sort((a, b) => b.score - a.score);
        } catch (error) {
            console.error('[Gnosis] Cloud Search failed:', error);
            return [];
        }
    }

    // --- 向量演算法 (保持確定的模擬) ---

    private generatePseudoVector(text: string): number[] {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        const vector: number[] = [];
        for (let i = 0; i < 32; i++) {
            // 用雜湊值衍生偽隨機向量
            const val = Math.sin(hash + i) * 10000;
            vector.push((val - Math.floor(val)) * 2 - 1);
        }
        // v9.0 預留 1536 維度
        while (vector.length < 1536) vector.push(0);
        return vector;
    }

    private calculateMagnitude(v: number[]): number {
        if (!v || v.length === 0) return 0;
        return Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
    }

    private cosineSimilarity(v1: number[], m1: number, v2: number[], m2: number): number {
        if (m1 === 0 || m2 === 0 || !v1 || !v2) return 0;
        let dotProduct = 0;
        const len = Math.min(v1.length, v2.length, 32);
        for (let i = 0; i < len; i++) {
            dotProduct += v1[i] * v2[i];
        }
        return dotProduct / (m1 * m2);
    }
}

export const gnosisEngine = GnosisVectorEngine.getInstance();
