/**
 * 📋 Quick Capture Service
 * --------------------------------------------------
 * [Core] Quick Capture System
 * [Function] Common phrases, article selection, intelligent summary
 */

import { omniLogger } from './omniLogger.js';
import { favoriteManager } from './favoriteManager.js';

export interface CapturedPhrase {
  id: string;
  text: string;
  category: string;
  usageCount: number;
  lastUsed: number;
  createdAt: number;
}

export interface ArticleCapture {
  id: string;
  title: string;
  content: string;
  summary: string;
  wordCount: number;
  tags: string[];
  source?: string;
  capturedAt: number;
}

class QuickCaptureService {
  private phrases: Map<string, CapturedPhrase> = new Map();
  private articles: Map<string, ArticleCapture> = new Map();

  /**
   * Capture common phrases
   */
  async capturePhrase(text: string, category: string = 'general'): Promise<string> {
    const id = this.generateId('phrase');
    const now = Date.now();

    const phrase: CapturedPhrase = {
      id,
      text,
      category,
      usageCount: 0,
      lastUsed: now,
      createdAt: now,
    };

    this.phrases.set(id, phrase);

    // Also add to favorites
    await favoriteManager.addFavorite({
      type: 'note',
      content: { text },
      tags: [category, 'phrase'],
      metadata: {
        title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        description: `Common Phrases - ${category}`,
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'QuickCapture', 'Phrase captured', { phrase_id: id, category });

    return id;
  }

  /**
   * Capture article
   */
  async captureArticle(
    title: string,
    content: string,
    options?: { source?: string; tags?: string[] }
  ): Promise<string> {
    const id = this.generateId('article');
    const summary = this.generateSummary(content);
    const wordCount = this.countWords(content);
    const autoTags = this.extractTags(content);

    const article: ArticleCapture = {
      id,
      title,
      content,
      summary,
      wordCount,
      tags: [...autoTags, ...(options?.tags || [])],
      source: options?.source,
      capturedAt: Date.now(),
    };

    this.articles.set(id, article);

    // Also add to favorites
    await favoriteManager.addFavorite({
      type: 'note',
      content: { title, content, summary },
      tags: article.tags,
      metadata: {
        title,
        description: summary,
        source: options?.source,
        preview: content.substring(0, 200),
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'QuickCapture', 'Article captured', {
      article_id: id,
      word_count: wordCount,
      tags: article.tags,
    });

    return id;
  }

  /**
   * Select all and analyze article
   */
  async captureSelection(selection: string, context?: string): Promise<ArticleCapture> {
    const title = this.extractTitle(selection) || 'Unnamed Article';
    const id = await this.captureArticle(title, selection, {
      source: context,
      tags: ['selection'],
    });

    return this.articles.get(id)!;
  }

  /**
   * Get common phrases
   */
  getPhrases(category?: string): CapturedPhrase[] {
    let results = Array.from(this.phrases.values());

    if (category) {
      results = results.filter(p => p.category === category);
    }

    // Sort by usage count and last used time
    results.sort((a, b) => {
      if (a.usageCount !== b.usageCount) {
        return b.usageCount - a.usageCount;
      }
      return b.lastUsed - a.lastUsed;
    });

    return results;
  }

  /**
   * Use phrase (increase usage count)
   */
  usePhrase(id: string): void {
    const phrase = this.phrases.get(id);
    if (phrase) {
      phrase.usageCount++;
      phrase.lastUsed = Date.now();
    }
  }

  /**
   * Generate summary
   */
  private generateSummary(content: string, maxLength: number = 200): string {
    // Simple summary generation: take first few sentences
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    let summary = '';

    for (const sentence of sentences) {
      if (summary.length + sentence.length <= maxLength) {
        summary += sentence;
      } else {
        break;
      }
    }

    return summary.trim() || content.substring(0, maxLength) + '...';
  }

  /**
   * Count words
   */
  private countWords(text: string): number {
    // Chinese characters + English words
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  }

  /**
   * Extract title
   */
  private extractTitle(content: string): string | null {
    // Try to extract title from first line
    const lines = content.split('\n');
    const first = lines[0];
    const firstLine = first ? first.trim() : '';
    if (firstLine.length > 0 && firstLine.length < 100) {
      return firstLine;
    }
    return null;
  }

  /**
   * Extract tags (keywords)
   */
  private extractTags(content: string): string[] {
    // Simple keyword extraction
    const keywords = new Set<string>();

    // Extract Chinese keywords (2-4 characters)
    const chineseMatches = content.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
    const wordFreq = new Map<string, number>();

    for (const word of chineseMatches) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }

    // Take top 5 words with highest frequency
    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    sortedWords.forEach(word => keywords.add(word));

    return Array.from(keywords);
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const quickCapture = new QuickCaptureService();
