import { Agent } from '@/types/agency';

export interface SwarmSyncResult {
  totalResonance: number;
  syncEfficiency: number;
  activeAgentsCount: number;
  amplifiedPower: number;
}

/**
 * 💡 Omni-Swarm Protocol (蜂群協定)
 * --------------------------------------------------
 * [Core Logic] Neural Frequency Synchronization (NFS)
 * [Resonance] Power boost = Sum(BasePower) * (1 + AlignmentSimilarity * AgentCountBonus)
 */
export class SwarmEngine {
  /**
   * 計算蜂群同步共鳴 (Neural Resonance)
   * 基於成員間的 Drift (性格漂移) 相似度算出協作增益
   */
  public static calculateSync(agents: Agent[]): SwarmSyncResult {
    if (agents.length === 0)
      return { totalResonance: 0, syncEfficiency: 0, activeAgentsCount: 0, amplifiedPower: 0 };

    const count = agents.length;

    // 1. Calculate Average Drift Profile
    const avgDrift = agents.reduce(
      (acc, a) => ({
        e: acc.e + (a.drift?.e || 0),
        s: acc.s + (a.drift?.s || 0),
        g: acc.g + (a.drift?.g || 0),
      }),
      { e: 0, s: 0, g: 0 }
    );

    avgDrift.e /= count;
    avgDrift.s /= count;
    avgDrift.g /= count;

    // 2. Calculate Deviation (Similarity)
    const totalVariance = agents.reduce((acc, a) => {
      const v =
        Math.abs((a.drift?.e || 0) - avgDrift.e) +
        Math.abs((a.drift?.s || 0) - avgDrift.s) +
        Math.abs((a.drift?.g || 0) - avgDrift.g);
      return acc + v;
    }, 0);

    // Normalize Similarity (0 to 1, where 1 is identical)
    const maxExpectedVariance = count * 150; // Heuristic based on 50 max drift per cat
    const similarity = Math.max(0.1, 1 - totalVariance / maxExpectedVariance);

    // 3. Efficiency & Resonance
    const syncEfficiency = similarity * (1 + count * 0.05); // 5% bonus per agent for swarm scaling
    const basePower = agents.reduce((sum, a) => sum + a.level * 10, 0);
    const amplifiedPower = Math.floor(basePower * syncEfficiency);

    return {
      totalResonance: similarity * 100,
      syncEfficiency,
      activeAgentsCount: count,
      amplifiedPower,
    };
  }

  /**
   * 生成蜂群簽章 (Swarm Signature)
   * 用於聯名決策的去中心化校驗
   */
  public static generateSwarmSignature(swarmId: string, agents: Agent[]): string {
    const timestamp = Date.now();
    const ids = agents
      .map(a => a.id)
      .sort()
      .join('|');
    return `SWARM-SIG-${swarmId}-${timestamp}-${ids.length}`;
  }
}
