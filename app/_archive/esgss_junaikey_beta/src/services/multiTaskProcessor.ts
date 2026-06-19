/**
 * 🔄 Multi-Task Processor
 * --------------------------------------------------
 * [Core] Multi-task Processing System
 * [Function] Process multiple tasks simultaneously without interference
 */

import { omniLogger, LogCategory } from './omniLogger.js';

export interface Task {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: Error;
  created_at: number;
  started_at?: number;
  completed_at?: number;
}

class MultiTaskProcessor {
  private tasks: Map<string, Task> = new Map();
  private maxConcurrent: number = 5; // Max 5 concurrent tasks
  private runningCount: number = 0;

  /**
   * Create new task
   */
  async createTask(name: string, type: string, executor: () => Promise<any>): Promise<string> {
    const task: Task = {
      id: this.generateId(),
      name,
      type,
      status: 'pending',
      progress: 0,
      created_at: Date.now(),
    };

    this.tasks.set(task.id, task);

    omniLogger.info(LogCategory.SYSTEM, 'MultiTask: Task created', {
      task_id: task.id,
      name,
      type,
    });

    // Try to execute immediately
    this.tryExecute(task.id, executor);

    return task.id;
  }

  /**
   * Try to execute task
   */
  private async tryExecute(taskId: string, executor: () => Promise<any>): Promise<void> {
    // Check if concurrency limit reached
    if (this.runningCount >= this.maxConcurrent) {
      // Wait for availability
      setTimeout(() => this.tryExecute(taskId, executor), 500);
      return;
    }

    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return;

    this.runningCount++;
    task.status = 'running';
    task.started_at = Date.now();

    try {
      // Execute task
      const result = await executor();

      task.status = 'completed';
      task.progress = 100;
      task.result = result;
      task.completed_at = Date.now();

      omniLogger.info(LogCategory.SYSTEM, 'MultiTask: Task completed', {
        task_id: taskId,
        duration: task.completed_at - task.started_at!,
      });
    } catch (error) {
      task.status = 'failed';
      task.error = error as Error;
      task.completed_at = Date.now();

      omniLogger.error(LogCategory.SYSTEM, 'MultiTask: Task failed', {
        task_id: taskId,
        error: (error as Error).message,
      });
    } finally {
      this.runningCount--;

      // Try to execute next pending task
      this.executeNextPending();
    }
  }

  /**
   * Execute next pending task
   */
  private executeNextPending(): void {
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'pending') {
        // Need to re-acquire executor here, need to store it in actual use
        break;
      }
    }
  }

  /**
   * Get task status
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get running tasks
   */
  getRunningTasks(): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.status === 'running');
  }

  /**
   * Cancel task
   */
  cancelTask(id: string): boolean {
    const task = this.tasks.get(id);
    if (task && task.status === 'pending') {
      task.status = 'failed';
      task.error = new Error('Task cancelled');
      return true;
    }
    return false;
  }

  /**
   * Cleanup completed tasks
   */
  cleanup(olderThan: number = 3600000): void {
    const now = Date.now();
    for (const [id, task] of this.tasks.entries()) {
      if (
        (task.status === 'completed' || task.status === 'failed') &&
        task.completed_at &&
        now - task.completed_at > olderThan
      ) {
        this.tasks.delete(id);
      }
    }
  }

  private generateId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const multiTaskProcessor = new MultiTaskProcessor();
