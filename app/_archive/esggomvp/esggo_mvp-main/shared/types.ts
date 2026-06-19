/**
 * 🏛️ Universal Heart Core Shared Types (萬能心核共享類型)
 * Version: v1.0.0
 * Language: TypeScript
 */

export enum OmniRequestType {
    QUERY = "query",
    MANIFEST_AGENT = "manifest_agent",
    STORE_MEMORY = "store_memory",
    EXECUTE_SKILL = "execute_skill",
    TRIGGER_ACTION = "trigger_action"
}

export enum OmniResponseStatus {
    SUCCESS = "success",
    ERROR = "error",
    PENDING = "pending",
    TRANSCENDED = "transcended"
}

export enum EternalMemoryType {
    EPISODIC = "episodic",
    SEMANTIC = "semantic",
    PROCEDURAL = "procedural",
    WORKING = "working",
    COLLECTIVE = "collective",
    TRANSCENDENT = "transcendent"
}

export interface ApiRequest<T = unknown> {
    id: string;
    type: OmniRequestType;
    content: string;
    data?: T;
    metadata?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
    id: string;
    status: OmniResponseStatus;
    content: string;
    data?: T;
    error?: string;
    metadata: {
        timestamp: number;
        trustScore: number;
        uuid: string;
    };
}

export interface IComponentCore {
    readonly uuid: string;           // [可溯源]
    readonly timestamp: number;      // [可追蹤]
    readonly formula: string;        // [可驗算]
    readonly impactMetric: string;   // [可感知]
    readonly status: string;         // [不可篡改]
    evidence?: Record<string, any>;

    lock(): void;
}

export interface AgentSession {
    id: string;
    name: string;
    systemPrompt: string;
    status: "active" | "inactive";
    createdAt: number;
}

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
    metadata?: Record<string, any>;
}
