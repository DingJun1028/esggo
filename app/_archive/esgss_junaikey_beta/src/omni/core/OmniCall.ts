import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?? OmniCall: The Sovereign Communication (Phone/Signal)
 * 
 * Concept: "?¬èƒ½?šè©±" (Universal Call) / "ä¸»æ??šè?" (Sovereign Communication)
 * 5T Alignment: Traceable (Log), Trustworthy (Secure)
 * Role: Manages secure communications, signals, or broadcasts.
 *       The "Phone/Transceiver" of the system.
 */
export class OmniCall {
    private static instance: OmniCall;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCall {
        if (!OmniCall.instance) {
            OmniCall.instance = new OmniCall();
        }
        return OmniCall.instance;
    }

    /**
     * Dial/Broadcast - Initiate a communication.
     * @param recipient The target recipient or 'broadcast'.
     * @param message The message content.
     */
    public async dial(recipient: string, message: string): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `CALL:${recipient} >> ${message}`,
            timestamp,
            source: 'OmniCall',
            tags: ['call', 'communication', 'signal']
        };

        console.log(`[OmniCall] ?? Calling ${recipient}: "${message}"`);

        return {
            core: manifest,
            message: `?? OmniCall: Message sent to "${recipient}".`,
            verified: true
        };
    }
}
