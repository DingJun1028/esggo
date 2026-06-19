import { Task, TaskResult, Memory } from './types';
import { MemorySystem } from './memory-system';

export class AutonomousLearning {
  private learningCycles = 0;
  private memorySystem: MemorySystem;

  constructor(memorySystem: MemorySystem) {
    this.memorySystem = memorySystem;
  }

  async analyzeAndEvolve(task: Task, result: TaskResult): Promise<string[]> {
    this.learningCycles++;
    console.log(`[Autonomous Learning] Cycle ${this.learningCycles} initiated.`);
    
    const insights: string[] = [];
    
    if (result.status === 'success') {
      insights.push(`Successfully executed task type: ${task.context?.category || 'unknown'}`);
      if (result.executionTime < 1000) {
        insights.push('Execution was fast, strategy is efficient.');
      }
    } else {
      insights.push(`Failed to execute task. Need to adjust strategy for: ${task.content}`);
    }

    // Store insights back into memory
    await this.memorySystem.store(task, {
      ...result,
      output: `Learning Insights: ${insights.join(', ')}`
    }, ['learning', 'insight']);

    return insights;
  }

  getLearningCycles(): number {
    return this.learningCycles;
  }
}
