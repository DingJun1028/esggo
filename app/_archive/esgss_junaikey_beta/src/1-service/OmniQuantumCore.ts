import { Agent } from '@/types/agency';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export interface QuantumStatus {
  currentEnergy: number;
  maxEnergy: number;
  resonanceLevel: number; // 0.0 to 1.0
}

/**
 * 萬能 Quantum Resonance Engine (量子共鳴引擎)
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
   * 觸發極限突破 (Limit Break)
   * 消耗 100 QE，暫時將代理人核心屬性翻倍
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
   * 建立量子糾纏 (Quantum Entanglement)
   * 綁定兩個代理人，使其中一人獲得提升，另一人共享 50% 榜加?
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
