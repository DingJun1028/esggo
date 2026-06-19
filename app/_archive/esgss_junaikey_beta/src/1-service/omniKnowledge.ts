/**
 * 🧠 心核備奧秘智庫 (Omni Knowledge Core)
 * --------------------------------------------------
 * [核心] 知識儲存與共享系統
 * [功能] AI 回應儲存、知識索引、跨心核同步
 * [目標] 確保品質和功能的一體性
 */

import { omniLogger, LogCategory } from './omniLogger';

export interface KnowledgeEntry {
  id: string;
  type: 'ai_response' | 'user_feedback' | 'system_insight' | 'optimization';
  content: string;
  metadata: {
    question?: string;
    intent?: string;
    timestamp: number;
    language: 'zh-TW' | 'en';
    quality_score?: number;
    tags: string[];
  };
  evidence: {
    source: string;
    hash_lock: string;
    trace_id: string;
  };
}

export interface KnowledgeQuery {
  type?: string;
  tags?: string[];
  timeRange?: { start: number; end: number };
  limit?: number;
}

class OmniKnowledgeCore {
  private knowledge: Map<string, KnowledgeEntry> = new Map();
  private index: Map<string, Set<string>> = new Map(); // tag -> entry IDs

  /**
   * 儲存知識條目
   */
  async store(entry: Omit<KnowledgeEntry, 'id' | 'evidence'>): Promise<string> {
    const id = this.generateId();
    const hash_lock = this.generateHash(entry.content);
    const trace_id = `knowledge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const fullEntry: KnowledgeEntry = {
      ...entry,
      id,
      evidence: {
        source: 'OmniKnowledgeCore',
        hash_lock,
        trace_id,
      },
    };

    // 儲存到主存儲
    this.knowledge.set(id, fullEntry);

    // 更新索引
    for (const tag of entry.metadata.tags) {
      if (!this.index.has(tag)) {
        this.index.set(tag, new Set());
      }
      this.index.get(tag)!.add(id);
    }

    // 記錄到 OmniLogger
    omniLogger.info(LogCategory.SYSTEM, 'Knowledge stored', {
      trace_id,
      metadata: {
        knowledge_id: id,
        type: entry.type,
        tags: entry.metadata.tags,
      },
    });

    return id;
  }

  /**
   * 查詢知識
   */
  query(query: KnowledgeQuery): KnowledgeEntry[] {
    let results: KnowledgeEntry[] = Array.from(this.knowledge.values());

    // 按類型過濾
    if (query.type) {
      results = results.filter(e => e.type === query.type);
    }

    // 按標籤過濾
    if (query.tags && query.tags.length > 0) {
      const matchingIds = new Set<string>();
      for (const tag of query.tags) {
        const ids = this.index.get(tag);
        if (ids) {
          ids.forEach(id => matchingIds.add(id));
        }
      }
      results = results.filter(e => matchingIds.has(e.id));
    }

    // 按時間範圍過濾
    if (query.timeRange) {
      results = results.filter(
        e =>
          e.metadata.timestamp >= query.timeRange!.start &&
          e.metadata.timestamp <= query.timeRange!.end
      );
    }

    // 限制結果數量
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    // 按時間倒序排序
    results.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

    return results;
  }

  /**
   * 提煉知識 (Refine Knowledge)
   * 模擬AI定期審查知識庫，優化內容
   */
  async refineKnowledge(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, 'Knowledge', 'Initiating knowledge refinement process...');

    let markedForReview = 0;
    let consolidatedEntries = 0;

    for (const entry of this.knowledge.values()) {
      // 模擬：如果品質分數低於閾值，則標記為待審查
      if (entry.metadata.quality_score && entry.metadata.quality_score < 0.5) {
        // 在實際應用中，會觸發人工審查或AI重寫
        entry.metadata.tags.push('needs_review');
        this.knowledge.set(entry.id, entry);
        markedForReview++;
        omniLogger.debug('Knowledge', `Entry '${entry.id}' marked for review (low quality).`);
      }

      // 模擬：尋找潛在的重複或可合併的知識
      // 這裡僅作簡單演示，實際會涉及向量相似度比對
      const similarEntries = this.query({
        type: entry.type,
        tags: entry.metadata.tags,
        limit: 10,
      }).filter(
        e =>
          e.id !== entry.id &&
          e.content.includes(entry.content.substring(0, Math.min(entry.content.length / 2, 50)))
      );

      if (similarEntries.length > 0) {
        // 模擬合併邏輯 (保留分數較高的)
        const bestSimilar = similarEntries.sort(
          (a, b) => (b.metadata.quality_score || 0) - (a.metadata.quality_score || 0)
        )[0];
        if (
          bestSimilar &&
          (bestSimilar.metadata.quality_score || 0) > (entry.metadata.quality_score || 0)
        ) {
          // 將當前條目視為冗餘，並記錄合併
          omniLogger.info(
            LogCategory.SYSTEM,
            `Entry '${entry.id}' is redundant with '${bestSimilar.id}', prioritizing higher quality.`,
            { consolidatedId: bestSimilar.id }
          );
          this.knowledge.delete(entry.id); // 模擬刪除較低品質的重複項
          consolidatedEntries++;
        }
      }
    }

    omniLogger.info(
      LogCategory.SYSTEM,
      'Knowledge',
      `Knowledge refinement complete. Marked for review: ${markedForReview}, Consolidated entries: ${consolidatedEntries}`
    );
  }

  /**
   * 共享知識到所有心核
   */
  async shareToAllCores(entryId: string): Promise<void> {
    const entry = this.knowledge.get(entryId);
    if (!entry) {
      throw new Error(`Knowledge entry ${entryId} not found`);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Sharing knowledge to all cores', {
      knowledge_id: entryId,
      type: entry.type,
      tags: entry.metadata.tags,
    });

    // 🧠 跨心核同步：將知識條目作為 Insight 廣播到全域心核
    import('./omniKnowledge').then(() => {
      const { awakeningBroadcaster } = require('@infra/broadcast/AwakeningBroadcaster');
      awakeningBroadcaster.shareInsight({
        category: 'optimization',
        title: `全域知識同步: ${entry.type}`,
        message: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : ''),
        priority: 'medium',
        actionable: false,
        metadata: {
          knowledgeId: entry.id,
          traceId: entry.evidence.trace_id,
          tags: entry.metadata.tags,
        },
      });
    });
  }

  /**
   * 獲取知識統計
   */
  getStats() {
    const stats = {
      total: this.knowledge.size,
      byType: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
    };

    for (const entry of this.knowledge.values()) {
      // 統計類型
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;

      // 統計標籤
      for (const tag of entry.metadata.tags) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `knowledge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成內容雜湊
   */
  private generateHash(content: string): string {
    // 簡單的雜湊實現（生產環境應使用 crypto）
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// 單例實例
export const omniKnowledge = new OmniKnowledgeCore();

// 定期執行知識提煉 (例如每小時)
setInterval(() => omniKnowledge.refineKnowledge(), 3600000); // 1 hour
