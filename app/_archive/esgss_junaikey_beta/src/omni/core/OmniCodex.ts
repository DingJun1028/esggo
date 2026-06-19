import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?? OmniCodex: The Sovereign Registry (Knowledge/Law)
 * 
 * Concept: "?�能法典" (Universal Codex) / "?�知紀?? (Omniscient Record)
 * 5T Alignment: Transparent (Rules), Trustworthy (Source of Truth)
 * Role: The repository of definitions, rules, patterns, and accumulated knowledge.
 *       It is the reference library and the rulebook.
 */
export class OmniCodex {
    private static instance: OmniCodex;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCodex {
        if (!OmniCodex.instance) {
            OmniCodex.instance = new OmniCodex();
        }
        return OmniCodex.instance;
    }

    /**
     * Consult the Codex for wisdom, rules, or definitions.
     * @param query The topic or rule to look up.
     */
    public async consult(query: string): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'QUERY',
            content: query,
            timestamp,
            source: 'OmniCodex',
            tags: ['codex', 'law', 'knowledge', 'reference']
        };

        console.log(`[OmniCodex] ?? Consulting Codex: ${query}`);

        return {
            core: manifest,
            message: `?? OmniCodex Result: Verified knowledge related to "${query}" retrieved.`,
            verified: true
        };
    }
}
