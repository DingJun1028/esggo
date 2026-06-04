/**
 * 🚀 Cost Estimator & Model Router
 * 負責根據任務複雜度、Token 長度與預算，智慧選擇最合適的模型。
 */
export declare class CostEstimator {
    /**
     * 根據 Prompt 與預算選擇最划算的處理模型
     */
    static pickCheapestModel(prompt: string, budgetUSD?: number): {
        model: string;
        estimatedTokens: number;
        estimatedCostUSD: number;
        currency: string;
    };
}
//# sourceMappingURL=cost-estimator.d.ts.map