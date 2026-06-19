// frontend/src/types/evidence.ts
export interface EvidenceInput {
    formula: string;
    impactMetric: Record<string, unknown>;
    sourceOrigin: string;
    lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
    metadata?: Record<string, unknown>;
}

export interface EvidenceOutput {
    uuid: string;
    timestamp: number;
    formula: string;
    impact_metric: Record<string, unknown>;
    hash_lock: string;
    source_origin: string;
    lifecycle_stage: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: {
        timestamp: number;
        requestId: string;
    };
}
