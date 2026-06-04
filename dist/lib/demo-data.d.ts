export interface DemoMetric {
    id: string;
    category: 'GHG' | 'Energy' | 'Water' | 'Waste';
    metric_name: string;
    metric_value: number;
    unit: string;
    year: number;
    verified: boolean;
    hash_lock: string;
}
export declare const MOCK_ENVIRONMENTAL: DemoMetric[];
export declare const MOCK_TASKS: {
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    department: string;
}[];
export declare const MOCK_AUDIT: {
    id: string;
    action: string;
    resource: string;
    user_name: string;
    created_at: string;
}[];
export declare function getDemoData<T>(key: string, fallback: T[]): Promise<T[]>;
//# sourceMappingURL=demo-data.d.ts.map