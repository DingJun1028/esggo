/**
 * AI 分析引擎服務
 * 整合 Gemini 進行碳排計算、異常偵測、智能建議
 */

import { generateObject } from 'ai';
import { z } from 'zod';
import { geminiModel } from './JunAiKeyService';

// 碳排放計算模式
const CarbonEmissionSchema = z.object({
  scope1: z.object({
    fixedCombustion: z.number().describe('固定燃燒排放 (kg CO2e)'),
    mobileCombustion: z.number().describe('移動燃燒排放 (kg CO2e)'),
    fugitiveEmissions: z.number().describe('逸散排放 (kg CO2e)'),
  }),
  scope2: z.object({
    purchasedElectricity: z.number().describe('外購電力排放 (kg CO2e)'),
    purchasedHeat: z.number().describe('外購蒸汽排放 (kg CO2e)'),
  }),
  scope3: z.object({
    purchasedGoods: z.number().description('所購買商品與服務'),
    capitalGoods: z.number().description('資本財'),
    fuelEnergy: z.number().description('燃料與能源相關活動'),
    upstreamTransport: z.number().description('上游運輸與配送'),
    wasteGenerated: z.number().description('營運所產生的廢棄物'),
    businessTravel: z.number().description('商務差旅'),
    employeeCommuting: z.number().description('員工通勤'),
    downstreamTransport: z.number().description('下游運輸與配送'),
    investments: z.number().description('投資'),
  }),
  totalEmission: z.number().describe('總排放量 (kg CO2e)'),
  unit: z.string().default('kg CO2e'),
});

type CarbonEmissionResult = z.infer<typeof CarbonEmissionSchema>;

// 排放係數資料庫
const EMISSION_FACTORS = {
  electricity: {
    taiwan: 0.509, // kg CO2e/kWh (2023)
    default: 0.5,
  },
  fuel: {
    diesel: 2.689, // kg CO2e/L
    gasoline: 2.331, // kg CO2e/L
    naturalGas: 2.02, // kg CO2e/m³
    lpg: 1.51, // kg CO2e/L
  },
  coal: {
    bituminous: 2.42, // kg CO2e/kg
  },
};

// 異常偵測結果
interface AnomalyDetectionResult {
  isAnomaly: boolean;
  anomalies: Array<{
    field: string;
    expectedRange: { min: number; max: number };
    actualValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  }>;
  overallConfidence: number;
}

// 智能建議
interface SmartSuggestion {
  category: 'reduction' | 'compliance' | 'data_quality' | 'cost';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedImpact: string;
  implementation: string[];
}

class AIAnalysisEngine {
  private model = geminiModel;

  /**
   * 計算碳排放量
   */
  async calculateEmissions(
    data: {
      electricity: { consumption: number; unit: string; region?: string };
      fuel?: Array<{ type: string; consumption: number; unit: string }>;
    }
  ): Promise<CarbonEmissionResult> {
    const { electricity, fuel = [] } = data;

    // 計算範疇二 - 外購電力
    const electricityFactor = EMISSION_FACTORS.electricity[
      (electricity.region as keyof typeof EMISSION_FACTORS.electricity) || 'default'
    ];
    const purchasedElectricity = electricity.consumption * electricityFactor;

    // 計算範疇一 - 燃料燃燒
    let fixedCombustion = 0;
    for (const f of fuel) {
      const factor = EMISSION_FACTORS.fuel[
        (f.type.toLowerCase() as keyof typeof EMISSION_FACTORS.fuel) || 'diesel'
      ];
      fixedCombustion += f.consumption * factor;
    }

    // 使用 AI 進行更精確的計算
    const prompt = `根據以下數據計算碳排放量：

用電資料：
- 消耗量：${electricity.consumption} ${electricity.unit}
- 地區：${electricity.region || '台灣'}

燃料資料：
${fuel.map((f) => `- ${f.type}: ${f.consumption} ${f.unit}`).join('\n')}

請計算並回傳 JSON 格式的排放量。`;

    try {
      const result = await generateObject({
        model: this.model,
        schema: CarbonEmissionSchema,
        prompt,
      });

      return {
        ...result.object,
        scope1: {
          fixedCombustion: result.object.scope1?.fixedCombustion || fixedCombustion,
          mobileCombustion: result.object.scope1?.mobileCombustion || 0,
          fugitiveEmissions: result.object.scope1?.fugitiveEmissions || 0,
        },
        scope2: {
          purchasedElectricity: result.object.scope2?.purchasedElectricity || purchasedElectricity,
          purchasedHeat: result.object.scope2?.purchasedHeat || 0,
        },
        scope3: result.object.scope3 || {
          purchasedGoods: 0,
          capitalGoods: 0,
          fuelEnergy: 0,
          upstreamTransport: 0,
          wasteGenerated: 0,
          businessTravel: 0,
          employeeCommuting: 0,
          downstreamTransport: 0,
          investments: 0,
        },
        totalEmission:
          (result.object.scope1?.fixedCombustion || fixedCombustion) +
          purchasedElectricity,
        unit: 'kg CO2e',
      };
    } catch (error) {
      // 如果 AI 失敗，回傳基本計算結果
      return {
        scope1: {
          fixedCombustion,
          mobileCombustion: 0,
          fugitiveEmissions: 0,
        },
        scope2: {
          purchasedElectricity,
          purchasedHeat: 0,
        },
        scope3: {
          purchasedGoods: 0,
          capitalGoods: 0,
          fuelEnergy: 0,
          upstreamTransport: 0,
          wasteGenerated: 0,
          businessTravel: 0,
          employeeCommuting: 0,
          downstreamTransport: 0,
          investments: 0,
        },
        totalEmission: fixedCombustion + purchasedElectricity,
        unit: 'kg CO2e',
      };
    }
  }

  /**
   * 異常偵測
   */
  async detectAnomalies(
    currentData: Record<string, number>,
    historicalData: Array<Record<string, number>>,
    context?: string
  ): Promise<AnomalyDetectionResult> {
    const prompt = `作為碳排放數據分析專家，請偵測以下數據中的異常值：

當前數據：
${JSON.stringify(currentData, null, 2)}

歷史數據（共 ${historicalData.length} 筆）：
${historicalData.map((d) => JSON.stringify(d, null, 2)).join('\n')}

${context ? `額外上下文：${context}` : ''}

請分析並找出：
1. 哪些數值偏離正常範圍
2. 偏離程度（百分比）
3. 嚴重性評估（低/中/高）
4. 建議的處理方式

回傳 JSON 格式的異常偵測結果。`;

    try {
      const result = await generateObject({
        model: this.model,
        schema: z.object({
          isAnomaly: z.boolean(),
          anomalies: z.array(
            z.object({
              field: z.string(),
              expectedRange: z.object({
                min: z.number(),
                max: z.number(),
              }),
              actualValue: z.number(),
              deviation: z.number(),
              severity: z.enum(['low', 'medium', 'high']),
              suggestion: z.string(),
            })
          ),
          overallConfidence: z.number(),
        }),
        prompt,
      });

      return result.object;
    } catch {
      // 基本異常偵測邏輯
      const anomalies: AnomalyDetectionResult['anomalies'] = [];
      let hasAnomaly = false;

      for (const [key, value] of Object.entries(currentData)) {
        const historicalValues = historicalData.map((d) => d[key]).filter(Boolean);
        if (historicalValues.length === 0) continue;

        const avg = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
        const stdDev = Math.sqrt(
          historicalValues.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / historicalValues.length
        );

        if (stdDev > 0 && Math.abs(value - avg) > 2 * stdDev) {
          hasAnomaly = true;
          anomalies.push({
            field: key,
            expectedRange: { min: avg - 2 * stdDev, max: avg + 2 * stdDev },
            actualValue: value,
            deviation: ((value - avg) / avg) * 100,
            severity: Math.abs(value - avg) > 3 * stdDev ? 'high' : 'medium',
            suggestion: `數值偏離歷史平均 ${((value - avg) / avg * 100).toFixed(1)}%，請確認數據正確性`,
          });
        }
      }

      return {
        isAnomaly: hasAnomaly,
        anomalies,
        overallConfidence: 0.85,
      };
    }
  }

  /**
   * 生成智能建議
   */
  async generateSuggestions(
    emissionsData: CarbonEmissionResult,
    complianceStatus: Record<string, boolean>
  ): Promise<SmartSuggestion[]> {
    const prompt = `根據以下碳排放數據和合規狀態，生成減排和合規建議：

碳排放數據：
${JSON.stringify(emissionsData, null, 2)}

合規狀態：
${JSON.stringify(complianceStatus, null, 2)}

請生成 5-7 條智能建議，包含：
1. 減排機會
2. 合規改善項目
3. 資料品質優化建議
4. 成本優化建議

每條建議需包含：類別( reduction/compliance/data_quality/cost )、優先級(high/medium/low)、標題、描述、預估影響力、實作步驟。

回傳 JSON 格式的建議陣列。`;

    try {
      const result = await generateObject({
        model: this.model,
        schema: z.array(
          z.object({
            category: z.enum(['reduction', 'compliance', 'data_quality', 'cost']),
            priority: z.enum(['high', 'medium', 'low']),
            title: z.string(),
            description: z.string(),
            estimatedImpact: z.string(),
            implementation: z.array(z.string()),
          })
        ),
        prompt,
      });

      return result.object;
    } catch {
      // 基本建議
      const suggestions: SmartSuggestion[] = [];

      if (emissionsData.scope2.purchasedElectricity > emissionsData.totalEmission * 0.5) {
        suggestions.push({
          category: 'reduction',
          priority: 'high',
          title: '優化用電效率',
          description: '範疇二電力排放佔比過高，建議優先改善用電效率',
          estimatedImpact: '預估可減少 10-15% 總排放量',
          implementation: [
            '安裝智慧電表監控用電',
            '更新高效率馬達與空調設備',
            '實施離峰用電策略',
          ],
        });
      }

      if (!emissionsData.scope3.purchasedGoods) {
        suggestions.push({
          category: 'data_quality',
          priority: 'medium',
          title: '補充範疇三數據',
          description: '缺少範疇三排放數據，建議從供應商獲取碳排放資訊',
          estimatedImpact: '提升排放盤查完整性至 95% 以上',
          implementation: [
            '建立供應商碳排放問卷',
            '使用產業平均排放係數估算',
            '優先盤查高價值供應商',
          ],
        });
      }

      suggestions.push({
        category: 'cost',
        priority: 'low',
        title: '評估碳權交易',
        description: '評估購買碳權抵換的可行性與成本效益',
        estimatedImpact: '預估可降低碳成本 5-10%',
        implementation: [
          '研究碳權市場價格趨勢',
          '計算抵換需求與成本',
          '選擇高品質碳權專案',
        ],
      });

      return suggestions;
    }
  }

  /**
   * 生成碳盤查摘要報告
   */
  async generateInventorySummary(
    data: CarbonEmissionResult,
    previousData?: CarbonEmissionResult
  ): Promise<string> {
    const prompt = `生成一份碳盤查摘要報告，包含以下資訊：

當前年度數據：
${JSON.stringify(data, null, 2)}

${previousData ? `前一年度數據：\n${JSON.stringify(previousData, null, 2)}` : ''}

請用中文生成 300 字以內的摘要，包含：
1. 排放概況
2. 變化趨勢（如果有去年數據）
3. 主要排放源
4. 減排重點建議`;

    const result = await this.model.call(prompt);
    return result.text;
  }
}

// 匯出單例
export const aiAnalysisEngine = new AIAnalysisEngine();
export type { CarbonEmissionResult, AnomalyDetectionResult, SmartSuggestion };
