import { z } from 'genkit';
import { writeMemory, readMemoryByType } from '../memory';

export interface MemoryRecord {
   id: string;
   agentName: string;
   task: string;
   context: unknown;
   result: string;
   success: boolean;
   timestamp: string;
   tags: string[];
   embedding?: number[];
 }

export class MemoryStore {
  private static instance: MemoryStore;
  private memories: MemoryRecord[] = [];
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  async init() {
    if (this.initialized) return;
    try {
      const records = await readMemoryByType('agent_memory');
      this.memories = (records || []).map(r => r.memory_value as unknown as MemoryRecord);
      this.initialized = true;
    } catch (e) {
      console.warn('MemoryStore init failed, fallback to empty', e);
    }
  }

  async add(record: Omit<MemoryRecord, 'id' | 'timestamp'>) {
    const newRecord: MemoryRecord = {
      ...record,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.memories.push(newRecord);
     try {
       await writeMemory('agent_memory', newRecord.id, newRecord as any);
     } catch (e) {
      console.warn('Failed to persist agent memory', e);
    }
    return newRecord;
  }

  async getByAgent(agentName: string): Promise<MemoryRecord[]> {
    await this.init();
    return this.memories.filter(m => m.agentName === agentName)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  async search(query: string, limit = 10): Promise<MemoryRecord[]> {
    await this.init();
    const lowerQuery = query.toLowerCase();
    return this.memories.filter(m => 
      m.task?.toLowerCase().includes(lowerQuery) ||
      m.result?.toLowerCase().includes(lowerQuery) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(lowerQuery)))
    ).slice(0, limit);
  }

  async getSimilar(task: string, agentName?: string, limit = 5): Promise<MemoryRecord[]> {
    await this.init();
    const agentMemories = agentName
      ? this.memories.filter(m => m.agentName === agentName)
      : this.memories;

    return agentMemories
      .map(m => ({ ...m, similarity: this.calculateSimilarity(task, m.task) }))
      .sort((a, b) => (b as any).similarity - (a as any).similarity)
      .slice(0, limit)
      .map(({ similarity, ...rest }) => rest);
  }

  private calculateSimilarity(a: string, b: string): number {
    const wordsA = new Set((a || '').toLowerCase().split(/\s+/));
    const wordsB = new Set((b || '').toLowerCase().split(/\s+/));
    let intersection = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) intersection++;
    }
    return intersection / Math.max(wordsA.size, wordsB.size || 1);
  }

  clear(): void {
    this.memories = [];
    this.initialized = false;
  }

  async getAll(): Promise<MemoryRecord[]> {
    await this.init();
    return [...this.memories];
  }
}

export const memoryStore = MemoryStore.getInstance();
