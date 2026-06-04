import { ADKAgent } from './adk-core.ts';
import type { AgentConfig } from './adk-core.ts';
import { OmniCommander } from './omni-commander.ts';
/**
 * ADK Swarm Deployment: ESG GO Official Agents
 */
export declare const esgResearcher: ADKAgent;
export declare const esgAuditor: ADKAgent;
export declare const esgStrategist: ADKAgent;
export declare const esgConsultant: ADKAgent;
/**
 * Collaborative Swarm Agent (with memory-augmented reasoning and Event Bus subscription)
 */
declare class CollaborativeSwarmAgent {
    private agent;
    private memorySummary;
    private agentConfig;
    constructor(agentConfig: Omit<AgentConfig, 'tools'>);
    /**
     * Subscribe to relevant OmniAgentBus events based on agent role
     */
    private initializeSubscriptions;
    private handleEvent;
    run(task: string, context?: unknown): Promise<unknown>;
    execute(task: string, context?: unknown): Promise<unknown>;
    private generateMemorySummary;
    get name(): string;
    get config(): AgentConfig;
}
/**
 * ADK Swarm: Collaborative Multi-Agent Execution
 */
export declare class CollaborativeADKSwarm {
    private agents;
    register(agentConfig: Omit<AgentConfig, 'tools'>): this;
    getAgent(name: string): CollaborativeSwarmAgent | undefined;
    collaborate(task: string, context?: unknown): Promise<{
        [key: string]: unknown;
    }>;
    private swarmNegotiate;
}
/**
 * Instantiate the collaborative swarm with the same agents as before
 */
export declare const omniSwarm: CollaborativeADKSwarm;
/**
 * The OmniAgent: Orchestrated by Supreme Commander via OmniAgentBus
 */
export declare const omniAgent: OmniCommander;
export {};
//# sourceMappingURL=adk-swarm.d.ts.map