export interface LegionMission {
  id: string;
  name: string;
  description: string;
  targetTheater: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';
  requiredPower: number;
  currentProgress: number;
  assignedLegionId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  startedAt: number;
  estimatedDuration: number; // in turns/ticks
}

export interface Legion {
  id: string;
  name: string;
  commanderId: string;
  agentIds: string[];
  synergyType: 'E' | 'S' | 'G' | 'OMNI';
  totalPower: number;
  activeMissionId?: string;
}

export class LegionEngine {
  /**
   * 計算軍團總合戰力 (Total Power)
   * 基於代理人屬性、指揮官加成、以及同向共鳴效果
   */
  public static calculatePower(legion: Legion, agents: any[]): number {
    const legionAgents = agents.filter(a => legion.agentIds.includes(a.id));
    const commander = agents.find(a => a.id === legion.commanderId);

    const power = legionAgents.reduce((sum, a) => {
      const base = (a.computePower || 0) + (a.empathyLevel || 0) + (a.governanceScore || 0);
      return sum + base / 3;
    }, 0);

    // 同向共鳴加成 (Synergy)
    const alignmentMatches = legionAgents.filter(a => a.type === legion.synergyType).length;
    const synergyMultiplier = 1 + alignmentMatches * 0.15;

    // Phase 39: Formation Resonance (Lineage Congruence)
    const uniqueAncestors = new Set(legionAgents.map(a => a.geneticBlueprintId || 'ROOT'));
    const isLineageCongruent = uniqueAncestors.size === 1 && uniqueAncestors.has('ROOT') === false;
    const lineageMultiplier = isLineageCongruent ? 1.25 : 1.0;

    // 指揮官加成 (Radiation effect)
    const commanderBonus = commander ? commander.level * 2 : 0;

    return Math.floor(power * synergyMultiplier * lineageMultiplier + commanderBonus);
  }

  /**
   * 進行戰略模擬 (Turn-based Simulation)
   */
  public static processMissionTick(mission: LegionMission, power: number): LegionMission {
    if (mission.status !== 'ACTIVE') return mission;

    // Progress formula: Power / Difficulty adjustment
    const progressIncrement = Math.max(5, (power / mission.requiredPower) * 10);
    const newProgress = Math.min(100, mission.currentProgress + progressIncrement);

    let newStatus: LegionMission['status'] = mission.status;
    if (newProgress >= 100) {
      newStatus = 'COMPLETED';
    }

    // Random failure chance (very low if power > required)
    if (power < mission.requiredPower * 0.5 && Math.random() < 0.05) {
      newStatus = 'FAILED';
    }

    return {
      ...mission,
      currentProgress: newProgress,
      status: newStatus,
    };
  }

  /**
   * 軍團共鳴共享 (Resonance Sharing)
   * 當一個成員獲得 XP 時，共享一部分給軍團內其他成員
   */
  public static distributeSharedXp(
    agentId: string,
    baseXp: number,
    legions: Legion[],
    onDistribute: (targetId: string, sharedAmount: number) => void
  ): void {
    const sharedRate = 0.05; // 5% Resonance Sharing
    const sharedXp = Math.max(1, Math.floor(baseXp * sharedRate));

    legions.forEach(legion => {
      if (legion.agentIds.includes(agentId)) {
        legion.agentIds.forEach(targetId => {
          if (targetId !== agentId) {
            onDistribute(targetId, sharedXp);
          }
        });
      }
    });
  }
}
