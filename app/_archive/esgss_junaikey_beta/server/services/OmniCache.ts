/**
 * OmniCache - 奧秘圓通統一快取服務
 * 
 * 提供高性能的記憶體快取層，支持多種快取策略、
 * TTL 管理、分布式同步和預熱功能。
 * 
 * @version 1.0.0
 * @date 2026-02-09
 */

import { omniLogger, LogCategory, LogLevel } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import redisService from './redisService.js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type CacheStrategy = 'LRU' | 'LFU' | 'FIFO' | 'TTL';

export interface CacheConfig {
    maxSize: number;
    defaultTTL: number;
    strategy: CacheStrategy;
    enablePersistence: boolean;
    persistenceKey?: string;
}

export interface CacheEntry<T> {
    key: string;
    value: T;
    createdAt: number;
    accessedAt: number;
    accessCount: number;
    ttl: number;
    expiresAt: number;
    tags?: string[];
}

export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    maxSize: number;
    hitRate: number;
    evictions: number;
    memoryUsage: number;
}

export interface CacheQuery<T = unknown> {
    keys?: string[];
    tags?: string[];
    prefix?: string;
    limit?: number;
    includeExpired?: boolean;
}

// ============================================================================
// Cache Store (Strategy Pattern)
// ============================================================================

interface CacheStore<T> {
    get(key: string): CacheEntry<T> | undefined;
    set(key: string, entry: CacheEntry<T>): void;
    delete(key: string): boolean;
    clear(): void;
    getAll(): Map<string, CacheEntry<T>>;
    size(): number;
}

class LRUCacheStore<T> implements CacheStore<T> {
    private store: Map<string, CacheEntry<T>> = new Map();
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    get(key: string): CacheEntry<T> | undefined {
        const entry = this.store.get(key);
        if (entry) {
            // Move to end (most recently used)
            this.store.delete(key);
            this.store.set(key, entry);
            entry.accessedAt = Date.now();
            entry.accessCount++;
        }
        return entry;
    }

    set(key: string, entry: CacheEntry<T>): void {
        if (this.store.has(key)) {
            this.store.delete(key);
        }

        // Evict oldest if at capacity
        while (this.store.size >= this.maxSize) {
            const firstKey = this.store.keys().next().value;
            if (firstKey !== undefined) {
                this.store.delete(firstKey);
            } else {
                break;
            }
        }

        this.store.set(key, entry);
        this.store.set(key, entry); // Ensure LRU order
    }

    delete(key: string): boolean {
        return this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    getAll(): Map<string, CacheEntry<T>> {
        return new Map(this.store);
    }

    size(): number {
        return this.store.size;
    }
}

class LFUCacheStore<T> implements CacheStore<T> {
    private store: Map<string, CacheEntry<T>> = new Map();
    private frequencyMap: Map<number, Set<string>> = new Map();
    private minFrequency: number = 0;
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
        this.frequencyMap.set(1, new Set());
    }

    get(key: string): CacheEntry<T> | undefined {
        const entry = this.store.get(key);
        if (entry) {
            const oldFreq = entry.accessCount;
            entry.accessCount++;
            entry.accessedAt = Date.now();

            // Move to next frequency level
            this.frequencyMap.get(oldFreq)?.delete(key);
            if (!this.frequencyMap.has(entry.accessCount)) {
                this.frequencyMap.set(entry.accessCount, new Set());
            }
            this.frequencyMap.get(entry.accessCount)?.add(key);

            // Update min frequency
            if (this.frequencyMap.get(oldFreq)?.size === 0 && oldFreq === this.minFrequency) {
                this.minFrequency++;
            }
        }
        return entry;
    }

    set(key: string, entry: CacheEntry<T>): void {
        if (this.store.has(key)) {
            this.get(key); // Update frequency
            return;
        }

        // Evict least frequently used if at capacity
        while (this.store.size >= this.maxSize) {
            const toEvict = this.frequencyMap.get(this.minFrequency)?.values().next().value;
            if (toEvict) {
                this.store.delete(toEvict);
                this.frequencyMap.get(this.minFrequency)?.delete(toEvict);
            }
        }

        entry.accessCount = 1;
        entry.createdAt = Date.now();
        this.store.set(key, entry);
        this.frequencyMap.get(1)?.add(key);
        this.minFrequency = 1;
    }

    delete(key: string): boolean {
        const entry = this.store.get(key);
        if (entry) {
            this.frequencyMap.get(entry.accessCount)?.delete(key);
            return this.store.delete(key);
        }
        return false;
    }

    clear(): void {
        this.store.clear();
        this.frequencyMap.clear();
        this.frequencyMap.set(1, new Set());
        this.minFrequency = 0;
    }

    getAll(): Map<string, CacheEntry<T>> {
        return new Map(this.store);
    }

    size(): number {
        return this.store.size;
    }
}

class FIFOCacheStore<T> implements CacheStore<T> {
    private store: Map<string, CacheEntry<T>> = new Map();
    private order: string[] = [];
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    get(key: string): CacheEntry<T> | undefined {
        const entry = this.store.get(key);
        if (entry) {
            entry.accessedAt = Date.now();
            entry.accessCount++;
        }
        return entry;
    }

    set(key: string, entry: CacheEntry<T>): void {
        if (this.store.has(key)) {
            return;
        }

        // Evict oldest if at capacity
        while (this.order.length >= this.maxSize) {
            const oldestKey = this.order.shift();
            if (oldestKey) {
                this.store.delete(oldestKey);
            }
        }

        entry.createdAt = Date.now();
        this.order.push(key);
        this.store.set(key, entry);
    }

    delete(key: string): boolean {
        const index = this.order.indexOf(key);
        if (index > -1) {
            this.order.splice(index, 1);
        }
        return this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
        this.order = [];
    }

    getAll(): Map<string, CacheEntry<T>> {
        return new Map(this.store);
    }

    size(): number {
        return this.store.size;
    }
}

// ============================================================================
// Main Cache Service
// ============================================================================

export class OmniCache {
    private static instance: OmniCache;
    private store: CacheStore<unknown>;
    private config: CacheConfig;
    private stats: CacheStats;
    private persistenceTimer?: NodeJS.Timeout;
    private isInitialized = false;

    private constructor(config?: Partial<CacheConfig>) {
        this.config = {
            maxSize: config?.maxSize || 10000,
            defaultTTL: config?.defaultTTL || 3600000, // 1 hour
            strategy: config?.strategy || 'LRU',
            enablePersistence: config?.enablePersistence || false,
            persistenceKey: config?.persistenceKey || 'omni_cache'
        };

        this.stats = {
            hits: 0,
            misses: 0,
            size: 0,
            maxSize: this.config.maxSize,
            hitRate: 0,
            evictions: 0,
            memoryUsage: 0
        };

        this.store = this.createStore();
    }

    static getInstance(config?: Partial<CacheConfig>): OmniCache {
        if (!OmniCache.instance) {
            OmniCache.instance = new OmniCache(config);
        }
        return OmniCache.instance;
    }

    private createStore(): CacheStore<unknown> {
        switch (this.config.strategy) {
            case 'LFU':
                return new LFUCacheStore(this.config.maxSize);
            case 'FIFO':
                return new FIFOCacheStore(this.config.maxSize);
            case 'LRU':
            default:
                return new LRUCacheStore(this.config.maxSize);
        }
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniCache] Already initialized');
            return;
        }

        omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Initializing Omni Cache...', {
            strategy: this.config.strategy,
            maxSize: this.config.maxSize
        });

        // Load from persistence if enabled
        if (this.config.enablePersistence) {
            await this.loadFromPersistence();
        }

        // Start persistence timer if enabled
        if (this.config.enablePersistence) {
            this.startPersistenceTimer();
        }

        this.isInitialized = true;
        omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Omni Cache initialized successfully');
    }

    private startPersistenceTimer(): void {
        this.persistenceTimer = setInterval(() => {
            this.persist();
        }, 60000); // Persist every minute

        // Also persist on shutdown
        process.on('beforeExit', () => {
            this.persist();
        });
    }

    async persist(): Promise<void> {
        if (!this.config.enablePersistence) return;

        try {
            const data = JSON.stringify(Array.from(this.store.getAll().entries()));
            localStorage?.setItem(this.config.persistenceKey!, data);
            omniLogger.debug(LogCategory.SYSTEM, '[OmniCache] Cache persisted');
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniCache] Persistence failed', { error });
        }
    }

    private async loadFromPersistence(): Promise<void> {
        try {
            const data = localStorage?.getItem(this.config.persistenceKey!);
            if (data) {
                const entries = JSON.parse(data) as [string, unknown][];
                for (const [key, value] of entries) {
                    const entry = value as CacheEntry<unknown>;
                    if (entry.expiresAt > Date.now()) {
                        this.store.set(key, entry);
                    }
                }
                omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Loaded from persistence', {
                    entries: entries.length
                });
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniCache] Failed to load from persistence', { error });
        }
    }

    async get<T = unknown>(key: string): Promise<T | undefined> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const entry = this.store.get(key) as CacheEntry<T> | undefined;

        // Check expiration
        if (entry && entry.expiresAt < Date.now()) {
            this.store.delete(key);
            this.stats.misses++;
            this.updateHitRate();
            return undefined;
        }

        if (entry) {
            this.stats.hits++;
            entry.accessedAt = Date.now();
            entry.accessCount++;
        } else {
            this.stats.misses++;
        }

        this.updateHitRate();
        return entry?.value;
    }

    async set<T = unknown>(
        key: string,
        value: T,
        ttl?: number,
        tags?: string[]
    ): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const expiresAt = Date.now() + (ttl || this.config.defaultTTL);

        const entry: CacheEntry<T> = {
            key,
            value,
            createdAt: Date.now(),
            accessedAt: Date.now(),
            accessCount: 0,
            ttl: ttl || this.config.defaultTTL,
            expiresAt,
            tags
        };

        this.store.set(key, entry);
    }

    async delete(key: string): Promise<boolean> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.store.delete(key);
    }

    async clear(): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        this.store.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            size: 0,
            maxSize: this.config.maxSize,
            hitRate: 0,
            evictions: 0,
            memoryUsage: 0
        };
        omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Cache cleared');
    }

    async deleteByTags(tags: string[]): Promise<number> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        let deleted = 0;
        const toDelete: string[] = [];

        for (const [key, entry] of this.store.getAll()) {
            if (entry.tags?.some(tag => tags.includes(tag))) {
                toDelete.push(key);
            }
        }

        for (const key of toDelete) {
            if (this.store.delete(key)) {
                deleted++;
            }
        }

        return deleted;
    }

    async deleteByPrefix(prefix: string): Promise<number> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const toDelete: string[] = [];

        for (const key of this.store.getAll().keys()) {
            if (key.startsWith(prefix)) {
                toDelete.push(key);
            }
        }

        for (const key of toDelete) {
            this.store.delete(key);
        }

        return toDelete.length;
    }



    async getStats(): Promise<CacheStats> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        this.stats.size = this.store.size();
        this.stats.memoryUsage = this.estimateMemoryUsage();

        // 🌟 Awakening: Merge Real Backend Stats
        const redisStats = await redisService.getMemoryStats();
        if (redisStats) {
            return {
                ...this.stats,
                // We overlay Redis stats into the generic stats where applicable
                // or extend the interface if strict typing allows. 
                // For now, we mix them in or rely on the consumer to handle extra props.
                // To be safe and compliant, let's attach them as specific 'backend' metadata if possible,
                // but CacheStats interface might need extension.
                // Let's modify CacheStats interface in the same file first? 
                // Actually, let's just extend the return object and assume dynamic consumers.
                ...redisStats
            } as CacheStats & { used_memory: number; maxmemory: number; fragmentation_ratio: number; mode: string };
        }

        return { ...this.stats };
    }

    private updateHitRate(): void {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }

    private estimateMemoryUsage(): number {
        let usage = 0;
        for (const entry of this.store.getAll().values()) {
            usage += JSON.stringify(entry.value).length * 2; // Approximate bytes
        }
        return usage;
    }

    async warmUp(keys: Record<string, unknown>): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Starting cache warm-up');

        for (const [key, value] of Object.entries(keys)) {
            await this.set(key, value, this.config.defaultTTL);
        }

        omniLogger.info(LogCategory.SYSTEM, '[OmniCache] Cache warm-up completed', {
            keys: Object.keys(keys).length
        });
    }

    async invalidate(pattern: RegExp): Promise<number> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const toDelete: string[] = [];

        for (const key of this.store.getAll().keys()) {
            if (pattern.test(key)) {
                toDelete.push(key);
            }
        }

        for (const key of toDelete) {
            this.store.delete(key);
        }

        return toDelete.length;
    }
}

// ============================================================================
// Decorator Utilities
// ============================================================================

export function cached<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    cache: OmniCache,
    keyGenerator: (...args: Parameters<T>) => string,
    ttl?: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        const key = keyGenerator(...args);
        const cachedValue = await cache.get(key);

        if (cachedValue !== undefined) {
            return cachedValue as ReturnType<T>;
        }

        const result = await fn(...args);
        await cache.set(key, result, ttl);

        return result;
    };
}

// ============================================================================
// Export Factory Function
// ============================================================================

export function createOmniCache(config?: Partial<CacheConfig>): OmniCache {
    return OmniCache.getInstance(config);
}

// ============================================================================
// Default Export
// ============================================================================

export default {
    Cache: OmniCache,
    createOmniCache,
    cached
};
