// frontend/src/lib/ucc-engine.ts
import { EvidenceInput, EvidenceOutput } from '../types/evidence';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🔒 UCC Engine: Universal Cryptographic Core
 * The "Seal" of the 5T Protocol.
 */
export class UCCEngine {
    /**
     * Seals data with a cryptographic hash lock.
     * Supports both raw EvidenceInput and File objects.
     */
    async sealEvidence(input: EvidenceInput | File | any): Promise<EvidenceOutput> {
        const timestamp = Date.now();
        const uuid = uuidv4();

        // Convert input to a deterministic string for hashing
        let content: string;
        let formula = 'N/A';
        let impact_metric: any = {};
        let source_origin = 'OmniAPI';
        let lifecycle_stage = 'verified';
        let metadata = {};

        if (input instanceof File) {
            const arrayBuffer = await input.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            content = this.bufferToHex(hashBuffer);
            source_origin = `FILE_UPLOAD:${input.name}`;
            metadata = { fileName: input.name, fileSize: input.size };
        } else {
            formula = input.formula || 'N/A';
            impact_metric = input.impactMetric || {};
            source_origin = input.sourceOrigin || 'OmniAPI';
            lifecycle_stage = input.lifecycleStage || 'verified';
            metadata = input.metadata || {};
            content = JSON.stringify({ uuid, timestamp, formula, impact_metric });
        }

        const msgUint8 = new TextEncoder().encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashHex = this.bufferToHex(hashBuffer);

        return {
            uuid,
            timestamp,
            formula,
            impact_metric,
            hash_lock: hashHex,
            source_origin,
            lifecycle_stage,
            metadata,
            created_at: new Date().toISOString()
        };
    }

    /**
     * Verifies if evidence integrity is maintained.
     */
    async verifyEvidence(evidence: EvidenceOutput): Promise<boolean> {
        const partialData = {
            uuid: evidence.uuid,
            timestamp: evidence.timestamp,
            formula: evidence.formula,
            impact_metric: evidence.impact_metric
        };
        const content = JSON.stringify(partialData);
        const msgUint8 = new TextEncoder().encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const recomputedHash = this.bufferToHex(hashBuffer);
        return recomputedHash === evidence.hash_lock;
    }

    private bufferToHex(buffer: ArrayBuffer): string {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}
