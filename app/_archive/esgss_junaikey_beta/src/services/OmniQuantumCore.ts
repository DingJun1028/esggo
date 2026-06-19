import { Agent } from '../types/agency.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

export interface QuantumStatus {
  currentEnergy: number;
  maxEnergy: number;
  resonanceLevel: number; // 0.0 to 1.0
}

/**
 * ⚛️ Quantum Resonance Engine (Quantum Resonance Engine)
 * --------------------------------------------------
 * [Core Resource] Quantum Energy (QE) - Regenerates over time or via "Deep Dive"
 * [Mechanic] Limit Break - Consumes QE to temporarily double agent stats (Intelligence/Speed)
 */
export class OmniQuantumCore {
  private static STORAGE_KEY = 'omni_quantum_core_state';
  private static MAX_ENERGY = 1000;

  public static getStatus(): QuantumStatus {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to load quantum status from localStorage', {
        error,
      });
    }

    return {
      currentEnergy: 500, // Start with half
      maxEnergy: this.MAX_ENERGY,
      resonanceLevel: 0.5,
    };
  }

  public static consumeEnergy(amount: number): boolean {
    const status = this.getStatus();
    if (status.currentEnergy >= amount) {
      status.currentEnergy -= amount;
      this.saveStatus(status);

      omniLogger.info(LogCategory.SYSTEM, `Quantum Energy consumed: ${amount}`, {
        remaining: status.currentEnergy,
      });

      return true;
    }
    return false;
  }

  public static regenerateEnergy(amount: number): void {
    const status = this.getStatus();
    const oldEnergy = status.currentEnergy;
    status.currentEnergy = Math.min(this.MAX_ENERGY, status.currentEnergy + amount);
    this.saveStatus(status);

    if (status.currentEnergy !== oldEnergy) {
      omniLogger.info(
        LogCategory.SYSTEM,
        `Quantum Energy regenerated: ${status.currentEnergy - oldEnergy}`,
        {
          current: status.currentEnergy,
        }
      );
    }
  }

  private static saveStatus(status: QuantumStatus): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to save quantum status to localStorage', {
        error,
      });
    }
  }

  /**
   * Trigger Limit Break (Limit Break)
   * Consumes 100 QE, temporarily doubles agent's core attributes
   */
  public static triggerLimitBreak(agent: Agent): Agent {
    if (!this.consumeEnergy(100)) throw new Error('Insufficient Quantum Energy');

    omniLogger.info(LogCategory.AI, `Limit Break triggered for agent: ${agent.name}`, {
      agentId: agent.id,
    });

    const boostedAgent = { ...agent };
    boostedAgent.dna = {
      ...agent.dna,
      intelligence: agent.dna.intelligence * 2,
      speed: agent.dna.speed * 2,
      precision: agent.dna.precision * 1.5,
    };

    if (boostedAgent.quantumState) {
      boostedAgent.quantumState.lastLimitBreak = Date.now();
    } else {
      boostedAgent.quantumState = {
        energy: 0,
        isEntangled: false,
        lastLimitBreak: Date.now(),
      };
    }

    return boostedAgent;
  }

  /**
   * Establish Quantum Entanglement (Quantum Entanglement)
   * Entangles two agents, when one of them is boosted, the other shares 50% resonance
   */
  public static entangleAgents(agent1: Agent, agent2: Agent): void {
    omniLogger.info(LogCategory.AI, `Establishing Quantum Entanglement`, {
      agent1: agent1.id,
      agent2: agent2.id,
    });

    if (!agent1.quantumState) agent1.quantumState = { energy: 0, isEntangled: false };
    if (!agent2.quantumState) agent2.quantumState = { energy: 0, isEntangled: false };

    agent1.quantumState.isEntangled = true;
    agent1.quantumState.entangledWith = agent2.id;

    agent2.quantumState.isEntangled = true;
    agent2.quantumState.entangledWith = agent1.id;
  }
}
