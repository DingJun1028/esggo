import { StandardCalculator, type TScope2Params, type ICalculationResult } from '@/core/utils/omni-calculator';
import { EnvironmentalDataSchema } from '@/core/utils/jules-validator';
import { z } from 'zod';

export type TwinDecision = {
    action: 'OPTIMIZE' | 'WARNING' | 'NEUTRAL';
    confidence: number;
    reasoning: string;
    suggestedParams?: Partial<TScope2Params>;
};

/**
 * 代理雙棲引擎 (Agentic Twin Engine)
 * OMNI-REPORTS-CORE v2.0
 * 具備自主調用「英碼繁博映射引擎」(StandardCalculator) 與「萬能元件心核」(jules-validator) 的能力
 */
export class AgenticTwin {
    private twinId: string = 'mod-adv-twin-0001';

    /**
     * 自主分析並產生最佳化決策
     * @param currentParams 當前的範疇二參數
     * @returns 決策建議
     */
    public autonomousAnalyze(currentParams: TScope2Params): TwinDecision {
        console.log(`[${this.twinId}] 啟動雙棲決策輔助引擎分析...`);

        try {
            // 1. 調用 Jules Validator 進行初步防呆校驗
            const parsed = EnvironmentalDataSchema.pick({
                previousYearUsage: true,
                currentYearUsage: true,
                gridEmissionFactor: true
            }).safeParse({
                previousYearUsage: currentParams.purchasedElectricityMWh, // 模擬：以採購電量代替當期
                currentYearUsage: currentParams.purchasedElectricityMWh,
                gridEmissionFactor: currentParams.gridEmissionFactorKgCO2ePerMWh,
            });

            if (!parsed.success) {
                return {
                    action: 'WARNING',
                    confidence: 0.99,
                    reasoning: `數據異常攔截：${parsed.error.issues.map((e: any) => e.message).join(', ')}`
                };
            }

            // 2. 調用 StandardCalculator 進行現況驗算
            const currentSimulation = StandardCalculator.calculateScope2Emissions(currentParams);

            // 3. What-if 推演：如果將綠電比例提升至 50%
            const targetRenewable = currentParams.purchasedElectricityMWh * 0.5;

            if (currentParams.renewableElectricityMWh < targetRenewable) {
                const simulatedOptimal = StandardCalculator.calculateScope2Emissions({
                    ...currentParams,
                    renewableElectricityMWh: targetRenewable
                });

                const reduction = currentSimulation.totalEmissionsKgCO2e - simulatedOptimal.totalEmissionsKgCO2e;

                return {
                    action: 'OPTIMIZE',
                    confidence: 0.85,
                    reasoning: `當前綠電比例偏低，建議採購綠電達 50% (${targetRenewable} MWh)，預計可額外減少 ${reduction.toLocaleString()} kgCO2e 碳排。`,
                    suggestedParams: {
                        renewableElectricityMWh: targetRenewable
                    }
                };
            }

            return {
                action: 'NEUTRAL',
                confidence: 0.95,
                reasoning: `綠電採用狀況良好，維持現有策略。目前碳排量為 ${currentSimulation.totalEmissionsKgCO2e.toLocaleString()} kgCO2e。`
            };

        } catch (error: any) {
            console.error(`[${this.twinId}] 推演引擎內部錯誤:`, error);
            return {
                action: 'WARNING',
                confidence: 1.0,
                reasoning: `推演引擎例外攔截：${error.message}`
            };
        }
    }
}
