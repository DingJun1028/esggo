import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?ôÔ? OmniConfig: The Sovereign Configuration (Settings/Parameters)
 * 
 * Concept: "?¨ËÉΩ?çÁΩÆ" (Universal Configuration) / "‰∏ªÊ??çÁΩÆ" (Sovereign Configuration)
 * 5T Alignment: Traceable (Config Changes), Transparent (Parameter Logic)
 * Role: Manages system-wide parameters, feature flags, and sovereign-level configurations.
 */
export class OmniConfig {
    private static instance: OmniConfig;
    private core: OmniCore;
    private configStore: Map<string, any> = new Map();

    private constructor() {
        this.core = OmniCore.getInstance();
        // Initialize with core defaults if needed
    }

    public static getInstance(): OmniConfig {
        if (!OmniConfig.instance) {
            OmniConfig.instance = new OmniConfig();
        }
        return OmniConfig.instance;
    }

    /**
     * Set a sovereign configuration parameter.
     * @param key The configuration key.
     * @param value The value to set.
     */
    public async set(key: string, value: any): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        this.configStore.set(key, value);

        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OmniConfig Set: [${key}] = ${JSON.stringify(value)}`,
            timestamp,
            source: 'OmniConfig',
            tags: ['config', 'settings', 'parameter', 'sovereign'],
            payload: { key, value }
        };

        console.log(`[OmniConfig] ?ôÔ? Configuration Set: [${key}]`);

        return {
            core: validRequest,
            message: `?ôÔ? OmniConfig: Parameter [${key}] has been updated.`,
            verified: true
        };
    }

    /**
     * Get a sovereign configuration parameter.
     * @param key The configuration key.
     */
    public async get(key: string): Promise<IVerifiedResponse> {
        const value = this.configStore.get(key);
        const timestamp = Date.now();

        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'QUERY',
            content: `OmniConfig Get: [${key}]`,
            timestamp,
            source: 'OmniConfig',
            tags: ['config', 'query', 'parameter'],
            payload: { key, value }
        };

        return {
            core: validRequest,
            message: `?ôÔ? OmniConfig: Retrieved [${key}].`,
            verified: true,
            data: value
        };
    }
}
