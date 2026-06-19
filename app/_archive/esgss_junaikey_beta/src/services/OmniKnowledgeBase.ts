/**
 * 🏛️ Omni Knowledge Base - 奧秘智庫
 * --------------------------------------------------
 * [核心] 統一知識管理中心
 * [功能] 知識採集、智能檢索、資產化管理
 * [整合] OmniLogger, OmniNote, OmniTable, OmniSync
 * [協議] 5T (Traceable, Trackable, Transparent, Trustworthy, Tangible)
 * 
 * @version 1.0.0
 * @date 2026-02-11
 * @philosophy 「知識即資產，學習即成長」
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { SystemError } from '../omni/infrastructure/errors/SystemError.js';
import { omniSupabase } from './OmniSupabase.js';
import type { LogEntry } from '../omni/infrastructure/logging/OmniLogger.js';
// import type { NoteData } from '@/store/useNoteSystem'; // Commenting out potentially missing or client-side only type
import { omniTableService } from './OmniTableService.js';
import { omniCache } from './OmniCacheService.js';
import type {
    OmniTableRecord,
    OmniTableConfig,
} from '../types/esg-go/omni-table.types.js';

// ==================== TYPE DEFINITIONS ====================

// Local definition for NoteData since it was imported from store
export interface NoteData {
    id: string;
    contextId: string;
    content: string;
    tags: string[];
    linkedLogIds?: string[];
    createdAt: number;
    updatedAt: number;
}


/**
 * 知識類別 (Knowledge Category)
 */
export enum KnowledgeCategory {
    ESG = 'ESG',                    // ESG 實踐知識
    TECHNICAL = 'technical',        // 技術知識
    INVESTIGATION = 'investigation', // 調查筆記
    INSIGHT = 'insight',            // AI 洞察
    PATTERN = 'pattern',            // 模式分析
    SOLUTION = 'solution',          // 解決方案
    BEST_PRACTICE = 'best_practice', // 最佳實踐
}

/**
 * 知識來源類型 (Knowledge Source Type)
 */
export enum KnowledgeSourceType {
    MANUAL = 'manual',              // 手動創建
    AUTO_LOG = 'auto_log',          // 從日誌自動提取
    AUTO_NOTE = 'auto_note',        // 從筆記自動同步
    AI_GENERATED = 'ai_generated',  // AI 生成
    EXTERNAL_API = 'external_api',  // 外部 API
}

/**
 * 知識狀態 (Knowledge Status)
 */
export enum KnowledgeStatus {
    DRAFT = 'draft',                // 草稿
    PUBLISHED = 'published',        // 已發布
    ARCHIVED = 'archived',          // 已歸檔
    UNDER_REVIEW = 'under_review',  // 審核中
}

/**
 * 🏷️ 奧秘標籤 (OmniTag)
 * 層級化、具備元數據的標籤系統
 */
export interface OmniTag {
    id: string;
    name: string;
    parent_id?: string;
    color?: string;
    description?: string;
    icon?: string;
}

/**
 * 🔮 奧秘晶體狀態 (OmniCrystal Status)
 */
export enum OmniCrystalStatus {
    DRAFT = 'draft',                // 初始狀態
    CRYSTALLIZING = 'crystallizing', // 正在固化（驗證中）
    CRYSTAL = 'crystal',            // 已固化為晶體（永恆資產）
}

/**
 * 🧠 奧秘永憶快照 (OmniMemory Snapshot)
 */
export interface MemorySnapshot {
    version: number;
    content: string;
    hash_lock: string;
    created_at: number;
}

// === 奧秘對象化 (Object-Based PKM) ===
export type OmniObjectType = 'PERSON' | 'PROJECT' | 'CONCEPT' | 'MEETING' | 'EVENT' | 'TASK' | 'MEMO';

/**
 * 知識條目 (Knowledge Entry)
 * 符合 5T 協議的知識記錄，整合 OmniTag, OmniMemory, OmniCrystal
 */
export interface KnowledgeEntry {
    // === 基本資訊 ===
    knowledge_id: string;           // [Traceable] UUID
    title: string;                  // [Tangible] 知識標題
    content: string;                // [Tangible] 知識內容（Markdown）
    category: KnowledgeCategory;    // [Transparent] 類別
    object_type?: OmniObjectType;   // [Phase 28] 對象類型

    // === 奧秘標籤 (OmniTag) ===
    omni_tags: OmniTag[];           // [Trackable] 
    tags: string[];                 // 傳統標籤（相容性）

    // === 來源追蹤 (5T: Traceable) ===
    source_type: KnowledgeSourceType;
    source_id?: string;             // 來源 ID（日誌ID/筆記ID）
    author_id: string;              // 作者 UUID

    // === 智能關聯 (Connectivity Graph) ===
    embedding_vector?: number[];     // 向量嵌入
    related_knowledge_ids: string[]; // 關聯知識 ID 陣列 (Outgoing Links)
    backlink_ids: string[];          // [Phase 28] 反向連結 ID 陣列 (Incoming Links)
    properties: Record<string, any>; // [Phase 28] 動態屬性 (Key-Value pairs)

    // === 品質與影響力 (5T: Transparent, Tangible) ===
    quality_score: number;          // 品質評分 (0-100)
    view_count: number;             // 瀏覽次數
    reference_count: number;        // 引用次數

    // === 奧秘永憶 (OmniMemory) ===
    hash_lock: string;              // [Trustworthy] SHA-256 hash
    version: number;                // 版本號
    history: MemorySnapshot[];      // 版本歷史快照

    // === 奧秘晶體 (OmniCrystal) ===
    crystal_status: OmniCrystalStatus; // 晶體化狀態
    is_asset: boolean;              // 是否已轉換為資產
    asset_value?: number;           // 資產估值
    verified_at?: number;           // 5T 驗證時間

    // === 時間追蹤 (5T: Trackable) ===
    created_at: number;             // 創建時間戳
    updated_at: number;             // 更新時間戳
    last_accessed_at?: number;      // 最後訪問時間

    // === 狀態管理 ===
    status: KnowledgeStatus;
}

/**
 * 知識查詢過濾器
 */
export interface KnowledgeQueryFilter {
    categories?: KnowledgeCategory[];
    tags?: string[];
    sourceTypes?: KnowledgeSourceType[];
    authorId?: string;
    dateRange?: {
        start: number;
        end: number;
    };
    minQualityScore?: number;
    status?: KnowledgeStatus[];
    searchQuery?: string;           // 關鍵字搜尋
}

/**
 * 知識搜尋結果
 */
export interface KnowledgeSearchResult extends KnowledgeEntry {
    relevanceScore: number;         // 相關度評分 (0-1)
    matchedFields: string[];        // 匹配的欄位
    highlightedContent?: string;    // 高亮內容片段
}

/**
 * RAG 搜尋請求
 */
export interface KnowledgeRAGRequest {
    query: string;
    filters?: KnowledgeQueryFilter;
    topK?: number;                  // 預設 5
    includeContext?: boolean;       // 是否包含關聯知識
}

/**
 * 從日誌擷取知識的請求
 */
export interface IngestFromLogRequest {
    logId: string;
    logMessage: string;             // 日誌訊息
    logCategory: string;            // 日誌類別
    errorStack?: string;            // 錯誤堆疊（可選）
    noteId: string;                 // 關聯的調查筆記 ID
    noteContent: string;            // 筆記內容
    isPattern: boolean;             // 是否為重複模式
    occurrenceCount: number;        // 發生次數
    category?: KnowledgeCategory;   // 知識類別（可選）
    customTitle?: string;           // 自訂標題（可選）
}

/**
 * 從筆記同步知識的請求
 */
export interface IngestFromNoteRequest {
    noteId: string;
    category?: KnowledgeCategory;
    customTags?: string[];
}

// ==================== CORE SERVICE ====================

/**
 * 奧秘智庫核心服務
 */
class OmniKnowledgeBase {
    private knowledgeCache: Map<string, KnowledgeEntry> = new Map();
    private isInitialized = false;
    private omniTableConfig: OmniTableConfig | null = null;

    /**
     * 初始化服務
     */
    public async initialize(config?: OmniTableConfig): Promise<void> {
        if (this.isInitialized) return;

        try {
            // 配置 OmniTable
            if (config) {
                this.omniTableConfig = config;
                omniTableService.configure(config);
            }

            // 載入快取（可選）
            await this.loadCache();

            this.isInitialized = true;
            omniLogger.info(LogCategory.SYSTEM, '🏛️ OmniKnowledgeBase initialized successfully');
        } catch (error: any) {
            throw SystemError.apiRequestFailed({
                message: `Knowledge ingestion failed: ${error.message}`,
                details: error
            });
        }
    }

    /**
     * 獲取單一知識條目
     */
    public async getKnowledge(knowledgeId: string): Promise<KnowledgeEntry | null> {
        return omniCache.getOrSet('knowledge', `item:${knowledgeId}`, async () => {
            // TODO: 如果快取沒有，從 OmniTable/Supabase 找
            return null;
        });
    }

    // ==================== CRUD OPERATIONS ====================

    /**
     * 創建知識條目（手動）
     */
    public async createKnowledge(params: {
        title: string;
        content: string;
        category: KnowledgeCategory;
        tags?: string[];
        authorId: string;
        objectType?: OmniObjectType;
        properties?: Record<string, any>;
    }): Promise<KnowledgeEntry> {
        const knowledgeId = this.generateKnowledgeId();
        const hashLock = this.calculateHashLock(params.content);

        const entry: KnowledgeEntry = {
            knowledge_id: knowledgeId,
            title: params.title,
            content: params.content,
            category: params.category,
            object_type: params.objectType,
            omni_tags: [], // 初始無奧秘標籤
            tags: params.tags || [],
            source_type: KnowledgeSourceType.MANUAL,
            author_id: params.authorId,
            related_knowledge_ids: [],
            backlink_ids: [],
            properties: params.properties || {},
            quality_score: 70, // 初始品質評分
            view_count: 0,
            reference_count: 0,
            hash_lock: hashLock,
            version: 1,
            history: [], // 初始無歷史
            crystal_status: OmniCrystalStatus.DRAFT,
            is_asset: false,
            created_at: Date.now(),
            updated_at: Date.now(),
            status: KnowledgeStatus.PUBLISHED,
        };

        // 儲存到 OmniTable
        await this.saveToTable(entry);

        // 更新快取
        this.knowledgeCache.set(knowledgeId, entry);

        // 自動建立關聯
        await this.autoLinkRelatedKnowledge(entry);

        omniLogger.info(LogCategory.DATA, '📚 Knowledge created', {
            knowledge_id: knowledgeId,
            category: params.category,
            tags: params.tags,
        });

        return entry;
    }

    /**
     * 從日誌擷取知識（自動）
     */
    public async ingestFromLog(request: IngestFromLogRequest): Promise<KnowledgeEntry> {
        const knowledgeId = this.generateKnowledgeId();
        const hashLock = this.calculateHashLock(request.noteContent);

        // 根據是否為模式決定標題和標籤
        const title = request.customTitle ||
            (request.isPattern
                ? `🔁 重複模式: ${request.logMessage}`
                : `⚠️ 錯誤案例: ${request.logMessage}`);

        const tags = request.isPattern
            ? ['模式知識', 'auto_generated', request.logCategory, `重複${request.occurrenceCount}次`]
            : ['案例知識', 'auto_generated', request.logCategory, '單次錯誤'];

        const entry: KnowledgeEntry = {
            knowledge_id: knowledgeId,
            title,
            content: request.noteContent,
            category: request.category || (request.isPattern ? KnowledgeCategory.PATTERN : KnowledgeCategory.INVESTIGATION),
            omni_tags: [],
            tags,
            source_type: KnowledgeSourceType.AUTO_LOG,
            source_id: request.logId,
            author_id: 'system',
            related_knowledge_ids: [request.noteId],
            backlink_ids: [],
            properties: {
                logCategory: request.logCategory,
                occurrenceCount: request.occurrenceCount,
                isPattern: request.isPattern
            },
            quality_score: request.isPattern ? 90 : 80, // 模式知識品質更高
            view_count: 0,
            reference_count: 0,
            hash_lock: hashLock,
            version: 1,
            history: [],
            crystal_status: request.isPattern ? OmniCrystalStatus.CRYSTALLIZING : OmniCrystalStatus.DRAFT,
            is_asset: false,
            created_at: Date.now(),
            updated_at: Date.now(),
            status: KnowledgeStatus.PUBLISHED,
        };

        await this.saveToTable(entry);
        this.knowledgeCache.set(knowledgeId, entry);
        await this.autoLinkRelatedKnowledge(entry);

        // --- Phase 4 Evolution: Automatic Crystallization ---
        // If it's a reinforced pattern or manually prioritized, crystallize immediately.
        if (request.isPattern && request.occurrenceCount >= 3) {
            omniLogger.info(LogCategory.DATA, `[OmniKnowledgeBase] High-resonance pattern detected (${request.occurrenceCount}), auto-crystallizing...`);
            await this.crystallize(knowledgeId);
        }

        omniLogger.info(LogCategory.DATA, '🔍 Knowledge ingested from log', {
            knowledge_id: knowledgeId,
            log_id: request.logId,
            is_pattern: request.isPattern,
            occurrence_count: request.occurrenceCount,
        });

        return entry;
    }

    /**
     * 從筆記同步知識（自動）
     */
    public async ingestFromNote(request: IngestFromNoteRequest, noteData: NoteData): Promise<KnowledgeEntry> {
        const knowledgeId = this.generateKnowledgeId();
        const hashLock = this.calculateHashLock(noteData.content);

        const entry: KnowledgeEntry = {
            knowledge_id: knowledgeId,
            title: `筆記: ${noteData.contextId}`,
            content: noteData.content,
            category: request.category || KnowledgeCategory.INSIGHT,
            omni_tags: [],
            tags: [...noteData.tags, ...(request.customTags || [])],
            source_type: KnowledgeSourceType.AUTO_NOTE,
            source_id: request.noteId,
            author_id: 'user',
            related_knowledge_ids: noteData.linkedLogIds || [],
            backlink_ids: [],
            properties: {
                noteId: request.noteId,
                contextId: noteData.contextId
            },
            quality_score: 75,
            view_count: 0,
            reference_count: 0,
            hash_lock: hashLock,
            version: 1,
            history: [],
            crystal_status: OmniCrystalStatus.DRAFT,
            is_asset: false,
            created_at: Date.now(),
            updated_at: Date.now(),
            status: KnowledgeStatus.PUBLISHED,
        };

        await this.saveToTable(entry);
        this.knowledgeCache.set(knowledgeId, entry);
        await this.autoLinkRelatedKnowledge(entry);

        omniLogger.info(LogCategory.DATA, '📝 Knowledge ingested from note', {
            knowledge_id: knowledgeId,
            note_id: request.noteId,
        });

        return entry;
    }

    /**
     * 更新知識內容
     */
    public async updateKnowledge(
        knowledgeId: string,
        updates: Partial<Pick<KnowledgeEntry, 'title' | 'content' | 'tags' | 'status'>>
    ): Promise<KnowledgeEntry> {
        const existing = await this.getKnowledge(knowledgeId);
        if (!existing) {
            throw SystemError.resourceNotFound({ id: knowledgeId, table: 'knowledge' });
        }

        // 建立永憶快照 (OmniMemory)
        const snapshot: MemorySnapshot = {
            version: existing.version,
            content: existing.content,
            hash_lock: existing.hash_lock,
            created_at: existing.updated_at,
        };

        // 更新歷史紀錄（最多保留 10 個版本）
        const newHistory = [snapshot, ...existing.history].slice(0, 10);

        // 計算新的 hash lock（如果內容更新）
        const newHashLock = updates.content
            ? this.calculateHashLock(updates.content)
            : existing.hash_lock;

        const updated: KnowledgeEntry = {
            ...existing,
            ...updates,
            hash_lock: newHashLock,
            version: existing.version + 1,
            history: newHistory,
            updated_at: Date.now(),
            // 如果內容變動，晶體化狀態重置為 DRAFT
            crystal_status: updates.content ? OmniCrystalStatus.DRAFT : existing.crystal_status,
        };

        await this.saveToTable(updated);
        this.knowledgeCache.set(knowledgeId, updated);

        omniLogger.info(LogCategory.DATA, '✏️ Knowledge updated', { knowledge_id: knowledgeId });

        return updated;
    }

    /**
     * 🔮 晶體化知識 (OmniCrystal)
     * 將知識固化為具備 5T 驗證的永恆資產
     */
    public async crystallize(knowledgeId: string): Promise<KnowledgeEntry> {
        const entry = await this.getKnowledge(knowledgeId);
        if (!entry) throw SystemError.resourceNotFound({ id: knowledgeId, table: 'knowledge' });

        if (entry.crystal_status === OmniCrystalStatus.CRYSTAL) {
            return entry;
        }

        // 執行 5T 深度驗證
        const isValid = this.verifyHashLock(entry);
        if (!isValid) {
            throw SystemError.validationFailed({
                message: `5T Integrity Check failed for ${knowledgeId}: Hash mismatch`,
                details: { knowledgeId, expected: entry.hash_lock }
            });
        }

        const crystallized: KnowledgeEntry = {
            ...entry,
            crystal_status: OmniCrystalStatus.CRYSTAL,
            is_asset: true,
            asset_value: entry.quality_score * 10, // 基礎價值演算法
            verified_at: Date.now(),
            updated_at: Date.now(),
        };

        await this.saveToTable(crystallized);
        this.knowledgeCache.set(knowledgeId, crystallized);

        omniLogger.info(LogCategory.DATA, '💎 Knowledge crystallized', {
            knowledge_id: knowledgeId,
            asset_value: crystallized.asset_value,
        });

        return crystallized;
    }

    /**
     * 🏷️ 為知識添加奧秘標籤 (OmniTag)
     */
    public async addOmniTag(knowledgeId: string, tag: OmniTag): Promise<KnowledgeEntry> {
        const entry = await this.getKnowledge(knowledgeId);
        if (!entry) throw SystemError.resourceNotFound({ id: knowledgeId, table: 'knowledge' });

        const hasTag = entry.omni_tags.some(t => t.id === tag.id);
        if (hasTag) return entry;

        const updated = await this.updateKnowledge(knowledgeId, {
            omni_tags: [...entry.omni_tags, tag]
        } as any);

        return updated;
    }

    /**
     * 歸檔知識
     */
    public async archiveKnowledge(knowledgeId: string): Promise<void> {
        await this.updateKnowledge(knowledgeId, { status: KnowledgeStatus.ARCHIVED });
        omniLogger.info(LogCategory.DATA, '📦 Knowledge archived', { knowledge_id: knowledgeId });
    }

    /**
     * 查詢知識（基礎過濾）
     */
    public async queryKnowledge(filter: KnowledgeQueryFilter, limit = 20): Promise<KnowledgeEntry[]> {
        // TODO: 實作 OmniTable 查詢
        // 目前從快取過濾
        let results = Array.from(this.knowledgeCache.values());

        if (filter.categories) {
            results = results.filter((k) => filter.categories!.includes(k.category));
        }

        if (filter.tags) {
            results = results.filter((k) =>
                filter.tags!.some((tag) => k.tags.includes(tag))
            );
        }

        if (filter.minQualityScore) {
            results = results.filter((k) => k.quality_score >= filter.minQualityScore!);
        }

        if (filter.status) {
            results = results.filter((k) => filter.status!.includes(k.status));
        }

        // 按更新時間排序
        results.sort((a, b) => b.updated_at - a.updated_at);

        return results.slice(0, limit);
    }

    // ==================== 5T PROTOCOL ====================

    /**
     * 計算 Hash Lock (Trustworthy)
     */
    private calculateHashLock(content: string): string {
        // 簡化版 hash（生產環境應使用 crypto.subtle）
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return `SHA256-${Math.abs(hash).toString(16).padStart(16, '0')}`;
    }

    /**
     * 驗證 Hash Lock
     */
    public verifyHashLock(entry: KnowledgeEntry): boolean {
        const calculatedHash = this.calculateHashLock(entry.content);
        return calculatedHash === entry.hash_lock;
    }

    // ==================== AUTO LINKING ====================

    /**
     * 自動建立關聯知識
     */
    private async autoLinkRelatedKnowledge(entry: KnowledgeEntry): Promise<void> {
        // 基於標籤的關聯
        const relatedByTags = await this.queryKnowledge({
            tags: entry.tags,
            status: [KnowledgeStatus.PUBLISHED],
        }, 10);

        for (const related of relatedByTags) {
            if (related.knowledge_id !== entry.knowledge_id) {
                if (!entry.related_knowledge_ids.includes(related.knowledge_id)) {
                    entry.related_knowledge_ids.push(related.knowledge_id);

                    // Add backlink to the related entry
                    related.backlink_ids.push(entry.knowledge_id);
                    await this.saveToTable(related);
                }
            }
        }

        omniLogger.debug(LogCategory.DATA, `Auto-linked ${entry.related_knowledge_ids.length} related knowledge`);
    }

    // ==================== HELPERS ====================

    /**
     * 生成知識 ID
     */
    private generateKnowledgeId(): string {
        return `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 儲存到 OmniTable
     */
    private async saveToTable(entry: KnowledgeEntry): Promise<void> {
        if (!this.omniTableConfig) {
            // 如果沒有 OmniTable 配置，我們使用 OmniSupabase 持久化
            await omniSupabase.saveOmniTableRow({
                id: entry.knowledge_id,
                tableId: 'knowledge',
                data: entry,
                metadata: {
                    createdAt: new Date(entry.created_at),
                    updatedAt: new Date(entry.updated_at),
                    knowledgeId: entry.knowledge_id
                }
            });
            return;
        }

        // TODO: 實作 OmniTable 儲存
        omniLogger.debug(LogCategory.SYNC, 'Knowledge saved to OmniTable', {
            knowledge_id: entry.knowledge_id,
        });
    }

    /**
     * 載入快取
     */
    private async loadCache(): Promise<void> {
        try {
            const stats = await omniSupabase.getStats();
            if (stats.knowledgeSynced > 0) {
                // 從 OmniSupabase 獲取最近的知識條目並填入快取
                // 這裡暫時依賴按需加載 (getKnowledge)，但在圓通架構中應有預讀機制
            }
            omniLogger.debug(LogCategory.SYSTEM, 'Knowledge cache checked via OmniSupabase');
        } catch (error) {
            omniLogger.warn(LogCategory.SYSTEM, 'Failed to load initial knowledge cache', { error });
        }
    }

    /**
     * 獲取統計資訊
     */
    public getStats(): {
        total: number;
        byCategory: Record<KnowledgeCategory, number>;
        byStatus: Record<KnowledgeStatus, number>;
        avgQualityScore: number;
    } {
        const entries = Array.from(this.knowledgeCache.values());

        const stats = {
            total: entries.length,
            byCategory: {} as Record<KnowledgeCategory, number>,
            byStatus: {} as Record<KnowledgeStatus, number>,
            avgQualityScore: 0,
        };

        entries.forEach((entry) => {
            stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
            stats.byStatus[entry.status] = (stats.byStatus[entry.status] || 0) + 1;
        });

        stats.avgQualityScore = entries.reduce((sum, e) => sum + e.quality_score, 0) / entries.length || 0;

        return stats;
    }
}

// ==================== SINGLETON INSTANCE ====================

export const omniKnowledgeBase = new OmniKnowledgeBase();
