/**
 * 🚀 OmniTable Type Definitions
 * --------------------------------------------------
 * [功能] OmniTable REST API 的完整 TypeScript 類型定義
 * [架構] 支援 Records, Fields, Views, Attachments, Sync Log
 */

// ==================== Core Configuration ====================

export interface OmniTableConfig {
    apiKey: string;
    baseId: string; // Space ID
    datasheetId: string;
}

export interface OmniTableDatasheetConfig {
    customers?: string;
    projects?: string;
    esg_metrics?: string;
    documents?: string;
    opportunities?: string;
}

// ==================== Records ====================

export interface OmniTableRecord {
    recordId?: string;
    fields: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

export interface OmniTableRecordResponse {
    success: boolean;
    code: number;
    message: string;
    data: {
        records: OmniTableRecord[];
        pageNum?: number;
        pageSize?: number;
        total?: number;
    };
}

export interface OmniTableBatchResult {
    success: boolean;
    recordIds: string[];
    errors: Array<{
        recordId?: string;
        error: string;
    }>;
}

// ==================== Fields ====================

export type OmniTableFieldType =
    | 'Text'
    | 'Number'
    | 'SingleSelect'
    | 'MultiSelect'
    | 'DateTime'
    | 'Attachment'
    | 'Member'
    | 'Checkbox'
    | 'Rating'
    | 'URL'
    | 'Email'
    | 'Phone'
    | 'Currency'
    | 'Percent'
    | 'Formula'
    | 'Link'
    | 'LookUp'
    | 'Rollup'
    | 'CreatedTime'
    | 'LastModifiedTime'
    | 'CreatedBy'
    | 'LastModifiedBy'
    | 'AutoNumber';

export interface OmniTableField {
    id: string;
    name: string;
    type: OmniTableFieldType;
    property?: OmniTableFieldProperty;
    desc?: string;
    required?: boolean;
    editable?: boolean;
    isPrimary?: boolean;
}

export interface OmniTableFieldProperty {
    // Text
    defaultValue?: string;

    // Number, Currency, Percent
    precision?: number; // 小數點位數
    symbol?: string; // 貨幣符號

    // SingleSelect, MultiSelect
    options?: Array<{
        id: string;
        name: string;
        color?: string;
    }>;

    // DateTime
    dateFormat?: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
    timeFormat?: '12' | '24';
    includeTime?: boolean;

    // Rating
    max?: number; // 最高星數
    icon?: string;

    // Formula
    expression?: string;

    // Link (關聯表)
    foreignDatasheetId?: string;

    // LookUp, Rollup
    relatedLinkFieldId?: string;
    targetFieldId?: string;
    rollupFunction?: 'SUM' | 'AVERAGE' | 'MAX' | 'MIN' | 'COUNT' | 'COUNTALL';
}

export interface OmniTableCreateFieldRequest {
    name: string;
    type: OmniTableFieldType;
    property?: OmniTableFieldProperty;
    desc?: string;
}

// ==================== Views ====================

export type OmniTableViewType = 'Grid' | 'Kanban' | 'Gallery' | 'Gantt' | 'Calendar' | 'Form';

export interface OmniTableView {
    id: string;
    name: string;
    type: OmniTableViewType;
    rows?: Array<{
        recordId: string;
    }>;
    columns?: Array<{
        fieldId: string;
        width?: number;
        hidden?: boolean;
        statType?: 'None' | 'Sum' | 'Average' | 'Max' | 'Min' | 'Count';
    }>;
    frozenColumnCount?: number; // 凍結欄位數
    filterInfo?: OmniTableFilterInfo;
    sortInfo?: OmniTableSortInfo;
    groupInfo?: OmniTableGroupInfo;
}

export interface OmniTableFilterInfo {
    conjunction: 'and' | 'or';
    conditions: Array<{
        fieldId: string;
        operator: string; // 'is', 'isNot', 'contains', 'doesNotContain', '>', '<', '>=', '<=', 'isEmpty', 'isNotEmpty'
        value: any;
    }>;
}

export interface OmniTableSortInfo {
    rules: Array<{
        fieldId: string;
        order: 'asc' | 'desc';
    }>;
}

export interface OmniTableGroupInfo {
    fieldId: string;
    order: 'asc' | 'desc';
}

// ==================== Attachments ====================

export interface OmniTableAttachment {
    token: string;
    name: string;
    size: number;
    mimeType: string;
    url: string;
    previewUrl?: string;
    width?: number; // 圖片寬度
    height?: number; // 圖片高度
}

export interface OmniTableUploadResponse {
    success: boolean;
    data: {
        token: string;
        url: string;
    };
}

// ==================== Sync Log ====================

export type SyncEntityType = 'customer' | 'project' | 'metric' | 'document' | 'opportunity';
export type SyncDirection = 'to_omni_table' | 'from_omni_table';
export type SyncStatus = 'success' | 'failed' | 'conflict' | 'pending' | 'retry';

export interface OmniTableSyncLog {
    id: string;
    entityType: SyncEntityType;
    entityId: string; // InfoOne 實體 UUID
    omni_table_record_id?: string;
    datasheetId: string;
    syncDirection: SyncDirection;
    syncStatus: SyncStatus;
    conflictData?: ConflictData;
    errorMessage?: string;
    retryCount: number;
    lastRetryAt?: string;
    syncedAt: string;
    createdAt: string;
}

export interface ConflictData {
    field: string;
    localValue: any;
    remoteValue: any;
    localTimestamp: string;
    remoteTimestamp: string;
}

// ==================== Sync Configuration ====================

export type ConflictStrategy = 'last_write_wins' | 'local_priority' | 'remote_priority' | 'manual';

export interface SyncConfig {
    conflictResolution: ConflictStrategy;
    retryAttempts: number;
    retryDelayMs: number;
    batchSize: number; // 批量同步每批數量
    fieldOverrides: Record<string, 'never_sync' | 'local_priority' | 'remote_priority'>;
}

export const DEFAULT_SYNC_CONFIG: SyncConfig = {
    conflictResolution: 'last_write_wins',
    retryAttempts: 3,
    retryDelayMs: 2000,
    batchSize: 50,
    fieldOverrides: {
        created_at: 'never_sync',
        updated_at: 'local_priority',
    },
};

// ==================== Sync Result ====================

export interface SyncResult {
    success: boolean;
    recordId?: string;
    error?: string;
    conflict?: ConflictData;
    retryable?: boolean;
}

export interface BatchSyncResult {
    total: number;
    succeeded: number;
    failed: number;
    conflicts: number;
    results: SyncResult[];
}

// ==================== Webhook ====================

export interface OmniTableWebhookPayload {
    event: 'record.created' | 'record.updated' | 'record.deleted' | 'field.created' | 'field.updated' | 'field.deleted';
    datasheetId: string;
    recordId?: string;
    fieldId?: string;
    timestamp: string;
    data?: any;
}

export interface OmniTableWebhookVerification {
    signature: string;
    timestamp: string;
    payload: string;
}

// ==================== API Request/Response ====================

export interface OmniTableListRecordsParams {
    pageSize?: number; // 10-1000, default 100
    pageNum?: number; // 從 1 開始
    filterByFormula?: string; // 過濾公式
    fieldKey?: 'name' | 'id'; // 欄位引用方式
    sort?: Array<{
        field: string;
        order: 'asc' | 'desc';
    }>;
    fields?: string[]; // 只返回特定欄位
    viewId?: string; // 使用特定視圖
}

export interface OmniTableCreateRecordsRequest {
    records: Array<{
        fields: Record<string, any>;
    }>;
    fieldKey?: 'name' | 'id';
}

export interface OmniTableUpdateRecordsRequest {
    records: Array<{
        recordId: string;
        fields: Record<string, any>;
    }>;
    fieldKey?: 'name' | 'id';
}

export interface OmniTableDeleteRecordsParams {
    recordIds: string[];
}

// ==================== Error Handling ====================

export class OmniTableError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public retryable: boolean = false
    ) {
        super(message);
        this.name = 'OmniTableError';
    }
}

export interface OmniTableErrorResponse {
    success: false;
    code: number;
    message: string;
}

// ==================== Rate Limiting ====================

export interface OmniTableRateLimitInfo {
    limit: number; // QPS limit
    remaining: number;
    resetTime: string;
}

// ==================== Type Guards ====================

export function isOmniTableError(error: any): error is OmniTableError {
    return error instanceof OmniTableError;
}

export function isConflict(result: SyncResult): result is SyncResult & { conflict: ConflictData } {
    return result.success === false && result.conflict !== undefined;
}

export function isRetryable(error: OmniTableError): boolean {
    return error.retryable || (error.statusCode !== undefined && error.statusCode >= 500);
}
