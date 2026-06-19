
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import type {
    OmniTableConfig,
    OmniTableRecord,
    OmniTableRecordResponse,
    OmniTableListRecordsParams,
    OmniTableError,
} from '../../src/types/esg-go/omni-table.types.js';

export class OmniTableClient {
    private config: OmniTableConfig | null = null;
    private baseUrl = process.env.OMNI_TABLE_API_URL || process.env.AITABLE_API_URL || 'https://api.aitable.ai/fusion/v1'; // Legacy fallback maintained for compatibility
    private readonly MAX_BATCH_SIZE = 10; // API Limit
    private readonly DEFAULT_RETRY_ATTEMPTS = 3;
    private readonly DEFAULT_RETRY_DELAY_MS = 2000;

    constructor() {
        // Load from process.env (Node.js)
        const apiKey = process.env.OMNI_TABLE_API_KEY || process.env.OMNITABLE_API_KEY;
        const baseId = process.env.OMNI_TABLE_BASE_ID || process.env.OMNITABLE_BASE_ID;

        if (apiKey && baseId) {
            this.config = { apiKey, baseId, datasheetId: '' };
        }
    }

    public configure(config: OmniTableConfig) {
        this.config = config;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retryAttempts: number = this.DEFAULT_RETRY_ATTEMPTS
    ): Promise<T> {
        if (!this.config?.apiKey) {
            throw this.createError('OmniTableClient is not configured (Missing API Key)', 'NOT_CONFIGURED');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers: HeadersInit = {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            ...(options.headers as any),
        };

        for (let attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                const response = await fetch(url, { ...options, headers });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const isRetryable = response.status >= 500 || response.status === 429;

                    if (isRetryable && attempt < retryAttempts) {
                        const delay = this.DEFAULT_RETRY_DELAY_MS * attempt;
                        omniLogger.warn(LogCategory.SYSTEM, `[OmniTableClient] Retrying request (${attempt}/${retryAttempts}) after ${delay}ms`, {
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
                if ((error as any).name === 'OmniTableError') throw error;

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
        const error = new Error(message) as any;
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

    public async getRecords(datasheetId: string, params: OmniTableListRecordsParams = {}): Promise<OmniTableRecord[]> {
        // Ensure datasheetId is provided
        const targetDatasheetId = datasheetId || this.config?.datasheetId;
        if (!targetDatasheetId) throw this.createError('Datasheet ID required', 'MISSING_DATASHEET_ID');

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
                `/datasheets/${targetDatasheetId}/records?${queryParams}`
            );
            return response.data.records;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableClient] getRecords error:', { error });
            return [];
        }
    }

    public async createRecords(
        datasheetId: string,
        records: Array<{ fields: Record<string, any> }>,
        fieldKey: 'name' | 'id' = 'name'
    ): Promise<OmniTableRecord[] | null> {
        if (!datasheetId) return null;
        if (records.length > this.MAX_BATCH_SIZE) {
            throw this.createError(`Cannot create more than ${this.MAX_BATCH_SIZE} records at once`, 'BATCH_SIZE_EXCEEDED');
        }

        try {
            const response = await this.request<OmniTableRecordResponse>(
                `/datasheets/${datasheetId}/records?fieldKey=${fieldKey}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ records }),
                }
            );
            return response.success ? response.data.records : null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableClient] createRecords error:', { error });
            return null;
        }
    }

    public async updateRecords(
        datasheetId: string,
        records: Array<{ recordId: string; fields: Record<string, any> }>,
        fieldKey: 'name' | 'id' = 'name'
    ): Promise<OmniTableRecord[] | null> {
        if (!datasheetId) return null;
        if (records.length > this.MAX_BATCH_SIZE) {
            throw this.createError(`Cannot update more than ${this.MAX_BATCH_SIZE} records at once`, 'BATCH_SIZE_EXCEEDED');
        }

        try {
            const response = await this.request<OmniTableRecordResponse>(
                `/datasheets/${datasheetId}/records?fieldKey=${fieldKey}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ records }),
                }
            );
            return response.success ? response.data.records : null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableClient] updateRecords error:', { error });
            return null;
        }
    }

    public async deleteRecords(datasheetId: string, recordIds: string[]): Promise<boolean> {
        if (!datasheetId) return false;

        try {
            const idsParam = recordIds.join(',');
            const response = await this.request<{ success: boolean }>(
                `/datasheets/${datasheetId}/records?recordIds=${idsParam}`,
                { method: 'DELETE' }
            );
            return response.success;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTableClient] deleteRecords error:', { error });
            return false;
        }
    }
}

export const omniTableClient = new OmniTableClient();
