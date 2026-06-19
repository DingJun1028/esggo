import { GeminiService, TaskComplexity } from './geminiService';
import { omniLogger, LogCategory } from './omniLogger';

export interface RiskForecast {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    forecastedRisk: string;
    mitigationStrategy: string;
    affectedPillar: 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy';
    probability: number;
}

/**
 * Service 4.5: Predictive ESG Risk Modeling
 * 基於歷史 5T 數據進行風險預測
 */
export class RiskForecastingEngine {
    private static instance: RiskForecastingEngine;

    private constructor() {
        omniLogger.info(LogCategory.AI, '🔮 RiskForecastingEngine Initialized');
    }

    static getInstance(): RiskForecastingEngine {
        if (!RiskForecastingEngine.instance) {
            RiskForecastingEngine.instance = new RiskForecastingEngine();
        }
        return RiskForecastingEngine.instance;
    }

    /**
     * 預測未來風險
     */
    public async forecastRisk(evidenceHistory: any[]): Promise<RiskForecast[]> {
        if (evidenceHistory.length === 0) return [];

        const prompt = `
            Analyze the following ESG evidence history and predict potential future risks based on the 5T pillars.
            
            History:
            ${JSON.stringify(evidenceHistory.slice(-10), null, 2)}
            
            Provide a list of predicted risks with their level, strategy, and probability.
            Response format (JSON array of RiskForecast objects).
        `;

        try {
            const response = await GeminiService.generateStrategy({
                knowledgeNode: {
                    id: 'risk-forecast-' + Date.now(),
                    label: 'ESG Risk Forecast',
                    confidence: 0.8,
                    properties: { historyCount: evidenceHistory.length }
                },
                complexity: TaskComplexity.COMPLEX,
                context: prompt
            });

            if (response && response.content) {
                // 嘗試解析 JSON (應在生產環境中更健壯)
                const jsonMatch = response.content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            }
        } catch (error) {
            omniLogger.error(LogCategory.AI, 'Risk forecasting failed', { error });
        }

        return [];
    }
}

export const riskForecastingEngine = RiskForecastingEngine.getInstance();
