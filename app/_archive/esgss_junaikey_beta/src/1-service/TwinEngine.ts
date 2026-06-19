export interface TwinState {
  id: string;
  originalId: string;
  type: 'AGENT' | 'LEGION';
  clonedData: any;
  simulatedInsights: number;
  stabilityRating: number;
}

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  impactSeverity: number;
  targetDrift: 'E' | 'S' | 'G';
}

export class TwinEngine {
  /**
   * 狀態克隆 (State Cloning)
   * 創建一個不影響原始對象的深拷貝鏡像
   */
  public static createTwin(original: any, type: 'AGENT' | 'LEGION'): TwinState {
    return {
      id: `TWIN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      originalId: original.id,
      type,
      clonedData: JSON.parse(JSON.stringify(original)),
      simulatedInsights: 0,
      stabilityRating: 100,
    };
  }

  /**
   * 壓力測試模擬 (Stress Test Simulation)
   * 模擬極端事件對克隆狀態的衝擊
   */
  public static runScenario(twin: TwinState, scenario: StressScenario): TwinState {
    const severity = scenario.impactSeverity;
    const resilience = (twin.clonedData.level || 5) * 2;

    // 模擬受到的衝擊
    const damage = Math.max(0, severity * 10 - resilience);
    const newStability = Math.max(0, twin.stabilityRating - damage);

    // 如果生還，獲得心得 (Insights)
    const insightGain = newStability > 0 ? severity * 5 : 0;

    return {
      ...twin,
      stabilityRating: newStability,
      simulatedInsights: twin.simulatedInsights + insightGain,
    };
  }
}
