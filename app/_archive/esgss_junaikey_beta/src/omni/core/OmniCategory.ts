import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';
import { omniClassification } from './OmniClassification.ts';

/**
 * 🏛️ OmniCategory: The Sovereign Category (Classification/Type)
 * 
 * Concept: "萬能分類" (Universal Category) / "主權類別" (Sovereign Type)
 * 5T Alignment: Transparent (Taxonomy), Traceable (Hierarchy)
 * Role: Manages taxonomy, classification systems, tagging, and organization.
 */
export class OmniCategory {
    private static instance: OmniCategory;

    private constructor() { }

    public static getInstance(): OmniCategory {
        if (!OmniCategory.instance) {
            OmniCategory.instance = new OmniCategory();
        }
        return OmniCategory.instance;
    }

    /**
     * 分類標籤 (Classify/Tag)
     * @param item Item to classify
     * @param category Category name
     */
    public async classify(item: string, category: string): Promise<IVerifiedResponse> {
        const timestamp = Date.now();

        // Delegate to the more robust classification system
        await omniClassification.autoClassify(`${item} belongs to ${category}`);

        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `CATEGORY:CLASSIFY:${item}->${category}`,
            timestamp,
            source: 'OmniCategory',
            tags: ['category', 'classification', 'taxonomy'],
            payload: { item, category }
        };

        return {
            core: validRequest,
            message: `Classified ${item} as ${category}`,
            verified: true,
            data: {
                item,
                category,
                relevance: 'High'
            },
            source_origin: 'OmniCategory',
            five_t_ref: `CAT-${timestamp}`
        };
    }
}
