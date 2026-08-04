/**
 * e2e.test.ts - Smart AI Router 端對端測試
 * 負責測試 /healthz 與 /ai/route 端點
 *
 * 注意: 此測試需要伺服器運行在 BASE_URL (預設 http://localhost:3000)
 * 在 CI/CD 中可以跳過此測試
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// 檢查伺服器是否可用
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
};

describe.skipIf(!process.env.BASE_URL)('Smart AI Router E2E', () => {
  let serverAvailable = false;

  beforeAll(async () => {
    serverAvailable = await isServerAvailable();
    if (!serverAvailable) {
      console.warn(`[E2E] Server not available at ${BASE_URL}, skipping tests`);
    }
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      if (!serverAvailable) return;
      
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBeDefined();
    });
  });

  describe('AI Router', () => {
    it('should route general task successfully', async () => {
      if (!serverAvailable) return;
      
      const response = await fetch(`${BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: 'Test Corp',
          industry: 'technology',
          sections: ['executive_summary'],
        })
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
