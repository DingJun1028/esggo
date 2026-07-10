import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  getFreeModelPool,
  getFreeTierModels,
  selectFreeModel,
  callFreeProvider,
  type ChatMessage,
  type FreeProviderConfig,
} from '../model-router';

const messages: ChatMessage[] = [{ role: 'user', content: 'ESG 測試訊息' }];

describe('FreeProvider agent layer', () => {
  beforeAll(() => {
    // 僅配置 openrouter key，使公開免費模型成為「已配置」候選（groq 視為未配置）
    process.env.OPENROUTER_API_KEY = 'test-key';
    process.env.GROQ_API_KEY = '';
  });

  afterAll(() => {
    delete process.env.OPENROUTER_API_KEY;
  });

  it('getFreeModelPool / getFreeTierModels 回傳非空且 isFreeTier 標記正確', () => {
    const pool = getFreeModelPool();
    expect(Array.isArray(pool)).toBe(true);
    expect(pool.length).toBeGreaterThan(0);

    const free = getFreeTierModels();
    expect(free.length).toBeGreaterThan(0);
    expect(free.every((m) => m.isFreeTier)).toBe(true);
  });

  it('selectFreeModel 回傳可用的模型 id 字串', () => {
    const id = selectFreeModel('general');
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('callFreeProvider 使用注入發送器並回傳 content + used', async () => {
    const send = vi.fn(async (cfg: FreeProviderConfig) => `MOCK:${cfg.model}`);
    const res = await callFreeProvider('general', messages, { send });

    expect(res.content).toMatch(/^MOCK:/);
    expect(res.used).toBeDefined();
    expect(res.used.provider).toBe('openrouter');
    expect(res.used.isFreeTier).toBe(true);
  });

  it('首個模型失敗時自動轉移下一個（模型級健康降級）', async () => {
    const tried: string[] = [];
    const send = vi.fn(async (cfg: FreeProviderConfig) => {
      tried.push(cfg.model);
      if (tried.length === 1) throw new Error('first model down');
      return `MOCK:${cfg.model}`;
    });

    const res = await callFreeProvider('general', messages, { send });
    expect(tried.length).toBeGreaterThanOrEqual(2);
    expect(res.content).toMatch(/^MOCK:/);
  });

  it('所有模型皆失敗時拋出並帶 lastError', async () => {
    const send = vi.fn(async () => {
      throw new Error('boom');
    });
    await expect(callFreeProvider('general', messages, { send })).rejects.toThrow(
      /所有免費模型皆失敗/,
    );
  });

  it('敏感任務 + excludePublicFree 守門：全部公開免費端點被排除', async () => {
    const send = vi.fn(async (cfg: FreeProviderConfig) => `MOCK:${cfg.model}`);
    await expect(
      callFreeProvider('carbon_calculation', messages, {
        excludePublicFree: true,
        send,
      }),
    ).rejects.toThrow(/無已配置 API Key/);
    expect(send).not.toHaveBeenCalled();
  });
});
