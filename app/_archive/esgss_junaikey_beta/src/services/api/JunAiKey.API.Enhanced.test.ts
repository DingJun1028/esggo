/**
 * JunAiKey.API.Enhanced.test.ts
 * JunAiKey API (Enhanced) Test Suite
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';

import { JunAiKeyAPIEnhanced } from './JunAiKey.API.Enhanced';
import { OmniErrorCode } from '../../types/errorCodes';
import { metricsCollector } from './metrics';

// Mock external dependencies
vi.mock('axios');
vi.mock('jsdom');
vi.mock('turndown');
vi.mock('marked');
vi.mock('isomorphic-dompurify');
vi.mock('xml2js');

// Helper for debugging test failures
const debugFailure = (result: any) => {
  if (result.status === 'failure') {
    omniLogger.error(LogCategory.SYSTEM, '[JunAiKey.API.Enhanced.test] Test Failure Details:', JSON.stringify(result.error, null, 2));
  }
};

// Mock Logger
const mockLogger = {
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  logRequestStart: vi.fn(),
  logRequestEnd: vi.fn(),
};

vi.mock('./logger', () => ({
  createLogger: () => mockLogger,
}));

describe('JunAiKeyAPIEnhanced', () => {
  let api: JunAiKeyAPIEnhanced;
  const validApiKey = process.env.JUNAIKEY_API_KEY || 'your_secret_api_key';

  beforeEach(() => {
    metricsCollector.reset();
    api = new JunAiKeyAPIEnhanced();
    vi.clearAllMocks();
  });

  describe('Request Validation', () => {
    it('should reject invalid fetch options', async () => {
      const result = await api.handleRequest('fetch', { url: 'invalid-url' }, validApiKey);

      expect(result.status).toBe('failure');
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe(OmniErrorCode.VALIDATION_ERROR);
    });

    it('should reject invalid sequential thinking options', async () => {
      const result = await api.handleRequest(
        'sequential-thinking',
        { problem: 'Too short', steps: [] },
        validApiKey
      );

      try {
        expect(result.status).toBe('failure');
        expect(result.error?.code).toBe(OmniErrorCode.VALIDATION_ERROR);
      } catch (e) {
        debugFailure(result);
        throw e;
      }
    });
  });

  describe('Error Handling', () => {
    it('should return correct error structure for unauthorized request', async () => {
      const result = await api.handleRequest('fetch', { url: 'https://example.com' }, 'wrong_key');

      try {
        expect(result.status).toBe('failure');
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe(OmniErrorCode.AUTH_REQUIRED);
      } catch (e) {
        debugFailure(result);
        throw e;
      }
    });

    it('should handle rate limiting gracefully', async () => {
      // Simulate rate limit error
      // Test single trigger here, assuming limit is 100
      const promises = Array.from({ length: 110 }, () =>
        api.handleRequest('health', {}, validApiKey)
      );

      const results = await Promise.all(promises);
      const failures = results.filter(r => r.status === 'failure');

      const rateLimitError = failures.find(r => r.error?.code === OmniErrorCode.RATE_LIMIT_EXCEEDED);
      if (!rateLimitError) {
        // If not triggered, print failed samples
        if (failures.length > 0) debugFailure(failures[0]);
        console.log(`Total failures: ${failures.length}`);
      }

      // At least one rate limit error
      expect(rateLimitError).toBeDefined();
    });

    it('should reject unknown endpoints', async () => {
      const result = await api.handleRequest('unknown' as any, {}, validApiKey);

      expect(result.status).toBe('failure');
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe(OmniErrorCode.VALIDATION_ERROR);
    });
  });

  describe('Performance Monitoring', () => {
    it('should collect metrics for successful requests', async () => {
      await api.handleRequest('health', {}, validApiKey);
      const metrics = api.getMetrics();
      const healthMetrics = metrics.byEndpoint['health'];

      expect(healthMetrics).toBeDefined();
      expect(healthMetrics.requestCount).toBeGreaterThan(0);
    });

    it('should collect metrics for failed requests', async () => {
      await api.handleRequest('fetch', { url: 'invalid' }, validApiKey);
      const metrics = api.getMetrics();
      const fetchMetrics = metrics.byEndpoint['fetch'];

      expect(fetchMetrics).toBeDefined();
      expect(fetchMetrics.failureCount).toBeGreaterThan(0);
    });
  });
});
