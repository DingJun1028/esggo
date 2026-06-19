/**
 * 🏥 System Vitals Interface
 * Represents the real-time health and resonance of the backend system.
 * This data is used to "Awaken" the game mechanics based on operational reality.
 */
export interface SystemVital {
    status: 'healthy' | 'degraded' | 'unhealthy';
    integrityScore: number; // 0-100, derived from memory & hit rate
    resonance: 'HARMONIC' | 'DISSONANT' | 'CHAOTIC'; // Game state interpretation

    // Raw Backend Stats
    redis: {
        memoryUsage: number; // Bytes
        fragmentation: number;
        hitRate: number;
        connected: boolean;
    };

    // System KPIs
    uptime: number;
    latency: number;
}
