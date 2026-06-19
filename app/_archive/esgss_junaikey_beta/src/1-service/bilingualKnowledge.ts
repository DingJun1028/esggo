/**
 * 🌐 Bilingual Knowledge System
 * --------------------------------------------------
 * [核心] 雙語知識庫系統
 * [功能] 中英對照、認可知識歸檔、專案管理
 */

import { omniKnowledge } from './omniKnowledge';
import { omniLogger, LogCategory } from './omniLogger';

export interface BilingualContent {
  zh_TW: string;
  en: string;
  auto_translated: boolean;
}

export interface VerifiedKnowledge {
  id: string;
  question: BilingualContent;
  answer: BilingualContent;
  verified_by: 'user' | 'system';
  confidence: number;
  usage_count: number;
  tags: string[];
  project?: string;
  created_at: number;
  last_used: number;
}

export interface ProjectKnowledgeBase {
  project_id: string;
  name: BilingualContent;
  description: BilingualContent;
  knowledge_items: VerifiedKnowledge[];
  created_at: number;
  updated_at: number;
}

class BilingualKnowledgeSystem {
  private verifiedKnowledge: Map<string, VerifiedKnowledge> = new Map();
  private projects: Map<string, ProjectKnowledgeBase> = new Map();

  /**
   * 添加認可知識
   */
  async addVerifiedKnowledge(
    question: string,
    answer: string,
    language: 'zh-TW' | 'en',
    project?: string
  ): Promise<string> {
    const id = this.generateId();

    // 自動翻譯
    const bilingualQuestion = await this.createBilingualContent(question, language);
    const bilingualAnswer = await this.createBilingualContent(answer, language);

    const knowledge: VerifiedKnowledge = {
      id,
      question: bilingualQuestion,
      answer: bilingualAnswer,
      verified_by: 'user',
      confidence: 1.0,
      usage_count: 0,
      tags: this.extractTags(question + ' ' + answer),
      project,
      created_at: Date.now(),
      last_used: Date.now(),
    };

    this.verifiedKnowledge.set(id, knowledge);

    // 同步到奧秘智庫
    await omniKnowledge.store({
      type: 'ai_response',
      content: JSON.stringify(knowledge),
      metadata: {
        timestamp: Date.now(),
        language: 'zh-TW',
        tags: ['verified', ...knowledge.tags],
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'Verified knowledge added', {
      knowledge_id: id,
      project,
      tags: knowledge.tags,
    });

    return id;
  }

  /**
   * 創建雙語內容
   */
  private async createBilingualContent(
    text: string,
    sourceLanguage: 'zh-TW' | 'en'
  ): Promise<BilingualContent> {
    if (sourceLanguage === 'zh-TW') {
      return {
        zh_TW: text,
        en: await this.translate(text, 'zh-TW', 'en'),
        auto_translated: true,
      };
    } else {
      return {
        zh_TW: await this.translate(text, 'en', 'zh-TW'),
        en: text,
        auto_translated: true,
      };
    }
  }

  /**
   * 翻譯（簡化版本）
   */
  private async translate(text: string, from: string, to: string): Promise<string> {
    // 實際應該調用翻譯 API
    // 這裡返回簡單標記
    return `[${to}] ${text}`;
  }

  /**
   * 創建專案知識庫
   */
  async createProject(
    name: string,
    description: string,
    language: 'zh-TW' | 'en'
  ): Promise<string> {
    const project_id = this.generateId();

    const project: ProjectKnowledgeBase = {
      project_id,
      name: await this.createBilingualContent(name, language),
      description: await this.createBilingualContent(description, language),
      knowledge_items: [],
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    this.projects.set(project_id, project);

    omniLogger.info(LogCategory.SYSTEM, 'Project created', { project_id, name });

    return project_id;
  }

  /**
   * 獲取專案知識
   */
  getProjectKnowledge(project_id: string): VerifiedKnowledge[] {
    return Array.from(this.verifiedKnowledge.values()).filter(k => k.project === project_id);
  }

  /**
   * 搜尋知識（雙語）
   */
  searchKnowledge(query: string, language: 'zh-TW' | 'en'): VerifiedKnowledge[] {
    const results: VerifiedKnowledge[] = [];

    for (const knowledge of this.verifiedKnowledge.values()) {
      const questionText = language === 'zh-TW' ? knowledge.question.zh_TW : knowledge.question.en;

      if (questionText.toLowerCase().includes(query.toLowerCase())) {
        results.push(knowledge);
      }
    }

    return results.sort((a, b) => b.usage_count - a.usage_count);
  }

  /**
   * 使用知識（增加使用計數）
   */
  useKnowledge(id: string): void {
    const knowledge = this.verifiedKnowledge.get(id);
    if (knowledge) {
      knowledge.usage_count++;
      knowledge.last_used = Date.now();
    }
  }

  /**
   * 提取標籤
   */
  private extractTags(text: string): string[] {
    // 簡單的關鍵詞提取
    const keywords = new Set<string>();
    const words = text.split(/\s+/);

    for (const word of words) {
      if (word.length > 2) {
        keywords.add(word.toLowerCase());
      }
    }

    return Array.from(keywords).slice(0, 5);
  }

  private generateId(): string {
    return `knowledge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const bilingualKnowledge = new BilingualKnowledgeSystem();
