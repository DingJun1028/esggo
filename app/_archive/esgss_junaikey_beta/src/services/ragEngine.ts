import { omniKnowledge } from './omniKnowledge.js';
import { omniLogger } from './omniLogger.js';
import { ESGKnowledgeBase } from '../types/omniCore.js';

export interface RetrievedKnowledge {
  id: string;
  content: string;
  relevance_score: number;
  source: string;
  timestamp: number;
  knowledgeBase?: ESGKnowledgeBase;
}

export interface Citation {
  text: string;
  source: string;
  confidence: number;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
  retrieved_knowledge: RetrievedKnowledge[];
}

export interface RAGRetrieveOptions {
  limit?: number;
  knowledgeBases?: ESGKnowledgeBase[];
}

class RAGEngine {
  /**
   * Retrieve relevant knowledge
   */
  async retrieve(query: string, options: RAGRetrieveOptions = {}): Promise<RetrievedKnowledge[]> {
    const limit = options.limit || 5;
    const targetBases = options.knowledgeBases || [];

    // Retrieve from Omni Knowledge Base
    const allKnowledge = omniKnowledge.query({
      limit: limit * 5, // Retrieve more for filtering
    });

    // Calculate relevance score and filter by knowledge base
    const scored = allKnowledge
      .filter(k => {
        if (targetBases.length === 0) return true;
        const kb = k.metadata.knowledgeBase as ESGKnowledgeBase;
        return targetBases.includes(kb);
      })
      .map(k => ({
        id: k.id,
        content: k.content,
        relevance_score: this.calculateRelevance(query, k.content),
        source: k.evidence.source,
        timestamp: k.metadata.timestamp,
        knowledgeBase: k.metadata.knowledgeBase as ESGKnowledgeBase,
      }));

    // Sort by relevance and take top N
    return scored.sort((a, b) => b.relevance_score - a.relevance_score).slice(0, limit);
  }

  /**
   * Augment prompt with context
   */
  async augmentPrompt(query: string, options: RAGRetrieveOptions = {}): Promise<string> {
    const context = await this.retrieve(query, options);
    if (context.length === 0) return query;

    const contextText = context
      .map((k, i) => `[資料集: ${k.knowledgeBase}] [來源: ${k.source}]\n${k.content}`)
      .join('\n\n');

    return `請根據以下 ESG 專業知識庫背景資訊回應該問題：

---
${contextText}
---

問題：${query}

請在回答中根據上述資訊進行事實對齊 (Fact Alignment)，並在適當處引用來源。`;
  }

  /**
   * Smart Q&A
   */
  async ask(query: string, options: RAGRetrieveOptions = {}): Promise<RAGResponse> {
    const context = await this.retrieve(query, options);
    return this.generate(query, context);
  }

  /**
   * Generate enhanced response
   */
  async generate(query: string, context: RetrievedKnowledge[]): Promise<RAGResponse> {
    // Build context
    const contextText = context
      .map(k => `[KB: ${k.knowledgeBase}] [Source: ${k.source}]\n${k.content}`)
      .join('\n\n');

    // Generate response (actual AI model should be called here)
    const answer = await this.generateWithContext(query, contextText);

    // Extract citations
    const citations = this.extractCitations(answer, context);

    // Calculate confidence
    const confidence = this.calculateConfidence(context, citations);

    omniLogger.info(LogCategory.SYSTEM, 'RAG', 'RAG response generated', {
      query,
      confidence,
      citations_count: citations.length,
    });

    return {
      answer,
      citations,
      confidence,
      retrieved_knowledge: context,
    };
  }

  /**
   * Calculate relevance score
   */
  private calculateRelevance(query: string, content: string): number {
    const queryWords = this.tokenize(query.toLowerCase());
    const contentWords = this.tokenize(content.toLowerCase());

    // Simple word overlap calculation
    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.includes(word)) {
        matches++;
      }
    }

    return queryWords.length > 0 ? matches / queryWords.length : 0;
  }

  /**
   * Generate response with context
   */
  private async generateWithContext(query: string, context: string): Promise<string> {
    // Actual AI model should be called here
    // For now, simulating an augmented response
    if (context.length === 0) return `I don't have enough specific ESG context for "${query}".`;

    return `根據智庫檢索結果：\n\n${context.substring(0, 500)}...\n\n針對您的問題「${query}」，這涉及到 ESG 標準中的核心原則... (模擬增強回答)`;
  }

  /**
   * Extract citations
   */
  private extractCitations(answer: string, context: RetrievedKnowledge[]): Citation[] {
    const citations: Citation[] = [];

    for (const k of context) {
      // Check if this knowledge was used in the response
      if (this.isUsedInAnswer(answer, k.content)) {
        citations.push({
          text: k.content.substring(0, 100) + '...',
          source: k.source,
          confidence: k.relevance_score,
        });
      }
    }

    return citations;
  }

  /**
   * Calculate confidence
   */
  private calculateConfidence(context: RetrievedKnowledge[], citations: Citation[]): number {
    if (context.length === 0) return 0.2; // Base confidence

    const avgRelevance = context.reduce((sum, k) => sum + k.relevance_score, 0) / context.length;
    const citationRatio = context.length > 0 ? citations.length / context.length : 0;

    return Math.min(1, avgRelevance * 0.6 + citationRatio * 0.4 + 0.1);
  }

  /**
   * Check if knowledge is used
   */
  private isUsedInAnswer(answer: string, knowledge: string): boolean {
    const knowledgeWords = this.tokenize(knowledge.toLowerCase());
    const answerLower = answer.toLowerCase();

    let matchCount = 0;
    for (const word of knowledgeWords) {
      if (answerLower.includes(word)) {
        matchCount++;
      }
    }

    return knowledgeWords.length > 0 ? matchCount / knowledgeWords.length > 0.2 : false;
  }

  /**
   * Tokenization
   */
  private tokenize(text: string): string[] {
    return text.split(/[\s,，。！？；：、]+/).filter(word => word.length > 0);
  }
}

// Singleton Instance
export const ragEngine = new RAGEngine();
