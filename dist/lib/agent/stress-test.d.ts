/**
 * 5T Integrity Protocol Stress Test
 * Simulates high-concurrency cryptographic sealing to verify system stability.
 */
export declare function run5TStressTest(iterations?: number, concurrencyLimit?: number): Promise<{
    success: boolean;
    iterations: number;
    totalDuration: number;
    avgTime: number;
    throughput: number;
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    iterations?: undefined;
    totalDuration?: undefined;
    avgTime?: undefined;
    throughput?: undefined;
}>;
//# sourceMappingURL=stress-test.d.ts.map