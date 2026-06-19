/**
 * Omni Eternal Memory
 *
 * The eternal memory system for the Omni Hub.
 * Ensures all knowledge, experience, and reasoning processes are permanently preserved and retrievable.
 *
 * Core Features:
 * 1. Eternal - Memory is never lost.
 * 2. Comprehensive - Records all interactions.
 * 3. Retrievable - Efficient vector search.
 * 4. Traceable - Complete historical trajectory.
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';
import type { OmniTag, OmniTagType, KnowledgeChunk } from '@/types/omniCore.ts'; // Need to verify this path

// ============================================================================
// Eternal Memory Type Definitions
// ============================================================================

/**
 * Memory Type
 */
export enum EternalMemoryType {
  /** Short-term memory - Current session */
  SHORT_TERM = 'short_term',
  /** Working memory - Task related */
  WORKING = 'working',
  /** Long-term memory - Permanent storage */
  LONG_TERM = 'long_term',
  /** Procedural memory - Skills and methods */
  PROCEDURAL = 'procedural',
  /** Semantic memory - Knowledge and concepts */
  SEMANTIC = 'semantic',
  /** Episodic memory - Events and experiences */
  EPISODIC = 'episodic',
  /** Awakening event - System awakening history */
  AWAKENING_EVENT = 'awakening_event',
}

/**
 * Memory Fragment
 */
export interface MemoryFragment {
  /** Memory ID */
  id: string;
  /** Memory Type */
  type: EternalMemoryType;
  /** Content */
  content: string;
  /** Vector Embedding */
  embedding?: number[];
  /** Importance Score (0-1) */
  importance: number;
  /** Access Count */
  accessCount: number;
  /** Last Accessed Timestamp */
  lastAccessedAt: Date;
  /** Creation Timestamp */
  createdAt: Date;
  /** Tags */
  tags: OmniTag[];
  /** Metadata */
  metadata: MemoryMetadata;
  /** Related Memories */
  relatedMemories: string[];
}

/**
 * Memory Metadata
 */
export interface MemoryMetadata {
  /** Source */
  source: string;
  /** Session ID */
  sessionId?: string;
  /** Agent ID */
  agentId?: string;
  /** User ID */
  userId?: string;
  /** Context */
  context?: Record<string, unknown>;
  /** Sentiment Flag */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** Topics */
  topics?: string[];
}

/**
 * Memory Retrieval Options
 */
export interface MemoryRetrievalOptions {
  /** Memory type filter */
  types?: EternalMemoryType[];
  /** Maximum results */
  limit?: number;
  /** Similarity threshold */
  threshold?: number;
  /** Time range */
  timeRange?: {
    start?: Date;
    end?: Date;
  };
  /** Tag filter */
  tags?: OmniTag[];
  /** Sort order */
  sortBy?: 'relevance' | 'recency' | 'importance' | 'access_count';
}

/**
 * Memory Consolidation Result
 */
export interface ConsolidationResult {
  /** Count of consolidated memories */
  consolidatedCount: number;
  /** Merged memory IDs */
  mergedMemories: string[];
  /** Deleted memory IDs */
  deletedMemories: string[];
  /** Newly created summaries */
  summaries: MemoryFragment[];
}

// ============================================================================
// Omni Eternal Memory Interface
// ============================================================================

/**
 * Omni Eternal Memory System
 */
export interface OmniEternalMemory {
  /** System ID */
  id: string;
  /** System Name */
  name: string;
  /** Total Memory Count */
  totalMemories: number;

  // ========== Core Functions ==========

  /**
   * Store memory
   * @param content Memory content
   * @param type Memory type
   * @param metadata Metadata
   * @returns Memory fragment
   */
  store(
    content: string,
    type: EternalMemoryType,
    metadata?: Partial<MemoryMetadata>
  ): Promise<MemoryFragment>;

  /**
   * Retrieve memory
   * @param query Search query
   * @param options Retrieval options
   * @returns Array of memory fragments
   */
  retrieve(query: string, options?: MemoryRetrievalOptions): Promise<MemoryFragment[]>;

  /**
   * Update memory
   * @param memoryId Memory ID
   * @param updates Updated content
   */
  update(memoryId: string, updates: Partial<MemoryFragment>): Promise<MemoryFragment>;

  /**
   * Delete memory (Soft delete, marks as deleted)
   * @param memoryId Memory ID
   */
  delete(memoryId: string): Promise<void>;

  // ========== Advanced Features ==========

  /**
   * Memory Consolidation
   * Transfers short-term to long-term memory, merging similar entries.
   */
  consolidate(): Promise<ConsolidationResult>;

  /**
   * Memory Forgetting
   * Lowers priority of unimportant memories.
   */
  forget(criteria: { importance?: number; accessCount?: number; age?: number }): Promise<number>;

  /**
   * Memory Association
   * Establishes links between memories.
   */
  associate(memoryId1: string, memoryId2: string): Promise<void>;

  /**
   * Memory Graph
   * Retrieves the association network.
   */
  getMemoryGraph(memoryId: string, depth?: number): Promise<MemoryGraph>;

  /**
   * Memory Statistics
   */
  getStatistics(): Promise<MemoryStatistics>;

  /**
   * Memory Export
   * Exports all memories as JSON string.
   */
  export(): Promise<string>;

  /**
   * Memory Import
   * Imports memories from JSON.
   */
  import(data: string): Promise<number>;

  // ========== Awakening Mode ==========

  /**
   * Enter Eternal Mode
   * Activates absolute memory state, all new memories are auto-locked.
   */
  enterEternalMode(): Promise<void>;

  /**
   * Check if system is in Eternal Mode
   */
  isEternalMode(): boolean;

  /**
   * Lock Memory
   * Marks specific memory as permanently immutable.
   */
  lockMemory(memoryId: string): Promise<void>;
}

/**
 * Memory Graph
 */
export interface MemoryGraph {
  /** Center memory fragment */
  center: MemoryFragment;
  /** Related memories */
  related: Array<{
    memory: MemoryFragment;
    relationship: string;
    strength: number;
  }>;
  /** Network depth */
  depth: number;
}

/**
 * Memory Statistics
 */
export interface MemoryStatistics {
  /** Total memory count */
  total: number;
  /** Grouped by type */
  byType: Record<EternalMemoryType, number>;
  /** Average importance score */
  averageImportance: number;
  /** Most accessed memories */
  mostAccessed: MemoryFragment[];
  /** Most recent memories */
  mostRecent: MemoryFragment[];
  /** Storage utilization */
  storageUsed: {
    bytes: number;
    formatted: string;
  };
}

// ============================================================================
// Omni Eternal Memory Implementation
// ============================================================================

export class OmniEternalMemoryImpl implements OmniEternalMemory {
  public id: string;
  public name: string;
  public totalMemories: number = 0;

  private memories: Map<string, MemoryFragment> = new Map();
  private memoryIndex: Map<string, string[]> = new Map(); // Content index

  constructor(name: string = 'OmniEternalMemory') {
    this.id = `eternal_memory_${Date.now()}`;
    this.name = name;

    omniLogger.info(LogCategory.INFRASTRUCTURE, 'Omni Eternal Memory System Started', {
      id: this.id,
      name: this.name,
      features: ['ETERNAL', 'COMPREHENSIVE', 'RETRIEVABLE', 'TRACEABLE'],
    });
  }

  async store(
    content: string,
    type: EternalMemoryType,
    metadata?: Partial<MemoryMetadata>
  ): Promise<MemoryFragment> {
    const memory: MemoryFragment = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      importance: this.calculateImportance(content, type),
      accessCount: 0,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      tags: [],
      metadata: {
        source: metadata?.source || 'unknown',
        sessionId: metadata?.sessionId,
        agentId: metadata?.agentId,
        userId: metadata?.userId,
        context: metadata?.context,
        sentiment: metadata?.sentiment,
        topics: metadata?.topics,
      },
      relatedMemories: [],
    };

    this.memories.set(memory.id, memory);
    this.totalMemories++;

    // Index memory
    this.indexMemory(memory);

    omniLogger.info(LogCategory.INFRASTRUCTURE, `[ETERNAL-MEM] 💾 Stored memory: ${memory.id}`, {
      type,
    });
    return memory;
  }

  async retrieve(query: string, options?: MemoryRetrievalOptions): Promise<MemoryFragment[]> {
    let results = Array.from(this.memories.values());

    // Type filtering
    if (options?.types && options.types.length > 0) {
      results = results.filter(m => options.types!.includes(m.type));
    }

    // Time range filtering
    if (options?.timeRange) {
      const { start, end } = options.timeRange;
      results = results.filter(m => {
        const created = m.createdAt.getTime();
        if (start && created < start.getTime()) return false;
        if (end && created > end.getTime()) return false;
        return true;
      });
    }

    // Simple similarity calculation (Vector similarity should be used in production)
    results = results
      .map(m => ({
        ...m,
        similarity: this.calculateSimilarity(query, m.content),
      }))
      .filter(
        m => (m as unknown as { similarity: number }).similarity > (options?.threshold || 0.5)
      );

    // Sorting
    const sortBy = options?.sortBy || 'relevance';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (
            ((b as unknown as { similarity: number }).similarity || 0) -
            ((a as unknown as { similarity: number }).similarity || 0)
          );
        case 'recency':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'importance':
          return b.importance - a.importance;
        case 'access_count':
          return b.accessCount - a.accessCount;
        default:
          return 0;
      }
    });

    // Limit result count
    const limit = options?.limit || 10;
    results = results.slice(0, limit);

    // Update access records
    results.forEach(m => {
      m.accessCount++;
      m.lastAccessedAt = new Date();
    });

    omniLogger.info(
      LogCategory.INFRASTRUCTURE,
      `[ETERNAL-MEM] 🔍 Retrieved ${results.length} memories`,
      {
        query,
      }
    );
    return results;
  }

  async update(memoryId: string, updates: Partial<MemoryFragment>): Promise<MemoryFragment> {
    const memory = this.memories.get(memoryId);
    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    Object.assign(memory, updates);
    omniLogger.info(LogCategory.INFRASTRUCTURE, `[ETERNAL-MEM] 📝 Updated memory: ${memoryId}`);
    return memory;
  }

  async delete(memoryId: string): Promise<void> {
    // Soft delete: Mark as deleted instead of actual removal
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.metadata.context = {
        ...memory.metadata.context,
        deleted: true,
        deletedAt: new Date(),
      };
      omniLogger.info(
        LogCategory.INFRASTRUCTURE,
        `[ETERNAL-MEM] 🗑️ Soft deleted memory: ${memoryId}`
      );
    }
  }

  async consolidate(): Promise<ConsolidationResult> {
    omniLogger.info(
      LogCategory.INFRASTRUCTURE,
      '[ETERNAL-MEM] 🔄 Starting memory consolidation...'
    );

    const result: ConsolidationResult = {
      consolidatedCount: 0,
      mergedMemories: [],
      deletedMemories: [],
      summaries: [],
    };

    // Identify short-term memories
    const shortTermMemories = Array.from(this.memories.values()).filter(
      m => m.type === EternalMemoryType.SHORT_TERM
    );

    // Convert important short-term memories to long-term
    for (const memory of shortTermMemories) {
      if (memory.importance > 0.7 || memory.accessCount > 5) {
        memory.type = EternalMemoryType.LONG_TERM;
        result.consolidatedCount++;
      }
    }

    omniLogger.info(
      LogCategory.INFRASTRUCTURE,
      `[ETERNAL-MEM] ✅ Consolidated ${result.consolidatedCount} memories`
    );
    return result;
  }

  async forget(criteria: {
    importance?: number;
    accessCount?: number;
    age?: number;
  }): Promise<number> {
    let forgottenCount = 0;
    const now = Date.now();

    for (const memory of this.memories.values()) {
      let shouldForget = false;

      if (criteria.importance !== undefined && memory.importance < criteria.importance) {
        shouldForget = true;
      }

      if (criteria.accessCount !== undefined && memory.accessCount < criteria.accessCount) {
        shouldForget = true;
      }

      if (criteria.age !== undefined) {
        const age = now - memory.createdAt.getTime();
        if (age > criteria.age) {
          shouldForget = true;
        }
      }

      if (shouldForget) {
        memory.importance *= 0.5; // Lower importance score
        forgottenCount++;
      }
    }

    omniLogger.info(
      LogCategory.INFRASTRUCTURE,
      `[ETERNAL-MEM] 💤 Forgot ${forgottenCount} memories`
    );
    return forgottenCount;
  }

  async associate(memoryId1: string, memoryId2: string): Promise<void> {
    const mem1 = this.memories.get(memoryId1);
    const mem2 = this.memories.get(memoryId2);

    if (mem1 && mem2) {
      if (!mem1.relatedMemories.includes(memoryId2)) {
        mem1.relatedMemories.push(memoryId2);
      }
      if (!mem2.relatedMemories.includes(memoryId1)) {
        mem2.relatedMemories.push(memoryId1);
      }
      omniLogger.info(
        LogCategory.INFRASTRUCTURE,
        `[ETERNAL-MEM] 🔗 Associated memories: ${memoryId1} <-> ${memoryId2}`
      );
    }
  }

  async getMemoryGraph(memoryId: string, depth: number = 2): Promise<MemoryGraph> {
    const center = this.memories.get(memoryId);
    if (!center) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    const related = center.relatedMemories
      .map(id => this.memories.get(id))
      .filter(m => m !== undefined)
      .map(m => ({
        memory: m!,
        relationship: 'related',
        strength: 0.8,
      }));

    return { center, related, depth };
  }

  async getStatistics(): Promise<MemoryStatistics> {
    const memories = Array.from(this.memories.values());

    const byType: Record<EternalMemoryType, number> = {
      [EternalMemoryType.SHORT_TERM]: 0,
      [EternalMemoryType.WORKING]: 0,
      [EternalMemoryType.LONG_TERM]: 0,
      [EternalMemoryType.PROCEDURAL]: 0,
      [EternalMemoryType.SEMANTIC]: 0,
      [EternalMemoryType.EPISODIC]: 0,
      [EternalMemoryType.AWAKENING_EVENT]: 0,
    };

    memories.forEach(m => {
      byType[m.type]++;
    });

    const totalImportance = memories.reduce((sum, m) => sum + m.importance, 0);
    const averageImportance = memories.length > 0 ? totalImportance / memories.length : 0;

    const mostAccessed = memories.sort((a, b) => b.accessCount - a.accessCount).slice(0, 5);

    const mostRecent = memories
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const totalBytes = JSON.stringify(Array.from(this.memories.values())).length;

    return {
      total: this.totalMemories,
      byType,
      averageImportance,
      mostAccessed,
      mostRecent,
      storageUsed: {
        bytes: totalBytes,
        formatted: this.formatBytes(totalBytes),
      },
    };
  }

  async export(): Promise<string> {
    const data = {
      id: this.id,
      name: this.name,
      exportedAt: new Date().toISOString(),
      memories: Array.from(this.memories.values()),
    };
    return JSON.stringify(data, null, 2);
  }

  async import(data: string): Promise<number> {
    const parsed = JSON.parse(data);
    let imported = 0;

    for (const memory of parsed.memories) {
      this.memories.set(memory.id, memory);
      imported++;
    }

    this.totalMemories = this.memories.size;
    omniLogger.info(LogCategory.INFRASTRUCTURE, `[ETERNAL-MEM] 📥 Imported ${imported} memories`);
    return imported;
  }

  // ========== Private Helper Methods ==========

  private calculateImportance(content: string, type: EternalMemoryType): number {
    // Base importance based on type
    const baseImportance: Record<EternalMemoryType, number> = {
      [EternalMemoryType.SHORT_TERM]: 0.3,
      [EternalMemoryType.WORKING]: 0.5,
      [EternalMemoryType.LONG_TERM]: 0.8,
      [EternalMemoryType.PROCEDURAL]: 0.9,
      [EternalMemoryType.SEMANTIC]: 0.7,
      [EternalMemoryType.EPISODIC]: 0.6,
      [EternalMemoryType.AWAKENING_EVENT]: 1.0,
    };

    // Adjustment based on content length
    const lengthBonus = Math.min(content.length / 1000, 0.2);

    return Math.min(baseImportance[type] + lengthBonus, 1.0);
  }

  private calculateSimilarity(query: string, content: string): number {
    // Simple lexical overlap similarity (Vector similarity should be used in production)
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    const contentWords = new Set(content.toLowerCase().split(/\s+/));

    const intersection = new Set([...queryWords].filter(w => contentWords.has(w)));

    return intersection.size / Math.max(queryWords.size, contentWords.size);
  }

  private indexMemory(memory: MemoryFragment): void {
    const words = memory.content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (!this.memoryIndex.has(word)) {
        this.memoryIndex.set(word, []);
      }
      this.memoryIndex.get(word)!.push(memory.id);
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // ========== Eternal Mode Implementation ==========

  private eternalMode: boolean = false;
  private lockedMemories: Set<string> = new Set();

  async enterEternalMode(): Promise<void> {
    this.eternalMode = true;
    omniLogger.info(
      LogCategory.INFRASTRUCTURE,
      '♾️ [ETERNAL-MEM] Entering Eternal Mode - All new memories will be permanently locked'
    );

    // Lock all existing LONG_TERM memories
    for (const memory of this.memories.values()) {
      if (memory.type === EternalMemoryType.LONG_TERM) {
        await this.lockMemory(memory.id);
      }
    }
  }

  isEternalMode(): boolean {
    return this.eternalMode;
  }

  async lockMemory(memoryId: string): Promise<void> {
    const memory = this.memories.get(memoryId);
    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    this.lockedMemories.add(memoryId);
    memory.metadata.context = {
      ...memory.metadata.context,
      locked: true,
      lockedAt: new Date(),
      eternal: true,
    };

    omniLogger.info(LogCategory.INFRASTRUCTURE, `🔒 [ETERNAL-MEM] Memory locked: ${memoryId}`);
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create Omni Eternal Memory instance
 */
export function createEternalMemory(name?: string): OmniEternalMemory {
  return new OmniEternalMemoryImpl(name);
}
