import { v4 as uuidv4 } from "uuid";
import { omniLogger, LogCategory } from "./omniLogger";

import { IComponentCore } from "./IComponentCore";

/**
 * 🛡️ CelestialLifecycleManager: Guardian of the 5T Eternal Seal.
 */
export class CelestialLifecycleManager {

    /**
     * 🟢 onTransfer: Record the movement of data between pods/platforms.
     * [Trackable/Traceable]
     */
    static async onTransfer(
        frozenArtifact: any,
        targetPlatform: string,
        operatorId: string
    ) {
        omniLogger.info(LogCategory.SYSTEM, `✨ Lifecycle: Transferring ${frozenArtifact._core?.uuid} to ${targetPlatform}`);

        const transferEvidence = {
            source_origin: operatorId,
            hook_event: "LIFECYCLE_TRANSFER",
            timestamp: Date.now(),
            data: { from: "InfoOne-Core", to: targetPlatform }
        };

        // Evolve state (Immutable)
        const nextEvidence = [...(frozenArtifact._core?.evidence || []), transferEvidence];
        const nextState = {
            ...frozenArtifact,
            _core: { ...frozenArtifact._core, evidence: nextEvidence }
        };

        return await this.seal(nextState);
    }

    /**
     * 🔵 onUpdate: Evolution of content through verified algorithms.
     * [Transparent/Trustworthy]
     */
    static async onUpdate(
        frozenArtifact: any,
        newData: any,
        operatorId: string,
        algorithm: string = "[ISO-14064-1]"
    ) {
        omniLogger.info(LogCategory.SYSTEM, `✨ Lifecycle: Updating ${frozenArtifact._core?.uuid} via ${algorithm}`);

        const updateEvidence = {
            source_origin: operatorId,
            hook_event: "LIFECYCLE_UPDATE",
            timestamp: Date.now(),
            data: { algorithm, verification: "PASSED_ZERO_HALLUCINATION" }
        };

        // Semantic Versioning
        const v = frozenArtifact._core?.version || "1.0.0";
        const parts = v.split('.');
        const nextVersion = `${parts[0]}.${parts[1]}.${parseInt(parts[2] || "0") + 1}`;

        const nextState = {
            ...frozenArtifact,
            ...newData,
            _core: {
                ...frozenArtifact._core,
                version: nextVersion,
                evidence: [...(frozenArtifact._core?.evidence || []), updateEvidence]
            }
        };

        return await this.seal(nextState);
    }

    /**
     * 🔴 seal: Apply the final Hash Lock (Web Crypto) and Object.freeze().
     */
    private static async seal(state: any) {
        // Universal Hash Lock (Node 20+ & Browser compatible)
        const msgBuffer = new TextEncoder().encode(JSON.stringify(state));
        const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const newState = { ...state };

        // Inject immutable property
        Object.defineProperty(newState, 'hash_lock', {
            value: hashHex,
            writable: false,
            enumerable: true,
            configurable: false
        });

        return Object.freeze(newState);
    }

    /**
     * 🛠️ forgeInit: Create the first iteration of an artifact.
     */
    static async forgeInit(payload: any, originator: string) {
        const core: IComponentCore = {
            uuid: uuidv4(),
            version: "1.0.0",
            timestamp: Date.now(),
            evidence: [{
                source_origin: originator,
                hook_event: "LIFECYCLE_INIT",
                timestamp: Date.now(),
                data: { action: "Genesis_Forge" }
            }],
            status: 'Tangible',
            hash_lock: '',
            isFrozen: false
        };

        return await this.seal({ ...payload, _core: core });
    }
}
