import { ESGDataTag, OmniResponse } from '../omni/infrastructure/types/Omni-entity.types.js';
import { omniLogger, LogCategory } from './omniLogger.js';

/**
 * Omni Sustainable Growth Engine (OmniSustainableGrowth)
 * --------------------------------------------------
 * [Core] Regenerative Design
 *
 * Functions:
 * 1. Calculate "growth magnitude" of ESG data.
 * 2. Unlock potential traits of Agents based on environmental and governance metrics.
 * 3. Feedback to "Wangdao Resources" system.
 */

export interface ImpactMetrics {
  carbonReduction: number;
  transparencyBoost: number;
  communityImpact: number;
}

export interface ImpactResult {
  xpEarned: number;
  traitsUnlocked: { id: string; name: string; traitKey: string }[];
  metrics: ImpactMetrics;
}

export class OmniSustainableGrowth {
  /**
   * Processes growth analysis for ESG data changes
   */
  static processEsgImpact(oldData: ESGDataTag, newData: ESGDataTag): ImpactResult {
    omniLogger.debug(LogCategory.GROWTH, 'Processing ESG impact...', {
      oldScore: oldData.governance.transparencyScore,
      newScore: newData.governance.transparencyScore,
    });

    const metrics = this.calculateImpact(oldData, newData);
    const traitsUnlocked: { id: string; name: string; traitKey: string }[] = [];

    // 1. Calculate XP
    const xpEarned = metrics.carbonReduction * 10 + metrics.transparencyBoost * 500;

    // 2. Determine whether to unlock trait
    if (metrics.carbonReduction > 50) {
      omniLogger.info(LogCategory.GROWTH, 'Trait Unlocked: CarbonOptimizer', { metrics });
      traitsUnlocked.push({
        id: 'trait-CarbonOptimizer',
        name: 'CarbonOptimizer',
        traitKey: 'CarbonOptimizer',
      });
    }

    if (newData.governance.transparencyScore > 90) {
      omniLogger.info(LogCategory.GROWTH, 'Trait Unlocked: TrustArchitect', {
        score: newData.governance.transparencyScore,
      });
      traitsUnlocked.push({
        id: 'trait-TrustArchitect',
        name: 'TrustArchitect',
        traitKey: 'TrustArchitect',
      });
    }

    return { xpEarned, traitsUnlocked, metrics };
  }

  /**
   * Processes mission completion impact
   */
  static processMissionImpact(missionId: string, baseItk: number): ImpactResult {
    omniLogger.debug(LogCategory.GROWTH, 'Processing Mission Impact', { missionId, baseItk });

    // Mock impact logic based on mission ID
    const metrics: ImpactMetrics = {
      carbonReduction: missionId.includes('carbon') ? baseItk * 0.5 : 0,
      transparencyBoost: missionId.includes('governance') ? baseItk * 0.01 : 0,
      communityImpact: missionId.includes('social') ? baseItk : baseItk * 0.2,
    };

    const xpEarned = baseItk * 5;
    const traitsUnlocked: { id: string; name: string; traitKey: string }[] = [];

    if (metrics.carbonReduction > 5) {
      const trait = { id: 'trait-EcoWarrior', name: 'Eco Warrior', traitKey: 'EcoWarrior' };
      omniLogger.info(LogCategory.GROWTH, 'Trait Unlocked: EcoWarrior', { missionId });
      traitsUnlocked.push(trait);
    }

    return { xpEarned, traitsUnlocked, metrics };
  }

  /**
   * Calculates difference between two data snapshots
   */
  private static calculateImpact(old: ESGDataTag, current: ESGDataTag): ImpactMetrics {
    return {
      carbonReduction: Math.max(
        0,
        old.environmental.carbonFootprint - current.environmental.carbonFootprint
      ),
      transparencyBoost: Math.max(
        0,
        (current.governance.transparencyScore - old.governance.transparencyScore) / 100
      ),
      communityImpact: current.social.communityImpact,
    };
  }
}
