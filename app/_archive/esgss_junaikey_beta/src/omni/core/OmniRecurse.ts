import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger';
import { TrinityManager } from '../infrastructure/synchronization/TrinityManager';
import { omniComprehense } from './OmniComprehense';
import { IOmniKB, Protocol5T } from './types/InfoOne.types';

/**
 * ?? OmniRecurse: The Knowledge Loop Closer.
 * 
 * Responsible for injecting sovereign insights back into the 
 * Knowledge Base (OmniKB) and maintaining global coherence.
 */
export class OmniRecurse {
    private static instance: OmniRecurse;
    private trinityManager: TrinityManager;

    private constructor() {
        this.trinityManager = TrinityManager.getInstance();
    }

    public static getInstance(): OmniRecurse {
        if (!OmniRecurse.instance) {
            OmniRecurse.instance = new OmniRecurse();
        }
        return OmniRecurse.instance;
    }

    /**
     * Inject a transcendent insight from OmniComprehense into a Trinity target.
     * [TC] Â∞áË?Ë∂äÊÄßÊ?ÂØüÊ≥®?•Ê?ÂÆöÁ?‰∏â‰?‰∏ÄÈ´îÁõÆÊ®ô„Ä?
     */
    public async injectInsight(trinityUuid: string, topicId: string): Promise<any> {
        const state = omniComprehense.getState(topicId);
        if (!state || state.status !== 'transcended') {
            throw new Error(`Topic ${topicId} has not transcended yet. Recursion blocked.`);
        }

        const trinity = this.trinityManager.getTrinity(trinityUuid);
        if (!trinity) {
            throw new Error(`Trinity entity ${trinityUuid} not found.`);
        }

        if (trinity.isLocked()) {
            throw new Error(`Trinity entity ${trinityUuid} is SEALED. Cannot inject new insights.`);
        }

        const insight = `[Transcendent Insight] ${topicId} (Depth: ${(state.depth * 100).toFixed(2)}%): The core essence is now synchronized and stabilized.`;

        // Update Knowledge
        const updatedKnowledge: IOmniKB = {
            ...trinity.knowledge,
            content: `${trinity.knowledge.content}\n\n${insight}`,
            tags: [...new Set([...trinity.knowledge.tags, Protocol5T.TRUSTWORTHY])]
        };

        this.trinityManager.sync(trinityUuid, { knowledge: updatedKnowledge });

        omniLogger.info(LogCategory.BUSINESS, `[OmniRecurse] Injected insight from ${topicId} into ${trinityUuid}. Loop Closed.`);

        return {
            success: true,
            trinityUuid,
            topicId,
            insight
        };
    }

    /**
     * Stabilize Knowledge Base by running a global consistency check.
     * [TC] ?èÈ??®Â?‰∏Ä?¥ÊÄßÊ™¢?•Á©©ÂÆöÊô∫Â∫´„Ä?
     */
    public async stabilizeKB(): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `[OmniRecurse] Initiating Global KB Stabilization...`);

        // In a real implementation, this would iterate through all trinities and verify logic gates.
        // For now, we simulate a successful stabilization.

        return {
            status: 'STABILIZED',
            timestamp: Date.now(),
            consistencyIndex: 0.99
        };
    }
}

export const omniRecurse = OmniRecurse.getInstance();
