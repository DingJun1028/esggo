import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?îÔ? OmniConflict: The Sovereign Conflict (Dispute/Resolution)
 * 
 * Concept: "?¨ËÉΩË°ùÁ?" (Universal Conflict) / "‰∏ªÊ?Ë™øËß£" (Sovereign Resolution)
 * 5T Alignment: Transparent (Rationale), Trustworthy (Fairness)
 * Role: Manages system conflicts, data divergent states, and dispute resolution logic.
 *       It ensures the system stays in a "Balanced" (OmniBalance) state even when friction occurs.
 */
export class OmniConflict {
    private static instance: OmniConflict;
    private conflicts: Map<string, any> = new Map();

    private constructor() { }

    public static getInstance(): OmniConflict {
        if (!OmniConflict.instance) {
            OmniConflict.instance = new OmniConflict();
        }
        return OmniConflict.instance;
    }

    /**
     * ?ö© Report Conflict
     * @param source The service/entity reporting the conflict
     * @param description Nature of the conflict
     * @param data Evidence data
     */
    public async report(source: string, description: string, data: any): Promise<IVerifiedResponse> {
        const conflictId = `CF-ID-${Date.now()}`;
        const record = { conflictId, source, description, data, status: 'open', reportedAt: Date.now() };
        this.conflicts.set(conflictId, record);

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OmniConflict Reported: [${source}] ${description}`,
            timestamp: Date.now(),
            source: 'OmniConflict',
            tags: ['conflict', 'governance', 'resolution'],
            payload: { conflictId, source }
        };

        console.warn(`[OmniConflict] ?îÔ? Conflict Identified: ${conflictId} from ${source}`);

        return {
            core: manifest,
            message: 'Conflict Registered in Resolution Chamber',
            verified: true,
            data: record,
            source_origin: 'OmniConflict',
            five_t_ref: conflictId
        };
    }

    /**
     * ?ñÔ? Mediate Conflict
     * @param conflictId The ID of the conflict to resolve
     * @param strategy Resolution strategy
     */
    public async mediate(conflictId: string, strategy: string): Promise<IVerifiedResponse> {
        const record = this.conflicts.get(conflictId);
        if (record) {
            record.status = 'mediated';
            record.strategy = strategy;
            record.resolvedAt = Date.now();
        }

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OmniConflict Mediate: ${conflictId} using ${strategy}`,
            timestamp: Date.now(),
            source: 'OmniConflict',
            tags: ['conflict', 'mediation', 'resolution'],
            payload: { conflictId, strategy }
        };

        return {
            core: manifest,
            message: record ? 'Conflict Mediation Complete' : 'Conflict Not Found',
            verified: !!record,
            data: record || { conflictId, status: 'not_found' },
            source_origin: 'OmniConflict',
            five_t_ref: conflictId
        };
    }
}
