import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
// Cache Service - Performance Optimization and Data Caching
import { EventEmitter } from '@/utils/EventEmitter';

export interface CacheEntry<T = any> {
  data: T;
  expiresAt: number;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  size: number; // Data size (bytes)
  tags: string[]; // Tags for batch invalidation
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  averageAccessTime: number;
  evictions: number;
}

export interface CacheConfig {
  defaultTtl: number; // Default Time to Live (ms)
  maxSize: number; // Max cache size (bytes)
  cleanupInterval: number; // Cleanup interval (ms)
  enableCompression: boolean; // Enable compression
  enableMetrics: boolean; // Enable metrics collection
}

export enum CacheEvent {
  HIT = 'cache-hit',
  MISS = 'cache-miss',
  SET = 'cache-set',
  DELETE = 'cache-delete',
  CLEAR = 'cache-clear',
  EVICT = 'cache-evict',
  EXPIRE = 'cache-expire',
}

/**
 * High-performance Cache Service
 * Supports TTL, LRU eviction, compression, metrics collection, etc.
 */
export class CacheService extends EventEmitter {
  private static instance: CacheService;
  private cache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;
  private metrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    totalAccessTime: 0,
    accessCount: 0,
  };

  private constructor(config: Partial<CacheConfig> = {}) {
    super();

    this.config = {
      defaultTtl: 300000, // 5 minutes
      maxSize: 100 * 1024 * 1024, // 100MB
      cleanupInterval: 60000, // 1 minute
      enableCompression: true,
      enableMetrics: true,
      ...config,
    };

    this.startCleanupTimer();
  }

  static getInstance(config?: Partial<CacheConfig>): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(config);
    }
    return CacheService.instance;
  }

  /**
   * Get cached data
   */
  async get<T = any>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.recordMetrics('miss', Date.now() - startTime);
      this.emit(CacheEvent.MISS, { key });
      return null;
    }

    // Check expiration
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.recordMetrics('miss', Date.now() - startTime);
      this.emit(CacheEvent.EXPIRE, { key, entry });
      return null;
    }

    // Update access statistics
    entry.lastAccessed = Date.now();
    entry.accessCount++;

    this.recordMetrics('hit', Date.now() - startTime);
    this.emit(CacheEvent.HIT, { key, entry });

    return entry.data;
  }

  /**
   * Set cached data
   */
  async set<T = any>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tags?: string[];
      compress?: boolean;
    } = {}
  ): Promise<void> {
    const {
      ttl = this.config.defaultTtl,
      tags = [],
      compress = this.config.enableCompression,
    } = options;

    // Calculate data size
    const compressedData = compress ? await this.compress(data) : data;
    const compressedSize = this.calculateSize(compressedData);

    const entry: CacheEntry<T> = {
      data: compressedData,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
      size: compressedSize,
      tags,
    };

    // Check size limit
    if (this.getTotalSize() + compressedSize > this.config.maxSize) {
      await this.evictEntries(compressedSize);
    }

    // Add tag index
    this.addTagIndex(key, tags);

    this.cache.set(key, entry);
    this.metrics.sets++;

    this.emit(CacheEvent.SET, { key, entry });
  }

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Remove tag index
    this.removeTagIndex(key, entry.tags);

    this.cache.delete(key);
    this.metrics.deletes++;

    this.emit(CacheEvent.DELETE, { key, entry });
    return true;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.tagIndex.clear();
    this.metrics.evictions += this.metrics.sets; // Reset counter

    this.emit(CacheEvent.CLEAR);
  }

  /**
   * Batch delete by tags
   */
  async deleteByTags(tags: string[]): Promise<number> {
    let deletedCount = 0;

    for (const tag of tags) {
      const keys = this.tagIndex.get(tag) || [];
      for (const key of keys) {
        if (await this.delete(key)) {
          deletedCount++;
        }
      }
    }

    return deletedCount;
  }

  /**
   * Get or set (if not exists)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: {
      ttl?: number;
      tags?: string[];
      compress?: boolean;
    } = {}
  ): Promise<T> {
    let value = await this.get<T>(key);
    if (value !== null) {
      return value;
    }

    value = await factory();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Get cache statistics information
   */
  getStats(): CacheStats {
    const totalEntries = this.cache.size;
    const totalSize = this.getTotalSize();
    const totalRequests = this.metrics.hits + this.metrics.misses;
    const hitRate = totalRequests > 0 ? this.metrics.hits / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.metrics.misses / totalRequests : 0;
    const averageAccessTime =
      this.metrics.accessCount > 0 ? this.metrics.totalAccessTime / this.metrics.accessCount : 0;

    return {
      totalEntries,
      totalSize,
      hitRate,
      missRate,
      averageAccessTime,
      evictions: this.metrics.evictions,
    };
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all entries (for debugging)
   */
  entries(): Array<[string, CacheEntry]> {
    return Array.from(this.cache.entries());
  }

  // Private methods

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private calculateSize(data: any): number {
    // Simple size estimation - Browser compatible version
    if (typeof data === 'string') {
      return new TextEncoder().encode(data).length;
    }
    if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    try {
      return new TextEncoder().encode(JSON.stringify(data)).length;
    } catch {
      return 0;
    }
  }

  private async compress(data: any): Promise<any> {
    // Browser environment compatible: disable zlib compression
    // Previously used zlib in Node.js, but this service runs in browser now.
    // Returning data as is.
    return data;
  }

  private async decompress(data: any): Promise<any> {
    // Browser environment compatible: disable zlib decompression
    return data;
  }

  private getTotalSize(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += entry.size;
    }
    return total;
  }

  private async evictEntries(requiredSpace: number): Promise<void> {
    // LRU eviction strategy
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, entry }))
      .sort((a, b) => a.entry.lastAccessed - b.entry.lastAccessed);

    let freedSpace = 0;
    for (const { key, entry } of entries) {
      if (freedSpace >= requiredSpace) break;

      this.cache.delete(key);
      freedSpace += entry.size;
      this.metrics.evictions++;

      this.emit(CacheEvent.EVICT, { key, entry });
    }
  }

  private tagIndex = new Map<string, Set<string>>();

  private addTagIndex(key: string, tags: string[]): void {
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  private removeTagIndex(key: string, tags: string[]): void {
    for (const tag of tags) {
      const keySet = this.tagIndex.get(tag);
      if (keySet) {
        keySet.delete(key);
        if (keySet.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }
  }

  private recordMetrics(type: 'hit' | 'miss', accessTime: number): void {
    if (!this.config.enableMetrics) return;

    if (type === 'hit') {
      this.metrics.hits++;
    } else {
      this.metrics.misses++;
    }

    this.metrics.accessCount++;
    this.metrics.totalAccessTime += accessTime;
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
      this.emit(CacheEvent.EXPIRE, { key });
    }

    if (expiredKeys.length > 0) {
      omniLogger.info(
        LogCategory.SYSTEM,
        `[CacheService] Cleaned up ${expiredKeys.length} expired entries`,
        { source_origin: 'CacheService' }
      );
    }
  }

  // Destroy service
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.cache.clear();
    this.tagIndex.clear();

    if (CacheService.instance === this) {
      CacheService.instance = null!;
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Cache Decorator
export function Cached(ttl?: number, tags?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;

      return await cacheService.getOrSet(cacheKey, () => originalMethod.apply(this, args), {
        ttl,
        tags: tags || [`${target.constructor.name}.${propertyKey}`],
      });
    };

    return descriptor;
  };
}

// Cache Invalidation Decorator
export function CacheInvalidate(tags: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      await cacheService.deleteByTags(tags);
      return result;
    };

    return descriptor;
  };
}
