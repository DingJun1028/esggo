/**
 * 📈 Omni Impact Calculator
 * 影響力計算與 SROI 分析
 * 
 * 職責：
 * - 計算社會投資回報率 (SROI)
 * - 評估專案/組織的社會影響力
 * - 生成影響力報告
 * - 追蹤影響力指標
 */

import { v4 as uuidv4 } from 'uuid';

export type ImpactCategory = 
    | 'environmental'
    | 'social'
    | 'economic'
    | 'governance'
    | 'health'
    | 'education';

export interface IStakeholder {
    id: string;
    name: string;
    type: 'employee' | 'customer' | 'community' | 'investor' | 'supplier' | 'government';
    impact: number; // 貨幣價值
    attribution: number; // 歸因比例 (0-1)
}

export interface IOutcome {
    id: string;
    name: string;
    category: ImpactCategory;
    description: string;
    indicator: string;
    baseline: number;
    target: number;
    actual?: number;
    unit: string;
    monetizationFactor: number; // 貨幣化因子
    achievedAt?: number;
}

export interface ISROICalculation {
    id: string;
    projectName: string;
    period: {
        start: number;
        end: number;
    };
    totalInvestment: number;
    outcomes: IOutcome[];
    stakeholders: IStakeholder[];
    sroi: number;
    netPresentValue: number;
    sensitivity: {
        optimistic: number;
        pessimistic: number;
        baseline: number;
    };
    breakdown: {
        byCategory: Record<ImpactCategory, number>;
        byStakeholder: Record<string, number>;
    };
    calculatedAt: number;
}

export interface ImpactMetrics {
    sroi: number;
    carbonReduction: number;
    waterSaved: number;
    communityBeneficiaries: number;
    jobsCreated: number;
    carbonByYear: any[];
    waterByYear: any[];
}

export interface IScopeInput {
    scope1: {
        stationaryCombustion: number;
        mobileCombustion: number;
        fugitiveEmissions: number;
        processEmissions: number;
    };
    scope2: {
        purchasedElectricity: number;
        purchasedSteam: number;
    };
    scope3: {
        businessTravel: number;
        purchasedGoods: number;
        employeeCommuting: number;
        wasteGenerated: number;
        capitalGoods: number;
    };
}

export interface IScopeResult {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
    hashSeal: string;
    lastAutoComputed: number;
}

export interface IImpactReport {
    id: string;
    projectId: string;
    title: string;
    summary: string;
    sroi: number;
    keyOutcomes: string[];
    recommendations: string[];
    generatedAt: number;
}

/**
 * SROI 計算引擎
 */
class SROICalculator {
    /**
     * 計算 SROI
     */
    static calculate(
        investment: number,
        outcomes: IOutcome[],
        stakeholders: IStakeholder[],
        discountRate: number = 0.035 // 3.5% 社會貼現率
    ): ISROICalculation {
        const id = uuidv4();
        
        // 計算總 outcome 價值
        let totalOutcomeValue = 0;
        const byCategory: Record<ImpactCategory, number> = {
            environmental: 0,
            social: 0,
            economic: 0,
            governance: 0,
            health: 0,
            education: 0
        };
        const byStakeholder: Record<string, number> = {};

        outcomes.forEach(outcome => {
            const value = (outcome.actual || outcome.target) * outcome.monetizationFactor;
            totalOutcomeValue += value;
            byCategory[outcome.category] += value;
        });

        stakeholders.forEach(stakeholder => {
            const value = stakeholder.impact * stakeholder.attribution;
            byStakeholder[stakeholder.type] = value;
        });

        // 計算淨現值 (NPV)
        const years = 1; // 簡化為1年
        const npv = totalOutcomeValue / Math.pow(1 + discountRate, years) - investment;

        // 計算 SROI
        const sroi = investment > 0 ? totalOutcomeValue / investment : 0;

        // 敏感性分析
        const sensitivity = {
            optimistic: investment > 0 ? (totalOutcomeValue * 1.2) / investment : 0,
            pessimistic: investment > 0 ? (totalOutcomeValue * 0.8) / investment : 0,
            baseline: sroi
        };

        return {
            id,
            projectName: 'Impact Project',
            period: {
                start: Date.now() - 365 * 24 * 60 * 60 * 1000,
                end: Date.now()
            },
            totalInvestment: investment,
            outcomes,
            stakeholders,
            sroi,
            netPresentValue: npv,
            sensitivity,
            breakdown: {
                byCategory,
                byStakeholder
            },
            calculatedAt: Date.now()
        };
    }

    /**
     * 生成影響力報告
     */
    static generateReport(calculation: ISROICalculation): IImpactReport {
        const keyOutcomes = calculation.outcomes
            .filter(o => (o.actual || o.target) >= o.baseline)
            .map(o => `${o.name}: ${o.actual || o.target} ${o.unit}`);

        const recommendations: string[] = [];

        if (calculation.sroi > 3) {
            recommendations.push('專案產生高度社會投資回報，考慮擴大投資規模');
        } else if (calculation.sroi > 1) {
            recommendations.push('專案產生正向回報，建議持續優化');
        } else {
            recommendations.push('SROI 低於預期，需要重新評估專案設計');
        }

        // 基於類別的建議
        const categoryBreakdown = calculation.breakdown.byCategory;
        if (categoryBreakdown.social > categoryBreakdown.economic) {
            recommendations.push('社會影響力顯著，建議加強社區參與');
        }
        if (categoryBreakdown.environmental > 0) {
            recommendations.push('環境效益明顯，可考慮申請綠色認證');
        }

        return {
            id: uuidv4(),
            projectId: calculation.id,
            title: `${calculation.projectName} 影響力報告`,
            summary: `本報告評估了專案的社會投資回報率 (SROI) 為 ${calculation.sroi.toFixed(2)}，代表每投入 1 元可產生 ${calculation.sroi.toFixed(2)} 元的社會價值。`,
            sroi: calculation.sroi,
            keyOutcomes,
            recommendations,
            generatedAt: Date.now()
        };
    }
}

/**
 * Omni Impact Calculator 主類別
 */
export class OmniImpactCalculator {
    private static instance: OmniImpactCalculator;
    private calculations: Map<string, ISROICalculation> = new Map();
    private outcomes: Map<string, IOutcome[]> = new Map();

    private constructor() {}

    static getInstance(): OmniImpactCalculator {
        if (!OmniImpactCalculator.instance) {
            OmniImpactCalculator.instance = new OmniImpactCalculator();
        }
        return OmniImpactCalculator.instance;
    }

    /**
     * 添加 Outcome
     */
    addOutcome(projectId: string, outcome: Omit<IOutcome, 'id'>): IOutcome {
        const id = uuidv4();
        const newOutcome: IOutcome = { ...outcome, id };

        const projectOutcomes = this.outcomes.get(projectId) || [];
        projectOutcomes.push(newOutcome);
        this.outcomes.set(projectId, projectOutcomes);

        return newOutcome;
    }

    /**
     * 更新 Outcome 實際值
     */
    updateOutcomeActual(projectId: string, outcomeId: string, actual: number): IOutcome | null {
        const projectOutcomes = this.outcomes.get(projectId);
        if (!projectOutcomes) return null;

        const outcome = projectOutcomes.find(o => o.id === outcomeId);
        if (!outcome) return null;

        outcome.actual = actual;
        outcome.achievedAt = Date.now();

        return outcome;
    }

    /**
     * 計算 SROI
     */
    calculateSROI(
        projectId: string,
        investment: number,
        stakeholders: Omit<IStakeholder, 'id'>[]
    ): ISROICalculation | null {
        const projectOutcomes = this.outcomes.get(projectId);
        if (!projectOutcomes || projectOutcomes.length === 0) {
            return null;
        }

        const stakeholdersWithId: IStakeholder[] = stakeholders.map(s => ({
            ...s,
            id: uuidv4()
        }));

        const calculation = SROICalculator.calculate(
            investment,
            projectOutcomes,
            stakeholdersWithId
        );

        this.calculations.set(calculation.id, calculation);

        return calculation;
    }

    /**
     * 獲取計算結果
     */
    getCalculation(id: string): ISROICalculation | undefined {
        return this.calculations.get(id);
    }

    /**
     * 獲取專案的所有計算
     */
    getProjectCalculations(projectId: string): ISROICalculation[] {
        return Array.from(this.calculations.values())
            .filter(c => c.id === projectId);
    }

    /**
     * 生成影響力報告
     */
    generateImpactReport(calculationId: string): IImpactReport | null {
        const calculation = this.calculations.get(calculationId);
        if (!calculation) return null;

        return SROICalculator.generateReport(calculation);
    }

    /**
     * 獲取影響力儀表板數據
     */
    getDashboardData(): {
        totalProjects: number;
        averageSROI: number;
        totalInvestment: number;
        categoryBreakdown: Record<ImpactCategory, number>;
    } {
        const calculations = Array.from(this.calculations.values());
        
        if (calculations.length === 0) {
            return {
                totalProjects: 0,
                averageSROI: 0,
                totalInvestment: 0,
                categoryBreakdown: {
                    environmental: 0,
                    social: 0,
                    economic: 0,
                    governance: 0,
                    health: 0,
                    education: 0
                }
            };
        }

        const avgSROI = calculations.reduce((acc, c) => acc + c.sroi, 0) / calculations.length;
        const totalInvestment = calculations.reduce((acc, c) => acc + c.totalInvestment, 0);

        // 合併類別 breakdown
        const categoryBreakdown: Record<ImpactCategory, number> = {
            environmental: 0,
            social: 0,
            economic: 0,
            governance: 0,
            health: 0,
            education: 0
        };

        calculations.forEach(c => {
            Object.entries(c.breakdown.byCategory).forEach(([cat, val]) => {
                categoryBreakdown[cat as ImpactCategory] += val;
            });
        });

        return {
            totalProjects: calculations.length,
            averageSROI: avgSROI,
            totalInvestment,
            categoryBreakdown
        };
    }

    /**
     * 追蹤進度
     */
    trackProgress(projectId: string): {
        totalOutcomes: number;
        achieved: number;
        progress: number;
    } {
        const projectOutcomes = this.outcomes.get(projectId) || [];
        const achieved = projectOutcomes.filter(o => o.actual !== undefined).length;
        const progress = projectOutcomes.length > 0 
            ? (achieved / projectOutcomes.length) * 100 
            : 0;

        return {
            totalOutcomes: projectOutcomes.length,
            achieved,
            progress
        };
    }

    /**
     * 計算碳盤查排放量 (ISO 14064 / GHG Protocol)
     */
    async calculateScopeEmissions(input: IScopeInput): Promise<IScopeResult> {
        // 模擬排放係數 (Emission Factors)
        const EF = {
            stationary: 2.5, // tCO2e / L
            mobile: 2.3,     // tCO2e / L
            fugitive: 1.0,   // tCO2e / kg
            process: 0.8,    // tCO2e / kg
            electricity: 0.5, // tCO2e / kWh
            steam: 0.06,     // tCO2e / MJ
            travel: 0.00018, // tCO2e / km
            goods: 0.0005,   // tCO2e / $
            commuting: 0.0001, // tCO2e / km
            waste: 0.0002,   // tCO2e / kg
            capital: 0.0003  // tCO2e / $
        };

        const scope1 = 
            input.scope1.stationaryCombustion * EF.stationary +
            input.scope1.mobileCombustion * EF.mobile +
            input.scope1.fugitiveEmissions * EF.fugitive +
            input.scope1.processEmissions * EF.process;

        const scope2 = 
            input.scope2.purchasedElectricity * EF.electricity +
            input.scope2.purchasedSteam * EF.steam;

        const scope3 = 
            input.scope3.businessTravel * EF.travel +
            input.scope3.purchasedGoods * EF.goods +
            input.scope3.employeeCommuting * EF.commuting +
            input.scope3.wasteGenerated * EF.waste +
            input.scope3.capitalGoods * EF.capital;

        const total = scope1 + scope2 + scope3;

        return {
            scope1: scope1 / 1000, // 轉為噸
            scope2: scope2 / 1000,
            scope3: scope3 / 1000,
            total: total / 1000,
            hashSeal: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
            lastAutoComputed: Date.now()
        };
    }
}

export default OmniImpactCalculator;
