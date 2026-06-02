export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { extractMemoryShard, synthesizeSkillUltimate, MemoryShard, SkillUltimate } from '@/lib/agent/memory-shards';
import { v4 as uuidv4 } from 'uuid';

// Supabase 直接連線配置 (零依賴 REST 連線)
const SUPABASE_URL = process.env.EXT_PUBLIC_SUPABASE_URL || 'https://yhwfmavnhaivvgzeuklx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 模擬內存狀態（Fallback 沙盒）
const mockShards: MemoryShard[] = [];
const mockUltimates: SkillUltimate[] = [];

/**
 * 內部函數：透過 REST 寫入 Supabase (或降級至內存沙盒)
 */
async function persistToSupabase(table: string, data: any, mockFallbackArray: any[]) {
  if (SUPABASE_SERVICE_KEY && SUPABASE_URL && !SUPABASE_URL.includes('your-project-id')) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Supabase ${table} API 錯誤，自動降級至內存。錯誤內容:`, errText);
        throw new Error('Supabase request failed');
      }
      return await response.json();
    } catch (e) {
      console.warn(`無法連接至 Supabase ${table}，自動寫入本地內存陣列。`);
    }
  } else {
    console.warn(`未配置 SUPABASE_SERVICE_ROLE_KEY，自動寫入本地內存陣列。`);
  }

  // 降級處理：存入 Mock 陣列
  mockFallbackArray.push(data);
  return [data];
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, conversationLog, shards } = body;

    // 1. 動作：擷取單個記憶碎片
    if (action === 'extract_shard') {
      if (!conversationLog) {
        return NextResponse.json({ success: false, error: '缺少 conversationLog' }, { status: 400 });
      }

      const shard = await extractMemoryShard(conversationLog);
      // 確保 ID 與時間戳
      if (!shard.id) shard.id = uuidv4();
      if (!shard.timestamp) shard.timestamp = Date.now();

      // 轉換成 snake_case 寫入 Supabase
      const dbPayload = {
        id: shard.id,
        title: shard.title,
        description: shard.description,
        tags: shard.tags || [],
        extracted_code_snippets: shard.extractedCodeSnippets || [],
        timestamp: shard.timestamp
      };

      await persistToSupabase('omni_memory_shards', dbPayload, mockShards);

      return NextResponse.json({ success: true, shard, persisted: true });
    }

    // 2. 動作：結合碎片領悟技能奧義
    if (action === 'synthesize_ultimate') {
      if (!shards || !Array.isArray(shards) || shards.length < 2) {
        return NextResponse.json({ success: false, error: '至少需要 2 個記憶碎片來領悟奧義' }, { status: 400 });
      }

      const ultimate = await synthesizeSkillUltimate(shards as MemoryShard[]);
      const ultimateId = uuidv4();
      const ultimateTimestamp = Date.now();

      // 轉換成 snake_case 寫入 Supabase
      const dbPayload = {
        id: ultimateId,
        skill_name: ultimate.skillName,
        mastery_level: ultimate.masteryLevel,
        core_principles: ultimate.corePrinciples || [],
        synthesis: ultimate.synthesis,
        source_shards: ultimate.sourceShards || [],
        timestamp: ultimateTimestamp
      };

      await persistToSupabase('omni_skill_ultimates', dbPayload, mockUltimates);

      return NextResponse.json({ success: true, ultimate, persisted: true });
    }

    // 3. 動作：獲取所有的內存碎片 (用以展示或測試 fallback)
    if (action === 'get_shards_fallback') {
      return NextResponse.json({ success: true, shards: mockShards, ultimates: mockUltimates });
    }

    return NextResponse.json({ success: false, error: '未知的 action 參數' }, { status: 400 });
  } catch (error: any) {
    console.error('【無有技藝】API 處理失敗:', error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'shards';

  if (SUPABASE_SERVICE_KEY && SUPABASE_URL && !SUPABASE_URL.includes('your-project-id')) {
    try {
      const table = type === 'ultimates' ? 'omni_skill_ultimates' : 'omni_memory_shards';
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=timestamp.desc`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ success: true, [type]: data });
      }
    } catch (e) {
      console.warn(`Supabase GET ${type} failed, falling back to mock arrays`);
    }
  }
  return NextResponse.json({ success: true, [type]: type === 'ultimates' ? mockUltimates : mockShards });
}
