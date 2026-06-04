import type { EnergyData, Conflict } from './jes-monitor.types';
interface JESMonitorOptions {
    targetEmissions?: Map<string, number>;
}
interface CarbonHistoryEntry {
    service: string;
    timestamp: Date;
    emission: number;
    operation: string;
}
export declare class JESMonitor {
    private data;
    private targetEmissions;
    private carbonHistory;
    private alerts;
    constructor(options?: JESMonitorOptions);
    /** Record a new energy reading */
    addData(d: EnergyData): void;
    /** Fetch real-time energy data from Supabase with retry logic */
    fetchEnergyDataFromSupabase(maxRetries?: number): Promise<EnergyData[]>;
    /** Check current energy data against configured target emissions */
    detectConflicts(): Conflict[];
    /** Generate textual optimization suggestions */
    suggestOptimizations(conflicts: Conflict[]): string[];
    /** Get historical carbon data */
    getCarbonHistory(limit?: number): CarbonHistoryEntry[];
    /** Get active alerts */
    getActiveAlerts(): Map<string, string>;
    /** Clear resolved alerts */
    clearAlert(service: string): void;
    /** Generate ASCII chart for terminal display */
    generateChart(): string;
}
export {};
//# sourceMappingURL=jes-monitor.d.ts.map