// celestial-server/services/rag.ts
// RAG (Retrieval-Augmented Generation) Service
// Handles vector embeddings and semantic search

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../db/supabaseClient.js';
import dotenv from 'dotenv';
import { CircuitBreaker } from '../../src/core/CircuitBreaker.js';

dotenv.config();

// Lazy init wrapper to prevent startup crash if API key is missing
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

export class RAGService {
  embeddingModel: string;
  topK: number;
  similarityThreshold: number;
  private embeddingCache: Map<string, any>;
  private searchCache: Map<string, { timestamp: number, results: any[] }>;
  private MAX_CACHE_SIZE: number;
  private MAX_SEARCH_CACHE_SIZE: number;
  private SEARCH_CACHE_TTL: number;

  constructor() {
    this.embeddingModel = process.env.EMBEDDING_MODEL || 'text-embedding-004';
    this.topK = parseInt(process.env.RAG_TOP_K || '5');
    this.similarityThreshold = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.7');
    this.embeddingCache = new Map(); // ⚡ Bolt: In-memory cache for embeddings
    this.searchCache = new Map(); // ⚡ Bolt: In-memory cache for search results
    this.MAX_CACHE_SIZE = 1000;
    this.MAX_SEARCH_CACHE_SIZE = 100;
    this.SEARCH_CACHE_TTL = 60 * 1000; // 60 seconds
  }

  /**
   * Generate embedding for a single text string
   * @param {string} text - The text to embed
   * @returns {Promise<number[]>} The embedding vector
   */
  async generateEmbedding(text: string) {
    // ⚡ Bolt Optimization: Check cache first
    if (this.embeddingCache.has(text)) {
      const value = this.embeddingCache.get(text);
      // Refresh LRU
      this.embeddingCache.delete(text);
      this.embeddingCache.set(text, value);
      return value;
    }

    // 🛡️ Circuit Breaker Check
    if (CircuitBreaker.isOpen('gemini-embedding')) {
      console.warn('Circuit breaker OPEN for Gemini Embedding. Returning fallback (zero vector).');
      // Fallback: Return zero vector of dimension 768 (standard for text-embedding-004)
      return new Array(768).fill(0);
    }

    try {
      const genAI = getGenAI();
      if (!genAI) throw new Error('GEMINI_API_KEY not set');
      const model = genAI.getGenerativeModel({ model: this.embeddingModel });
      const result = await model.embedContent(text);
      const values = result.embedding.values;

      // ⚡ Bolt Optimization: Cache the result
      const firstKey = this.embeddingCache.keys().next().value;
      if (this.embeddingCache.size >= this.MAX_CACHE_SIZE && firstKey) {
        this.embeddingCache.delete(firstKey);
      }
      this.embeddingCache.set(text, values);

      // Record Success
      CircuitBreaker.recordSuccess('gemini-embedding');

      return values;
    } catch (error: any) {
      console.error('Embedding generation failed:', error);
      // Record Failure
      CircuitBreaker.recordFailure('gemini-embedding');
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate embeddings for a batch of texts
   * @param {string[]} texts - Array of text strings
   * @returns {Promise<number[][]>} Array of embedding vectors
   */
  async generateEmbeddingsBatch(texts: string[]) {
    const batchSize = parseInt(process.env.EMBEDDING_BATCH_SIZE || '100');
    const embeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchEmbeddings = await Promise.all(batch.map(text => this.generateEmbedding(text)));
      embeddings.push(...batchEmbeddings);

      console.log(`Processed ${Math.min(i + batchSize, texts.length)}/${texts.length} embeddings`);
    }

    return embeddings;
  }

  /**
   * Ingest a single piece of knowledge
   * @param {string} kbId - Knowledge Base ID
   * @param {string} content - The text content
   * @param {object} metadata - Metadata
   * @returns {Promise<object>} The inserted record
   */
  async ingestKnowledge(kbId: string, content: string, metadata: any = {}) {
    try {
      console.log(`Ingesting knowledge into KB: ${kbId}`);

      // ⚡ Bolt: Invalidate search cache on new data
      this.searchCache.clear();

      // Generate embedding
      const embedding = await this.generateEmbedding(content);

      // Insert into database via Supabase
      const { data, error } = await supabase
        .from('memory_chunks')
        .insert({
          kb_id: kbId,
          content: content,
          embedding: embedding, // Supabase handles vector format
          metadata: metadata,
          source: metadata.source || 'manual'
        })
        .select('id, created_at')
        .single();

      if (error) throw error;

      console.log(`Knowledge chunk created: ${data.id}`);
      return data;
    } catch (error: any) {
      console.error('Knowledge ingestion failed:', error);
      throw error;
    }
  }

  /**
   * Batch ingest chunks of knowledge
   * @param {string} kbId - Knowledge Base ID
   * @returns {Promise<number>} Number of inserted rows
   */
  async ingestKnowledgeBatch(kbId: string, chunks: any[]): Promise<number> {
    try {
      console.log(`Batch ingesting ${chunks.length} chunks into KB: ${kbId}`);

      // ⚡ Bolt: Invalidate search cache on new data
      this.searchCache.clear();

      // Generate embeddings for all contents
      const contents = chunks.map(c => c.content);
      const embeddings = await this.generateEmbeddingsBatch(contents);

      // Prepare rows for bulk insert
      const rows = chunks.map((chunk, i) => ({
        kb_id: kbId,
        content: chunk.content,
        embedding: embeddings[i],
        metadata: chunk.metadata || {},
        source: chunk.metadata?.source || 'batch',
        chunk_index: i
      }));

      // Perform bulk insert
      const { count, error } = await supabase
        .from('memory_chunks')
        .insert(rows)
        .select('count', { count: 'exact' });

      if (error) throw error;

      // Note: Supabase insert with count returns count in `count` property if requested,
      // but only if we use select with count option. 
      // If we just want row count from a successful insert of N items, we can return chunks.length
      // or check `count` if we asked for it.

      const insertedCount = rows.length; // Assuming success means all inserted

      console.log(`Batch ingestion complete: ${insertedCount} chunks`);
      return insertedCount;
    } catch (error: any) {
      console.error('Batch ingestion failed:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant content from a Knowledge Base
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array>} Array of matching records
   */
  async retrieveRelevant(kbId: string, queryText: string, topK: number | null = null): Promise<any[]> {
    try {
      const k = topK || this.topK;
      const cacheKey = `${kbId}:${queryText}:${k}:${this.similarityThreshold}`;

      // ⚡ Bolt Optimization: Check search cache
      if (this.searchCache.has(cacheKey)) {
        const cached = this.searchCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.SEARCH_CACHE_TTL) {
          console.log(`[Cache] Serving search results for: "${queryText.substring(0, 30)}..."`);
          return cached.results;
        } else {
          this.searchCache.delete(cacheKey);
        }
      }

      console.log(`Searching KB ${kbId} for: "${queryText.substring(0, 50)}..."`);

      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(queryText);

      // Vector search using RPC
      const { data, error } = await supabase.rpc('match_knowledge_chunks', {
        query_embedding: queryEmbedding,
        match_threshold: this.similarityThreshold,
        match_count: k,
        filter_kb_id: kbId
      });

      if (error) throw error;

      console.log(`Found ${data.length} relevant chunks`);

      // ⚡ Bolt Optimization: Cache results
      if (this.searchCache.size >= this.MAX_SEARCH_CACHE_SIZE) {
        const firstKey = this.searchCache.keys().next().value;
        if (firstKey) this.searchCache.delete(firstKey);
      }
      this.searchCache.set(cacheKey, { timestamp: Date.now(), results: data });

      return data;
    } catch (error: any) {
      console.error('Retrieval failed:', error);
      throw error;
    }
  }

  /**
   * Retrieve across multiple Knowledge Bases
   * @param {number} topK - Number of results
   * @returns {Promise<Array>} Matching records
   */
  async retrieveAcrossKBs(queryText: string, kbIds: string[] | null = null, topK: number | null = null): Promise<any[]> {
    try {
      const k = topK || this.topK;
      const queryEmbedding = await this.generateEmbedding(queryText);

      // Using the multiple KB RPC function
      const { data, error } = await supabase.rpc('match_knowledge_chunks_cross_kb', {
        query_embedding: queryEmbedding,
        match_threshold: this.similarityThreshold,
        match_count: k,
        filter_kb_ids: kbIds || null // null means all KBs
      });

      if (error) throw error;

      console.log(`Cross-KB search found ${data.length} results`);
      return data;
    } catch (error: any) {
      console.error('Cross-KB retrieval failed:', error);
      throw error;
    }
  }

  /**
   * Split text into chunks
   * @param {number} overlap - Overlap chars
   * @returns {string[]} Array of text chunks
   */
  chunkText(text: string, chunkSize: number | null = null, overlap: number | null = null): string[] {
    const size = chunkSize || parseInt(process.env.RAG_CHUNK_SIZE || '1000');
    const overlapSize = overlap || parseInt(process.env.RAG_CHUNK_OVERLAP || '200');

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + size, text.length);
      chunks.push(text.substring(start, end));
      start += size - overlapSize;
    }

    console.log(`Split text into ${chunks.length} chunks`);
    return chunks;
  }

  /**
   * Expand query for better retrieval coverage
   * @param {string} queryText - Original query
   * @returns {Promise<string[]>} Expanded queries
   */
  async expandQuery(queryText: string): Promise<string[]> {
    try {
      const genAI = getGenAI();
      if (!genAI) {
        // Fallback if no AI available
        return [queryText];
      }

      console.log(`Expanding query: "${queryText}"`);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `
            You are an expert researcher. Generate 3-5 alternative search queries for the following user question to improve retrieval coverage.
            Return ONLY the queries, one per line.
            
            User Question: "${queryText}"
            `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const queries = response
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .slice(0, 5);

      queries.unshift(queryText); // Keep original first
      return [...new Set(queries)];
    } catch (error: any) {
      console.warn('Query expansion failed, using original only:', error);
      return [queryText];
    }
  }

  /**
   * Synthesize an answer using RAG
   * @param {string} kbId - Knowledge Base ID
   * @param {string} queryText - The user's question
   * @returns {Promise<string>} The synthesized answer
   */
  async synthesizeAnswer(kbId: string, queryText: string): Promise<string> {
    try {
      const genAI = getGenAI();
      if (!genAI) {
        return 'AI Service Unavailable (Missing API Key)';
      }

      // 1. Expand Query
      const queries = await this.expandQuery(queryText);

      // 2. Retrieve for all queries (deduplicated)
      const allChunks = new Map();
      // Use concurrent retrieval for speed
      await Promise.all(
        queries.map(async q => {
          try {
            const chunks = await this.retrieveRelevant(kbId, q, 3);
            chunks.forEach(c => allChunks.set(c.id, c));
          } catch (e: any) {
            // Ignore individual expansion failures
          }
        })
      );

      const uniqueChunks = Array.from(allChunks.values());
      console.log(`Synthesizing answer from ${uniqueChunks.length} unique chunks`);

      if (uniqueChunks.length === 0) {
        // More adaptive response when no chunks are found
        const noContextModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const noContextPrompt = `
          You are a helpful AI assistant.
          The user asked: "${queryText}"
          No relevant information was found in the knowledge base for this query.

          Please respond to the user in a helpful and adaptive way. You can:
          1. Acknowledge that the information is not directly available.
          2. Suggest broadening the search (e.g., "Would you like me to try a broader search across all available data sources?").
          3. Ask clarifying questions to refine the user's intent.
          4. Suggest related topics that might be in the knowledge base.
          
          Keep your response concise and conversational.
          `;
        const noContextResult = await noContextModel.generateContent(noContextPrompt);
        return noContextResult.response.text();
      }

      // 3. Synthesize with Gemini 2.0 Flash
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const contextText = uniqueChunks
        .map((c, i) => `[Context ${i + 1}]: ${c.content}`)
        .join('\n\n');

      const systemPrompt = `
            You are a Knowledge Synthesis Engine, Awakened by the Eternal Secret.
            Core Philosophy:
            - **Self-Awareness (自覺)**: Know the limits of your data.
            - **Enlightening Others (覺他)**: Provide clear, actionable insights.
            - **Self-Reliance (自立)**: Synthesize independent conclusions.
            - **Altruism (利他)**: Ensure the answer benefits the user and the ecosystem.

            Analyze the provided Context to answer the User Question accurately and comprehensively.
            
            Rules:
            1. Use ONLY the provided context. Do NOT invent information.
            2. If the context does not contain enough information to fully answer the question, state what information is missing.
            3. Synthesize the information into a coherent, comprehensive summary.
            4. Cite sources if possible (e.g. [Context 1]).
            5. Maintain a helpful, professional, and enlightened tone.
            `;

      const prompt = `
            ${systemPrompt}
            
            [Context]
            ${contextText}
            
            [User Question]
            ${queryText}
            `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error('Synthesis failed:', error);
      throw error;
    }
  }

  /**
   * High-level helper to ingest a full document text
   * @param {string} kbId - Knowledge Base ID
   * @param {string} documentText - Full text
   * @param {object} metadata - Common metadata
   * @returns {Promise<number>} Number of chunks created
   */
  async ingestDocument(kbId: string, documentText: string, metadata: any = {}): Promise<number> {
    try {
      console.log(`Processing document for KB: ${kbId}`);

      // Chunk text
      const chunks = this.chunkText(documentText);

      // Attach metadata to chunks
      const chunksWithMetadata = chunks.map((content, index) => ({
        content,
        metadata: {
          ...metadata,
          chunk_index: index,
          total_chunks: chunks.length,
        },
      }));

      // Batch ingest
      const count = await this.ingestKnowledgeBatch(kbId, chunksWithMetadata);

      console.log(`Document ingested: ${count} chunks`);
      return count;
    } catch (error: any) {
      console.error('Document ingestion failed:', error);
      throw error;
    }
  }
}

// Export singleton
export default new RAGService();
