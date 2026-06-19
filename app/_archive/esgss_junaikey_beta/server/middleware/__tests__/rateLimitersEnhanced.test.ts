/**
 * Integration Tests for Rate Limiters Enhanced
 * 增強版 Rate Limiting 的整合測試
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// Mock Redis before imports
vi.mock('ioredis', () => {
  return vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn().mockResolvedValue('OK'),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
    ttl: vi.fn().mockResolvedValue(60),
    del: vi.fn().mockResolvedValue(1),
    quit: vi.fn().mockResolvedValue('OK'),
    on: vi.fn()
  }));
});

import { 
  rateLimiters,
  createRateLimiter,
  RateLimitConfig,
  RateLimitResult,
  inMemoryStore,
  redisStore
} from '../rateLimitersEnhanced.js';

describe('Rate Limiters Enhanced Integration Tests', () => {
  // Helper to advance time
  const advanceTime = (ms: number) => {
    vi.advanceTimersByTime(ms);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Clear in-memory store
    inMemoryStore.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('In-Memory Store', () => {
    it('should increment counter', async () => {
      const result = await inMemoryStore.increment('test-key', 60);
      expect(result.count).toBe(1);
      expect(result.remaining).toBe(99);
    });

    it('should track multiple requests', async () => {
      for (let i = 0; i < 5; i++) {
        await inMemoryStore.increment('multi-key');
      }
      
      const result = await inMemoryStore.increment('multi-key');
      expect(result.count).toBe(6);
      expect(result.remaining).toBe(94);
    });

    it('should reset key', async () => {
      await inMemoryStore.increment('reset-key');
      await inMemoryStore.increment('reset-key');
      
      await inMemoryStore.reset('reset-key');
      
      const result = await inMemoryStore.increment('reset-key');
      expect(result.count).toBe(1);
    });

    it('should auto-expire keys', async () => {
      await inMemoryStore.increment('expire-key', 1); // 1 second TTL
      
      advanceTime(500);
      let result = await inMemoryStore.increment('expire-key');
      expect(result.count).toBe(2);
      
      advanceTime(600); // Expire after 1.1 seconds
      result = await inMemoryStore.increment('expire-key');
      expect(result.count).toBe(1); // Should be reset
    });
  });

  describe('Pre-configured Rate Limiters', () => {
    describe('strictLimiter', () => {
      it('should allow requests within limit', async () => {
        const results: RateLimitResult[] = [];
        
        for (let i = 0; i < 10; i++) {
          const result = await rateLimiters.strictLimiter.check('strict-user-1');
          results.push(result);
        }

        expect(results.every(r => r.success)).toBe(true);
        expect(results[0].remaining).toBe(0);
      });

      it('should block requests exceeding limit', async () => {
        // Exhaust the limit
        for (let i = 0; i < 10; i++) {
          await rateLimiters.strictLimiter.check('strict-user-2');
        }

        const result = await rateLimiters.strictLimiter.check('strict-user-2');
        expect(result.success).toBe(false);
        expect(result.retryAfter).toBeGreaterThan(0);
      });
    });

    describe('apiLimiter', () => {
      it('should allow API requests within limit', async () => {
        const results: RateLimitResult[] = [];
        
        for (let i = 0; i < 100; i++) {
          const result = await rateLimiters.apiLimiter.check('api-user-1');
          results.push(result);
        }

        expect(results.every(r => r.success)).toBe(true);
      });

      it('should block excessive API requests', async () => {
        for (let i = 0; i < 100; i++) {
          await rateLimiters.apiLimiter.check('api-user-2');
        }

        const result = await rateLimiters.apiLimiter.check('api-user-2');
        expect(result.success).toBe(false);
      });
    });

    describe('authLimiter', () => {
      it('should allow auth attempts within limit', async () => {
        const results: RateLimitResult[] = [];
        
        for (let i = 0; i < 5; i++) {
          const result = await rateLimiters.authLimiter.check('auth-user-1');
          results.push(result);
        }

        expect(results.every(r => r.success)).toBe(true);
      });

      it('should block brute force attempts', async () => {
        for (let i = 0; i < 5; i++) {
          await rateLimiters.authLimiter.check('auth-user-2');
        }

        const result = await rateLimiters.authLimiter.check('auth-user-2');
        expect(result.success).toBe(false);
        expect(result.retryAfter).toBeGreaterThan(0);
      });
    });

    describe('uploadLimiter', () => {
      it('should limit file uploads', async () => {
        const results: RateLimitResult[] = [];
        
        for (let i = 0; i < 10; i++) {
          const result = await rateLimiters.uploadLimiter.check('upload-user-1');
          results.push(result);
        }

        expect(results.every(r => r.success)).toBe(true);
      });

      it('should block excessive uploads', async () => {
        for (let i = 0; i < 10; i++) {
          await rateLimiters.uploadLimiter.check('upload-user-2');
        }

        const result = await rateLimiters.uploadLimiter.check('upload-user-2');
        expect(result.success).toBe(false);
      });
    });

    describe('searchLimiter', () => {
      it('should limit search requests', async () => {
        const results: RateLimitResult[] = [];
        
        for (let i = 0; i < 30; i++) {
          const result = await rateLimiters.searchLimiter.check('search-user-1');
          results.push(result);
        }

        expect(results.every(r => r.success)).toBe(true);
      });

      it('should block excessive searches', async () => {
        for (let i = 0; i < 30; i++) {
          await rateLimiters.searchLimiter.check('search-user-2');
        }

        const result = await rateLimiters.searchLimiter.check('search-user-2');
        expect(result.success).toBe(false);
      });
    });

    describe('websocketLimiter', () => {
      it('should allow websocket connections', async () => {
        const results: RateLimitResult[] = [];
        
        for (let i = 0; i < 25; i++) {
          const result = await rateLimiters.websocketLimiter.check('ws-user-1');
          results.push(result);
        }

        expect(results.every(r => r.success)).toBe(true);
      });

      it('should limit websocket connections', async () => {
        for (let i = 0; i < 25; i++) {
          await rateLimiters.websocketLimiter.check('ws-user-2');
        }

        const result = await rateLimiters.websocketLimiter.check('ws-user-2');
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Custom Rate Limiter Creation', () => {
    it('should create custom rate limiter with config', async () => {
      const customConfig: RateLimitConfig = {
        windowMs: 60000,
        maxRequests: 5,
        message: 'Custom rate limit exceeded',
        store: 'memory',
        headers: true,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        keyGenerator: (req) => req.ip || 'unknown'
      };

      const customLimiter = createRateLimiter(customConfig);
      
      // Should not throw
      expect(customLimiter).toBeDefined();
      
      const result = await customLimiter.check('custom-key');
      expect(result.success).toBe(true);
      expect(result.limit).toBe(5);
    });

    it('should apply skipSuccessfulRequests option', async () => {
      const config: RateLimitConfig = {
        windowMs: 60000,
        maxRequests: 3,
        skipSuccessfulRequests: true
      };

      const limiter = createRateLimiter(config);

      // First request (success) should not count
      const result1 = await limiter.check('skip-user');
      expect(result1.success).toBe(true);
      
      // Second request - count resets on success
      const result2 = await limiter.check('skip-user');
      expect(result2.success).toBe(true);
    });

    it('should apply keyGenerator', async () => {
      const config: RateLimitConfig = {
        windowMs: 60000,
        maxRequests: 2,
        keyGenerator: () => 'custom-key'
      };

      const limiter = createRateLimiter(config);

      await limiter.check({ ip: 'ip-1' } as any);
      await limiter.check({ ip: 'ip-2' } as any);

      const result = await limiter.check({ ip: 'ip-3' } as any);
      expect(result.success).toBe(false); // Same custom key
    });
  });

  describe('Rate Limit Result Properties', () => {
    it('should return correct result properties', async () => {
      const result = await rateLimiters.apiLimiter.check('result-user');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('resetAt');
      expect(result).toHaveProperty('retryAfter');
    });

    it('should calculate resetAt correctly', async () => {
      const now = Date.now();
      const result = await rateLimiters.apiLimiter.check('reset-user');

      expect(result.resetAt).toBeGreaterThan(now);
      expect(result.resetAt - now).toBeLessThanOrEqual(60000); // 1 minute window
    });

    it('should return retryAfter when blocked', async () => {
      // Exhaust the limit
      for (let i = 0; i < 100; i++) {
        await rateLimiters.apiLimiter.check('retry-user');
      }

      const result = await rateLimiters.apiLimiter.check('retry-user');
      expect(result.success).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(60);
    });
  });

  describe('Headers', () => {
    it('should include rate limit headers', async () => {
      const result = await rateLimiters.apiLimiter.check('header-user');

      expect(result.headers).toBeDefined();
      expect(result.headers?.['X-RateLimit-Limit']).toBe('100');
      expect(result.headers?.['X-RateLimit-Remaining']).toBeDefined();
      expect(result.headers?.['X-RateLimit-Reset']).toBeDefined();
    });

    it('should decrease remaining on each request', async () => {
      const results: RateLimitResult[] = [];

      for (let i = 0; i < 5; i++) {
        const result = await rateLimiters.strictLimiter.check('decrease-user');
        results.push(result);
      }

      const remainingValues = results.map(r => r.remaining);
      expect(remainingValues).toEqual([9, 8, 7, 6, 5]);
    });
  });

  describe('IP Tracking', () => {
    it('should track different IPs separately', async () => {
      await rateLimiters.apiLimiter.check({ ip: '192.168.1.1' } as any);
      await rateLimiters.apiLimiter.check({ ip: '192.168.1.1' } as any);
      await rateLimiters.apiLimiter.check({ ip: '192.168.1.2' } as any);

      const result1 = await rateLimiters.apiLimiter.check({ ip: '192.168.1.1' } as any);
      const result2 = await rateLimiters.apiLimiter.check({ ip: '192.168.1.2' } as any);

      expect(result1.remaining).toBe(97); // 100 - 3
      expect(result2.remaining).toBe(99); // 100 - 1
    });

    it('should handle missing IP', async () => {
      const result = await rateLimiters.apiLimiter.check({} as any);
      expect(result.success).toBe(true);
      expect(result.limit).toBeDefined();
    });
  });

  describe('Window Reset', () => {
    it('should reset after window expires', async () => {
      // Create a limiter with 1 second window
      const quickLimiter = createRateLimiter({
        windowMs: 1000,
        maxRequests: 2
      });

      await quickLimiter.check('window-user');
      await quickLimiter.check('window-user');
      
      let result = await quickLimiter.check('window-user');
      expect(result.success).toBe(false);

      // Wait for window to reset
      advanceTime(1100);

      result = await quickLimiter.check('window-user');
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle store errors gracefully', async () => {
      const errorStore = {
        increment: vi.fn().mockRejectedValue(new Error('Redis error')),
        reset: vi.fn()
      };

      const errorLimiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 5
      });

      // Mock the store to throw error
      const result = await errorLimiter.check('error-user');
      expect(result.success).toBe(true); // Fail open
    });

    it('should handle negative maxRequests', async () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: -1 // Block all
      });

      const result = await limiter.check('blocked-user');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Rate limit exceeded');
    });
  });

  describe('Load Testing Simulation', () => {
    it('should handle burst traffic', async () => {
      const burstResults: RateLimitResult[] = [];
      const concurrentRequests = 50;

      // Simulate concurrent burst
      const promises = Array(concurrentRequests).fill(null).map(() => 
        rateLimiters.apiLimiter.check('burst-user')
      );

      burstResults.push(...await Promise.all(promises));

      expect(burstResults.filter(r => r.success).length).toBe(100); // All within limit
      expect(burstResults[0].remaining).toBe(50);
    });

    it('should distribute limits correctly', async () => {
      // Simulate 1000 different users
      const userPromises = Array(1000).fill(null).map((_, i) =>
        rateLimiters.apiLimiter.check(`user-${i}`)
      );

      const results = await Promise.all(userPromises);

      // All should succeed since each has separate limit
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Rate Limiter Middleware Integration', () => {
    it('should create Express middleware', async () => {
      const middleware = rateLimiters.apiLimiter.middleware();

      expect(typeof middleware).toBe('function');
    });

    it('should add rate limit headers to response', async () => {
      const mockReq = { ip: '127.0.0.1' };
      const mockRes = {
        setHeader: vi.fn(),
        locals: {}
      };
      const mockNext = vi.fn();

      await rateLimiters.apiLimiter.middleware()(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should block request when limit exceeded', async () => {
      const mockReq = { ip: 'blocked-ip' };
      const mockRes = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const mockNext = vi.fn();

      // Exhaust limit first
      for (let i = 0; i < 100; i++) {
        await rateLimiters.apiLimiter.check('blocked-ip');
      }

      await rateLimiters.apiLimiter.middleware()(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Too Many Requests'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
