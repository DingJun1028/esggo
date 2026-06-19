/**
 * RedisService.ts
 * Redis 快取服務：建立與管理 Redis 連線，提供快取存取介面
 */

import { Redis } from 'ioredis';
import logger from '../utils/logger.js';

class RedisService {
    private client: Redis | null = null;
    private isConnected: boolean = false;

    /**
     * 初始化 Redis 連線
     */
    public async initialize(): Promise<void> {
        if (this.client) return;

        if (process.env.REDIS_FALLBACK_ONLY === 'true') {
            logger.warn('REDIS_FALLBACK_ONLY is enabled. Initializing dummy Redis client in RedisService.');
            this.client = {
                on: () => this.client,
                get: async () => null,
                set: async () => 'OK',
                del: async () => 0,
                scan: async () => ['0', []],
                call: async (command: string) => {
                    if (command?.toLowerCase() === 'eval' || command?.toLowerCase() === 'evalsha') {
                        return [1, 60000];
                    }
                    return 'OK';
                },
                sendCommand: async (command: string) => {
                    if (command?.toLowerCase() === 'eval' || command?.toLowerCase() === 'evalsha') {
                        return [1, 60000];
                    }
                    return 'OK';
                },
                quit: async () => 'OK',
                status: 'ready'
            } as any;
            this.isConnected = true;
            return;
        }

        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        try {
            this.client = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                retryStrategy(times) {
                    const delay = Math.min(times * 100, 3000);
                    return delay;
                },
            });

            this.client.on('connect', () => {
                this.isConnected = true;
                logger.info('Redis 連結成功');
            });

            this.client.on('error', (err) => {
                this.isConnected = false;
                logger.error('Redis 連結錯誤:', err);
            });

        } catch (error) {
            logger.error('Redis 初始化失敗:', error);
            this.client = null;
        }
    }

    /**
     * 獲取快取
     */
    public async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected || !this.client) return null;

        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error(`Redis Get 錯誤 [${key}]:`, error);
            return null;
        }
    }

    /**
     * 設置快取
     * @param key 鍵
     * @param value 值
     * @param ttl 過期時間 (秒)，預設 1 小時
     */
    public async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        if (!this.isConnected || !this.client) return;

        try {
            const data = JSON.stringify(value);
            await this.client.set(key, data, 'EX', ttl);
        } catch (error) {
            logger.error(`Redis Set 錯誤 [${key}]:`, error);
        }
    }

    /**
     * 刪除快取
     */
    public async del(key: string): Promise<void> {
        if (!this.isConnected || !this.client) return;

        try {
            if (key.includes('*')) {
                await this.delByPattern(key);
            } else {
                await this.client.del(key);
            }
        } catch (error) {
            logger.error(`Redis Del 錯誤 [${key}]:`, error);
        }
    }

    /**
     * 按模式刪除快取 (使用 SCAN 避免阻塞)
     */
    private async delByPattern(pattern: string): Promise<void> {
        if (!this.client) return;

        let cursor = '0';
        do {
            const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = nextCursor;
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
        } while (cursor !== '0');
    }

    /**
     * 檢查是否連線
     */
    public status(): boolean {
        return this.isConnected;
    }
}

export const redisService = new RedisService();
