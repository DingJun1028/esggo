/**
 * 🔵 Standard Calculator — ESG GO Omni Layer (Goodness Module)
 * 
 * 核心哲學：演算法公開，邏輯可驗。善意即透明。
 * 零幻覺驗算協議 (Zero Hallucination Protocol)：
 * 所有 ESG 計算公式必須透明化且為決定性演算法 (Deterministic Algorithm)，
 * 絕對禁止 LLM 進行數值猜測。前後端將透過此類別進行雙重驗證。
 */

// 為了確保計算精度 (尤其是浮點數)，在企業級應用中通常會引入 Decimal.js 或 bignumber.js。
// 為了不增加外部依賴，這裡實作一個輕量級的防浮點數誤差處理，或直接使用原生運算佐以嚴格型別。
// 實際生產環境強烈建議使用 Decimal.js。

export class StandardCalculator {
    /**
     * 計算 Scope 2 外購電力碳排放
     * @param electricityKwh 用電量 (度 / kWh)
     * @param emissionFactor 電力排碳係數 (kgCO2e / kWh)
     * @returns 排放量 (公噸 / tCO2e)
     */
    static calculateScope2Electricity(electricityKwh: number, emissionFactor: number): number {
        if (electricityKwh < 0 || emissionFactor < 0) {
            throw new Error("StandardCalculator: Negative values are not permitted in Scope 2 calculation.");
        }

        // 理論公式: (度數 * 係數) / 1000 = 噸
        // 使用 Math.round 進行簡單的小數點第 4 位四捨五入防護 (解決 0.1+0.2 浮點數問題)
        const rawEmissionsTonnes = (electricityKwh * emissionFactor) / 1000;
        return Math.round(rawEmissionsTonnes * 10000) / 10000;
    }

    /**
     * 取得 Scope 2 計算的引用來源標註
     */
    static getScope2SourceRef(): string {
        // 未來這裡可接動態的係數資料庫版本
        return "Reference: Bureau of Energy, MOEA (Latest Power Coefficient)";
    }

    /**
     * 計算社會投資報酬率 (SROI - 基礎演示版)
     * @param totalInvestment 總投入成本 (NTD)
     * @param totalSocialValue 總產出社會價值 (NTD)
     * @returns SROI 比率 (1 : X)
     */
    static calculateSROI(totalInvestment: number, totalSocialValue: number): number {
        if (totalInvestment <= 0) {
            throw new Error("StandardCalculator: Investment must be greater than zero.");
        }
        const ratio = totalSocialValue / totalInvestment;
        return Math.round(ratio * 100) / 100;
    }

    /**
     * 邏輯勾稽檢查 (Logic Consistency Check)
     * 驗證子項目加總是否等於總數 (允許極小的浮點數誤差)
     */
    static verifySumConsistency(total: number, parts: number[], tolerance = 0.0001): boolean {
        const partsSum = parts.reduce((acc, curr) => acc + curr, 0);
        return Math.abs(total - partsSum) <= tolerance;
    }
}
