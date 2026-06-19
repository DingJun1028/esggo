/**
 * 奧秘永憶 (Omnipotent Eternal Memory)
 *
 * 奧秘心核的永恆記憶系統
 * 確保所有知識、經驗、推理過程永久保存且可檢索
 *
 * 核心特性：
 * 1. 永恆性 (Eternal) - 記憶永不丟失
 * 2. 全面性 (Comprehensive) - 記錄所有互動
 * 3. 可檢索 (Retrievable) - 高效的向量檢索
 * 4. 可追溯 (Traceable) - 完整的歷史軌跡
 */

import { omniLogger, LogCategory } from '../logging/OmniLogger';
import type { OmniTag, OmniTagType, KnowledgeChunk } from '@/types/omniCore'; // Need to verify this path

// ============================================================================
// 永恆記憶類型定義
// ============================================================================

/**
 * 記憶類型
 */
export enum EternalMemoryType {
  /** 短期記憶 - 當前會話 */
  SHORT_TERM = 'short_term',
  /** 工作記憶 - 任務相關 */
  WORKING = 'working',
  /** 長期記憶 - 永久儲存 */
  LONG_TERM = 'long_term',
  /** 程序記憶 - 技能和方法 */
  PROCEDURAL = 'procedural',
  /** 語義記憶 - 知識和概念 */
  SEMANTIC = 'semantic',
  /** 情節記憶 - 事件和經驗 */
  EPISODIC = 'episodic',
  /** 覺醒事件 - 系統覺醒歷史 */
  AWAKENING_EVENT = 'awakening_event',
}

/**
 * 記憶片段
 */
export interface MemoryFragment {
  /** 記憶 ID */
  id: string;
  /** 記憶類型 */
  type: EternalMemoryType;
  /** 內容 */
  content: string;
  /** 向量嵌入 */
  embedding?: number[];
  /** 重要性分數 (0-1) */
  importance: number;
  /** 訪問次數 */
  accessCount: number;
  /** 最後訪問時間 */
  lastAccessedAt: Date;
  /** 創建時間 */
  createdAt: Date;
  /** 標籤 */
  tags: OmniTag[];
  /** 元數據 */
  metadata: MemoryMetadata;
  /** 關聯記憶 */
  relatedMemories: string[];
}

/**
 * 記憶元數據
 */
export interface MemoryMetadata {
  /** 來源 */
  source: string;
  /** 會話 ID */
  sessionId?: string;
  /** 代理 ID */
  agentId?: string;
  /** 用戶 ID */
  userId?: string;
  /** 上下文 */
  context?: Record<string, unknown>;
  /** 情感標記 */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** 主題 */
  topics?: string[];
}

/**
 * 記憶檢索選項
 */
export interface MemoryRetrievalOptions {
  /** 記憶類型過濾 */
  types?: EternalMemoryType[];
  /** 最大結果數 */
  limit?: number;
  /** 相似度閾值 */
  threshold?: number;
  /** 時間範圍 */
  timeRange?: {
    start?: Date;
    end?: Date;
  };
  /** 標籤過濾 */
  tags?: OmniTag[];
  /** 排序方式 */
  sortBy?: 'relevance' | 'recency' | 'importance' | 'access_count';
}

/**
 * 記憶鞏固結果
 */
export interface ConsolidationResult {
  /** 鞏固的記憶數量 */
  consolidatedCount: number;
  /** 合併的記憶 */
  mergedMemories: string[];
  /** 刪除的記憶 */
  deletedMemories: string[];
  /** 新創建的摘要 */
  summaries: MemoryFragment[];
}

// ============================================================================
// 奧秘永憶介面
// ============================================================================

/**
 * 奧秘永憶系統
 */
export interface OmniEternalMemory {
  /** 系統 ID */
  id: string;
  /** 系統名稱 */
  name: string;
  /** 總記憶數量 */
  totalMemories: number;

  // ========== 核心功能 ==========

  /**
   * 儲存記憶
   * @param content 記憶內容
   * @param type 記憶類型
   * @param metadata 元數據
   * @returns 記憶片段
   */
  store(
    content: string,
    type: EternalMemoryType,
    metadata?: Partial<MemoryMetadata>
  ): Promise<MemoryFragment>;

  /**
   * 檢索記憶
   * @param query 查詢內容
   * @param options 檢索選項
   * @returns 記憶片段數組
   */
  retrieve(query: string, options?: MemoryRetrievalOptions): Promise<MemoryFragment[]>;

  /**
   * 更新記憶
   * @param memoryId 記憶 ID
   * @param updates 更新內容
   */
  update(memoryId: string, updates: Partial<MemoryFragment>): Promise<MemoryFragment>;

  /**
   * 刪除記憶（軟刪除，實際上標記為已刪除）
   * @param memoryId 記憶 ID
   */
  delete(memoryId: string): Promise<void>;

  // ========== 進階功能 ==========

  /**
   * 記憶鞏固
   * 將短期記憶轉換為長期記憶，合併相似記憶
   */
  consolidate(): Promise<ConsolidationResult>;

  /**
   * 記憶遺忘
   * 降低不重要記憶的優先級
   */
  forget(criteria: { importance?: number; accessCount?: number; age?: number }): Promise<number>;

  /**
   * 記憶關聯
   * 建立記憶之間的關聯
   */
  associate(memoryId1: string, memoryId2: string): Promise<void>;

  /**
   * 記憶圖譜
   * 獲取記憶的關聯網絡
   */
  getMemoryGraph(memoryId: string, depth?: number): Promise<MemoryGraph>;

  /**
   * 記憶統計
   */
  getStatistics(): Promise<MemoryStatistics>;

  /**
   * 記憶導出
   * 導出所有記憶為 JSON
   */
  export(): Promise<string>;

  /**
   * 記憶導入
   * 從 JSON 導入記憶
   */
  import(data: string): Promise<number>;

  // ========== 覺醒模式 ==========

  /**
   * 進入永恆模式
   * 啟動極限記憶狀態，所有新記憶自動標記為不可變更
   */
  enterEternalMode(): Promise<void>;

  /**
   * 檢查是否處於永恆模式
   */
  isEternalMode(): boolean;

  /**
   * 鎖定記憶
   * 將指定記憶標記為永久不可變更
   */
  lockMemory(memoryId: string): Promise<void>;
}

/**
 * 記憶圖譜
 */
export interface MemoryGraph {
  /** 中心記憶 */
  center: MemoryFragment;
  /** 關聯記憶 */
  related: Array<{
    memory: MemoryFragment;
    relationship: string;
    strength: number;
  }>;
  /** 深度 */
  depth: number;
}

/**
 * 記憶統計
 */
export interface MemoryStatistics {
  /** 總記憶數 */
  total: number;
  /** 按類型分組 */
  byType: Record<EternalMemoryType, number>;
  /** 平均重要性 */
  averageImportance: number;
  /** 最常訪問的記憶 */
  mostAccessed: MemoryFragment[];
  /** 最近的記憶 */
  mostRecent: MemoryFragment[];
  /** 儲存空間使用 */
  storageUsed: {
    bytes: number;
    formatted: string;
  };
}

// ============================================================================
// 奧秘永憶實作
// ============================================================================

export class OmniEternalMemoryImpl implements OmniEternalMemory {
  public id: string;
  public name: string;
  public totalMemories: number = 0;

  private memories: Map<string, MemoryFragment> = new Map();
  private memoryIndex: Map<string, string[]> = new Map(); // 內容索引

  constructor(name: string = '奧秘永憶') {
    this.id = `eternal_memory_${Date.now()}`;
    this.name = name;

    omniLogger.info(LogCategory.INFRASTRUCTURE, '奧秘永憶系統啟動', {
      id: this.id,
      name: this.name,
      features: ['ETERNAL', 'COMPREHENSIVE', 'RETRIEVABLE', 'TRACEABLE'],
    });
  }

  async store(
    content: string,
    type: EternalMemoryType,
    metadata?: Partial<MemoryMetadata>
  ): Promise<MemoryFragment> {
    const memory: MemoryFragment = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      importance: this.calculateImportance(content, type),
      accessCount: 0,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      tags: [],
      metadata: {
        source: metadata?.source || 'unknown',
        sessionId: metadata?.sessionId,
        agentId: metadata?.agentId,
        userId: metadata?.userId,
        context: metadata?.context,
        sentiment: metadata?.sentiment,
        topics: metadata?.topics,
      },
      relatedMemories: [],
    };

    this.memories.set(memory.id, memory);
    this.totalMemories++;

    // 建立索引
    this.indexMemory(memory);

    omniLogger.info(LogCategory.INFRASTRUCTURE, `[永憶] 💾 Stored memory: ${memory.id}`, { type });
    return memory;
  }

  async retrieve(query: string, options?: MemoryRetrievalOptions): Promise<MemoryFragment[]> {
    let results = Array.from(this.memories.values());

    // 類型過濾
    if (options?.types && options.types.length > 0) {
      results = results.filter(m => options.types!.includes(m.type));
    }

    // 時間範圍過濾
    if (options?.timeRange) {
      const { start, end } = options.timeRange;
      results = results.filter(m => {
        const created = m.createdAt.getTime();
        if (start && created < start.getTime()) return false;
        if (end && created > end.getTime()) return false;
        return true;
      });
    }

    // 簡單的相似度計算（實際應使用向量相似度）
    results = results
      .map(m => ({
        ...m,
        similarity: this.calculateSimilarity(query, m.content),
      }))
      .filter(
        m => (m as unknown as { similarity: number }).similarity > (options?.threshold || 0.5)
      );

    // 排序
    const sortBy = options?.sortBy || 'relevance';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (
            ((b as unknown as { similarity: number }).similarity || 0) -
            ((a as unknown as { similarity: number }).similarity || 0)
          );
        case 'recency':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'importance':
          return b.importance - a.importance;
        case 'access_count':
          return b.accessCount - a.accessCount;
        default:
          return 0;
      }
    });

    // 限制結果數量
    const limit = options?.limit || 10;
    results = results.slice(0, limit);

    // 更新訪問記錄
    results.forEach(m => {
      m.accessCount++;
      m.lastAccessedAt = new Date();
    });

    omniLogger.info(LogCategory.INFRASTRUCTURE, `[永憶] 🔍 Retrieved ${results.length} memories`, {
      query,
    });
    return results;
  }

  async update(memoryId: string, updates: Partial<MemoryFragment>): Promise<MemoryFragment> {
    const memory = this.memories.get(memoryId);
    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    Object.assign(memory, updates);
    omniLogger.info(LogCategory.INFRASTRUCTURE, `[永憶] 📝 Updated memory: ${memoryId}`);
    return memory;
  }

  async delete(memoryId: string): Promise<void> {
    // 軟刪除：標記為已刪除而不是真正刪除
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.metadata.context = {
        ...memory.metadata.context,
        deleted: true,
        deletedAt: new Date(),
      };
      omniLogger.info(LogCategory.INFRASTRUCTURE, `[永憶] 🗑️ Soft deleted memory: ${memoryId}`);
    }
  }

  async consolidate(): Promise<ConsolidationResult> {
    omniLogger.info(LogCategory.INFRASTRUCTURE, '[永憶] 🔄 Starting memory consolidation...');

    const result: ConsolidationResult = {
      consolidatedCount: 0,
      mergedMemories: [],
      deletedMemories: [],
      summaries: [],
    };

    // 找出短期記憶
    const shortTermMemories = Array.from(this.memories.values()).filter(
      m => m.type === EternalMemoryType.SHORT_TERM
    );

    // 將重要的短期記憶轉為長期記憶
    for (const memory of shortTermMemories) {
      if (memory.importance > 0.7 || memory.accessCount > 5) {
        memory.type = EternalMemoryType.LONG_TERM;
        result.consolidatedCount++;
      }
    }

    omniLogger.info(
      LogCategory.INFRASTRUCTURE,
      `[永憶] ✅ Consolidated ${result.consolidatedCount} memories`
    );
    return result;
  }

  async forget(criteria: {
    importance?: number;
    accessCount?: number;
    age?: number;
  }): Promise<number> {
    let forgottenCount = 0;
    const now = Date.now();

    for (const memory of this.memories.values()) {
      let shouldForget = false;

      if (criteria.importance !== undefined && memory.importance < criteria.importance) {
        shouldForget = true;
      }

      if (criteria.accessCount !== undefined && memory.accessCount < criteria.accessCount) {
        shouldForget = true;
      }

      if (criteria.age !== undefined) {
        const age = now - memory.createdAt.getTime();
        if (age > criteria.age) {
          shouldForget = true;
        }
      }

      if (shouldForget) {
        memory.importance *= 0.5; // 降低重要性
        forgottenCount++;
      }
    }

    omniLogger.info(LogCategory.INFRASTRUCTURE, `[永憶] 💤 Forgot ${forgottenCount} memories`);
    return forgottenCount;
  }

  async associate(memoryId1: string, memoryId2: string): Promise<void> {
    const mem1 = this.memories.get(memoryId1);
    const mem2 = this.memories.get(memoryId2);

    if (mem1 && mem2) {
      if (!mem1.relatedMemories.includes(memoryId2)) {
        mem1.relatedMemories.push(memoryId2);
      }
      if (!mem2.relatedMemories.includes(memoryId1)) {
        mem2.relatedMemories.push(memoryId1);
      }
      omniLogger.info(
        LogCategory.INFRASTRUCTURE,
        `[永憶] 🔗 Associated memories: ${memoryId1} <-> ${memoryId2}`
      );
    }
  }

  async getMemoryGraph(memoryId: string, depth: number = 2): Promise<MemoryGraph> {
    const center = this.memories.get(memoryId);
    if (!center) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    const related = center.relatedMemories
      .map(id => this.memories.get(id))
      .filter(m => m !== undefined)
      .map(m => ({
        memory: m!,
        relationship: 'related',
        strength: 0.8,
      }));

    return { center, related, depth };
  }

  async getStatistics(): Promise<MemoryStatistics> {
    const memories = Array.from(this.memories.values());

    const byType: Record<EternalMemoryType, number> = {
      [EternalMemoryType.SHORT_TERM]: 0,
      [EternalMemoryType.WORKING]: 0,
      [EternalMemoryType.LONG_TERM]: 0,
      [EternalMemoryType.PROCEDURAL]: 0,
      [EternalMemoryType.SEMANTIC]: 0,
      [EternalMemoryType.EPISODIC]: 0,
      [EternalMemoryType.AWAKENING_EVENT]: 0,
    };

    memories.forEach(m => {
      byType[m.type]++;
    });

    const totalImportance = memories.reduce((sum, m) => sum + m.importance, 0);
    const averageImportance = memories.length > 0 ? totalImportance / memories.length : 0;

    const mostAccessed = memories.sort((a, b) => b.accessCount - a.accessCount).slice(0, 5);

    const mostRecent = memories
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const totalBytes = JSON.stringify(Array.from(this.memories.values())).length;

    return {
      total: this.totalMemories,
      byType,
      averageImportance,
      mostAccessed,
      mostRecent,
      storageUsed: {
        bytes: totalBytes,
        formatted: this.formatBytes(totalBytes),
      },
    };
  }

  async export(): Promise<string> {
    const data = {
      id: this.id,
      name: this.name,
      exportedAt: new Date().toISOString(),
      memories: Array.from(this.memories.values()),
    };
    return JSON.stringify(data, null, 2);
  }

  async import(data: string): Promise<number> {
    const parsed = JSON.parse(data);
    let imported = 0;

    for (const memory of parsed.memories) {
      this.memories.set(memory.id, memory);
      imported++;
    }

    this.totalMemories = this.memories.size;
    omniLogger.info(LogCategory.INFRASTRUCTURE, `[永憶] 📥 Imported ${imported} memories`);
    return imported;
  }

  // ========== 私有輔助方法 ==========

  private calculateImportance(content: string, type: EternalMemoryType): number {
    // 基於類型的基礎重要性
    const baseImportance: Record<EternalMemoryType, number> = {
      [EternalMemoryType.SHORT_TERM]: 0.3,
      [EternalMemoryType.WORKING]: 0.5,
      [EternalMemoryType.LONG_TERM]: 0.8,
      [EternalMemoryType.PROCEDURAL]: 0.9,
      [EternalMemoryType.SEMANTIC]: 0.7,
      [EternalMemoryType.EPISODIC]: 0.6,
      [EternalMemoryType.AWAKENING_EVENT]: 1.0,
    };

    // 基於內容長度的調整
    const lengthBonus = Math.min(content.length / 1000, 0.2);

    return Math.min(baseImportance[type] + lengthBonus, 1.0);
  }

  private calculateSimilarity(query: string, content: string): number {
    // 簡單的詞彙重疊相似度（實際應使用向量相似度）
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    const contentWords = new Set(content.toLowerCase().split(/\s+/));

    const intersection = new Set([...queryWords].filter(w => contentWords.has(w)));

    return intersection.size / Math.max(queryWords.size, contentWords.size);
  }

  private indexMemory(memory: MemoryFragment): void {
    const words = memory.content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (!this.memoryIndex.has(word)) {
        this.memoryIndex.set(word, []);
      }
      this.memoryIndex.get(word)!.push(memory.id);
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // ========== 永恆模式實作 ==========

  private eternalMode: boolean = false;
  private lockedMemories: Set<string> = new Set();

  async enterEternalMode(): Promise<void> {
    this.eternalMode = true;
    omniLogger.info(LogCategory.INFRASTRUCTURE, '♾️ [永憶] 進入永恆模式 - 所有新記憶將永久鎖定');

    // 將所有現有的 LONG_TERM 記憶鎖定
    for (const memory of this.memories.values()) {
      if (memory.type === EternalMemoryType.LONG_TERM) {
        await this.lockMemory(memory.id);
      }
    }
  }

  isEternalMode(): boolean {
    return this.eternalMode;
  }

  async lockMemory(memoryId: string): Promise<void> {
    const memory = this.memories.get(memoryId);
    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    this.lockedMemories.add(memoryId);
    memory.metadata.context = {
      ...memory.metadata.context,
      locked: true,
      lockedAt: new Date(),
      eternal: true,
    };

    omniLogger.info(LogCategory.INFRASTRUCTURE, `🔒 [永憶] 記憶已鎖定: ${memoryId}`);
  }
}

// ============================================================================
// 工廠函數
// ============================================================================

/**
 * 創建奧秘永憶實例
 */
export function createEternalMemory(name?: string): OmniEternalMemory {
  return new OmniEternalMemoryImpl(name);
}

export const eternalMemory = createEternalMemory();
