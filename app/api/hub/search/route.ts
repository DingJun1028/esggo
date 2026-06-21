// app/api/hub/search/route.ts
// 全文搜尋 + 關聯推薦

import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - omni-hub index exists at lib/omni-hub/index.ts
import { OmniHub } from '@/lib/omni-hub';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || undefined;
  const agentId = searchParams.get('agentId') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const includeRelated = searchParams.get('related') === 'true';

  await OmniHub.init();

  // 基本搜尋
  const rawResults = OmniHub.memory.search(q, 50);
  let results = rawResults;

  // 篩選
  if (type) results = results.filter((r) => r.type === type);
  if (agentId) results = results.filter((r) => r.agentId === agentId);

  // 計算相關度分數
  const scored = results.map((entry) => {
    const lower = q.toLowerCase();
    let score = 0;
    if (entry.title.toLowerCase().includes(lower)) score += 10;
    if (entry.summary.toLowerCase().includes(lower)) score += 5;
    if (entry.content.toLowerCase().includes(lower)) score += 3;
    if (entry.tags.some((t) => t.toLowerCase().includes(lower))) score += 7;
    // 時間衰減：越新權重越高
    const ageDays = (Date.now() - new Date(entry.updatedAt).getTime()) / 86400000;
    const recencyBoost = Math.max(0, 5 - ageDays * 0.1);
    return { entry, score: score + recencyBoost };
  });

  scored.sort((a, b) => b.score - a.score);
  const limited = scored.slice(0, limit);
  const entries = limited.map((s) => s.entry);

  // 關聯推薦
  let related: unknown[] = [];
  if (includeRelated && entries.length > 0) {
    const topEntry = entries[0];
    const allMemories = OmniHub.memory.getAll();
    related = allMemories
      .filter((m) => m.id !== topEntry.id)
      .map((m) => {
        let relScore = 0;
        // 標籤重疊
        const sharedTags = m.tags.filter((t) => topEntry.tags.includes(t));
        relScore += sharedTags.length * 5;
        // 同設施
        if (m.agentId === topEntry.agentId) relScore += 3;
        // 同類型
        if (m.type === topEntry.type) relScore += 2;
        // 被引用
        if (topEntry.referencedBy.includes(m.id) || m.referencedBy.includes(topEntry.id))
          relScore += 10;
        return { entry: m, relScore };
      })
      .filter((r) => (r as { relScore: number }).relScore > 0)
      .sort((a, b) => (b as { relScore: number }).relScore - (a as { relScore: number }).relScore)
      .slice(0, 5)
      .map((r) => (r as { entry: unknown }).entry);
  }

  return NextResponse.json({
    query: q,
    total: scored.length,
    results: entries,
    related,
    meta: { type, agentId, limit, includeRelated },
  });
}
