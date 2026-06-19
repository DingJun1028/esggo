import Redis from "ioredis";

/**
 * 萬能之心 - Redis 後端永憶
 * 具備嚴格型別推導的分散式記憶載體
 */
export class EternalMemoryRedis<MemoryMap extends Record<string, any>> {
    private redis: Redis;
    private namespace: string;

    constructor(redisUrl: string, namespace: string = "OmnipotentHeart") {
        this.redis = new Redis(redisUrl);
        this.namespace = namespace;
    }

    // 產生帶有命名空間的鍵值，避免污染全局 Redis
    private getPrefixKey(key: string | number | symbol): string {
        return `${this.namespace}:${String(key)}`;
    }

    /**
     * 覺醒：確認 Redis 神經元連線狀態
     */
    public async awaken(): Promise<void> {
        await this.redis.ping();
        console.log(`[${this.namespace}] 🌌 後端系統已覺醒，Redis 記憶神經元連結成功。`);
    }

    /**
     * 銘刻：將資料序列化並刻入 Redis
     */
    public async engrave<K extends keyof MemoryMap>(key: K, data: MemoryMap[K], expireSeconds?: number): Promise<void> {
        const serializedData = JSON.stringify(data);
        if (expireSeconds) {
            await this.redis.set(this.getPrefixKey(key), serializedData, "EX", expireSeconds);
        } else {
            await this.redis.set(this.getPrefixKey(key), serializedData);
        }
        console.log(`[後端銘刻] 節點 '${String(key)}' 已寫入 Redis。`);
    }

    /**
     * 追溯：從 Redis 喚回資料並還原型別
     */
    public async recall<K extends keyof MemoryMap>(key: K): Promise<MemoryMap[K] | undefined> {
        const data = await this.redis.get(this.getPrefixKey(key));
        if (!data) return undefined;

        return JSON.parse(data) as MemoryMap[K];
    }
}