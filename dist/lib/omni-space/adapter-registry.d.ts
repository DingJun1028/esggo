/**
 * 🗃️ OmniSpace Adapter Registry
 * v1.0 | #OmniSpace #AdapterGovernance
 *
 * Central registry for all OmniSpace-compatible agent adapters.
 */
import type { TranscriptEntry, InferenceProvider, OmniAgentSkill } from './omniagent-adapter';
export interface AdapterManifest {
    adapterId: string;
    name: string;
    version: string;
    capabilities: string[];
    execute: (sessionId: string, prompt: string, context?: unknown) => Promise<TranscriptEntry[]>;
    detectModel: () => Promise<{
        model: string;
        provider: InferenceProvider;
    }>;
    listSkills: () => Promise<OmniAgentSkill[]>;
}
export declare class AdapterRegistry {
    private adapters;
    constructor();
    private initDefaultAdapters;
    registerAdapter(manifest: AdapterManifest): void;
    getAdapter(adapterId: string): AdapterManifest | undefined;
    listAdapters(): AdapterManifest[];
}
export declare const adapterRegistry: AdapterRegistry;
//# sourceMappingURL=adapter-registry.d.ts.map