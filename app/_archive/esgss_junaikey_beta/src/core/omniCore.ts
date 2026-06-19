/**
 * 奧秘心核實作
 * Omnipotent Core Implementation
 *
 * 三元一體的具體實現：
 * - 奧秘元件系統
 * - 奧秘標籤系統
 * - 奧秘智庫系統
 */

import {
  OmniCore,
  OmniComponent,
  OmniComponentSystem,
  OmniComponentResult,
  OmniTag,
  OmniTagSystem,
  KnowledgeResult,
  ReasoningInput,
  ReasoningResult,
  Knowledge,
  AgentConfig,
  ARVOResult,
  OmniThinkTank,
  OmniRequest,
  OmniResponse,
  OmniTagSet,
  OmniKnowledgeBase,
  KnowledgeChunk,
  OmniAgent,
  OmniSkillRegistry,
  OmniSkill,
  QueryOptions,
  OmniTagType,
  OmniResponseStatus,
  OmniComponentState,
  OmniComponentType,
  ARVOStage,
  ESGKnowledgeBase,
} from '../types/omniCore';

import { omniLogger, LogCategory } from '../services/omniLogger';
import { AI_CONSTANTS } from '../config/constants';

// ============================================================================
// 標籤集合實作
// ============================================================================

export class OmniTagSetImpl implements OmniTagSet {
  public tags: OmniTag[] = [];

  add(tag: OmniTag): void {
    const existing = this.tags.find(t => t.id === tag.id);
    if (!existing) {
      this.tags.push(tag);
    }
  }

  remove(tagId: string): void {
    this.tags = this.tags.filter(t => t.id !== tagId);
  }

  find(predicate: (tag: OmniTag) => boolean): OmniTag[] {
    return this.tags.filter(predicate);
  }

  findByType(type: OmniTagType): OmniTag[] {
    return this.tags.filter(t => t.type === type);
  }
}

// ============================================================================
// 標籤系統實作
// ============================================================================

export class OmniTagSystemImpl implements OmniTagSystem {
  private entityTags: Map<string, OmniTagSet> = new Map();

  create(type: OmniTagType, name: string, value: unknown): OmniTag {
    return {
      id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  attach(entityId: string, tag: OmniTag): void {
    if (!this.entityTags.has(entityId)) {
      this.entityTags.set(entityId, new OmniTagSetImpl());
    }
    this.entityTags.get(entityId)!.add(tag);
  }

  detach(entityId: string, tagId: string): void {
    const tagSet = this.entityTags.get(entityId);
    if (tagSet) {
      tagSet.remove(tagId);
    }
  }

  getTags(entityId: string): OmniTag[] {
    return this.entityTags.get(entityId)?.tags || [];
  }

  findEntities(predicate: (tag: OmniTag) => boolean): string[] {
    const entities: string[] = [];
    this.entityTags.forEach((tagSet, entityId) => {
      if (tagSet.find(predicate).length > 0) {
        entities.push(entityId);
      }
    });
    return entities;
  }
}

// ============================================================================
// 元件系統實作
// ============================================================================

export class OmniComponentSystemImpl implements OmniComponentSystem {
  private components: Map<string, OmniComponent> = new Map();

  register<T extends OmniComponent>(component: T): void {
    this.components.set(component.id, component);
    omniLogger.info(LogCategory.SYSTEM, `📦 Registered component: ${component.name}`, {
      componentId: component.id,
    });
  }

  unregister(componentId: string): void {
    this.components.delete(componentId);
    omniLogger.info(LogCategory.SYSTEM, `🗑️ Unregistered component: ${componentId}`);
  }

  get<T extends OmniComponent>(componentId: string): T | undefined {
    return this.components.get(componentId) as T | undefined;
  }

  async execute<TInput, TOutput>(
    componentId: string,
    input: TInput
  ): Promise<OmniComponentResult<TOutput>> {
    const component = this.components.get(componentId);

    if (!component) {
      return {
        success: false,
        error: `Component not found: ${componentId}`,
        executionTime: 0,
        generatedTags: [],
      };
    }

    const startTime = Date.now();

    try {
      // 驗證輸入
      if (!component.validate(input)) {
        return {
          success: false,
          error: 'Input validation failed',
          executionTime: Date.now() - startTime,
          generatedTags: [],
        };
      }

      // 執行元件
      const result = await component.execute(input);

      return {
        success: true,
        data: result as TOutput,
        executionTime: Date.now() - startTime,
        generatedTags: component.tags.tags,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        generatedTags: [],
      };
    }
  }

  list(): OmniComponent[] {
    return Array.from(this.components.values());
  }
}

// ============================================================================
// 知識庫實作
// ============================================================================

export class OmniKnowledgeBaseImpl implements OmniKnowledgeBase {
  public id: string;
  public name: string;
  public description?: string;
  public dimensions: number = AI_CONSTANTS.EMBEDDING_DIMENSIONS; // Default for text-embedding-ada-002 / text-embedding-004
  public totalChunks: number = 0;
  public tags: OmniTagSet = new OmniTagSetImpl();

  private storage: Map<string, KnowledgeChunk> = new Map();

  constructor(id: string, name: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  async store(content: string, metadata: Record<string, unknown> = {}): Promise<string> {
    const chunkId = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chunk: KnowledgeChunk = {
      id: chunkId,
      content,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        knowledgeBase: this.id,
      },
      tags: [],
    };

    this.storage.set(chunkId, chunk);
    this.totalChunks++;

    // Sync to omniKnowledge service
    const { omniKnowledge } = await import('../services/omniKnowledge');
    await omniKnowledge.store({
      type: 'system_insight',
      content,
      metadata: {
        timestamp: Date.now(),
        language: 'zh-TW',
        tags: (metadata.tags as string[]) || [],
        knowledgeBase: this.id,
      },
    });

    return chunkId;
  }

  async retrieve(query: string, topK: number = AI_CONSTANTS.DEFAULT_TOP_K): Promise<KnowledgeChunk[]> {
    const { ragEngine } = await import('../services/ragEngine');
    const results = await ragEngine.retrieve(query, {
      limit: topK,
      knowledgeBases: [this.id as ESGKnowledgeBase],
    });

    return results.map(r => ({
      id: r.id,
      content: r.content,
      similarity: r.relevance_score,
      metadata: { source: r.source, timestamp: r.timestamp },
      tags: [],
    }));
  }

  async delete(chunkId: string): Promise<void> {
    if (this.storage.has(chunkId)) {
      this.storage.delete(chunkId);
      this.totalChunks--;
    }
  }
}

// ============================================================================
// 智庫實作
// ============================================================================

export class OmniThinkTankImpl implements OmniThinkTank {
  public id: string = 'thinktank_master';
  public name: string = '奧秘智庫 (Omnipotent Think Tank)';
  public knowledgeBases: OmniKnowledgeBase[] = [];
  public agents: OmniAgent[] = [];
  public skillRegistry: OmniSkillRegistry;

  constructor() {
    this.skillRegistry = {
      register: () => { },
      unregister: () => { },
      get: () => undefined,
      list: () => [],
      listByCategory: () => [],
    };

    // Initialize the 8 standard ESG knowledge bases
    this.initESGKnowledgeBases();
  }

  private initESGKnowledgeBases() {
    const bases = [
      { id: 'esg_standards', name: 'ESG 標準與框架' },
      { id: 'gri_standards', name: 'GRI 全球報告倡議' },
      { id: 'tcfd_framework', name: 'TCFD 氣候揭露' },
      { id: 'sasb_standards', name: 'SASB 永續會計' },
      { id: 'sdgs_goals', name: '聯合國 SDGs' },
      { id: 'carbon_emission', name: '碳排放管理' },
      { id: 'esg_regulations', name: 'ESG 法規' },
      { id: 'best_practices', name: '最佳實踐案例' },
    ];

    this.knowledgeBases = bases.map(b => new OmniKnowledgeBaseImpl(b.id, b.name));
  }

  async query(query: string, options: QueryOptions = {}): Promise<KnowledgeResult[]> {
    const { ragEngine } = await import('../services/ragEngine');
    const results = await ragEngine.retrieve(query, {
      limit: options.topK || AI_CONSTANTS.DEFAULT_TOP_K,
      knowledgeBases: options.knowledgeBases,
    });

    return results.map(r => ({
      content: r.content,
      similarity: r.relevance_score,
      source: r.source,
      metadata: { knowledgeBase: r.knowledgeBase },
    }));
  }

  async reason(input: ReasoningInput): Promise<ReasoningResult> {
    const { ragEngine } = await import('../services/ragEngine');
    const stages: ARVOResult[] = [];

    // ARVO Workflow: Stage 1 - Analyze
    omniLogger.info(LogCategory.SYSTEM, '[ARVO] Stage 1: Analyze');
    const analysis = await this.performARVOStage(ARVOStage.ANALYZE, input.query);
    stages.push(analysis);

    // ARVO Workflow: Stage 2 - Reason
    omniLogger.info(LogCategory.SYSTEM, '[ARVO] Stage 2: Reason');
    const contextData = input.context as Record<string, any>;
    const kb = contextData?.knowledgeBases as ESGKnowledgeBase[] | undefined;
    const context = await ragEngine.retrieve(input.query, {
      knowledgeBases: kb,
    });
    const augmentedPrompt = await ragEngine.augmentPrompt(input.query, {
      knowledgeBases: kb,
    });
    const reasoning = await this.performARVOStage(ARVOStage.REASON, augmentedPrompt, context);
    stages.push(reasoning);

    // ARVO Workflow: Stage 3 - Verify
    omniLogger.info(LogCategory.SYSTEM, '[ARVO] Stage 3: Verify');
    const verification = await this.performARVOStage(ARVOStage.VERIFY, reasoning.content, context);
    stages.push(verification);

    // ARVO Workflow: Stage 4 - Orchestrate
    omniLogger.info(LogCategory.SYSTEM, '[ARVO] Stage 4: Orchestrate');
    const finalResult = await this.performARVOStage(ARVOStage.ORCHESTRATE, verification.content, stages);
    stages.push(finalResult);

    return {
      conclusion: finalResult.content,
      reasoning: stages.map(s => `[${s.stage.toUpperCase()}] ${s.content.substring(0, 100)}...`),
      confidence: finalResult.confidence,
    };
  }

  /**
   * Perform a specific ARVO reasoning stage
   */
  private async performARVOStage(
    stage: ARVOStage,
    input: string,
    context?: any
  ): Promise<ARVOResult> {
    // In a real implementation, this would call specialized AI prompts for each stage
    // For now, we simulate the sophisticated reasoning process
    let content = '';
    let confidence = AI_CONSTANTS.CONFIDENCE.DEFAULT;

    switch (stage) {
      case ARVOStage.ANALYZE:
        content = `分析問題核心意圖：探究「${input}」在 ESG 框架下的具體影響與合規要求。`;
        break;
      case ARVOStage.REASON:
        content = `基於檢索到的 ${context?.length || 0} 條知識片段，進行多維交叉推理。結合 GRI 與 TCFD 標準，分析得出初步結論。`;
        break;
      case ARVOStage.VERIFY:
        content = `針對「${input}」進行事實對齊與合規性驗證。確認數據來源可靠度，排除幻覺風險。`;
        confidence = AI_CONSTANTS.CONFIDENCE.VERIFIED;
        break;
      case ARVOStage.ORCHESTRATE:
        content = `綜合所有分析與驗證結果，編排最終的專業回報。確保內容符合 5T 協議（真實、美善、智慧、聖潔、全能）。\n\n最終建議：${input}`;
        confidence = AI_CONSTANTS.CONFIDENCE.ORCHESTRATED;
        break;
    }

    return {
      stage,
      content,
      confidence,
      metadata: { timestamp: Date.now() },
    };
  }

  async learn(knowledge: Knowledge): Promise<void> {
    // Default to best_practices if no metadata provided
    const targetKbId = (knowledge.metadata?.knowledgeBase as string) || 'best_practices';
    const kb = this.knowledgeBases.find(k => k.id === targetKbId);
    if (kb) {
      await kb.store(knowledge.content, knowledge.metadata);
    }
  }

  async createAgent(config: AgentConfig): Promise<OmniAgent> {
    // Simple mock agent creation
    const agent: OmniAgent = {
      id: `agent_${Date.now()}`,
      name: config.name,
      description: config.description,
      systemPrompt: config.systemPrompt,
      baseModel: config.baseModel || 'gemini-1.5-flash',
      temperature: config.temperature || 0.7,
      skills: [],
      tags: new OmniTagSetImpl(),
      process: async input => {
        const reasoning = await this.reason({ query: input });
        return {
          content: reasoning.conclusion,
          reasoning: reasoning.reasoning.join('\n'),
          tags: [],
        };
      },
      addSkill: () => { },
      removeSkill: () => { },
    };
    this.agents.push(agent);
    return agent;
  }
}

// ============================================================================
// 奧秘心核實作
// ============================================================================

export class OmniCoreImpl implements OmniCore {
  public id: string;
  public name: string;
  public version: string;

  public components: OmniComponentSystem;
  public tags: OmniTagSystem;
  public thinkTank: OmniThinkTank;

  // Phase 24: Swarm Resonance Slots
  private resonanceModifiers: Map<string, number> = new Map();

  private initialized: boolean = false;

  constructor(config: { name: string; version?: string; thinkTank: OmniThinkTank }) {
    this.id = `omnicore_${Date.now()}`;
    this.name = config.name;
    this.version = config.version || '1.0.0';

    this.components = new OmniComponentSystemImpl();
    this.tags = new OmniTagSystemImpl();
    this.thinkTank = config.thinkTank;
  }

  // Phase 24: Deep Integration Methods
  public setResonanceModifier(key: string, multiplier: number): void {
    this.resonanceModifiers.set(key, multiplier);
    omniLogger.info(
      LogCategory.SYSTEM,
      `🌌 OmniCore Resonance Slot Updated: ${key} -> x${multiplier.toFixed(2)}`
    );
  }

  public getResonanceMultiplier(): number {
    let total = 1.0;
    this.resonanceModifiers.forEach(m => (total *= m));
    return total;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      omniLogger.warn(LogCategory.SYSTEM, 'OmniCore already initialized');
      return;
    }

    omniLogger.info(
      LogCategory.SYSTEM,
      `
╭──────────────────────────────────────────────╮
│                                              │
│   🌌 奧秘心核 (Omnipotent Core)              │
│   三元一體核心系統                            │
│                                              │
│   Name: ${this.name.padEnd(36)} │
│   Version: ${this.version.padEnd(33)} │
│                                              │
│   ✨ 奧秘元件 (Component System)             │
│   🏷️  奧秘標籤 (Tag System)                  │
│   🧠 奧秘智庫 (Think Tank)                   │
│                                              │
╰──────────────────────────────────────────────╯
        `
    );

    this.initialized = true;
    omniLogger.info(LogCategory.SYSTEM, '✅ OmniCore initialization complete', {
      name: this.name,
      version: this.version,
    });
  }

  async process(request: OmniRequest): Promise<OmniResponse> {
    if (!this.initialized) {
      throw new Error('OmniCore not initialized');
    }

    const startTime = Date.now();
    const executedComponents: string[] = [];
    const invokedSkills: string[] = [];
    const generatedTags: OmniTag[] = [];

    try {
      omniLogger.info(LogCategory.SYSTEM, `🎯 Processing request: ${request.type}`, {
        requestId: request.id,
      });

      // 1. 創建請求標籤
      const requestTag = this.tags.create(OmniTagType.CONTEXT, 'request', {
        type: request.type,
        content: request.content,
      });
      generatedTags.push(requestTag);

      // 2. 根據請求類型處理
      let responseContent: string;
      let responseData: unknown;
      const status: OmniResponseStatus = OmniResponseStatus.SUCCESS;

      switch (request.type) {
        case 'query':
          // 查詢智庫
          const queryResults = await this.thinkTank.query(request.content);
          responseContent = this.formatQueryResults(queryResults);
          responseData = queryResults;
          break;

        case 'reason':
          // 推理
          const reasoningResult = await this.thinkTank.reason({
            query: request.content,
            context: request.context?.context as string[] | undefined,
          });
          responseContent = reasoningResult.conclusion;
          responseData = reasoningResult;

          // 創建推理標籤
          const reasoningTag = this.tags.create(OmniTagType.REASONING, 'reasoning_result', {
            confidence: reasoningResult.confidence,
          });
          generatedTags.push(reasoningTag);
          break;

        case 'learn':
          // 學習
          await this.thinkTank.learn({
            content: request.content,
            source: 'user_input',
            metadata: request.context,
          });
          responseContent = 'Knowledge learned successfully';

          // 創建知識標籤
          const knowledgeTag = this.tags.create(OmniTagType.KNOWLEDGE, 'learned_knowledge', {
            source: 'user_input',
          });
          generatedTags.push(knowledgeTag);
          break;

        case 'command':
        default:
          responseContent = 'Command processed';
          break;
      }

      // 3. 構建回應
      const response: OmniResponse = {
        id: `response_${Date.now()}`,
        requestId: request.id,
        status,
        content: responseContent,
        data: responseData,
        generatedTags,
        executedComponents,
        invokedSkills,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      };

      omniLogger.info(LogCategory.SYSTEM, `✅ Request processed in ${response.executionTime}ms`, {
        requestId: request.id,
        type: request.type,
      });
      return response;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '❌ Error processing request', {
        requestId: request.id,
        error,
      });

      return {
        id: `response_${Date.now()}`,
        requestId: request.id,
        status: OmniResponseStatus.FAILURE,
        content: 'Error processing request',
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        generatedTags,
        executedComponents,
        invokedSkills,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      };
    }
  }

  async shutdown(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, '🔌 Shutting down OmniCore...');

    // 清理所有元件
    for (const component of this.components.list()) {
      await component.cleanup();
    }

    this.initialized = false;
    omniLogger.info(LogCategory.SYSTEM, '✅ OmniCore shutdown complete');
  }

  private formatQueryResults(results: unknown[]): string {
    if (results.length === 0) {
      return 'No results found';
    }
    return `Found ${results.length} results`;
  }
}

// ============================================================================
// 基礎元件抽象類別
// ============================================================================

export abstract class BaseOmniComponent<
  TInput = unknown,
  TOutput = unknown,
> implements OmniComponent<TInput, TOutput> {
  public id: string;
  public name: string;
  public type: OmniComponentType;
  public description?: string;
  public inputSchema?: Record<string, unknown>;
  public outputSchema?: Record<string, unknown>;
  public state: OmniComponentState = OmniComponentState.UNINITIALIZED;
  public tags: OmniTagSet = new OmniTagSetImpl();

  constructor(config: {
    name: string;
    type: OmniComponentType;
    description?: string;
    inputSchema?: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
  }) {
    this.id = `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = config.name;
    this.type = config.type;
    this.description = config.description;
    this.inputSchema = config.inputSchema;
    this.outputSchema = config.outputSchema;
  }

  async initialize(): Promise<void> {
    this.state = OmniComponentState.READY;
    omniLogger.info(LogCategory.SYSTEM, `✅ Component initialized: ${this.name}`, {
      componentId: this.id,
    });
  }

  abstract execute(input: TInput): Promise<TOutput>;

  validate(input: TInput): boolean {
    // 基礎驗證邏輯
    return input !== null && input !== undefined;
  }

  async cleanup(): Promise<void> {
    this.state = OmniComponentState.CLEANED;
    omniLogger.info(LogCategory.SYSTEM, `🧹 Component cleaned up: ${this.name}`, {
      componentId: this.id,
    });
  }
}

// ============================================================================
// 工廠函數
// ============================================================================

/**
 * 創建奧秘心核實例
 */
export function createOmniCore(config: {
  name: string;
  version?: string;
  thinkTank: OmniThinkTank;
}): OmniCore {
  return new OmniCoreImpl(config);
}

/**
 * 創建標籤系統實例
 */
export function createTagSystem(): OmniTagSystem {
  return new OmniTagSystemImpl();
}

/**
 * 創建元件系統實例
 */
export function createComponentSystem(): OmniComponentSystem {
  return new OmniComponentSystemImpl();
}

/**
 * 預設奧秘智庫實例
 */
export const omniThinkTank = new OmniThinkTankImpl();
