/**
 * Omni Cache Service
 * 奧秘快取服務 - 遵循 5T 協議的統一快取層
 * 
 * 功能：
 * - 支持記憶體快取和 Redis 快取（自動 fallback）
 * - TTL 管理和自動過期
 * - 快取命中率統計
 * - 5T 協議追蹤和日誌
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { createHash } from 'crypto';
import { LocalRedisSimProvider } from './LocalRedisSimProvider';
import { redisCacheService } from './RedisCacheService';

/**
 * 快取項目接口
 */
interface CacheItem<T> {
    value: T;
    expiry: number;
    created: number;
    accessed: number;
    accessCount: number;
    hashLock: string;  // 5T: Trustworthy - 不可篡改
}

/**
 * 快取統計
 */
interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    totalItems: number;
    memoryUsage: number;
}

/**
 * 快取策略配置
 */
interface CacheStrategy {
    ttl: number;           // 過期時間（毫秒）
    maxSize?: number;      // 最大項目數
    refreshOnAccess?: boolean;  // 訪問時刷新過期時間
}

/**
 * 預定義的快取策略
 */
export const CacheStrategies = {
    KNOWLEDGE_QUERY: { ttl: 5 * 60 * 1000, refreshOnAccess: true },     // 5 分鐘
    RESONANCE_FIELD: { ttl: 1 * 60 * 1000, refreshOnAccess: false },    // 1 分鐘
    TAG_MAPPING: { ttl: 15 * 60 * 1000, refreshOnAccess: true },        // 15 分鐘
    SHORT_LIVED: { ttl: 30 * 1000, refreshOnAccess: false },            // 30 秒
    LONG_LIVED: { ttl: 60 * 60 * 1000, refreshOnAccess: true },         // 1 小時
} as const;

/**
 * Redis 提供者接口 (將來可由核心提供實施)
 */
export interface RedisProvider {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
    clear(pattern: string): Promise<number>;
}

/**
 * OmniCache Service - 奧秘快取服務
 */
export class OmniCacheService {
    private static instance: OmniCacheService;
    private redisEnabled: boolean = false;
    private redisProvider: RedisProvider | null = null;

    // 記憶體快取存儲
    private memoryCache = new Map<string, CacheItem<any>>();

    // 快取策略映射
    private strategies = new Map<string, CacheStrategy>();

    // 統計數據
    private stats = {
        hits: 0,
        misses: 0,
        evictions: 0,
        redisHits: 0,
        redisMisses: 0,
    };

    // 清理定時器
    private cleanupInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.setupCleanupTimer();

        // 初始化 Redis 提供者
        // 優先使用真正的 Redis 服務，如果不可用則回退到模擬器
        if (redisCacheService.isAvailable()) {
            this.redisProvider = redisCacheService;
            this.redisEnabled = true;
            omniLogger.info(LogCategory.SYSTEM, '⚡ OmniCache Service Initialized with Production Redis');
        } else {
            this.redisProvider = new LocalRedisSimProvider();
            this.redisEnabled = true;
            omniLogger.info(LogCategory.SYSTEM, '🗄️ OmniCache Service Initialized with Redis Simulator (Fallback)');
        }
    }

    static getInstance(): OmniCacheService {
        if (!OmniCacheService.instance) {
            OmniCacheService.instance = new OmniCacheService();
        }
        return OmniCacheService.instance;
    }

    /**
     * 註冊快取策略
     */
    registerStrategy(namespace: string, strategy: CacheStrategy): void {
        this.strategies.set(namespace, strategy);
        omniLogger.debug(LogCategory.SYSTEM, `[OmniCache] Strategy registered: ${namespace}`, {
            ttl: `${strategy.ttl}ms`,
            maxSize: strategy.maxSize,
        });
    }

    /**
     * 生成快取鍵（遵循 5T: Traceable - 可溯源）
     */
    private generateKey(namespace: string, key: string): string {
        return `${namespace}:${key}`;
    }

    /**
     * 生成 Hash Lock（遵循 5T: Trustworthy - 不可篡改）
     */
    private generateHashLock(value: any): string {
        const content = JSON.stringify(value);
        return createHash('sha256').update(content).digest('hex').substring(0, 16);
    }

    /**
     * 設置快取項目
     * 
     * @param namespace - 快取命名空間
     * @param key - 快取鍵
     * @param value - 快取值
     * @param strategyOverride - 可選的策略覆蓋
     */
    async set<T>(
        namespace: string,
        key: string,
        value: T,
        strategyOverride?: Partial<CacheStrategy>
    ): Promise<void> {
        const cacheKey = this.generateKey(namespace, key);
        const strategy = this.strategies.get(namespace) || CacheStrategies.SHORT_LIVED;
        const effectiveStrategy = { ...strategy, ...strategyOverride };

        const now = Date.now();
        const item: CacheItem<T> = {
            value,
            expiry: now + effectiveStrategy.ttl,
            created: now,
            accessed: now,
            accessCount: 0,
            hashLock: this.generateHashLock(value),
        };

        // 檢查最大容量
        if (effectiveStrategy.maxSize && this.memoryCache.size >= effectiveStrategy.maxSize) {
            this.evictLRU();
        }

        this.memoryCache.set(cacheKey, item);

        // 如果 Redis 已啟用，異步更新 Redis
        if (this.redisEnabled && this.redisProvider) {
            this.redisProvider.set(cacheKey, value, Math.floor(effectiveStrategy.ttl / 1000)).catch(err => {
                omniLogger.error(LogCategory.SYSTEM, `[OmniCache] Redis SET failed: ${cacheKey}`, { error: err });
            });
        }

        // 5T: Transparent - 可驗算的日誌
        omniLogger.debug(LogCategory.BUSINESS, `[OmniCache] SET ${cacheKey}`, {
            source_origin: 'OmniCacheService.set',  // Traceable
            timestamp: new Date(now).toISOString(),  // Trackable
            ttl: `${effectiveStrategy.ttl}ms`,       // Transparent
            hashLock: item.hashLock,                 // Trustworthy
            redis: this.redisEnabled ? 'sync' : 'disabled'
        });
    }

    /**
     * 獲取快取項目
     * 
     * @param namespace - 快取命名空間
     * @param key - 快取鍵
     * @returns 快取值或 null
     */
    async get<T>(namespace: string, key: string): Promise<T | null> {
        const cacheKey = this.generateKey(namespace, key);

        // 1. 嘗試從記憶體快取獲取 (Fast path)
        const item = this.memoryCache.get(cacheKey) as CacheItem<T> | undefined;
        const now = Date.now();

        if (item && now <= item.expiry) {
            // 更新訪問統計
            item.accessed = now;
            item.accessCount++;

            // 如果策略允許，刷新過期時間
            const strategy = this.strategies.get(namespace);
            if (strategy?.refreshOnAccess) {
                item.expiry = now + strategy.ttl;
            }

            this.stats.hits++;
            return item.value;
        }

        // 2. 記憶體未命中或已過期，嘗試從 Redis 獲取
        if (this.redisEnabled && this.redisProvider) {
            try {
                const redisValue = await this.redisProvider.get<T>(cacheKey);
                if (redisValue !== null) {
                    this.stats.redisHits++;

                    // Back-fill to memory cache for subsequent fast reads
                    await this.set(namespace, key, redisValue);

                    return redisValue;
                }
                this.stats.redisMisses++;
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, `[OmniCache] Redis GET failed: ${cacheKey}`, { error: err });
            }
        }

        this.stats.misses++;
        return null;
    }

    /**
     * Cache-Aside 模式: getOrSet
     * 如果命中則返回，否則執行 fetcher 並存入快取
     */
    async getOrSet<T>(
        namespace: string,
        key: string,
        fetcher: () => Promise<T>,
        strategyOverride?: Partial<CacheStrategy>
    ): Promise<T> {
        // 1. 嘗試獲取
        const cachedValue = await this.get<T>(namespace, key);
        if (cachedValue !== null) {
            return cachedValue;
        }

        // 2. 獲取失敗，執行 fetcher
        try {
            const freshValue = await fetcher();

            // 3. 存入快取
            await this.set(namespace, key, freshValue, strategyOverride);

            return freshValue;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[OmniCache] getOrSet fetcher failed for ${namespace}:${key}`, { error });
            throw error;
        }
    }

    /**
     * 刪除快取項目
     */
    async delete(namespace: string, key: string): Promise<boolean> {
        const cacheKey = this.generateKey(namespace, key);
        const deleted = this.memoryCache.delete(cacheKey);

        if (this.redisEnabled && this.redisProvider) {
            this.redisProvider.del(cacheKey).catch(err => {
                omniLogger.error(LogCategory.SYSTEM, `[OmniCache] Redis DEL failed: ${cacheKey}`, { error: err });
            });
        }

        if (deleted) {
            omniLogger.debug(LogCategory.BUSINESS, `[OmniCache] DELETE ${cacheKey}`);
        }

        return deleted;
    }

    /**
     * 清空命名空間下的所有快取
     */
    async clear(namespace: string): Promise<number> {
        const prefix = `${namespace}:`;
        let count = 0;

        for (const key of this.memoryCache.keys()) {
            if (key.startsWith(prefix)) {
                this.memoryCache.delete(key);
                count++;
            }
        }

        if (this.redisEnabled && this.redisProvider) {
            this.redisProvider.clear(prefix).catch(err => {
                omniLogger.error(LogCategory.SYSTEM, `[OmniCache] Redis CLEAR failed: ${namespace}`, { error: err });
            });
        }

        omniLogger.info(LogCategory.BUSINESS, `[OmniCache] CLEAR ${namespace}`, { cleared: count });
        return count;
    }

    /**
     * 獲取快取統計
     */
    getStats(): CacheStats & { redisHits: number; redisMisses: number } {
        const total = this.stats.hits + this.stats.misses;
        const hitRate = total > 0 ? this.stats.hits / total : 0;

        // 估算記憶體使用量
        let memoryUsage = 0;
        for (const item of this.memoryCache.values()) {
            memoryUsage += JSON.stringify(item).length;
        }

        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: parseFloat((hitRate * 100).toFixed(2)),
            totalItems: this.memoryCache.size,
            memoryUsage: Math.round(memoryUsage / 1024), // KB
            redisHits: this.stats.redisHits,
            redisMisses: this.stats.redisMisses,
        };
    }

    /**
     * 重置統計數據
     */
    resetStats(): void {
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            redisHits: 0,
            redisMisses: 0,
        };
        omniLogger.debug(LogCategory.SYSTEM, '[OmniCache] Stats reset');
    }

    /**
     * LRU 淘汰策略
     */
    private evictLRU(): void {
        let oldestKey: string | null = null;
        let oldestAccess = Date.now();

        for (const [key, item] of this.memoryCache.entries()) {
            if (item.accessed < oldestAccess) {
                oldestAccess = item.accessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.memoryCache.delete(oldestKey);
            this.stats.evictions++;
            omniLogger.debug(LogCategory.SYSTEM, `[OmniCache] EVICT ${oldestKey}`);
        }
    }

    /**
     * 設置清理定時器
     */
    private setupCleanupTimer(): void {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpired();
            this.evaluateScaling();
        }, 60 * 1000);
    }

    /**
     * 觸發縮放評估 (AI Auto-Scaling)
     */
    private async evaluateScaling(): Promise<void> {
        const { scalingEngine } = await import('./ScalingEngine');
        await scalingEngine.evaluateScaling();
    }

    /**
     * 清理過期項目
     */
    private cleanupExpired(): void {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, item] of this.memoryCache.entries()) {
            if (now > item.expiry) {
                this.memoryCache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            omniLogger.debug(LogCategory.SYSTEM, `[OmniCache] Cleanup: ${cleaned} expired items removed`);
        }
    }

    /**
     * 銷毀服務
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.memoryCache.clear();
        omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Service destroyed');
    }
}

// 導出單例實例
export const omniCache = OmniCacheService.getInstance();

// 註冊預定義策略
omniCache.registerStrategy('knowledge', CacheStrategies.KNOWLEDGE_QUERY);
omniCache.registerStrategy('resonance', CacheStrategies.RESONANCE_FIELD);
omniCache.registerStrategy('tag', CacheStrategies.TAG_MAPPING);
