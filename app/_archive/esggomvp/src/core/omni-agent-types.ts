import { v4 as uuidv4 } from 'uuid';

/**
 * 💎 IComponentCore: The universal soul of InfoOne components.
 * Ensuring every asset is Traceable, Trackable, and Trustworthy.
 */
export interface IComponentCore {
    readonly uuid: string;           // Global Unique Identity
    readonly version: string;        // Semantic Versioning
    readonly timestamp: number;      // Creation/Migration Timestamp
    readonly sourceOrigin: string;   // Traceable: Who created this?

    /** Evidence Vault: Immutable ledger of the component's journey */
    evidence: Array<{
        timestamp: number;
        source_origin: string;
        hook_event: string;
        data: any;
    }>;

    /** 🔒 Hash Lock: The cryptographic seal (assigned after Object.freeze) */
    readonly hash_lock?: string;
}

/**
 * 🌀 SacredCommand: The high-level intent processed by the Agent Network.
 */
export interface ISacredCommand {
    id: string;
    originator: string;
    intent: string;
    payload: any;
    tags: string[];
}

/**
 * 🛠️ OmniAgent: A specialized functional unit within the Wings of Light.
 */
export interface IOmniAgent {
    uuid: string;
    name: string;
    role: 'AUDITOR' | 'STRATEGIST' | 'FORGER' | 'OBSERVER';
    capabilities: string[];
}
