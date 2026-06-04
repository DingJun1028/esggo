export interface AuditRecord {
    id: string;
    tenant_id: string;
    event_type: string;
    payload: {
        zkp_hash: string;
        nodes_involved: string[];
        metrics: Record<string, unknown>;
    };
    source_origin: string;
    timestamp: number;
    last_modified_by: string;
}
export interface VisualDropState {
    bgColor: string;
    borderColor: string;
    glowColor: string;
    label: string;
}
export declare function useColorDropStream(token?: string): {
    events: AuditRecord[];
    isLive: boolean;
    metrics: {
        totalCount: number;
        zkpSuccessRate: string;
        entropyReduction: string | number;
    };
    getVisualState: (eventType: string) => VisualDropState;
    triggerForensicReplay: (speed?: number) => Promise<any>;
    core: {
        uuid: string;
        version: string;
        timestamp: number;
        evidence: string;
    };
};
//# sourceMappingURL=useColorDropStream.d.ts.map