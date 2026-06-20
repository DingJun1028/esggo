import { z } from 'zod';
import { IComponentCore, IEvidenceMap } from './governance';

export const SourceTypeSchema = z.enum([
  'conversation',
  'error_log',
  'code_review',
  'web_crawl',
  'manual',
  'auto_extract',
  'ncb_sync'
]);

export const OmniShardUsageActionSchema = z.enum([
  'viewed',
  'applied',
  'referenced',
  'synthesized',
  'archived'
]);

// 透過 Zod 定義全端共享的記憶碎片 Schema (符合資料庫結構)
export const MemoryShardSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  extracted_code_snippets: z.array(z.string()).default([]),
  entropy_level: z.number().min(0).max(100).default(50),
  source_type: SourceTypeSchema.default('manual'),
  source_origin: z.enum(['local', 'ncb']).default('local'), // [可溯源]
  source_id: z.string().optional().nullable(),
  importance_score: z.number().min(0).max(1).default(0.5),
  usage_count: z.number().default(0),
  last_used_at: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  metadata: z.record(z.any()).default({}),
});

export type MemoryShard = z.infer<typeof MemoryShardSchema>;

export const MemoryUsageLogSchema = z.object({
  id: z.string().uuid(),
  shard_id: z.string().uuid(),
  action: OmniShardUsageActionSchema,
  context: z.string().optional().nullable(),
  created_at: z.string(),
});

export type MemoryUsageLog = z.infer<typeof MemoryUsageLogSchema>;
