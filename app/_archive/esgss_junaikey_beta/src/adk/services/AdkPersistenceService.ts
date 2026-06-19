import { ncb } from '@/lib/ncb/client';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { SearchWorkflowState } from '../types/AdkSearchTypes';

import { vectorService } from '../../1-service/VectorEmbeddingService';

/**
 * ADK Persistence Service
 * Handles saving and loading of research workflow states.
 */
export class AdkPersistenceService {
    /**
     * Save research state to NoCodeBackend
     * Note: NCB client doesn't support upsert with onConflict yet, so we emulate it.
     */
    static async saveResearch(sessionId: string, query: string, state: SearchWorkflowState, result?: any) {
        try {
            // Check if exists
            const { data: existing, error: checkError } = await ncb
                .from('adk_research_logs')
                .select('session_id')
                .eq('session_id', sessionId)
                .single();

            const payload = {
                session_id: sessionId,
                query,
                refined_query: state.analysisResult,
                state,
                result,
                updated_at: new Date().toISOString()
            };

            let operation;
            if (existing) {
                // Update
                operation = await ncb
                    .from('adk_research_logs')
                    .update(payload)
                    .eq('session_id', sessionId);
            } else {
                // Insert
                operation = await ncb
                    .from('adk_research_logs')
                    .insert(payload);
            }

            if (operation.error) throw operation.error;
            return { success: true, data: operation.data };
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[AdkPersistenceService] Failed to save research:', { error })
            return { success: false, error };
        }
    }

    /**
     * Load research state by session ID
     */
    static async loadResearch(sessionId: string) {
        try {
            const { data, error } = await ncb
                .from('adk_research_logs')
                .select('*')
                .eq('session_id', sessionId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[AdkPersistenceService] Failed to load research:', { error })
            return { success: false, error };
        }
    }

    /**
     * List all research history
     */
    static async listHistory(limit = 10) {
        try {
            const { data, error } = await ncb
                .from('adk_research_logs')
                .select('session_id, query, created_at')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[AdkPersistenceService] Failed to list history:', { error })
            return { success: false, error };
        }
    }

    /**
     * Semantic Search for similar research (pgvector integration)
     * Note: RPC and Vector Search are not directly supported by the simple NCB client yet.
     * Falling back to basic text matching for now.
     */
    static async findSimilarResearch(query: string, limit = 3) {
        try {
            omniLogger.info(LogCategory.AI, `🔍 [MEMORY] Searching for contextual research: ${query}`);

            // 1. Generate Query Embedding (Still useful if we were using a vector DB, but simplified here)
            // const embedding = await vectorService.generateEmbedding(query);

            // 2. Call Supabase RPC for vector similarity search -> DISABLED for NCB Migration
            // const { data, error } = await supabase.rpc('match_adk_research', ...);

            omniLogger.warn(LogCategory.SYSTEM, `[MEMORY] Vector/RPC search unavailable in NCB client. Falling back to basic 'like' search.`);

            // Fallback to basic text search
            const { data: textData, error: textError } = await ncb
                .from('adk_research_logs')
                .select('*')
                .like('query', `%${query}%`) // Basic LIKE search
                .limit(limit);

            if (textError) throw textError;
            return { success: true, data: textData };

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[MEMORY] Search failed: ${error}`);
            return { success: false, error };
        }
    }

    /**
     * Save sentient lineage (bloodline of agent thoughts)
     */
    static async saveLineage(entry: {
        session_id: string;
        query: string;
        phase: string;
        agent_name: string;
        thought_process?: string;
        innovation_delta?: string;
        metadata?: any;
    }) {
        try {
            const { data, error } = await ncb
                .from('adk_sentient_lineage')
                .insert({
                    ...entry,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[AdkPersistenceService] Failed to save lineage:', { error })
            return { success: false, error };
        }
    }
}
