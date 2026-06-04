/**
 * 🌌 OmniTable & OmniBlue Deep Integration Bridge
 * v1.0 | #DataSovereignty #CloudOrchestration #ESGGO
 *
 * This bridge synchronizes OmniTable records (ESG Metrics) with OmniBlue agent states.
 */
export declare class OmniTableBlueBridge {
    private aiTable;
    private spaceId;
    constructor();
    /**
     * Sync ESG metrics from OmniTable to OmniBlue Cluster
     * For every metric with a 'Trigger' status, we provision/update an agent on OmniBlue.
     */
    syncMetricsToCloud(datasheetId: string): Promise<{
        success: boolean;
        processed: number;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        processed?: undefined;
    }>;
    /**
     * Update OmniTable with OmniBlue Cluster health
     */
    reportCloudStatusToOmniTable(datasheetId: string, recordId: string): Promise<void>;
}
export declare const aiTableBlueBridge: OmniTableBlueBridge;
//# sourceMappingURL=omni-table-blue-bridge.d.ts.map