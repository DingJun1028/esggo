import { omniLogger, LogCategory } from './omniLogger.js';

// Ollama API Configuration
const OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'nomic-embed-text:latest';

interface OllamaConfig {
  baseUrl: string;
  model: string;
  timeout: number;
}

interface EmbeddingRequest {
  model: string;
  prompt: string;
}

interface EmbeddingResponse {
  embedding: number[];
}

interface SemanticSearchResult {
  nodeId: string;
  label: string;
  similarity: number;
  properties?: any;
}

class OllamaServiceClass {
  private config: OllamaConfig = {
    baseUrl: OLLAMA_BASE_URL,
    model: DEFAULT_MODEL,
    timeout: 10000,
  };

  /**
   * Helper to create a timeout signal compatible with older environments
   */
  private getTimeoutSignal(ms: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }

  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  /**
   * Check if Ollama service is available
   */
  private async checkAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: 'GET',
        signal: this.getTimeoutSignal(3000),
      });

      if (response.ok) {
        const data = await response.json();
        const hasModel = data.models?.some((m: any) => m.name === this.config.model);

        if (hasModel) {
          this.isAvailable = true;
          omniLogger.info(LogCategory.AI, `Ollama service available, model: ${this.config.model}`);
        } else {
          omniLogger.warn(
            LogCategory.AI,
            `Ollama available but missing model: ${this.config.model}`
          );
        }
      }
    } catch (error) {
      omniLogger.warn(
        LogCategory.AI,
        'Ollama service unavailable, vector search will be disabled',
        { error }
      );
    }
  }

  /**
   * Check service status
   */
  public async isReady(): Promise<boolean> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }
    return this.isAvailable;
  }

  /**
   * Generate text embedding vector
   */
  public async generateEmbedding(text: string): Promise<number[] | null> {
    if (!(await this.isReady())) {
      omniLogger.warn(LogCategory.AI, 'Ollama unavailable, skipping embedding generation');
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt: text,
        } as EmbeddingRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: EmbeddingResponse = await response.json();

      if (!data.embedding || data.embedding.length === 0) {
        throw new Error('Ollama returned empty embedding vector');
      }

      return data.embedding;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        omniLogger.error(LogCategory.AI, 'Ollama request timeout');
      } else {
        omniLogger.error(LogCategory.AI, 'Ollama embedding generation failed', { error });
      }
      return null;
    }
  }

  /**
   * Batch generate embeddings (Performance optimization)
   */
  public async generateEmbeddings(texts: string[]): Promise<Map<string, number[]>> {
    const embeddings = new Map<string, number[]>();

    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      if (embedding) {
        embeddings.set(text, embedding);
      }
    }

    return embeddings;
  }

  /**
   * Calculate Cosine Similarity
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vector dimensions mismatch');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i]! * vecB[i]!;
      normA += vecA[i]! * vecA[i]!;
      normB += vecB[i]! * vecB[i]!;
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }

  /**
   * Semantic Search: Find items most similar to the query
   */
  public async semanticSearch(
    query: string,
    candidates: Array<{ id: string; text: string; embedding?: number[]; data?: any }>,
    topK: number = 5,
    threshold: number = 0.5
  ): Promise<SemanticSearchResult[]> {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    if (!queryEmbedding) {
      return [];
    }

    const results: SemanticSearchResult[] = [];

    for (const candidate of candidates) {
      let candidateEmbedding = candidate.embedding;

      // If candidate has no embedding, generate on the fly
      if (!candidateEmbedding) {
        const embedding = await this.generateEmbedding(candidate.text);
        candidateEmbedding = embedding === null ? undefined : embedding;
        if (!candidateEmbedding) continue;
      }

      const similarity = this.cosineSimilarity(queryEmbedding, candidateEmbedding);

      if (similarity >= threshold) {
        results.push({
          nodeId: candidate.id,
          label: candidate.text,
          similarity,
          properties: candidate.data,
        });
      }
    }

    // Sort by similarity descending, take topK
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  /**
   * Convert text to embeddings and return diagnostic information
   */
  public async diagnoseEmbedding(text: string): Promise<{
    success: boolean;
    dimension?: number;
    sample?: number[];
    error?: string;
  }> {
    const embedding = await this.generateEmbedding(text);

    if (!embedding) {
      return { success: false, error: 'Ollama unavailable or generation failed' };
    }

    return {
      success: true,
      dimension: embedding.length,
      sample: embedding.slice(0, 5), // First 5 values as sample
    };
  }
}

// Singleton Export
export const OllamaService = new OllamaServiceClass();
