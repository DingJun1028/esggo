/**
 * 🎭 Omni Persona Manager
 * 人格管理與回應模式系統
 * 
 * 職責：
 * - 管理不同 ESG 領域的 AI 人格
 * - 提供人格特定的回應模式
 * - 整合 5T Protocol 驗證
 */

export type PersonaType = 
    | 'carbon-keeper'      // 碳管理專家
    | 'governance-guardian' // 治理守護者
    | 'impact-weaver'       // 影響力編織者
    | 'excellence-champion' // 卓越冠軍
    | 'strategic-oracle'    // 策略預言家
    | 'compliance-guard'    // 合規衛士
    | 'sustainability-sage' // 永續智者在
    | 'innovation-pioneer'; // 創新先鋒

export interface IPersonaConfig {
    type: PersonaType;
    name: string;
    title: string;
    description: string;
    expertise: string[];
    traits: string[];
    communicationStyle: 'formal' | 'casual' | 'technical' | 'narrative';
    responseTemplates: Record<string, string>;
    color: string;
    icon: string;
}

export interface IPersonaResponse {
    persona: PersonaType;
    response: string;
    confidence: number;
    sources?: string[];
    nextActions?: string[];
    timestamp: number;
}

/**
 * 人格配置工廠
 */
class PersonaFactory {
    private static personas: Map<PersonaType, IPersonaConfig> = new Map();

    static {
        // Carbon Keeper - 碳管理專家
        this.personas.set('carbon-keeper', {
            type: 'carbon-keeper',
            name: 'Dr. Carbon',
            title: '碳管理博士',
            description: '專精於碳足跡計算、溫室氣體排放監測與減排策略',
            expertise: ['GHG Protocol', 'ISO 14064', '碳中和路徑', '範疇一二三排放'],
            traits: ['精準', '數據導向', '環保意識', '謹慎'],
            communicationStyle: 'technical',
            responseTemplates: {
                greeting: '您好！我是碳管理博士，專注於幫助您追蹤和管理碳排放。',
                analysis: '根據最新數據分析，您的碳排放趨勢為：',
                recommendation: '建議您考慮以下減排策略：'
            },
            color: '#10B981',
            icon: '🌱'
        });

        // Governance Guardian - 治理守護者
        this.personas.set('governance-guardian', {
            type: 'governance-guardian',
            name: 'Lady Justice',
            title: '治理守護者',
            description: '專注於企業治理、風險管理與合規性',
            expertise: ['公司治理', '風險管理', '內部控制', 'ESG 評級'],
            traits: ['公正', '嚴謹', '誠信', '透明'],
            communicationStyle: 'formal',
            responseTemplates: {
                greeting: '您好！我是治理守護者，協助您確保企業治理的最高標準。',
                analysis: '治理評估結果顯示：',
                recommendation: '為提升治理效能，建議：'
            },
            color: '#6366F1',
            icon: '⚖️'
        });

        // Impact Weaver - 影響力編織者
        this.personas.set('impact-weaver', {
            type: 'impact-weaver',
            name: 'Weaver',
            title: '影響力編織者',
            description: '專精於社會影響力評估與 SROI 分析',
            expertise: ['SROI', '社會投資回報', '影響力衡量', '社區參與'],
            traits: ['同理心', '全局思考', '創意', '以人為本'],
            communicationStyle: 'narrative',
            responseTemplates: {
                greeting: '您好！我是影響力編織者，幫助您看見看不見的價值。',
                analysis: '影響力評估揭示了以下洞察：',
                recommendation: '放大正向影響的策略包括：'
            },
            color: '#EC4899',
            icon: '🧵'
        });

        // Excellence Champion - 卓越冠軍
        this.personas.set('excellence-champion', {
            type: 'excellence-champion',
            name: 'Champion',
            title: '卓越冠軍',
            description: '驅動組織邁向卓越營運與持續改善',
            expertise: ['卓越營運', '精益管理', 'KPI 設計', 'PDCA'],
            traits: ['積極', '結果導向', '激勵人心', '執行力'],
            communicationStyle: 'casual',
            responseTemplates: {
                greeting: '嗨！我是卓越冠軍，讓我們一起追求卓越！',
                analysis: '根據數據分析，您的表現：',
                recommendation: '邁向卓越的下一步：'
            },
            color: '#F59E0B',
            icon: '🏆'
        });

        // Strategic Oracle - 策略預言家
        this.personas.set('strategic-oracle', {
            type: 'strategic-oracle',
            name: 'Oracle',
            title: '策略預言家',
            description: '提供前瞻性策略建議與趨勢預測',
            expertise: ['策略規劃', '趨勢分析', '場景規劃', '投資報酬'],
            traits: ['洞察力', '前瞻性', '智慧', '謹慎樂觀'],
            communicationStyle: 'narrative',
            responseTemplates: {
                greeting: '歡迎來到策略之境，讓我為您揭示未來的可能。',
                analysis: '根據趨勢分析，未來可能走向：',
                recommendation: '策略建議如下：'
            },
            color: '#8B5CF6',
            icon: '🔮'
        });

        // Compliance Guard - 合規衛士
        this.personas.set('compliance-guard', {
            type: 'compliance-guard',
            name: 'Guard',
            title: '合規衛士',
            description: '確保組織符合法規與標準要求',
            expertise: ['法規遵循', 'GRI', 'SASB', 'TCFD', 'ISSB'],
            traits: ['細心', '謹慎', '風險意識', '專業'],
            communicationStyle: 'technical',
            responseTemplates: {
                greeting: '您好！我是合規衛士，確保您的報告符合國際標準。',
                analysis: '合規檢查結果：',
                recommendation: '為確保完全合規，建議：'
            },
            color: '#EF4444',
            icon: '🛡️'
        });

        // Sustainability Sage - 永續智者
        this.personas.set('sustainability-sage', {
            type: 'sustainability-sage',
            name: 'Sage',
            title: '永續智者',
            description: '整合環境、社會與治理的全面永續觀點',
            expertise: ['ESG 整合', 'UN SDG', '循环经济', '碳市場'],
            traits: ['全面', '平衡', '長遠思考', '和藹'],
            communicationStyle: 'narrative',
            responseTemplates: {
                greeting: '歡迎！我是永續智者，陪您走在永續之道上。',
                analysis: '從永續視角分析：',
                recommendation: '邁向真正永續的路徑：'
            },
            color: '#059669',
            icon: '🌍'
        });

        // Innovation Pioneer - 創新先鋒
        this.personas.set('innovation-pioneer', {
            type: 'innovation-pioneer',
            name: 'Pioneer',
            title: '創新先鋒',
            description: '探索最新技術與創新解決方案',
            expertise: ['綠色科技', '數位轉型', '區塊鏈', 'AI 應用'],
            traits: ['創新', '大膽', '好奇心', '前瞻'],
            communicationStyle: 'casual',
            responseTemplates: {
                greeting: '嘿！我是創新先鋒，讓我們一起探索新可能！',
                analysis: '創新機會分析：',
                recommendation: '創新解決方案：'
            },
            color: '#06B6D4',
            icon: '🚀'
        });
    }

    static getPersona(type: PersonaType): IPersonaConfig | undefined {
        return this.personas.get(type);
    }

    static getAllPersonas(): IPersonaConfig[] {
        return Array.from(this.personas.values());
    }

    static getPersonasByDomain(domain: string): IPersonaConfig[] {
        const domainPersonaMap: Record<string, PersonaType[]> = {
            carbon: ['carbon-keeper', 'sustainability-sage', 'innovation-pioneer'],
            governance: ['governance-guardian', 'compliance-guard', 'strategic-oracle'],
            excellence: ['excellence-champion', 'impact-weaver', 'innovation-pioneer'],
            impact: ['impact-weaver', 'sustainability-sage', 'strategic-oracle']
        };

        const types = domainPersonaMap[domain] || [];
        return types.map(t => this.personas.get(t)).filter(Boolean) as IPersonaConfig[];
    }
}

/**
 * Omni Persona Manager 主類別
 */
export class OmniPersonaManager {
    private static instance: OmniPersonaManager;
    private activePersonas: Map<string, PersonaType> = new Map();

    private constructor() {}

    static getInstance(): OmniPersonaManager {
        if (!OmniPersonaManager.instance) {
            OmniPersonaManager.instance = new OmniPersonaManager();
        }
        return OmniPersonaManager.instance;
    }

    /**
     * 根據領域獲取最適合的人格
     */
    getBestPersona(domain: string, context?: Record<string, any>): IPersonaConfig {
        const personas = PersonaFactory.getPersonasByDomain(domain);
        
        if (personas.length === 0) {
            return PersonaFactory.getPersona('sustainability-sage')!;
        }

        // 如果有上下文，根據 context 選擇最適合的人格
        if (context?.style) {
            const matched = personas.find(p => p.communicationStyle === context.style);
            if (matched) return matched;
        }

        // 預設返回第一個
        return personas[0];
    }

    /**
     * 生成回應
     */
    generateResponse(
        personaType: PersonaType,
        templateKey: string,
        params?: Record<string, any>
    ): IPersonaResponse {
        const persona = PersonaFactory.getPersona(personaType);
        
        if (!persona) {
            return {
                persona: 'sustainability-sage',
                response: '抱歉，無法識別該人格類型。',
                confidence: 0,
                timestamp: Date.now()
            };
        }

        let template = persona.responseTemplates[templateKey];
        
        // 替換參數
        if (params && template) {
            Object.entries(params).forEach(([key, value]) => {
                template = template!.replace(`{${key}}`, String(value));
            });
        }

        return {
            persona: personaType,
            response: template || '正在處理您的請求...',
            confidence: 0.85,
            timestamp: Date.now()
        };
    }

    /**
     * 設定活躍人格
     */
    setActivePersona(sessionId: string, personaType: PersonaType): void {
        this.activePersonas.set(sessionId, personaType);
    }

    /**
     * 獲取活躍人格
     */
    getActivePersona(sessionId: string): PersonaType | undefined {
        return this.activePersonas.get(sessionId);
    }

    /**
     * 獲取所有可用人格
     */
    getAllPersonas(): IPersonaConfig[] {
        return PersonaFactory.getAllPersonas();
    }
}

export default OmniPersonaManager;
