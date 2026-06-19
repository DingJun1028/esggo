/**
 * OmniKey 核心系統專用類型定義
 * 為六式奧義循環提供完整的類型安全支持
 */

// ==================== 基礎類型 ====================

/**
 * 安全的 Record 類型
 */
export type SafeRecord<K extends string | number | symbol = string, V = unknown> = Record<K, V>;

// ==================== 六式奧義數據類型 ====================

/**
 * 覺識式（第一式）- 萬象啟動數據
 */
export interface AwarenessData {
  trigger: string;
  context: SafeRecord;
  memories: unknown[];
  authorityKeys: AuthorityKeyReference[];
  availableRunes: RuneReference[];
  awarenessLevel: number;
}

/**
 * 權能鑰匙引用
 */
export interface AuthorityKeyReference {
  id: string;
  name: string;
  type?: string;
}

/**
 * 符文引用
 */
export interface RuneReference {
  id: string;
  baseRune: {
    name: string;
    type: string;
  };
}

/**
 * 語義分析數據（第二式）- 語義破陣
 */
export interface SemanticData {
  semanticAnalysis: {
    intent: string;
    entities: string[];
    keywords: string[];
    complexity: number;
    confidence: number;
  };
  decodedIntent: string;
  keyEntities: string[];
  actionKeywords: string[];
  processingComplexity: number;
}

/**
 * 工具引用
 */
export interface ToolReference {
  type: 'authority_key' | 'rune';
  id: string;
  name: string;
}

/**
 * 策略指導數據（第三式）- 智慧導引
 */
export interface StrategyGuidanceData {
  task: unknown;
  plan: {
    id: string;
    steps: number;
    estimatedDuration: number;
  } | null;
  strategy: {
    approach: string;
    tools: ToolReference[];
    riskLevel: string;
  };
}

/**
 * 執行結果引用
 */
export interface ExecutionResultReference {
  success?: boolean;
  [key: string]: unknown;
}

/**
 * 執行流程數據（第四式）- 行動流轉
 */
export interface FlowExecutionData {
  executedTools: number;
  results: ExecutionResultReference[];
  flowStatus: 'completed' | 'no_tools_executed' | 'failed';
  executionTime: number;
}

/**
 * 回饋數據（第五式）- 數據回饋
 */
export interface EchoFeedbackData {
  cyclePerformance: {
    totalTime: number;
    toolsExecuted: number;
    successRate: number;
    efficiency: number;
  };
  systemHealth: {
    memoryUsage: number;
    authorityKeysUsed: number;
    runesActivated: number;
  };
  userExperience: {
    responsiveness: 'excellent' | 'good' | 'poor';
    toolUtilization: 'high' | 'medium' | 'low';
  };
}

/**
 * 知識精煉數據（第六式）- 進化重構
 */
export interface KnowledgeRefinementData {
  cycleId: string;
  improvements: string[];
  knowledgeGained: {
    patternsLearned: number;
    executionInsights: SafeRecord;
    performanceMetrics: {
      totalTime: number;
      formsCompleted: number;
    };
  };
  systemEvolution: {
    memoryNodesAdded: number;
    patternsLearned: number;
    efficiencyGain: number;
  };
}

// ==================== 循環數據類型 ====================

/**
 * 循環數據容器 - 包含所有六式的輸出
 */
export interface CycleDataContainer extends SafeRecord {
  initialTrigger?: string;
  context?: SafeRecord;
  awareness_activation_result?: AwarenessData;
  semantic_decoding_result?: SemanticData;
  strategic_guidance_result?: StrategyGuidanceData;
  flow_execution_result?: FlowExecutionData;
  echo_feedback_result?: EchoFeedbackData;
  knowledge_refinement_result?: KnowledgeRefinementData;
}

/**
 * 循環輸出類型
 */
export type CycleOutput = SafeRecord | string | number | boolean | null;
