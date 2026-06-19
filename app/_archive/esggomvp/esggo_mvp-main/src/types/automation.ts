export interface AutomationPayload {
    atomId: string;
    type: string;
    data: any;
    timestamp: number;
}

export interface AutomationResponse {
    success: boolean;
    message: string;
    executionId?: string;
    error?: string;
}

export interface AutomationResult {
    success: boolean;
    data?: any;
    status: 'idle' | 'processing' | 'completed' | 'error';
    error?: string;
}

export interface AutomationConfig {
    endpoint: string;
    provider: 'boost' | 'make' | 'custom';
    secret?: string;
}
