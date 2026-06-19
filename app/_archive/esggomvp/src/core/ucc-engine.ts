// import * as crypto from 'crypto'; // Removed for browser compatibility
import { omniLogger, LogCategory } from './omniLogger';
import { IImpactMetric } from './omni-types';
import { OmniMapper } from './omni-mapper';

/**
 * 🔒 UCCEngine: Universal Chronicler Core
 * Responsibility: Enforcement of 5T Protocol: Truth, Trust, Transparency, Traceability, Tangibility.
 * Migrated to NoCodeBackend (NCB)
 */
export interface IEvidenceInput {
    formula: string;
    impactMetric: IImpactMetric;
    sourceOrigin: string;
    lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
    metadata?: Record<string, any>;
}


export interface IEvidenceOutput extends IEvidenceInput {
    uuid: string;
    timestamp: number;
    hash_lock: string;
}

export class UCCEngine {
    /**
     * 🔐 sealEvidence: Encapsulate data in an immutable Amber-Freeze.
     */
    public async sealEvidence(input: IEvidenceInput): Promise<IEvidenceOutput> {
        const timestamp = Date.now();

        // 1. Calculate Hash Lock [Trustworthy]
        const contentToHash = JSON.stringify({
            formula: input.formula,
            impactMetric: input.impactMetric,
            timestamp,
            sourceOrigin: input.sourceOrigin
        });

        let hashVal = 0;
        for (let i = 0; i < contentToHash.length; i++) {
            const char = contentToHash.charCodeAt(i);
            hashVal = ((hashVal << 5) - hashVal) + char;
            hashVal = hashVal & hashVal;
        }
        const hash_lock = `SH_${Math.abs(hashVal).toString(16)}`;

        const evidence: IEvidenceOutput = {
            ...input,
            uuid: `ucc-${Math.random().toString(36).slice(2, 11)}`,
            timestamp,
            hash_lock
        };

        // 2. Immutable Protection
        Object.freeze(evidence);

        omniLogger.info(LogCategory.SECURITY, `UCC: Evidence sealed with HashLock [${hash_lock.substring(0, 8)}...]`);

        return evidence;
    }

    /**
     * 🔍 verifyEvidence: Verify the integrity of a record from NCB.
     */
    public verifyIntegrity(record: any): boolean {
        const impactMetric = typeof record.impact_metric === 'string'
            ? OmniMapper.mapToType<IImpactMetric>(record.impact_metric)
            : record.impact_metric;

        const contentToHash = JSON.stringify({
            formula: record.formula,
            impactMetric,
            timestamp: Number(record.timestamp),
            sourceOrigin: record.source_origin
        });

        let hashVal = 0;
        for (let i = 0; i < contentToHash.length; i++) {
            const char = contentToHash.charCodeAt(i);
            hashVal = ((hashVal << 5) - hashVal) + char;
            hashVal = hashVal & hashVal;
        }
        const computedHash = `SH_${Math.abs(hashVal).toString(16)}`;
        return computedHash === record.hash_lock;
    }
}
