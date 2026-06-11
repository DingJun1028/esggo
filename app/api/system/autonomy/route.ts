import { NextResponse } from 'next/server';
import { OmniAgentBus } from '@/lib/agents/omni-agent-bus';
import { synthesizeSkillUltimate, MemoryShard } from '@/lib/agent/memory-shards';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration missing.');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

export async function POST(req: Request) {
  try {
    const { action, intervalMs } = await req.json();
    const bus = OmniAgentBus.getInstance();

    if (action === 'start') {
      const ms = intervalMs || 60000;
      bus.startAutonomy(ms);
      return NextResponse.json({ status: 'success', message: `Autonomy started with interval ${ms}ms` });
    } else if (action === 'stop') {
      bus.stopAutonomy();
      return NextResponse.json({ status: 'success', message: 'Autonomy stopped' });
    } else if (action === 'entropy_reduction') {
      // 熵減煉金工作流 (Entropy Alchemy Workflow)
      // 1. 抓取近期累積的 Memory Shards
      const { data: shards, error } = await getSupabaseAdmin()
        .from('omni_memory_shards')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error || !shards || shards.length === 0) {
        return NextResponse.json({ status: 'skipped', message: 'No shards available for entropy reduction.' });
      }

      // 將 DB 的 snake_case 轉回 camelCase 介面
      const mappedShards: MemoryShard[] = shards.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        tags: s.tags,
        extractedCodeSnippets: s.extracted_code_snippets,
        timestamp: s.timestamp
      }));

      // 2. 觸發技能奧義合成
      const ultimate = await synthesizeSkillUltimate(mappedShards);
      
      return NextResponse.json({ 
        status: 'success', 
        message: 'Entropy reduction complete. Synthesis generated.',
        data: ultimate
      });
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid action. Use "start", "stop", or "entropy_reduction".' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
