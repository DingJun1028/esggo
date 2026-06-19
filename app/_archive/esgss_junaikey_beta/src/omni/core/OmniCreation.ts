import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ??ï¸?OmniCreation: The Sovereign Factory (Studio/Origin)
 * 
 * Concept: "?¬èƒ½?µé€? (Universal Creation) / "ä¸»æ?å·¥å?" (Sovereign Studio)
 * 5T Alignment: Tangible (Output), Traceable (Origin)
 * Role: The central factory or studio for generating new sovereign entities (Cards, Canvases, etc.).
 *       It orchestrates the creative process.
 */
export class OmniCreation {
    private static instance: OmniCreation;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCreation {
        if (!OmniCreation.instance) {
            OmniCreation.instance = new OmniCreation();
        }
        return OmniCreation.instance;
    }

    /**
     * Spark a new creation.
     * @param type The type of entity to create (e.g., 'card', 'canvas', 'universe').
     * @param params Creation parameters.
     */
    public async spark(type: string, params: Record<string, unknown>): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND', // Adapted to match IVerifiedResponse restriction
            content: `SPARK:${type}`,
            timestamp,
            source: 'OmniCreation',
            tags: ['creation', 'spark', 'factory']
        };

        console.log(`[OmniCreation] ??ï¸?Sparking creation of: ${type}`, params);

        return {
            core: manifest,
            message: `??ï¸?OmniCreation Studio: Sparked new "${type}".`,
            verified: true
        };
    }
}
