/**
 * JunAiKey.API.test.ts
 * JunAiKey API Service Test Suite
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

import { JunAiKeyAPI, MCPService } from './JunAiKey.API.js';
import type { ApiResponse } from './types.js';
import type { OmniResponseStatus } from '../../types/omniCore.js';

// Helper for debugging test failures
const debugFailure = (result: any) => {
  if (result.status === 'failure') {
    omniLogger.error(LogCategory.SYSTEM, '[JunAiKey.API.test] Test Failure Details:', JSON.stringify(result.error, null, 2)');
  }
};

// Mock external dependencies
vi.mock('axios');
vi.mock('jsdom');
vi.mock('turndown');
vi.mock('marked');
vi.mock('isomorphic-dompurify');
vi.mock('xml2js');

describe('JunAiKeyAPI', () => {
  let api: JunAiKeyAPI;
  const validApiKey = process.env.JUNAIKEY_API_KEY || 'your_secret_api_key';

  beforeEach(() => {
    api = new JunAiKeyAPI();
  });

  describe('Authentication & Security', () => {
    it('should reject invalid API key', async () => {
      const result = await api.handleRequest(
        'fetch',
        { url: 'https://example.com' },
        'invalid_key'
      );

      expect(result.status).toBe('failure');
      expect(result.content).toContain('Unauthorized');
    });

    it('should accept valid API key', async () => {
      const result = await api.handleRequest('context7-docs', { library: 'react' }, validApiKey);

      expect(result.status).not.toBe('failure');
      expect(result.content).not.toContain('Unauthorized');
    });

    it('should enforce rate limiting', async () => {
      // Simulate rate limit exceeded
      const promises = Array.from({ length: 105 }, () =>
        api.handleRequest('context7-docs', { library: 'test' }, validApiKey)
      );

      const results = await Promise.all(promises);
      const rateLimitedResults = results.filter(r => r.content.includes('Rate limit exceeded'));

      expect(rateLimitedResults.length).toBeGreaterThan(0);
    });
  });

  describe('API Response Structure', () => {
    it('should return standard ApiResponse structure', async () => {
      const result = await api.handleRequest(
        'context7-docs',
        { library: 'typescript' },
        validApiKey
      );

      // Verify ApiResponse structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('requestId');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('generatedTags');
      expect(result).toHaveProperty('executedComponents');
      expect(result).toHaveProperty('invokedSkills');
      expect(result).toHaveProperty('executionTime');
      expect(result).toHaveProperty('timestamp');
    });

    it('should include execution metadata', async () => {
      const result = await api.handleRequest('context7-docs', { library: 'vue' }, validApiKey);

      expect(result.executedComponents).toContain('MCPService');
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
      expect(result.generatedTags).toBeInstanceOf(Array);
    });
  });

  describe('Endpoint Routing', () => {
    it('should route to fetch endpoint', async () => {
      const result = await api.handleRequest('fetch', { url: 'https://example.com' }, validApiKey);

      expect(result).toBeDefined();
    });

    it('should route to sequential-thinking endpoint', async () => {
      const result = await api.handleRequest(
        'sequential-thinking',
        {
          problem: 'Test problem',
          steps: ['Step 1', 'Step 2'],
        },
        validApiKey
      );

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('step_1');
      expect(result.data).toHaveProperty('step_2');
    });

    it('should route to deploy-page endpoint', async () => {
      const result = await api.handleRequest(
        'deploy-page',
        {
          content: '# Test Content',
          isMarkdown: true,
        },
        validApiKey
      );

      expect(result).toBeDefined();
    });

    it('should route to arxiv-search endpoint', async () => {
      const result = await api.handleRequest(
        'arxiv-search',
        {
          query: 'machine learning',
          maxResults: 5,
        },
        validApiKey
      );

      expect(result).toBeDefined();
    });

    it('should route to context7-docs endpoint', async () => {
      const result = await api.handleRequest(
        'context7-docs',
        {
          library: 'express',
          version: '4.18.0',
        },
        validApiKey
      );

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('library');
      expect(result.data).toHaveProperty('documentation');
      expect(result.data).toHaveProperty('codeExamples');
    });

    it('should handle unknown endpoint', async () => {
      const result = await api.handleRequest('unknown-endpoint' as any, {}, validApiKey);

      expect(result.status).toBe('failure');
      expect(result.content).toContain('Unknown endpoint');
    });
  });
});

describe('MCPService', () => {
  let service: MCPService;

  beforeEach(() => {
    service = new MCPService();
  });

  describe('Context7 Module', () => {
    it('should return documentation for library', async () => {
      const result = await service.getContext7Docs({
        library: 'lodash',
        version: '4.17.21',
      });

      expect(result.status).toBe('success');
      expect(['success', 'failure']).toContain(result.status);
      if (result.status === 'success') {
        expect(result.content).toBeDefined();
      }
      expect(result.data?.library).toBe('lodash');
      expect(result.data?.version).toBe('4.17.21');
      expect(result.data?.codeExamples).toBeInstanceOf(Array);
    });

    it('should use latest version if not specified', async () => {
      const result = await service.getContext7Docs({
        library: 'axios',
      });

      expect(result.data?.version).toBe('latest');
    });
  });

  describe('Sequential Thinking Module', () => {
    it('should process multiple steps', async () => {
      const result = await service.solveProblem({
        problem: 'How to build a REST API?',
        steps: ['Define API endpoints', 'Implement authentication', 'Add data validation'],
      });

      expect(result.status).toBe('success');
      expect(result.data).toHaveProperty('step_1');
      expect(result.data).toHaveProperty('step_2');
      expect(result.data).toHaveProperty('step_3');
    });

    it('should include ARVO analysis', async () => {
      const result = await service.solveProblem({
        problem: 'Test problem',
        steps: ['Step 1'],
      });

      expect(result.arvo_analysis).toBeDefined();
      expect(result.arvo_analysis).toContain('Problem:');
    });
  });

  describe('Deploy Module', () => {
    it('should deploy HTML content', async () => {
      const result = await service.deployContent({
        content: '<h1>Test</h1>',
        isMarkdown: false,
      });

      expect(result.status).toBe('success');
      expect(result.data).toContain('https://');
    });

    it('should convert Markdown to HTML', async () => {
      const result = await service.deployContent({
        content: '# Test Heading\n\nTest content',
        isMarkdown: true,
        title: 'Test Document',
      });

      expect(result.status).toBe('success');
      expect(result.data).toContain('https://');
    });
  });
});
