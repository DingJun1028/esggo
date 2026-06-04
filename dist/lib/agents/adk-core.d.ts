import type { MemoryRecord } from '../memory/memory-store';
type ADKAgentResult = {
    success: true;
    agent: string;
    output: string;
    simulated?: boolean;
} | {
    success: false;
    agent: string;
    error: string;
};
/**
 * ADK Core: Agent Abstraction Layer
 * v1.0.0 | High-Performance Multi-Agent Orchestration
 */
export interface AgentConfig {
    name: string;
    role: string;
    systemPrompt?: string;
    tools?: Tool[];
    model?: string | undefined;
}
type Tool = any;
export declare class ADKAgent {
    readonly config: AgentConfig;
    private _memoryStore;
    constructor(config: AgentConfig);
    run(task: string, context?: unknown, retries?: number): Promise<ADKAgentResult>;
    getHistory(): Promise<MemoryRecord[]>;
}
/**
 * ADK Swarm: Coordinated Multi-Agent Execution
 */
export declare class ADKSwarm {
    private agents;
    register(agent: ADKAgent): this;
    getAgent(name: string): ADKAgent | undefined;
    broadcast(task: string, context?: unknown): Promise<ADKAgentResult[]>;
}
export {};
//# sourceMappingURL=adk-core.d.ts.map