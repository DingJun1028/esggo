/**
 * Trinity Protocol Definitions
 * The unified communication standard for Omni, AI, and Key services.
 * 
 * "Trinity" refers to the three pillars of the system:
 * 1. Omni (The System/Platform)
 * 2. AI (The Intelligence/Sentience)
 * 3. Key (The Security/Sovereignty)
 */

import { OmniErrorCode } from './errorCodes.js';

/**
 * Context for a Trinity Request
 * Carries metadata and security information across the request lifecycle.
 */
export interface TrinityContext {
    traceId: string;
    source: string;
    timestamp: number;
    // Security context (optional during public/handshake phases)
    auth?: {
        userId: string;
        roles: string[];
        permissions: string[];
    };
}

/**
 * Standard Request Envelope
 * All inter-service and critical client-server communications must use this envelope.
 */
export interface TrinityRequest<T = any> {
    header: {
        version: string; // e.g., '1.0.0-trinity'
        source: 'Omni' | 'AI' | 'Key' | 'Client' | 'External';
        timestamp: number;
        signature?: string; // For cryptographic verification (OmniKey)
    };
    payload: T;
    context?: TrinityContext;
}

/**
 * Standard Response Envelope
 * Guaranteed format for all Trinity-compliant endpoints.
 */
export interface TrinityResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: OmniErrorCode;
        message: string;
        details?: any;
    };
    metadata: {
        timestamp: number;
        latency: number;
        traceId: string;
        serverSignature?: string; // Proof of origin
    };
}

/**
 * Type guard to check if an object is a valid TrinityRequest
 */
export function isTrinityRequest(obj: any): obj is TrinityRequest {
    return (
        obj &&
        typeof obj === 'object' &&
        'header' in obj &&
        'payload' in obj &&
        typeof obj.header?.version === 'string'
    );
}
