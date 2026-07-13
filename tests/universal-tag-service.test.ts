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

import { autoPair, syncEsgTags, stripGemma4Thinking, extractJsonValue } from '@/core/tags/universal-tag-service';
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
    const res = await syncEsgTags();
    expect(res.synced).toBe(1);
    expect(res.labels).toContain('碳排');
    expect((prisma.universalTag.create as unknown as vi.Mock).mock.calls.length).toBe(1);
  });

  // ── Gemma 4 輸出解析強化 ──────────────────────────────────
  it('stripGemma4Thinking removes thinking channel and keeps JSON', () => {
    const out = stripGemma4Thinking('<|channel>thought\nthink...\n<channel|>\n[{"label":"X"}]');
    expect(out).toContain('[{"label":"X"}]');
    expect(out).not.toMatch(/channel/i);
  });

  it('stripGemma4Thinking strips markdown code fences', () => {
    expect(stripGemma4Thinking('```json\n[{"label":"X"}]\n```')).toBe('[{"label":"X"}]');
  });

  it('extractJsonValue pulls array out of prose-wrapped output', () => {
    const v = extractJsonValue('Here are the tags: [{"label":"X","pillar":"environmental"}] hope that helps');
    expect(Array.isArray(v)).toBe(true);
    expect((v as Array<{ label: string }>)[0].label).toBe('X');
  });

  it('extractJsonValue handles object-wrapped { labels: [...] }', () => {
    const v = extractJsonValue('```json\n{"labels":[{"label":"Y"}]}\n```');
    expect(v).toMatchObject({ labels: [{ label: 'Y' }] });
  });

  it('extractJsonValue returns null on non-JSON', () => {
    expect(extractJsonValue('no json here')).toBeNull();
  });

  it('autoPair parses fenced JSON from local Gemma 4', async () => {
    vi.stubEnv('LOCAL_GEMMA_SERVER_URL', 'http://localhost:11434');
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ response: '```json\n[{"label":"GHG","pillar":"environmental","confidence":0.8}]\n```' }),
    })));
    const res = await autoPair({ entityType: 'regulation', entityId: 'r2', content: 'ghg' });
    expect(res.paired).toBe(true);
    expect(res.labels).toContain('GHG');
  });

  it('autoPair parses object-wrapped labels from local Gemma 4', async () => {
    vi.stubEnv('LOCAL_GEMMA_SERVER_URL', 'http://localhost:11434');
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ response: 'Some prose then {"labels":[{"label":"SDG","pillar":"social"}]}' }),
    })));
    const res = await autoPair({ entityType: 'regulation', entityId: 'r3', content: 'sdg' });
    expect(res.paired).toBe(true);
    expect(res.labels).toContain('SDG');
  });
});
