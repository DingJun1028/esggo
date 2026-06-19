import { IImpactProject } from '../types/ipms.js';

/**
 * 🌀 熵減服務 (Entropy Service)
 * --------------------------------------------------
 * [功能] 計算 ESG 項目的「熵減」程度 (即目標達成度與執行效率)。
 * [邏輯] 綜合影響力價值 (70%) 與預算執行進度 (30%)。
 */
export class EntropyService {
  /**
   * 📊 計算項目進度與熵減程度 (0-100%)
   * @param project 項目數據對象
   * @returns number (進度百分比)
   */
  public static calculateProgress(project: IImpactProject): number {
    // 1. 初創階段項目 (TRACEABLE) 熵值較高，進度為 0
    if (project.lifecycle_state === 'TRACEABLE') {
      return 0;
    }

    const { impact_goals, resources } = project;

    // 2. 影響力達成度計算 (權重 70%)
    let impactScore = 0;
    if (impact_goals.target_value > 0) {
      impactScore = (impact_goals.current_value / impact_goals.target_value) * 100;
    }

    // 3. 執行效率計算 (權重 30%)
    // 模擬計算：預算投入與影響力產出的比例
    let executionScore = 0;
    // 模擬投入數據
    const simulatedSpending = resources.budget_allocated * (impactScore * 0.01);

    if (resources.budget_allocated > 0) {
      executionScore = (simulatedSpending / resources.budget_allocated) * 100;
      executionScore = Math.min(executionScore, 100);
    }

    // 如果沒有分配預算，則基準進度僅看影響力達成度
    if (resources.budget_allocated === 0) {
      return Math.min(Math.round(impactScore), 100);
    }

    // 4. 加權計算總熵減進度
    const totalEntropyReduction = impactScore * 0.7 + executionScore * 0.3;

    return Math.min(Math.round(totalEntropyReduction), 100);
  }
}
