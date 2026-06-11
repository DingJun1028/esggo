/**
 * 🚀 Cost Estimator & Model Router
 * 負責根據任務複雜度、Token 長度與預算，智慧選擇最合適的模型。
 */
export class CostEstimator {
  /**
   * 根據 Prompt 與預算選擇最划算的處理模型
   */
  static pickCheapestModel(prompt: string, budgetUSD: number = 0.01) {
    const estimatedTokens = Math.ceil(prompt.length / 4); // 估算 Token 數量
    
    // 預設選擇快又便宜的 Flash
    let model = 'googleai/gemini-1.5-flash';
    let costPerMillion = 0.15; // 假設價格

    // 如果任務非常長且在預算內，可以升級到 Pro
    if (estimatedTokens > 100000 && budgetUSD > 0.05) {
      model = 'googleai/gemini-1.5-pro';
      costPerMillion = 3.5;
    }

    const estimatedCost = (estimatedTokens / 1000000) * costPerMillion;

    return {
      model,
      estimatedTokens,
      estimatedCostUSD: parseFloat(estimatedCost.toFixed(6)),
      currency: 'USD'
    };
  }
}