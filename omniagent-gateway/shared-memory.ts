/**
 * OmniAgent Shared Memory Service
 * 共享記憶層 — NCBDB 雙向同步 (TypeScript)
 * 
 * 同步架構：
 * ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 * │  Local JSON  │ ←→  │  NCBDB API  │ ←→  │  Supabase   │
 * │  (VPS)       │     │  (Remote)   │     │  (Backup)   │
 * └─────────────┘     └─────────────┘     └─────────────┘
 *        ↑
 *        │ WebSocket Broadcast
 *        ↓
 * ┌─────────────┐
 * │  Next.js    │
 * │  (Vercel)   │
 * └─────────────┘
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MemoryType = 'knowledge' | 'task' | 'event' | 'context' | 'result' | 'shared' | 'ncb_sync';
export type SourceOrigin = 'local' | 'ncb' | 'supabase' | 'vercel';
export type MemoryPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface MemoryEntry {
  id: string;
  agent: string;
  type: MemoryType;
  content: unknown;
  tags: string[];
  timestamp: number;
  hash: string;
  ttl?: number;
  priority: MemoryPriority;
  source: SourceOrigin;
  ncbSynced: boolean;
  ncbRecordId?: string;
  supabaseSynced: boolean;
  version: number;
}

export interface MemoryQuery {
  agent?: string;
  type?: MemoryType;
  tags?: string[];
  since?: number;
  until?: number;
  limit?: number;
  search?: string;
  source?: SourceOrigin;
  unsyncedOnly?: boolean;
}

export interface MemoryStats {
  total: number;
  agents: string;
  sizeKB: string;
  ncbSynced: number;
  supabaseSynced: number;
  unsynced: number;
}

export interface SyncResult {
  pushed: number;
  pulled: number;
  errors: string[];
  timestamp: number;
}

// ─── NCBDB Client ────────────────────────────────────────────────────────────

interface NCBConfig {
  baseUrl: string;
  token: string;
  projectId: string;
  tableName: string;
}

class NCBMemoryClient {
  private config: NCBConfig;

  constructor(config: Partial<NCBConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || process.env.NCBDB_BASE_URL || 'https://www.nocodebackend.com/',
      token: config.token || process.env.NCBDB_API_TOKEN || '',
      projectId: config.projectId || process.env.NCBDB_PROJECT_ID || '',
      tableName: config.tableName || 'agent_memory',
    };
  }

  private async request(path: string, method: string, body?: unknown): Promise<{ success: boolean; data?: unknown; error?: string }> {
    if (!this.config.token) {
      return { success: false, error: 'NCBDB API Token not configured' };
    }

    const url = `${this.config.baseUrl}/api/v1/db/data/noco/${this.config.projectId}/${this.config.tableName}${path}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'xc-token': this.config.token,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const err = await res.text();
        return { success: false, error: `NCBDB ${res.status}: ${err}` };
      }

      const data = await res.json();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  async push(entry: MemoryEntry): Promise<{ success: boolean; recordId?: string; error?: string }> {
    const result = await this.request('', 'POST', {
      agent_name: entry.agent,
      memory_type: entry.type,
      content: JSON.stringify(entry.content),
      tags: entry.tags.join(','),
      hash_lock: entry.hash,
      source: entry.source,
      priority: entry.priority,
      version: entry.version,
      created_at: new Date(entry.timestamp).toISOString(),
    });

    if (result.success) {
      const record = result.data as any;
      return { success: true, recordId: record?.id || record?.Id };
    }
    return { success: false, error: result.error };
  }

  async pull(since?: number): Promise<{ success: boolean; entries: Partial<MemoryEntry>[]; error?: string }> {
    let path = '';
    if (since) {
      path = `?where=(created_at,gt,${new Date(since).toISOString()})`;
    }

    const result = await this.request(path, 'GET');

    if (result.success) {
      const list = (result.data as any)?.list || (result.data as any)?.data || result.data || [];
      const entries = (Array.isArray(list) ? list : []).map((r: any) => ({
        id: 'ncb_' + (r.id || r.Id),
        agent: r.agent_name || 'unknown',
        type: r.memory_type || 'shared',
        content: (() => { try { return JSON.parse(r.content); } catch { return r.content; } })(),
        tags: (r.tags || '').split(',').filter(Boolean),
        timestamp: new Date(r.created_at || Date.now()).getTime(),
        hash: r.hash_lock || '',
        source: 'ncb' as SourceOrigin,
        ncbSynced: true,
        ncbRecordId: r.id || r.Id,
        version: r.version || 1,
      }));
      return { success: true, entries };
    }
    return { success: false, entries: [], error: result.error };
  }

  async update(recordId: string, data: Partial<MemoryEntry>): Promise<{ success: boolean; error?: string }> {
    const result = await this.request(`/${recordId}`, 'PATCH', {
      content: JSON.stringify(data.content),
      hash_lock: data.hash,
      version: data.version,
    });
    return { success: result.success, error: result.error };
  }

  async delete(recordId: string): Promise<{ success: boolean; error?: string }> {
    const result = await this.request(`/${recordId}`, 'DELETE');
    return { success: result.success, error: result.error };
  }
}

// ─── Shared Memory Store ─────────────────────────────────────────────────────

const MEMORY_DIR = process.env.MEMORY_DIR || '/var/www/esggo/shared-memory';
const MEMORY_FILE = join(MEMORY_DIR, 'agent-memory.json');
const SNAPSHOT_FILE = join(MEMORY_DIR, 'agent-memory-snapshot.json');

class SharedMemoryStore {
  private cache: Map<string, MemoryEntry> = new Map();
  private dirty = false;
  private saveInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private ncbClient: NCBMemoryClient;
  private lastSync = 0;
  private syncInProgress = false;

  constructor() {
    this.ncbClient = new NCBMemoryClient();

    if (!existsSync(MEMORY_DIR)) {
      mkdirSync(MEMORY_DIR, { recursive: true });
    }

    this.loadFromDisk();

    // Auto-save every 30s
    this.saveInterval = setInterval(() => this.saveToDisk(), 30000);

    // Auto-sync to NCBDB every 60s
    this.syncInterval = setInterval(() => this.syncToNCB(), 60000);
  }

  // ── Core Operations ──

  store(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'hash' | 'source' | 'ncbSynced' | 'supabaseSynced' | 'version'>): string {
    const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const timestamp = Date.now();
    const hash = createHash('sha256').update(JSON.stringify(entry.content)).digest('hex');

    const fullEntry: MemoryEntry = {
      ...entry,
      id,
      timestamp,
      hash,
      source: 'local',
      ncbSynced: false,
      supabaseSynced: false,
      version: 1,
    };

    this.cache.set(id, fullEntry);
    this.dirty = true;

    console.log(`[SharedMemory] Stored: ${id} [${entry.type}] by ${entry.agent}`);
    return id;
  }

  get(id: string): MemoryEntry | null {
    const entry = this.cache.get(id);
    if (!entry) return null;

    // Check TTL
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(id);
      return null;
    }

    return entry;
  }

  query(query: MemoryQuery): MemoryEntry[] {
    let entries = Array.from(this.cache.values());

    if (query.agent) entries = entries.filter(e => e.agent === query.agent);
    if (query.type) entries = entries.filter(e => e.type === query.type);
    if (query.source) entries = entries.filter(e => e.source === query.source);
    if (query.unsyncedOnly) entries = entries.filter(e => !e.ncbSynced);

    if (query.tags && query.tags.length > 0) {
      entries = entries.filter(e => query.tags!.some(tag => e.tags.includes(tag)));
    }

    if (query.since) entries = entries.filter(e => e.timestamp >= query.since!);
    if (query.until) entries = entries.filter(e => e.timestamp <= query.until!);

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      entries = entries.filter(e => {
        const contentStr = JSON.stringify(e.content).toLowerCase();
        return contentStr.includes(searchLower) ||
          e.tags.some(t => t.toLowerCase().includes(searchLower));
      });
    }

    entries.sort((a, b) => b.timestamp - a.timestamp);
    if (query.limit) entries = entries.slice(0, query.limit);

    return entries;
  }

  delete(id: string): boolean {
    const result = this.cache.delete(id);
    if (result) this.dirty = true;
    return result;
  }

  getStats(): MemoryStats {
    const entries = Array.from(this.cache.values());
    const agents = [...new Set(entries.map(e => e.agent))];
    const ncbSynced = entries.filter(e => e.ncbSynced).length;
    const supabaseSynced = entries.filter(e => e.supabaseSynced).length;

    return {
      total: entries.length,
      agents: agents.join(', '),
      sizeKB: (JSON.stringify(entries).length / 1024).toFixed(1),
      ncbSynced,
      supabaseSynced,
      unsynced: entries.length - ncbSynced,
    };
  }

  // ── NCBDB Bidirectional Sync ──

  async syncToNCB(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return { pushed: 0, pulled: 0, errors: ['Sync already in progress'], timestamp: Date.now() };
    }

    this.syncInProgress = true;
    const result: SyncResult = { pushed: 0, pulled: 0, errors: [], timestamp: Date.now() };

    try {
      // 1. Push local changes to NCBDB
      const unsynced = Array.from(this.cache.values()).filter(e => !e.ncbSynced);
      for (const entry of unsynced) {
        try {
          const pushResult = await this.ncbClient.push(entry);
          if (pushResult.success) {
            entry.ncbSynced = true;
            entry.ncbRecordId = pushResult.recordId;
            result.pushed++;
          } else {
            result.errors.push(`Push failed for ${entry.id}: ${pushResult.error}`);
          }
        } catch (e) {
          result.errors.push(`Push error for ${entry.id}: ${e}`);
        }
      }

      // 2. Pull remote changes from NCBDB
      try {
        const pullResult = await this.ncbClient.pull(this.lastSync);
        if (pullResult.success) {
          for (const remote of pullResult.entries) {
            const remoteId = remote.id!;
            if (!this.cache.has(remoteId)) {
              this.cache.set(remoteId, remote as MemoryEntry);
              result.pulled++;
            }
          }
          if (result.pulled > 0) this.dirty = true;
        } else {
          result.errors.push(`Pull failed: ${pullResult.error}`);
        }
      } catch (e) {
        result.errors.push(`Pull error: ${e}`);
      }

      this.lastSync = Date.now();
      console.log(`[SharedMemory] NCBDB sync complete. Pushed: ${result.pushed}, Pulled: ${result.pulled}`);
    } catch (err) {
      result.errors.push(`Sync error: ${err}`);
    } finally {
      this.syncInProgress = false;
    }

    return result;
  }

  // ── Persistence ──

  private loadFromDisk(): void {
    try {
      if (existsSync(MEMORY_FILE)) {
        const data = JSON.parse(readFileSync(MEMORY_FILE, 'utf-8'));
        if (Array.isArray(data)) {
          for (const entry of data) {
            this.cache.set(entry.id, entry);
          }
          console.log(`[SharedMemory] Loaded ${this.cache.size} entries from disk`);
        }
      }
    } catch (err) {
      console.error('[SharedMemory] Load error:', err);
    }
  }

  saveToDisk(): void {
    if (!this.dirty) return;
    try {
      const entries = Array.from(this.cache.values());
      writeFileSync(MEMORY_FILE, JSON.stringify(entries, null, 2));
      this.dirty = false;
    } catch (err) {
      console.error('[SharedMemory] Save error:', err);
    }
  }

  async snapshot(): Promise<void> {
    try {
      const entries = Array.from(this.cache.values());
      writeFileSync(SNAPSHOT_FILE, JSON.stringify(entries, null, 2));
      console.log(`[SharedMemory] Snapshot saved (${entries.length} entries)`);
    } catch (err) {
      console.error('[SharedMemory] Snapshot error:', err);
    }
  }

  destroy(): void {
    if (this.saveInterval) clearInterval(this.saveInterval);
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.saveToDisk();
  }
}

// ─── Singleton ──────────────────────────────────────────────────────────────

export const sharedMemory = new SharedMemoryStore();
export { NCBMemoryClient };
