import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
// 快取服務 - 效能優化與數據緩存
import { EventEmitter } from '@/utils/EventEmitter';

export interface CacheEntry<T = any> {
  data: T;
  expiresAt: number;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  size: number; // 數據大小（字節）
  tags: string[]; // 標籤用於批量失效
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
  defaultTtl: number; // 默認生存時間（毫秒）
  maxSize: number; // 最大緩存大小（字節）
  cleanupInterval: number; // 清理間隔（毫秒）
  enableCompression: boolean; // 是否啟用壓縮
  enableMetrics: boolean; // 是否啟用指標收集
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
 * 高性能快取服務
 * 支持TTL、LRU淘汰、壓縮、指標收集等功能
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
      defaultTtl: 300000, // 5分鐘
      maxSize: 100 * 1024 * 1024, // 100MB
      cleanupInterval: 60000, // 1分鐘
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
   * 獲取快取數據
   */
  async get<T = any>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.recordMetrics('miss', Date.now() - startTime);
      this.emit(CacheEvent.MISS, { key });
      return null;
    }

    // 檢查過期
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.recordMetrics('miss', Date.now() - startTime);
      this.emit(CacheEvent.EXPIRE, { key, entry });
      return null;
    }

    // 更新訪問統計
    entry.lastAccessed = Date.now();
    entry.accessCount++;

    this.recordMetrics('hit', Date.now() - startTime);
    this.emit(CacheEvent.HIT, { key, entry });

    return entry.data;
  }

  /**
   * 設置快取數據
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

    // 計算數據大小
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

    // 檢查大小限制
    if (this.getTotalSize() + compressedSize > this.config.maxSize) {
      await this.evictEntries(compressedSize);
    }

    // 添加標籤索引
    this.addTagIndex(key, tags);

    this.cache.set(key, entry);
    this.metrics.sets++;

    this.emit(CacheEvent.SET, { key, entry });
  }

  /**
   * 刪除快取數據
   */
  async delete(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // 移除標籤索引
    this.removeTagIndex(key, entry.tags);

    this.cache.delete(key);
    this.metrics.deletes++;

    this.emit(CacheEvent.DELETE, { key, entry });
    return true;
  }

  /**
   * 檢查鍵是否存在且未過期
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * 清空所有快取
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.tagIndex.clear();
    this.metrics.evictions += this.metrics.sets; // 重置計數

    this.emit(CacheEvent.CLEAR);
  }

  /**
   * 按標籤批量刪除
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
   * 獲取或設置（如果不存在）
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
   * 獲取快取統計信息
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
   * 獲取所有鍵
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 獲取所有條目（用於調試）
   */
  entries(): Array<[string, CacheEntry]> {
    return Array.from(this.cache.entries());
  }

  // 私有方法

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private calculateSize(data: any): number {
    // 簡單的大小估算 - 瀏覽器相容版
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
    // LRU淘汰策略
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

  // 銷毀服務
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

// 導出單例實例
export const cacheService = CacheService.getInstance();

// 快取裝飾器
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

// 快取失效裝飾器
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
