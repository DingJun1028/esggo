/**
 * OmniSupabase - 奧秘 Supabase 服務
 * 
 * 功能：
 * - 繼承迭代永續進化
 * - 與 OmniSpace、OmniTable 以及奧秘智庫相互加成
 * - 提供增強的數據持久化和同步能力
 */

import { getSupabase } from '@/lib/supabase';
import { omniCircle } from '@/core/OmniCircle';
import { omniKnowledgeBase, KnowledgeCategory } from '@/services/OmniKnowledgeBase';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { ICrystalDNA } from '@/types/omni-report.types';
import { SystemError } from '@/omni/infrastructure/errors/SystemError';

// OmniSpace 實體類型
export interface OmniSpaceEntity {
  id: string;
  type: 'insight' | 'knowledge' | 'crystal' | 'tag' | 'memory';
  data: any;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    syncedAt?: Date;
    version: number;
  };
}

// OmniTable 行類型
export interface OmniTableRow {
  id: string;
  tableId: string;
  data: any;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    crystalId?: string;
    knowledgeId?: string;
  };
}

// 奧秘智庫同步狀態
export interface KnowledgeSyncStatus {
  knowledgeId: string;
  synced: boolean;
  lastSyncAt?: Date;
  error?: string;
}

// OmniSupabase 配置
export interface OmniSupabaseConfig {
  enableAutoSync: boolean;
  syncInterval: number; // 毫秒
  enableEvolution: boolean;
  enableKnowledgeIntegration: boolean;
}

// 默認配置
const defaultConfig: OmniSupabaseConfig = {
  enableAutoSync: true,
  syncInterval: 60000, // 1 分鐘
  enableEvolution: true,
  enableKnowledgeIntegration: true,
};

/**
 * OmniSupabase 服務類
 * 
 * 核心特性：
 * 1. 繼承迭代永續進化 - 通過版本控制和增量更新實現
 * 2. OmniSpace 集成 - 實體數據的持久化和同步
 * 3. OmniTable 集成 - 表格數據的結構化存儲
 * 4. 奧秘智庫集成 - 知識的雙向同步
 */
export class OmniSupabase {
  private config: OmniSupabaseConfig;
  private syncIntervalId: any = null;
  private evolutionVersion: number = 1;

  constructor(config: Partial<OmniSupabaseConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    omniLogger.info(LogCategory.SYSTEM, '🌌 OmniSupabase Service Initialized');

    if (this.config.enableAutoSync) {
      this.startAutoSync();
    }
  }

  /**
   * 啟動自動同步
   */
  private startAutoSync(): void {
    this.syncIntervalId = setInterval(() => {
      this.syncAll();
    }, this.config.syncInterval);
    omniLogger.info(LogCategory.SYSTEM, `🔄 Auto sync started (interval: ${this.config.syncInterval}ms)`);
  }

  /**
   * 停止自動同步
   */
  public stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
      omniLogger.info(LogCategory.SYSTEM, '⏸️ Auto sync stopped');
    }
  }

  /**
   * 同步所有數據
   */
  public async syncAll(): Promise<void> {
    try {
      omniLogger.info(LogCategory.BUSINESS, '🔄 Starting full sync...');

      // 1. 同步 OmniSpace 實體
      await this.syncOmniSpaceEntities();

      // ==================== CRUD OPERATIONS ====================
      // 2. 同步 OmniTable 數據
      await this.syncOmniTableData();

      // 3. 同步奧秘智庫
      if (this.config.enableKnowledgeIntegration) {
        await this.syncKnowledgeBase();
      }

      // 4. 執行進化迭代
      if (this.config.enableEvolution) {
        await this.evolve();
      }

      omniLogger.info(LogCategory.BUSINESS, '✅ Full sync completed');
    } catch (error: any) {
      throw SystemError.apiRequestFailed({
        message: `Full sync failed: ${error.message}`,
        details: error
      });
    }
  }

  /**
   * 同步 OmniSpace 實體
   */
  private async syncOmniSpaceEntities(): Promise<void> {
    try {
      // 從 Supabase 獲取實體
      const { data: entities, error } = await getSupabase()
        .from('omni_space_entities')
        .select('*')
        .order('metadata->updatedAt', { ascending: false });

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to sync OmniSpace entities: ${error.message}`,
          details: error
        });
      }

      if (entities && entities.length > 0) {
        omniLogger.info(LogCategory.BUSINESS, `📦 Synced ${entities.length} OmniSpace entities`);
      }
    } catch (error: any) {
      throw SystemError.apiRequestFailed({
        message: `Failed to sync OmniSpace entities: ${error.message}`,
        details: error
      });
    }
  }

  /**
   * 獲取單一實體
   */
  public async getOmniSpaceEntity(id: string): Promise<OmniSpaceEntity | null> {
    try {
      const { data, error } = await getSupabase()
        .from('omni_space_entities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw SystemError.apiRequestFailed({
          message: `Failed to fetch OmniSpace entity ${id}: ${error.message}`,
          details: error
        });
      }

      return data as unknown as OmniSpaceEntity;
    } catch (error) {
      if (error instanceof SystemError) throw error;
      throw SystemError.apiRequestFailed({
        message: `Unexpected error fetching OmniSpace entity ${id}`,
        details: error
      });
    }
  }

  /**
   * 同步 OmniTable 數據
   */
  private async syncOmniTableData(): Promise<void> {
    try {
      // 從 Supabase 獲取表格數據
      const { data: tables, error } = await getSupabase()
        .from('omni_tables')
        .select('*');

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to sync OmniTable data: ${error.message}`,
          details: error
        });
      }

      if (tables && tables.length > 0) {
        omniLogger.info(LogCategory.BUSINESS, `📊 Synced ${tables.length} OmniTable data`);
      }
    } catch (error: any) {
      throw SystemError.apiRequestFailed({
        message: `Failed to sync OmniTable data: ${error.message}`,
        details: error
      });
    }
  }

  /**
   * 同步奧秘智庫
   */
  private async syncKnowledgeBase(): Promise<void> {
    try {
      // 從 Supabase 獲取知識同步狀態
      const { data: syncStatus, error } = await getSupabase()
        .from('knowledge_sync_status')
        .select('*');

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to sync knowledge base status: ${error.message}`,
          details: error
        });
      }

      if (syncStatus && syncStatus.length > 0) {
        omniLogger.info(LogCategory.BUSINESS, `🧠 Synced ${syncStatus.length} knowledge items`);
      }
    } catch (error: any) {
      throw SystemError.apiRequestFailed({
        message: `Failed to sync knowledge base: ${error.message}`,
        details: error
      });
    }
  }

  /**
   * 進化迭代 - 永續進化
   */
  private async evolve(): Promise<void> {
    try {
      this.evolutionVersion++;

      // 記錄進化版本
      const { error } = await getSupabase()
        .from('omni_evolution_log')
        .insert({
          version: this.evolutionVersion,
          timestamp: new Date().toISOString(),
          changes: JSON.stringify({
            type: 'auto_evolution',
            description: 'Automatic evolution iteration',
          }),
        });

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to record evolution log: ${error.message}`,
          details: error,
          version: this.evolutionVersion
        });
      }

      omniLogger.info(LogCategory.BUSINESS, `🧬 Evolution completed (version: ${this.evolutionVersion})`);
    } catch (error: any) {
      throw SystemError.apiRequestFailed({
        message: `Evolution failed: ${error.message}`,
        details: error,
        version: this.evolutionVersion
      });
    }
  }

  /**
   * 保存 OmniSpace 實體
   */
  public async saveOmniSpaceEntity(entity: OmniSpaceEntity): Promise<string> {
    try {
      const { data, error } = await getSupabase()
        .from('omni_space_entities')
        .upsert({
          id: entity.id,
          type: entity.type,
          data: entity.data,
          metadata: entity.metadata,
        })
        .select('id')
        .single();

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to save OmniSpace entity: ${error.message}`,
          details: error,
          entityId: entity.id
        });
      }

      omniLogger.info(LogCategory.BUSINESS, `💾 Saved OmniSpace entity: ${entity.id}`);
      return data.id;
    } catch (error) {
      if (error instanceof SystemError) throw error;
      omniLogger.error(LogCategory.SYSTEM, 'Failed to save OmniSpace entity', { error });
      throw SystemError.apiRequestFailed({
        message: 'Unexpected error saving OmniSpace entity',
        details: error,
        entityId: entity.id
      });
    }
  }

  /**
   * 保存 OmniTable 行
   */
  public async saveOmniTableRow(row: OmniTableRow): Promise<string> {
    try {
      const { data, error } = await getSupabase()
        .from('omni_table_rows')
        .upsert({
          id: row.id,
          table_id: row.tableId,
          data: row.data,
          metadata: row.metadata,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      omniLogger.info(LogCategory.BUSINESS, `💾 Saved OmniTable row: ${row.id}`);
      return data.id;
    } catch (error) {
      if (error instanceof SystemError) throw error;
      omniLogger.error(LogCategory.SYSTEM, 'Failed to save OmniTable row', { error });
      throw SystemError.apiRequestFailed({
        message: 'Unexpected error saving OmniTable row',
        details: error,
        rowId: row.id
      });
    }
  }

  /**
   * 同步知識到奧秘智庫
   */
  public async syncKnowledgeToBase(knowledgeId: string): Promise<KnowledgeSyncStatus> {
    try {
      // 從 Supabase 獲取知識數據
      const { data: knowledge, error } = await getSupabase()
        .from('knowledge')
        .select('*')
        .eq('id', knowledgeId)
        .single();

      if (error) {
        throw error;
      }

      // 同步到奧秘智庫
      const syncedKnowledge = await omniKnowledgeBase.createKnowledge({
        title: knowledge.title,
        content: knowledge.content,
        category: knowledge.category as KnowledgeCategory,
        tags: knowledge.tags,
        authorId: knowledge.author_id,
      });

      // 更新同步狀態
      const { error: updateError } = await getSupabase()
        .from('knowledge_sync_status')
        .upsert({
          knowledge_id: knowledgeId,
          synced: true,
          last_sync_at: new Date().toISOString(),
        });

      if (updateError) {
        throw SystemError.apiRequestFailed({
          message: `Failed to update knowledge sync status: ${updateError.message}`,
          details: updateError,
          knowledgeId
        });
      }

      omniLogger.info(LogCategory.BUSINESS, `🧠 Synced knowledge to base: ${knowledgeId}`);

      return {
        knowledgeId,
        synced: true,
        lastSyncAt: new Date(),
      };
    } catch (error) {
      if (error instanceof SystemError) throw error;
      omniLogger.error(LogCategory.SYSTEM, 'Failed to sync knowledge to base', { error });

      throw SystemError.apiRequestFailed({
        message: 'Unexpected error during knowledge sync to base',
        details: error,
        knowledgeId
      });
    }
  }

  /**
   * 從奧秘智庫同步知識
   */
  public async syncKnowledgeFromBase(knowledgeId: string): Promise<void> {
    try {
      // 從奧秘智庫獲取知識
      const knowledge = await omniKnowledgeBase.getKnowledge(knowledgeId);

      if (!knowledge) {
        throw SystemError.resourceNotFound({ id: knowledgeId, table: 'knowledge_base' });
      }

      // 保存到 Supabase
      const { error } = await getSupabase()
        .from('knowledge')
        .upsert({
          id: knowledge.knowledge_id,
          title: knowledge.title,
          content: knowledge.content,
          category: knowledge.category,
          tags: knowledge.tags,
          author_id: knowledge.author_id,
          created_at: new Date(knowledge.created_at).toISOString(),
          updated_at: new Date(knowledge.updated_at).toISOString(),
        });

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to save synced knowledge: ${error.message}`,
          details: error,
          knowledgeId
        });
      }

      omniLogger.info(LogCategory.BUSINESS, `🧠 Synced knowledge from base: ${knowledgeId}`);
    } catch (error) {
      if (error instanceof SystemError) throw error;
      omniLogger.error(LogCategory.SYSTEM, 'Failed to sync knowledge from base', { error });
      throw SystemError.apiRequestFailed({
        message: 'Unexpected error during knowledge sync',
        details: error,
        knowledgeId
      });
    }
  }

  /**
   * 創建晶體並同步
   */
  public async createAndSyncCrystal(crystal: ICrystalDNA): Promise<string> {
    try {
      // 1. 保存到 OmniSpace
      const entityId = await this.saveOmniSpaceEntity({
        id: crystal.uuid,
        type: 'crystal',
        data: crystal,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
        },
      });

      // 2. 如果有關聯的知識，同步到奧秘智庫
      if (this.config.enableKnowledgeIntegration && crystal.payload.tangibleLabel) {
        const knowledge = await omniKnowledgeBase.createKnowledge({
          title: `${crystal.payload.tangibleLabel}: ${crystal.nature.intent}`,
          content: crystal.payload.narrative,
          category: KnowledgeCategory.INSIGHT,
          tags: [...crystal.nature.dnaMarkers, crystal.payload.tangibleLabel],
          authorId: 'OmniSupabase',
        });

        // 關聯知識 ID
        const { error } = await getSupabase()
          .from('crystal_knowledge_mapping')
          .insert({
            crystal_id: crystal.uuid,
            knowledge_id: knowledge.knowledge_id,
            created_at: new Date().toISOString(),
          });

        if (error) {
          throw SystemError.apiRequestFailed({
            message: `Failed to create crystal-knowledge mapping: ${error.message}`,
            details: error,
            crystalId: crystal.uuid,
            knowledgeId: knowledge.knowledge_id
          });
        }
      }

      omniLogger.info(LogCategory.BUSINESS, `💎 Created and synced crystal: ${crystal.uuid}`);
      return entityId;
    } catch (error) {
      if (error instanceof SystemError) throw error;
      omniLogger.error(LogCategory.SYSTEM, 'Failed to create and sync crystal', { error });
      throw SystemError.apiRequestFailed({
        message: 'Unexpected error during crystal creation and sync',
        details: error,
        crystalId: crystal.uuid
      });
    }
  }

  /**
   * 獲取進化版本
   */
  public getEvolutionVersion(): number {
    return this.evolutionVersion;
  }

  /**
   * 獲取配置
   */
  public getConfig(): OmniSupabaseConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<OmniSupabaseConfig>): void {
    this.config = { ...this.config, ...config };

    // 重啟自動同步
    if (this.config.enableAutoSync && !this.syncIntervalId) {
      this.startAutoSync();
    } else if (!this.config.enableAutoSync && this.syncIntervalId) {
      this.stopAutoSync();
    }

    omniLogger.info(LogCategory.SYSTEM, '⚙️ Config updated');
  }

  /**
   * 獲取統計信息
   */
  public async getStats(): Promise<{
    omniSpaceEntities: number;
    omniTableRows: number;
    knowledgeSynced: number;
    evolutionVersion: number;
  }> {
    try {
      const [entitiesCount, rowsCount, knowledgeCount] = await Promise.all([
        getSupabase()
          .from('omni_space_entities')
          .select('*', { count: 'exact', head: true }),
        getSupabase()
          .from('omni_table_rows')
          .select('*', { count: 'exact', head: true }),
        getSupabase()
          .from('knowledge_sync_status')
          .select('*', { count: 'exact', head: true }),
      ]);

      return {
        omniSpaceEntities: entitiesCount.count || 0,
        omniTableRows: rowsCount.count || 0,
        knowledgeSynced: knowledgeCount.count || 0,
        evolutionVersion: this.evolutionVersion,
      };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to get stats', { error });
      return {
        omniSpaceEntities: 0,
        omniTableRows: 0,
        knowledgeSynced: 0,
        evolutionVersion: this.evolutionVersion,
      };
    }
  }
}

// 導出單例
export const omniSupabase = new OmniSupabase();
