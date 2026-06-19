export interface BreakthroughResult {
  success: boolean;
  attribute: string;
  oldValue: number;
  newValue: number;
  entropyImpact: number;
}

export class QuantumResonanceCore {
  /**
   * 計算量子突破 (Quantum Breakthrough)
   * 基於代理人當前屬性比例與系統共鳴度
   */
  public static attemptBreakthrough(
    attribute: string,
    currentValue: number,
    resonance: number
  ): BreakthroughResult {
    const baseSuccessRate = 0.3 + resonance * 0.1;
    const rand = Math.random();
    const success = rand < baseSuccessRate;

    // Breakthrough bypasses normal caps, adding a permanent scaling factor
    const entropyImpact = success ? 0.05 : 0.15; // Failure is more chaotic
    const multiplier = success ? 1.25 : 1.0;
    const newValue = Math.floor(currentValue * multiplier);

    return {
      success,
      attribute,
      oldValue: currentValue,
      newValue,
      entropyImpact,
    };
  }

  /**
   * 適應性技能演化 (Adaptive Skill Evolution)
   * 根據任務歷史 (E, S, G 佔比) 演化技能標籤與增幅效果
   */
  public static evolveSkill(skill: any, missionHistory: any[]) {
    if (!missionHistory || missionHistory.length === 0) return skill;

    const counts = { E: 0, S: 0, G: 0 };
    missionHistory.forEach(m => {
      if (counts.hasOwnProperty(m.type)) {
        counts[m.type as keyof typeof counts]++;
      }
    });

    const dominant = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    // Return evolved metadata
    return {
      ...skill,
      isEvolved: true,
      evolutionPath: dominant,
      powerMultiplier: 1.0 + counts[dominant as keyof typeof counts] * 0.02,
    };
  }
}
