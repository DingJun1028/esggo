import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger';
import { Protocol5T } from './types/InfoOne.types';

/**
 * OmniCultivation: The Sovereign Nurturing Process.
 * Manages the growth of knowledge assets and agent capacities through 
 * nourishment (data injection), pruning (optimization), and crystallization (manifestation).
 */
export interface CultivationTarget {
    id: string;
    type: 'asset' | 'agent' | 'chapter';
    growth: number; // 0-100
    entropy: number; // 0-100 (hallucination/noise rate)
    status: 'seedling' | 'sapling' | 'tree' | 'crystal';
    metadata: Record<string, any>;
}

export class OmniCultivation {
    private static instance: OmniCultivation;
    private targets: Map<string, CultivationTarget> = new Map();

    private constructor() { }

    public static getInstance(): OmniCultivation {
        if (!OmniCultivation.instance) {
            OmniCultivation.instance = new OmniCultivation();
        }
        return OmniCultivation.instance;
    }

    /**
     * Nourish a target with knowledge.
     * Increases growth but can also increase entropy if data is noisy.
     */
    public async nourish(targetId: string, dataVolume: number, entropyFactor: number = 0.1): Promise<CultivationTarget> {
        let target = this.targets.get(targetId);
        if (!target) {
            target = {
                id: targetId,
                type: 'asset',
                growth: 0,
                entropy: 0.05,
                status: 'seedling',
                metadata: {}
            };
            this.targets.set(targetId, target);
        }

        // Apply Growth
        target.growth = Math.min(target.growth + dataVolume, 1.0);

        // Apply Entropy (Noisy ingestion increases chaos)
        target.entropy = Math.min(target.entropy + (dataVolume * entropyFactor), 1.0);

        // Update Status
        if (target.growth >= 1.0) target.status = 'tree';
        else if (target.growth > 0.5) target.status = 'sapling';

        omniLogger.info(LogCategory.BUSINESS, `[OmniCultivation] Nourished ${targetId}. Growth: ${(target.growth * 100).toFixed(2)}%, Entropy: ${(target.entropy * 100).toFixed(2)}%`);
        return target;
    }

    /**
     * Prune a target to stabilize logic.
     * Reduces entropy at the cost of slight growth reduction (refinement cost).
     */
    public async prune(targetId: string, intensity: number): Promise<CultivationTarget> {
        const target = this.targets.get(targetId);
        if (!target) throw new Error(`Target ${targetId} not found in cultivation garden.`);

        target.entropy = Math.max(target.entropy - intensity, 0);
        target.growth = Math.max(target.growth - (intensity * 0.1), 0); // Refinement involves discarding noise

        omniLogger.info(LogCategory.BUSINESS, `[OmniCultivation] Pruned ${targetId}. Entropy stabilized to ${(target.entropy * 100).toFixed(2)}%`);
        return target;
    }

    /**
     * Crystallize a mature target into a Sovereign Asset.
     * Requires high growth and low entropy.
     */
    public async crystallize(targetId: string): Promise<any> {
        const target = this.targets.get(targetId);
        if (!target) throw new Error(`Target ${targetId} not found.`);

        if (target.growth < 0.95) { // 95% mature
            throw new Error(`Target ${targetId} is not yet mature (Growth: ${(target.growth * 100).toFixed(2)}%). Need 95%+ to crystallize.`);
        }

        if (target.entropy > 0.15) { // 15% noise
            throw new Error(`Target ${targetId} has too much entropy (${(target.entropy * 100).toFixed(2)}%). Prune before crystallization.`);
        }

        target.status = 'crystal';
        omniLogger.info(LogCategory.BUSINESS, `[OmniCultivation] Asset manifested: ${targetId} is now a Sovereign Crystal.`);

        return {
            assetId: `omni_crystal_${targetId}`,
            type: target.type,
            seal: '5T_TRUST_LOCK',
            timestamp: Date.now()
        };
    }

    public getStatus(targetId: string): CultivationTarget | undefined {
        return this.targets.get(targetId);
    }
}

export const omniCultivation = OmniCultivation.getInstance();
