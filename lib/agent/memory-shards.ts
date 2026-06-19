// @ts-nocheck
/**
 * OmniMemory Shards v2.0 — 記憶碎片完整體系
 *
 * 功能：
 * 1. 記憶碎片萃取（對話、錯誤日誌、程式碼審查、網頁爬取）
 * 2. 技能奧義合成（多碎片融合）
 * 3. 碎片關聯管理（多對多關係）
 * 4. 碎片使用追蹤
 * 5. Firecrawl 網頁爬取整合
 * 6. 自動萃取排程
 */

import { z } from 'zod';
import { generateObject } from 'ai';
import { agnes } from '@/lib/ai/agnes';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase Client ──────────────────────────────────────────────────────
let supabaseAdmin: ReturnType<typeof createClient> | null = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch (e) {
    console.warn('Supabase initialization failed in memory-shards.ts', e);
  }
}

// ─── Schemas ──────────────────────────────────────────────────────────────
export const MemoryShardSchema = z.object({
  title: z.string().describe('碎片標題'),
  description: z.string().describe('詳細描述'),
  tags: z.array(z.string()).describe('關鍵技能標籤'),
  extractedCodeSnippets: z.array(z.string()).optional().describe('程式碼片段'),
  entropyLevel: z.number().min(0).max(100).optional().describe('熵值 (0=無有, 100=混亂)'),
  importanceScore: z.number().min(0).max(1).optional().describe('重要性評分'),
});

export type MemoryShardData = z.infer<typeof MemoryShardSchema>;

export interface MemoryShard extends MemoryShardData {
  id: string;
  timestamp: number;
  sourceType: 'conversation' | 'error_log' | 'code_review' | 'web_crawl' | 'manual' | 'auto_extract';
  sourceId?: string;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

export const SkillUltimateSchema = z.object({
  skillName: z.string().describe('技能奧義名稱'),
  masteryLevel: z.enum(['Novice', 'Adept', 'Expert', 'Master']),
  corePrinciples: z.array(z.string()).describe('核心原則'),
  synthesis: z.string().describe('深度總結與奧義心法'),
  voidDimension: z.enum(['Structural Void', 'Logical Void', 'Stateful Void', 'Unified']).optional().describe('無有維度'),
});

export type SkillUltimateData = z.infer<typeof SkillUltimateSchema>;

export interface SkillUltimate extends SkillUltimateData {
  id: string;
  sourceShards: string[];
  applicationCount: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

export interface ShardRelation {
  id: string;
  sourceShardId: string;
  targetShardId: string;
  relationType: 'related' | 'depends_on' | 'conflicts_with' | 'extends' | 'replaces';
  strength: number;
  createdAt: string;
}

export interface ShardStats {
  sourceType: string;
  totalShards: number;
  avgEntropy: number;
  avgImportance: number;
  totalUsage: number;
  latestShard: string;
}

// ─── 核心函數 ──────────────────────────────────────────────────────────────

/**
 * 從對話紀錄萃取記憶碎片
 */
export async function extractMemoryShard(
  conversationLog: string,
  sourceType: MemoryShard['sourceType'] = 'conversation',
  sourceId?: string
): Promise<MemoryShard> {
  const prompt = `
請分析以下對話紀錄，總結出發生的事件與解決的問題，並將其轉化為一個「記憶碎片 (Memory Shard)」。

【無有技藝 (Void-Presence Art) 萃取法則】：
1. 尋找源頭 (Source Origin Tracing)：在紀錄中尋找問題發生的根本原因。
2. 熵減評估 (Entropy Evaluation)：評估本次行動是否減少了系統的冗餘代碼或技術債，並給予 entropyLevel 評分 (0-100)。
3. 重要性評分 (Importance Scoring)：評估此記憶碎片對未來任務的重要性 (0-1)。

對話紀錄：
${conversationLog}
`;

  try {
    const response = await generateObject({
      model: agnes('agnes-2.0-flash'),
      system: "你是一個專業的【無有技藝】記憶萃取系統。你的目標是從雜亂的對話與執行紀錄中，提煉出具有高度技術價值的記憶碎片。",
      prompt,
      schema: MemoryShardSchema
    });

    const shardData = response.object;
    if (!shardData) throw new Error('無法萃取記憶碎片：模型輸出為空');

    const shard: MemoryShard = {
      ...(shardData as any),
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sourceType,
      sourceId,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
    };

    await storeMemoryShard(shard);
    return shard;
  } catch (error) {
    console.error('[OmniCore] 萃取記憶碎片失敗:', error);
    throw error;
  }
}

/**
 * 從錯誤日誌萃取記憶碎片
 */
export async function extractShardFromErrorLog(errorLog: string, context?: string): Promise<MemoryShard> {
  const conversationLog = `錯誤日誌：\n${errorLog}\n\n上下文：${context || '無'}`;
  return extractMemoryShard(conversationLog, 'error_log');
}

/**
 * 從程式碼審查萃取記憶碎片
 */
export async function extractShardFromCodeReview(codeDiff: string, reviewComments: string): Promise<MemoryShard> {
  const conversationLog = `程式碼變更：\n${codeDiff}\n\n審查意見：\n${reviewComments}`;
  return extractMemoryShard(conversationLog, 'code_review');
}

/**
 * 從 Firecrawl 網頁爬取結果萃取記憶碎片
 */
export async function extractShardFromWebCrawl(url: string, crawledContent: string, summary?: string): Promise<MemoryShard> {
  const conversationLog = `網頁來源：${url}\n\n爬取內容摘要：\n${summary || crawledContent.substring(0, 2000)}`;
  const shard = await extractMemoryShard(conversationLog, 'web_crawl', url);
  shard.tags = [...new Set([...shard.tags, 'web-crawl', 'external-source'])];
  return shard;
}

/**
 * 合成技能奧義
 */
export async function synthesizeSkillUltimate(shards: MemoryShard[]): Promise<SkillUltimate> {
  if (!shards || shards.length === 0) {
    throw new Error('需要至少一個記憶碎片來合成奧義');
  }

  const shardsContext = shards.map(s => `
[碎片 ${s.id}] ${s.title}
標籤: ${s.tags.join(', ')}
描述: ${s.description}
  `).join('\n\n');

  const prompt = `
系統已收集到 ${shards.length} 塊記憶碎片。請根據這些碎片的關聯性與累積的技術脈絡，將它們融合成一本【完整的技能奧義 (Skill Ultimate)】。

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
    const response = await generateObject({
      model: agnes('agnes-2.0-flash'),
      system: "你是一個專業的【無有技藝】奧義合成系統。能夠將散落的知識融合為具有系統化與哲理深度的技能奧義，並精準歸類其無有維度。",
      prompt,
      schema: SkillUltimateSchema
    });

    const ultimateData = response.object;
    if (!ultimateData) throw new Error('無法合成技能奧義：模型輸出為空');

    const ultimate: SkillUltimate = {
      ...(ultimateData as any),
      id: crypto.randomUUID(),
      sourceShards: shards.map(s => s.id),
      applicationCount: 0,
      successRate: 0.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
    };

    await storeSkillUltimate(ultimate);

    // 記錄碎片使用
    for (const shard of shards) {
      await logShardUsage(shard.id, 'synthesized', `合成奧義: ${ultimate.skillName}`);
    }

    return ultimate;
  } catch (error) {
    console.error('合成技能奧義失敗:', error);
    throw error;
  }
}

/**
 * 儲存記憶碎片
 */
export async function storeMemoryShard(shard: MemoryShard): Promise<void> {
  if (!supabaseAdmin) {
    console.warn('Supabase 未配置，無法存儲碎片');
    return;
  }

  const { error } = await supabaseAdmin.from('omni_memory_shards').insert({
    id: shard.id,
    title: shard.title,
    description: shard.description,
    tags: shard.tags,
    extracted_code_snippets: shard.extractedCodeSnippets || [],
    entropy_level: shard.entropyLevel,
    importance_score: shard.importanceScore || 0.5,
    source_type: shard.sourceType,
    source_id: shard.sourceId,
    timestamp: shard.timestamp,
    metadata: shard.metadata,
  });

  if (error) {
    console.error('存儲記憶碎片失敗:', error);
    throw error;
  }
}

/**
 * 檢索記憶碎片
 */
export async function retrieveMemoryShards(options?: {
  limit?: number;
  offset?: number;
  tags?: string[];
  sourceType?: string;
  minImportance?: number;
  orderBy?: 'timestamp' | 'importance_score' | 'usage_count';
  orderDirection?: 'asc' | 'desc';
}): Promise<{ shards: MemoryShard[]; total: number }> {
  if (!supabaseAdmin) return { shards: [], total: 0 };

  let query = supabaseAdmin.from('omni_memory_shards').select('*', { count: 'exact' });

  if (options?.tags && options.tags.length > 0) {
    query = query.contains('tags', JSON.stringify(options.tags));
  }

  if (options?.sourceType) {
    query = query.eq('source_type', options.sourceType);
  }

  if (options?.minImportance !== undefined) {
    query = query.gte('importance_score', options.minImportance);
  }

  const orderBy = options?.orderBy || 'timestamp';
  const orderDir = options?.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('檢索記憶碎片失敗:', error);
    throw error;
  }

  return {
    shards: (data as any[]).map(record => ({
      id: record.id,
      title: record.title,
      description: record.description,
      tags: record.tags,
      extractedCodeSnippets: record.extracted_code_snippets,
      entropyLevel: record.entropy_level,
      importanceScore: record.importance_score,
      sourceType: record.source_type,
      sourceId: record.source_id,
      usageCount: record.usage_count,
      lastUsedAt: record.last_used_at,
      timestamp: record.timestamp,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      metadata: record.metadata,
    })),
    total: count || 0,
  };
}

/**
 * 儲存技能奧義
 */
export async function storeSkillUltimate(ultimate: SkillUltimate): Promise<void> {
  if (!supabaseAdmin) {
    console.warn('Supabase 未配置，無法存儲奧義');
    return;
  }

  const { error } = await supabaseAdmin.from('omni_skill_ultimates').insert({
    id: ultimate.id,
    skill_name: ultimate.skillName,
    mastery_level: ultimate.masteryLevel,
    core_principles: ultimate.corePrinciples,
    synthesis: ultimate.synthesis,
    source_shards: ultimate.sourceShards,
    void_dimension: ultimate.voidDimension,
    application_count: ultimate.applicationCount,
    success_rate: ultimate.successRate,
    metadata: ultimate.metadata,
  });

  if (error) {
    console.error('存儲技能奧義失敗:', error);
    throw error;
  }
}

/**
 * 檢索技能奧義
 */
export async function retrieveSkillUltimates(options?: {
  limit?: number;
  skillName?: string;
  masteryLevel?: 'Novice' | 'Adept' | 'Expert' | 'Master';
  voidDimension?: string;
}): Promise<SkillUltimate[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin.from('omni_skill_ultimates').select('*');

  if (options?.skillName) {
    query = query.ilike('skill_name', `%${options.skillName}%`);
  }

  if (options?.masteryLevel) {
    query = query.eq('mastery_level', options.masteryLevel);
  }

  if (options?.voidDimension) {
    query = query.eq('void_dimension', options.voidDimension);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('檢索技能奧義失敗:', error);
    throw error;
  }

  return (data as any[]).map(record => ({
    skillName: record.skill_name,
    masteryLevel: record.mastery_level,
    corePrinciples: record.core_principles,
    synthesis: record.synthesis,
    voidDimension: record.void_dimension,
    sourceShards: record.source_shards,
    applicationCount: record.application_count,
    successRate: record.success_rate,
    id: record.id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    metadata: record.metadata,
  }));
}

/**
 * 建立碎片關聯
 */
export async function createShardRelation(
  sourceShardId: string,
  targetShardId: string,
  relationType: ShardRelation['relationType'],
  strength: number = 0.5
): Promise<ShardRelation> {
  if (!supabaseAdmin) throw new Error('Supabase 未配置');

  const { data, error } = await supabaseAdmin.from('omni_shard_relations').insert({
    source_shard_id: sourceShardId,
    target_shard_id: targetShardId,
    relation_type: relationType,
    strength,
  }).select().single();

  if (error) {
    console.error('建立碎片關聯失敗:', error);
    throw error;
  }

  return {
    id: data.id,
    sourceShardId: data.source_shard_id,
    targetShardId: data.target_shard_id,
    relationType: data.relation_type,
    strength: data.strength,
    createdAt: data.created_at,
  };
}

/**
 * 記錄碎片使用
 */
export async function logShardUsage(
  shardId: string,
  action: 'viewed' | 'applied' | 'referenced' | 'synthesized' | 'archived',
  context?: string
): Promise<void> {
  if (!supabaseAdmin) return;

  const { error } = await supabaseAdmin.from('omni_shard_usage_log').insert({
    shard_id: shardId,
    action,
    context,
  });

  if (error) {
    console.warn('記錄碎片使用失敗:', error);
  }
}

/**
 * 取得碎片統計
 */
export async function getShardStats(): Promise<ShardStats[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin.from('v_shard_stats').select('*');

  if (error) {
    console.error('取得碎片統計失敗:', error);
    return [];
  }

  return data as ShardStats[];
}

/**
 * 取得奧義統計
 */
export async function getUltimateStats(): Promise<any[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin.from('v_ultimate_stats').select('*');

  if (error) {
    console.error('取得奧義統計失敗:', error);
    return [];
  }

  return data;
}

/**
 * 搜尋相關碎片
 */
export async function searchRelatedShards(shardId: string): Promise<MemoryShard[]> {
  if (!supabaseAdmin) return [];

  // 取得直接關聯的碎片
  const { data: relations } = await supabaseAdmin
    .from('omni_shard_relations')
    .select('source_shard_id, target_shard_id')
    .or(`source_shard_id.eq.${shardId},target_shard_id.eq.${shardId}`);

  if (!relations || relations.length === 0) return [];

  const relatedIds = new Set<string>();
  for (const rel of relations) {
    if (rel.source_shard_id !== shardId) relatedIds.add(rel.source_shard_id);
    if (rel.target_shard_id !== shardId) relatedIds.add(rel.target_shard_id);
  }

  const { data, error } = await supabaseAdmin
    .from('omni_memory_shards')
    .select('*')
    .in('id', Array.from(relatedIds));

  if (error) {
    console.error('搜尋相關碎片失敗:', error);
    return [];
  }

  return (data as any[]).map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    tags: record.tags,
    extractedCodeSnippets: record.extracted_code_snippets,
    entropyLevel: record.entropy_level,
    importanceScore: record.importance_score,
    sourceType: record.source_type,
    sourceId: record.source_id,
    usageCount: record.usage_count,
    lastUsedAt: record.last_used_at,
    timestamp: record.timestamp,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    metadata: record.metadata,
  }));
}

/**
 * 自動萃取排程（由 OmniAgentBus 呼叫）
 */
export async function autoExtractFromBusEvents(): Promise<MemoryShard[]> {
  // 從 OmniAgentBus 取得最近的事件
  const { omniAgentBus } = await import('../agents/omni-agent-bus');
  const health = omniAgentBus.getHealth();

  const shards: MemoryShard[] = [];

  // 如果錯誤率高，萃取錯誤碎片
  if (health.errorRate > 0.3) {
    const errorLog = `系統錯誤率過高: ${(health.errorRate * 100).toFixed(1)}%，總事件: ${health.totalEvents}`;
    const shard = await extractShardFromErrorLog(errorLog, 'OmniAgentBus 自動萃取');
    shard.tags = [...new Set([...shard.tags, 'auto-extract', 'error-rate'])];
    shards.push(shard);
  }

  return shards;
}
