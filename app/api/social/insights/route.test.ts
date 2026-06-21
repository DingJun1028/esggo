import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

process.env.OPENROUTER_API_KEY = 'test-openrouter-key';

vi.mock('@/lib/db', () => ({
  getSocialMetrics: vi.fn(),
}));

import * as db from '@/lib/db';
import { GET } from './route';

describe('Social Insights API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
  });

  it('should return insights successfully', async () => {
    vi.mocked(db.getSocialMetrics).mockResolvedValue([
      { id: '1', metric: 'Diversity', value: '80%' },
    ] as any);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Mocked Insight Report',
            },
          },
        ],
      }),
    } as any);

    const req = new NextRequest('http://localhost:3000/api/social/insights?category=all');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.insights).toBe('Mocked Insight Report');
    expect(json.metrics_analyzed).toBe(1);
    expect(db.getSocialMetrics).toHaveBeenCalledWith('all');
  });

  it('should return 500 if API key is missing', async () => {
    process.env.OPENROUTER_API_KEY = '';

    const req = new NextRequest('http://localhost:3000/api/social/insights');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('OPENROUTER_API_KEY not configured');
  });

  it('should return 500 if OpenRouter API fails', async () => {
    vi.mocked(db.getSocialMetrics).mockResolvedValue([]);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => 'API Error',
    } as any);

    const req = new NextRequest('http://localhost:3000/api/social/insights');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('OpenRouter API failed: API Error');
  });
});
