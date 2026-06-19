import { ESGDataTag, OmniResponse } from '../omni/infrastructure/types/Omni-entity.types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 奧秘 永續成長引擎 (OmniSustainableGrowth)
 * --------------------------------------------------
 * [核心] 再生設計 (Regenerative Design)
 *
 * 功能：
 * 1. 計算 ESG 數據的「成長幅度」。
 * 2. 根據環境與治理指標解鎖 Agents 的潛能特質。
 * 3. 回饋給「王道資源」系統。
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
   * 處理 ESG 數據變更的成長分析
   */
  static processEsgImpact(oldData: ESGDataTag, newData: ESGDataTag): ImpactResult {
    omniLogger.debug(LogCategory.GROWTH, 'Processing ESG impact...', {
      oldScore: oldData.governance.transparencyScore,
      newScore: newData.governance.transparencyScore,
    });

    const metrics = this.calculateImpact(oldData, newData);
    const traitsUnlocked: { id: string; name: string; traitKey: string }[] = [];

    // 1. 計算經驗值
    const xpEarned = metrics.carbonReduction * 10 + metrics.transparencyBoost * 500;

    // 2. 判斷是否解鎖特質
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
   * 處理任務完成的影響力
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
      const trait = { id: 'trait-EcoWarrior', name: '生態戰士', traitKey: 'EcoWarrior' };
      omniLogger.info(LogCategory.GROWTH, 'Trait Unlocked: EcoWarrior', { missionId });
      traitsUnlocked.push(trait);
    }

    return { xpEarned, traitsUnlocked, metrics };
  }

  /**
   * 計算兩個數據快照的差異
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
