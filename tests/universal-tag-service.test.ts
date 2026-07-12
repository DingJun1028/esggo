// ============================================================
// Universal Tag Service — unit tests
// tests/universal-tag-service.test.ts
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    eSGTag: { findMany: vi.fn() },
    universalTag: { findUnique: vi.fn(), create: vi.fn(), upsert: vi.fn().mockResolvedValue({ id: 'u1' }) },
    tagPair: { create: vi.fn(), upsert: vi.fn(), findMany: vi.fn() },
  },
}));

import { autoPair, syncEsgTags } from '@/core/tags/universal-tag-service';
import { prisma } from '@/lib/prisma';

describe('universal-tag-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('LOCAL_GEMMA_MODEL', 'test-model');
  });

  it('autoPair strips Gemma4 thinking channel and parses tag JSON', async () => {
    vi.stubEnv('LOCAL_GEMMA_SERVER_URL', 'http://localhost:11434');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          response:
            '<|channel>thought\nThinking about ESG...\n<channel|>\n[{"label":"碳排放","pillar":"environmental","confidence":0.9}]',
        }),
      })),
    );
    const res = await autoPair({ entityType: 'regulation', entityId: 'r1', content: 'carbon emissions' });
    expect(res.paired).toBe(true);
    expect(res.labels).toContain('碳排放');
    expect((prisma.tagPair.upsert as unknown as vi.Mock).mock.calls.length).toBe(1);
    // confirm the upserted anchor tag carried the parsed label
    const upsertCall = (prisma.universalTag.upsert as unknown as vi.Mock).mock.calls[0][0];
    expect(upsertCall.where.label_kind.label).toBe('碳排放');
  });

  it('autoPair returns unpaired when LOCAL_GEMMA_SERVER_URL is unset', async () => {
    vi.stubEnv('LOCAL_GEMMA_SERVER_URL', '');
    const res = await autoPair({ entityType: 'regulation', entityId: 'r1', content: 'x' });
    expect(res.paired).toBe(false);
    expect(res.reason).toMatch(/not set/);
  });

  it('autoPair degrades gracefully on malformed model output', async () => {
    vi.stubEnv('LOCAL_GEMMA_SERVER_URL', 'http://localhost:11434');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ response: 'no json here' }) })),
    );
    const res = await autoPair({ entityType: 'regulation', entityId: 'r1', content: 'x' });
    expect(res.paired).toBe(false);
    expect(res.reason).toMatch(/no JSON array/);
  });

  it('syncEsgTags creates UniversalTag rows for each ESGTag', async () => {
    (prisma.eSGTag.findMany as unknown as vi.Mock).mockResolvedValue([
      { id: 'e1', name: '碳排', pillar: 'Environmental', category: '碳', description: 'd' },
    ]);
    (prisma.universalTag.findUnique as unknown as vi.Mock).mockResolvedValue(null);
    const n = await syncEsgTags();
    expect(n).toBe(1);
    expect((prisma.universalTag.create as unknown as vi.Mock).mock.calls.length).toBe(1);
  });
});
