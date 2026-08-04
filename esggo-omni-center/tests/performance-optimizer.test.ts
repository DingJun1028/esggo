/**
 * ==========================================
 * 完全代主自行 - 效能優化測試
 * ==========================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  LRUCache,
  DelegationCacheManager,
  BatchProcessor,
  ConnectionPool,
  PerformanceMonitor,
} from '../src/agents/complete-delegation/performance-optimizer';

// ==========================================
// LRU 快取測試
// ==========================================

describe('LRUCache', () => {
  let cache: LRUCache<string>;

  beforeEach(() => {
    cache = new LRUCache<string>({
      maxSize: 3,
      ttl: 1000,
    });
  });

  it('should set and get values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return undefined for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('should evict oldest entries when full', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    cache.set('key4', 'value4');

    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe('value2');
  });

  it('should handle TTL expiration', async () => {
    const shortCache = new LRUCache<string>({
      maxSize: 10,
      ttl: 50,
    });

    shortCache.set('key1', 'value1');
    expect(shortCache.get('key1')).toBe('value1');

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(shortCache.get('key1')).toBeUndefined();
  });

  it('should delete entries', () => {
    cache.set('key1', 'value1');
    expect(cache.delete('key1')).toBe(true);
    expect(cache.get('key1')).toBeUndefined();
  });

  it('should check if key exists', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(false);
  });

  it('should clear all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.size).toBe(0);
  });

  it('should return correct size', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    expect(cache.size).toBe(2);
  });

  it('should return stats', () => {
    cache.set('key1', 'value1');
    cache.get('key1');
    cache.get('key1');

    const stats = cache.getStats();
    expect(stats.size).toBe(1);
    expect(stats.maxSize).toBe(3);
    expect(stats.avgAccessCount).toBe(3);
  });
});

// ==========================================
// 授權快取管理器測試
// ==========================================

describe('DelegationCacheManager', () => {
  let manager: DelegationCacheManager;

  beforeEach(() => {
    manager = DelegationCacheManager.getInstance();
    manager.clearAll();
  });

  it('should store and retrieve delegation', () => {
    const delegation = {
      uuid: 'test-uuid',
      signature: 'test-signature',
    } as any;

    manager.setDelegation('delegation-1', delegation);
    expect(manager.getDelegation('delegation-1')).toEqual(delegation);
  });

  it('should store and retrieve validation', () => {
    manager.setValidation('delegation-1', 'read', true);
    expect(manager.getValidation('delegation-1', 'read')).toBe(true);
  });

  it('should invalidate delegation cache', () => {
    const delegation = {
      uuid: 'test-uuid',
      signature: 'test-signature',
    } as any;

    manager.setDelegation('delegation-1', delegation);
    manager.invalidateDelegation('delegation-1');
    expect(manager.getDelegation('delegation-1')).toBeUndefined();
  });

  it('should return stats', () => {
    const stats = manager.getStats();
    expect(stats.delegation).toBeDefined();
    expect(stats.validation).toBeDefined();
    expect(stats.decision).toBeDefined();
  });
});

// ==========================================
// 批次處理器測試
// ==========================================

describe('BatchProcessor', () => {
  it('should process items in batches', async () => {
    const processed: number[][] = [];
    const processor = new BatchProcessor<number, number>(
      async (items) => {
        processed.push(items);
        return items.map((item) => item * 2);
      },
      { batchSize: 3, batchDelay: 50 }
    );

    const results = await Promise.all([
      processor.add(1),
      processor.add(2),
      processor.add(3),
      processor.add(4),
      processor.add(5),
    ]);

    expect(results).toEqual([2, 4, 6, 8, 10]);
    expect(processed.length).toBe(2);
    expect(processed[0]).toEqual([1, 2, 3]);
    expect(processed[1]).toEqual([4, 5]);
  });

  it('should handle batch delays', async () => {
    const processor = new BatchProcessor<number, number>(
      async (items) => items.map((item) => item * 2),
      { batchSize: 10, batchDelay: 50 }
    );

    const result = await processor.add(1);
    expect(result).toBe(2);
  });

  it('should handle processor errors', async () => {
    const processor = new BatchProcessor<number, number>(
      async () => {
        throw new Error('Processor error');
      },
      { batchSize: 1 }
    );

    await expect(processor.add(1)).rejects.toThrow('Processor error');
  });

  it('should add many items', async () => {
    const processor = new BatchProcessor<number, number>(
      async (items) => items.map((item) => item * 2),
      { batchSize: 5 }
    );

    const results = await processor.addMany([1, 2, 3, 4, 5]);
    expect(results).toEqual([2, 4, 6, 8, 10]);
  });
});

// ==========================================
// 連線池測試
// ==========================================

describe('ConnectionPool', () => {
  it('should acquire and release connections', async () => {
    const pool = new ConnectionPool<number>(
      () => Math.random(),
      () => {},
      { minSize: 2, maxSize: 5 }
    );

    const conn1 = await pool.acquire();
    const status1 = pool.getStatus();
    expect(status1.inUse).toBe(1);

    pool.release(conn1);
    const status2 = pool.getStatus();
    expect(status2.inUse).toBe(0);
    expect(status2.available).toBe(2);
  });

  it('should create new connections when pool is empty', async () => {
    const pool = new ConnectionPool<number>(
      () => Math.random(),
      () => {},
      { minSize: 0, maxSize: 5 }
    );

    const conn = await pool.acquire();
    expect(conn).toBeDefined();
    expect(pool.getStatus().inUse).toBe(1);
  });

  it('should respect max pool size', async () => {
    const pool = new ConnectionPool<number>(
      () => Math.random(),
      () => {},
      { minSize: 0, maxSize: 2 }
    );

    const conn1 = await pool.acquire();
    const conn2 = await pool.acquire();

    expect(pool.getStatus().inUse).toBe(2);
    expect(pool.getStatus().available).toBe(0);

    pool.release(conn1);
    pool.release(conn2);
  });

  it('should close all connections', () => {
    const destroyed: number[] = [];
    const pool = new ConnectionPool<number>(
      () => Math.random(),
      (conn) => destroyed.push(conn),
      { minSize: 2, maxSize: 5 }
    );

    pool.close();
    expect(pool.getStatus().total).toBe(0);
  });
});

// ==========================================
// 效能監控器測試
// ==========================================

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance();
    monitor.clear();
  });

  it('should record operation metrics', () => {
    monitor.record('test-operation', 100);
    monitor.record('test-operation', 200);
    monitor.record('test-operation', 150);

    const stats = monitor.getStats('test-operation');
    expect(stats).toBeDefined();
    expect(stats!.count).toBe(3);
    expect(stats!.avgTime).toBe(150);
    expect(stats!.minTime).toBe(100);
    expect(stats!.maxTime).toBe(200);
    expect(stats!.totalTime).toBe(450);
  });

  it('should return undefined for non-existent operations', () => {
    expect(monitor.getStats('nonexistent')).toBeUndefined();
  });

  it('should return all stats', () => {
    monitor.record('op1', 100);
    monitor.record('op2', 200);

    const allStats = monitor.getAllStats();
    expect(allStats.size).toBe(2);
    expect(allStats.has('op1')).toBe(true);
    expect(allStats.has('op2')).toBe(true);
  });

  it('should clear all metrics', () => {
    monitor.record('op1', 100);
    monitor.record('op2', 200);
    monitor.clear();

    expect(monitor.getStats('op1')).toBeUndefined();
    expect(monitor.getStats('op2')).toBeUndefined();
  });

  it('should generate report', () => {
    monitor.record('test-op', 100);
    const report = monitor.generateReport();

    expect(report).toContain('效能監控報告');
    expect(report).toContain('test-op');
    expect(report).toContain('100.00ms');
  });
});
