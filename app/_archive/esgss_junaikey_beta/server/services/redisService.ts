import redisClient from '../src/config/redis.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

class RedisService {
  client: any;
  isConnected: boolean = false;
  useMemoryFallback: boolean = false;
  memoryStore: any;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Standardized client from config
    this.client = redisClient;
    this.isConnected = false;
    this.useMemoryFallback = false;
    this.memoryStore = new Map(); // Fallback for dev without Redis

    this.init();
  }

  init() {
    try {
      this.client.on('connect', () => {
        omniLogger.info(LogCategory.SYSTEM, '[REDIS] 📡 Connected to Redis Cluster');
        this.isConnected = true;
        this.useMemoryFallback = false;
      });

      this.client.on('error', (err: any) => {
        if (this.isConnected) {
          omniLogger.error(LogCategory.SYSTEM, '[REDIS] ❌ Connection Error', { error: err.message });
        }
        this.isConnected = false;

        // Auto-switch to fallback if disconnected
        if (!this.useMemoryFallback) {
          this.useMemoryFallback = true;
          omniLogger.warn(LogCategory.SYSTEM, '[REDIS] [OFFLINE] Entering Resilience Mode (In-Memory Fallback)');
        }
      });

      // Heartbeat to attempt recovery from fallback
      this.heartbeatInterval = setInterval(async () => {
        const isReady = this.client && (this.client.status === 'ready' || this.client.status === 'connect');
        if (this.useMemoryFallback && isReady) {
          try {
            await this.client.ping();
            omniLogger.info(LogCategory.SYSTEM, '[REDIS] ♻️ Redis recovered. Resuming standard operations.');
            this.useMemoryFallback = false;
            this.isConnected = true;
          } catch (e) {
            // Still down
          }
        }
      }, 30000); // Check every 30s
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, '[REDIS] Failed to initialize listeners', { error: error.message });
      this.useMemoryFallback = true;
    }
  }

  async setSession(id: string, data: any, ttlSeconds = 3600) {
    if (this.useMemoryFallback || !this.isConnected) {
      this.memoryStore.set(id, { ...data, expiresAt: Date.now() + ttlSeconds * 1000 });
      return;
    }

    try {
      await this.client.set(id, JSON.stringify(data), 'EX', ttlSeconds);
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to set session ${id}`, { error: error.message });
      this.memoryStore.set(id, { ...data, expiresAt: Date.now() + ttlSeconds * 1000 });
    }
  }

  async getSession(id: string) {
    if (this.useMemoryFallback || !this.isConnected) {
      const session = this.memoryStore.get(id);
      if (session && session.expiresAt > Date.now()) {
        return session;
      } else if (session) {
        this.memoryStore.delete(id);
      }
      return null;
    }

    try {
      const data = await this.client.get(id);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to get session ${id}`, { error: error.message });
    }
    return null;
  }

  async deleteSession(id: string) {
    if (this.useMemoryFallback || !this.isConnected) {
      this.memoryStore.delete(id);
      return;
    }

    try {
      await this.client.del(id);
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to delete session ${id}`, { error: error.message });
    }
  }

  // --- Generic Caching Methods ---

  async get<T>(key: string): Promise<T | null> {
    if (this.useMemoryFallback || !this.isConnected) {
      const item = this.memoryStore.get(key);
      if (item && item.expiresAt > Date.now()) {
        return item.data;
      } else if (item) {
        this.memoryStore.delete(key);
      }
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to get cache ${key}`, { error: error.message });
    }
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
    if (this.useMemoryFallback || !this.isConnected) {
      this.memoryStore.set(key, { data: value, expiresAt: Date.now() + ttlSeconds * 1000 });
      return;
    }

    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to set cache ${key}`, { error: error.message });
      this.memoryStore.set(key, { data: value, expiresAt: Date.now() + ttlSeconds * 1000 });
    }
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 3600): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) {
      omniLogger.debug(LogCategory.SYSTEM, `[REDIS] [HIT] ${key}`);
      return cached;
    }

    omniLogger.debug(LogCategory.SYSTEM, `[REDIS] [MISS] ${key}`);
    const freshData = await fetcher();
    if (freshData) {
      await this.set(key, freshData, ttlSeconds);
    }
    return freshData;
  }

  async del(key: string): Promise<void> {
    if (this.useMemoryFallback || !this.isConnected) {
      this.memoryStore.delete(key);
      return;
    }

    try {
      await this.client.del(key);
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to delete cache ${key}`, { error: error.message });
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    if (this.useMemoryFallback || !this.isConnected) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      for (const key of this.memoryStore.keys()) {
        if (regex.test(key)) {
          this.memoryStore.delete(key);
        }
      }
      return;
    }

    try {
      const stream = this.client.scanStream({
        match: pattern,
        count: 100,
      });

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          this.client.del(keys);
        }
      });
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[REDIS] Failed to delete pattern ${pattern}`, { error: error.message });
    }
  }

  async healthCheck() {
    const status = {
      connected: this.isConnected,
      mode: this.useMemoryFallback ? 'resilience (memory)' : 'standard (redis)',
      store: this.useMemoryFallback ? 'Map' : 'Redis',
      keys: this.useMemoryFallback ? this.memoryStore.size : 0,
      details: {}
    };

    if (!this.useMemoryFallback && this.isConnected && this.client) {
      try {
        await this.client.ping();
        const info = await this.client.info('memory');
        const dbsize = await this.client.dbsize();
        status.keys = dbsize;
        status.details = {
          memory: info.split('\r\n').filter((line: string) => line.includes('used_memory_human')).map((line: string) => line.split(':')[1])[0]
        };
      } catch (e: any) {
        omniLogger.warn(LogCategory.SYSTEM, '[REDIS] Health check details failed', { error: e.message });
      }
    }

    return status;
  }

  async getMemoryStats() {
    if (this.useMemoryFallback || !this.isConnected) {
      return {
        used_memory: process.memoryUsage().heapUsed,
        maxmemory: 0,
        fragmentation_ratio: 0,
        mode: 'memory'
      };
    }

    try {
      const info = await this.client.info('memory');
      const lines = info.split('\r\n');
      const getVal = (key: string) => {
        const line = lines.find((l: string) => l.startsWith(key));
        return line ? parseFloat(line.split(':')[1]) : 0;
      };

      const usedMemory = getVal('used_memory');
      const maxMemory = getVal('maxmemory');
      const fragmentationRatio = getVal('mem_fragmentation_ratio');

      // Log warning if memory usage is high (only if maxmemory is set)
      if (maxMemory > 0 && (usedMemory / maxMemory) > 0.8) {
        omniLogger.warn(LogCategory.SYSTEM, '[REDIS] High Memory Usage', {
          used: usedMemory,
          max: maxMemory,
          ratio: usedMemory / maxMemory
        });
      }

      return {
        used_memory: usedMemory,
        maxmemory: maxMemory,
        fragmentation_ratio: fragmentationRatio,
        mode: 'redis'
      };
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, '[REDIS] Failed to get memory stats', { error: error.message });
      return null;
    }
  }

  async disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.client) {
      omniLogger.info(LogCategory.SYSTEM, '[REDIS] 🔌 Disconnecting...');
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

const redisService = new RedisService();
export default redisService;
