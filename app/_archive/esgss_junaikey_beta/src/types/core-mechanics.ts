/**
 * 💡 Core Type Definitions
 * Shared types that don't fit into specific domain schemas yet.
 */

export type RuneCategory =
    | 'PERCEPTION'
    | 'REASONING'
    | 'ACTION'
    | 'CREATIVITY'
    | 'DEFENSE'
    | 'LEARNING'
    | 'SECURITY';

export interface Rune {
    id: string;
    name: string;
    category: RuneCategory;
    complexity: number;
    baseModel: string;

    // Proficiency & Evolution State
    proficiency: {
        level: number;
        usageCount: number;
        successRate: number;
        experience: number;
    };

    // Adaption stats
    adaptiveStats: {
        focusEfficiency: number;
        reasoningDepth: number;
        hallucinationResistance: number;
    };
}
