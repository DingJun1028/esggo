export interface OmniTableRecord {
    id: string;
    tenant_id: string;
    event_type: string;
    payload: {
        zkp_hash?: string;
        nodes_involved?: string[];
        metrics?: any;
    };
    source_origin: string;
    last_modified_by: string;
    timestamp: number;
}
export declare function useOmniTable(token?: string): {
    records: OmniTableRecord[];
    loading: boolean;
    error: Error | null;
    connectionStatus: "DISCONNECTED" | "CONNECTING" | "CONNECTED";
};
//# sourceMappingURL=useOmniTable.d.ts.map