/**
 * 🔗 OmniNexus-KiloAI Bridge
 * =========================
 * 雙向學習與交流系統
 * 
 * Features:
 * - MCP Server 模式提供工具給 KiloAI
 * - 作為 Client 調用 KiloAI
 * - 知識交換與 mutual learning
 */

import { OmniNexusTrinity, omniNexusTrinity } from './omni-nexus-trinity';
import { omniLogger, LogCategory } from './omniLogger';

export interface IKiloAIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface IKiloAIExchange {
    id: string;
    omniPrompt: string;
    kiloResponse: string;
    omniInsight?: string;
    timestamp: number;
}

export interface IKiloAIConfig {
    apiKey?: string;
    model?: string;
    endpoint?: string;
}

class OmniKiloAIBridge {
    private static instance: OmniKiloAIBridge;
    private nexus: OmniNexusTrinity;
    private exchangeHistory: IKiloAIExchange[] = [];
    private config: IKiloAIConfig;

    private constructor(config: IKiloAIConfig = {}) {
        this.nexus = OmniNexusTrinity.getInstance();
        this.config = {
            model: 'gpt-4o',
            endpoint: 'https://api.kilo.ai/v1/chat/completions',
            ...config
        };
    }

    public static getInstance(config?: IKiloAIConfig): OmniKiloAIBridge {
        if (!OmniKiloAIBridge.instance) {
            OmniKiloAIBridge.instance = new OmniKiloAIBridge(config);
        }
        return OmniKiloAIBridge.instance;
    }

    /**
     * 🔄 調用 KiloAI 並獲取回應
     */
    public async askKiloAI(prompt: string, context?: Record<string, any>): Promise<{
        response: string;
        insights: string[];
    }> {
        omniLogger.info(LogCategory.SYSTEM, `🔗 OmniKiloAI: Asking KiloAI: ${prompt.slice(0, 50)}...`);

        const systemPrompt = `You are connected to OmniNexus ESG AI System.
Your role is to provide insights on ESG, Sustainability, Carbon, and Green Finance.

Available capabilities:
- Carbon tracking (Scope 1/2/3)
- GRI report generation
- Trend analysis
- 5T Protocol compliance
- Trinity awakening (OmniOne + OmniPriest + OmniGemini)

Respond with actionable insights.`;

        try {
            const response = await fetch(this.config.endpoint!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`KiloAI API error: ${response.status}`);
            }

            const data = await response.json();
            const kiloResponse = data.choices?.[0]?.message?.content || 'No response';

            // OmniNexus 分析回應
            const insights = await this.analyzeKiloResponse(kiloResponse);

            // 記錄交換
            const exchange: IKiloAIExchange = {
                id: `exchange_${Date.now()}`,
                omniPrompt: prompt,
                kiloResponse,
                timestamp: Date.now()
            };
            this.exchangeHistory.push(exchange);

            return { response: kiloResponse, insights };
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `🔴 KiloAI Error: ${error.message}`);
            
            // Fallback: 使用本地分析
            return {
                response: await this.localAnalysis(prompt),
                insights: ['Local fallback analysis']
            };
        }
    }

    /**
     * 🧠 本地分析 (當 KiloAI 不可用時)
     */
    private async localAnalysis(prompt: string): Promise<string> {
        const result = await this.nexus.dispatch('analyze_trend', { prompt });
        
        if (result.success && result.data) {
            return `Based on OmniNexus ESG Analysis:\n\n` +
                `Trend: ${result.data.trend || 'Analyzing...'}\n` +
                `Probability: ${(result.data.probability || 0.8) * 100}%\n` +
                `Recommendation: ${result.data.recommendation || 'Continue monitoring'}\n\n` +
                `Source: OmniNexus Trinity (OmniOne + OmniPriest + OmniGemini)`;
        }
        
        return 'OmniNexus is analyzing your request...';
    }

    /**
     * 📊 分析 KiloAI 回應，提取洞見
     */
    private async analyzeKiloResponse(response: string): Promise<string[]> {
        const insights: string[] = [];
        
        // 簡單的關鍵詞提取
        const keywords = ['ESG', 'carbon', 'sustainability', 'GRI', 'green', 'renewable', 'compliance'];
        keywords.forEach(keyword => {
            if (response.toLowerCase().includes(keyword)) {
                insights.push(`Keyword detected: ${keyword}`);
            }
        });

        // 存入知識庫
        if (insights.length > 0) {
            await this.nexus.dispatch('manifest_asset', {
                intent: `KiloAI Exchange Insight - ${Date.now()}`,
                payload: { insights, response, source: 'KiloAI' }
            });
        }

        return insights;
    }

    /**
     * 🌉 雙向學習：OmniNexus 教 KiloAI
     */
    public async teachKiloAI(topic: string): Promise<string> {
        omniLogger.info(LogCategory.SYSTEM, `🔗 OmniKiloAI: Teaching KiloAI about: ${topic}`);

        const teachings: Record<string, string> = {
            '5t_protocol': `5T Protocol: Traceable(真), Transparent(善), Tasteful(美), Trustworthy(信), Transcendent(通)
            
Every ESG data must follow these 5 principles for compliance.`,

            'carbon_scope': `Carbon Scopes:
- Scope 1: Direct emissions (fuel, vehicles)
- Scope 2: Indirect energy (electricity, heat)
- Scope 3: Value chain (all other indirect)`,

            'trinity': `Trinity Awakening:
- OmniOne: Physical platform reconciliation
- OmniPriest: Witness & seal (immutability)
- OmniGemini: Cognitive synthesis & prediction`,

            'gri': `GRI Standards 2021:
- GRI 300: Environmental (305 Emissions, 302 Energy, 303 Water)
- GRI 400: Social (401 Employment, 403 Health & Safety)`
        };

        const teaching = teachings[topic.toLowerCase()] || `Teaching about ${topic}...`;
        
        // 記錄教學
        await this.nexus.dispatch('manifest_asset', {
            intent: `KiloAI Teaching: ${topic}`,
            payload: { topic, teaching, timestamp: Date.now() }
        });

        return teaching;
    }

    /**
     * 📚 獲取交換歷史
     */
    public getExchangeHistory(): IKiloAIExchange[] {
        return this.exchangeHistory;
    }

    /**
     * 🧹 清除歷史
     */
    public clearHistory(): void {
        this.exchangeHistory = [];
    }

    /**
     * 🔧 獲取 Bridge 狀態
     */
    public getStatus() {
        return {
            exchanges: this.exchangeHistory.length,
            config: {
                model: this.config.model,
                endpoint: this.config.endpoint
            },
            trinity: this.nexus.getTrinityStatus()
        };
    }
}

export const omniKiloAIBridge = OmniKiloAIBridge.getInstance();

/**
 * MCP Tools 供 KiloAI 使用
 */
export const KILOAI_TOOLS = [
    {
        name: 'omni_trinity_status',
        description: 'Get Trinity (OmniOne + OmniPriest + OmniGemini) status and passive skills',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'omni_analyze_esg',
        description: 'Analyze ESG trends and get recommendations',
        inputSchema: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'ESG analysis prompt' }
            },
            required: ['prompt']
        }
    },
    {
        name: 'omni_track_carbon',
        description: 'Track carbon emissions (Scope 1/2/3)',
        inputSchema: {
            type: 'object',
            properties: {
                scope: { type: 'number', enum: [1, 2, 3] },
                value: { type: 'number' },
                unit: { type: 'string' }
            },
            required: ['scope', 'value', 'unit']
        }
    },
    {
        name: 'omni_seal_proof',
        description: 'Seal data with 5T proof (immutable)',
        inputSchema: {
            type: 'object',
            properties: {
                atomId: { type: 'string' },
                proof: { type: 'string' }
            },
            required: ['atomId', 'proof']
        }
    },
    {
        name: 'omni_forge_report',
        description: 'Generate GRI-compliant ESG report',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                indicators: { type: 'array' }
            },
            required: ['title', 'indicators']
        }
    },
    {
        name: 'bridge_ask_kilo',
        description: 'Ask KiloAI for insights (bidirectional learning)',
        inputSchema: {
            type: 'object',
            properties: {
                prompt: { type: 'string' }
            },
            required: ['prompt']
        }
    },
    {
        name: 'bridge_teach_kilo',
        description: 'Teach KiloAI about ESG concepts',
        inputSchema: {
            type: 'object',
            properties: {
                topic: { type: 'string', enum: ['5t_protocol', 'carbon_scope', 'trinity', 'gri'] }
            },
            required: ['topic']
        }
    }
];

/**
 * 工具名稱映射
 */
export const KILOAI_OPERATION_MAP: Record<string, string> = {
    omni_trinity_status: 'trinity.status',
    omni_analyze_esg: 'analyze_trend',
    omni_track_carbon: 'excellence.track_carbon',
    omni_seal_proof: 'seal_5t_proof',
    omni_forge_report: 'forge_gri_report',
    bridge_ask_kilo: 'bridge.ask',
    bridge_teach_kilo: 'bridge.teach'
};
