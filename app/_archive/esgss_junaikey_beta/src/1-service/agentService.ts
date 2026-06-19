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
} from '@/types';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { avatarOrchestrator } from './OmniAvatarOrchestrator';

// Mock Data
const MOCK_AGENTS: Agent[] = [
  {
    id: 'agt-001',
    name: 'CSO Strategy Oracle',
    role: 'STRATEGIST',
    status: 'ACTIVE',
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
    status: 'TRAINING',
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
    return Array.from(this.agents.values());
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(config: any): Promise<Agent> {
    const id = config.id || `agent_${Date.now()}`;
    const agent: Agent = {
      id,
      name: config.name || 'New Agent',
      role: config.role || 'SPECTATOR',
      status: 'IDLE' as unknown as AgentStatus, // Mock
      description: 'Auto-generated agent',
      level: config.level || 1,
      experience: 0,
      nextLevelExp: 100,
      dna: {
        intelligence: 5,
        creativity: 5,
        empathy: 5,
        resilience: 5,
        precision: 5,
        speed: 5,
      },
      skills: [],
      equipment: {}, // Fix mismatch if type is object
      titles: [],
      // activeAvatarId removed
      avatarHistory: [],
      isAwakened: false,
      avatarColor: 'blue',
      createdAt: new Date(),
      // unlockedPersonas removed
      // energy removed
      // isEntangled removed
    };
    this.agents.set(id, agent);
    omniLogger.info(LogCategory.SYSTEM, `Agent created: ${id}`);
    return agent;
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
}

export const agentService = new AgentService();
