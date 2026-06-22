// @ts-nocheck
/**
 * OmniMemory Gateway v2.0
 * 統一記憶碎片 API 閘道
 *
 * 整合：
 * 1. 記憶碎片 CRUD（omni_memory_shards）
 * 2. 技能奧義 CRUD（omni_skill_ultimates）
 * 3. 碎片關聯管理（omni_shard_relations）
 * 4. Firecrawl 爬取整合
 * 5. ESG 情報爬取
 * 6. 記憶碎片萃取（對話、錯誤、程式碼、網頁）
 * 7. 統計與搜尋
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  extractMemoryShard,
  extractShardFromErrorLog,
  extractShardFromCodeReview,
  extractShardFromWebCrawl,
  synthesizeSkillUltimate,
  retrieveMemoryShards,
  retrieveSkillUltimates,
  storeMemoryShard,
  storeSkillUltimate,
  createShardRelation,
  logShardUsage,
  getShardStats,
  getUltimateStats,
  searchRelatedShards,
  autoExtractFromBusEvents,
  type MemoryShard,
  type SkillUltimate,
} from '@/lib/agent/memory-shards';
import { getESGCrawler, ESG_SOURCES } from '@/lib/services/firecrawl-esg-crawler';
import { omniAgentBus } from '@/lib/agents/oa-agent-bus';

// ─── POST /api/omni-memory ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. 萃取記憶碎片
    if (action === 'extract_shard') {
      const { conversationLog, sourceType, sourceId } = body;
      if (!conversationLog) {
        return NextResponse.json(
          { success: false, error: '缺少 conversationLog' },
          { status: 400 }
        );
      }
      const shard = await extractMemoryShard(
        conversationLog,
        sourceType || 'conversation',
        sourceId
      );
      return NextResponse.json({ success: true, shard });
    }

    // 2. 從錯誤日誌萃取
    if (action === 'extract_error') {
      const { errorLog, context } = body;
      if (!errorLog) {
        return NextResponse.json({ success: false, error: '缺少 errorLog' }, { status: 400 });
      }
      const shard = await extractShardFromErrorLog(errorLog, context);
      return NextResponse.json({ success: true, shard });
    }

    // 3. 從程式碼審查萃取
    if (action === 'extract_code_review') {
      const { codeDiff, reviewComments } = body;
      if (!codeDiff) {
        return NextResponse.json({ success: false, error: '缺少 codeDiff' }, { status: 400 });
      }
      const shard = await extractShardFromCodeReview(codeDiff, reviewComments || '');
      return NextResponse.json({ success: true, shard });
    }

    // 4. 從網頁爬取萃取
    if (action === 'extract_web') {
      const { url, content, summary } = body;
      if (!url || !content) {
        return NextResponse.json({ success: false, error: '缺少 url 或 content' }, { status: 400 });
      }
      const shard = await extractShardFromWebCrawl(url, content, summary);
      return NextResponse.json({ success: true, shard });
    }

    // 5. 合成技能奧義
    if (action === 'synthesize_ultimate') {
      const { shards, shardIds } = body;
      let targetShards: MemoryShard[] = shards || [];

      // 如果提供 shardIds，從資料庫取得
      if (shardIds && shardIds.length > 0 && targetShards.length === 0) {
        const { shards: fetched } = await retrieveMemoryShards({ limit: 100 });
        targetShards = fetched.filter((s) => shardIds.includes(s.id));
      }

      if (targetShards.length < 2) {
        return NextResponse.json(
          { success: false, error: '至少需要 2 個記憶碎片' },
          { status: 400 }
        );
      }
      const ultimate = await synthesizeSkillUltimate(targetShards);
      return NextResponse.json({ success: true, ultimate });
    }

    // 6. 手動建立碎片
    if (action === 'create_manual') {
      const { shard } = body;
      if (!shard) {
        return NextResponse.json({ success: false, error: '缺少 shard 資料' }, { status: 400 });
      }
      const newShard: MemoryShard = {
        ...shard,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        sourceType: 'manual',
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: shard.metadata || {},
      };
      await storeMemoryShard(newShard);
      return NextResponse.json({ success: true, shard: newShard });
    }

    // 7. 建立碎片關聯
    if (action === 'create_relation') {
      const { sourceShardId, targetShardId, relationType, strength } = body;
      if (!sourceShardId || !targetShardId) {
        return NextResponse.json({ success: false, error: '缺少 shard ID' }, { status: 400 });
      }
      const relation = await createShardRelation(
        sourceShardId,
        targetShardId,
        relationType || 'related',
        strength || 0.5
      );
      return NextResponse.json({ success: true, relation });
    }

    // 8. 記錄碎片使用
    if (action === 'log_usage') {
      const { shardId, usageAction, context } = body;
      if (!shardId || !usageAction) {
        return NextResponse.json(
          { success: false, error: '缺少 shardId 或 action' },
          { status: 400 }
        );
      }
      await logShardUsage(shardId, usageAction, context);
      return NextResponse.json({ success: true });
    }

    // 9. 搜尋碎片
    if (action === 'search') {
      const result = await retrieveMemoryShards({
        limit: body.limit || 50,
        offset: body.offset || 0,
        tags: body.tags,
        sourceType: body.sourceType,
        minImportance: body.minImportance,
        orderBy: body.orderBy || 'timestamp',
        orderDirection: body.orderDirection || 'desc',
      });
      return NextResponse.json({ success: true, ...result });
    }

    // 10. 取得統計
    if (action === 'get_stats') {
      const shardStats = await getShardStats();
      const ultimateStats = await getUltimateStats();
      return NextResponse.json({ success: true, shardStats, ultimateStats });
    }

    // 11. 取得相關碎片
    if (action === 'get_related') {
      const { shardId } = body;
      if (!shardId) {
        return NextResponse.json({ success: false, error: '缺少 shardId' }, { status: 400 });
      }
      const related = await searchRelatedShards(shardId);
      return NextResponse.json({ success: true, related });
    }

    // 12. Firecrawl 爬取
    if (action === 'crawl') {
      const { sources, topics, url } = body;
      const crawler = getESGCrawler();

      // 單一 URL 爬取
      if (url) {
        const result = await crawler.client.scrape(url, {
          formats: ['markdown'],
          onlyMainContent: true,
        });
        if (result.success) {
          const content = result.data?.markdown || '';
          const shard = await extractShardFromWebCrawl(url, content);
          return NextResponse.json({ success: true, shard, raw: result.data });
        }
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }

      // 指定來源爬取
      if (sources && Array.isArray(sources)) {
        const targetSources = ESG_SOURCES.filter((s) => sources.includes(s.name));
        const { shards, crawlResults } = await crawler.crawlAndExtractShards(targetSources);
        return NextResponse.json({ success: true, shards: shards.length, results: crawlResults });
      }

      // 搜尋主題
      if (topics && Array.isArray(topics)) {
        const { results } = await crawler.searchESGTopics(topics);
        return NextResponse.json({ success: true, results });
      }

      // 預設：爬取所有來源
      const { shards, crawlResults } = await crawler.crawlAndExtractShards();
      return NextResponse.json({ success: true, shards: shards.length, results: crawlResults });
    }

    // 13. 自動萃取（由 OAAgentBus 觸發）
    if (action === 'auto_extract') {
      const shards = await autoExtractFromBusEvents();
      return NextResponse.json({ success: true, shardsExtracted: shards.length, shards });
    }

    // 14. 取得所有碎片（簡易版）
    if (action === 'get_all') {
      const type = body.type || 'shards';
      if (type === 'ultimates') {
        const ultimates = await retrieveSkillUltimates({ limit: body.limit || 100 });
        return NextResponse.json({ success: true, ultimates });
      }
      const result = await retrieveMemoryShards({ limit: body.limit || 100 });
      return NextResponse.json({ success: true, shards: result.shards, total: result.total });
    }

    return NextResponse.json({ success: false, error: '未知的 action' }, { status: 400 });
  } catch (error: any) {
    console.error('[OmniMemory Gateway] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── GET /api/omni-memory ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'shards';

  try {
    if (type === 'ultimates') {
      const ultimates = await retrieveSkillUltimates({
        limit: parseInt(searchParams.get('limit') || '50'),
        masteryLevel: searchParams.get('masteryLevel') as any,
      });
      return NextResponse.json({ success: true, ultimates });
    }

    if (type === 'stats') {
      const shardStats = await getShardStats();
      const ultimateStats = await getUltimateStats();
      return NextResponse.json({ success: true, shardStats, ultimateStats });
    }

    if (type === 'sources') {
      return NextResponse.json({ success: true, sources: ESG_SOURCES });
    }

    if (type === 'health') {
      const health = omniAgentBus.getHealth();
      return NextResponse.json({ success: true, health });
    }

    // Default: shards
    const result = await retrieveMemoryShards({
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      tags: searchParams.get('tags')?.split(','),
      sourceType: searchParams.get('sourceType') || undefined,
      minImportance: searchParams.get('minImportance')
        ? parseFloat(searchParams.get('minImportance')!)
        : undefined,
      orderBy: (searchParams.get('orderBy') as any) || 'timestamp',
      orderDirection: (searchParams.get('orderDirection') as any) || 'desc',
    });

    return NextResponse.json({ success: true, shards: result.shards, total: result.total });
  } catch (error: any) {
    console.error(`[OmniMemory Gateway] GET ${type} failed:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
