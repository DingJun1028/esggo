/**
 * 📋 Quick Capture Service
 * --------------------------------------------------
 * [核心] 快速收錄系統
 * [功能] 常用詞句、文章選取、智能摘要
 */

import { omniLogger, LogCategory } from './omniLogger';
import { favoriteManager } from './favoriteManager';

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
   * 收錄常用詞句
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

    // 同時添加到收藏
    await favoriteManager.addFavorite({
      type: 'note',
      content: { text },
      tags: [category, 'phrase'],
      metadata: {
        title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        description: `常用詞句 - ${category}`,
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'Phrase captured', { module: 'QuickCapture', phrase_id: id, category });

    return id;
  }

  /**
   * 收錄文章
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

    // 同時添加到收藏
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

    omniLogger.info(LogCategory.SYSTEM, 'Article captured', {
      module: 'QuickCapture',
      article_id: id,
      word_count: wordCount,
      tags: article.tags,
    });

    return id;
  }

  /**
   * 全選並分析文章
   */
  async captureSelection(selection: string, context?: string): Promise<ArticleCapture> {
    const title = this.extractTitle(selection) || '未命名文章';
    const id = await this.captureArticle(title, selection, {
      source: context,
      tags: ['selection'],
    });

    return this.articles.get(id)!;
  }

  /**
   * 獲取常用詞句
   */
  getPhrases(category?: string): CapturedPhrase[] {
    let results = Array.from(this.phrases.values());

    if (category) {
      results = results.filter(p => p.category === category);
    }

    // 按使用次數和最近使用時間排序
    results.sort((a, b) => {
      if (a.usageCount !== b.usageCount) {
        return b.usageCount - a.usageCount;
      }
      return b.lastUsed - a.lastUsed;
    });

    return results;
  }

  /**
   * 使用詞句（增加使用計數）
   */
  usePhrase(id: string): void {
    const phrase = this.phrases.get(id);
    if (phrase) {
      phrase.usageCount++;
      phrase.lastUsed = Date.now();
    }
  }

  /**
   * 生成摘要
   */
  private generateSummary(content: string, maxLength: number = 200): string {
    // 簡單的摘要生成：取前幾句話
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
   * 計算字數
   */
  private countWords(text: string): number {
    // 中文字符 + 英文單詞
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  }

  /**
   * 提取標題
   */
  private extractTitle(content: string): string | null {
    // 嘗試從第一行提取標題
    const lines = content.split('\n');
    const first = lines[0];
    const firstLine = first ? first.trim() : '';
    if (firstLine.length > 0 && firstLine.length < 100) {
      return firstLine;
    }
    return null;
  }

  /**
   * 提取標籤（關鍵詞）
   */
  private extractTags(content: string): string[] {
    // 簡單的關鍵詞提取
    const keywords = new Set<string>();

    // 提取中文關鍵詞（2-4 字）
    const chineseMatches = content.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
    const wordFreq = new Map<string, number>();

    for (const word of chineseMatches) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }

    // 取出現頻率最高的前 5 個詞
    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    sortedWords.forEach(word => keywords.add(word));

    return Array.from(keywords);
  }

  /**
   * 生成唯一 ID
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 單例實例
export const quickCapture = new QuickCaptureService();
