import { supabase, isSupabaseConfigured } from '@/lib/supabase.js';
import { omniLogger, LogCategory } from '@/utils/OmniLogger.js';
import { fetchCsrfToken } from '../api/csrfService.js';

export interface KnowledgeItem {
    id: string;
    content: string;
    metadata: Record<string, any>;
    similarity: number;
}

interface CachedContext {
    query: string;
    items: KnowledgeItem[];
    timestamp: number;
}

class KnowledgeSanctuaryService {
    private isEnabled: boolean = false;
    private contextCache: Map<string, CachedContext> = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    private readonly MAX_CACHE_SIZE = 100;

    constructor() {
        this.isEnabled = isSupabaseConfigured;
        if (this.isEnabled) {
            omniLogger.info(LogCategory.AI, 'Knowledge Sanctuary (RAG) Service Initialized');
        } else {
            omniLogger.warn(LogCategory.AI, 'Knowledge Sanctuary disabled: Supabase not configured');
        }
    }

    /**
     * Retrieves relevant context from the Vector Store (Knowledge Sanctuary)
     * @param query The user's question or topic
     * @param limit Max number of items to retrieve
     */
    public async retrieveContext(query: string, limit: number = 3): Promise<KnowledgeItem[]> {
        // Check cache first
        const cacheKey = this.generateCacheKey(query, limit);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            omniLogger.debug(LogCategory.AI, `RAG Cache Hit: ${query.substring(0, 50)}...`);
            return cached;
        }

        if (!this.isEnabled || !supabase) {
            omniLogger.warn(LogCategory.AI, 'RAG Retrieval skipped: Service disabled');
            const mockData = this.getMockContext(query);
            this.saveToCache(cacheKey, mockData);
            return mockData;
        }

        try {
            // Generate embedding for the query
            const embedding = await this.generateEmbedding(query);

            if (!embedding) {
                const mockData = this.getMockContext(query);
                this.saveToCache(cacheKey, mockData);
                return mockData;
            }

            const { data, error } = await supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.7, // Similarity threshold
                match_count: limit,
            });

            if (error) {
                omniLogger.error(LogCategory.AI, 'Vector Store Match Failed', error);
                const mockData = this.getMockContext(query);
                this.saveToCache(cacheKey, mockData);
                return mockData;
            }

            if (!data || data.length === 0) {
                this.saveToCache(cacheKey, []);
                return [];
            }

            const result: KnowledgeItem[] = data.map((item: any) => ({
                id: item.id,
                content: item.content,
                metadata: item.metadata,
                similarity: item.similarity,
            }));

            this.saveToCache(cacheKey, result);
            return result;

        } catch (err) {
            omniLogger.error(LogCategory.AI, 'Knowledge Retrieval Exception', err);
            const mockData = this.getMockContext(query);
            this.saveToCache(cacheKey, mockData);
            return mockData;
        }
    }

    /**
     * Generates embeddings using the backend API
     * @param text The text to embed
     */
    private async generateEmbedding(text: string): Promise<number[] | null> {
        try {
            const csrfToken = await fetchCsrfToken();
            const response = await fetch('/api/ai/embedding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || '',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                omniLogger.warn(LogCategory.AI, 'Embedding API failed, using fallback');
                return null;
            }

            const data = await response.json();
            return data.embedding || null;
        } catch (error) {
            omniLogger.error(LogCategory.AI, 'Embedding generation error', error);
            return null;
        }
    }

    /**
     * Clears the context cache
     */
    public clearCache(): void {
        this.contextCache.clear();
        omniLogger.info(LogCategory.AI, 'Knowledge Sanctuary cache cleared');
    }

    /**
     * Gets cache statistics
     */
    public getCacheStats(): { size: number; keys: string[] } {
        return {
            size: this.contextCache.size,
            keys: Array.from(this.contextCache.keys())
        };
    }

    private generateCacheKey(query: string, limit: number): string {
        return `${query.substring(0, 100).toLowerCase().replace(/\s+/g, '_')}_${limit}`;
    }

    private getFromCache(cacheKey: string): KnowledgeItem[] | null {
        const cached = this.contextCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.items;
        }
        return null;
    }

    private saveToCache(cacheKey: string, items: KnowledgeItem[]): void {
        // Prevent memory leaks by limiting cache size
        if (this.contextCache.size >= this.MAX_CACHE_SIZE) {
            // Remove oldest entry
            const firstKey = this.contextCache.keys().next().value;
            if (firstKey !== undefined) {
                this.contextCache.delete(firstKey);
            }
        }
        this.contextCache.set(cacheKey, {
            query: cacheKey,
            items,
            timestamp: Date.now()
        });
    }

    private getMockContext(query: string): KnowledgeItem[] {
        // Fallback for demo/dev without full Vector DB setup
        return [
            {
                id: 'mock-1',
                content: 'The 5T Protocol requires all data to be: Traceable, Trackable, Transparent, Trustworthy, and Tangible.',
                metadata: { source: 'Protocol Whitepaper_v2.pdf' },
                similarity: 0.95
            },
            {
                id: 'mock-2',
                content: 'JunAiKey acts as the sovereign key to the user\'s digital assets, ensuring they own their data.',
                metadata: { source: 'System_Architecture.md' },
                similarity: 0.88
            }
        ];
    }
}

export const knowledgeSanctuary = new KnowledgeSanctuaryService();
