export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  extractMemoryShard,
  synthesizeSkillUltimate,
  retrieveMemoryShards,
  retrieveSkillUltimates,
  storeMemoryShard,
  storeSkillUltimate,
  logShardUsage,
  getShardStats,
  getUltimateStats,
  searchRelatedShards,
  MemoryShard,
  SkillUltimate,
} from '@/lib/agent/memory-shards';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/agent/memory-shards
 * Actions: extract_shard | synthesize_ultimate | get_shards_fallback | search | create_manual
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, conversationLog, shards, searchQuery, filters, shard: manualShard } = body;

    // 1. 萃取記憶碎片
    if (action === 'extract_shard') {
      if (!conversationLog) {
        return NextResponse.json({ success: false, error: '缺少 conversationLog' }, { status: 400 });
      }
      const shard = await extractMemoryShard(conversationLog, body.sourceType || 'conversation', body.sourceId);
      return NextResponse.json({ success: true, shard, persisted: true });
    }

    // 2. 合成技能奧義
    if (action === 'synthesize_ultimate') {
      if (!shards || !Array.isArray(shards) || shards.length < 2) {
        return NextResponse.json({ success: false, error: '至少需要 2 個記憶碎片來領悟奧義' }, { status: 400 });
      }
      const ultimate = await synthesizeSkillUltimate(shards as MemoryShard[]);
      return NextResponse.json({ success: true, ultimate, persisted: true });
    }

    // 3. 手動建立碎片
    if (action === 'create_manual') {
      if (!manualShard) {
        return NextResponse.json({ success: false, error: '缺少 shard 資料' }, { status: 400 });
      }
      const shard: MemoryShard = {
        ...manualShard,
        id: uuidv4(),
        timestamp: Date.now(),
        sourceType: 'manual',
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };
      await storeMemoryShard(shard);
      return NextResponse.json({ success: true, shard, persisted: true });
    }

    // 4. 搜尋碎片
    if (action === 'search') {
      const result = await retrieveMemoryShards({
        limit: filters?.limit || 50,
        offset: filters?.offset || 0,
        tags: filters?.tags,
        sourceType: filters?.sourceType,
        minImportance: filters?.minImportance,
        orderBy: filters?.orderBy || 'timestamp',
        orderDirection: filters?.orderDirection || 'desc',
      });
      return NextResponse.json({ success: true, ...result });
    }

    // 5. 取得統計
    if (action === 'get_stats') {
      const shardStats = await getShardStats();
      const ultimateStats = await getUltimateStats();
      return NextResponse.json({ success: true, shardStats, ultimateStats });
    }

    // 6. 取得相關碎片
    if (action === 'get_related') {
      const { shardId } = body;
      if (!shardId) {
        return NextResponse.json({ success: false, error: '缺少 shardId' }, { status: 400 });
      }
      const related = await searchRelatedShards(shardId);
      return NextResponse.json({ success: true, related });
    }

    // 7. 記錄碎片使用
    if (action === 'log_usage') {
      const { shardId, action: usageAction, context } = body;
      if (!shardId || !usageAction) {
        return NextResponse.json({ success: false, error: '缺少 shardId 或 action' }, { status: 400 });
      }
      await logShardUsage(shardId, usageAction, context);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: '未知的 action 參數' }, { status: 400 });
  } catch (error: any) {
    console.error('【記憶碎片】API 處理失敗:', error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

/**
 * GET /api/agent/memory-shards
 * Types: shards | ultimates | stats
 */
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

    // Default: shards
    const result = await retrieveMemoryShards({
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      tags: searchParams.get('tags')?.split(','),
      sourceType: searchParams.get('sourceType') || undefined,
      minImportance: searchParams.get('minImportance') ? parseFloat(searchParams.get('minImportance')!) : undefined,
      orderBy: (searchParams.get('orderBy') as any) || 'timestamp',
      orderDirection: (searchParams.get('orderDirection') as any) || 'desc',
    });

    return NextResponse.json({ success: true, shards: result.shards, total: result.total });
  } catch (error: any) {
    console.error(`【記憶碎片】GET ${type} 失敗:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
