/**
 * Jun.AI.Key - 萬能元鑰核心循環系統
 * 整合六式奧義模組，實現完整的工作流循環
 */

import { MemoryPalace } from './MemoryPalace';
import { NavigationAgent, Task } from './NavigationAgent';
import { AuthorityForge } from './AuthorityForge';
import { RuneEngrafter } from './RuneEngrafter';

export enum MysticForm {
  AWARENESS_ACTIVATION = '覺識式',    // 萬象啟動
  SEMANTIC_DECODING = '解構式',       // 語義破陣
  STRATEGIC_GUIDANCE = '策演式',      // 智慧導引
  FLOW_EXECUTION = '貫通式',          // 行動流轉
  ECHO_FEEDBACK = '迴響式',           // 數據回饋
  KNOWLEDGE_REFINEMENT = '鍛智式'     // 進化重構
}

export interface MysticCycle {
  id: string;
  userId: string;
  currentForm: MysticForm;
  startTime: number;
  completedForms: MysticForm[];
  data: Record<string, any>;
  status: 'active' | 'completed' | 'failed';
}

export interface CycleResult {
  cycleId: string;
  finalForm: MysticForm;
  output: any;
  duration: number;
  formsExecuted: MysticForm[];
  success: boolean;
}

/**
 * 萬能元鑰核心系統
 * 整合所有奧義模組，實現六式循環
 */
export class OmniKeyCore {
  private activeCycles: Map<string, MysticCycle> = new Map();

  constructor(
    private memoryPalace: MemoryPalace,
    private navigationAgent: NavigationAgent,
    private authorityForge: AuthorityForge,
    private runeEngrafter: RuneEngrafter
  ) {}

  /**
   * 啟動六式循環
   */
  async initiateCycle(
    userId: string,
    initialTrigger: string,
    context?: Record<string, any>
  ): Promise<string> {
    const cycle: MysticCycle = {
      id: `cycle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      currentForm: MysticForm.AWARENESS_ACTIVATION,
      startTime: Date.now(),
      completedForms: [],
      data: {
        initialTrigger,
        context: context || {},
        ...context
      },
      status: 'active'
    };

    this.activeCycles.set(cycle.id, cycle);

    console.log(`🌟 萬能元鑰循環啟動: ${cycle.id}`);
    console.log(`🎯 初始觸發: ${initialTrigger}`);

    // 異步執行循環 (不阻塞)
    this.executeCycle(cycle).catch(error => {
      console.error('萬能元鑰循環執行失敗:', error);
      cycle.status = 'failed';
    });

    return cycle.id;
  }

  /**
   * 執行六式循環
   */
  private async executeCycle(cycle: MysticCycle): Promise<CycleResult> {
    const forms: MysticForm[] = [
      MysticForm.AWARENESS_ACTIVATION,
      MysticForm.SEMANTIC_DECODING,
      MysticForm.STRATEGIC_GUIDANCE,
      MysticForm.FLOW_EXECUTION,
      MysticForm.ECHO_FEEDBACK,
      MysticForm.KNOWLEDGE_REFINEMENT
    ];

    try {
      for (const form of forms) {
        cycle.currentForm = form;
        console.log(`⚡ 執行奧義: ${form}`);

        const result = await this.executeMysticForm(cycle, form);
        cycle.data[`${form}_result`] = result;
        cycle.completedForms.push(form);

        // 檢查是否需要提前終止
        if (this.shouldTerminateCycle(cycle, form, result)) {
          break;
        }
      }

      cycle.status = 'completed';

      const duration = Date.now() - cycle.startTime;
      const finalOutput = this.synthesizeFinalOutput(cycle);

      console.log(`✨ 萬能元鑰循環完成: ${cycle.id} (${duration}ms)`);

      return {
        cycleId: cycle.id,
        finalForm: cycle.currentForm,
        output: finalOutput,
        duration,
        formsExecuted: cycle.completedForms,
        success: true
      };

    } catch (error) {
      cycle.status = 'failed';
      throw error;
    }
  }

  /**
   * 執行單一奧義形式
   */
  private async executeMysticForm(cycle: MysticCycle, form: MysticForm): Promise<any> {
    switch (form) {
      case MysticForm.AWARENESS_ACTIVATION:
        return await this.executeAwarenessActivation(cycle);

      case MysticForm.SEMANTIC_DECODING:
        return await this.executeSemanticDecoding(cycle);

      case MysticForm.STRATEGIC_GUIDANCE:
        return await this.executeStrategicGuidance(cycle);

      case MysticForm.FLOW_EXECUTION:
        return await this.executeFlowExecution(cycle);

      case MysticForm.ECHO_FEEDBACK:
        return await this.executeEchoFeedback(cycle);

      case MysticForm.KNOWLEDGE_REFINEMENT:
        return await this.executeKnowledgeRefinement(cycle);

      default:
        throw new Error(`未知的奧義形式: ${form}`);
    }
  }

  /**
   * 第一式：覺識式 - 萬象啟動
   * 感知用戶輸入，喚醒相關記憶和上下文
   */
  private async executeAwarenessActivation(cycle: MysticCycle): Promise<any> {
    const { initialTrigger, context } = cycle.data;

    // 從記憶宮殿檢索相關上下文
    const memoryResults = await this.memoryPalace.retrieve({
      userId: cycle.userId,
      query: initialTrigger,
      context: JSON.stringify(context),
      limit: 3
    });

    // 喚醒相關的權能鑰匙
    const authorityKeys = this.authorityForge.getAuthorityKeys(cycle.userId);

    // 檢查可用的符文
    const engraftedRunes = this.runeEngrafter.getEngraftedRunes(cycle.userId);

    return {
      trigger: initialTrigger,
      context: context,
      memories: memoryResults,
      authorityKeys: authorityKeys.slice(0, 3), // 前3個最相關的
      availableRunes: engraftedRunes.slice(0, 3),
      awarenessLevel: this.calculateAwarenessLevel(memoryResults, authorityKeys, engraftedRunes)
    };
  }

  /**
   * 第二式：解構式 - 語義破陣
   * 解析輸入內容，提取關鍵信息和意圖
   */
  private async executeSemanticDecoding(cycle: MysticCycle): Promise<any> {
    const awarenessData = cycle.data.awareness_activation_result;

    // 使用符文進行語義分析 (如果有AI模型符文)
    const aiRunes = awarenessData.availableRunes.filter((r: any) =>
      r.baseRune.type === 'ai_model'
    );

    let semanticAnalysis = {
      intent: 'unknown',
      entities: [],
      keywords: [],
      complexity: 1,
      confidence: 0.5
    };

    if (aiRunes.length > 0) {
      // 模擬AI分析
      semanticAnalysis = {
        intent: this.inferIntent(awarenessData.trigger),
        entities: this.extractEntities(awarenessData.trigger),
        keywords: this.extractKeywords(awarenessData.trigger),
        complexity: this.assessComplexity(awarenessData.trigger),
        confidence: 0.85
      };
    }

    return {
      semanticAnalysis,
      decodedIntent: semanticAnalysis.intent,
      keyEntities: semanticAnalysis.entities,
      actionKeywords: semanticAnalysis.keywords,
      processingComplexity: semanticAnalysis.complexity
    };
  }

  /**
   * 第三式：策演式 - 智慧導引
   * 基於解構結果，制定執行策略
   */
  private async executeStrategicGuidance(cycle: MysticCycle): Promise<any> {
    const decodingData = cycle.data.semantic_decoding_result;
    const awarenessData = cycle.data.awareness_activation_result;

    // 創建任務對象
    const task: Task = {
      id: `task-${cycle.id}`,
      userId: cycle.userId,
      description: decodingData.decodedIntent,
      type: this.mapIntentToTaskType(decodingData.decodedIntent),
      context: JSON.stringify(decodingData),
      priority: this.calculatePriority(decodingData.processingComplexity),
      constraints: decodingData.keyEntities,
      dependencies: []
    };

    // 使用導航代理制定計劃
    const executionResult = await this.navigationAgent.executeTask(task);

    return {
      task,
      plan: executionResult.planId ? {
        id: executionResult.planId,
        steps: executionResult.stepsExecuted.length,
        estimatedDuration: executionResult.duration
      } : null,
      strategy: {
        approach: this.selectExecutionApproach(decodingData, awarenessData),
        tools: this.selectRequiredTools(decodingData, awarenessData),
        riskLevel: this.assessExecutionRisk(decodingData)
      }
    };
  }

  /**
   * 第四式：貫通式 - 行動流轉
   * 執行制定的計劃，調度各種資源
   */
  private async executeFlowExecution(cycle: MysticCycle): Promise<any> {
    const guidanceData = cycle.data.strategic_guidance_result;

    if (!guidanceData.plan) {
      throw new Error('沒有可執行的計劃');
    }

    // 執行權能鑰匙 (如果適用)
    const relevantKeys = guidanceData.strategy.tools
      .filter((tool: any) => tool.type === 'authority_key')
      .map((tool: any) => tool.id);

    const executionResults = [];

    for (const keyId of relevantKeys) {
      try {
        const result = await this.authorityForge.useAuthorityKey(keyId, {
          cycleId: cycle.id,
          context: guidanceData.task.context
        });
        executionResults.push(result);
      } catch (error) {
        console.warn(`權能鑰匙執行失敗 ${keyId}:`, error);
      }
    }

    // 執行符文 (如果適用)
    const relevantRunes = guidanceData.strategy.tools
      .filter((tool: any) => tool.type === 'rune')
      .map((tool: any) => tool.id);

    for (const runeId of relevantRunes) {
      try {
        const result = await this.runeEngrafter.executeRune(runeId, {
          cycleId: cycle.id,
          task: guidanceData.task
        });
        executionResults.push(result);
      } catch (error) {
        console.warn(`符文執行失敗 ${runeId}:`, error);
      }
    }

    return {
      executedTools: executionResults.length,
      results: executionResults,
      flowStatus: executionResults.length > 0 ? 'completed' : 'no_tools_executed',
      executionTime: Date.now() - cycle.startTime
    };
  }

  /**
   * 第五式：迴響式 - 數據回饋
   * 收集執行結果，反饋系統效能
   */
  private async executeEchoFeedback(cycle: MysticCycle): Promise<any> {
    const executionData = cycle.data.flow_execution_result;

    // 分析執行結果
    const feedback = {
      cyclePerformance: {
        totalTime: executionData.executionTime,
        toolsExecuted: executionData.executedTools,
        successRate: executionData.results.filter((r: any) => r.success !== false).length / executionData.results.length,
        efficiency: this.calculateEfficiency(executionData)
      },
      systemHealth: {
        memoryUsage: this.getMemoryUsage(),
        authorityKeysUsed: executionData.executedTools,
        runesActivated: executionData.results.length
      },
      userExperience: {
        responsiveness: executionData.executionTime < 5000 ? 'excellent' : 'good',
        toolUtilization: executionData.executedTools > 0 ? 'high' : 'low'
      }
    };

    // 記錄行為數據供權能冶煉引擎學習
    await this.authorityForge.observeBehavior(
      cycle.userId,
      'cycle_execution',
      'omnikey_core',
      executionData.executionTime,
      executionData.flowStatus === 'completed',
      {
        formsCompleted: cycle.completedForms.length,
        toolsUsed: executionData.executedTools,
        cycleComplexity: this.calculateCycleComplexity(cycle)
      }
    );

    return feedback;
  }

  /**
   * 第六式：鍛智式 - 進化重構
   * 基於反饋優化系統，更新知識庫
   */
  private async executeKnowledgeRefinement(cycle: MysticCycle): Promise<any> {
    const feedbackData = cycle.data.echo_feedback_result;

    // 存儲循環執行記錄
    await this.memoryPalace.store({
      type: 'experience',
      content: `循環 ${cycle.id} 完成: ${cycle.completedForms.length} 式奧義, 耗時 ${feedbackData.cyclePerformance.totalTime}ms`,
      context: `cycle-execution-${cycle.id}`,
      tags: ['cycle', 'execution', 'refinement', ...cycle.completedForms],
      vectors: [], // 應生成真實向量
      userId: cycle.userId,
      connections: [],
      confidence: feedbackData.cyclePerformance.successRate
    });

    // 分析改進點
    const improvements = this.analyzeCycleImprovements(cycle, feedbackData);

    // 應用系統優化
    await this.applySystemOptimizations(improvements);

    return {
      cycleId: cycle.id,
      improvements,
      knowledgeGained: this.extractKnowledgeGains(cycle),
      systemEvolution: {
        memoryNodesAdded: 1,
        patternsLearned: improvements.length,
        efficiencyGain: feedbackData.cyclePerformance.efficiency
      }
    };
  }

  /**
   * 獲取循環狀態
   */
  getCycleStatus(cycleId: string): MysticCycle | null {
    return this.activeCycles.get(cycleId) || null;
  }

  /**
   * 獲取活躍循環
   */
  getActiveCycles(userId?: string): MysticCycle[] {
    const cycles = Array.from(this.activeCycles.values());
    return userId ? cycles.filter(c => c.userId === userId) : cycles;
  }

  // 私有工具方法
  private calculateAwarenessLevel(memories: any[], keys: any[], runes: any[]): number {
    const memoryScore = Math.min(memories.length * 20, 40);
    const keyScore = Math.min(keys.length * 15, 30);
    const runeScore = Math.min(runes.length * 10, 30);
    return memoryScore + keyScore + runeScore;
  }

  private inferIntent(trigger: string): string {
    // 簡化的意圖推斷邏輯
    if (trigger.includes('分析') || trigger.includes('analyze')) return 'analysis';
    if (trigger.includes('創建') || trigger.includes('create')) return 'creation';
    if (trigger.includes('自動化') || trigger.includes('automate')) return 'automation';
    if (trigger.includes('學習') || trigger.includes('learn')) return 'learning';
    return 'general_task';
  }

  private extractEntities(text: string): string[] {
    // 簡化的實體提取
    return text.match(/@\w+|\#\w+/g) || [];
  }

  private extractKeywords(text: string): string[] {
    // 簡化的關鍵字提取
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => word.length > 3).slice(0, 5);
  }

  private assessComplexity(text: string): number {
    // 簡化的複雜度評估
    const length = text.length;
    if (length > 200) return 3;
    if (length > 50) return 2;
    return 1;
  }

  private mapIntentToTaskType(intent: string): Task['type'] {
    const mapping: Record<string, Task['type']> = {
      'analysis': 'analysis',
      'creation': 'creation',
      'automation': 'automation',
      'learning': 'learning'
    };
    return mapping[intent] || 'execution';
  }

  private calculatePriority(complexity: number): Task['priority'] {
    if (complexity >= 3) return 'critical';
    if (complexity >= 2) return 'high';
    return 'medium';
  }

  private selectExecutionApproach(decoding: any, awareness: any): string {
    if (decoding.processingComplexity >= 3) return 'multi_agent_coordination';
    if (awareness.authorityKeys.length > 0) return 'authority_key_execution';
    return 'direct_execution';
  }

  private selectRequiredTools(decoding: any, awareness: any): any[] {
    const tools = [];

    // 添加相關權能鑰匙
    awareness.authorityKeys.forEach((key: any) => {
      tools.push({ type: 'authority_key', id: key.id, name: key.name });
    });

    // 添加相關符文
    awareness.availableRunes.forEach((rune: any) => {
      tools.push({ type: 'rune', id: rune.id, name: rune.baseRune.name });
    });

    return tools.slice(0, 3); // 限制工具數量
  }

  private assessExecutionRisk(decoding: any): string {
    if (decoding.processingComplexity >= 3) return 'high';
    if (decoding.keyEntities.length > 2) return 'medium';
    return 'low';
  }

  private shouldTerminateCycle(cycle: MysticCycle, form: MysticForm, result: any): boolean {
    // 檢查錯誤條件
    if (form === MysticForm.SEMANTIC_DECODING && !result.semanticAnalysis) {
      return true;
    }

    if (form === MysticForm.FLOW_EXECUTION && result.flowStatus === 'failed') {
      return true;
    }

    return false;
  }

  private synthesizeFinalOutput(cycle: MysticCycle): any {
    const lastResult = cycle.data[`${cycle.currentForm}_result`];
    return {
      cycleId: cycle.id,
      finalForm: cycle.currentForm,
      primaryOutput: lastResult,
      summary: {
        formsCompleted: cycle.completedForms.length,
        totalTime: Date.now() - cycle.startTime,
        success: cycle.status === 'completed'
      }
    };
  }

  private calculateEfficiency(executionData: any): number {
    if (executionData.executionTime === 0) return 0;
    return (executionData.executedTools / executionData.executionTime) * 1000;
  }

  private getMemoryUsage(): number {
    // 簡化的記憶體使用計算
    return Math.random() * 100; // 模擬值
  }

  private calculateCycleComplexity(cycle: MysticCycle): number {
    return cycle.completedForms.length;
  }

  private analyzeCycleImprovements(cycle: MysticCycle, feedback: any): string[] {
    const improvements = [];

    if (feedback.cyclePerformance.totalTime > 10000) {
      improvements.push('優化執行速度');
    }

    if (feedback.cyclePerformance.successRate < 0.8) {
      improvements.push('提升成功率');
    }

    if (feedback.systemHealth.memoryUsage > 80) {
      improvements.push('優化記憶體使用');
    }

    return improvements;
  }

  private async applySystemOptimizations(improvements: string[]): Promise<void> {
    // 應用系統優化 (在實際實現中會調整參數、更新模型等)
    console.log('應用系統優化:', improvements);
  }

  private extractKnowledgeGains(cycle: MysticCycle): any {
    return {
      patternsLearned: cycle.completedForms.length,
      executionInsights: cycle.data,
      performanceMetrics: {
        totalTime: Date.now() - cycle.startTime,
        formsCompleted: cycle.completedForms.length
      }
    };
  }
}