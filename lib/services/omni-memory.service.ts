import { createClient } from '@/lib/supabase/client';
import { MemoryShard, MemoryShardSchema, OmniShardUsageActionSchema } from '@/types/omni-memory';
import { z } from 'zod';
import { ncbClient } from '@/lib/ncbdb';

export const OmniMemoryService = {
  /**
   * 獲取所有記憶碎片
   */
  async fetchShards(limit = 50): Promise<MemoryShard[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('omni_memory_shards')
      .select('*')
      .order('importance_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch memory shards:', error);
      throw error;
    }

    // 端到端型別安全 (End-to-End Type Safety): 執行期驗證
    const result = z.array(MemoryShardSchema).safeParse(data);
    if (!result.success) {
      console.error('Data validation failed for memory shards:', result.error);
      // Fallback or throw error. Here we throw to ensure Trust by Design
      throw new Error('Data validation failed: Corrupted memory shards detected.');
    }

    return result.data;
  },

  /**
   * 從 NCBDB 同步記憶碎片 (Pull)
   */
  async syncFromNCB(): Promise<void> {
    console.log('[OmniMemory] Syncing from NCBDB...');
    const response = await ncbClient.listRecords<MemoryShard>('omni_memory_shards');
    if (!response.success || !response.data) {
      console.error('[OmniMemory] Failed to pull from NCBDB:', response.error);
      return;
    }

    const ncbShards = response.data;
    const supabase = createClient();

    // 逐筆寫入或更新到本地 Supabase，並強制標記來源為 ncb
    for (const shard of ncbShards) {
      const formattedShard = {
        ...shard,
        source_origin: 'ncb',
      };
      
      // 使用 upsert 避免重複
      // @ts-ignore
      await (supabase.from('omni_memory_shards') as any).upsert([formattedShard], { onConflict: 'id' });
    }
    console.log(`[OmniMemory] Successfully synced ${ncbShards.length} shards from NCBDB.`);
  },

  /**
   * 寫入新的記憶碎片 (自動推送到 NCBDB)
   */
  async addShard(shard: Partial<MemoryShard>): Promise<MemoryShard> {
    const supabase = createClient();
    
    const payload = {
      title: shard.title,
      description: shard.description || '',
      tags: shard.tags || [],
      extracted_code_snippets: shard.extracted_code_snippets || [],
      entropy_level: shard.entropy_level || 50,
      source_type: shard.source_type || 'manual',
      source_origin: shard.source_origin || 'local',
      importance_score: shard.importance_score || 0.5,
      metadata: shard.metadata || {},
    };

    // @ts-ignore: Supabase DB types missing
    const { data, error } = await (supabase.from('omni_memory_shards') as any)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Failed to add memory shard:', error);
      throw error;
    }

    const parsedData = MemoryShardSchema.parse(data);

    // Push to NCBDB
    try {
      await ncbClient.upsertRecord('omni_memory_shards', parsedData);
    } catch (err) {
      console.warn('[OmniMemory] Failed to push shard to NCBDB:', err);
      // We don't throw here to not block local execution
    }

    return parsedData;
  },

  /**
   * 記錄記憶碎片被使用
   */
  async logShardUsage(shardId: string, action: z.infer<typeof OmniShardUsageActionSchema>, context?: string): Promise<void> {
    const supabase = createClient();
    // @ts-ignore: Supabase DB types missing
    const { error } = await (supabase.from('omni_shard_usage_log') as any)
      .insert([
        {
          shard_id: shardId,
          action,
          context,
        },
      ]);

    if (error) {
      console.error('Failed to log shard usage:', error);
      throw error;
    }
  }
};
