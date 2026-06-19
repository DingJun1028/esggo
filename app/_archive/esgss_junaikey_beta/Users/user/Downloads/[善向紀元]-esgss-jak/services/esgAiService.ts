// ESG專用AI服務 - 整合JunAiKey智庫能力
export interface ESGAiAnalysis {
    recommendations: string[];
    risks: string[];
    opportunities: string[];
    insights: string[];
}

export interface ESGChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export class ESGAiService {
    private static instance: ESGAiService;
    private readonly junAiKeyUrl = 'http://localhost:3000';
    private readonly adminToken = process.env.ADMIN_SECRET || 'celestial-access-2024';

    private constructor() {}

    public static getInstance(): ESGAiService {
        if (!ESGAiService.instance) {
            ESGAiService.instance = new ESGAiService();
        }
        return ESGAiService.instance;
    }

    // 初始化ESG知識庫
    async initializeESGKnowledge(): Promise<void> {
        try {
            const esgKnowledge = [
                {
                    kbId: 'esg-framework',
                    text: `ESG永續發展框架包括三個核心面向：
                    環境(Environmental)：氣候變遷、碳排放、能源使用、水資源管理、生物多樣性
                    社會(Social)：員工福祉、供應鏈管理、產品責任、社區參與、人權保障
                    治理(Governance)：董事會組成、經理人薪酬、股東權益、審計品質、風險管理`,
                    source: 'esg-framework'
                },
                {
                    kbId: 'carbon-footprint',
                    text: `碳足跡計算方法：
                    Scope 1: 直接排放 - 公司擁有的或控制的排放源
                    Scope 2: 間接排放 - 購買電力產生的排放
                    Scope 3: 價值鏈排放 - 上游供應商和下游客戶活動
                    計算單位: 噸CO₂當量(tCO₂e)`,
                    source: 'carbon-methodology'
                },
                {
                    kbId: 'sdgs-mapping',
                    text: `SDGs與ESG映射：
                    SDG 3 (良好健康) -> 員工健康、安全管理
                    SDG 7 (乾淨能源) -> 可再生能源轉型
                    SDG 8 (體面工作) -> 勞工權益、公平薪酬
                    SDG 12 (責任消費) -> 循環經濟、永續供應鏈
                    SDG 13 (氣候行動) -> 碳中和目標、減排策略`,
                    source: 'sdgs-mapping'
                }
            ];

            for (const knowledge of esgKnowledge) {
                await this.learnESGKnowledge(knowledge.kbId, knowledge.text, knowledge.source);
            }

            console.log('ESG知識庫初始化完成');
        } catch (error) {
            console.error('ESG知識庫初始化失敗:', error);
        }
    }

    // 學習ESG知識
    async learnESGKnowledge(kbId: string, text: string, source: string): Promise<void> {
        try {
            const response = await fetch(`${this.junAiKeyUrl}/api/learn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-celestial-token': this.adminToken
                },
                body: JSON.stringify({
                    kbId,
                    text,
                    source,
                    payload: { type: 'esg-knowledge', timestamp: Date.now() }
                })
            });

            if (!response.ok) {
                throw new Error(`學習失敗: ${response.status}`);
            }

            const result = await response.json();
            console.log('知識學習成功:', result);
        } catch (error) {
            console.error('學習ESG知識失敗:', error);
            throw error;
        }
    }

    // ESG數據AI分析
    async analyzeESGData(
        companyData: any,
        carbonData: any[],
        socialData: any[],
        governanceData: any
    ): Promise<ESGAiAnalysis> {
        try {
            const context = `
公司基本資料: ${JSON.stringify(companyData)}
碳排放數據: ${JSON.stringify(carbonData)}
社會影響數據: ${JSON.stringify(socialData)}
治理評分數據: ${JSON.stringify(governanceData)}
            `.trim();

            const analysisPrompt = `
請基於以下ESG數據進行深度分析，提供具體建議：

1. 環境面向分析和改進建議
2. 社會面向分析和改進建議  
3. 治理面向分析和改進建議
4. 整體ESG策略建議
5. 潛在風險識別
6. 市場機會識別

請用繁體中文回答，並提供可行動的具體建議。

數據內容:
${context}
            `;

            const response = await fetch(`${this.junAiKeyUrl}/api/learn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-celestial-token': this.adminToken
                },
                body: JSON.stringify({
                    kbId: 'esg-analysis',
                    text: analysisPrompt,
                    source: 'esg-data-analysis'
                })
            });

            // 獲取AI分析結果
            const chatResponse = await this.chatWithESGAi(analysisPrompt);

            // 解析分析結果
            const analysisResult = this.parseAnalysisResult(chatResponse);

            return analysisResult;
        } catch (error) {
            console.error('ESG數據AI分析失敗:', error);
            return this.getDefaultAnalysis();
        }
    }

    // 與ESG AI對話
    async chatWithESGAi(message: string): Promise<string> {
        try {
            const response = await fetch(`${this.junAiKeyUrl}/api/interact?message=${encodeURIComponent(message)}&sessionId=esg-session-${Date.now()}`, {
                headers: {
                    'x-celestial-token': this.adminToken
                }
            });

            if (!response.ok) {
                throw new Error(`對話失敗: ${response.status}`);
            }

            let fullResponse = '';
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'text') {
                                    fullResponse += data.content;
                                }
                            } catch (e) {
                                // 忽略解析錯誤
                            }
                        }
                    }
                }
            }

            return fullResponse || '抱歉，我無法處理您的請求。';
        } catch (error) {
            console.error('ESG AI對話失敗:', error);
            return 'AI服務暫時不可用，請稍後再試。';
        }
    }

    // 生成ESG報告建議
    async generateESGReportSuggestions(report: any): Promise<string[]> {
        try {
            const prompt = `
請基於以下ESG報告數據，生成具體的改進建議：

報告數據: ${JSON.stringify(report)}

請提供5-8項具體、可操作的改進建議，涵蓋環境、社會、治理三個面向。
            `;

            const response = await this.chatWithESGAi(prompt);
            return this.parseSuggestions(response);
        } catch (error) {
            console.error('生成ESG報告建議失敗:', error);
            return [
                '定期審視碳排放數據並設定具體減排目標',
                '加強供應鏈永續管理',
                '提升員工參與度和滿意度調查',
                '完善治理結構和透明度報告'
            ];
        }
    }

    // 解析分析結果
    private parseAnalysisResult(response: string): ESGAiAnalysis {
        // 簡單的結果解析邏輯
        const lines = response.split('\n');
        const recommendations: string[] = [];
        const risks: string[] = [];
        const opportunities: string[] = [];
        const insights: string[] = [];

        let currentSection = '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.includes('建議') || trimmed.includes('改進')) {
                currentSection = 'recommendations';
            } else if (trimmed.includes('風險')) {
                currentSection = 'risks';
            } else if (trimmed.includes('機會')) {
                currentSection = 'opportunities';
            } else if (trimmed.includes('洞見') || trimmed.includes('分析')) {
                currentSection = 'insights';
            } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                const item = trimmed.substring(1).trim();
                if (item && currentSection) {
                    switch (currentSection) {
                        case 'recommendations':
                            recommendations.push(item);
                            break;
                        case 'risks':
                            risks.push(item);
                            break;
                        case 'opportunities':
                            opportunities.push(item);
                            break;
                        case 'insights':
                            insights.push(item);
                            break;
                    }
                }
            }
        }

        // 如果解析失敗，返回默認結果
        if (recommendations.length === 0 && risks.length === 0) {
            return this.getDefaultAnalysis();
        }

        return {
            recommendations: recommendations.length > 0 ? recommendations : ['繼續關注ESG指標表現'],
            risks: risks.length > 0 ? risks : ['需持續監控市場變化'],
            opportunities: opportunities.length > 0 ? opportunities : ['探索創新永續解決方案'],
            insights: insights.length > 0 ? insights : ['ESG表現與企業價值密切相關']
        };
    }

    // 解析建議
    private parseSuggestions(response: string): string[] {
        const suggestions: string[] = [];
        const lines = response.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
                const suggestion = trimmed.replace(/^[-•\d\.]+\s*/, '').trim();
                if (suggestion.length > 10) { // 過濾太短的建議
                    suggestions.push(suggestion);
                }
            }
        }

        return suggestions.length > 0 ? suggestions : this.getDefaultSuggestions();
    }

    // 默認分析結果
    private getDefaultAnalysis(): ESGAiAnalysis {
        return {
            recommendations: [
                '建立完整的碳排放盤查和減排計劃',
                '加強供應鏈永續管理評估',
                '提升員工福祉和多元包容政策',
                '完善治理結構和利益相關者溝通'
            ],
            risks: [
                '氣候變遷帶來的營運風險',
                '供應鏈中斷的可能性',
                '法規遵循成本增加',
                '聲譽風險'
            ],
            opportunities: [
                '綠色金融市場機會',
                '創新產品服務開發',
                '提升品牌價值',
                '吸引永續投資'
            ],
            insights: [
                'ESG表現已成為企業核心競爭力',
                '利益相關者期望日益提高',
                '科技創新可加速永續轉型',
                '數據透明度提升投資信心'
            ]
        };
    }

    // 默認建議
    private getDefaultSuggestions(): string[] {
        return [
            '建立完整的ESG數據收集和分析系統',
            '制定具體的永續發展目標和時間表',
            '加強與利益相關者的溝通和參與',
            '定期進行ESG績效評估和報告',
            '投資綠色科技和創新解決方案',
            '提升員工ESG意識和能力建設'
        ];
    }
}

// 導出單例實例
export const esgAiService = ESGAiService.getInstance();