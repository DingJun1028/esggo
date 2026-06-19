/**
 * 🚀 OmniTable Integration Service - Enhanced
 * --------------------------------------------------
 * [功能] 提供 OmniTable API 的完整封裝，支援 CRM 數據同步與管理
 * [新增] Fields CRUD, Views Access, Attachments, Batch Operations, Retry Logic
 * [連結] 深貫廣通：將 AI 分析結果與客戶關係管理深度耦合
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import type {
    OmniTableConfig,
    OmniTableRecord,
    OmniTableRecordResponse,
    OmniTableField,
    OmniTableCreateFieldRequest,
    OmniTableView,
    OmniTableAttachment,
    OmniTableListRecordsParams,
    OmniTableBatchResult,
    OmniTableError,
    OmniTableUploadResponse,
} from '@/types/esg-go/omni-table.types.js';

class OmniTableService {
    private config: OmniTableConfig | null = null;
    // Environment-agnostic environment variable access
    private getEnvVar(key: string, defaultValue: string): string {
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key]!;
        }
        if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
            return (import.meta as any).env[key] || defaultValue;
        }
        return defaultValue;
    }

    private baseUrl = this.getEnvVar('VITE_OMNI_TABLE_API_URL', 'https://api.aitable.ai/fusion/v1');
    private readonly MAX_BATCH_SIZE = 10; // OmniTable API 限制
    private readonly DEFAULT_RETRY_ATTEMPTS = 3;
    private readonly DEFAULT_RETRY_DELAY_MS = 2000;

    constructor() {
        // 優先從環境變數讀取
        const apiKey = this.getEnvVar('VITE_OMNI_TABLE_API_KEY', '');
        const baseId = this.getEnvVar('VITE_OMNI_TABLE_BASE_ID', '');
        const datasheetId = this.getEnvVar('VITE_OMNI_TABLE_DATASHEET_ID', '');

        if (apiKey && baseId && datasheetId) {
            this.config = { apiKey, baseId, datasheetId };
        }
    }

    /**
     * 初始化設定
     */
    public configure(config: OmniTableConfig) {
        this.config = config;
    }

    // ==================== Helper: HTTP Request ====================

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retryAttempts: number = this.DEFAULT_RETRY_ATTEMPTS
    ): Promise<T> {
        if (!this.config) {
            throw this.createError('OmniTableService is not configured', 'NOT_CONFIGURED');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        for (let attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                const response = await fetch(url, { ...options, headers });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const isRetryable = response.status >= 500 || response.status === 429;

                    if (isRetryable && attempt < retryAttempts) {
                        const delay = this.DEFAULT_RETRY_DELAY_MS * attempt;
                        omniLogger.warn(LogCategory.SYSTEM, `[OmniTableService] Retrying request (${attempt}/${retryAttempts}) after ${delay}ms`, {
                            status: response.status,
                            endpoint,
                        });
                        await this.sleep(delay);
                        continue;
                    }

                    throw this.createError(
                        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                        errorData.code || `HTTP_${response.status}`,
                        response.status,
                        isRetryable
                    );
                }

                const data = await response.json();
                return data as T;
            } catch (error) {
                if (error instanceof Error && (error as any).name === 'OmniTableError') throw error;

                if (attempt === retryAttempts) {
                    throw this.createError(
                        `Network error: ${(error as Error).message}`,
                        'NETWORK_ERROR',
                        undefined,
                        true
                    );
                }

                await this.sleep(this.DEFAULT_RETRY_DELAY_MS * attempt);
            }
        }

        throw this.createError('Max retry attempts reached', 'MAX_RETRIES_REACHED');
    }

    private createError(message: string, code?: string, statusCode?: number, retryable: boolean = false): OmniTableError {
        const error = new Error(message) as OmniTableError;
        error.name = 'OmniTableError';
        error.code = code;
        error.statusCode = statusCode;
        error.retryable = retryable;
        return error;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== Records CRUD ====================

    /**
     * 獲取記錄（支援分頁、過濾、排序）
     */
    public async getRecords(params: OmniTableListRecordsParams = {}): Promise<OmniTableRecord[]> {
        const {
            pageSize = 100,
            pageNum = 1,
            filterByFormula,
            fieldKey = 'name',
            sort,
            fields,
            viewId,
        } = params;

        const queryParams = new URLSearchParams({
            pageSize: String(pageSize),
            pageNum: String(pageNum),
            fieldKey,
        });

        if (filterByFormula) queryParams.append('filterByFormula', filterByFormula);
        if (viewId) queryParams.append('viewId', viewId);
        if (fields && fields.length > 0) queryParams.append('fields', fields.join(','));
        if (sort && sort.length > 0) {
            queryParams.append('sort', JSON.stringify(sort));
        }

        try {
            const response = await this.request<OmniTableRecordResponse>(
                `/datasheets/${this.config!.datasheetId}/records?${queryParams}`
            );
            return response.data.records;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] getRecords error:', { error });
            return [];
        }
    }

    /**
     * 新增記錄 (單筆或多筆，上限 10 筆)
     */
    public async createRecords(
        records: Array<{ fields: Record<string, any> }>,
        fieldKey: 'name' | 'id' = 'name'
    ): Promise<OmniTableRecord[] | null> {
        if (!this.config) return null;
        if (records.length > this.MAX_BATCH_SIZE) {
            throw this.createError(`Cannot create more than ${this.MAX_BATCH_SIZE} records at once`, 'BATCH_SIZE_EXCEEDED');
        }

        try {
            const response = await this.request<OmniTableRecordResponse>(
                `/datasheets/${this.config.datasheetId}/records?fieldKey=${fieldKey}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ records }),
                }
            );
            return response.success ? response.data.records : null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] createRecords error:', { error });
            return null;
        }
    }

    /**
     * 更新記錄 (單筆或多筆，上限 10 筆)
     */
    public async updateRecords(
        records: Array<{ recordId: string; fields: Record<string, any> }>,
        fieldKey: 'name' | 'id' = 'name'
    ): Promise<OmniTableRecord[] | null> {
        if (!this.config) return null;
        if (records.length > this.MAX_BATCH_SIZE) {
            throw this.createError(`Cannot update more than ${this.MAX_BATCH_SIZE} records at once`, 'BATCH_SIZE_EXCEEDED');
        }

        try {
            const response = await this.request<OmniTableRecordResponse>(
                `/datasheets/${this.config.datasheetId}/records?fieldKey=${fieldKey}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ records }),
                }
            );
            return response.success ? response.data.records : null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] updateRecords error:', { error });
            return null;
        }
    }

    /**
     * 刪除記錄
     */
    public async deleteRecords(recordIds: string[]): Promise<boolean> {
        if (!this.config) return false;

        try {
            const idsParam = recordIds.join(',');
            const response = await this.request<{ success: boolean }>(
                `/datasheets/${this.config.datasheetId}/records?recordIds=${idsParam}`,
                { method: 'DELETE' }
            );
            return response.success;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] deleteRecords error:', { error });
            return false;
        }
    }

    // ==================== Batch Operations with Chunking ====================

    /**
     * 批量建立記錄（自動分批處理）
     */
    public async batchCreateRecords(
        datasheetId: string,
        records: Array<{ fields: Record<string, any> }>,
        chunkSize: number = this.MAX_BATCH_SIZE
    ): Promise<OmniTableBatchResult> {
        const originalDatasheet = this.config?.datasheetId;
        if (this.config) this.config.datasheetId = datasheetId;

        const result: OmniTableBatchResult = {
            success: true,
            recordIds: [],
            errors: [],
        };

        try {
            for (let i = 0; i < records.length; i += chunkSize) {
                const chunk = records.slice(i, i + chunkSize);
                const created = await this.createRecords(chunk);

                if (created) {
                    result.recordIds.push(...created.map(r => r.recordId!));
                } else {
                    result.success = false;
                    result.errors.push({
                        error: `Failed to create chunk ${i / chunkSize + 1}`,
                    });
                }
            }
        } finally {
            if (this.config && originalDatasheet) this.config.datasheetId = originalDatasheet;
        }

        omniLogger.info(LogCategory.SYSTEM, `[OmniTableService] Batch created ${result.recordIds.length}/${records.length} records`);
        return result;
    }

    /**
     * 批量更新記錄（自動分批處理）
     */
    public async batchUpdateRecords(
        datasheetId: string,
        records: Array<{ recordId: string; fields: Record<string, any> }>,
        chunkSize: number = this.MAX_BATCH_SIZE
    ): Promise<OmniTableBatchResult> {
        const originalDatasheet = this.config?.datasheetId;
        if (this.config) this.config.datasheetId = datasheetId;

        const result: OmniTableBatchResult = {
            success: true,
            recordIds: [],
            errors: [],
        };

        try {
            for (let i = 0; i < records.length; i += chunkSize) {
                const chunk = records.slice(i, i + chunkSize);
                const updated = await this.updateRecords(chunk);

                if (updated) {
                    result.recordIds.push(...updated.map(r => r.recordId!));
                } else {
                    result.success = false;
                    result.errors.push({
                        error: `Failed to update chunk ${i / chunkSize + 1}`,
                    });
                }
            }
        } finally {
            if (this.config && originalDatasheet) this.config.datasheetId = originalDatasheet;
        }

        omniLogger.info(LogCategory.SYSTEM, `[OmniTableService] Batch updated ${result.recordIds.length}/${records.length} records`);
        return result;
    }

    // ==================== Fields Management ====================

    /**
     * 獲取所有欄位定義
     */
    public async getFields(datasheetId?: string): Promise<OmniTableField[]> {
        const targetDatasheet = datasheetId || this.config?.datasheetId;
        if (!targetDatasheet) throw this.createError('Datasheet ID is required', 'MISSING_DATASHEET_ID');

        try {
            const response = await this.request<{ success: boolean; data: { fields: OmniTableField[] } }>(
                `/datasheets/${targetDatasheet}/fields`
            );
            return response.data.fields;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] getFields error:', { error });
            return [];
        }
    }

    /**
     * 建立新欄位
     */
    public async createField(datasheetId: string, field: OmniTableCreateFieldRequest): Promise<OmniTableField | null> {
        try {
            const response = await this.request<{ success: boolean; data: OmniTableField }>(
                `/datasheets/${datasheetId}/fields`,
                {
                    method: 'POST',
                    body: JSON.stringify(field),
                }
            );
            return response.success ? response.data : null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] createField error:', { error });
            return null;
        }
    }

    /**
     * 更新欄位
     */
    public async updateField(
        datasheetId: string,
        fieldId: string,
        updates: Partial<OmniTableCreateFieldRequest>
    ): Promise<OmniTableField | null> {
        try {
            const response = await this.request<{ success: boolean; data: OmniTableField }>(
                `/datasheets/${datasheetId}/fields/${fieldId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(updates),
                }
            );
            return response.success ? response.data : null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] updateField error:', { error });
            return null;
        }
    }

    /**
     * 刪除欄位
     */
    public async deleteField(datasheetId: string, fieldId: string): Promise<boolean> {
        try {
            const response = await this.request<{ success: boolean }>(
                `/datasheets/${datasheetId}/fields/${fieldId}`,
                { method: 'DELETE' }
            );
            return response.success;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] deleteField error:', { error });
            return false;
        }
    }

    // ==================== Views ====================

    /**
     * 獲取所有視圖
     */
    public async getViews(datasheetId?: string): Promise<OmniTableView[]> {
        const targetDatasheet = datasheetId || this.config?.datasheetId;
        if (!targetDatasheet) throw this.createError('Datasheet ID is required', 'MISSING_DATASHEET_ID');

        try {
            const response = await this.request<{ success: boolean; data: { views: OmniTableView[] } }>(
                `/datasheets/${targetDatasheet}/views`
            );
            return response.data.views;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] getViews error:', { error });
            return [];
        }
    }

    /**
     * 根據視圖獲取記錄
     */
    public async getViewRecords(datasheetId: string, viewId: string, params: Omit<OmniTableListRecordsParams, 'viewId'> = {}): Promise<OmniTableRecord[]> {
        return this.getRecords({ ...params, viewId });
    }

    // ==================== Attachments ====================

    /**
     * 上傳附件
     */
    public async uploadAttachment(file: File): Promise<OmniTableAttachment | null> {
        if (!this.config) throw this.createError('OmniTableService is not configured', 'NOT_CONFIGURED');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseUrl}/spaces/${this.config.baseId}/attachments`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw this.createError(`Upload failed: ${response.statusText}`, `HTTP_${response.status}`, response.status);
            }

            const data: OmniTableUploadResponse = await response.json();
            return {
                token: data.data.token,
                name: file.name,
                size: file.size,
                mimeType: file.type,
                url: data.data.url,
            };
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] uploadAttachment error:', { error });
            return null;
        }
    }

    // ==================== Nodes / Space Management ====================

    /**
     * 獲取空間下的所有節點 (Datasheets/Folders)
     */
    public async getSpaceNodes(spaceId?: string): Promise<any[]> {
        const targetSpaceId = spaceId || this.config?.baseId;
        if (!targetSpaceId) {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniTableService] Space ID is required for getSpaceNodes');
            return [];
        }

        try {
            // AITable API: GET /spaces/{spaceId}/nodes
            const response = await this.request<{ success: boolean; data: { nodes: any[] } }>(
                `/spaces/${targetSpaceId}/nodes`
            );
            return response.data.nodes || [];
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableService] getSpaceNodes error:', { error });
            return [];
        }
    }
}

export const omniTableService = new OmniTableService();

