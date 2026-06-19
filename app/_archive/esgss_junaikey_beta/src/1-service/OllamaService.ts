import { omniLogger, LogCategory } from './omniLogger';

// Ollama API 配置
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

  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  /**
   * 檢查 Ollama 服務是否可用
   */
  private async checkAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        const hasModel = data.models?.some((m: any) => m.name === this.config.model);

        if (hasModel) {
          this.isAvailable = true;
          omniLogger.info(LogCategory.AI, `Ollama 服務可用，模型：${this.config.model}`);
        } else {
          omniLogger.warn(LogCategory.AI, `Ollama 可用但缺少模型：${this.config.model}`);
        }
      }
    } catch (error) {
      omniLogger.warn(LogCategory.AI, 'Ollama 服務不可用，向量搜索將被禁用', { error });
    }
  }

  /**
   * 檢查服務狀態
   */
  public async isReady(): Promise<boolean> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }
    return this.isAvailable;
  }

  /**
   * 生成文本嵌入向量
   */
  public async generateEmbedding(text: string): Promise<number[] | null> {
    if (!(await this.isReady())) {
      omniLogger.warn(LogCategory.AI, 'Ollama 不可用，跳過嵌入生成');
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
        throw new Error(`Ollama API 錯誤：${response.status}`);
      }

      const data: EmbeddingResponse = await response.json();

      if (!data.embedding || data.embedding.length === 0) {
        throw new Error('Ollama 返回空嵌入向量');
      }

      return data.embedding;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        omniLogger.error(LogCategory.AI, 'Ollama 請求超時');
      } else {
        omniLogger.error(LogCategory.AI, 'Ollama 嵌入生成失敗', { error });
      }
      return null;
    }
  }

  /**
   * 批量生成嵌入（優化性能）
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
   * 計算餘弦相似度
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('向量維度不匹配');
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
   * 語義搜索：找到與查詢最相似的項目
   */
  public async semanticSearch(
    query: string,
    candidates: Array<{ id: string; text: string; embedding?: number[]; data?: any }>,
    topK: number = 5,
    threshold: number = 0.5
  ): Promise<SemanticSearchResult[]> {
    // 生成查詢嵌入
    const queryEmbedding = await this.generateEmbedding(query);
    if (!queryEmbedding) {
      return [];
    }

    const results: SemanticSearchResult[] = [];

    for (const candidate of candidates) {
      let candidateEmbedding = candidate.embedding;

      // 如果候選項沒有嵌入，現場生成
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

    // 按相似度降序排序，取 topK
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  /**
   * 將文本轉換為嵌入並返回診斷信息
   */
  public async diagnoseEmbedding(text: string): Promise<{
    success: boolean;
    dimension?: number;
    sample?: number[];
    error?: string;
  }> {
    const embedding = await this.generateEmbedding(text);

    if (!embedding) {
      return { success: false, error: 'Ollama 不可用或生成失敗' };
    }

    return {
      success: true,
      dimension: embedding.length,
      sample: embedding.slice(0, 5), // 前 5 個值作為樣本
    };
  }
}

// 單例導出
export const OllamaService = new OllamaServiceClass();
