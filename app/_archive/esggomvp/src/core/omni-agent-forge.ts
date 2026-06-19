import { v4 as uuidv4 } from 'uuid';
import { IOmniAgent, ISacredCommand } from './omni-agent-types';
import { CelestialExecutor } from './celestial-executor';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🏭 OmniAgentForge: The forge where the "Wings of Light" are tempered.
 * Responsible for agent orchestration and task matrix management.
 */
export class OmniAgentForge {
    private static instance: OmniAgentForge;
    private agents: Map<string, IOmniAgent> = new Map();
    private tasks: any[] = []; // Task Matrix Store

    private constructor() { }

    public static getInstance(): OmniAgentForge {
        if (!OmniAgentForge.instance) {
            OmniAgentForge.instance = new OmniAgentForge();
        }
        return OmniAgentForge.instance;
    }

    /**
     * ⚔️ Temper: Create a new agent with specialized role.
     */
    public temperAgent(name: string, role: IOmniAgent['role'], capabilities: string[]): IOmniAgent {
        const agent: IOmniAgent = {
            uuid: uuidv4(),
            name,
            role,
            capabilities
        };
        this.agents.set(agent.uuid, agent);
        omniLogger.info(LogCategory.SYSTEM, `🏭 Agent Forged: ${name} [${role}]`);
        return agent;
    }

    /**
     * 🦅 Deploy: Execute a command via the Agent Network.
     */
    public async deploy(intent: string, payload: any, originator: string = "System_Forge"): Promise<any> {
        const command: ISacredCommand = {
            id: uuidv4(),
            originator,
            intent,
            payload,
            tags: ["AGENT_DISPATCH", "WINGS_OF_LIGHT"]
        };

        const taskEntry = {
            id: command.id,
            intent,
            status: 'PROCESSING',
            timestamp: Date.now()
        };
        this.tasks.push(taskEntry);

        try {
            const result = await CelestialExecutor.execute(command);
            taskEntry.status = 'COMPLETED';
            return result;
        } catch (error) {
            taskEntry.status = 'FAILED';
            throw error;
        }
    }

    public getTaskMatrix() {
        return this.tasks;
    }
}

export const agentForge = OmniAgentForge.getInstance();
