/**
 * ADK Search Workflow Types
 * Consistent with JunAiKey ESG Ecosystem & 5T Protocol
 */

export type SearchPhase = 'analyzing' | 'searching' | 'synthesizing' | 'reviewing' | 'completed' | 'error';

export interface SearchWorkflowProgress {
    phase: SearchPhase;
    percentage: number;
    message: string;
    timestamp: string;
}

export interface SearchResultItem {
    title: string;
    snippet: string;
    url?: string;
    source: string;
}

export interface SearchWorkflowState {
    query: string;
    originalIntent?: string;
    analysisResult?: string;
    searchResults: SearchResultItem[];
    synthesizedResponse?: string;
    sentientScore?: number;
    progress: SearchWorkflowProgress;
    steps: {
        id: string;
        name: string;
        status: 'pending' | 'active' | 'completed' | 'failed';
        details?: string;
    }[];
}

export interface SearchWorkflowConfig {
    maxDepth?: number;
    language?: 'zh-TW' | 'en';
    focusArea?: 'ESG' | 'Technical' | 'General';
}

export interface SearchFinalResponse {
    text: string;
    sources: SearchResultItem[];
    summary?: string;
    executionTime?: number;
    sentientScore?: number;
    metadata: {
        tokensUsed?: number;
        processingTimeMs: number;
        sentienceScore: number; // Part of 5T Protocol
    };
}
