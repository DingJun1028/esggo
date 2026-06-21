// lib/omni-hub/memory.ts
// 萬能中心 — 共享記憶層

import type { SharedMemoryEntry, MemoryEntryType, MemoryVisibility } from './types';

export class SharedMemory {
  private memories: SharedMemoryEntry[] = [];
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    // 從 localStorage 恢復（client-side）或 Supabase（server-side）
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('omni_hub_memories');
        if (stored) {
          this.memories = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('[SharedMemory] 初始化失敗，使用空記憶', e);
    }
    this.initialized = true;
  }

  async write(
    entry: Partial<SharedMemoryEntry> &
      Pick<
        SharedMemoryEntry,
        'agentId' | 'agentName' | 'type' | 'title' | 'content' | 'summary' | 'tags' | 'visibility'
      >
  ): Promise<SharedMemoryEntry> {
    await this.init();
    const now = new Date().toISOString();
    const newEntry: SharedMemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referencedBy: [],
      version: 1,
      hashLock: null,
      createdAt: now,
      updatedAt: now,
      expiresAt: null,
      metadata: {},
      ...entry,
    };
    this.memories.push(newEntry);
    this.persist();
    return newEntry;
  }

  async update(
    id: string,
    updates: Partial<SharedMemoryEntry>
  ): Promise<SharedMemoryEntry | undefined> {
    await this.init();
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    this.memories[idx] = {
      ...this.memories[idx],
      ...updates,
      version: this.memories[idx].version + 1,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.memories[idx];
  }

  getById(id: string): SharedMemoryEntry | undefined {
    return this.memories.find((m) => m.id === id);
  }

  getAll(): SharedMemoryEntry[] {
    return [...this.memories].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  query(filter?: {
    agentId?: string;
    type?: string;
    visibility?: string;
    tag?: string;
  }): SharedMemoryEntry[] {
    let results = this.getAll();
    if (filter?.agentId) results = results.filter((m) => m.agentId === filter.agentId);
    if (filter?.type) results = results.filter((m) => m.type === filter.type);
    if (filter?.visibility) results = results.filter((m) => m.visibility === filter.visibility);
    if (filter?.tag) results = results.filter((m) => m.tags.includes(filter.tag as string));
    return results;
  }

  search(query: string, limit = 10): SharedMemoryEntry[] {
    const lower = query.toLowerCase();
    return this.memories
      .filter(
        (m) =>
          m.title.toLowerCase().includes(lower) ||
          m.content.toLowerCase().includes(lower) ||
          m.summary.toLowerCase().includes(lower) ||
          m.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit);
  }

  getStats(): {
    total: number;
    byType: Record<string, number>;
    byVisibility: Record<string, number>;
  } {
    const byType: Record<string, number> = {};
    const byVisibility: Record<string, number> = {};
    for (const m of this.memories) {
      byType[m.type] = (byType[m.type] || 0) + 1;
      byVisibility[m.visibility] = (byVisibility[m.visibility] || 0) + 1;
    }
    return { total: this.memories.length, byType, byVisibility };
  }

  clear(): void {
    this.memories = [];
    this.persist();
  }

  private persist(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('omni_hub_memories', JSON.stringify(this.memories));
      }
    } catch (e) {
      // storage full or unavailable
    }
  }
}
