/**
 * 🧠 Intelligent Cache System - MCP Tool Result Cache
 * --------------------------------------------------
 * [Function] LRU cache, automatic invalidation, statistical monitoring
 * [Goal] Improve tool execution speed by 10x
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

// ============================================================================
// Types
// ============================================================================

export interface CacheConfig {
  maxSize: number; // Max cache items
  ttl: number; // Time to Live (ms)
  strategy: 'LRU' | 'LFU'; // Cache strategy
  enableStats: boolean; // Enable statistics
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  hits: number;
  size: number;
  expiresAt: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  maxSize: number;
  evictions: number;
  avgAccessTime: number;
}

// ============================================================================
// LRU Cache Implementation
// ============================================================================

export class MCPToolCache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private config: CacheConfig;
  private stats: {
    hits: number;
    misses: number;
    evictions: number;
    totalAccessTime: number;
    accessCount: number;
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 100,
      ttl: config.ttl || 5 * 60 * 1000, // Default 5 minutes
      strategy: config.strategy || 'LRU',
      enableStats: config.enableStats !== false,
    };

    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalAccessTime: 0,
      accessCount: 0,
    };

    omniLogger.info(LogCategory.SYSTEM, 'MCPToolCache initialized', {
      source_origin: 'MCPToolCache',
      config: this.config,
    });
  }

  /**
   * Generates cache key
   */
  private generateKey(toolName: string, args: Record<string, any>): string {
    const argsStr = JSON.stringify(args, Object.keys(args).sort());
    return `${toolName}:${argsStr}`;
  }

  /**
   * Calculates value size (rough estimate)
   */
  private calculateSize(value: T): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 1;
    }
  }

  /**
   * Checks if item is expired
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Evicts expired items
   */
  private evictExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.stats.evictions++;
    });

    if (keysToDelete.length > 0) {
      omniLogger.debug(LogCategory.SYSTEM, 'Evicted expired cache entries', {
        source_origin: 'MCPToolCache',
        count: keysToDelete.length,
      });
    }
  }

  /**
   * LRU eviction strategy
   */
  private evictLRU(): void {
    if (this.cache.size === 0) return;

    // Map insertion order is maintained, first is oldest
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
      this.stats.evictions++;

      omniLogger.debug(LogCategory.SYSTEM, 'LRU eviction', {
        source_origin: 'MCPToolCache',
        key: firstKey,
      });
    }
  }

  /**
   * Gets cache value
   */
  get(toolName: string, args: Record<string, any>): T | null {
    const startTime = Date.now();
    const key = this.generateKey(toolName, args);

    // Clean up expired items first
    this.evictExpired();

    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      this.stats.misses++;
      this.recordAccessTime(startTime);

      omniLogger.debug(LogCategory.SYSTEM, 'Cache miss', {
        source_origin: 'MCPToolCache',
        toolName,
      });

      return null;
    }

    // LRU: Re-insert to update order
    this.cache.delete(key);
    entry.hits++;
    entry.timestamp = Date.now();
    this.cache.set(key, entry);

    this.stats.hits++;
    this.recordAccessTime(startTime);

    omniLogger.debug(LogCategory.SYSTEM, 'Cache hit', {
      source_origin: 'MCPToolCache',
      toolName,
      hits: entry.hits,
    });

    return entry.value;
  }

  /**
   * Sets cache value
   */
  set(toolName: string, args: Record<string, any>, value: T): void {
    const key = this.generateKey(toolName, args);
    const size = this.calculateSize(value);
    const now = Date.now();

    // If already exists, delete first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Check capacity, evict if necessary
    while (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: now,
      hits: 0,
      size,
      expiresAt: now + this.config.ttl,
    };

    this.cache.set(key, entry);

    omniLogger.debug(LogCategory.SYSTEM, 'Cache set', {
      source_origin: 'MCPToolCache',
      toolName,
      size,
      ttl: this.config.ttl,
    });
  }

  /**
   * Invalidates cache (supports wildcards)
   */
  invalidate(pattern: string): number {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    omniLogger.info(LogCategory.SYSTEM, 'Cache invalidated', {
      source_origin: 'MCPToolCache',
      pattern,
      count: keysToDelete.length,
    });

    return keysToDelete.length;
  }

  /**
   * Clears cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();

    omniLogger.info(LogCategory.SYSTEM, 'Cache cleared', {
      source_origin: 'MCPToolCache',
      itemsCleared: size,
    });
  }

  /**
   * Records access time
   */
  private recordAccessTime(startTime: number): void {
    if (this.config.enableStats) {
      const duration = Date.now() - startTime;
      this.stats.totalAccessTime += duration;
      this.stats.accessCount++;
    }
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;
    const avgAccessTime =
      this.stats.accessCount > 0 ? this.stats.totalAccessTime / this.stats.accessCount : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 10000) / 100, // Percentage, two decimal places
      size: this.cache.size,
      maxSize: this.config.maxSize,
      evictions: this.stats.evictions,
      avgAccessTime: Math.round(avgAccessTime * 100) / 100,
    };
  }

  /**
   * Resets statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalAccessTime: 0,
      accessCount: 0,
    };

    omniLogger.info(LogCategory.SYSTEM, 'Cache stats reset', {
      source_origin: 'MCPToolCache',
    });
  }

  /**
   * Warm up cache (load commonly used tool results)
   */
  async warmup(entries: Array<{ toolName: string; args: any; value: T }>): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, 'Cache warmup started', {
      source_origin: 'MCPToolCache',
      count: entries.length,
    });

    for (const entry of entries) {
      this.set(entry.toolName, entry.args, entry.value);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Cache warmup completed', {
      source_origin: 'MCPToolCache',
      cacheSize: this.cache.size,
    });
  }

  /**
   * Gets cache content (for debugging)
   */
  getAll(): Array<{ key: string; entry: CacheEntry<T> }> {
    return Array.from(this.cache.entries()).map(([key, entry]) => ({ key, entry }));
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const mcpToolCache = new MCPToolCache({
  maxSize: 100,
  ttl: 5 * 60 * 1000, // 5 minutes
  strategy: 'LRU',
  enableStats: true,
});

export default mcpToolCache;
