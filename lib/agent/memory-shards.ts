import { z } from 'zod';
import { getOmniAgentAI } from '../omni.config';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../src/server/lib/database.types';

// 初始化 Service Role Client 以寫入資料庫
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 定義記憶碎片 Schema
export const MemoryShardSchema = z.object({
  title: z.string().describe('碎片標題，例如：解決 Prisma N+1 查詢問題'),
  description: z.string().describe('詳細描述此片段中代理人與使用者的事件總結'),
  tags: z.array(z.string()).describe('關鍵技能標籤，例如：[React, Performance, OmniCore]'),
  extractedCodeSnippets: z.array(z.string()).optional().describe('擷取出的有價值程式碼片段'),
  entropyLevel: z.number().min(0).max(100).optional().describe('系統熵值 (0 代表最極致的無有狀態，100 代表高度混亂)'),
});

export type MemoryShardData = z.infer<typeof MemoryShardSchema>;

export interface MemoryShard extends MemoryShardData {
  id: string;
  timestamp: number;
}

// 定義完整的技能奧義 Schema
export const SkillUltimateSchema = z.object({
  skillName: z.string().describe('技能奧義名稱，例如：全端渲染優化奧義'),
  masteryLevel: z.enum(['Novice', 'Adept', 'Expert', 'Master']),
  corePrinciples: z.array(z.string()).describe('從記憶碎片中萃取出的核心原則'),
  synthesis: z.string().describe('結合多個記憶碎片的深度總結與奧義心法'),
  voidDimension: z.enum(['Structural Void', 'Logical Void', 'Stateful Void', 'Unified']).optional().describe('無有技藝歸屬維度'),
});

export type SkillUltimateData = z.infer<typeof SkillUltimateSchema>;

export interface SkillUltimate extends SkillUltimateData {
  id: string;
  sourceShards: string[];
  timestamp: number;
}

/**
 * 核心機制：將原始代理對話紀錄轉化為【記憶碎片】並持久化
 */
export async function extractMemoryShard(conversationLog: string): Promise<MemoryShard> {
  const ai = await getOmniAgentAI();
  
  const prompt = `
請分析以下代理程式與使用者之間的對話紀錄，總結出發生的事件與解決的問題，並將其轉化為一個「記憶碎片 (Memory Shard)」。
記憶碎片代表一次有價值的技術互動或決策過程。

【無有技藝 (Void-Presence Art) 萃取法則】：
1. 尋找源頭 (Source Origin Tracing)：在紀錄中尋找問題發生的根本原因。
2. 熵減評估 (Entropy Evaluation)：評估本次行動是否減少了系統的冗餘代碼或技術債，並給予 entropyLevel 評分 (0-100)。

對話紀錄：
${conversationLog}
`;

  try {
    const response = await (ai as any).generate({
      system: "你是一個專業的【無有技藝】記憶萃取系統。你的目標是從雜亂的對話與執行紀錄中，提煉出具有高度技術價值的記憶碎片。",
      prompt,
      output: { schema: MemoryShardSchema }
    });

    const shardData = response.output();
    if (!shardData) throw new Error('無法萃取記憶碎片：模型輸出為空');

    const shard: MemoryShard = {
      ...shardData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    // 持久化至 Supabase
    const { error: dbError } = await supabaseAdmin
      .from('omni_memory_shards')
      .insert({
        id: shard.id,
        title: shard.title,
        description: shard.description,
        tags: shard.tags,
        extracted_code_snippets: shard.extractedCodeSnippets || [],
        timestamp: shard.timestamp
      });

    if (dbError) {
      console.warn('⚠️ 記憶碎片已生成，但存檔至資料庫失敗:', dbError.message);
    }

    return shard;
  } catch (error) {
    console.error('[OmniCore] 萃取記憶碎片失敗:', error);
    throw error;
  }
}

/**
 * 核心機制：收集足夠的記憶碎片後，自動領悟【完整的技能奧義】並持久化
 */
export async function synthesizeSkillUltimate(shards: MemoryShard[]): Promise<SkillUltimate> {
  if (!shards || shards.length === 0) {
    throw new Error('需要至少一個記憶碎片來合成奧義');
  }

  const ai = await getOmniAgentAI();
  
  const shardsContext = shards.map(s => `
[碎片 ${s.id}] ${s.title}
標籤: ${s.tags.join(', ')}
描述: ${s.description}
  `).join('\n\n');

  const prompt = `
系統已收集到 ${shards.length} 塊記憶碎片。請根據這些碎片的關聯性與累積的技術脈絡，將它們融合成一本【完整的技能奧義 (Skill Ultimate)】。
請賦予這個奧義一個強而有力的名稱，並提煉出其核心原則與心法。

【無有技藝 (Void-Presence Art) 合成法則】：
根據記憶碎片的特性，判定此奧義屬於哪一個無有維度 (voidDimension)：
- Structural Void (結構之無)：消除DOM臃腫，液態成形
- Logical Void (邏輯之無)：算力歸核，依賴5T協議，無為而治
- Stateful Void (狀態之無)：量子糾纏，無狀態即全狀態
- Unified (三元合一)：涵蓋以上所有

記憶碎片集合：
${shardsContext}
`;

  try {
    const response = await (ai as any).generate({
      system: "你是一個專業的【無有技藝】奧義合成系統。能夠將散落的知識融合為具有系統化與哲理深度的技能奧義，並精準歸類其無有維度。",
      prompt,
      output: { schema: SkillUltimateSchema }
    });

    const ultimateData = response.output();
    if (!ultimateData) throw new Error('無法合成技能奧義：模型輸出為空');

    const ultimate: SkillUltimate = {
      ...ultimateData,
      id: crypto.randomUUID(),
      sourceShards: shards.map(s => s.id),
      timestamp: Date.now()
    };

    // 持久化至 Supabase
    const { error: dbError } = await supabaseAdmin
      .from('omni_skill_ultimates')
      .insert({
        id: ultimate.id,
        skill_name: ultimate.skillName,
        mastery_level: ultimate.masteryLevel,
        core_principles: ultimate.corePrinciples,
        synthesis: ultimate.synthesis,
        source_shards: ultimate.sourceShards,
        timestamp: ultimate.timestamp
      });

    if (dbError) {
      console.warn('⚠️ 技能奧義已合成，但存檔至資料庫失敗:', dbError.message);
    }

    return ultimate;
  } catch (error) {
    console.error('合成技能奧義失敗:', error);
    throw error;
  }
}

// 核心機制：將記憶碎片存入資料庫
export async function storeMemoryShard(shard: MemoryShard): Promise<void> {
  const { error } = await supabaseAdmin
    .from('omni_memory_shards')
    .insert({
      id: shard.id,
      title: shard.title,
      description: shard.description,
      tags: shard.tags,
      extracted_code_snippets: shard.extractedCodeSnippets ?? [],
      entropy_level: shard.entropyLevel,
      timestamp: shard.timestamp
    });

  if (error) {
    console.error('存儲記憶碎片失敗:', error);
    throw error;
  }
}

// 核心機制：從資料庫檢索記憶碎片
export async function retrieveMemoryShards(options?: {
  limit?: number;
  tags?: string[];
  startTime?: number;
  endTime?: number;
}): Promise<MemoryShard[]> {
  let query = supabaseAdmin.from('omni_memory_shards').select('*');
  
  if (options?.tags && options.tags.length > 0) {
    // 使用 Postgres 的 JSONB 包含查詢
    query = query.contains('tags', JSON.stringify(options.tags));
  }
  
  if (options?.startTime) {
    query = query.gte('timestamp', options.startTime);
  }
  
  if (options?.endTime) {
    query = query.lte('timestamp', options.endTime);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  query = query.order('timestamp', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('檢索記憶碎片失敗:', error);
    throw error;
  }
  
  // 將資料庫記錄轉換為 MemoryShard 物件
  return data.map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    tags: record.tags,
    extractedCodeSnippets: record.extracted_code_snippets,
    entropyLevel: record.entropy_level,
    timestamp: record.timestamp
  }));
}

// 核心機制：將技能奧義存入資料庫
export async function storeSkillUltimate(ultimate: SkillUltimate): Promise<void> {
  const { error } = await supabaseAdmin
    .from('omni_skill_ultimates')
    .insert({
      skill_name: ultimate.skillName,
      mastery_level: ultimate.masteryLevel,
      core_principles: ultimate.corePrinciples,
      synthesis: ultimate.synthesis,
      void_dimension: ultimate.voidDimension,
      source_shards: ultimate.sourceShards,
      timestamp: Date.now()
    });

  if (error) {
    console.error('存儲技能奧義失敗:', error);
    throw error;
  }
}

// 核心機制：從資料庫檢索技能奧義
export async function retrieveSkillUltimates(options?: {
  limit?: number;
  skillName?: string;
  masteryLevel?: 'Novice' | 'Adept' | 'Expert' | 'Master';
  startTime?: number;
  endTime?: number;
}): Promise<SkillUltimate[]> {
  let query = supabaseAdmin.from('omni_skill_ultimates').select('*');
  
  if (options?.skillName) {
    query = query.ilike('skill_name', `%${options.skillName}%`);
  }
  
  if (options?.masteryLevel) {
    query = query.eq('mastery_level', options.masteryLevel);
  }
  
  if (options?.startTime) {
    query = query.gte('timestamp', options.startTime);
  }
  
  if (options?.endTime) {
    query = query.lte('timestamp', options.endTime);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  query = query.order('timestamp', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('檢索技能奧義失敗:', error);
    throw error;
  }
  
  // 將資料庫記錄轉換為 SkillUltimate 物件
  return data.map(record => ({
    skillName: record.skill_name,
    masteryLevel: record.mastery_level as 'Novice' | 'Adept' | 'Expert' | 'Master',
    corePrinciples: record.core_principles,
    synthesis: record.synthesis,
    voidDimension: record.void_dimension,
    sourceShards: record.source_shards,
    id: record.id,
    timestamp: record.timestamp
  }));
}