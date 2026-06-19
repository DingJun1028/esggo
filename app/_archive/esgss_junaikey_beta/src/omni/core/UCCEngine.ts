/**
 * ucc-engine.ts
 * [5T Core] Universal Component Core Engine
 */

import { v4 as uuidv4 } from 'uuid';

export interface EvidenceInput {
    formula: string;
    impactMetric: Record<string, any>;
    sourceOrigin: string;
    lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
    metadata?: Record<string, any>;
}

export interface IEvidenceAsset {
    uuid: string;
    timestamp: number;
    formula: string;
    impact_metric: Record<string, any>;
    hash_lock: string;
    source_origin: string;
    lifecycle_stage: string;
    metadata: Record<string, any>;
    created_at: number;
}

export class UCCEngine {
    /**
     * Seal data into a 5T-compliant Evidence Asset
     */
    public async sealEvidence(input: EvidenceInput): Promise<IEvidenceAsset> {
        const timestamp = Date.now();
        const uuid = uuidv4();

        // Prepare data for hashing
        const dataToHash = {
            uuid,
            timestamp,
            formula: input.formula,
            impact_metric: input.impactMetric
        };

        const hash_lock = await this.calculateHash(dataToHash);

        return {
            uuid,
            timestamp,
            formula: input.formula,
            impact_metric: input.impactMetric,
            hash_lock,
            source_origin: input.sourceOrigin,
            lifecycle_stage: input.lifecycleStage,
            metadata: input.metadata || {},
            created_at: timestamp
        };
    }

    /**
     * Verify the integrity of an asset against its Hash Lock
     */
    public async verifyEvidence(asset: IEvidenceAsset): Promise<boolean> {
        const dataToHash = {
            uuid: asset.uuid,
            timestamp: asset.timestamp,
            formula: asset.formula,
            impact_metric: asset.impact_metric
        };

        const computedHash = await this.calculateHash(dataToHash);
        return computedHash === asset.hash_lock;
    }

    private async calculateHash(data: object): Promise<string> {
        const msg = JSON.stringify(data);
        const msgBuffer = new TextEncoder().encode(msg);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

export const uccEngine = new UCCEngine();
