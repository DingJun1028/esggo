/**
 * UnifiedAdvancementCache.ts
 * ---------------------------
 * 奧秘晉級系統 - 快取服務
 * 
 * 核心理念：永續經營，效能優化
 * 設計哲學：快速響應，減少負載
 */

// 內存緩存實現（可用 Redis 替換）
interface CacheEntry {
  value: any;
  expiry: number;
}

interface CacheConfig {
  defaultTTL: number; // 默認過期時間（秒）
  maxSize: number;     // 最大緩存條數
}

export class UnifiedAdvancementCache {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;
  private hits: number;
  private misses: number;

  constructor(config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.config = {
      defaultTTL: config?.defaultTTL || 300, // 5 分鐘
      maxSize: config?.maxSize || 1000,      // 1000 條
      ...config,
    };
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 獲取緩存的用戶進度
   */
  async getUserProgress(userId: string): Promise<any | null> {
    const key = `progress:${userId}`;
    const entry = this.cache.get(key);
    
    if (entry && entry.expiry > Date.now()) {
      this.hits++;
      return entry.value;
    }
    
    this.misses++;
    return null;
  }

  /**
   * 緩存用戶進度
   */
  async setUserProgress(userId: string, data: any, ttl?: number): Promise<void> {
    const key = `progress:${userId}`;
    const expiry = Date.now() + (ttl || this.config.defaultTTL) * 1000;
    
    // 檢查緩存大小
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, { value: data, expiry });
  }

  /**
   * 獲取緩存的推薦
   */
  async getRecommendations(userId: string): Promise<any | null> {
    const key = `recommendations:${userId}`;
    const entry = this.cache.get(key);
    
    if (entry && entry.expiry > Date.now()) {
      this.hits++;
      return entry.value;
    }
    
    this.misses++;
    return null;
  }

  /**
   * 緩存推薦
   */
  async setRecommendations(userId: string, data: any, ttl?: number): Promise<void> {
    const key = `recommendations:${userId}`;
    const expiry = Date.now() + (ttl || this.config.defaultTTL) * 1000;
    
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, { value: data, expiry });
  }

  /**
   * 獲取緩存的排行榜
   */
  async getLeaderboard(limit: number): Promise<any | null> {
    const key = `leaderboard:${limit}`;
    const entry = this.cache.get(key);
    
    if (entry && entry.expiry > Date.now()) {
      this.hits++;
      return entry.value;
    }
    
    this.misses++;
    return null;
  }

  /**
   * 緩存排行榜
   */
  async setLeaderboard(limit: number, data: any, ttl?: number): Promise<void> {
    const key = `leaderboard:${limit}`;
    const expiry = Date.now() + (ttl || this.config.defaultTTL) * 1000;
    
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, { value: data, expiry });
  }

  /**
   * 獲取緩存的學習路徑
   */
  async getLearningPath(userId: string): Promise<any | null> {
    const key = `learningPath:${userId}`;
    const entry = this.cache.get(key);
    
    if (entry && entry.expiry > Date.now()) {
      this.hits++;
      return entry.value;
    }
    
    this.misses++;
    return null;
  }

  /**
   * 緩存學習路徑
   */
  async setLearningPath(userId: string, data: any, ttl?: number): Promise<void> {
    const key = `learningPath:${userId}`;
    const expiry = Date.now() + (ttl || this.config.defaultTTL) * 1000;
    
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, { value: data, expiry });
  }

  /**
   * 清除用戶相關緩存
   */
  async invalidateUser(userId: string): Promise<void> {
    const patterns = [
      `progress:${userId}`,
      `recommendations:${userId}`,
      `learningPath:${userId}`,
    ];
    
    for (const pattern of patterns) {
      this.cache.delete(pattern);
    }
  }

  /**
   * 清除所有緩存
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 獲取緩存統計
   */
  getStats(): {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
  } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;
    
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate,
    };
  }

  /**
   * 清理過期緩存
   */
  async cleanup(): Promise<number> {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry <= now) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    return removed;
  }

  /**
   * 驅逐最舊的緩存條目
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestExpiry = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < oldestExpiry) {
        oldestExpiry = entry.expiry;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// 導出實例
export const unifiedAdvancementCache = new UnifiedAdvancementCache();
