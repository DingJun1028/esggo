/**
 * 💡 Omni Core: Soul Migration Service (Deep Symbiosis Layer 5)
 * ----------------------------------------------------------------
 * Handles the "Soul Migration" Handshake Protocol.
 * Facilitates the transfer of the .omni state between Cloud (InfoOne) and Edge (Client).
 * 貫徹「上乘下啟」傳承機制：確保靈魂遷移的完整性
 */

import * as crypto from 'crypto';

import { InfoOneCore } from './InfoOneCore.ts';
import { OmniStateCompressor, IOmniState } from './OmniStateCompressor.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';


export interface IMigrationHandshake {
    readonly sessionId: string;
    readonly sourceNode: string;
    readonly targetNode: string;
    readonly status: 'INIT' | 'ACK' | 'SYNCING' | 'COMPLETE' | 'FAILED';
}

export class SoulMigrationService {
    private activeHandshake?: Readonly<IMigrationHandshake>;

    /**
     * 📤 Initiate Migration (Export Soul)
     * Compresses the core into .omni format and prepares for transmission.
     */
    async initiateMigration(core: InfoOneCore, targetNode: string): Promise<IOmniState> {
        omniLogger.info(LogCategory.SYSTEM, `[SoulMigration] Initiating migration for UUID: ${core.uuid} -> ${targetNode}`);

        // 1. Handshake Initialization (使用密碼學安全的隨機源)
        const handshake: IMigrationHandshake = {
            sessionId: crypto.randomUUID(),
            sourceNode: 'LOCAL_CORE',
            targetNode,
            status: 'INIT'
        };
        this.activeHandshake = Object.freeze(handshake);

        try {
            // 2. State Compression (The "Soul Packaging" ritual)
            const compressedState = await OmniStateCompressor.compress(core);

            this.activeHandshake = Object.freeze({ ...handshake, status: 'SYNCING' as const });
            omniLogger.debug(LogCategory.SYSTEM, `[SoulMigration] Handshake Established. Session: ${this.activeHandshake.sessionId}`);

            // 3. Simulate Network Transmission Delay (可配置的延遲)
            await new Promise(resolve => setTimeout(resolve, 800));

            this.activeHandshake = Object.freeze({ ...handshake, status: 'COMPLETE' as const });
            omniLogger.debug(LogCategory.SYSTEM, `[SoulMigration] Migration Package Ready (Size: ${compressedState.payload.length} chars).`);

            return compressedState;

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[SoulMigration] Migration Failed:`, error);
            this.activeHandshake = Object.freeze({ ...handshake, status: 'FAILED' as const });
            throw error;
        }
    }

    /**
     * 📥 Receive Migration (Import Soul)
     * Decompresses the .omni state and validates integrity.
     */
    async receiveMigration(omniState: IOmniState): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `[SoulMigration] Receiving Soul Package...`);

        // 1. Verification & Decompression
        try {
            const soulData = OmniStateCompressor.decompress(omniState);
            omniLogger.info(LogCategory.SYSTEM, `[SoulMigration] Soul Decanted Successfully. Welcome back, ${soulData.uuid}.`);
            omniLogger.debug(LogCategory.SYSTEM, `[SoulMigration] Traits: Level ${soulData.evolution?.level}, Arvo ${soulData.arvoStatus}`);
            return soulData;
        } catch (e) {
            omniLogger.error(LogCategory.VALIDATION, `[SoulMigration] Soul Integrity Breach!`, e);
            throw e;
        }
    }
}
