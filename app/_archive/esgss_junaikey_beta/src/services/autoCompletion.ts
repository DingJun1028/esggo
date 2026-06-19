/**
 * ⚡ Auto-Completion Engine
 * --------------------------------------------------
 * [Core] Auto-Completion Engine
 * [Function] Typing-as-input, automated knowledge base synchronization
 */

import { bilingualKnowledge } from './bilingualKnowledge.js';
import { omniKnowledge } from './omniKnowledge.js';
import { omniLogger } from './omniLogger.js';

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
   * Real-time auto-completion
   */
  async getCompletions(partialInput: string): Promise<AutoCompleteSuggestion[]> {
    this.typingBuffer = partialInput;
    this.lastTypingTime = Date.now();

    const suggestions: AutoCompleteSuggestion[] = [];

    // 1. Search from knowledge base
    const knowledgeSuggestions = await this.searchKnowledge(partialInput);
    suggestions.push(...knowledgeSuggestions);

    // 2. Search from common phrases
    const phraseSuggestions = this.searchPhrases(partialInput);
    suggestions.push(...phraseSuggestions);

    // 3. AI-generated completion
    const aiCompletions = await this.generateCompletions(partialInput);
    suggestions.push(...aiCompletions);

    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  /**
   * Auto-aggregate to knowledge base
   */
  async autoAggregateKnowledge(input: string): Promise<void> {
    // Check if it's a complete sentence
    if (!this.isCompleteSentence(input)) return;

    // Extract knowledge points
    const knowledgePoints = this.extractKnowledgePoints(input);

    // Auto-save
    for (const point of knowledgePoints) {
      await bilingualKnowledge.addVerifiedKnowledge(point.question, point.answer, 'zh-TW');
    }

    omniLogger.info(LogCategory.SYSTEM, 'AutoCompletion', 'Knowledge auto-aggregated', {
      points_count: knowledgePoints.length,
    });
  }

  /**
   * Search from knowledge base
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
   * Search from common phrases
   */
  private searchPhrases(input: string): AutoCompleteSuggestion[] {
    // Should actually search from collected phrases
    return [];
  }

  /**
   * AI-generated completion
   */
  private async generateCompletions(input: string): Promise<AutoCompleteSuggestion[]> {
    // Should actually call AI
    return [
      {
        text: input + ' core lies in improving efficiency',
        type: 'completion',
        confidence: 0.6,
      },
    ];
  }

  /**
   * Check if it's a complete sentence
   */
  private isCompleteSentence(input: string): boolean {
    return input.endsWith('。') || input.endsWith('！') || input.endsWith('？');
  }

  /**
   * Extract knowledge points
   */
  private extractKnowledgePoints(input: string): Array<{ question: string; answer: string }> {
    // Simple implementation, should actually use NLP
    return [];
  }
}

export const autoCompletionEngine = new AutoCompletionEngine();
