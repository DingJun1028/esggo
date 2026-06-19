/**
 * 🌐 Bilingual Knowledge System
 * --------------------------------------------------
 * [Core] Bilingual Knowledge Base System
 * [Functions] Chinese-English comparison, approved knowledge archiving, project management
 */

import { omniKnowledge } from './omniKnowledge.js';
import { omniLogger } from './omniLogger.js';

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
   * Add verified knowledge
   */
  async addVerifiedKnowledge(
    question: string,
    answer: string,
    language: 'zh-TW' | 'en',
    project?: string
  ): Promise<string> {
    const id = this.generateId();

    // Auto translation
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

    // Sync to Omni Knowledge Base
    await omniKnowledge.store({
      type: 'ai_response',
      content: JSON.stringify(knowledge),
      metadata: {
        timestamp: Date.now(),
        language: 'zh-TW',
        tags: ['verified', ...knowledge.tags],
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'Knowledge', 'Verified knowledge added', {
      knowledge_id: id,
      project,
      tags: knowledge.tags,
    });

    return id;
  }

  /**
   * Create bilingual content
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
   * Translation (Simplified version)
   */
  private async translate(text: string, from: string, to: string): Promise<string> {
    // Should call translation API in reality
    // Returning simple markers here
    return `[${to}] ${text}`;
  }

  /**
   * Create project knowledge base
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

    omniLogger.info(LogCategory.SYSTEM, 'Knowledge', 'Project created', { project_id, name });

    return project_id;
  }

  /**
   * Get project knowledge
   */
  getProjectKnowledge(project_id: string): VerifiedKnowledge[] {
    return Array.from(this.verifiedKnowledge.values()).filter(k => k.project === project_id);
  }

  /**
   * Search knowledge (Bilingual)
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
   * Use knowledge (Increase usage count)
   */
  useKnowledge(id: string): void {
    const knowledge = this.verifiedKnowledge.get(id);
    if (knowledge) {
      knowledge.usage_count++;
      knowledge.last_used = Date.now();
    }
  }

  /**
   * Extract tags
   */
  private extractTags(text: string): string[] {
    // Simple keyword extraction
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
