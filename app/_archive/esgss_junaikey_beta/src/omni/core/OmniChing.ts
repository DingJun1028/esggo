import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.js';

export enum OmniChingCategory {
    WISDOM_RESOLUTION = 'WISDOM_RESOLUTION',
    ADAPTATION = 'ADAPTATION',
    CREATIVITY = 'CREATIVITY',
    CONFLICT = 'CONFLICT',
    RELATIONSHIPS = 'RELATIONSHIPS'
}

export interface OmniChingEntry {
    symbol: string;
    meaning: string;
    category: OmniChingCategory;
    description?: string;
    judgment?: string;
    image?: string;
}

export class OmniChing {
    consult(query: string) {
        omniLogger.info(LogCategory.BUSINESS, `🔮 OmniChing: Consulting for query: ${query}`);
        return {
            hexagram: '䷀',
            meaning: 'The Creative',
            judgment: 'Perseverance furthers.'
        };
    }
}

export const omniChing = new OmniChing();

export const hexagrams: OmniChingEntry[] = [
    {
        symbol: '䷀',
        meaning: 'The Creative. Heaven. Strength, Persistence.',
        category: OmniChingCategory.WISDOM_RESOLUTION,
        description: 'Possessing the power of the air. The dragon flying in the heavens.',
        judgment: 'The Creative works sublime success, furthering through perseverance.'
    },
    {
        symbol: '䷁',
        meaning: 'The Receptive. Earth. Yielding, Devotion.',
        category: OmniChingCategory.ADAPTATION,
        description: 'The mare. Responsive devotion.',
        judgment: 'The Receptive brings about sublime success.'
    }
];

export function getHexagram(index: number): OmniChingEntry | undefined {
    if (index < 0 || index >= hexagrams.length) {
        return undefined;
    }
    return hexagrams[index];
}
