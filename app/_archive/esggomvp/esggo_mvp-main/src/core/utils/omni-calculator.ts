import { z } from 'zod';

/**
 * Omni TS-Resonance Engine (英碼繁博映射引擎)
 * 接收從 Python/Scala 等異質語言映射過來的演算法
 * 以「外層 Zod 驗算 + 內層純函數」的結構，實現算法透明化 (Algorithmic Transparency)
 */

export const Scope2CalculationSchema = z.object({
    purchasedElectricityMWh: z.number().nonnegative("採購電量必須為非負數"),
    gridEmissionFactorKgCO2ePerMWh: z.number().positive("電網排放係數必須大於 0"),
    renewableElectricityMWh: z.number().nonnegative("綠電使用量必須為非負數").default(0),
}).refine(data => data.renewableElectricityMWh <= data.purchasedElectricityMWh, {
    message: "綠電使用量不可大於總採購電量",
    path: ['renewableElectricityMWh']
});

export type TScope2Params = z.infer<typeof Scope2CalculationSchema>;

export interface ICalculationResult {
    totalEmissionsKgCO2e: number;
    formula: string;
    description: string;
}

export class StandardCalculator {
    /**
     * ISO-14064 範疇二 (Scope 2) 基礎運算 - 市場基準 (Market-based)
     * 此函數只含純邏輯，不處理 API 或 IO
     */
    static calculateScope2Emissions(params: TScope2Params): ICalculationResult {
        // 核心邏輯防呆
        const parsed = Scope2CalculationSchema.parse(params);

        // 剩餘需計入碳排的電量 (MWh)
        const netElectricity = parsed.purchasedElectricityMWh - parsed.renewableElectricityMWh;

        // 總排放量 (kgCO2e)
        const totalEmissionsKgCO2e = netElectricity * parsed.gridEmissionFactorKgCO2ePerMWh;

        return {
            totalEmissionsKgCO2e,
            formula: "(總採購電量 - 綠電使用量) × 電網排放係數",
            description: "採用 ISO-14064 市場基準法計算溫室氣體範疇二排放"
        };
    }
}
