// Cache Manager - M9 System Integration Module
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

// Cache Item
interface CacheItem<T> {
  value: T;
  expiry: number;
}

// Service Class
export class CacheManager {
  private static instance: CacheManager;
  private storage = new Map<string, CacheItem<any>>();
  private defaultTTL = 60 * 1000; // 1 min

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Set
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    this.storage.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  // Get
  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.storage.delete(key);
      return null;
    }

    return item.value;
  }

  // Delete
  delete(key: string): void {
    this.storage.delete(key);
  }

  // Clear
  clear(): void {
    this.storage.clear();
    omniLogger.info(LogCategory.SYSTEM, 'Cache cleared');
  }
}

export const cacheManager = CacheManager.getInstance();
