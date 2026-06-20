/**
 * OmniAgent Shared Memory Layer
 * 共享記憶層 — 所有代理（OWL, OmniAgent, ESG_Researcher 等）皆可讀寫
 * 
 * 存儲方式：
 * 1. 本地 JSON 檔案（持久化）
 * 2. Supabase（跨实例同步）
 * 3. 記憶體快取（高速讀取）
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ─── Config ────────────────────────────────────────────────────

const MEMORY_DIR = process.env.MEMORY_DIR || '/var/www/esggo/shared-memory';
const MEMORY_FILE = join(MEMORY_DIR, 'agent-memory.json');
const SNAPSHOT_FILE = join(MEMORY_DIR, 'agent-memory-snapshot.json');

// Ensure directory exists
if (!existsSync(MEMORY_DIR)) {
  mkdirSync(MEMORY_DIR, { recursive: true });
}

// ─── Types ──────────────────────────────────────────────────────

export interface MemoryEntry {
  id: string;
  agent: string;
  type: 'knowledge' | 'task' | 'event' | 'context' | 'result' | 'shared';
  content: unknown;
  tags: string[];
  timestamp: number;
  ttl?: number; // Time-to-live in ms (optional)
  priority: 'low' | 'normal' | 'high' | 'urgent';
  hash?: string; // SHA-256 hash for integrity
}

export interface MemoryQuery {
  agent?: string;
  type?: MemoryEntry['type'];
  tags?: string[];
  since?: number;
  until?: number;
  limit?: number;
  search?: string;
}

export interface MemoryStats {
  totalEntries: number;
  agents: string;
  oldestEntry: number;
  newestEntry: number;
  totalSizeKB: number;
}

// ─── Shared Memory Store ────────────────────────────────────────

class SharedMemoryStore {
  private cache: Map<string, MemoryEntry> = new Map();
  private dirty = false;
  private saveInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFromDisk();
    // Auto-save every 30 seconds
    this.saveInterval = setInterval(() => this.saveToDisk(), 30000);
  }

  // ── Core Operations ──

  /**
   * Store a memory entry
   */
  store(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'hash'>): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = Date.now();
    const contentStr = JSON.stringify(entry.content);
    const hash = createHash('sha256').update(contentStr).digest('hex');

    const fullEntry: MemoryEntry = {
      ...entry,
      id,
      timestamp,
      hash,
    };

    this.cache.set(id, fullEntry);
    this.dirty = true;

    console.log(`[SharedMemory] ✅ Stored: ${id} [${entry.type}] by ${entry.agent}`);
    return id;
  }

  /**
   * Get a memory entry by ID
   */
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

  /**
   * Query memory entries
   */
  query(query: MemoryQuery): MemoryEntry[] {
    let entries = Array.from(this.cache.values());

    // Filter by agent
    if (query.agent) {
      entries = entries.filter(e => e.agent === query.agent);
    }

    // Filter by type
    if (query.type) {
      entries = entries.filter(e => e.type === query.type);
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      entries = entries.filter(e =>
        query.tags!.some(tag => e.tags.includes(tag))
      );
    }

    // Filter by time range
    if (query.since) {
      entries = entries.filter(e => e.timestamp >= query.since!);
    }
    if (query.until) {
      entries = entries.filter(e => e.timestamp <= query.until!);
    }

    // Search in content
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      entries = entries.filter(e => {
        const contentStr = JSON.stringify(e.content).toLowerCase();
        return contentStr.includes(searchLower) ||
          e.tags.some(t => t.toLowerCase().includes(searchLower));
      });
    }

    // Sort by timestamp (newest first)
    entries.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    if (query.limit) {
      entries = entries.slice(0, query.limit);
    }

    return entries;
  }

  /**
   * Delete a memory entry
   */
  delete(id: string): boolean {
    const result = this.cache.delete(id);
    if (result) this.dirty = true;
    return result;
  }

  /**
   * Clear all entries for a specific agent
   */
  clearAgent(agent: string): number {
    let count = 0;
    this.cache.forEach((entry, id) => {
      if (entry.agent === agent) {
        this.cache.delete(id);
        count++;
      }
    });
    if (count > 0) this.dirty = true;
    return count;
  }

  /**
   * Get statistics
   */
  getStats(): MemoryStats {
    const entries = Array.from(this.cache.values());
    const agents = new Set(entries.map(e => e.agent));
    const timestamps = entries.map(e => e.timestamp);

    return {
      totalEntries: entries.length,
      agents: Array.from(agents).join(', '),
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0,
      totalSizeKB: JSON.stringify(entries).length / 1024,
    };
  }

  // ── Import / Export ──

  /**
   * Import entries from another source
   */
  import(entries: MemoryEntry[]): number {
    let count = 0;
    for (const entry of entries) {
      if (!this.cache.has(entry.id)) {
        this.cache.set(entry.id, entry);
        count++;
      }
    }
    if (count > 0) this.dirty = true;
    return count;
  }

  /**
   * Export all entries
   */
  export(): MemoryEntry[] {
    return Array.from(this.cache.values());
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
          console.log(`[SharedMemory] Loaded ${data.length} entries from disk`);
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

  /**
   * Create a snapshot
   */
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
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    this.saveToDisk();
  }
}

// ─── Singleton ──────────────────────────────────────────────────

export const sharedMemory = new SharedMemoryStore();
