// apps/gateway/sync/schema.ts
// 運行時驗證（zod）— 與 types.ts 的編譯期型別互補。
// 所有跨節點封包都先過 zod 再進入引擎，避免髒資料污染全域同步態。
import { z } from 'zod';
import type { SyncPacket } from './types.js';

export const NodeKindSchema = z.enum(['esggo', 'omni', 'relay', 'unknown']);
export const TransportSchema = z.enum(['ws', 'http', 'relay']);

export const AgentStateSchema = z.object({
  agentId: z.string(),
  name: z.string(),
  host: z.string(),
  channel: z.string(),
  capabilities: z.array(z.string()),
  status: z.enum(['online', 'offline', 'summoned', 'busy']),
  registeredAt: z.number(),
  lastHeartbeat: z.number(),
  layers: z.array(z.string()).optional(),
  summonedAt: z.string().optional(),
  awakeningAuth: z.string().optional(),
  fruitSeal: z.string().optional(),
  system: z.record(z.string(), z.unknown()).optional(),
});

export const ESGGOStateSchema = z.object({
  appVersion: z.string(),
  buildId: z.string().nullable(),
  activeWorkers: z.number(),
  agents: z.array(AgentStateSchema),
  lastSyncAt: z.number(),
});

export const OmniStateSchema = z.object({
  gatewayVersion: z.string(),
  platform: z.string(),
  vpsIp: z.string(),
  activeWorkers: z.number(),
  providers: z.record(z.string(), z.boolean()),
  agents: z.array(AgentStateSchema),
  websocket: z.object({ enabled: z.boolean(), clients: z.number() }),
  skills: z.object({ total: z.number(), transcended: z.number() }),
  lastSyncAt: z.number(),
});

export const SyncPacketSchema = z.object({
  v: z.literal(1),
  from: NodeKindSchema,
  to: z.union([NodeKindSchema, z.literal('*')]),
  kind: z.enum(['state', 'patch', 'heartbeat', 'summon', 'cmd', 'result', 'ack']),
  seq: z.number().int().nonnegative(),
  ts: z.number().int().positive(),
  payload: z.unknown(),
  originId: z.string().min(1),
});

export type SyncPacketParsed = z.infer<typeof SyncPacketSchema>;

/** 安全解析：失敗回 null（不丟棄，避免同步迴圈崩潰） */
export function safeParsePacket(raw: unknown): SyncPacket | null {
  const r = SyncPacketSchema.safeParse(raw);
  return r.success ? (r.data as SyncPacket) : null;
}
