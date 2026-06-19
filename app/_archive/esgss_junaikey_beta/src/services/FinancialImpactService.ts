import { AssetService } from './AssetService.js';
import { supplyChainManager, Supplier } from './SupplyChainManager.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

export interface FinancialImpactMetrics {
  totalSavings: number;
  riskMitigationValue: number;
  carbonTaxExposure: number;
  roi: number;
  currency: string;
  timestamp: number;
}

export interface ImpactBreakdown {
  category: string;
  impactValue: number;
  description: string;
}

export class FinancialImpactService {
  private static instance: FinancialImpactService;
  private readonly CARBON_TAX_RATE = 50; // $50 per tCO2e (Example)
  private readonly RISK_UNIT_VALUE = 10000; // $10k per integrity point above threshold

  private constructor() {}

  public static getInstance(): FinancialImpactService {
    if (!FinancialImpactService.instance) {
      FinancialImpactService.instance = new FinancialImpactService();
    }
    return FinancialImpactService.instance;
  }

  /**
   * Calculate overall financial impact based on ESG metrics and supply chain data.
   */
  public async calculateImpact(): Promise<FinancialImpactMetrics> {
    const suppliers = supplyChainManager.getSuppliers();
    const assets = await AssetService.getStrategicAssets();

    // 1. Carbon Tax Exposure Calculation
    // Heuristic: Exposure = Total Emissions * Carbon Tax Rate
    const scope3Emissions = supplyChainManager.calculateScope3Emissions().total;
    const carbonTaxExposure = (scope3Emissions / 100) * this.CARBON_TAX_RATE; // Normalized for demo

    // 2. Risk Mitigation Value
    // Heuristic: Sum of integrity scores * unit value
    const totalIntegrity = suppliers.reduce((sum, s) => sum + s.integrityScore, 0);
    const riskMitigationValue = totalIntegrity * (this.RISK_UNIT_VALUE / 100);

    // 3. Total Savings (Simulated from efficiency gains)
    const totalSavings = riskMitigationValue * 0.15; // 15% of risk value reclaimed as efficiency

    // 4. ROI Calculation
    // Simulated: (Impact - Cost) / Cost
    const simulatedCost = 500000; // $500k investment
    const totalBenefit = totalSavings + riskMitigationValue - carbonTaxExposure;
    const roi = (totalBenefit - simulatedCost) / simulatedCost;

    const metrics: FinancialImpactMetrics = {
      totalSavings,
      riskMitigationValue,
      carbonTaxExposure,
      roi: roi * 100, // Percentage
      currency: 'USD',
      timestamp: Date.now(),
    };

    omniLogger.info(LogCategory.FINANCE, 'Financial Impact Calculated', metrics);
    return metrics;
  }

  /**
   * Get detailed breakdown of impact by category.
   */
  public async getImpactBreakdown(): Promise<ImpactBreakdown[]> {
    const suppliers = supplyChainManager.getSuppliers();

    return [
      {
        category: 'Scope 3 Optimization',
        impactValue: 45000,
        description: 'Savings from high-efficiency supplier selection.',
      },
      {
        category: 'Compliance Security',
        impactValue: 120000,
        description: 'Avoided fines and regulatory penalties.',
      },
      {
        category: 'Energy Efficiency',
        impactValue: 32000,
        description: 'Direct reductions in operational overhead.',
      },
    ];
  }
}

export const financialImpactService = FinancialImpactService.getInstance();
