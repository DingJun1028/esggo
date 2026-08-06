// 共享記憶層型別 — 供 Next.js 與 Gateway 共同使用
// packages/shared/src/memory/types.ts

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  tags?: string[];
  source?: 'web' | 'gateway' | 'cron' | 'agent';
  ttlSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryQuery {
  key?: string;
  prefix?: string;
  tags?: string[];
  source?: string;
  limit?: number;
  offset?: number;
}

export interface MemoryStats {
  totalEntries: number;
  totalKeys: number;
  redisConnected: boolean;
  provider: 'redis' | 'memory';
  uptimeSeconds: number;
}

export interface MemoryStore {
  get(key: string): Promise<MemoryEntry | null>;
  set(key: string, value: string, opts?: { tags?: string[]; source?: string; ttlSeconds?: number }): Promise<MemoryEntry>;
  delete(key: string): Promise<boolean>;
  query(q: MemoryQuery): Promise<MemoryEntry[]>;
  stats(): Promise<MemoryStats>;
}
