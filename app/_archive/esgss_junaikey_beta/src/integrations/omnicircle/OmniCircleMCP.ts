/**
 * OmniCircle MCP Integration
 * 奧秘圓通 MCP 集成層
 * 
 * 功能：
 * - 通過 MCP 協議暴露 OmniCircle 功能
 * - 支持晶體編排、知識同步、標籤管理
 * - 提供雙向數據同步能力
 */

import { omniCircle } from '@/core/OmniCircle';
import { ICrystalDNA } from '@/types/omni-report.types';
import { omniKnowledgeBase, KnowledgeCategory } from '@/services/OmniKnowledgeBase';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { errorHandler, ErrorCategory } from '@/services/ErrorHandler';
import { omniCache } from '@/services/OmniCacheService';
import { PerformanceMonitor } from '@/utils/PerformanceMonitor';
import { omniSyncService, Platform, SyncDirection } from '@/services/OmniSyncService';
import { useNoteSystem } from '@/store/useNoteSystem';

// MCP 工具定義
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (params: any) => Promise<any>;
}

// OmniCircle MCP 工具集
export class OmniCircleMCP {
  private tools: Map<string, MCPTool> = new Map();

  // 性能統計
  private performanceStats = new Map<string, { count: number; totalTime: number }>();

  constructor() {
    this.registerTools();
    omniLogger.info(LogCategory.SYSTEM, '🌀 OmniCircle MCP Integration Initialized');
  }

  /**
   * 註冊所有 MCP 工具
   */
  private registerTools(): void {
    // 工具 1: 編排覺醒奧義
    this.tools.set('orchestrate_sentience', {
      name: 'orchestrate_sentience',
      description: '編排覺醒奧義，串聯 Tag、Memory、Crystal 進入 5T 閉環',
      inputSchema: {
        type: 'object',
        properties: {
          intent: {
            type: 'string',
            description: '意圖描述',
          },
          domain: {
            type: 'string',
            description: '領域（SENTIENCE/ENVIRONMENT/GOVERNANCE/SOCIAL）',
            enum: ['SENTIENCE', 'ENVIRONMENT', 'GOVERNANCE', 'SOCIAL'],
          },
          narrative: {
            type: 'string',
            description: '敘述內容',
          },
          resonance: {
            type: 'number',
            description: '共振值（0-100）',
            minimum: 0,
            maximum: 100,
          },
          markers: {
            type: 'array',
            description: 'DNA 標記',
            items: { type: 'string' },
          },
          noteOptions: {
            type: 'object',
            description: '筆記自定義選項',
            properties: {
              tags: { type: 'array', items: { type: 'string' } },
              linkedLogIds: { type: 'array', items: { type: 'string' } },
              investigationStatus: { type: 'string', enum: ['open', 'investigating', 'resolved'] },
            }
          }
        },
        required: ['intent', 'domain', 'narrative', 'resonance', 'markers'],
      },
      handler: async (params) => {
        return await this.withMonitoring('orchestrate_sentience', () =>
          this.orchestrateSentience(params)
        );
      },
    });

    // ... (工具 2-8 保持不變) ...

    // 工具 9: 管理 Omni 筆記
    this.tools.set('manage_omni_note', {
      name: 'manage_omni_note',
      description: '直接管理與連結 Omni 筆記 (create/update/link_log/mark_knowledge)',
      inputSchema: {
        type: 'object',
        properties: {
          contextId: {
            type: 'string',
            description: '筆記上下文 ID (例如 omni_note_xxx)',
          },
          action: {
            type: 'string',
            enum: ['create', 'update', 'link_log', 'mark_knowledge', 'delete'],
            description: '執行的操作',
          },
          content: {
            type: 'string',
            description: '筆記內容 (用於 create/update)',
          },
          metadata: {
            type: 'object',
            description: '筆記元數據 (用於 update/mark_knowledge)',
            properties: {
              tags: { type: 'array', items: { type: 'string' } },
              isKnowledgeAsset: { type: 'boolean' },
              knowledgeId: { type: 'string' },
              investigationStatus: { type: 'string', enum: ['open', 'investigating', 'resolved'] },
            }
          },
          logId: {
            type: 'string',
            description: '日誌 ID (用於 link_log)',
          }
        },
        required: ['contextId', 'action'],
      },
      handler: async (params) => {
        return await this.withMonitoring('manage_omni_note', () =>
          this.manageOmniNote(params)
        );
      },
    });
  }

  /**
   * 管理 Omni 筆記 (create/update/link_log/mark_knowledge)
   */
  private async manageOmniNote(params: any): Promise<any> {
    try {
      const noteSystem = useNoteSystem.getState();
      let result: any;

      switch (params.action) {
        case 'create':
          result = noteSystem.saveNote(params.contextId, params.content, params.metadata);
          break;
        case 'update':
          result = noteSystem.saveNote(params.contextId, params.content, params.metadata);
          break;
        case 'link_log':
          if (!params.logId) throw new Error('logId is required for link_log action');
          result = noteSystem.addLogToNote(params.contextId, params.logId);
          break;
        case 'mark_knowledge':
          result = noteSystem.updateNoteMetadata(params.contextId, params.metadata);
          break;
        case 'delete':
          result = noteSystem.deleteNote(params.contextId);
          break;
        default:
          throw new Error(`Unknown action: ${params.action}`);
      }

      omniLogger.info(LogCategory.BUSINESS, `[MCP] Omni Note management action '${params.action}' completed for contextId: ${params.contextId}`);
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, `[MCP] Omni Note management action '${params.action}' failed`, { error });
      throw error;
    }
  }

  /**
   * 編排覺醒奧義
   */
  private async orchestrateSentience(params: any): Promise<ICrystalDNA> {
    try {
      const crystal = await omniCircle.orchestrateSentience({
        intent: params.intent,
        domain: params.domain,
        narrative: params.narrative,
        resonance: params.resonance,
        markers: params.markers,
        noteOptions: params.noteOptions
      });

      omniLogger.info(LogCategory.BUSINESS, `[MCP] 覺醒奧義編排完成: ${crystal.uuid}`);
      return crystal;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 編排覺醒奧義失敗', { error });
      throw error;
    }
  }

  /**
   * 注入晶體 DNA
   */
  private async infuseCrystal(params: any): Promise<ICrystalDNA> {
    try {
      const crystal = await omniCircle.infuseCrystal(params);
      omniLogger.info(LogCategory.BUSINESS, `[MCP] 晶體 DNA 注入完成: ${crystal.uuid}`);
      return crystal;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 注入晶體 DNA 失敗', { error });
      throw error;
    }
  }

  /**
   * 創建知識
   */
  private async createKnowledge(params: any): Promise<any> {
    try {
      const knowledge = await omniKnowledgeBase.createKnowledge({
        title: params.title,
        content: params.content,
        category: params.category as KnowledgeCategory,
        tags: params.tags,
        authorId: params.authorId,
      });

      omniLogger.info(LogCategory.BUSINESS, `[MCP] 知識創建完成: ${knowledge.knowledge_id}`);
      return knowledge;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 創建知識失敗', { error });
      throw error;
    }
  }

  /**
   * 查詢知識（帶快取）
   */
  private async queryKnowledge(params: any): Promise<any> {
    try {
      // 生成快取鍵
      const cacheKey = `knowledge:${params.category || 'ALL'}:${JSON.stringify(params.tags || [])}:${params.limit || 10}`;

      // 嘗試從快取取得
      const cached = await omniCache.get('knowledge_query', cacheKey);
      if (cached) {
        omniLogger.debug(LogCategory.BUSINESS, '[MCP] 知識查詢命中快取', { cacheKey });
        return cached;
      }

      // 快取未命中，執行查詢
      const category = params.category === 'ALL' ? undefined : params.category as KnowledgeCategory;
      const knowledge = await omniKnowledgeBase.queryKnowledge({
        categories: category ? [category] : undefined,
        tags: params.tags,
      }, params.limit || 10);

      // 寫入快取（5T: Traceable - 記錄快取來源）
      await omniCache.set('knowledge_query', cacheKey, knowledge);

      omniLogger.info(LogCategory.BUSINESS, `[MCP] 知識查詢完成: ${knowledge.length} 條結果`);
      return knowledge;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 查詢知識失敗', { error });
      throw error;
    }
  }

  /**
   * 同步實體 (5T: Trackable - 同步追蹤)
   */
  private async syncEntity(params: any): Promise<any> {
    try {
      const result = await omniSyncService.syncEntity(
        params.platform as Platform,
        params.entityType,
        params.entityId,
        (params.direction || 'bidirectional') as SyncDirection,
        params.payload
      );

      omniLogger.info(LogCategory.BUSINESS, `[MCP] 實體同步完成: ${params.platform}/${params.entityType}/${params.entityId}`, {
        success: result.success,
        syncId: result.sync_id
      });

      return result;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 同步實體失敗', { error });
      throw error;
    }
  }

  /**
   * 獲取共振場（帶快取, 5T: Tangible - 可感知的場域數據）
   */
  private async getResonanceField(params: any): Promise<any> {
    try {
      const crystalId = params.crystalId || params.uuid;
      const cacheKey = `resonance:${crystalId}`;

      // 嘗試從快取取得
      const cached = await omniCache.get('resonance_field', cacheKey);
      if (cached) {
        omniLogger.debug(LogCategory.BUSINESS, '[MCP] 共鳴場查詢命中快取', { cacheKey });
        return cached;
      }

      // 實作真實的共振場查詢邏輯
      const resonanceData = omniCircle.queryByResonance(crystalId);
      const globalLevel = omniCircle.getGlobalResonanceLevel();

      const result = {
        crystalId,
        resonance: globalLevel * 100,
        matchedCrystals: resonanceData.length,
        status: 'active',
        lastSync: new Date().toISOString(),
        details: resonanceData.map(c => ({
          uuid: c.uuid,
          resonance: c.resonance.resonanceLevel,
          domain: c.nature.domain
        }))
      };

      // 寫入快取
      await omniCache.set('resonance_field', cacheKey, result);

      omniLogger.info(LogCategory.BUSINESS, `[MCP] 獲取共鳴場完成: ${crystalId}`);
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 獲取共振場失敗', { error });
      throw error;
    }
  }

  /**
   * 格式化標籤
   */
  private async formatLabel(params: any): Promise<any> {
    try {
      const cacheKey = `label:${params.text}`;
      const cached = await omniCache.get('tag_mapping', cacheKey);
      if (cached) {
        return cached;
      }

      const { OmniI18nEngine } = await import('@/omni/core/OmniI18nEngine');
      const label = OmniI18nEngine.formatLabel(params.text);

      const result = { original: params.text, formatted: label };
      await omniCache.set('tag_mapping', cacheKey, result);

      omniLogger.info(LogCategory.BUSINESS, `[MCP] 標籤格式化完成: ${params.text} -> ${label}`);
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 格式化標籤失敗', { error });
      throw error;
    }
  }

  /**
   * 獲取系統狀態
   */
  private async getSystemStatus(): Promise<any> {
    try {
      const cacheKey = 'system_status';
      const cached = await omniCache.get('system_health', cacheKey);
      if (cached) {
        return cached;
      }

      const result = {
        status: 'running',
        version: '1.0.0',
        uptime: process.uptime(),
        tools: Array.from(this.tools.keys()),
        performanceStats: this.getPerformanceStats(),
        timestamp: new Date().toISOString(),
      };

      await omniCache.set('system_health', cacheKey, result);
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MCP] 獲取系統狀態失敗', { error });
      throw error;
    }
  }

  /**
   * 獲取所有工具
   */
  public getTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 獲取指定工具
   */
  public getTool(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  /**
   * 執行工具
   */
  public async executeTool(name: string, params: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    return await tool.handler(params);
  }

  /**
   * 性能監控包裝器（遵循 5T 協議）
   */
  private async withMonitoring<T>(
    toolName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      // 執行操作
      const result = await operation();

      // 記錄成功指標
      const duration = performance.now() - startTime;
      this.updatePerformanceStats(toolName, duration);

      // 5T: Tangible - 可感知的性能日誌
      omniLogger.debug(LogCategory.BUSINESS, `[MCP Performance] ${toolName}`, {
        duration: `${duration.toFixed(2)}ms`,
        source_origin: 'OmniCircleMCP.withMonitoring',
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      // 統一錯誤處理
      const duration = performance.now() - startTime;

      errorHandler.handle(error as Error, {
        metadata: {
          toolName,
          duration,
          category: ErrorCategory.EXTERNAL_SERVICE,
        },
      });

      omniLogger.error(LogCategory.SYSTEM, `[MCP Error] ${toolName} failed`, {
        error,
        duration: `${duration.toFixed(2)}ms`,
      });

      throw error;
    }
  }

  /**
   * 更新性能統計
   */
  private updatePerformanceStats(toolName: string, duration: number): void {
    const stats = this.performanceStats.get(toolName) || { count: 0, totalTime: 0 };
    stats.count++;
    stats.totalTime += duration;
    this.performanceStats.set(toolName, stats);
  }

  /**
   * 獲取性能統計
   */
  public getPerformanceStats(): Record<string, { count: number; avgTime: number }> {
    const result: Record<string, { count: number; avgTime: number }> = {};

    for (const [toolName, stats] of this.performanceStats.entries()) {
      result[toolName] = {
        count: stats.count,
        avgTime: parseFloat((stats.totalTime / stats.count).toFixed(2)),
      };
    }

    return result;
  }

  /**
   * 重置性能統計
   */
  public resetStats(): void {
    this.performanceStats.clear();
    omniLogger.info(LogCategory.SYSTEM, '[MCP] Performance stats reset');
  }

  /**
   * 獲取工具列表（MCP 協議格式）
   */
  public getToolList(): any[] {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }
}

// 導出單例
export const omniCircleMCP = new OmniCircleMCP();
