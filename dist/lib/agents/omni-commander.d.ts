import { ADKAgent } from './adk-core.ts';
import type { AgentConfig } from './adk-core.ts';
export type { AgentConfig };
export type CollaborativeADKSwarm = {
    collaborate(task: string, context?: unknown): Promise<Record<string, unknown>>;
    getAgent(name: string): {
        run(task: string, context?: unknown): Promise<unknown>;
    } | undefined;
};
import { omniAgentBus } from './omni-agent-bus.ts';
export { omniAgentBus };
/**
 * Agent0: Specialized Low-Level Executor
 */
export declare const agent0: ADKAgent;
export interface MissionResult {
    success: boolean;
    message: string;
    results?: unknown[];
    error?: string;
    agent?: string;
    commanderOutput?: string;
    swarmResults?: Record<string, any>;
    negotiation?: unknown;
}
/**
 * OmniAgent: Supreme Commander
 */
export declare class OmniCommander extends ADKAgent {
    readonly passiveTalent = "\u7121\u4F5C\u5999\u5FB7\u5713\u901A\u7121\u7919";
    private swarm;
    constructor(swarm: CollaborativeADKSwarm);
    command(task: string, context?: Record<string, unknown>): Promise<MissionResult>;
    private runPilotMission;
    private runNCBDBMigration;
    /**
     * 蜂群任務：5T 實證驗證 (Swarm Evidence Audit)
     * 由 Researcher, Auditor, Agent0 協作完成
     */
    private runEvidenceAuditMission;
    /**
     * 藍碳/企業通訊樞紐 (OmniBlue) 與 OmniTable 無縫整合
     * 從 Supabase omniblue_nodes 擷取節點，並同步至 OmniTable 作為 Logic Nodes。
     */
    private runOmniBlueToOmniTableIntegration;
}
//# sourceMappingURL=omni-commander.d.ts.map