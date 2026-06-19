/**
 * 🧠 Omni Knowledge Core
 * --------------------------------------------------
 * [Core] Knowledge Storage and Sharing System
 * [Function] AI response storage, knowledge indexing, cross-core synchronization
 * [Goal] Ensure integrity of quality and function
 */

import { omniLogger } from './omniLogger.js';

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
    knowledgeBase?: string;
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
   * Store knowledge entry
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

    // Store in main storage
    this.knowledge.set(id, fullEntry);

    // Update index
    for (const tag of entry.metadata.tags) {
      if (!this.index.has(tag)) {
        this.index.set(tag, new Set());
      }
      this.index.get(tag)!.add(id);
    }

    // Log to OmniLogger
    omniLogger.info(LogCategory.SYSTEM, 'Knowledge', 'Knowledge stored', {
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
   * Query knowledge
   */
  query(query: KnowledgeQuery): KnowledgeEntry[] {
    let results: KnowledgeEntry[] = Array.from(this.knowledge.values());

    // Filter by type
    if (query.type) {
      results = results.filter(e => e.type === query.type);
    }

    // Filter by tags
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

    // Filter by time range
    if (query.timeRange) {
      results = results.filter(
        e =>
          e.metadata.timestamp >= query.timeRange!.start &&
          e.metadata.timestamp <= query.timeRange!.end
      );
    }

    // Limit result count
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    // Sort by time descending
    results.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

    return results;
  }

  /**
   * Refine Knowledge
   * Simulates AI periodically reviewing the knowledge base to optimize content
   */
  async refineKnowledge(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, 'Knowledge', 'Initiating knowledge refinement process...');

    let markedForReview = 0;
    let consolidatedEntries = 0;

    for (const entry of this.knowledge.values()) {
      // Simulation: If quality score is below threshold, mark for review
      if (entry.metadata.quality_score && entry.metadata.quality_score < 0.5) {
        // In actual application, would trigger manual review or AI rewriting
        entry.metadata.tags.push('needs_review');
        this.knowledge.set(entry.id, entry);
        markedForReview++;
        omniLogger.debug('Knowledge', `Entry '${entry.id}' marked for review (low quality).`);
      }

      // Simulation: Find potential duplicates or mergeable knowledge
      // Simple demonstration here, actual would involve vector similarity comparison
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
        // Simulate merge logic (keep higher score)
        const bestSimilar = similarEntries.sort(
          (a, b) => (b.metadata.quality_score || 0) - (a.metadata.quality_score || 0)
        )[0];
        if (
          bestSimilar &&
          (bestSimilar.metadata.quality_score || 0) > (entry.metadata.quality_score || 0)
        ) {
          // Treat current entry as redundant, log merge
          omniLogger.info(LogCategory.SYSTEM, 'Knowledge',
            `Entry '${entry.id}' is redundant with '${bestSimilar.id}', prioritizing higher quality.`,
            { consolidatedId: bestSimilar.id }
          );
          this.knowledge.delete(entry.id); // Simulate deleting lower quality duplication
          consolidatedEntries++;
        }
      }
    }

    omniLogger.info(LogCategory.SYSTEM, 'Knowledge',
      `Knowledge refinement complete. Marked for review: ${markedForReview}, Consolidated entries: ${consolidatedEntries}`
    );
  }

  /**
   * Share knowledge to all cores
   */
  async shareToAllCores(entryId: string): Promise<void> {
    const entry = this.knowledge.get(entryId);
    if (!entry) {
      throw new Error(`Knowledge entry ${entryId} not found`);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Knowledge', 'Sharing knowledge to all cores', {
      knowledge_id: entryId,
      type: entry.type,
      tags: entry.metadata.tags,
    });

    // 🧠 Cross-core synchronization: Broadcast knowledge entry as Insight to global cores
    import('../omni/infrastructure/broadcast/AwakeningBroadcaster').then(
      ({ awakeningBroadcaster }) => {
        awakeningBroadcaster.shareInsight({
          category: 'optimization',
          title: `Global Knowledge Sync: ${entry.type}`,
          message: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : ''),
          priority: 'medium',
          actionable: false,
          metadata: {
            knowledgeId: entry.id,
            traceId: entry.evidence.trace_id,
            tags: entry.metadata.tags,
          },
        });
      }
    );
  }

  /**
   * Get knowledge statistics
   */
  getStats() {
    const stats = {
      total: this.knowledge.size,
      byType: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
    };

    for (const entry of this.knowledge.values()) {
      // Statistics by type
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;

      // Statistics by tag
      for (const tag of entry.metadata.tags) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `knowledge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate content hash
   */
  private generateHash(content: string): string {
    // Simple hash implementation (production should use crypto)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// Singleton Instance
export const omniKnowledge = new OmniKnowledgeCore();

// Periodically execute knowledge refinement (e.g. every hour)
setInterval(() => omniKnowledge.refineKnowledge(), 3600000); // 1 hour
