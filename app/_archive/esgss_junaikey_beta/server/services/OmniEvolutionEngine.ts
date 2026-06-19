import { EventEmitter } from 'events';

export interface EntityState {
  id: string;
  level: number;
  exp: number;
  traits?: string[];
  [key: string]: any;
}

export interface EvolutionAction {
  type: string;
  expValue?: number;
  [key: string]: any;
}

export interface MutationResult {
  unlocked: boolean;
  trait?: string;
  description?: string;
}

export interface EvolutionResult {
  exp: number;
  level: number;
  leveledUp: boolean;
  mutation: MutationResult;
}

export class OmniEvolutionEngine extends EventEmitter {
  private levelThresholds: Record<number, number>;

  constructor() {
    super();
    this.levelThresholds = this.generateThresholds(50);
  }

  private generateThresholds(maxLevel: number): Record<number, number> {
    const thresholds: Record<number, number> = {};
    let exp = 100;
    for (let i = 1; i <= maxLevel; i++) {
      thresholds[i] = Math.floor(exp);
      exp = exp * 1.5;
    }
    return thresholds;
  }

  async evolve(
    entityState: EntityState,
    actionPerformed: EvolutionAction
  ): Promise<EvolutionResult> {
    const baseExp = actionPerformed.expValue || 10;
    const currentExp = entityState.exp || 0;
    const currentLevel = entityState.level || 1;

    let newExp = currentExp + baseExp;
    let newLevel = currentLevel;
    let leveledUp = false;

    const nextThreshold = this.levelThresholds[currentLevel] ?? 1000;
    if (newExp >= nextThreshold) {
      newLevel++;
      newExp = newExp - nextThreshold;
      leveledUp = true;
      this.emit('levelUp', { entityId: entityState.id, newLevel });
    }

    const mutation = await this.checkMutation({ ...entityState, level: newLevel });

    return {
      exp: newExp,
      level: newLevel,
      leveledUp,
      mutation,
    };
  }

  async checkMutation(dnaState: EntityState): Promise<MutationResult> {
    if (dnaState.level === 5 && !dnaState.traits?.includes('CarbonOptimizer')) {
      return {
        unlocked: true,
        trait: 'CarbonOptimizer',
        description: 'Ability to optimize carbon calculations by 15%.',
      };
    }
    if (dnaState.level === 10 && !dnaState.traits?.includes('TrustArchitect')) {
      return {
        unlocked: true,
        trait: 'TrustArchitect',
        description: 'Can issue 4T-verified certificates.',
      };
    }
    return { unlocked: false };
  }

  async syncAwakening(userState: any): Promise<{ synced: boolean }> {
    return { synced: true };
  }
}
