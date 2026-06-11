/**
 * ESGGO Sacred Contract v1.0
 * Shared TypeScript Definitions for Platform & Commander
 */
type ModelProvider = 'Google' | 'OpenRouter' | 'Mock';
interface OmniTask {
    id: string;
    taskType: 'report_drafting' | 'reasoning_analysis' | 'compliance_check' | 'test';
    title?: string;
    prompt: string;
    model?: string;
    includeReasoning?: boolean;
}
interface OmniExecution {
    id: string;
    taskId: string;
    modelProvider: ModelProvider;
    modelName: string;
    status: 'pending' | 'completed' | 'failed';
    startedAt: string;
    finishedAt?: string;
    reasoningLog?: string;
}
interface OmniArtifact {
    id: string;
    executionId: string;
    content: string;
    version: number;
}
interface OmniGatewayResponse {
    execution: OmniExecution;
    artifact: OmniArtifact;
    error?: string;
}
interface ESGMetric {
    category: 'Environmental' | 'Social' | 'Governance';
    name: string;
    value: number | string;
    unit: string;
    timestamp: string;
    integrityProof?: string;
}

export type { ESGMetric, ModelProvider, OmniArtifact, OmniExecution, OmniGatewayResponse, OmniTask };
