/**
 * MarketIntelligenceService.ts
 * ----------------------------
 * 商情偵測核心服務：監控全球 ESG 趨勢與競爭動態
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface IntelItem {
    id: string;
    source: string;
    url: string;
    reliability: 'High' | 'Medium' | 'Low';
    tags: string[];
    sentiment: number; // -1 to 1
    aiSummary: string;
    impactScale: number; // 1-10
    timestamp: number;
}

export class MarketIntelligenceService {
    private static instance: MarketIntelligenceService;
    private genAI: GoogleGenerativeAI | null = null;

    static getInstance(): MarketIntelligenceService {
        if (!MarketIntelligenceService.instance) {
            MarketIntelligenceService.instance = new MarketIntelligenceService();
        }
        return MarketIntelligenceService.instance;
    }

    private getGenAI(): GoogleGenerativeAI | null {
        if (!this.genAI && process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        return this.genAI;
    }

    /**
     * 從來源抓取並分析情報
     */
    async analyzeIntel(sourceUrl: string, rawContent: string): Promise<IntelItem> {
        const model = this.getGenAI()?.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Mocking AI response for now if no key
        if (!model) {
            return {
                id: `intel-${Date.now()}`,
                source: new URL(sourceUrl).hostname,
                url: sourceUrl,
                reliability: 'Medium',
                tags: ['ESG', 'Regulation'],
                sentiment: 0.1,
                aiSummary: '自動生成的商情摘要：該文章探訪了全球永續準則修訂的趨勢。',
                impactScale: 7,
                timestamp: Date.now()
            };
        }

        const prompt = `
            請以 ESG 專家身份分析以下商情內容：
            "${rawContent}"
            
            請輸出 JSON 格式：
            {
                "summary": "簡短摘要 (50字內)",
                "sentiment": 情感分數 (-1 到 1),
                "impact": 影響力等級 (1-10),
                "tags": ["關鍵字1", "關鍵字2"],
                "reliability": "High" | "Medium" | "Low"
            }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const data = JSON.parse(response.text().replace(/```json|```/g, ''));

            return {
                id: `intel-${Date.now()}`,
                source: new URL(sourceUrl).hostname,
                url: sourceUrl,
                reliability: data.reliability,
                tags: data.tags,
                sentiment: data.sentiment,
                aiSummary: data.summary,
                impactScale: data.impact,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('AI Intel Analysis Error:', error);
            return {
                id: `intel-err-${Date.now()}`,
                source: 'Analysis Engine',
                url: sourceUrl,
                reliability: 'Low',
                tags: ['Error'],
                sentiment: 0,
                aiSummary: '情報分析失敗，請檢查 API 金鑰。',
                impactScale: 1,
                timestamp: Date.now()
            };
        }
    }

    /**
     * 獲取熱門趨勢 (Mock)
     */
    getGlobalTrends(): { tag: string; growth: number }[] {
        return [
            { tag: '碳關稅 (CBAM)', growth: 45 },
            { tag: 'GRI 2021 Update', growth: 30 },
            { tag: '生物多樣性揭露', growth: 12 },
            { tag: '永續連結貸款', growth: 22 }
        ];
    }
}

export const marketIntelligenceService = MarketIntelligenceService.getInstance();
