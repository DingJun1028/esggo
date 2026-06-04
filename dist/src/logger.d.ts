interface LogEntry {
    timestamp: string;
    service: string;
    action: string;
    payload: any;
    result: any;
    error?: string;
}
export declare function logEvent(service: string, action: string, payload: any, result: any, error?: string): void;
export declare function getRecentLogs(limit?: number): LogEntry[];
export declare function exportLogs(): string;
export {};
//# sourceMappingURL=logger.d.ts.map