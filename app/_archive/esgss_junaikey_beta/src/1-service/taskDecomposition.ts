/**
 * 🤖 Task Decomposition & Agent Swarm System
 * --------------------------------------------------
 * [核心] 任務分解與分身協作系統
 * [功能] 拆分任務、並行執行、彙整報告
 */

import { multiTaskProcessor } from './multiTaskProcessor';
import { omniLogger, LogCategory } from './omniLogger';

export interface SubTask {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  estimated_time: number;
  assigned_agent?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

export interface TaskDecomposition {
  main_task: string;
  subtasks: SubTask[];
  execution_plan: ExecutionPlan;
}

export interface ExecutionPlan {
  parallel_groups: SubTask[][];
  total_estimated_time: number;
}

export interface ComprehensiveReport {
  title: string;
  summary: string;
  sections: ReportSection[];
  metadata: {
    created_at: number;
    total_time: number;
    subtasks_completed: number;
  };
}

export interface ReportSection {
  title: string;
  content: string;
  subsections?: ReportSection[];
}

class TaskDecompositionEngine {
  /**
   * 分解任務到最小單位
   */
  async decomposeTask(requirement: string): Promise<TaskDecomposition> {
    omniLogger.info(LogCategory.SYSTEM, 'Decomposing task', { module: 'TaskEngine', requirement });

    // 分析需求
    const analysis = await this.analyzeRequirement(requirement);

    // 拆分成子任務
    const subtasks = await this.breakdownToSubtasks(analysis);

    // 創建執行計畫
    const execution_plan = this.createExecutionPlan(subtasks);

    return {
      main_task: requirement,
      subtasks,
      execution_plan,
    };
  }

  /**
   * 執行並行任務（分身協作）
   */
  async executeWithAgentSwarm(decomposition: TaskDecomposition): Promise<Map<string, any>> {
    const results = new Map<string, any>();

    // 按並行組執行
    for (const group of decomposition.execution_plan.parallel_groups) {
      omniLogger.info(LogCategory.SYSTEM, 'Executing parallel group', {
        module: 'TaskEngine',
        group_size: group.length,
      });

      // 為每個子任務創建「分身」
      const promises = group.map(subtask => this.spawnAgent(subtask));

      // 等待所有分身完成
      const groupResults = await Promise.all(promises);

      // 儲存結果
      groupResults.forEach((result, index) => {
        const task = group[index];
        if (task) {
          results.set(task.id, result);
        }
      });
    }

    return results;
  }

  /**
   * 生成完整報告
   */
  async generateReport(
    decomposition: TaskDecomposition,
    results: Map<string, any>
  ): Promise<ComprehensiveReport> {
    const sections: ReportSection[] = [];

    // 1. 執行摘要
    sections.push({
      title: '執行摘要',
      content: this.generateExecutiveSummary(decomposition, results),
    });

    // 2. 任務分解
    sections.push({
      title: '任務分解',
      content: this.formatTaskBreakdown(decomposition),
    });

    // 3. 執行結果
    sections.push({
      title: '執行結果',
      content: this.formatResults(results),
      subsections: this.generateResultSubsections(results),
    });

    // 4. 結論與建議
    sections.push({
      title: '結論與建議',
      content: this.generateConclusion(results),
    });

    return {
      title: `任務報告：${decomposition.main_task}`,
      summary: this.generateSummary(decomposition, results),
      sections,
      metadata: {
        created_at: Date.now(),
        total_time: this.calculateTotalTime(results),
        subtasks_completed: results.size,
      },
    };
  }

  /**
   * 分析需求
   */
  private async analyzeRequirement(requirement: string): Promise<any> {
    // 識別關鍵詞、動作、目標
    return {
      keywords: this.extractKeywords(requirement),
      actions: this.extractActions(requirement),
      goals: this.extractGoals(requirement),
    };
  }

  /**
   * 拆分成子任務
   */
  private async breakdownToSubtasks(analysis: any): Promise<SubTask[]> {
    const subtasks: SubTask[] = [];

    // 根據分析結果創建子任務
    // 這裡是簡化版本，實際應該使用 AI 來智能拆分
    subtasks.push({
      id: 'subtask-1',
      title: '需求分析',
      description: '分析用戶需求，識別關鍵要素',
      dependencies: [],
      estimated_time: 60,
      status: 'pending',
    });

    subtasks.push({
      id: 'subtask-2',
      title: '方案設計',
      description: '設計實作方案',
      dependencies: ['subtask-1'],
      estimated_time: 120,
      status: 'pending',
    });

    subtasks.push({
      id: 'subtask-3',
      title: '實作開發',
      description: '執行實際開發',
      dependencies: ['subtask-2'],
      estimated_time: 180,
      status: 'pending',
    });

    return subtasks;
  }

  /**
   * 創建執行計畫
   */
  private createExecutionPlan(subtasks: SubTask[]): ExecutionPlan {
    const parallel_groups: SubTask[][] = [];
    const completed = new Set<string>();

    // 按依賴關係分組
    while (completed.size < subtasks.length) {
      const group = subtasks.filter(
        task => !completed.has(task.id) && task.dependencies.every(dep => completed.has(dep))
      );

      if (group.length === 0) break;

      parallel_groups.push(group);
      group.forEach(task => completed.add(task.id));
    }

    const total_estimated_time = parallel_groups.reduce((sum, group) => {
      const maxTime = Math.max(...group.map(t => t.estimated_time));
      return sum + maxTime;
    }, 0);

    return {
      parallel_groups,
      total_estimated_time,
    };
  }

  /**
   * 生成分身執行子任務
   */
  private async spawnAgent(subtask: SubTask): Promise<any> {
    omniLogger.info(LogCategory.SYSTEM, 'Spawning agent', { module: 'TaskEngine', subtask_id: subtask.id });

    // 創建任務
    const taskId = await multiTaskProcessor.createTask(subtask.title, 'agent_task', async () => {
      // 模擬執行
      await new Promise(resolve => setTimeout(resolve, subtask.estimated_time * 10));

      return {
        subtask_id: subtask.id,
        status: 'completed',
        result: `${subtask.title} 已完成`,
      };
    });

    // 等待完成
    return this.waitForTask(taskId);
  }

  /**
   * 等待任務完成
   */
  private async waitForTask(taskId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const check = setInterval(() => {
        const task = multiTaskProcessor.getTask(taskId);
        if (task?.status === 'completed') {
          clearInterval(check);
          resolve(task.result);
        } else if (task?.status === 'failed') {
          clearInterval(check);
          reject(task.error);
        }
      }, 100);
    });
  }

  /**
   * 生成執行摘要
   */
  private generateExecutiveSummary(
    decomposition: TaskDecomposition,
    results: Map<string, any>
  ): string {
    return (
      `本報告針對「${decomposition.main_task}」進行完整分析與實作。\n` +
      `共拆分為 ${decomposition.subtasks.length} 個子任務，` +
      `透過並行執行完成 ${results.size} 項任務。`
    );
  }

  /**
   * 格式化任務分解
   */
  private formatTaskBreakdown(decomposition: TaskDecomposition): string {
    return decomposition.subtasks
      .map((task, index) => `${index + 1}. ${task.title}\n   ${task.description}`)
      .join('\n\n');
  }

  /**
   * 格式化結果
   */
  private formatResults(results: Map<string, any>): string {
    const entries = Array.from(results.entries());
    return entries.map(([id, result]) => `- ${id}: ${JSON.stringify(result)}`).join('\n');
  }

  /**
   * 生成結果子章節
   */
  private generateResultSubsections(results: Map<string, any>): ReportSection[] {
    return Array.from(results.entries()).map(([id, result]) => ({
      title: id,
      content: JSON.stringify(result, null, 2),
    }));
  }

  /**
   * 生成結論
   */
  private generateConclusion(results: Map<string, any>): string {
    return `所有子任務已成功完成。系統透過並行處理大幅提升執行效率。`;
  }

  /**
   * 生成摘要
   */
  private generateSummary(decomposition: TaskDecomposition, results: Map<string, any>): string {
    return `完成 ${results.size}/${decomposition.subtasks.length} 項任務`;
  }

  /**
   * 計算總時間
   */
  private calculateTotalTime(results: Map<string, any>): number {
    return 0; // 實際應該從任務執行時間計算
  }

  private extractKeywords(text: string): string[] {
    return text.split(/\s+/).filter(w => w.length > 2);
  }

  private extractActions(text: string): string[] {
    const actionWords = ['創建', '實作', '開發', '設計', '分析'];
    return actionWords.filter(action => text.includes(action));
  }

  private extractGoals(text: string): string[] {
    return ['完成任務', '生成報告'];
  }
}

export const taskDecompositionEngine = new TaskDecompositionEngine();
