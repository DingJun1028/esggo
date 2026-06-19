import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { TrinityManager } from '../infrastructure/synchronization/TrinityManager.ts';
import { omniChain } from './OmniChain.ts';
import { IOmniComponent, IOmniKB, IOmniTag, TrinityComponentState, TrinityTagType, Protocol5T } from './types/InfoOne.types.ts';

/**
 * ?è´ OmniClass: The Sovereign Session (Unit/Interaction)
 * 
 * Concept: "Â•ßÁ??≠Á?" -> Á™ÅÁ†¥ -> "?¨ËÉΩ?≠Á?" (Universal Class)
 * 5T Alignment: Traceable (Participation), Tangible (Output)
 */
export class OmniClass {
    private static instance: OmniClass;

    private constructor() { }

    public static getInstance(): OmniClass {
        if (!OmniClass.instance) {
            OmniClass.instance = new OmniClass();
        }
        return OmniClass.instance;
    }

    /**
     * Schedule or start a learning session, triggering breakthrough.
     */
    public async session(topic: string): Promise<any> {
        omniLogger.info(LogCategory.BUSINESS, `[OmniClass] ?è´ Starting Session: ${topic}`);

        const manager = TrinityManager.getInstance();

        const component: IOmniComponent = {
            id: `CLASS-COMP-${topic.replace(/\s+/g, '_')}`,
            name: `Class Session: ${topic}`,
            state: TrinityComponentState.READY,
            impactMetric: 'LearningResonance',
            lifecyclePath: ['curriculum', 'interaction'],
            execute: async () => { },
            cleanup: async () => { }
        };

        const knowledge: IOmniKB = {
            id: `CLASS-KB-${topic.replace(/\s+/g, '_')}`,
            content: `Sovereign session knowledge for "${topic}".`,
            sourceOrigin: 'OmniClass-System',
            tags: [Protocol5T.TRACEABLE],
            hashLock: ''
        };

        const identity: IOmniTag = {
            id: `CLASS-TAG-${topic.replace(/\s+/g, '_')}`,
            name: `Identity for Session ${topic}`,
            type: TrinityTagType.IDENTITY,
            protocol: [Protocol5T.TRUSTWORTHY],
            signature: `SIG-CLASS-${topic}`,
            value: { topic },
            createdAt: new Date()
        };

        const trinity = manager.forge(component, knowledge, identity);

        // Breakthrough Trigger (ÊΩõËÉΩÁ™ÅÁ†¥): Class start implies commitment
        omniLogger.info(LogCategory.SYSTEM, `[OmniClass] ?? Breakthrough Initiated for Session: ${topic}`);
        const result = await omniChain.anchorAsset(trinity.uuid);

        return {
            trinity,
            breakthrough: result
        };
    }
}

export const omniClass = OmniClass.getInstance();
