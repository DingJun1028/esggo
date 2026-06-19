import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ??ï¸?OmniCustom: The Sovereign Adaptation (Customization/Settings)
 * 
 * Concept: "?¬èƒ½å®¢è£½" (Universal Custom) / "ä¸»æ?å®¢è£½" (Sovereign Custom)
 * 
 * Role:
 * - Manages user-specific preferences, configurations, and adaptive behaviors.
 * - Allows the sovereign entity to adapt to individual user needs.
 * - Stores and retrieves custom settings with 5T lineage.
 * 
 * 5T Protocol Level: Traceable (User Choice), Transparent (Configuration)
 */
export class OmniCustom {
    private static instance: OmniCustom;
    private core: OmniCore;
    private preferences: Map<string, any> = new Map();

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCustom {
        if (!OmniCustom.instance) {
            OmniCustom.instance = new OmniCustom();
        }
        return OmniCustom.instance;
    }

    /**
     * ??ï¸?Adapt: Apply a custom setting or preference.
     * @param key The setting key.
     * @param value The setting value.
     */
    public async adapt(key: string, value: any): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        this.preferences.set(key, value);

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `CUSTOM:ADAPT ${key}=${JSON.stringify(value)}`,
            timestamp,
            source: 'OmniCustom',
            tags: ['custom', 'preference', 'setting', 'adaptation'],
            payload: { key, value }
        };

        console.log(`[OmniCustom] ??ï¸?Adapting Sovereign Preference: [${key}] = ${JSON.stringify(value)}`);

        return {
            core: manifest,
            message: `??ï¸?OmniCustom: Preference "${key}" updated.`,
            verified: true,
            source_origin: 'OmniCustom',
            five_t_ref: `CUSTOM_ADAPT_${timestamp}`
        };
    }

    /**
     * ??ï¸?Retrieve: Get a custom setting.
     */
    public getPreference(key: string): any {
        return this.preferences.get(key);
    }
}
