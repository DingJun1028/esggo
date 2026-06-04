/**
 * OmniTable Fusion API v1 — TypeScript SDK Client
 * ═══════════════════════════════════════════════
 * ESG GO 平台 × OmniTable 集成層
 *
 * 5T Protocol Compliance:
 *   T1-Traceable:   每次 API 呼叫記錄 source_origin
 *   T2-Transparent: 所有回應保留原始結構
 *   T3-Tangible:    強型別 interface 定義
 *   T4-Trackable:   request_id 追蹤鏈
 *   T5-Trustworthy: Server-side API Key 隔離
 */
export interface OmniTableSpace {
    id: string;
    name: string;
    isAdmin: boolean;
}
export interface OmniTableNode {
    id: string;
    name: string;
    type: 'Datasheet' | 'Folder' | 'Form' | 'Dashboard' | 'Mirror';
    icon: string;
    isFav: boolean;
    children?: OmniTableNode[];
}
export interface OmniTableField {
    id: string;
    name: string;
    type: string;
    property?: Record<string, unknown>;
    editable?: boolean;
    isPrimary?: boolean;
}
export interface OmniTableView {
    id: string;
    name: string;
    type: string;
}
export interface OmniTableRecord {
    recordId: string;
    createdAt?: number;
    updatedAt?: number;
    fields: Record<string, unknown>;
}
export interface OmniTableAttachment {
    id: string;
    name: string;
    size: number;
    mimeType: string;
    token: string;
    width?: number;
    height?: number;
    url: string;
}
export interface OmniTablePagination {
    pageNum: number;
    pageSize: number;
    total: number;
}
export interface OmniTableResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}
export interface OmniTableRecordsResponse {
    total: number;
    pageNum: number;
    pageSize: number;
    records: OmniTableRecord[];
}
export interface GetRecordsParams {
    viewId?: string;
    sort?: Array<{
        field: string;
        order: 'asc' | 'desc';
    }>;
    recordIds?: string[];
    fields?: string[];
    filterByFormula?: string;
    maxRecords?: number;
    pageNum?: number;
    pageSize?: number;
    fieldKey?: 'id' | 'name';
}
export interface CreateRecordPayload {
    fields: Record<string, unknown>;
}
export interface UpdateRecordPayload {
    recordId: string;
    fields: Record<string, unknown>;
}
interface OmniTableClientConfig {
    /** API Token (Bearer) */
    token: string;
    /** Base URL — defaults to https://omni-table.ai */
    baseUrl?: string;
}
export declare class OmniTableClient {
    private readonly token;
    private readonly baseUrl;
    constructor(config: OmniTableClientConfig);
    private get headers();
    private request;
    getSpaces(): Promise<OmniTableSpace[]>;
    getNodes(spaceId: string): Promise<OmniTableNode[]>;
    searchNodes(spaceId: string, keyword: string): Promise<OmniTableNode[]>;
    getFields(datasheetId: string): Promise<OmniTableField[]>;
    createField(datasheetId: string, field: {
        name: string;
        type: string;
        property?: Record<string, unknown>;
    }): Promise<OmniTableField>;
    deleteField(datasheetId: string, fieldId: string): Promise<void>;
    getViews(datasheetId: string): Promise<OmniTableView[]>;
    getRecords(datasheetId: string, params?: GetRecordsParams): Promise<OmniTableRecordsResponse>;
    createRecords(datasheetId: string, records: CreateRecordPayload[], fieldKey?: 'id' | 'name'): Promise<OmniTableRecord[]>;
    updateRecords(datasheetId: string, records: UpdateRecordPayload[], fieldKey?: 'id' | 'name'): Promise<OmniTableRecord[]>;
    deleteRecords(datasheetId: string, recordIds: string[]): Promise<void>;
    createDatasheet(spaceId: string, payload: {
        name: string;
        description?: string;
        folderId?: string;
        fields: Array<{
            name: string;
            type: string;
            property?: Record<string, unknown>;
        }>;
    }): Promise<{
        id: string;
        createdAt: number;
    }>;
    getEmbedLinks(spaceId: string, nodeId: string): Promise<Array<{
        linkId: string;
        url: string;
        payload: Record<string, unknown>;
    }>>;
    createEmbedLink(spaceId: string, nodeId: string, payload: {
        isEnabledWatermark?: boolean;
        viewControl?: Record<string, unknown>;
    }): Promise<{
        linkId: string;
        url: string;
    }>;
}
export declare class OmniTableError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare function getOmniTableServerClient(): OmniTableClient;
export {};
//# sourceMappingURL=client.d.ts.map