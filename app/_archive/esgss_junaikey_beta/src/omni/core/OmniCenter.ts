import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ??ï¸?OmniCenter: The Sovereign Hub (Heart/Core)
 * 
 * Concept: "?¬èƒ½ä¸­å?" (Universal Center) / "ä¸»æ??¸å?" (Sovereign Heart)
 * 5T Alignment: Trustworthy (Policy), Transparent (Governance)
 * Role: The central coordination point for the sovereign system. 
 *       It manages high-level policies, heartbeat, and alignment.
 */
export class OmniCenter {
    private static instance: OmniCenter;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCenter {
        if (!OmniCenter.instance) {
            OmniCenter.instance = new OmniCenter();
        }
        return OmniCenter.instance;
    }

    /**
     * Beat/Pulse - The heartbeat of the system.
     * Checks status and emits a pulse.
     */
    public async beat(): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `PULSE:BEAT`,
            timestamp,
            source: 'OmniCenter',
            tags: ['center', 'pulse', 'heartbeat']
        };

        console.log(`[OmniCenter] ??ï¸?Sovereign Heartbeat... (Thump-Thump)`);

        return {
            core: manifest,
            message: `??ï¸?OmniCenter: System Heartbeat Active.`,
            verified: true
        };
    }

    /**
     * Align - Ensure system alignment with core values.
     * @param directive The directive to align with.
     */
    public async align(directive: string): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `ALIGN:${directive}`,
            timestamp,
            source: 'OmniCenter',
            tags: ['center', 'align', 'policy']
        };

        console.log(`[OmniCenter] ??ï¸?Aligning System to Directive: ${directive}`);

        return {
            core: manifest,
            message: `??ï¸?OmniCenter: System Aligned to "${directive}".`,
            verified: true
        };
    }
}
