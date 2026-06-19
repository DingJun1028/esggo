import { query } from '../../db/index.js';

/**
 * 💹 財務影響力服務 (Financial Impact Service)
 * --------------------------------------------------
 * [功能] 計算 ESG 行動對財務的具體回報 (ROI) 與風險緩釋價值。
 * [白皮書] 對齊 Tier 5 戰略目標：將永續指標轉化為財務表現。
 */

export interface FinancialImpactMetrics {
    totalSavings: number;
    riskMitigationValue: number;
    carbonTaxExposure: number;
    roi: number;
    currency: string;
    timestamp: number;
}

export class FinancialImpactService {
    private static instance: FinancialImpactService;
    private readonly CARBON_TAX_RATE = 50; // $50 per tCO2e (模擬)
    private readonly RISK_UNIT_VALUE = 10000; // $10k 每誠信點數

    private constructor() { }

    public static getInstance(): FinancialImpactService {
        if (!FinancialImpactService.instance) {
            FinancialImpactService.instance = new FinancialImpactService();
        }
        return FinancialImpactService.instance;
    }

    /**
     * 🧮 計算綜合財務影響力
     */
    public async calculateOverallImpact(): Promise<FinancialImpactMetrics> {
        // 1. 從數據庫中獲取碳排放總計與供應鏈指標 (模擬查詢)
        // 實際應查詢 evidence_vault 與 extracted_metrics
        try {
            const result = await query('SELECT SUM(calculated_co2e) as total_emissions FROM evidence_vault WHERE status = $1', ['approved']);
            const totalEmissions = parseFloat(result.rows[0]?.total_emissions || '0');

            // 2. 碳稅暴露計算 (模擬)
            const carbonTaxExposure = totalEmissions * this.CARBON_TAX_RATE;

            // 3. 風險緩釋價值 (模擬根據誠信指標計算)
            const riskMitigationValue = 250000; // 模擬值：基於 25 個已驗證供應商

            // 4. 總體節省 (Simulated efficiency gains)
            const totalSavings = riskMitigationValue * 0.2; // 20% 效率提升

            // 5. ROI 計算
            const investmentCost = 100000; // 模擬 ESG 系統與審核成本
            const totalBenefit = totalSavings + riskMitigationValue - carbonTaxExposure;
            const roi = ((totalBenefit - investmentCost) / investmentCost) * 100;

            return {
                totalSavings,
                riskMitigationValue,
                carbonTaxExposure,
                roi: parseFloat(roi.toFixed(2)),
                currency: 'USD',
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error('[FinancialImpactService] Error calculating impact:', error);
            throw error;
        }
    }

    /**
     * 📊 獲取影響力分布細節
     */
    public async getBreakdown() {
        return [
            { category: 'Scope 3 Optimization', impactValue: 55000, description: '透過高效供應商選擇節省的成本' },
            { category: 'Compliance Security', impactValue: 150000, description: '避免的監管罰款與法律風險' },
            { category: 'Energy Efficiency', impactValue: 45000, description: '運營流程優化帶來的能源節能' }
        ];
    }
}

export const financialImpactService = FinancialImpactService.getInstance();
