export interface TelemetryEvent {
    id: string;
    agent: string;
    task: string;
    timestamp: string;
    duration: number;
    success: boolean;
    context?: unknown;
    error?: string;
    tokensUsed?: number;
    cost?: number;
    simulated?: boolean;
}
export interface AgentMetrics {
    agent: string;
    totalTasks: number;
    successRate: number;
    avgDuration: number;
    totalCost: number;
    lastRun: string;
}
declare class TelemetryService {
    private events;
    private metrics;
    recordEvent(event: Omit<TelemetryEvent, 'id'>): void;
    updateMetrics(event: TelemetryEvent): void;
    getEvents(): TelemetryEvent[];
    getMetrics(): AgentMetrics[];
    getEventsByAgent(agent: string): TelemetryEvent[];
    clear(): void;
}
export declare const telemetryService: TelemetryService;
export {};
//# sourceMappingURL=service.d.ts.map