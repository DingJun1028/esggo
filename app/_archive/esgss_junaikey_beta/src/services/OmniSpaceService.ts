
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { ncb } from '@/lib/ncb/client';
import { omniSyncService, Platform } from '@/services/OmniSyncService';

export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface ImpactMetric {
    radius: number;
    intensity: number;
    description: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * OmniSpaceService
 * ----------------
 * Provides "Spatial Awareness" and "Environmental Context" to the Omni System.
 * Calculates impact radius and environmental risks based on geospatial data.
 */
export class OmniSpaceService {
    private static instance: OmniSpaceService;

    private constructor() { }

    public static getInstance(): OmniSpaceService {
        if (!OmniSpaceService.instance) {
            OmniSpaceService.instance = new OmniSpaceService();
        }
        return OmniSpaceService.instance;
    }

    public async getSpaceNodes(): Promise<any[]> {
        const { data, error } = await ncb.from('omni_space_nodes').select('*').order('created_at', { ascending: false });
        if (error) {
            omniLogger.error(LogCategory.DATA, `Failed to fetch space nodes: ${error.message}`);
            return [];
        }
        return data as any[];
    }

    /**
     * Trigger a sync with the external OmniSpace platform
     */
    public async triggerSync(): Promise<boolean> {
        // Trigger a sync for a batch of nodes or full sync
        // For now, we simulate a sync of a "root" node or discovery
        const result = await omniSyncService.syncEntity(
            'omni_space' as Platform,
            'node',
            'root',
            'from_platform' // Pull from OmniSpace
        );
        return result.success;
    }

    /**
     * Calculates the impact of an event or entity at a specific location.
     */
    public calculateSpatialImpact(location: GeoPoint, radius: number): ImpactMetric {
        // Mock logic for now
        omniLogger.info(LogCategory.DATA, `Calculating spatial impact for ${location.lat},${location.lng} radius ${radius}`);
        return {
            radius,
            intensity: Math.min(100, radius * 0.5), // Dummy calculation capped at 100
            description: `Environmental impact Analysis: ${radius > 50 ? 'Significant' : 'Localized'} impact detected.`
        };
    }

    /**
     * Assesses the environmental risk level at a specific location.
     */
    public getEnvironmentalRisk(location: GeoPoint): RiskLevel {
        // Mock logic
        omniLogger.info(LogCategory.DATA, `Assessing risk for ${location.lat},${location.lng}`);
        const randomRisk = Math.random();
        if (randomRisk > 0.9) return 'CRITICAL';
        if (randomRisk > 0.7) return 'HIGH';
        if (randomRisk > 0.4) return 'MEDIUM';
        return 'LOW';
    }
}

export const omniSpace = OmniSpaceService.getInstance();
