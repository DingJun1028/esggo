/**
 * ⭐ Favorite Manager Service
 * --------------------------------------------------
 * [核心] 收藏管理系統
 * [功能] 收藏對話、回應、圖表，標籤分類
 */

import { omniLogger, LogCategory } from './omniLogger';
import { omniKnowledge } from './omniKnowledge';

export type FavoriteType = 'conversation' | 'response' | 'chart' | 'note' | 'insight';

export interface Favorite {
  id: string;
  type: FavoriteType;
  content: any;
  tags: string[];
  timestamp: number;
  metadata: {
    title: string;
    description?: string;
    source?: string;
    preview?: string;
  };
  evidence: {
    source: string;
    hash_lock: string;
    trace_id: string;
  };
}

export interface FavoriteFilter {
  type?: FavoriteType;
  tags?: string[];
  searchText?: string;
  dateRange?: { start: number; end: number };
}

class FavoriteManagerService {
  private favorites: Map<string, Favorite> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();

  /**
   * 添加收藏
   */
  async addFavorite(item: Omit<Favorite, 'id' | 'timestamp' | 'evidence'>): Promise<string> {
    const id = this.generateId();
    const timestamp = Date.now();
    const hash_lock = this.generateHash(JSON.stringify(item.content));
    const trace_id = `favorite-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

    const favorite: Favorite = {
      ...item,
      id,
      timestamp,
      evidence: {
        source: 'FavoriteManager',
        hash_lock,
        trace_id,
      },
    };

    // 儲存到主存儲
    this.favorites.set(id, favorite);

    // 更新標籤索引
    for (const tag of item.tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(id);
    }

    // 同步到奧秘智庫
    await omniKnowledge.store({
      type: 'user_feedback',
      content: JSON.stringify(favorite),
      metadata: {
        timestamp,
        language: 'zh-TW',
        tags: ['favorite', item.type, ...item.tags],
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'Favorite added', {
      favorite_id: id,
      type: item.type,
      tags: item.tags,
      trace_id,
    });

    return id;
  }

  /**
   * 移除收藏
   */
  async removeFavorite(id: string): Promise<void> {
    const favorite = this.favorites.get(id);
    if (!favorite) {
      throw new Error(`Favorite ${id} not found`);
    }

    // 從標籤索引移除
    for (const tag of favorite.tags) {
      this.tagIndex.get(tag)?.delete(id);
    }

    // 從主存儲移除
    this.favorites.delete(id);

    omniLogger.info(LogCategory.SYSTEM, 'Favorite removed', { favorite_id: id });
  }

  /**
   * 獲取收藏列表
   */
  getFavorites(filter?: FavoriteFilter): Favorite[] {
    let results = Array.from(this.favorites.values());

    // 按類型過濾
    if (filter?.type) {
      results = results.filter(f => f.type === filter.type);
    }

    // 按標籤過濾
    if (filter?.tags && filter.tags.length > 0) {
      const matchingIds = new Set<string>();
      for (const tag of filter.tags) {
        const ids = this.tagIndex.get(tag);
        if (ids) {
          ids.forEach(id => matchingIds.add(id));
        }
      }
      results = results.filter(f => matchingIds.has(f.id));
    }

    // 按搜尋文字過濾
    if (filter?.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      results = results.filter(
        f =>
          f.metadata.title.toLowerCase().includes(searchLower) ||
          f.metadata.description?.toLowerCase().includes(searchLower)
      );
    }

    // 按日期範圍過濾
    if (filter?.dateRange) {
      results = results.filter(
        f => f.timestamp >= filter.dateRange!.start && f.timestamp <= filter.dateRange!.end
      );
    }

    // 按時間倒序排序
    results.sort((a, b) => b.timestamp - a.timestamp);

    return results;
  }

  /**
   * 更新標籤
   */
  async updateTags(id: string, tags: string[]): Promise<void> {
    const favorite = this.favorites.get(id);
    if (!favorite) {
      throw new Error(`Favorite ${id} not found`);
    }

    // 從舊標籤索引移除
    for (const oldTag of favorite.tags) {
      this.tagIndex.get(oldTag)?.delete(id);
    }

    // 更新標籤
    favorite.tags = tags;

    // 添加到新標籤索引
    for (const newTag of tags) {
      if (!this.tagIndex.has(newTag)) {
        this.tagIndex.set(newTag, new Set());
      }
      this.tagIndex.get(newTag)!.add(id);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Favorite tags updated', {
      favorite_id: id,
      tags,
    });
  }

  /**
   * 獲取所有標籤
   */
  getAllTags(): string[] {
    return Array.from(this.tagIndex.keys()).sort();
  }

  /**
   * 獲取統計資訊
   */
  getStats() {
    const stats = {
      total: this.favorites.size,
      byType: {} as Record<FavoriteType, number>,
      byTag: {} as Record<string, number>,
    };

    for (const favorite of this.favorites.values()) {
      // 統計類型
      stats.byType[favorite.type] = (stats.byType[favorite.type] || 0) + 1;

      // 統計標籤
      for (const tag of favorite.tags) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成內容雜湊
   */
  private generateHash(content: string): string {
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
export const favoriteManager = new FavoriteManagerService();
