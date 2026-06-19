/**
 * ⚡ Auto-Completion Engine
 * --------------------------------------------------
 * [核心] 自動完成引擎
 * [功能] 打字即輸入，自動完成知識庫彙整
 */

import { bilingualKnowledge } from './bilingualKnowledge';
import { omniKnowledge } from './omniKnowledge';
import { omniLogger, LogCategory } from './omniLogger';

export interface AutoCompleteSuggestion {
  text: string;
  type: 'knowledge' | 'phrase' | 'completion';
  confidence: number;
  source?: string;
}

class AutoCompletionEngine {
  private typingBuffer: string = '';
  private lastTypingTime: number = 0;

  /**
   * 即時自動完成
   */
  async getCompletions(partialInput: string): Promise<AutoCompleteSuggestion[]> {
    this.typingBuffer = partialInput;
    this.lastTypingTime = Date.now();

    const suggestions: AutoCompleteSuggestion[] = [];

    // 1. 從知識庫搜尋
    const knowledgeSuggestions = await this.searchKnowledge(partialInput);
    suggestions.push(...knowledgeSuggestions);

    // 2. 從常用詞句搜尋
    const phraseSuggestions = this.searchPhrases(partialInput);
    suggestions.push(...phraseSuggestions);

    // 3. AI 生成補全
    const aiCompletions = await this.generateCompletions(partialInput);
    suggestions.push(...aiCompletions);

    // 按信心度排序
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  /**
   * 自動彙整到知識庫
   */
  async autoAggregateKnowledge(input: string): Promise<void> {
    // 檢查是否為完整句子
    if (!this.isCompleteSentence(input)) return;

    // 提取知識點
    const knowledgePoints = this.extractKnowledgePoints(input);

    // 自動儲存
    for (const point of knowledgePoints) {
      await bilingualKnowledge.addVerifiedKnowledge(point.question, point.answer, 'zh-TW');
    }

    omniLogger.info(LogCategory.SYSTEM, 'Knowledge auto-aggregated', {
      points_count: knowledgePoints.length,
    });
  }

  /**
   * 從知識庫搜尋
   */
  private async searchKnowledge(input: string): Promise<AutoCompleteSuggestion[]> {
    const results = bilingualKnowledge.searchKnowledge(input, 'zh-TW');

    return results.slice(0, 3).map(k => ({
      text: k.answer.zh_TW,
      type: 'knowledge' as const,
      confidence: 0.8,
      source: k.id,
    }));
  }

  /**
   * 從常用詞句搜尋
   */
  private searchPhrases(input: string): AutoCompleteSuggestion[] {
    // 實際應該從收錄的詞句中搜尋
    return [];
  }

  /**
   * AI 生成補全
   */
  private async generateCompletions(input: string): Promise<AutoCompleteSuggestion[]> {
    // 實際應該調用 AI
    return [
      {
        text: input + '的核心在於提升效率',
        type: 'completion',
        confidence: 0.6,
      },
    ];
  }

  /**
   * 檢查是否為完整句子
   */
  private isCompleteSentence(input: string): boolean {
    return input.endsWith('。') || input.endsWith('！') || input.endsWith('？');
  }

  /**
   * 提取知識點
   */
  private extractKnowledgePoints(input: string): Array<{ question: string; answer: string }> {
    // 簡單實作，實際應該使用 NLP
    return [];
  }
}

export const autoCompletionEngine = new AutoCompletionEngine();
