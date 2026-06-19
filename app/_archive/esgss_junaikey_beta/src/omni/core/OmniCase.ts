import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?’¼ OmniCase: The Sovereign Container (Context)
 * 
 * Concept: "?¬èƒ½æ¡ˆä»¶" (Universal Case) / "å°ˆæ??…å?" (Project Context)
 * 5T Alignment: Traceable (History), Trackable (Status)
 * Role: Encapsulates a specific unit of work, a project, or a problem-solving session.
 *       It holds the "State" of a specific mission.
 */
export class OmniCase {
    private static instance: OmniCase;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCase {
        if (!OmniCase.instance) {
            OmniCase.instance = new OmniCase();
        }
        return OmniCase.instance;
    }

    /**
     * Open a new case or retrieve an existing one.
     * @param caseId The unique identifier for the case (or 'new').
     * @param context Initial context or parameters.
     */
    public async open(caseId: string, context: Record<string, unknown>): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OPEN_CASE:${caseId}`,
            context,
            timestamp,
            source: 'OmniCase',
            tags: ['case', 'context', 'project']
        };

        console.log(`[OmniCase] ?’¼ Opening Case ${caseId}:`, context);

        return {
            core: manifest,
            message: `?’¼ OmniCase Opened: ${caseId}. Context initialized.`,
            verified: true
        };
    }
}
