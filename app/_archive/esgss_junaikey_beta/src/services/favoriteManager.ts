/**
 * ⭐ Favorite Manager Service
 * --------------------------------------------------
 * [Core] Favorite management system
 * [Function] Favorite conversations, responses, charts, tag classification
 */

import { omniLogger } from './omniLogger.js';
import { omniKnowledge } from './omniKnowledge.js';

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
   * Add favorite
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

    // Save to main storage
    this.favorites.set(id, favorite);

    // Update tag index
    for (const tag of item.tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(id);
    }

    // Sync to OmniKnowledge
    await omniKnowledge.store({
      type: 'user_feedback',
      content: JSON.stringify(favorite),
      metadata: {
        timestamp,
        language: 'en',
        tags: ['favorite', item.type, ...item.tags],
      },
    });

    omniLogger.info(LogCategory.SYSTEM, 'Favorites', 'Favorite added', {
      favorite_id: id,
      type: item.type,
      tags: item.tags,
      trace_id,
    });

    return id;
  }

  /**
   * Remove favorite
   */
  async removeFavorite(id: string): Promise<void> {
    const favorite = this.favorites.get(id);
    if (!favorite) {
      throw new Error(`Favorite ${id} not found`);
    }

    // Remove from tag index
    for (const tag of favorite.tags) {
      this.tagIndex.get(tag)?.delete(id);
    }

    // Remove from main storage
    this.favorites.delete(id);

    omniLogger.info(LogCategory.SYSTEM, 'Favorites', 'Favorite removed', { favorite_id: id });
  }

  /**
   * Get favorite list
   */
  getFavorites(filter?: FavoriteFilter): Favorite[] {
    let results = Array.from(this.favorites.values());

    // Filter by type
    if (filter?.type) {
      results = results.filter(f => f.type === filter.type);
    }

    // Filter by tags
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

    // Filter by search text
    if (filter?.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      results = results.filter(
        f =>
          f.metadata.title.toLowerCase().includes(searchLower) ||
          f.metadata.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (filter?.dateRange) {
      results = results.filter(
        f => f.timestamp >= filter.dateRange!.start && f.timestamp <= filter.dateRange!.end
      );
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp - a.timestamp);

    return results;
  }

  /**
   * Update tags
   */
  async updateTags(id: string, tags: string[]): Promise<void> {
    const favorite = this.favorites.get(id);
    if (!favorite) {
      throw new Error(`Favorite ${id} not found`);
    }

    // Remove from old tag index
    for (const oldTag of favorite.tags) {
      this.tagIndex.get(oldTag)?.delete(id);
    }

    // Update tags
    favorite.tags = tags;

    // Add to new tag index
    for (const newTag of tags) {
      if (!this.tagIndex.has(newTag)) {
        this.tagIndex.set(newTag, new Set());
      }
      this.tagIndex.get(newTag)!.add(id);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Favorites', 'Favorite tags updated', { favorite_id: id, tags });
  }

  /**
   * Get all tags
   */
  getAllTags(): string[] {
    return Array.from(this.tagIndex.keys()).sort();
  }

  /**
   * Get statistics
   */
  getStats() {
    const stats = {
      total: this.favorites.size,
      byType: {} as Record<FavoriteType, number>,
      byTag: {} as Record<string, number>,
    };

    for (const favorite of this.favorites.values()) {
      // Statistics by type
      stats.byType[favorite.type] = (stats.byType[favorite.type] || 0) + 1;

      // Statistics by tag
      for (const tag of favorite.tags) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate content hash
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

// Singleton instance
export const favoriteManager = new FavoriteManagerService();
