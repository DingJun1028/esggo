import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { TrinityManager } from '../infrastructure/synchronization/TrinityManager.ts';
import { omniChain } from './OmniChain.ts';
import { IOmniComponent, IOmniKB, IOmniTag, TrinityComponentState, TrinityTagType, Protocol5T } from './types/InfoOne.types.ts';

/**
 * ?? OmniCard: The Sovereign Asset (Unit/Value)
 * 
 * Concept: "Â•ßÁ??°Á?" -> Á™ÅÁ†¥ -> "?¨ËÉΩ?°Á?" (Universal Card)
 * 5T Alignment: Tangible (Asset), Traceable (Ownership)
 */
export class OmniCard {
    private static instance: OmniCard;

    private constructor() { }

    public static getInstance(): OmniCard {
        if (!OmniCard.instance) {
            OmniCard.instance = new OmniCard();
        }
        return OmniCard.instance;
    }

    /**
     * Create or interact with a card, triggering breakthrough if necessary.
     */
    public async interact(cardId: string, action: 'deal' | 'play' | 'inspect'): Promise<any> {
        omniLogger.info(LogCategory.BUSINESS, `[OmniCard] ?? Interaction: ${action} on ${cardId}`);

        // 1. Forge a Trinity representation for this asset if it's a new interaction
        const manager = TrinityManager.getInstance();

        const component: IOmniComponent = {
            id: `CARD-COMP-${cardId}`,
            name: `Card Component: ${cardId}`,
            state: TrinityComponentState.READY,
            impactMetric: 'AssetValue',
            lifecyclePath: ['creation', action],
            execute: async () => { },
            cleanup: async () => { }
        };

        const knowledge: IOmniKB = {
            id: `CARD-KB-${cardId}`,
            content: `Crystallized value for asset ${cardId}. Action: ${action}`,
            sourceOrigin: 'OmniCard-System',
            tags: [Protocol5T.TANGIBLE],
            hashLock: ''
        };

        const identity: IOmniTag = {
            id: `CARD-TAG-${cardId}`,
            name: `Identity for ${cardId}`,
            type: TrinityTagType.IDENTITY,
            protocol: [Protocol5T.TRUSTWORTHY],
            signature: `SIG-CARD-${cardId}`,
            value: { cardId, action },
            createdAt: new Date()
        };

        const trinity = manager.forge(component, knowledge, identity);

        // 2. Breakthrough Trigger (ÊΩõËÉΩÁ™ÅÁ†¥)
        if (action === 'play') {
            omniLogger.info(LogCategory.SYSTEM, `[OmniCard] ?? Triggering POTENTIAL BREAKTHROUGH (?¨ËÉΩÁ™ÅÁ†¥) for ${trinity.uuid}`);
            const result = await omniChain.anchorAsset(trinity.uuid);
            return {
                trinity,
                breakthrough: result
            };
        }

        return { trinity };
    }
}

export const omniCard = OmniCard.getInstance();
