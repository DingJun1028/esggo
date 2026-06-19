import { Memory, Task, TaskResult } from './types';

export class MemorySystem {
  private memories: Memory[] = [];

  async store(task: Task, result: TaskResult, tags: string[] = []): Promise<void> {
    const memory: Memory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      taskId: task.id,
      taskContent: task.content,
      result,
      timestamp: Date.now(),
      tags,
    };
    this.memories.push(memory);
    console.log(`[Memory System] Stored new memory: ${memory.id}`);
  }

  async retrieve(query: string, limit: number = 5): Promise<Memory[]> {
    // Basic keyword matching for now
    const keywords = query.toLowerCase().split(' ');
    const scoredMemories = this.memories.map(mem => {
      let score = 0;
      const content = mem.taskContent.toLowerCase() + ' ' + mem.result.output.toLowerCase();
      keywords.forEach(kw => {
        if (content.includes(kw)) score++;
      });
      return { memory: mem, score };
    });

    return scoredMemories
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(m => m.memory);
  }

  getMemoryCount(): number {
    return this.memories.length;
  }
}
