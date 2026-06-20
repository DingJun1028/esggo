/**
 * OmniAgent Shared Memory Layer (Pure JS)
 * 共享記憶層 — 所有代理皆可讀寫
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const MEMORY_DIR = process.env.MEMORY_DIR || '/var/www/esggo/shared-memory';
const MEMORY_FILE = join(MEMORY_DIR, 'agent-memory.json');
const SNAPSHOT_FILE = join(MEMORY_DIR, 'agent-memory-snapshot.json');

if (!existsSync(MEMORY_DIR)) {
  mkdirSync(MEMORY_DIR, { recursive: true });
}

class SharedMemoryStore {
  constructor() {
    this.cache = new Map();
    this.dirty = false;
    this.saveInterval = null;
    this.loadFromDisk();
    this.saveInterval = setInterval(() => this.saveToDisk(), 30000);
  }

  store(entry) {
    const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const timestamp = Date.now();
    const contentStr = JSON.stringify(entry.content);
    const hash = createHash('sha256').update(contentStr).digest('hex');

    const fullEntry = { ...entry, id, timestamp, hash, tags: entry.tags || [] };

    this.cache.set(id, fullEntry);
    this.dirty = true;
    console.log('[SharedMemory] Stored: ' + id + ' [' + entry.type + '] by ' + entry.agent);
    return id;
  }

  get(id) {
    const entry = this.cache.get(id);
    if (!entry) return null;
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(id);
      return null;
    }
    return entry;
  }

  query(query) {
    let entries = Array.from(this.cache.values());

    if (query.agent) entries = entries.filter(e => e.agent === query.agent);
    if (query.type) entries = entries.filter(e => e.type === query.type);

    if (query.tags && query.tags.length > 0) {
      entries = entries.filter(e => query.tags.some(tag => e.tags.includes(tag)));
    }

    if (query.since) entries = entries.filter(e => e.timestamp >= query.since);
    if (query.until) entries = entries.filter(e => e.timestamp <= query.until);

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      entries = entries.filter(e => {
        const contentStr = JSON.stringify(e.content).toLowerCase();
        return contentStr.includes(searchLower) || e.tags.some(t => t.toLowerCase().includes(searchLower));
      });
    }

    entries.sort((a, b) => b.timestamp - a.timestamp);
    if (query.limit) entries = entries.slice(0, query.limit);

    return entries;
  }

  delete(id) {
    const result = this.cache.delete(id);
    if (result) this.dirty = true;
    return result;
  }

  clearAgent(agent) {
    let count = 0;
    this.cache.forEach((entry, id) => {
      if (entry.agent === agent) { this.cache.delete(id); count++; }
    });
    if (count > 0) this.dirty = true;
    return count;
  }

  getStats() {
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

  import(entries) {
    let count = 0;
    for (const entry of entries) {
      if (!this.cache.has(entry.id)) { this.cache.set(entry.id, entry); count++; }
    }
    if (count > 0) this.dirty = true;
    return count;
  }

  export() {
    return Array.from(this.cache.values());
  }

  loadFromDisk() {
    try {
      if (existsSync(MEMORY_FILE)) {
        const data = JSON.parse(readFileSync(MEMORY_FILE, 'utf-8'));
        if (Array.isArray(data)) {
          for (const entry of data) this.cache.set(entry.id, entry);
          console.log('[SharedMemory] Loaded ' + data.length + ' entries from disk');
        }
      }
    } catch (err) {
      console.error('[SharedMemory] Load error:', err);
    }
  }

  saveToDisk() {
    if (!this.dirty) return;
    try {
      const entries = Array.from(this.cache.values());
      writeFileSync(MEMORY_FILE, JSON.stringify(entries, null, 2));
      this.dirty = false;
    } catch (err) {
      console.error('[SharedMemory] Save error:', err);
    }
  }

  async snapshot() {
    try {
      const entries = Array.from(this.cache.values());
      writeFileSync(SNAPSHOT_FILE, JSON.stringify(entries, null, 2));
      console.log('[SharedMemory] Snapshot saved (' + entries.length + ' entries)');
    } catch (err) {
      console.error('[SharedMemory] Snapshot error:', err);
    }
  }

  destroy() {
    if (this.saveInterval) clearInterval(this.saveInterval);
    this.saveToDisk();
  }
}

export const sharedMemory = new SharedMemoryStore();
