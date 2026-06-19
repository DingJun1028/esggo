import { IProtocol5T, IVirtueFingerprint } from './omni-types';

export type AgentRole = 'SENTINEL' | 'AUDITOR' | 'ANALYST' | 'SHEPHERD';
export type AgentPersonality = 'STOIC' | 'ENTHUSIASTIC' | 'ANALYTICAL' | 'EMPATHETIC';

export interface IOmniAgent {
    id: string;
    name: string;
    role: AgentRole;
    personality: AgentPersonality;
    virtues: IVirtueFingerprint;
    auraColor: string;
    isPatrolling: boolean;
    equippedSkills?: string[]; // References to skill IDs
}

/**
 * 🤖 OmniAgent Controller: Manages self-evolving AI behaviors within the OmniUniverse.
 */
export class OmniAgent {
    /**
     * Creates a new sentient agent based on virtue inputs.
     */
    static forgeAgent(name: string, role: AgentRole, personality: AgentPersonality, virtues: IVirtueFingerprint): IOmniAgent {
        const colors = {
            'SENTINEL': '#63a6b0', // Aqua
            'AUDITOR': '#9333ea',  // Purple
            'ANALYST': '#3b82f6',  // Blue
            'SHEPHERD': '#10b981', // Emerald
        };

        return {
            id: `AGENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            name,
            role,
            personality,
            virtues,
            auraColor: colors[role] || '#ffffff',
            isPatrolling: false
        };
    }

    /**
     * Generates a "Sentient Whisper" based on agent personality and system state.
     */
    static generateWhisper(agent: IOmniAgent, state: string): string {
        const whispers: Record<AgentPersonality, Record<string, string>> = {
            'STOIC': {
                'IDLE': "The data flows steadily. No entropy detected.",
                'FORGING': "Asset structure is stable. Integrity confirmed.",
            },
            'ENTHUSIASTIC': {
                'IDLE': "The universe is vibrant today! Let's manifest something big!",
                'FORGING': "I can feel the Truth Crystal forming! It's beautiful!",
            },
            'ANALYTICAL': {
                'IDLE': "Cross-referencing 5T protocols. 99.9% consistency observed.",
                'FORGING': "Validation cycles optimal. Latency minimal.",
            },
            'EMPATHETIC': {
                'IDLE': "The system feels harmonious. Your impact is growing.",
                'FORGING': "Forging trust takes time. We are making progress together.",
            }
        };

        return whispers[agent.personality]?.[state] || "Listening to the universe...";
    }

    /**
     * Simulates monitoring a 5T protocol state.
     */
    static monitorProtocol(agent: IOmniAgent, protocol: IProtocol5T): string {
        const unverified = Object.entries(protocol).filter(([_, val]) => val.status !== 'verified');

        if (unverified.length === 0) {
            return `${agent.name} reports: All 5T protocols are locked and verified. Total integrity confirmed.`;
        }

        const nextTarget = unverified[0][0].toUpperCase();
        return `${agent.name} is monitoring ${nextTarget}. Current status: ${unverified[0][1].status}.`;
    }

    /**
     * Agent equips a specific skill package.
     */
    static equipSkill(agent: IOmniAgent, skillId: string): IOmniAgent {
        return {
            ...agent,
            equippedSkills: [...(agent.equippedSkills || []), skillId]
        };
    }

    /**
     * Agent executes an equipped skill.
     * Imports SkillRegistry dynamically to avoid circular dependencies if needed later.
     */
    static async executeSkill(agent: IOmniAgent, skillId: string, payload: any, context?: any): Promise<any> {
        if (!agent.equippedSkills?.includes(skillId)) {
            throw new Error(`Agent [${agent.name}] does not possess the skill [${skillId}].`);
        }

        // Dynamic import to prevent dependency cycles at load time
        const { SkillRegistry } = await import('./omni-agent-skills');
        const skill = SkillRegistry.getSkill(skillId);

        if (!skill) {
            throw new Error(`Skill [${skillId}] is not registered in the omnipresent registry.`);
        }

        return await skill.execute(payload, context);
    }
}
