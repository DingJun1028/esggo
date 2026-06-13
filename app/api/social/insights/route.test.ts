import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';
import * as db from '@/lib/db';

vi.mock('@/lib/db', () => ({
  getSocialMetrics: vi.fn(),
}));

describe('Social Insights API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    process.env.AGNES_API = 'test-agnes-api-key';
  });

  it('should return insights successfully', async () => {
    vi.mocked(db.getSocialMetrics).mockResolvedValue([
      { id: '1', metric: 'Diversity', value: '80%' }
    ] as any);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: 'Mocked Insight Report'
          }
        }]
      })
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
    process.env.AGNES_API = '';

    const req = new NextRequest('http://localhost:3000/api/social/insights');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Agnes API Key missing');
  });

  it('should return 500 if Agnes API fails', async () => {
    vi.mocked(db.getSocialMetrics).mockResolvedValue([]);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => 'API Error'
    } as any);

    const req = new NextRequest('http://localhost:3000/api/social/insights');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Agnes API failed');
  });
});
