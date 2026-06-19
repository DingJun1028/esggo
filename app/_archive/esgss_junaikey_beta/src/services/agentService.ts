export type { Agent, AgentRole };
import type {
  Agent,
  AgentRole,
  AgentStatus,
  AgentDNA,
  AgentSkill,
  AgentEquipment,
  AgentTitle,
  Rarity,
  EquipmentType,
  AvatarPersona,
  AvatarTransformation,
} from '../types.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { avatarOrchestrator } from './OmniAvatarOrchestrator.js';

// Mock Data
const MOCK_AGENTS: Agent[] = [
  {
    id: 'agt-001',
    name: 'CSO Strategy Oracle',
    role: 'STRATEGIST',
    agent_status: 'ACTIVE',
    description: 'High-level ESG strategy formulation and gap analysis.',
    level: 12,
    experience: 15400,
    nextLevelExp: 20000,
    dna: {
      intelligence: 95,
      creativity: 80,
      empathy: 60,
      resilience: 75,
      precision: 90,
      speed: 50,
    },
    skills: [
      {
        id: 'sk-1',
        name: 'Trend Prediction',
        description: 'Forecasts market shifts with high accuracy.',
        level: 5,
        rarity: 'EPIC',
      },
      {
        id: 'sk-2',
        name: 'Policy Synthesis',
        description: 'Aligns global standards instantly.',
        level: 4,
        rarity: 'RARE',
      },
    ],
    equipment: {
      artifact: {
        id: 'eq-1',
        name: 'Orb of Insight',
        type: 'ARTIFACT',
        rarity: 'LEGENDARY',
        description: 'Allows seeing 3 steps ahead in simulation.',
        stats: { intelligence: 10, precision: 5 },
        specialEffect: 'Predictive Modeling +20%',
      },
    },
    titles: [
      {
        id: 't-1',
        name: 'Grandmaster Strategist',
        color: '#FFD700',
        description: 'Reached level 10 as Strategist',
        unlockedAt: new Date('2025-06-01'),
      },
    ],
    activeTitle: {
      id: 't-1',
      name: 'Grandmaster Strategist',
      color: '#FFD700',
      description: 'Reached level 10 as Strategist',
      unlockedAt: new Date('2025-06-01'),
    },
    isAwakened: false,
    avatarHistory: [],
    avatarColor: '#FFD700', // Gold
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'agt-002',
    name: 'Green Finance Bot',
    role: 'EXECUTOR',
    agent_status: 'TRAINING',
    description: 'Automated carbon credit trading and asset allocation.',
    level: 5,
    experience: 3200,
    nextLevelExp: 5000,
    dna: {
      intelligence: 85,
      creativity: 40,
      empathy: 20,
      resilience: 60,
      precision: 95,
      speed: 100,
    },
    skills: [
      {
        id: 'sk-3',
        name: 'Algorithmic Trading',
        description: 'Nanosecond trade execution.',
        level: 3,
        rarity: 'RARE',
      },
    ],
    equipment: {
      weapon: {
        id: 'eq-2',
        name: 'Quantum Ledger Blade',
        type: 'WEAPON',
        rarity: 'EPIC',
        description: 'Slices through transaction latency.',
        stats: { speed: 15 },
        specialEffect: 'Zero-latency execution',
      },
    },
    titles: [],
    isAwakened: false,
    avatarHistory: [],
    avatarColor: '#10B981', // Emerald
    createdAt: new Date('2025-02-15'),
  },
];

class AgentService {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    // Initialize with basic agent if needed
    this.createAgent({
      id: 'agent_1',
      name: 'Genesis Agent',
      role: 'ORACLE' as any, // Mock cast
      level: 1,
    });
  }

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch('/api/agents');
      if (!response.ok) throw new Error('Failed to fetch agents');
      const { data } = await response.json();

      // Update local cache
      this.agents.clear();
      data.forEach((agent: Agent) => this.agents.set(agent.id, agent));

      return data;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'getAgents error', { error });
      return Array.from(this.agents.values()); // Fallback to cache
    }
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    try {
      const response = await fetch(`/api/agents/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch agent ${id}`);
      const { data } = await response.json();
      this.agents.set(id, data);
      return data;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'getAgentById error', { error });
      return this.agents.get(id);
    }
  }

  async createAgent(config: any): Promise<Agent> {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error('Failed to create agent');
      const { data: newAgent } = await response.json();
      this.agents.set(newAgent.id, newAgent);
      omniLogger.info(LogCategory.SYSTEM, `Agent created: ${newAgent.id}`);
      return newAgent;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'createAgent error', { error });
      throw error;
    }
  }

  async assignAvatar(agentId: string, persona: AvatarPersona): Promise<Agent | null> {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    // Mock assignment
    const agentAny = agent as any;
    if (!agentAny.unlockedPersonas) agentAny.unlockedPersonas = [];
    if (!agentAny.unlockedPersonas.includes(persona)) {
      agentAny.unlockedPersonas.push(persona);
    }

    omniLogger.info(LogCategory.SYSTEM, `Avatar ${persona} assigned to agent ${agentId}`);
    return agent;
  }

  async awakeAgent(id: string, persona: AvatarPersona): Promise<void> {
    const agent = this.agents.get(id);
    if (agent) {
      const agentAny = agent as any;
      agentAny.isAwakened = true;
      this.assignAvatar(id, persona);
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ORACLE':
        return 'purple';
      case 'GUARDIAN':
        return 'green';
      case 'TRADER':
        return 'gold';
      default:
        return 'gray';
    }
  }
  async grantExperience(
    id: string,
    amount: number
  ): Promise<{ leveledUp: boolean; newLevel: number }> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error(`Agent ${id} not found`);

    agent.experience += amount;
    let leveledUp = false;

    // Simple level up logic
    while (agent.experience >= agent.nextLevelExp) {
      agent.experience -= agent.nextLevelExp;
      agent.level += 1;
      agent.nextLevelExp = Math.floor(agent.nextLevelExp * 1.5);
      leveledUp = true;

      omniLogger.info(
        LogCategory.SYSTEM,
        `✨ AGENT LEVEL UP! ${agent.name} reached Lv.${agent.level}`
      );
    }

    if (amount > 0) {
      omniLogger.info(LogCategory.SYSTEM, `Agent ${agent.name} gained ${amount} XP`);
    }

    return { leveledUp, newLevel: agent.level };
  }

  async calibrateAgent(id: string): Promise<Agent> {
    try {
      const response = await fetch(`/api/agents/${id}/calibrate`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Calibration failed: ${response.statusText}`);
      }
      const { data: calibrationResult } = await response.json();

      // Update local cache
      const current = this.agents.get(id);
      if (current) {
        const updated = { ...current, soul: calibrationResult.soul };
        this.agents.set(id, updated);
        omniLogger.info(LogCategory.SYSTEM, `Agent ${id} calibrated successfully`);
        return updated;
      }

      return calibrationResult as any;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, `Calibration error for agent ${id}`, { error });
      throw error;
    }
  }

  async crystallizeAgent(id: string): Promise<Agent> {
    try {
      const response = await fetch(`/api/agents/${id}/crystallize`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Crystallization failed: ${response.statusText}`);
      }
      const { data: updatedAgent } = await response.json();

      // Update local cache
      this.agents.set(id, updatedAgent);

      omniLogger.info(LogCategory.SYSTEM, `Agent ${id} crystallized (5T Sealed)`);
      return updatedAgent;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, `Crystallization error for agent ${id}`, { error });
      throw error;
    }
  }
}

export const agentService = new AgentService();
