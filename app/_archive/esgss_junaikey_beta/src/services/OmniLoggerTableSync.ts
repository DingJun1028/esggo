/**
 * 🔄 OmniLogger Table Sync Service
 * --------------------------------------------------
 * 功能: 將奧秘日誌系統整合到 OmniTable，實現結構化存儲與可視化查詢
 * 整合: OmniSync (跨平台同步) + OmniNote (錯誤調查筆記)
 * 協議: 5T Protocol (Traceable, Trackable, Transparent, Trustworthy, Tangible)
 * 
 * @version 1.0.0
 * @date 2026-02-11
 * @philosophy OmniCircle (奧秘圓通) - 服務即教學，知識即資產
 */

import { omniLogger, LogLevel, LogCategory, type LogEntry } from '@/omni/infrastructure/logging/OmniLogger';
import { omniSyncService, OmniSyncEventType } from '@/services/OmniSyncService';
import { useNoteSystem } from '@/store/useNoteSystem';
import { omniKnowledgeBase, KnowledgeCategory, KnowledgeSourceType } from '@/services/OmniKnowledgeBase';
import type {
    OmniTableConfig,
    OmniTableRecord,
    OmniTableRecordResponse,
} from '@/types/esg-go/omni-table.types';

// ==========================================
// Type Definitions
// ==========================================

export interface OmniTableLogRecord {
    log_id: string;                    // 🟢 Traceable: 唯一日誌 ID
    timestamp: string;                 // 🔵 Trackable: ISO 時間戳
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'; // 🟠 Tangible: 嚴重程度
    category: string;                  // 🟠 Tangible: 日誌分類
    message: string;                   // 🟠 Tangible: 日誌訊息
    source_origin: string;             // 🟢 Traceable: 來源標記
    trace_id: string;                  // 🔵 Trackable: 請求追踪 ID
    formula_ref?: string;              // 🟡 Transparent: 算法引用
    hash_lock: string;                 // 🔴 Trustworthy: 雜湊鎖定
    metadata_json?: string;            // 元數據 JSON
    stack_trace?: string;              // 堆疊追踪
    user_agent?: string;               // 使用者代理
    url?: string;                      // 請求 URL
    sync_status: 'synced' | 'pending' | 'failed'; // 同步狀態
    note_id?: string;                  // 關聯筆記 ID
    note_url?: string;                 // 筆記深度連結
}

export interface SyncConfig {
    batchSize: number;                 // 批量大小
    batchIntervalMs: number;           // 批量觸發間隔
    enableRealtimeSync: boolean;       // 啟用即時同步
    realtimeLevels: LogLevel[];        // 即時同步級別
    enableAutoNote: boolean;           // 自動創建調查筆記
    autoNoteLevels: LogLevel[];        // 自動筆記級別
    maxRetries: number;                // 最大重試次數
    retryDelayMs: number;              // 重試延遲
    // 🏛️ 奧秘智庫整合
    enableKnowledgeIngest: boolean;    // 自動萃取錯誤知識
    knowledgeIngestLevels: LogLevel[]; // 儲存為知識的日誌級別
    minOccurrencesForPattern: number;  // 最少重複次數才儲存為模式知識
}

export interface SyncStats {
    totalSynced: number;               // 總同步數
    pendingCount: number;              // 待同步數
    failedCount: number;               // 失敗數
    lastSyncTime?: number;             // 最後同步時間
    lastError?: string;                // 最後錯誤
}

// ==========================================
// OmniLogger Table Sync Service
// ==========================================

export class OmniLoggerTableSync {
    private omniTableService: any; // 動態導入
    private pendingLogs: LogEntry[] = [];
    private syncInterval?: NodeJS.Timeout;
    private isInitialized = false;

    private config: SyncConfig = {
        batchSize: 10,
        batchIntervalMs: 30000, // 30 秒
        enableRealtimeSync: true,
        realtimeLevels: [LogLevel.ERROR, LogLevel.CRITICAL],
        enableAutoNote: true,
        autoNoteLevels: [LogLevel.ERROR, LogLevel.CRITICAL],
        maxRetries: 3,
        retryDelayMs: 2000,
        // 🏛️ 奧秘智庫整合
        enableKnowledgeIngest: true,
        knowledgeIngestLevels: [LogLevel.ERROR, LogLevel.CRITICAL],
        minOccurrencesForPattern: 3, // 至少重複 3 次才視為模式
    };

    private stats: SyncStats = {
        totalSynced: 0,
        pendingCount: 0,
        failedCount: 0,
    };

    constructor(
        private omniTableConfig: OmniTableConfig,
        customConfig?: Partial<SyncConfig>
    ) {
        if (customConfig) {
            this.config = { ...this.config, ...customConfig };
        }
    }

    /**
     * 初始化服務
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // 動態導入 OmniTableService (class導出而非default)
            const { omniTableService: existingInstance } = await import('@/services/OmniTableService');
            this.omniTableService = existingInstance;
            this.omniTableService.configure(this.omniTableConfig);

            // 啟動批量同步定時器
            this.startBatchSyncTimer();

            // 監聽頁面卸載事件
            if (typeof window !== 'undefined') {
                window.addEventListener('beforeunload', () => {
                    this.flushPendingLogs();
                });
            }

            this.isInitialized = true;
            omniLogger.info(LogCategory.SYNC, '🔄 OmniLoggerTableSync initialized successfully');
        } catch (error) {
            omniLogger.error(LogCategory.SYNC, 'Failed to initialize OmniLoggerTableSync', { error });
            throw error;
        }
    }

    /**
     * 同步單條日誌到 OmniTable
     */
    public async syncLogToTable(log: LogEntry): Promise<void> {
        if (!this.isInitialized) {
            omniLogger.warn(LogCategory.SYNC, 'OmniLoggerTableSync not initialized, queueing log');
            this.pendingLogs.push(log);
            return;
        }

        const shouldSyncRealtime = this.config.enableRealtimeSync &&
            this.config.realtimeLevels.includes(log.level as LogLevel);

        if (shouldSyncRealtime) {
            // 即時同步
            await this.syncSingleLog(log);

            // 廣播關鍵日誌事件
            if (log.level === LogLevel.CRITICAL) {
                omniSyncService.broadcast(OmniSyncEventType.CRITICAL_LOG_RECEIVED, {
                    log_id: log.id,
                    message: log.message,
                    timestamp: log.timestamp,
                    level: log.level,
                });
            }

            // 自動創建調查筆記
            if (this.config.enableAutoNote && this.config.autoNoteLevels.includes(log.level as LogLevel)) {
                await this.createInvestigationNote(log);
            }
        } else {
            // 加入批量佇列
            this.pendingLogs.push(log);
            this.stats.pendingCount = this.pendingLogs.length;

            // 如果達到批量大小，立即同步
            if (this.pendingLogs.length >= this.config.batchSize) {
                await this.batchSyncLogs();
            }
        }
    }

    /**
     * 批量同步日誌
     */
    public async batchSyncLogs(): Promise<void> {
        if (this.pendingLogs.length === 0) return;

        const logsToSync = [...this.pendingLogs];
        this.pendingLogs = [];

        omniLogger.info(LogCategory.SYNC, `🔄 Batch syncing ${logsToSync.length} logs to OmniTable`);
        omniSyncService.broadcast(OmniSyncEventType.LOG_SYNC_STARTED, {
            count: logsToSync.length,
            timestamp: Date.now(),
        });

        try {
            const records = logsToSync.map(log => this.convertLogToTableRecord(log));

            // 使用 OmniTableService 批量創建記錄
            await this.omniTableService.createRecords(records);

            this.stats.totalSynced += logsToSync.length;
            this.stats.lastSyncTime = Date.now();
            this.stats.pendingCount = this.pendingLogs.length;

            omniLogger.info(LogCategory.SYNC, `✅ Successfully synced ${logsToSync.length} logs`);
            omniSyncService.broadcast(OmniSyncEventType.LOG_SYNC_COMPLETED, {
                count: logsToSync.length,
                totalSynced: this.stats.totalSynced,
            });
        } catch (error) {
            this.stats.failedCount += logsToSync.length;
            this.stats.lastError = (error as Error).message;

            // 重新加入佇列以便重試
            this.pendingLogs.unshift(...logsToSync);

            omniLogger.error(LogCategory.SYNC, '❌ Failed to sync logs to OmniTable', { error });
            omniSyncService.broadcast(OmniSyncEventType.LOG_SYNC_FAILED, {
                count: logsToSync.length,
                error: (error as Error).message,
            });
        }
    }

    /**
     * 同步單條日誌（帶重試機制）
     */
    private async syncSingleLog(log: LogEntry, retryCount = 0): Promise<void> {
        try {
            const record = this.convertLogToTableRecord(log);
            await this.omniTableService.createRecord(record);

            this.stats.totalSynced++;
            this.stats.lastSyncTime = Date.now();

            omniLogger.info(LogCategory.SYNC, `✅ Synced ${log.level} log to OmniTable`, {
                log_id: log.id,
            });
        } catch (error) {
            if (retryCount < this.config.maxRetries) {
                const delay = this.config.retryDelayMs * (retryCount + 1);
                omniLogger.warn(LogCategory.SYNC, `Retrying log sync (${retryCount + 1}/${this.config.maxRetries})`, {
                    log_id: log.id,
                    delay,
                });

                await this.sleep(delay);
                return this.syncSingleLog(log, retryCount + 1);
            }

            this.stats.failedCount++;
            this.stats.lastError = (error as Error).message;

            omniLogger.error(LogCategory.SYNC, '❌ Failed to sync log after retries', {
                log_id: log.id,
                error,
            });
        }
    }

    /**
     * 轉換日誌為 OmniTable 記錄
     */
    private convertLogToTableRecord(log: LogEntry): Partial<OmniTableLogRecord> {
        // 計算 Hash Lock (使用 SHA-256 模擬)
        const hashLock = this.calculateHashLock(log);

        return {
            log_id: log.id,
            timestamp: new Date(log.timestamp).toISOString(),
            level: log.level as OmniTableLogRecord['level'],
            category: log.category,
            message: log.message,
            source_origin: log.source_origin,
            trace_id: log.trace_id,
            formula_ref: log.formula_ref,
            hash_lock: hashLock,
            metadata_json: log.metadata ? JSON.stringify(log.metadata) : undefined,
            stack_trace: log.stack,
            user_agent: log.userAgent,
            url: log.url,
            sync_status: 'synced',
        };
    }

    /**
     * 計算 Hash Lock (確保日誌不可篡改)
     */
    private calculateHashLock(log: LogEntry): string {
        const data = JSON.stringify({
            id: log.id,
            timestamp: log.timestamp,
            level: log.level,
            message: log.message,
            source_origin: log.source_origin,
        });

        // 使用簡單的 hash 算法 (生產環境應使用 crypto.subtle.digest)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return `HASH_${Math.abs(hash).toString(16).toUpperCase()}`;
    }

    /**
     * 創建錯誤調查筆記
     */
    private async createInvestigationNote(log: LogEntry): Promise<void> {
        try {
            const {
                createErrorInvestigationNote,
                createPatternAnalysisNote,
            } = await import('../templates/logNoteTemplates');
            const noteContent = createErrorInvestigationNote(log);
            const contextId = `${log.level}-LOG-${log.id}`;

            // 保存到 OmniNote 系統
            const noteSystem = useNoteSystem.getState();
            noteSystem.saveNote(contextId, noteContent);

            // 更新日誌記錄以包含筆記連結
            const noteId = noteSystem.getNote(contextId)?.id;
            if (noteId) {
                // TODO: 更新 OmniTable 記錄的 note_id 欄位
                omniLogger.info(LogCategory.SYNC, `📝 Created investigation note for ${log.level} log`, {
                    log_id: log.id,
                    note_id: noteId,
                    contextId,
                });

                // 🏛️ 自動萃取錯誤知識到奧秘智庫
                if (this.config.enableKnowledgeIngest && this.config.knowledgeIngestLevels.includes(log.level as LogLevel)) {
                    await this.ingestErrorKnowledge(log, noteId, noteContent);
                }
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYNC, 'Failed to create investigation note', {
                log_id: log.id,
                error,
            });
        }
    }

    /**
     * 🏛️ 萃取錯誤知識到奧秘智庫
     */
    private async ingestErrorKnowledge(log: LogEntry, noteId: string, noteContent: string): Promise<void> {
        try {
            // 檢查是否為重複錯誤模式
            const similarLogs = await this.queryLogs({
                level: log.level as LogLevel,
                category: log.category as LogCategory,
            });

            const isPattern = similarLogs.length >= this.config.minOccurrencesForPattern;

            const knowledgeEntry = await omniKnowledgeBase.ingestFromLog({
                logId: log.id,
                logMessage: log.message,
                logCategory: log.category,
                errorStack: log.stack,
                noteId,
                noteContent,
                isPattern,
                occurrenceCount: similarLogs.length,
            });

            omniLogger.info(LogCategory.SYNC, `🏛️ Ingested error knowledge to OmniKnowledgeBase`, {
                log_id: log.id,
                knowledge_id: knowledgeEntry.knowledge_id,
                is_pattern: isPattern,
                occurrence_count: similarLogs.length,
            });

            // 更新筆記為知識資產
            const noteSystem = useNoteSystem.getState();
            const note = noteSystem.getNote(noteId);
            if (note) {
                noteSystem.saveNote(noteId, note.content, {
                    ...note,
                    isKnowledgeAsset: true,
                    knowledgeId: knowledgeEntry.knowledge_id,
                    qualityScore: knowledgeEntry.quality_score,
                    knowledgeCategory: knowledgeEntry.category,
                });
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYNC, 'Failed to ingest error knowledge', {
                log_id: log.id,
                error,
            });
        }
    }

    /**
     * 查詢 OmniTable 日誌
     */
    public async queryLogs(filter?: {
        level?: LogLevel;
        category?: LogCategory;
        trace_id?: string;
        startTime?: number;
        endTime?: number;
    }): Promise<OmniTableLogRecord[]> {
        if (!this.isInitialized) {
            throw new Error('OmniLoggerTableSync not initialized');
        }

        try {
            // 構建過濾條件
            const filterFormula = this.buildFilterFormula(filter);

            const response = await this.omniTableService.listRecords({
                filterByFormula: filterFormula,
                sort: [{ field: 'timestamp', order: 'desc' }],
            });

            return response.records.map((record: any) => record.fields as OmniTableLogRecord);
        } catch (error) {
            omniLogger.error(LogCategory.SYNC, 'Failed to query logs from OmniTable', { error });
            throw error;
        }
    }

    /**
     * 構建過濾公式
     */
    private buildFilterFormula(filter?: {
        level?: LogLevel;
        category?: LogCategory;
        trace_id?: string;
        startTime?: number;
        endTime?: number;
    }): string | undefined {
        if (!filter) return undefined;

        const conditions: string[] = [];

        if (filter.level) {
            conditions.push(`{level} = "${filter.level}"`);
        }
        if (filter.category) {
            conditions.push(`{category} = "${filter.category}"`);
        }
        if (filter.trace_id) {
            conditions.push(`{trace_id} = "${filter.trace_id}"`);
        }
        if (filter.startTime) {
            conditions.push(`{timestamp} >= "${new Date(filter.startTime).toISOString()}"`);
        }
        if (filter.endTime) {
            conditions.push(`{timestamp} <= "${new Date(filter.endTime).toISOString()}"`);
        }

        return conditions.length > 0 ? `AND(${conditions.join(', ')})` : undefined;
    }

    /**
     * 啟動批量同步定時器
     */
    private startBatchSyncTimer(): void {
        this.syncInterval = setInterval(() => {
            if (this.pendingLogs.length > 0) {
                this.batchSyncLogs();
            }
        }, this.config.batchIntervalMs);
    }

    /**
     * 清空待同步日誌（頁面卸載時調用）
     */
    public async flushPendingLogs(): Promise<void> {
        if (this.pendingLogs.length > 0) {
            await this.batchSyncLogs();
        }
    }

    /**
     * 獲取同步統計
     */
    public getStats(): SyncStats {
        return { ...this.stats };
    }

    /**
     * 銷毀服務
     */
    public destroy(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        this.flushPendingLogs();
        this.isInitialized = false;
    }

    /**
     * 輔助函數：延遲
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==========================================
// 導出單例實例 (可選)
// ==========================================

let syncServiceInstance: OmniLoggerTableSync | null = null;

export function initializeLogTableSync(config: OmniTableConfig, syncConfig?: Partial<SyncConfig>): OmniLoggerTableSync {
    if (!syncServiceInstance) {
        syncServiceInstance = new OmniLoggerTableSync(config, syncConfig);
        syncServiceInstance.initialize();
    }
    return syncServiceInstance;
}

export function getLogTableSyncInstance(): OmniLoggerTableSync | null {
    return syncServiceInstance;
}
