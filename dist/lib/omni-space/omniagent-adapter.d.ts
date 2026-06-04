/**
 * 📎 OmniSpace Paperclip Adapter for OmniAgent
 * v1.0 | #OmniSpace #OmniAgent #AgenticSovereignty
 *
 * A high-performance Paperclip adapter that integrates OmniAgent into
 * the OmniSpace corporate governance structure.
 */
export type InferenceProvider = 'Anthropic' | 'OpenRouter' | 'OpenAI' | 'Nous' | 'OpenAI Codex' | 'ZAI' | 'Kimi Coding' | 'MiniMax';
export interface OmniAgentSkill {
    id: string;
    name: string;
    source: 'Paperclip' | 'OmniAgent-Native';
    path?: string;
    version: string;
}
export interface TranscriptEntry {
    timestamp: number;
    type: 'tool_call' | 'thought' | 'response' | 'error';
    agent: string;
    content: string;
    toolName?: string;
    status?: 'running' | 'success' | 'failed';
}
export interface OmniAgentSession {
    sessionId: string;
    model: string;
    provider: InferenceProvider;
    memoryState: Record<string, unknown>;
    history: TranscriptEntry[];
    checkpoints: string[];
}
/**
 * OmniSpacePaperclipAdapter: The bridge between Paperclip's employee management
 * and OmniAgent's autonomous capabilities.
 */
export declare class OmniSpacePaperclipAdapter {
    private activeSessions;
    /**
     * Execute a task using OmniAgent
     */
    execute(sessionId: string, prompt: string, context?: unknown): Promise<TranscriptEntry[]>;
    /**
     * Detect Model configuration from local environment (~/.omniagent/config.yaml)
     */
    detectModel(): Promise<{
        model: string;
        provider: InferenceProvider;
    }>;
    /**
     * Sync and List Skills (both Paperclip and OmniAgent-native)
     */
    listSkills(): Promise<OmniAgentSkill[]>;
    /**
     * Save a filesystem checkpoint for rollback safety
     */
    private saveCheckpoint;
    /**
     * Transcript Parsing & Post-processing
     */
    processOutput(rawStdout: string): string;
}
export declare const omniagentAdapter: OmniSpacePaperclipAdapter;
//# sourceMappingURL=omniagent-adapter.d.ts.map