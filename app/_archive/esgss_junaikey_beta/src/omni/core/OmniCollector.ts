import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger';
import { omniCoin } from './OmniCoin';
import { IInfoOneTrinity } from './types/InfoOne.types';

/**
 * ?è∫ OmniCollector: The Sovereign Asset Harvester.
 * ===============================================
 * [?¨Ë≥™] ?êÈ??ÅÁÆ°?ÜË?Â±ïÁ§∫?®Êà∂?®„ÄåÂ??ëÁ??É„Äç‰∏≠?≤Â??ÑÁü•Ë≠òË??¢„Ä?
 * [EN] Collects, manages, and displays knowledge assets acquired in the Impact Nexus.
 */
export interface CollectedAsset {
    id: string;
    entity: IInfoOneTrinity;
    collectedAt: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Omni';
}

export class OmniCollector {
    private static instance: OmniCollector;
    private collections: Map<string, CollectedAsset[]> = new Map();

    private constructor() { }

    public static getInstance(): OmniCollector {
        if (!OmniCollector.instance) {
            OmniCollector.instance = new OmniCollector();
        }
        return OmniCollector.instance;
    }

    /**
     * Collect a sentient asset (Trinity Entity) into a user's portfolio.
     */
    public async collect(userId: string, entity: IInfoOneTrinity): Promise<CollectedAsset> {
        const userAssets = this.collections.get(userId) || [];

        // Check if already collected
        if (userAssets.find(a => a.entity.uuid === entity.uuid)) {
            omniLogger.warn(LogCategory.BUSINESS, `[OmniCollector] ?è∫ Asset ${entity.uuid} already in ${userId}'s collection.`);
            return userAssets.find(a => a.entity.uuid === entity.uuid)!;
        }

        const asset: CollectedAsset = {
            id: `col-${Date.now()}`,
            entity,
            collectedAt: Date.now(),
            rarity: this.determineRarity(entity)
        };

        userAssets.push(asset);
        this.collections.set(userId, userAssets);

        omniLogger.info(LogCategory.BUSINESS, `[OmniCollector] ??Asset Collected: ${entity.uuid} by ${userId}. Rarity: ${asset.rarity}`);

        // Reward the collector with OmniCoin
        const rewardAmount = this.getRewardAmount(asset.rarity);
        await omniCoin.mint(userId, rewardAmount, `Harvest Reward: ${entity.uuid}`);

        return asset;
    }

    private determineRarity(entity: IInfoOneTrinity): 'Common' | 'Rare' | 'Epic' | 'Omni' {
        // Simple rarity logic based on breakthrough status (if we had it in entity)
        // For now, let's use a random distribution or based on metadata
        const rand = Math.random();
        if (rand > 0.95) return 'Omni';
        if (rand > 0.8) return 'Epic';
        if (rand > 0.5) return 'Rare';
        return 'Common';
    }

    private getRewardAmount(rarity: string): number {
        switch (rarity) {
            case 'Omni': return 1000;
            case 'Epic': return 500;
            case 'Rare': return 200;
            default: return 50;
        }
    }

    public getCollection(userId: string): CollectedAsset[] {
        return this.collections.get(userId) || [];
    }
}

export const omniCollector = OmniCollector.getInstance();
