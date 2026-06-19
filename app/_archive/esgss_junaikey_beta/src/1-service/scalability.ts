// 系統擴展性與性能優化工具
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export interface ScalabilityCacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
}

export class ScalabilityCache {
  private cache = new Map<string, ScalabilityCacheEntry>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      strategy: options.strategy || 'lru',
    };

    // Start cleanup interval
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000); // Clean every minute
  }

  private cleanupInterval: NodeJS.Timeout;

  set<T>(key: string, data: T, ttl?: number): void {
    // Evict if cache is full
    if (this.cache.size >= this.options.maxSize) {
      this.evict();
    }

    const entry: ScalabilityCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as ScalabilityCacheEntry<T> | undefined;

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private evict(): void {
    let keyToEvict: string | null = null;

    switch (this.options.strategy) {
      case 'lru':
        // Least Recently Used
        let oldestAccess = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (entry.lastAccessed < oldestAccess) {
            oldestAccess = entry.lastAccessed;
            keyToEvict = key;
          }
        }
        break;

      case 'lfu':
        // Least Frequently Used
        let leastAccess = Infinity;
        for (const [key, entry] of this.cache.entries()) {
          if (entry.accessCount < leastAccess) {
            leastAccess = entry.accessCount;
            keyToEvict = key;
          }
        }
        break;

      case 'fifo':
        // First In, First Out
        let oldestTimestamp = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
            keyToEvict = key;
          }
        }
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
    }
  }

  private cleanup(): void {
    try {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    } catch (error) {
      omniLogger.warn(LogCategory.PERFORMANCE, 'Cache cleanup failed', { error });
    }
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const averageTTL = entries.reduce((sum, entry) => sum + entry.ttl, 0) / entries.length || 0;

    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      totalAccess,
      averageAccess: totalAccess / entries.length || 0,
      averageTTL,
      hitRate:
        totalAccess > 0
          ? (entries.filter(e => e.accessCount > 0).length / entries.length) * 100
          : 0,
    };
  }
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
    omniLogger.info(LogCategory.SYSTEM, 'ScalabilityCache destroyed');
  }
}

// 請求批次處理器 (Request Batcher)
export class RequestBatcher<T = any> {
  private batch: Array<{
    request: T;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private processing = false;

  constructor(
    private processor: (requests: T[]) => Promise<any[]>,
    private options: {
      maxBatchSize?: number;
      maxWaitTime?: number;
      minBatchSize?: number;
    } = {}
  ) {
    this.options = {
      maxBatchSize: options.maxBatchSize || 10,
      maxWaitTime: options.maxWaitTime || 100,
      minBatchSize: options.minBatchSize || 1,
    };
  }

  async add(request: T): Promise<any> {
    return new Promise((resolve, reject) => {
      this.batch.push({ request, resolve, reject });

      if (this.batch.length >= this.options.maxBatchSize!) {
        this.processBatch();
      } else if (this.batch.length >= this.options.minBatchSize! && !this.timeoutId) {
        this.timeoutId = setTimeout(() => this.processBatch(), this.options.maxWaitTime);
      }
    });
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.batch.length === 0) return;

    this.processing = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const currentBatch = [...this.batch];
    this.batch = [];

    try {
      const requests = currentBatch.map(item => item.request);
      const results = await this.processor(requests);

      currentBatch.forEach((item, index) => {
        if (index < results.length) {
          item.resolve(results[index]);
        } else {
          item.reject(new Error('Batch processing returned insufficient results'));
        }
      });
    } catch (error) {
      currentBatch.forEach(item => {
        item.reject(error);
      });
    } finally {
      this.processing = false;
    }
  }

  flush(): void {
    if (this.batch.length > 0) {
      this.processBatch();
    }
  }

  get pendingCount(): number {
    return this.batch.length;
  }

  get isProcessing(): boolean {
    return this.processing;
  }
}

// 資源池管理器 (Resource Pool Manager)
export class ResourcePool<T> {
  private available: T[] = [];
  private waitingQueue: Array<{
    resolve: (resource: T) => void;
    reject: (error: any) => void;
  }> = [];
  private borrowed = new Set<T>();

  constructor(
    private factory: () => Promise<T> | T,
    private destroyer: (resource: T) => Promise<void> | void,
    private options: {
      minSize?: number;
      maxSize?: number;
      acquireTimeout?: number;
    } = {}
  ) {
    this.options = {
      minSize: options.minSize || 2,
      maxSize: options.maxSize || 10,
      acquireTimeout: options.acquireTimeout || 30000,
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    const creationPromises = [];
    for (let i = 0; i < this.options.minSize!; i++) {
      creationPromises.push(
        (async () => {
          try {
            const resource = await this.factory();
            this.available.push(resource);
          } catch (error) {
            omniLogger.error(
              LogCategory.PERFORMANCE,
              `Failed to create initial resource in pool [${i}]`,
              { error }
            );
          }
        })()
      );
    }
    await Promise.allSettled(creationPromises);
  }

  async acquire(): Promise<T> {
    // Return available resource immediately
    if (this.available.length > 0) {
      const resource = this.available.pop()!;
      this.borrowed.add(resource);
      return resource;
    }

    // Check if we can create more resources
    if (this.borrowed.size < this.options.maxSize!) {
      try {
        const resource = await this.factory();
        this.borrowed.add(resource);
        return resource;
      } catch (error) {
        // If creation fails, wait for an existing resource
      }
    }

    // Wait for a resource to become available
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.reject === reject);
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error('Resource acquisition timeout'));
      }, this.options.acquireTimeout);

      this.waitingQueue.push({
        resolve: resource => {
          clearTimeout(timeoutId);
          resolve(resource);
        },
        reject: error => {
          clearTimeout(timeoutId);
          reject(error);
        },
      });
    });
  }

  async release(resource: T): Promise<void> {
    if (!this.borrowed.has(resource)) {
      throw new Error('Attempting to release unknown resource');
    }

    this.borrowed.delete(resource);

    // Check if anyone is waiting
    if (this.waitingQueue.length > 0) {
      const waiter = this.waitingQueue.shift()!;
      this.borrowed.add(resource);
      waiter.resolve(resource);
    } else {
      this.available.push(resource);
    }
  }

  async destroy(resource: T): Promise<void> {
    if (this.borrowed.has(resource)) {
      this.borrowed.delete(resource);
    } else {
      const index = this.available.indexOf(resource);
      if (index !== -1) {
        this.available.splice(index, 1);
      }
    }

    await this.destroyer(resource);
  }

  get stats() {
    return {
      available: this.available.length,
      borrowed: this.borrowed.size,
      waiting: this.waitingQueue.length,
      total: this.available.length + this.borrowed.size,
    };
  }

  async close(): Promise<void> {
    // Reject all waiting requests
    this.waitingQueue.forEach(waiter => {
      waiter.reject(new Error('Resource pool is closing'));
    });
    this.waitingQueue = [];

    // Destroy all resources
    const allResources = [...this.available, ...Array.from(this.borrowed)];
    await Promise.allSettled(allResources.map(resource => this.destroyer(resource)));

    this.available = [];
    this.borrowed.clear();
  }
}

// 負載均衡器 (Load Balancer)
export class LoadBalancer {
  private servers: Array<{
    url: string;
    weight: number;
    activeConnections: number;
    health: boolean;
  }> = [];

  constructor(
    serverConfigs: Array<{ url: string; weight?: number }>,
    private options: {
      healthCheckInterval?: number;
      maxConnections?: number;
    } = {}
  ) {
    this.options = {
      healthCheckInterval: options.healthCheckInterval || 30000,
      maxConnections: options.maxConnections || 100,
    };

    this.servers = serverConfigs.map(config => ({
      url: config.url,
      weight: config.weight || 1,
      activeConnections: 0,
      health: true,
    }));

    this.startHealthChecks();
  }

  async getServer(): Promise<string> {
    // Filter healthy servers with available capacity
    const availableServers = this.servers.filter(
      server => server.health && server.activeConnections < this.options.maxConnections!
    );

    if (availableServers.length === 0) {
      throw new Error('No available servers');
    }

    // Weighted round-robin selection
    const totalWeight = availableServers.reduce((sum, server) => sum + server.weight, 0);
    let random = Math.random() * totalWeight;

    for (const server of availableServers) {
      random -= server.weight;
      if (random <= 0) {
        server.activeConnections++;
        return server.url;
      }
    }

    // Fallback to first available server
    availableServers[0]!.activeConnections++;
    return availableServers[0]!.url;
  }

  releaseServer(url: string): void {
    const server = this.servers.find(s => s.url === url);
    if (server && server.activeConnections > 0) {
      server.activeConnections--;
    }
  }

  private _healthCheckIntervalStarted = false;

  private async startHealthChecks(): Promise<void> {
    if (this._healthCheckIntervalStarted) return;
    this._healthCheckIntervalStarted = true;

    const checkHealth = async () => {
      for (const server of this.servers) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch(`${server.url}/health`, {
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' },
          });
          clearTimeout(timeoutId);
          server.health = response.ok;
        } catch (error) {
          server.health = false;
          // Only log if it was previously healthy or if it's a critical change
          omniLogger.warn(LogCategory.PERFORMANCE, `Health check failed for ${server.url}`, {
            error: (error as any).message,
          });
        }
      }
    };

    // Initial health check
    await checkHealth();

    // Periodic health checks
    // Periodic health checks
    this.healthCheckInterval = setInterval(checkHealth, this.options.healthCheckInterval);
  }

  private healthCheckInterval?: NodeJS.Timeout;

  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
    omniLogger.info(LogCategory.SYSTEM, 'LoadBalancer destroyed');
  }

  get stats() {
    return this.servers.map(server => ({
      url: server.url,
      healthy: server.health,
      activeConnections: server.activeConnections,
      weight: server.weight,
    }));
  }
}

// 回應壓縮器 (Response Compressor)
export class ResponseCompressor {
  private static readonly COMPRESSION_THRESHOLD = 1024; // 1KB

  static async compressResponse(response: Response): Promise<Response> {
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type') || '';

    // Don't compress small responses or certain content types
    if (contentLength && parseInt(contentLength) < this.COMPRESSION_THRESHOLD) {
      return response;
    }

    // Skip compression for already compressed content
    if (
      contentType.includes('gzip') ||
      contentType.includes('deflate') ||
      contentType.includes('br') ||
      contentType.includes('image/') ||
      contentType.includes('video/') ||
      contentType.includes('audio/')
    ) {
      return response;
    }

    try {
      // Use CompressionStream if available (modern browsers)
      const hasCompression = typeof window !== 'undefined' && 'CompressionStream' in window;
      if (hasCompression && response.body) {
        const stream = new (window as any).CompressionStream('gzip');
        const compressedStream = response.body.pipeThrough(stream);

        const newHeaders = new Headers(response.headers);
        newHeaders.set('content-encoding', 'gzip');
        // Note: content-length is unknown for stream, remove it
        newHeaders.delete('content-length');

        return new Response(compressedStream, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

      // Fallback: return uncompressed response
      return response;
    } catch (error) {
      omniLogger.warn(LogCategory.PERFORMANCE, 'Response compression failed', { error });
      return response;
    }
  }

  static shouldCompress(contentType: string, contentLength: number): boolean {
    // Don't compress small content
    if (contentLength < this.COMPRESSION_THRESHOLD) return false;

    // Don't compress already compressed content
    if (
      contentType.includes('gzip') ||
      contentType.includes('deflate') ||
      contentType.includes('br') ||
      contentType.includes('image/') ||
      contentType.includes('video/') ||
      contentType.includes('audio/')
    ) {
      return false;
    }

    // Compress text-based content
    return (
      contentType.includes('text/') ||
      contentType.includes('application/json') ||
      contentType.includes('application/javascript') ||
      contentType.includes('application/xml')
    );
  }
}

// 創建全域實體
export const globalCache = new ScalabilityCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 200,
  strategy: 'lru',
});
