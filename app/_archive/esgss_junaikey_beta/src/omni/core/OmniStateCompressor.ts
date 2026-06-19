/**
 * 💡 Omni Core: State Compressor (.omni)
 * ----------------------------------------------------------------
 * Implements Layer 3/5 Data Optimization.
 * Compresses component state into a portable encrypted .omni format
 * for "Soul Migration" (WebSocket Sync) or storage.
 */

import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { InfoOneCore } from './InfoOneCore.ts';

export interface IOmniState {
    uuid: string;
    version: string;
    timestamp: number;
    payload: string; // Base64 Encoded Compressed JSON
    signature: string; // Hash signature
}

export class OmniStateCompressor {

    /**
     * Compresses an InfoOne Core into a .omni state object
     */
    static async compress(core: InfoOneCore): Promise<IOmniState> {
        omniLogger.debug(LogCategory.SYSTEM, `[OmniCompressor] Compressing core: ${core.uuid}...`);

        // 1. Extract Essential Data (Soul)
        const soulData = {
            uuid: core.uuid,
            virtues: core.virtues,
            evolution: core.evolutionProfile,
            attributes: core.partnerAttributes,
            arvoStatus: core.arvoStatus,
            timestamp: Date.now()
        };

        // 2. Serialize and Minify
        const jsonString = JSON.stringify(soulData);

        // 3. Encode (Simulate Compression/Encryption)
        // In production, use zlib/gzip and AES encryption
        const compressedPayload = btoa(jsonString);

        // 4. Generate Signature (Simulate SHA-256)
        const signature = this.mockHash(compressedPayload + core.uuid);

        omniLogger.debug(LogCategory.SYSTEM, `[OmniCompressor] Compression Complete. Size: ${compressedPayload.length} bytes.`);

        return {
            uuid: core.uuid,
            version: '1.0.omni',
            timestamp: Date.now(),
            payload: compressedPayload,
            signature
        };
    }

    /**
     * Decompresses a .omni state object back into raw data
     */
    static decompress(state: IOmniState): any {
        omniLogger.debug(LogCategory.SYSTEM, `[OmniCompressor] Decompressing state: ${state.uuid}...`);

        // Verify Signature (Simple check)
        const expectedSig = this.mockHash(state.payload + state.uuid);
        if (state.signature !== expectedSig) {
            throw new Error('[OmniCompressor] Signature Mismatch! Data validation failed.');
        }

        // Decode
        const jsonString = atob(state.payload);
        return JSON.parse(jsonString);
    }

    private static mockHash(input: string): string {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'sig_' + Math.abs(hash).toString(16);
    }
}
