/**
 * e2e.test.ts - Smart AI Router 端對端測試
 * 負責測試 /healthz 與 /ai/route 端點
 */

import { expect } from 'vitest';

describe('Smart AI Router E2E', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${BASE_URL}/healthz`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('smart-ai-router');
    });

    it('should return detailed health info when detail=true', async () => {
      const response = await fetch(`${BASE_URL}/healthz?detail=true`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.checks).toBeDefined();
      expect(data.checks.router).toBe('healthy');
      expect(data.checks.eventStore).toBe('healthy');
    });
  });

  describe('AI Router', () => {
    it('should route general task successfully', async () => {
      const response = await fetch(`${BASE_URL}/ai/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'general',
          message: 'Hello, Smart AI Router!'
        })
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.traceId).toBeDefined();
      expect(data.result).toBeDefined();
    });

    it('should handle carbon_calculation task', async () => {
      const response = await fetch(`${BASE_URL}/ai/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'carbon_calculation',
          message: 'Calculate CO2 emissions for 1000 km car travel'
        })
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.result).toContain('碳');
    });

    it('should trigger fallback when model unavailable', async () => {
      // 模擬無效模型請求
      const response = await fetch(`${BASE_URL}/ai/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'general',
          message: 'Test fallback mechanism',
          model: 'non-existent-model'
        })
      });
      
      // 應使用 fallback 模型
      expect(response.status).toBe(200);
    });
  });

  describe('Time Travel Debug', () => {
    it('should replay events by traceId', async () => {
      const traceId = `test_trace_${Date.now()}`;
      
      const response = await fetch(`${BASE_URL}/debug/time-travel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traceId, speed: 1 })
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.sessionId).toBeDefined();
    });
  });
});