/**
 * [Best Practice] System Evolution Hook
 * Monitors the system's own growth suggestions and impact scores.
 * Now supports global state syncing for oX Deep Integration.
 */
export declare function useSystemEvolution(): {
    growth: any;
    loading: boolean;
    lastUpdate: string | null;
    analyze: () => Promise<void>;
    submitEvolution: (title: string, impact: number) => Promise<{
        title: string;
        impact: number;
        timestamp: string;
    }>;
};
//# sourceMappingURL=useSystemEvolution.d.ts.map