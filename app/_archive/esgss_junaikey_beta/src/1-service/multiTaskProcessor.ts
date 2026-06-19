/**
 * 🔄 Multi-Task Processor
 * --------------------------------------------------
 * [核心] 多工處理系統
 * [功能] 同時處理多個任務，互不干擾
 */

import { omniLogger, LogCategory } from './omniLogger';

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
  private maxConcurrent: number = 5; // 最多同時執行 5 個任務
  private runningCount: number = 0;

  /**
   * 創建新任務
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

    // 嘗試立即執行
    this.tryExecute(task.id, executor);

    return task.id;
  }

  /**
   * 嘗試執行任務
   */
  private async tryExecute(taskId: string, executor: () => Promise<any>): Promise<void> {
    // 檢查是否達到並發上限
    if (this.runningCount >= this.maxConcurrent) {
      // 等待有空位
      setTimeout(() => this.tryExecute(taskId, executor), 500);
      return;
    }

    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return;

    this.runningCount++;
    task.status = 'running';
    task.started_at = Date.now();

    try {
      // 執行任務
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

      // 嘗試執行下一個待處理任務
      this.executeNextPending();
    }
  }

  /**
   * 執行下一個待處理任務
   */
  private executeNextPending(): void {
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'pending') {
        // 這裡需要重新獲取 executor，實際使用時需要儲存
        break;
      }
    }
  }

  /**
   * 獲取任務狀態
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * 獲取所有任務
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * 獲取運行中的任務
   */
  getRunningTasks(): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.status === 'running');
  }

  /**
   * 取消任務
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
   * 清理已完成的任務
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
