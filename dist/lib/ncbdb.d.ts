/**
 * NCBDB Client: Nocodebackend DataBase Integration
 * v2.0.0 | High-Efficiency No-Code Sovereign Backend
 *
 * 支持 Vibe Coding & MCP (Model Context Protocol)
 * 連結地址: https://www.nocodebackend.com/
 */
export interface NCBDBResponse<T = unknown> {
    success: boolean;
    simulated?: boolean;
    data?: T;
    error?: string;
    [key: string]: unknown;
}
export declare class NCBDBClient {
    private baseUrl;
    private token;
    private projectId;
    constructor();
    private request;
    /**
     * Upsert a record into an NCBDB table
     */
    upsertRecord(tableName: string, data: Record<string, unknown>): Promise<NCBDBResponse>;
    /**
     * List records from an NCBDB table
     */
    listRecords<T>(tableName: string): Promise<NCBDBResponse<T[]>>;
}
export declare const ncbClient: NCBDBClient;
//# sourceMappingURL=ncbdb.d.ts.map