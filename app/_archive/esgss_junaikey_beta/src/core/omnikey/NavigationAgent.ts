/**
 * Jun.AI.Key - 自我導航代理群 (Self-Navigating Agent Swarm)
 * 知識的聖殿中，自我導航的智能體永不停歇地冶煉權能、嵌合符文
 *
 * [遵守協議] 4+1 Protocol & 類型安全最佳實踐
 */

import { MemoryPalace, MemoryQuery, MemoryResult } from './MemoryPalace';
import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from '../../services/omniLogger';

/**
 * 步驟參數類型（泛型，支持不同類型的參數）
 */
export type StepParameters = Record<string, unknown>;

/**
 * 步驟執行結果類型
 */
export interface StepResult<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export interface Task {
  id: string;
  userId: string;
  description: string;
  type: 'analysis' | 'automation' | 'learning' | 'execution' | 'creation';
  context?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  constraints?: string[];
  deadline?: Date;
  dependencies?: string[];
}

export interface Plan {
  id: string;
  taskId: string;
  steps: PlanStep[];
  estimatedDuration: number;
  confidence: number;
  createdAt: Date;
}

export interface PlanStep<TParams extends StepParameters = StepParameters, TResult = unknown> {
  id: string;
  description: string;
  agent: string; // 負責的代理名稱
  parameters: TParams;
  estimatedTime: number;
  dependencies: string[]; // 依賴的步驟ID
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: StepResult<TResult>;
}

export interface ExecutionResult<TOutput = unknown> {
  taskId: string;
  planId: string;
  stepsExecuted: PlanStep[];
  finalOutput: TOutput;
  duration: number;
  success: boolean;
  errors: string[];
}

/**
 * 導航代理核心類
 * 負責任務分析、計劃制定和協調執行
 */
export class NavigationAgent {
  constructor(
    private memoryPalace: MemoryPalace,
    private agentRegistry: AgentRegistry
  ) { }

  /**
   * 創建任務
   */
  createTask(description: string, type: Task['type'], userId: string = 'default-user'): Task {
    omniLogger.info(LogCategory.AGENT, 'Creating new task', {
      source_origin: 'NavigationAgent.createTask',
      description,
      type,
      userId,
    });

    return {
      id: uuidv4(),
      userId,
      description,
      type,
      priority: 'medium',
    };
  }

  /**
   * 執行任務
   */
  async executeTask<TOutput = unknown>(task: Task): Promise<ExecutionResult<TOutput>> {
    const startTime = Date.now();

    try {
      omniLogger.info(LogCategory.AGENT, `開始執行任務: ${task.description}`, {
        source_origin: 'NavigationAgent.executeTask',
        taskId: task.id,
        trace_id: `task_${task.id}`,
      });

      // 1. 檢索相關記憶
      const context = await this.memoryPalace.retrieve({
        userId: task.userId,
        query: task.description,
        context: task.context,
        limit: 5,
      });

      // 2. 制定執行計劃
      const plan = await this.createPlan(task, context);
      omniLogger.debug(LogCategory.AGENT, `已制定 ${plan.steps.length} 步執行計劃`, {
        planId: plan.id,
        steps: plan.steps.length,
      });

      // 3. 執行計劃
      const executedSteps = await this.executePlan(plan);

      // 4. 整合結果
      const finalOutput = this.compileFinalResult<TOutput>(executedSteps, task);

      // 5. 存儲執行記錄
      await this.storeExecution(task, plan, executedSteps, finalOutput);

      const duration = Date.now() - startTime;
      const success = executedSteps.every(step => step.status === 'completed');

      omniLogger.info(LogCategory.AGENT, `✅ 任務執行完成，耗時: ${duration}ms`, {
        source_origin: 'NavigationAgent.executeTask',
        taskId: task.id,
        success,
        duration,
      });

      return {
        taskId: task.id,
        planId: plan.id,
        stepsExecuted: executedSteps,
        finalOutput,
        duration,
        success,
        errors: executedSteps
          .filter(s => s.status === 'failed')
          .map(s => s.result?.error || 'Unknown error'),
      };
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, '任務執行失敗', {
        source_origin: 'NavigationAgent.executeTask',
        taskId: task.id,
        error,
      });

      return {
        taskId: task.id,
        planId: '',
        stepsExecuted: [],
        finalOutput: null as TOutput,
        duration: Date.now() - startTime,
        success: false,
        errors: [(error as Error).message || 'Unknown error'],
      };
    }
  }

  /**
   * 制定執行計劃
   */
  private async createPlan(task: Task, context: MemoryResult[]): Promise<Plan> {
    // 從記憶中學習類似任務的執行模式
    const similarTasks = context.filter(
      result => result.node.type === 'outcome' || result.node.type === 'decision'
    );

    // 根據任務類型和記憶制定計劃
    const steps = await this.generateSteps(task, similarTasks);

    return {
      id: uuidv4(),
      taskId: task.id,
      steps,
      estimatedDuration: steps.reduce((sum, step) => sum + step.estimatedTime, 0),
      confidence: this.calculatePlanConfidence(task, steps, similarTasks),
      createdAt: new Date(),
    };
  }

  /**
   * 生成執行步驟
   */
  private async generateSteps(task: Task, similarTasks: MemoryResult[]): Promise<PlanStep[]> {
    const steps: PlanStep[] = [];

    switch (task.type) {
      case 'analysis':
        steps.push(
          this.createStep('data_collection', '收集相關數據和資訊', 5000),
          this.createStep('pattern_analysis', '分析數據模式和趨勢', 8000),
          this.createStep('insight_generation', '生成關鍵洞察', 3000)
        );
        break;

      case 'automation':
        steps.push(
          this.createStep('process_mapping', '映射現有流程', 4000),
          this.createStep('automation_design', '設計自動化方案', 6000),
          this.createStep('implementation', '實施自動化', 10000)
        );
        break;

      case 'learning':
        steps.push(
          this.createStep('knowledge_gathering', '收集學習資源', 3000),
          this.createStep('content_processing', '處理和組織內容', 5000),
          this.createStep('skill_application', '應用新技能', 7000)
        );
        break;

      case 'execution':
        steps.push(
          this.createStep('task_breakdown', '分解任務', 2000),
          this.createStep('resource_allocation', '分配資源', 3000),
          this.createStep('progress_monitoring', '監控進度', 15000)
        );
        break;

      case 'creation':
        steps.push(
          this.createStep('conceptualization', '概念化', 5000),
          this.createStep('prototyping', '原型設計', 8000),
          this.createStep('refinement', '完善和優化', 6000)
        );
        break;
    }

    // 建立步驟依賴關係
    this.buildDependencies(steps);

    return steps;
  }

  /**
   * 建立步驟依賴關係
   */
  private buildDependencies(steps: PlanStep[]): void {
    for (let i = 1; i < steps.length; i++) {
      if (steps[i - 1]) {
        steps[i]!.dependencies.push(steps[i - 1]!.id);
      }
    }
  }

  /**
   * 創建計劃步驟
   */
  private createStep<TParams extends StepParameters = StepParameters>(
    agentName: string,
    description: string,
    estimatedTime: number,
    parameters: TParams = {} as TParams
  ): PlanStep<TParams> {
    return {
      id: uuidv4(),
      description,
      agent: agentName,
      parameters,
      estimatedTime,
      dependencies: [],
      status: 'pending',
    };
  }

  /**
   * 計算計劃信心度
   */
  private calculatePlanConfidence(
    task: Task,
    steps: PlanStep[],
    similarTasks: MemoryResult[]
  ): number {
    let confidence = 0.5; // 基礎信心度

    // 根據類似任務的成功經驗調整
    const successfulTasks = similarTasks.filter(
      result => result.node.content.includes('success') || result.node.content.includes('completed')
    );

    confidence += successfulTasks.length * 0.1;

    // 根據任務複雜度調整
    if (task.constraints && task.constraints.length > 0) {
      confidence -= 0.1;
    }

    if (task.deadline) {
      const daysUntilDeadline = (task.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysUntilDeadline < 1) confidence -= 0.2;
      else if (daysUntilDeadline < 7) confidence -= 0.1;
    }

    return Math.max(0.1, Math.min(0.9, confidence));
  }

  /**
   * 執行計劃
   */
  private async executePlan(plan: Plan): Promise<PlanStep[]> {
    const executedSteps: PlanStep[] = [];

    for (const step of plan.steps) {
      // 檢查依賴
      const dependenciesMet = step.dependencies.every(
        depId => executedSteps.find(s => s.id === depId)?.status === 'completed'
      );

      if (!dependenciesMet) {
        step.status = 'failed';
        step.result = { success: false, error: 'Dependencies not met' };
        executedSteps.push(step);
        continue;
      }

      // 執行步驟
      step.status = 'running';
      try {
        const agent = this.agentRegistry.getAgent(step.agent);
        const result = await agent.execute(step.parameters);
        step.result = { success: true, data: result };
        step.status = 'completed';
      } catch (error) {
        step.status = 'failed';
        step.result = { success: false, error: (error as Error).message };
      }

      executedSteps.push(step);
    }

    return executedSteps;
  }

  /**
   * 整合最終結果
   */
  private compileFinalResult<TOutput = unknown>(steps: PlanStep[], task: Task): TOutput {
    const successfulSteps = steps.filter(s => s.status === 'completed');

    switch (task.type) {
      case 'analysis':
        return {
          insights: successfulSteps.map(s => s.result?.data).filter(Boolean),
          confidence: successfulSteps.length / steps.length,
          methodology: 'multi-step analysis',
        } as TOutput;

      case 'automation':
        return {
          automationScript: successfulSteps.find(s => s.agent === 'implementation')?.result?.data,
          efficiency: successfulSteps.length / steps.length,
          implementation: 'code-generated',
        } as TOutput;

      case 'learning':
        return {
          knowledge: successfulSteps.map(s => s.result?.data).filter(Boolean),
          progress: successfulSteps.length / steps.length,
          nextSteps: ['practice', 'application', 'reflection'],
        } as TOutput;

      default:
        return {
          results: successfulSteps.map(s => s.result?.data).filter(Boolean),
          completion: successfulSteps.length / steps.length,
        } as TOutput;
    }
  }

  /**
   * 存儲執行記錄
   */
  private async storeExecution<TOutput = unknown>(
    task: Task,
    plan: Plan,
    steps: PlanStep[],
    result: TOutput
  ): Promise<void> {
    // 存儲任務執行記錄
    await this.memoryPalace.store({
      type: 'outcome',
      content: `Task "${task.description}" executed with ${steps.filter(s => s.status === 'completed').length}/${steps.length} steps completed`,
      context: `task-execution-${task.id}`,
      tags: ['execution', 'task', task.type],
      vectors: [], // 應生成真實向量
      userId: task.userId,
      connections: [],
      confidence: steps.filter(s => s.status === 'completed').length / steps.length,
    });

    // 存儲計劃學習記錄
    await this.memoryPalace.store({
      type: 'decision',
      content: `Plan for ${task.type} task: ${plan.steps.length} steps, confidence ${plan.confidence}`,
      context: `planning-${task.id}`,
      tags: ['planning', 'strategy', task.type],
      vectors: [],
      userId: task.userId,
      connections: [],
      confidence: plan.confidence,
    });
  }
}

/**
 * 代理註冊表
 */
export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();

  registerAgent(name: string, agent: BaseAgent): void {
    this.agents.set(name, agent);
  }

  getAgent(name: string): BaseAgent {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }
    return agent;
  }

  listAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}

/**
 * 基礎代理接口
 * 使用泛型支持不同類型的參數和返回值
 */
export interface BaseAgent<TParams extends StepParameters = StepParameters, TResult = unknown> {
  execute(parameters: TParams): Promise<TResult>;
}
