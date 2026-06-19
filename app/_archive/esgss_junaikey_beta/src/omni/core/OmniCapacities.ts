import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?? OmniCapacities: The Sovereign Capacity (Scalability/Resource)
 * 
 * Concept: "?¬èƒ½å®¹é?" (Universal Capacities) / "ä¸»æ??½æ?" (Sovereign Capacity)
 * 5T Alignment: Transparent (Usage), Tangible (Manifested Power)
 * Role: Manages system limits, resource allocation, and scaling thresholds.
 *       It ensures the Sovereign system has the "Capacity" to fulfill its mandates.
 */
export class OmniCapacities {
    private static instance: OmniCapacities;
    private capacities: Map<string, { used: number; total: number }> = new Map();

    private constructor() {
        // Initialize default capacities
        this.capacities.set('compute', { used: 0, total: 1000 });
        this.capacities.set('memory', { used: 0, total: 10000 });
        this.capacities.set('throughput', { used: 0, total: 500 });
    }

    public static getInstance(): OmniCapacities {
        if (!OmniCapacities.instance) {
            OmniCapacities.instance = new OmniCapacities();
        }
        return OmniCapacities.instance;
    }

    /**
     * ?? Check Capacity
     * @param resource Resource name
     */
    public async check(resource: string): Promise<IVerifiedResponse> {
        const stats = this.capacities.get(resource) || { used: 0, total: 0 };
        const usagePercent = stats.total > 0 ? (stats.used / stats.total) * 100 : 0;

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'QUERY',
            content: `OmniCapacities Check: ${resource}`,
            timestamp: Date.now(),
            source: 'OmniCapacities',
            tags: ['capacity', 'resource', 'monitoring'],
            payload: { resource, usagePercent }
        };

        return {
            core: manifest,
            message: `Current ${resource} capacity: ${usagePercent.toFixed(2)}%`,
            verified: usagePercent < 90,
            data: { resource, ...stats, available: stats.total - stats.used },
            source_origin: 'OmniCapacities',
            five_t_ref: `CAP-${resource}-${Date.now()}`
        };
    }

    /**
     * ?? Scale Up
     * @param resource Resource to scale
     * @param increment Amount to add
     */
    public async scale(resource: string, increment: number): Promise<IVerifiedResponse> {
        const stats = this.capacities.get(resource);
        if (stats) {
            stats.total += increment;
        }

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OmniCapacities Scale: ${resource} by ${increment}`,
            timestamp: Date.now(),
            source: 'OmniCapacities',
            tags: ['capacity', 'scaling', 'infrastructure'],
            payload: { resource, increment }
        };

        return {
            core: manifest,
            message: stats ? `Sovereign ${resource} capacity scaled up successfully` : 'Resource not found',
            verified: !!stats,
            data: stats,
            source_origin: 'OmniCapacities',
            five_t_ref: `SCALE-${resource}-${Date.now()}`
        };
    }
}
