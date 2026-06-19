import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { RedisProvider } from './OmniCacheService';

/**
 * ⚡ 奧秘 Redis 快取服務 (前端安全 Mock 版)
 * --------------------------------------------------
 * 此服務在前端環境中僅作為介面佔位符，防止 ioredis 導致的崩潰。
 * 真正的 Redis 邏輯僅應在後端執行。
 */

class RedisCacheService implements RedisProvider {
    private isConnected = false;

    constructor() {
        // 前端環境不進行真實連線
        console.log('⚡ [RedisCacheService] Interface initialized in Frontend-Safe mode.');
    }

    public async get<T>(_key: string): Promise<T | null> {
        return null;
    }

    public async set<T>(_key: string, _value: T, _ttlSeconds: number = 3600): Promise<void> {
        return;
    }

    public async del(_key: string): Promise<void> {
        return;
    }

    public async clear(_pattern: string): Promise<number> {
        return 0;
    }

    public isAvailable(): boolean {
        return false;
    }
}

export const redisCacheService = new RedisCacheService();
export default redisCacheService;
