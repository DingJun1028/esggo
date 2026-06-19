/**
 * 奧秘鑰匙核心 (OmniKey) - ESG 戰略與全知即時運算
 * 連結所有 JunAiKey 模組，作為系統的「靈魂」與「大腦」。
 */

import { ncb } from '@/lib/ncb/client';
import { EventEmitter } from '@/utils/EventEmitter';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';
import { IComponentCore, IEvidenceMap } from '../0-domain/contracts/IComponentCore';

// Services
import { esgInsightEngine } from '../services/esg-insight-engine';
import { systemIntegrationService as systemIntegration } from '../services/system-integration';
import { advancedAnalyticsService as advancedAnalytics } from '../services/advanced-analytics';
import { smartNotifications } from '../services/smart-notifications';

// MCP Integration
import { mcpBridge } from '../services/mcp/MCPBridge';
import type { MCPServerConfig, MCPTool, MCPToolResult } from '../services/mcp/MCPBridge';
import type { MCPToolExecutionContext, MCPIntegrationConfig } from '../types/mcp';
import { mcpToolCache, type CacheStats } from '../services/mcp/MCPToolCache';
import {
  batchExecutor,
  type BatchExecutionOptions,
  type BatchToolCall,
  type BatchResult,
} from '../services/mcp/BatchExecutor';
import {
  adaptiveRetryStrategy,
  ErrorClassifier,
  type ErrorCategory,
} from '../services/mcp/AdaptiveRetryStrategy';

// ========== 靈魂架構 (Structural Types) ==========

export interface SelfNavigationContext {
  userId: string;
  intent: string;
  context: any;
  constraints: any[];
  preferences: any;
}

export interface LongTermMemory {
  knowledgeGraph: Map<string, any>;
  experiencePatterns: any[];
  decisionHistory: any[];
  skillEvolution: any[];
}

export interface AuthorityForging {
  capabilities: Map<string, any>;
  automationRules: any[];
  efficiencyMetrics: any;
  evolutionIndex: number;
}

export interface RuneEngrafting {
  integratedCapabilities: Map<string, any>;
  pluginEcosystem: any[];
  adaptationHistory: any[];
  collectiveIntelligence: any;
}

export interface AgentCapability {
  name: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'learning';
  evolutionIndex: number;
  lastUsed: Date;
}

export interface AgentGroup {
  id: string;
  name: string;
  agents: string[];
  purpose: string;
  collaborationPattern: any;
  performance: any;
}

export interface OmniTask {
  id: string;
  type: 'data_sync' | 'analysis' | 'notification' | 'automation' | 'integration';
  priority: 'low' | 'medium' | 'high' | 'critical';
  context: any;
  assignedAgents: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface SyncEndpoint {
  id: string;
  name: string;
  type: 'erp' | 'iot' | 'supply_chain' | 'external_api' | 'internal_db' | 'ncb_core';
  config: any;
  lastSync: Date;
  syncStatus: 'idle' | 'syncing' | 'success' | 'failed';
  dataFlow: {
    inbound: boolean;
    outbound: boolean;
    frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  };
}

export interface SyncOperation {
  id: string;
  endpointId: string;
  direction: 'inbound' | 'outbound';
  data: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: Date;
  error?: string;
}

// ========== 核心實現 (Core Implementation) ==========

export class OmniKeyCore extends EventEmitter implements IComponentCore {
  private static readonly HASH_BIT_SHIFT = 5;
  private static readonly HASH_HEX_LENGTH = 16;

  readonly uuid =
    'SOUL-KEY-' +
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'MOCK-UUID-' + Date.now());
  readonly version = '7.0.0-SENTIENT';
  readonly timestamp = Date.now();
  readonly status = 'Trustworthy' as const; // 狀態：不可篡改
  readonly formula = 'Soul_Integrity = Sum(Virtues) / 6'; // [Transparent] 算法公式
  readonly meridian = 'INWARD_REN';
  readonly virtues = {
    intelligence: 10,
    benevolence: 10,
    integrity: 10,
    courage: 10,
    temperance: 10,
    harmony: 10,
  };
  readonly data: unknown = {};
  evidence: IEvidenceMap = {
    tangible: {
      metric: 'soul_integrity: 100',
      visual_grade: 'SOVEREIGN',
      glow_intensity: 100,
    },
    traceable: {
      source_origin: 'OmniKeyCore',
      verification_links: [],
    },
    trackable: {
      lifecycle_hooks: [],
      pathway: ['initialization'],
    },
    transparent: {
      formula: 'Soul_Integrity = Sum(Virtues) / 6',
      validation_standard: '5T-Protocol-v8.0',
    },
    trustworthy: {
      hash_lock: '', // Calculated in constructor
      is_frozen: false,
    },
  };

  private calculateHashLock(): string {
    const content = `${this.uuid}-${this.timestamp}-${this.version}`;
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << OmniKeyCore.HASH_BIT_SHIFT) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash)
      .toString(OmniKeyCore.HASH_HEX_LENGTH)
      .padStart(OmniKeyCore.HASH_HEX_LENGTH, '0');
  }

  private pillars: {
    selfNavigation: SelfNavigationContext | null;
    longTermMemory: LongTermMemory;
    authorityForging: AuthorityForging;
    runeEngrafting: RuneEngrafting;
  };

  private agents: Map<string, AgentCapability> = new Map();
  private agentGroups: Map<string, AgentGroup> = new Map();
  private tasks: Map<string, OmniTask> = new Map();
  private syncEndpoints: Map<string, SyncEndpoint> = new Map();
  private syncOperations: SyncOperation[] = [];
  private automationInterval: ReturnType<typeof setInterval> | null = null;
  private autoBackupInterval: any; // Added for compatibility if referenced, usually managed by logger

  // 服務掛載
  private services = {
    insightEngine: esgInsightEngine,
    systemIntegration,
    advancedAnalytics,
    smartNotifications,
    mcpBridge, // MCP 橋接服務
  };

  // MCP 整合配置
  private mcpConfig: MCPIntegrationConfig = {
    enabled: true,
    defaultServers: ['esg_data'],
    timeout: 30000,
    retryAttempts: 3,
    logLevel: 'info',
  };

  // MCP 快取配置
  private cacheEnabled = true;

  constructor() {
    super();

    // Initialize Pillars
    this.pillars = {
      selfNavigation: null,
      longTermMemory: {
        knowledgeGraph: new Map(),
        experiencePatterns: [],
        decisionHistory: [],
        skillEvolution: [],
      },
      authorityForging: {
        capabilities: new Map(),
        automationRules: [],
        efficiencyMetrics: {},
        evolutionIndex: 0,
      },
      runeEngrafting: {
        integratedCapabilities: new Map(),
        pluginEcosystem: [],
        adaptationHistory: [],
        collectiveIntelligence: {},
      },
    };

    if (this.evidence?.trustworthy) {
      this.evidence.trustworthy.hash_lock = this.calculateHashLock();
    }

    this.initializeCore();
  }

  /** 🔴 不可篡改封印：執行 Object.freeze() 並標記為已凍結 */
  public lock(): void {
    Object.freeze(this);
    Object.freeze(this.evidence);
    if (this.evidence?.trustworthy) {
      this.evidence.trustworthy.is_frozen = true;
    }
    omniLogger.info(LogCategory.SYSTEM, 'OmniKeyCore locked and sealed', {
      uuid: this.uuid,
      hash_lock: this.evidence.trustworthy?.hash_lock,
    });
  }

  public initialize(): Promise<void> {
    return this.initializeCore();
  }

  public async destroy(): Promise<void> {
    if (this.automationInterval) {
      clearInterval(this.automationInterval);
      this.automationInterval = null;
    }
    this.removeAllListeners();
    omniLogger.info(LogCategory.SYSTEM, 'OmniKeyCore Destroyed');
  }

  private async initializeCore(): Promise<void> {
    try {
      this.emit('core-initialized', { timestamp: this.timestamp });
      await this.initializeSyncEndpoints();
      await this.loadPillarsData();
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'OmniKey Core initialization failed', { error });
      this.emit('core-error', { error });
    }
  }

  private async initializeSyncEndpoints(): Promise<void> {
    const endpoints: SyncEndpoint[] = [
      {
        id: 'ncb-core',
        name: 'NoCodeBackend Core',
        type: 'ncb_core',
        config: {},
        lastSync: new Date(),
        syncStatus: 'idle',
        dataFlow: { inbound: true, outbound: true, frequency: 'real_time' },
      },
    ];

    for (const endpoint of endpoints) {
      this.syncEndpoints.set(endpoint.id, endpoint);
    }
  }

  private async loadPillarsData(): Promise<void> {
    try {
      const { data: pillarsData, error } = await ncb
        .from('omni_key_pillars')
        .select('*')
        .single();

      if (pillarsData && !error) {
        // Merge logic would go here
      }
    } catch (error) {
      omniLogger.warn(LogCategory.DATA, 'Failed to load pillars data', { error });
    }
  }

  // ========== 意圖與導航 (Intent & Navigation) ==========

  async navigateIntent(context: SelfNavigationContext): Promise<any> {
    this.pillars.selfNavigation = context;
    try {
      const intentAnalysis = await this.services.insightEngine.generateInsightsReport();
      // Mock result
      return { success: true, analysis: intentAnalysis };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Self-navigation intent process failed', {
        error,
        context,
      });
      throw error;
    }
  }

  // ========== 知識存儲 (Knowledge) ==========

  async storeKnowledge(key: string, knowledge: any): Promise<void> {
    this.pillars.longTermMemory.knowledgeGraph.set(key, {
      ...knowledge,
      storedAt: new Date(),
    });
  }

  async retrieveKnowledge(key: string): Promise<any> {
    return this.pillars.longTermMemory.knowledgeGraph.get(key);
  }

  // ========== 任務管理 (Task Management) ==========

  async createTask(taskConfig: Partial<OmniTask>): Promise<string> {
    const id = `task_${Date.now()}`;
    // Logic to create task
    return id;
  }

  // ========== MCP 整合 (MCP Integration) ==========

  /**
   * 註冊 MCP 伺服器
   * Register an MCP server for tool access
   */
  async registerMCPServer(config: MCPServerConfig): Promise<void> {
    if (!this.mcpConfig.enabled) {
      omniLogger.warn(LogCategory.SYSTEM, 'MCP integration is disabled');
      return;
    }

    try {
      this.services.mcpBridge.registerServer(config);
      omniLogger.info(LogCategory.SYSTEM, 'MCP server registered', {
        source_origin: 'OmniKeyCore',
        serverLabel: config.serverLabel,
      });
      this.emit('mcp-server-registered', { serverLabel: config.serverLabel });
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to register MCP server', {
        error: error.message,
        serverLabel: config.serverLabel,
      });
      throw error;
    }
  }

  /**
   * 獲取已註冊的 MCP 伺服器列表
   * Get list of registered MCP servers
   */
  async getMCPServers(): Promise<MCPServerConfig[]> {
    return this.services.mcpBridge.getServers();
  }

  /**
   * 載入 MCP 伺服器的工具
   * Load tools from an MCP server
   */
  async loadMCPTools(serverLabel: string): Promise<MCPTool[]> {
    try {
      const tools = await this.services.mcpBridge.loadTools(serverLabel);
      omniLogger.info(LogCategory.SYSTEM, 'MCP tools loaded', {
        source_origin: 'OmniKeyCore',
        serverLabel,
        toolCount: tools.length,
      });
      return tools;
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to load MCP tools', {
        error: error.message,
        serverLabel,
      });
      throw error;
    }
  }

  /**
   * 執行 MCP 工具
   * Execute an MCP tool with adaptive retry and caching
   */
  async executeMCPTool(
    toolName: string,
    args: Record<string, any>,
    context?: Partial<MCPToolExecutionContext> & { bypassCache?: boolean }
  ): Promise<any> {
    // 檢查快取
    if (this.cacheEnabled && !context?.bypassCache) {
      const cached = mcpToolCache.get(toolName, args);
      if (cached !== null) {
        omniLogger.info(LogCategory.AI, 'MCP tool result from cache', {
          source_origin: 'OmniKeyCore',
          toolName,
        });
        return cached;
      }
    }

    const executionContext: MCPToolExecutionContext = {
      toolName,
      serverLabel: context?.serverLabel || 'unknown',
      args,
      timestamp: Date.now(),
      userId: context?.userId,
      sessionId: context?.sessionId,
    };

    // 使用自適應重試策略
    const result = await adaptiveRetryStrategy.executeWithRetry(
      async () => {
        omniLogger.info(LogCategory.AI, 'Executing MCP tool', {
          source_origin: 'OmniKeyCore',
          ...executionContext,
        });

        const startTime = Date.now();
        const toolResult = await Promise.race([
          this.services.mcpBridge.executeTool(toolName, args),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tool execution timeout')), this.mcpConfig.timeout)
          ),
        ]);
        const executionTime = Date.now() - startTime;

        // 存入快取
        if (this.cacheEnabled && !context?.bypassCache) {
          mcpToolCache.set(toolName, args, toolResult);
        }

        omniLogger.info(LogCategory.AI, 'MCP tool executed successfully', {
          source_origin: 'OmniKeyCore',
          toolName,
          executionTime,
        });

        this.emit('mcp-tool-executed', { toolName, result: toolResult, executionTime });
        return toolResult;
      },
      { name: `mcp_tool_${toolName}` }
    );

    return result;
  }

  /**
   * 使用 MCP 工具進行對話
   * Chat with MCP tools integration
   */
  async chatWithMCPTools(
    message: string,
    serverLabels: string[]
  ): Promise<{ response: string; toolCalls?: MCPToolResult[] }> {
    try {
      const result = await this.services.mcpBridge.chatWithTools(message, serverLabels);
      omniLogger.info(LogCategory.AI, 'MCP chat completed', {
        source_origin: 'OmniKeyCore',
        serverLabels,
        toolCallCount: result.toolCalls?.length || 0,
      });
      return result;
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'MCP chat failed', {
        error: error.message,
        serverLabels,
      });
      throw error;
    }
  }

  /**
   * 觸發覺醒協議（透過 MCP）
   * Trigger awakening protocol via MCP
   */
  async triggerAwakening(): Promise<any> {
    try {
      omniLogger.info(LogCategory.SYSTEM, 'Triggering awakening protocol via MCP', {
        source_origin: 'OmniKeyCore',
      });

      // 動態導入以避免循環依賴
      const { getUltimateAwakeningProtocol } =
        await import('../omni/protocols/UltimateAwakeningProtocol');
      const protocol = getUltimateAwakeningProtocol();
      const result = await protocol.executeAwakening();

      this.emit('awakening-triggered', { result });
      return result;
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, 'Awakening protocol failed', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * 獲取覺醒狀態
   * Get awakening state
   */
  async getAwakeningState(): Promise<any> {
    try {
      const { getUltimateAwakeningProtocol } =
        await import('../omni/protocols/UltimateAwakeningProtocol');
      const protocol = getUltimateAwakeningProtocol();
      return protocol.getState();
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to get awakening state', {
        error: error.message,
      });
      throw error;
    }
  }

  // ========== 快取管理 (Cache Management) ==========

  /**
   * 獲取快取統計
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return mcpToolCache.getStats();
  }

  /**
   * 清空快取
   * Clear all cache
   */
  clearCache(): void {
    mcpToolCache.clear();
    omniLogger.info(LogCategory.SYSTEM, 'MCP tool cache cleared', {
      source_origin: 'OmniKeyCore',
    });
  }

  /**
   * 使快取失效
   * Invalidate cache by pattern
   */
  invalidateCache(pattern: string): number {
    const count = mcpToolCache.invalidate(pattern);
    omniLogger.info(LogCategory.SYSTEM, 'MCP tool cache invalidated', {
      source_origin: 'OmniKeyCore',
      pattern,
      count,
    });
    return count;
  }

  /**
   * 啟用/停用快取
   * Enable or disable cache
   */
  setCacheEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled;
    omniLogger.info(LogCategory.SYSTEM, `MCP tool cache ${enabled ? 'enabled' : 'disabled'}`, {
      source_origin: 'OmniKeyCore',
    });
  }

  /**
   * 預熱快取
   * Warmup cache with common tool results
   */
  async warmupCache(entries: Array<{ toolName: string; args: any; value: any }>): Promise<void> {
    await mcpToolCache.warmup(entries);
    omniLogger.info(LogCategory.SYSTEM, 'MCP tool cache warmed up', {
      source_origin: 'OmniKeyCore',
      count: entries.length,
    });
  }

  // ========== 批次執行 (Batch Execution) ==========

  /**
   * 批次執行 MCP 工具
   * Execute multiple MCP tools in batch
   */
  async executeBatch(
    tools: BatchToolCall[],
    options?: Partial<BatchExecutionOptions>
  ): Promise<BatchResult> {
    omniLogger.info(LogCategory.AI, 'Batch execution started', {
      source_origin: 'OmniKeyCore',
      toolCount: tools.length,
      options,
    });

    const result = await batchExecutor.execute(
      tools,
      (toolName, args) => this.executeMCPTool(toolName, args),
      options
    );

    this.emit('batch-executed', result);

    omniLogger.info(LogCategory.AI, 'Batch execution completed', {
      source_origin: 'OmniKeyCore',
      successRate: result.successRate,
      totalTime: result.totalTime,
    });

    return result;
  }
}
