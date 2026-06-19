/**
 * Local Redis Simulator Provider
 * 模擬 Redis 行為的本地提供者，採用 5T 協議
 */
import { RedisProvider } from './OmniCacheService';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export class LocalRedisSimProvider implements RedisProvider {
    private storage = new Map<string, { value: any; expiry: number }>();

    async get<T>(key: string): Promise<T | null> {
        const item = this.storage.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.storage.delete(key);
            return null;
        }
        return item.value as T;
    }

    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
        this.storage.set(key, {
            value,
            expiry: Date.now() + ttlSeconds * 1000,
        });
        omniLogger.debug(LogCategory.SYSTEM, `[RedisSim] SET ${key} (ttl: ${ttlSeconds}s)`);
    }

    async del(key: string): Promise<void> {
        this.storage.delete(key);
    }

    async clear(pattern: string): Promise<number> {
        let count = 0;
        for (const key of this.storage.keys()) {
            if (key.startsWith(pattern)) {
                this.storage.delete(key);
                count++;
            }
        }
        return count;
    }
}
