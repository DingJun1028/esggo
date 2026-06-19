/**
 * 📋 A2A Protocol Types
 * --------------------------------------------------
 * TypeScript type definitions for Agent-to-Agent Protocol
 * Based on: https://google.github.io/a2a-protocol/
 */

// ============================================================================
// Core Message Types
// ============================================================================

/**
 * A message in an A2A conversation
 */
export interface A2AMessage {
  /** Role of the message sender */
  role: 'user' | 'agent';
  /** Content parts of the message */
  parts: A2AMessagePart[];
  /** Unique identifier for this message */
  messageId: string;
  /** Optional context for the message */
  context?: A2AContext;
}

/**
 * A single part of a message
 */
export type A2AMessagePart =
  | A2ATextPart
  | A2AFilePart
  | A2AToolCallPart
  | A2AToolResultPart
  | A2ADataPart;

export interface A2ATextPart {
  kind: 'text';
  text: string;
}

export interface A2AFilePart {
  kind: 'file';
  file: {
    name: string;
    mimeType: string;
    bytes: string; // base64 encoded
  };
}

export interface A2AToolCallPart {
  kind: 'tool_call';
  toolCall: {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
  };
}

export interface A2AToolResultPart {
  kind: 'tool_result';
  toolResult: {
    id: string;
    name: string;
    result: unknown;
    error?: string;
  };
}

export interface A2ADataPart {
  kind: 'data';
  data: {
    mimeType: string;
    content: unknown;
  };
}

/**
 * Context for a message
 */
export interface A2AContext {
  /** Previous messages in the conversation */
  history?: A2AMessage[];
  /** Metadata about the conversation */
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Request to send a message to an agent
 */
export interface A2ASendMessageRequest {
  /** JSON-RPC request ID */
  id: string;
  /** Method name (always "message/send") */
  method?: 'message/send';
  /** Request parameters */
  params: {
    message: A2AMessage;
  };
}

/**
 * Response from sending a message
 */
export interface A2ASendMessageResponse {
  /** JSON-RPC response ID (matches request) */
  id: string;
  /** Successful result */
  result?: {
    message: A2AMessage;
  };
  /** Error if request failed */
  error?: A2AError;
}

/**
 * A2A Protocol error
 */
export interface A2AError {
  code: number;
  message: string;
  data?: unknown;
}

// ============================================================================
// Agent Card Types
// ============================================================================

/**
 * Agent Card - metadata about an A2A agent
 * Located at: /.well-known/agent.json
 */
export interface A2AAgentCard {
  /** Human-readable name */
  name: string;
  /** Description of the agent's capabilities */
  description: string;
  /** Base URL for the agent */
  url: string;
  /** Semantic version */
  version: string;
  /** List of capabilities */
  capabilities: A2ACapability[];
  /** Optional provider information */
  provider?: {
    name: string;
    url?: string;
  };
  /** Authentication requirements */
  authentication?: A2AAuthentication;
  /** Available tools */
  tools?: A2AToolDefinition[];
}

export type A2ACapability =
  | 'text'
  | 'file'
  | 'streaming'
  | 'tool_use'
  | 'multi_turn'
  | 'vision'
  | 'audio';

export interface A2AAuthentication {
  type: 'none' | 'api_key' | 'oauth2' | 'custom';
  instructions?: string;
}

export interface A2AToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

// ============================================================================
// Streaming Types
// ============================================================================

/**
 * Streaming message chunk
 */
export interface A2AStreamChunk {
  /** Type of chunk */
  type: 'content' | 'tool_call' | 'done' | 'error';
  /** Content delta (for type: 'content') */
  delta?: string;
  /** Tool call (for type: 'tool_call') */
  toolCall?: A2AToolCallPart['toolCall'];
  /** Error (for type: '{ error } */
  error?: A2AError;
}

// ============================================================================
// ESG-Specific Extensions
// ============================================================================

/**
 * ESG Analysis request
 */
export interface A2AESGAnalysisRequest extends A2ASendMessageRequest {
  params: {
    message: A2AMessage;
    /** ESG-specific options */
    esgOptions?: {
      analysisType: 'carbon' | 'social' | 'governance' | 'comprehensive';
      reportingStandard?: 'GRI' | 'SASB' | 'TCFD' | 'CDP';
      targetYear?: number;
    };
  };
}

/**
 * ESG Analysis result data part
 */
export interface A2AESGDataPart extends A2ADataPart {
  data: {
    mimeType: 'application/vnd.esg+json';
    content: {
      scores: {
        environmental: number;
        social: number;
        governance: number;
        overall: number;
      };
      risks: {
        category: string;
        severity: 'low' | 'medium' | 'high';
        description: string;
      }[];
      recommendations: string[];
      carbonMetrics?: {
        scope1: number;
        scope2: number;
        scope3: number;
        unit: string;
        itr?: number;
      };
    };
  };
}
