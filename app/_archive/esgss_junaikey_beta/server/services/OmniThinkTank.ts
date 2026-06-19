/**
 * 奧秘智庫 (Omni Think Tank)
 * --------------------------------------------------
 * [核心] RAG (Retrieval-Augmented Generation) 知識引擎
 * [功能] 知識吸收、脈絡檢索、智慧合成
 * [協議] Trinity Protocol Compatible
 * 
 * @version 1.0.0
 * @date 2026-02-14
 */

import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import { OmniRequest, OmniResponse, createOmniResponse } from './OmniGateway.js';
import omniPriest from './OmniPriest.js';
import { OmniErrorCode } from '../../src/types/errorCodes.js';

import { omniSupabase } from './OmniSupabase.js';

// Interface for Document Chunk
interface KnowledgeChunk {
    id?: string;
    content: string;
    tags: string[];
    embedding?: number[];
    sourceId: string;
    createdAt?: number;
    metadata?: any;
}

export class OmniThinkTank {
    private static instance: OmniThinkTank;
    // private memory: Map<string, KnowledgeChunk> = new Map(); // Deprecated: In-memory storage
    private isInitialized = false;

    private constructor() { }

    public static getInstance(): OmniThinkTank {
        if (!OmniThinkTank.instance) {
            OmniThinkTank.instance = new OmniThinkTank();
        }
        return OmniThinkTank.instance;
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        omniLogger.info(LogCategory.AI, '🧠 OmniThinkTank initializing...');
        const supabase = omniSupabase.getClient();
        if (supabase) {
            omniLogger.info(LogCategory.AI, '🔹 Connected to OmniSupabase.');
        } else {
            omniLogger.warn(LogCategory.AI, '🔸 Running in volatile mode (In-Memory only fallback - NOT IMPLEMENTED).');
        }
        this.isInitialized = true;
    }

    /**
     * Process Trinity Requests directed to ThinkTank
     */
    public async processRequest(request: OmniRequest): Promise<OmniResponse> {
        if (!this.isInitialized) await this.initialize();

        const { action, data } = request.payload;

        switch (action) {
            case 'ingest':
                return this.handleIngest(request, data);
            case 'recall':
                return this.handleRecall(request, data);
            case 'synthesize':
                return this.handleSynthesize(request, data);
            default:
                return createOmniResponse(request, false, undefined, {
                    code: OmniErrorCode.INVALID_ACTION,
                    message: `Unknown ThinkTank action: ${action}`,
                    retryable: false
                });
        }
    }

    /**
     * Ingest Knowledge
     */
    private async handleIngest(request: OmniRequest, data: any): Promise<OmniResponse> {
        try {
            const { content, tags = [], sourceId = 'unknown', kbId = 'global' } = data;

            if (!content) {
                return createOmniResponse(request, false, undefined, {
                    code: OmniErrorCode.VALIDATION_ERROR,
                    message: 'Content is required for ingestion',
                    retryable: false
                });
            }

            // Simple chunking (split by paragraphs)
            const chunks = (content as string).split('\n\n').filter(c => c.trim().length > 0);
            const knowledgeIds: string[] = [];
            const supabase = omniSupabase.getClient();

            for (let i = 0; i < chunks.length; i++) {
                const text = chunks[i];
                const id = uuidv4();

                // Generate Embedding via OmniPriest
                let embedding: number[] | undefined;
                try {
                    embedding = await omniPriest.embed(text);
                } catch (e) {
                    omniLogger.warn(LogCategory.AI, `[ThinkTank] Embedding generation failed for chunk ${id}`, { error: e });
                    continue; // Skip chunk if embedding fails
                }

                if (supabase && embedding) {
                    const { error } = await supabase
                        .from('memory_chunks')
                        .insert({
                            id: id,
                            content: text,
                            embedding: embedding,
                            kb_id: kbId,
                            source: sourceId,
                            metadata: { tags },
                            chunk_index: i
                        });

                    if (error) {
                        omniLogger.error(LogCategory.AI, `[ThinkTank] Supabase insert failed`, { error });
                        throw new Error(`Persistence failed: ${error.message}`);
                    }
                    knowledgeIds.push(id);
                }
            }

            omniLogger.info(LogCategory.AI, `[ThinkTank] Ingested ${knowledgeIds.length} chunks`);

            return createOmniResponse(request, true, {
                ids: knowledgeIds,
                count: knowledgeIds.length
            });

        } catch (error) {
            return createOmniResponse(request, false, undefined, {
                code: OmniErrorCode.INTERNAL_ERROR,
                message: (error as Error).message,
                retryable: true
            });
        }
    }

    /**
     * Recall Knowledge (Retrieval)
     */
    private async handleRecall(request: OmniRequest, data: any): Promise<OmniResponse> {
        try {
            const { query, limit = 5, tags, kbId = 'global' } = data;
            const supabase = omniSupabase.getClient();

            if (!supabase) {
                return createOmniResponse(request, false, undefined, {
                    code: OmniErrorCode.DEPENDENCY_ERROR,
                    message: 'Supabase not available for recall',
                    retryable: true
                });
            }

            // Generate query embedding
            const queryEmbedding = await omniPriest.embed(query);

            // RPC Call to match_knowledge_chunks
            const { data: results, error } = await supabase.rpc('match_knowledge_chunks', {
                query_embedding: queryEmbedding,
                match_threshold: 0.5, // TODO: Make configurable
                match_count: limit,
                filter_kb_id: kbId
            });

            if (error) {
                omniLogger.error(LogCategory.AI, `[ThinkTank] Recall RPC failed`, { error });
                throw error;
            }

            return createOmniResponse(request, true, {
                results,
                count: results.length
            });

        } catch (error) {
            return createOmniResponse(request, false, undefined, {
                code: OmniErrorCode.INTERNAL_ERROR,
                message: (error as Error).message,
                retryable: true
            });
        }
    }

    /**
     * Synthesize Answer (RAG)
     */
    private async handleSynthesize(request: OmniRequest, data: any): Promise<OmniResponse> {
        try {
            const { query } = data;

            // 1. Recall related context
            const recallResponse = await this.handleRecall(request, { query, limit: 3 });

            if (!recallResponse.success || !recallResponse.data) {
                return createOmniResponse(request, false, undefined, {
                    code: OmniErrorCode.INTERNAL_ERROR,
                    message: 'Failed to recall knowledge',
                    retryable: true
                });
            }

            // Fix typings: cast unknown data to object with results
            const recallData = recallResponse.data as { results: KnowledgeChunk[] };
            const context = recallData.results
                .map((r: KnowledgeChunk) => r.content)
                .join('\n---\n');

            // 2. Return context for Client Agent to generate final answer
            // (Server-side generation would happen here if we had GeminiService server-side)

            return createOmniResponse(request, true, {
                context,
                query,
                instruction: "Use the provided context to answer the user's query."
            });

        } catch (error) {
            return createOmniResponse(request, false, undefined, {
                code: OmniErrorCode.INTERNAL_ERROR,
                message: (error as Error).message,
                retryable: true
            });
        }
    }
}

export const omniThinkTank = OmniThinkTank.getInstance();
