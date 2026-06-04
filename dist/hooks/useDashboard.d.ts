export interface DashboardStats {
    complianceRate: number;
    carbonEmissions: number;
    griCoverage: number;
    auditCount: number;
}
export interface CarbonTrendRecord {
    month: string;
    emissions: number;
}
export declare function useDashboardStats(refreshInterval?: number): {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useDashboard.d.ts.map