import { z } from 'genkit';

export interface MemoryRecord {
  id: string;
  agentName: string;
  task: string;
  context: any;
  result: string;
  success: boolean;
  timestamp: string;
  tags: string[];
  embedding?: number[];
}

export class MemoryStore {
  private static instance: MemoryStore;
  private memories: MemoryRecord[] = [];
  
  private constructor() {}
  
  static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }
  
  add(record: Omit<MemoryRecord, 'id' | 'timestamp'>) {
    const newRecord: MemoryRecord = {
      ...record,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.memories.push(newRecord);
    return newRecord;
  }
  
  getByAgent(agentName: string): MemoryRecord[] {
    return this.memories.filter(m => m.agentName === agentName)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
  
  search(query: string, limit = 10): MemoryRecord[] {
    const lowerQuery = query.toLowerCase();
    return this.memories.filter(m => 
      m.task.toLowerCase().includes(lowerQuery) ||
      m.result.toLowerCase().includes(lowerQuery) ||
      m.tags.some(t => t.toLowerCase().includes(lowerQuery))
    ).slice(0, limit);
  }
  
  getSimilar(task: string, agentName?: string, limit = 5): MemoryRecord[] {
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
    const wordsA = new Set(a.toLowerCase().split(/\s+/));
    const wordsB = new Set(b.toLowerCase().split(/\s+/));
    let intersection = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) intersection++;
    }
    return intersection / Math.max(wordsA.size, wordsB.size);
  }
  
  clear(): void {
    this.memories = [];
  }
  
  getAll(): MemoryRecord[] {
    return [...this.memories];
  }
}

export const memoryStore = MemoryStore.getInstance();