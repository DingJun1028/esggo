/**
 * OmniAgentAwakening - Ultimate Awakening Protocol
 * Implements the six Celestial-Command loops
 */
export interface UserIntent {
    description: string;
    context?: string;
}
/**
 * Execute the awakened sovereignty cycle
 */
export declare const executeAwakenedSovereignty: (intent: UserIntent) => Promise<{
    uuid: string;
    purified: boolean;
    hashLock: string;
}>;
//# sourceMappingURL=OmniAgentAwakening.d.ts.map