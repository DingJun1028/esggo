/**
 * 🔍 RAG Engine - Retrieval-Augmented Generation
 * --------------------------------------------------
 * [核心] 檢索增強生成系統
 * [功能] 基於事實的回應 + 來源引用
 */

import { omniKnowledge } from './omniKnowledge';
import { omniLogger, LogCategory } from './omniLogger';

export interface RetrievedKnowledge {
  id: string;
  content: string;
  relevance_score: number;
  source: string;
  timestamp: number;
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

class RAGEngine {
  /**
   * 檢索相關知識
   */
  async retrieve(query: string, limit: number = 5): Promise<RetrievedKnowledge[]> {
    // 從奧秘智庫檢索
    const allKnowledge = omniKnowledge.query({
      limit: limit * 2, // 多檢索一些以便篩選
    });

    // 計算相關性分數
    const scored = allKnowledge.map(k => ({
      id: k.id,
      content: k.content,
      relevance_score: this.calculateRelevance(query, k.content),
      source: k.evidence.source,
      timestamp: k.metadata.timestamp,
    }));

    // 按相關性排序並取前 N 個
    return scored.sort((a, b) => b.relevance_score - a.relevance_score).slice(0, limit);
  }

  /**
   * 生成增強回應
   */
  async generate(query: string, context: RetrievedKnowledge[]): Promise<RAGResponse> {
    // 構建上下文
    const contextText = context.map(k => `[來源: ${k.source}]\n${k.content}`).join('\n\n');

    // 生成回應（這裡應該調用實際的 AI 模型）
    const answer = await this.generateWithContext(query, contextText);

    // 提取引用
    const citations = this.extractCitations(answer, context);

    // 計算信心度
    const confidence = this.calculateConfidence(context, citations);

    omniLogger.info(LogCategory.SYSTEM, 'RAG response generated', {
      module: 'RAG',
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
   * 計算相關性分數
   */
  private calculateRelevance(query: string, content: string): number {
    const queryWords = this.tokenize(query.toLowerCase());
    const contentWords = this.tokenize(content.toLowerCase());

    // 簡單的詞彙重疊計算
    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.includes(word)) {
        matches++;
      }
    }

    return queryWords.length > 0 ? matches / queryWords.length : 0;
  }

  /**
   * 生成帶上下文的回應
   */
  private async generateWithContext(query: string, context: string): Promise<string> {
    // 這裡應該調用實際的 AI 模型
    // 暫時返回基於上下文的簡單回應
    return `基於檢索到的知識：\n${context}\n\n回答：${query}`;
  }

  /**
   * 提取引用
   */
  private extractCitations(answer: string, context: RetrievedKnowledge[]): Citation[] {
    const citations: Citation[] = [];

    for (const k of context) {
      // 檢查回應中是否使用了這個知識
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
   * 計算信心度
   */
  private calculateConfidence(context: RetrievedKnowledge[], citations: Citation[]): number {
    if (context.length === 0) return 0;

    // 基於檢索到的知識質量和引用數量
    const avgRelevance = context.reduce((sum, k) => sum + k.relevance_score, 0) / context.length;
    const citationRatio = citations.length / context.length;

    return avgRelevance * 0.6 + citationRatio * 0.4;
  }

  /**
   * 檢查知識是否被使用
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

    // 如果超過 30% 的詞彙匹配，認為被使用
    return matchCount / knowledgeWords.length > 0.3;
  }

  /**
   * 分詞
   */
  private tokenize(text: string): string[] {
    // 簡單的分詞（中英文）
    return text.split(/[\s,，。！？；：、]+/).filter(word => word.length > 0);
  }
}

// 單例實例
export const ragEngine = new RAGEngine();
