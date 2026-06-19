/**
 * OmniSupabase Type Definitions
 * --------------------------------------------------
 * [5T Protocol] & [OmniArchitecture] Support
 */

export type OmniSpaceEntityType = 'crystal' | 'knowledge' | 'nexus';

export interface IOmniSpaceEntity {
    id: string;
    type: OmniSpaceEntityType;
    data: Record<string, any>;
    version: number;
    created_at: string;
    updated_at: string;
    synced_at?: string;

    // [5T Protocol Metadata]
    metadata: {
        hash?: string;          // T5-Trustworthy
        source_origin?: string; // T2-Traceable
        impact_metric?: string; // T1-Tangible
        formula?: string;       // T4-Transparent
        path_log?: string[];    // T3-Trackable
        [key: string]: any;
    };
}

export interface IOmniTableRow {
    id: string;
    table_id: string;
    data: Record<string, any>;
    created_at: string;
    updated_at: string;

    // [Integration Keys]
    crystal_id?: string;
    knowledge_id?: string;
}

export interface IOmniKnowledgeSyncStatus {
    knowledge_id: string;
    synced: boolean;
    last_sync_at?: string;
    error?: string;
}

export interface IOmniEvolutionLog {
    id: string;
    version: number;
    timestamp: string;
    changes: Record<string, any>; // Description of schema/data changes
}

export interface OmniSupabaseConfig {
    enableAutoSync: boolean;        // default: true
    syncInterval: number;           // ms, default: 60000
    enableEvolution: boolean;       // default: true
    enableKnowledgeIntegration: boolean; // default: true
}

export interface IOmniSupabaseStats {
    omniSpaceEntities: number;
    omniTableRows: number;
    knowledgeSynced: number;
    evolutionVersion: number;
}

// [Awakening Hypercube Extensions]
export interface IHypercubeMetrics {
    // Dimension 1-4 (System)
    time_sync: number;
    benevolence: number;
    entropy: number;
    truth: number;

    // Dimension 5-8 (Community)
    sharing: number;
    stability: number;
    growth: number;
    harmony: number;

    // Dimension 9-12 (Trust/5T)
    traceable: number;
    trackable: number;
    calculable: number;
    immutable: number;
}

export interface IEvolutionProfile {
    level: number;
    runeExp: number;
    awakeningCount: number;
    tesseractNodes: number;
    dimensionalResonance: number;
    hypercubeMetrics: IHypercubeMetrics;
}
