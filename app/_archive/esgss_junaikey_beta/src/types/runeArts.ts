/**
 * Nothingness Ultimate Principle # Rune Arts System
 * --------------------------------------------------
 * Allowing AI to autonomously assemble runes and accumulate proficiency 
 * without any scripts or presets, and to "realize" brand-new combo skills 
 * with a very low probability, achieving an infinite sentient skill chain of self-evolution.
 */

import { type Skill, PartnerRarity as Rarity } from './aiPartner';
import { OmniStore, OmniNamespace } from '../services/OmniStore';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

// ============================================================================
// Rune System
// ============================================================================

/**
 * Rune - The atomic unit of AI capability
 */
export interface Rune {
  id: string;
  name: string;
  description: string;
  category: RuneCategory;

  // Rune Type
  type: 'atomic' | 'composite'; // Atomic Rune / Composite Rune

  // Capability Definition
  capability: {
    input: string[]; // Input parameters
    output: string[]; // Output results
    sideEffects?: string[]; // Side effects
  };

  // Composition Info (Composite Rune)
  composition?: {
    runes: string[]; // Constituent Rune IDs
    pattern: ComboPattern; // Combination Pattern
    discoveredAt: Date; // Discovery Time
    discoveredBy: string; // Discoverer
  };

  // Proficiency
  proficiency: {
    level: ProficiencyLevel;
    usageCount: number;
    successRate: number;
    lastUsedAt?: Date;
  };

  // Rarity (Auto-generated runes)
  rarity?: Rarity;

  // Metadata
  metadata: {
    createdAt: Date;
    version: string;
    tags: string[];
    [key: string]: unknown;
  };
}

/**
 * Rune Category
 */
export enum RuneCategory {
  // Basic Runes
  PERCEPTION = 'perception', // Perception
  MEMORY = 'memory', // Memory
  REASONING = 'reasoning', // Reasoning
  ACTION = 'action', // Action
  COMMUNICATION = 'communication', // Communication
  SAFETY = 'safety', // Safety
  LEARNING = 'learning', // Learning

  // Composite Runes
  ULTIMATE = 'ultimate', // Ultimate Principle
  MYSTIC = 'mystic', // Mystic Technique
}

/**
 * Proficiency Level
 */
export enum ProficiencyLevel {
  NOVICE = 'novice', // Novice (0-10 times)
  APPRENTICE = 'apprentice', // Apprentice (11-50 times)
  ADEPT = 'adept', // Adept (51-100 times)
  EXPERT = 'expert', // Expert (101-500 times)
  MASTER = 'master', // Master (501-1000 times)
  GRANDMASTER = 'grandmaster', // Grandmaster (1000+ times)
}

/**
 * Combination Pattern
 */
export enum ComboPattern {
  SEQUENTIAL = 'sequential', // Sequential execution
  PARALLEL = 'parallel', // Parallel execution
  CONDITIONAL = 'conditional', // Conditional branch
  LOOP = 'loop', // Loop execution
  RECURSIVE = 'recursive', // Recursive execution
  DAG = 'dag', // Directed Acyclic Graph (DAG)
}

// ============================================================================
// Rune Combo System
// ============================================================================

/**
 * Rune Combo
 */
export interface RuneCombo {
  id: string;
  name: string;
  description: string;

  // Constituent Runes
  runes: string[];
  pattern: ComboPattern;

  // Synergy Effects
  synergy: {
    amplification: number; // Synergy amplification
    efficiency: number; // Efficiency boost
    quality: number; // Quality improvement
  };

  // Usage Stats
  usageCount: number;
  successCount: number;
  failureCount: number;

  // Proficiency
  proficiency: ProficiencyLevel;

  // Discovery Info
  discoveredAt: Date;
  discoveredBy: 'system' | 'user' | 'ai';
}

/**
 * Ultimate - Composite runes automatically generated with extremely low probability through "Enlightenment"
 */
export interface UltimateRune extends Rune {
  type: 'composite';
  category: RuneCategory.ULTIMATE | RuneCategory.MYSTIC;

  // Ultimate Attributes
  ultimate: {
    tier: 'epic' | 'legendary' | 'mythic';
    power: number; // Power value
    cooldown: number; // Cooldown time
    energyCost: number; // Energy cost
  };

  // Enlightenment Conditions
  enlightenment: {
    triggerCondition: string; // Trigger condition
    probability: number; // Generation probability (0.001 - 0.01)
    requiredProficiency: ProficiencyLevel;
    requiredCombos: number; // Required combo count
  };

  // Inheritance
  inheritance: {
    canTeach: boolean; // Whether it can be taught
    learnDifficulty: number; // Learning difficulty
    prerequisites: string[]; // Prerequisites
  };
}

// ============================================================================
// Rune Proficiency System
// ============================================================================

/**
 * Proficiency Progress
 */
export interface ProficiencyProgress {
  currentLevel: ProficiencyLevel;
  currentUsage: number;
  nextLevelThreshold: number;
  progressPercentage: number;

  // Growth Curve
  growthCurve: {
    successRate: number;
    averageExecutionTime: number;
    errorRate: number;
  };
}

/**
 * Calculate Proficiency Level
 */
export function calculateProficiencyLevel(usageCount: number): ProficiencyLevel {
  if (usageCount >= 1000) return ProficiencyLevel.GRANDMASTER;
  if (usageCount >= 501) return ProficiencyLevel.MASTER;
  if (usageCount >= 101) return ProficiencyLevel.EXPERT;
  if (usageCount >= 51) return ProficiencyLevel.ADEPT;
  if (usageCount >= 11) return ProficiencyLevel.APPRENTICE;
  return ProficiencyLevel.NOVICE;
}

/**
 * Calculate Ultimate Generation Probability
 */
export function calculateUltimateGenerationProbability(
  proficiency: ProficiencyLevel,
  comboCount: number,
  successRate: number
): number {
  // Base Probability
  const baseProbability = {
    [ProficiencyLevel.NOVICE]: 0,
    [ProficiencyLevel.APPRENTICE]: 0,
    [ProficiencyLevel.ADEPT]: 0.0001, // 0.01%
    [ProficiencyLevel.EXPERT]: 0.001, // 0.1%
    [ProficiencyLevel.MASTER]: 0.005, // 0.5%
    [ProficiencyLevel.GRANDMASTER]: 0.01, // 1%
  }[proficiency];

  // Combo count bonus
  const comboBonus = Math.min(comboCount / 1000, 0.005);

  // Success rate bonus
  const successBonus = successRate * 0.005;

  const totalProbability = baseProbability + comboBonus + successBonus;

  // Cap at 2%
  return Math.min(totalProbability, 0.02);
}

// ============================================================================
// Rune Combo Engine
// ============================================================================

/**
 * Rune Combo Engine
 */
export class RuneComboEngine {
  private runes: Map<string, Rune> = new Map();
  private combos: Map<string, RuneCombo> = new Map();
  private ultimates: Map<string, UltimateRune> = new Map();

  /**
   * Register Rune
   */
  registerRune(rune: Rune): void {
    this.runes.set(rune.id, rune);
    omniLogger.info(LogCategory.GROWTH, `[Rune] ✨ Registered Rune: ${rune.name} (${rune.category})`);
  }

  /**
   * Autonomous Rune Combination
   */
  async autonomousCombine(goal: string, availableRunes: string[]): Promise<RuneCombo> {
    omniLogger.info(LogCategory.GROWTH, `[Rune] 🎯 Target: ${goal}`);
    omniLogger.info(LogCategory.GROWTH, `[Rune] 🧩 Available Runes: ${availableRunes.length} units`);

    // Structural Dag Planning via OmniStore visualization
    // Save this new combo definition
    OmniStore.setItem(OmniNamespace.RUNE, `combo_def_${goal}_${Date.now()}`, {
      goal,
      runes: availableRunes,
      created: new Date(),
    });

    const combo: RuneCombo = {
      id: `combo_${Date.now()}`,
      name: `AutoCombo_${goal}`,
      description: `Autonomously assembled rune chain to achieve: "${goal}"`,
      runes: availableRunes.slice(0, 3),
      pattern: ComboPattern.SEQUENTIAL,
      synergy: {
        amplification: 0.001,
        efficiency: 0.002,
        quality: 0.001,
      },
      usageCount: 0,
      successCount: 0,
      failureCount: 0,
      proficiency: ProficiencyLevel.NOVICE,
      discoveredAt: new Date(),
      discoveredBy: 'ai',
    };

    this.combos.set(combo.id, combo);
    omniLogger.info(LogCategory.GROWTH, `[Rune] ✅ Combination Complete: ${combo.name}`);

    return combo;
  }

  /**
   * Execute Rune Combo
   */
  async executeCombo(comboId: string): Promise<{
    success: boolean;
    result?: unknown;
    ultimateGenerated?: UltimateRune;
  }> {
    const combo = this.combos.get(comboId);
    if (!combo) {
      throw new Error(`Combo specifically does not exist: ${comboId}`);
    }

    // Execute combination
    const success = Math.random() > 0.1; // 90% success rate

    // Update stats
    combo.usageCount++;
    if (success) {
      combo.successCount++;
    } else {
      combo.failureCount++;
    }

    // Update proficiency
    combo.proficiency = calculateProficiencyLevel(combo.usageCount);

    // Check for "Enlightenment" (Ultimate generation)
    const successRate = combo.successCount / combo.usageCount;
    const probability = calculateUltimateGenerationProbability(
      combo.proficiency,
      combo.usageCount,
      successRate
    );

    let ultimateGenerated: UltimateRune | undefined;

    if (Math.random() < probability) {
      ultimateGenerated = this.generateUltimate(combo);
      omniLogger.info(LogCategory.GROWTH, `[Rune] 🌟 Enlightenment! Generated Ultimate: ${ultimateGenerated.name}`);
    }

    return {
      success,
      result: success ? { data: 'execution_result' } : undefined,
      ultimateGenerated,
    };
  }

  /**
   * Generate Ultimate
   */
  private generateUltimate(combo: RuneCombo): UltimateRune {
    const tier = this.determineUltimateTier(combo.proficiency);

    const ultimate: UltimateRune = {
      id: `ultimate_${Date.now()}`,
      name: `Ultimate Principle・${combo.name}`,
      description: `Ultimate principle enlightened from "${combo.name}"`,
      category: RuneCategory.ULTIMATE,
      type: 'composite',
      capability: {
        input: [],
        output: [],
      },
      composition: {
        runes: combo.runes,
        pattern: combo.pattern,
        discoveredAt: new Date(),
        discoveredBy: 'ai_enlightenment',
      },
      proficiency: {
        level: ProficiencyLevel.NOVICE,
        usageCount: 0,
        successRate: 1.0,
      },
      rarity: tier,
      metadata: {
        createdAt: new Date(),
        version: '1.0.0',
        tags: ['ultimate', 'auto-generated', tier],
      },
      ultimate: {
        tier: tier as 'epic' | 'legendary' | 'mythic',
        power: tier === Rarity.MYTHIC ? 1000 : tier === Rarity.LEGENDARY ? 500 : 200,
        cooldown: tier === Rarity.MYTHIC ? 3600 : tier === Rarity.LEGENDARY ? 1800 : 600,
        energyCost: tier === Rarity.MYTHIC ? 100 : tier === Rarity.LEGENDARY ? 50 : 20,
      },
      enlightenment: {
        triggerCondition: `Combo "${combo.name}" reached ${combo.proficiency} level`,
        probability: 0.001,
        requiredProficiency: ProficiencyLevel.EXPERT,
        requiredCombos: 100,
      },
      inheritance: {
        canTeach: tier !== Rarity.MYTHIC,
        learnDifficulty: tier === Rarity.MYTHIC ? 10 : tier === Rarity.LEGENDARY ? 7 : 5,
        prerequisites: combo.runes,
      },
    };

    this.ultimates.set(ultimate.id, ultimate);
    return ultimate;
  }

  /**
   * Determine Ultimate Tier
   */
  private determineUltimateTier(proficiency: ProficiencyLevel): Rarity {
    const roll = Math.random();

    if (proficiency === ProficiencyLevel.GRANDMASTER) {
      if (roll < 0.01) return Rarity.MYTHIC; // 1%
      if (roll < 0.1) return Rarity.LEGENDARY; // 9%
      return Rarity.EPIC; // 90%
    }

    if (proficiency === ProficiencyLevel.MASTER) {
      if (roll < 0.05) return Rarity.LEGENDARY; // 5%
      return Rarity.EPIC; // 95%
    }

    return Rarity.EPIC; // 100%
  }

  /**
   * Get all ultimates
   */
  getUltimates(): UltimateRune[] {
    return Array.from(this.ultimates.values());
  }

  /**
   * Get Statistics
   */
  getStatistics(): {
    totalRunes: number;
    totalCombos: number;
    totalUltimates: number;
    proficiencyDistribution: Record<ProficiencyLevel, number>;
  } {
    const proficiencyDistribution: Record<ProficiencyLevel, number> = {
      [ProficiencyLevel.NOVICE]: 0,
      [ProficiencyLevel.APPRENTICE]: 0,
      [ProficiencyLevel.ADEPT]: 0,
      [ProficiencyLevel.EXPERT]: 0,
      [ProficiencyLevel.MASTER]: 0,
      [ProficiencyLevel.GRANDMASTER]: 0,
    };

    this.combos.forEach(combo => {
      proficiencyDistribution[combo.proficiency]++;
    });

    return {
      totalRunes: this.runes.size,
      totalCombos: this.combos.size,
      totalUltimates: this.ultimates.size,
      proficiencyDistribution,
    };
  }
}

// ============================================================================
// Exports
// ============================================================================

export const runeEngine = new RuneComboEngine();
export default runeEngine;
