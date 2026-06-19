import { OmniNcbService } from './omni-ncb-service';

/**
 🎯 OmniRiskPredictor: 風險預測器
 * 提供 ESG 風險評估、預警和情景分析
 */

export interface IRiskFactor {
    id: string;
    name: string;
    category: 'environmental' | 'social' | 'governance' | 'operational' | 'financial';
    probability: number;
    impact: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    mitigationStatus: 'mitigated' | 'partial' | 'unmitigated';
}

export interface IRiskScenario {
    id: string;
    name: string;
    description: string;
    probability: number;
    impact: number;
    timeframe: string;
    indicators: string[];
}

export interface IRiskAssessment {
    overallRiskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    trend: 'improving' | 'stable' | 'deteriorating';
    factors: IRiskFactor[];
    scenarios: IRiskScenario[];
    lastAssessment: number;
}

export interface IRiskAlert {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    category: string;
    timestamp: number;
    actionable: boolean;
    recommendedActions: string[];
}

export interface IRiskPrediction {
    timeframe: '1_month' | '3_months' | '6_months' | '1_year';
    predictedRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    keyDrivers: string[];
    recommendations: string[];
}

export class OmniRiskPredictor {
    private static instance: OmniRiskPredictor;
    private riskFactors: IRiskFactor[] = [];
    private riskScenarios: IRiskScenario[] = [];
    private alerts: IRiskAlert[] = [];

    private constructor() {
        this.initializeDefaultRisks();
    }

    public static getInstance(): OmniRiskPredictor {
        if (!OmniRiskPredictor.instance) {
            OmniRiskPredictor.instance = new OmniRiskPredictor();
        }
        return OmniRiskPredictor.instance;
    }

    private initializeDefaultRisks(): void {
        this.riskFactors = [
            {
                id: 'risk-carbon-regulation',
                name: '碳監管政策變化',
                category: 'environmental',
                probability: 0.75,
                impact: 8.5,
                trend: 'increasing',
                mitigationStatus: 'partial'
            },
            {
                id: 'risk-climate-physical',
                name: '氣候變遷實體風險',
                category: 'environmental',
                probability: 0.65,
                impact: 9.0,
                trend: 'increasing',
                mitigationStatus: 'unmitigated'
            },
            {
                id: 'risk-supply-labor',
                name: '供應鏈勞動爭議',
                category: 'social',
                probability: 0.45,
                impact: 7.0,
                trend: 'stable',
                mitigationStatus: 'mitigated'
            },
            {
                id: 'risk-data-privacy',
                name: '資料隱私與安全',
                category: 'governance',
                probability: 0.55,
                impact: 8.0,
                trend: 'increasing',
                mitigationStatus: 'partial'
            },
            {
                id: 'risk-ops-continuity',
                name: '營運連續性風險',
                category: 'operational',
                probability: 0.35,
                impact: 7.5,
                trend: 'stable',
                mitigationStatus: 'mitigated'
            },
            {
                id: 'risk-esg-greenwashing',
                name: '漂綠質疑風險',
                category: 'governance',
                probability: 0.50,
                impact: 8.5,
                trend: 'increasing',
                mitigationStatus: 'partial'
            }
        ];

        this.riskScenarios = [
            {
                id: 'scenario-carbon-tax',
                name: '碳稅全面實施',
                description: '政府全面實施碳稅政策，碳排放成本大幅增加',
                probability: 0.7,
                impact: 8.5,
                timeframe: '2-3 年',
                indicators: ['碳價走勢', '政策公告', '產業別平均碳強度']
            },
            {
                id: 'scenario-net-zero-commitment',
                name: '淨零目標壓力',
                description: '投資人與監管機構要求加速淨零轉型',
                probability: 0.8,
                impact: 7.5,
                timeframe: '1-2 年',
                indicators: ['投資人要求', '监管機構立場', '同業承諾']
            },
            {
                id: 'scenario-supply-disruption',
                name: '供應鏈中斷',
                description: '氣候事件導致關鍵供應商營運中斷',
                probability: 0.4,
                impact: 9.0,
                timeframe: '不定時',
                indicators: ['供應商地理分布', '備援計畫', '保險覆蓋']
            }
        ];

        this.alerts = [
            {
                id: 'alert-carbon-1',
                severity: 'warning',
                title: '碳排放即將超標',
                description: '本季碳排放量已達到警示標準的 85%，請注意減排進度',
                category: 'environmental',
                timestamp: Date.now() - 86400000,
                actionable: true,
                recommendedActions: ['檢視排放熱點', '加速再生能源採購', '調整生產排程']
            },
            {
                id: 'alert-governance-1',
                severity: 'critical',
                title: '董事任期須重新審視',
                description: '三位獨立董事任期即將超過九年，需進行改選',
                category: 'governance',
                timestamp: Date.now() - 172800000,
                actionable: true,
                recommendedActions: ['啟動董事提名流程', '評估多元化政策落實', '準備相關揭露文件']
            },
            {
                id: 'alert-social-1',
                severity: 'info',
                title: '員工滿意度調查啟動',
                description: '年度員工滿意度調查將於下月開始',
                category: 'social',
                timestamp: Date.now() - 43200000,
                actionable: false,
                recommendedActions: ['準備調查問卷', '宣導調查目的', '確保匿名性']
            }
        ];
    }

    /**
     * 獲取當前風險評估
     */
    public async getRiskAssessment(): Promise<IRiskAssessment> {
        const reports = await OmniNcbService.listReports();
        let baseImpact = 0;
        if (reports && reports.length > 0) {
            // Apply a slight penalty if the latest reports are poorly scored
            const latest = reports[reports.length - 1];
            if (latest.compliance_score < 60) {
                baseImpact = 1.5;
            }
        }

        const totalProbability = this.riskFactors.reduce((sum, f) => sum + f.probability, 0);
        const totalImpact = this.riskFactors.reduce((sum, f) => sum + f.impact + baseImpact, 0);
        const avgScore = (totalProbability * totalImpact) / this.riskFactors.length;

        let riskLevel: 'low' | 'medium' | 'high' | 'critical';
        if (avgScore < 20) riskLevel = 'low';
        else if (avgScore < 40) riskLevel = 'medium';
        else if (avgScore < 60) riskLevel = 'high';
        else riskLevel = 'critical';

        return {
            overallRiskScore: Math.round(avgScore * 10) / 10,
            riskLevel,
            trend: 'stable',
            factors: this.riskFactors,
            scenarios: this.riskScenarios,
            lastAssessment: Date.now()
        };
    }

    /**
     * 獲取風險預警列表
     */
    public async getRiskAlerts(): Promise<IRiskAlert[]> {
        return this.alerts;
    }

    /**
     * 🔮 Gnosis-enhanced Risk Prediction
     */
    public async getRiskPrediction(timeframe: IRiskPrediction['timeframe']): Promise<IRiskPrediction> {
        const reports = await OmniNcbService.listReports();
        let baseScorePenalty = 0;
        if (reports && reports.length > 0 && reports[reports.length - 1].compliance_score < 70) {
            baseScorePenalty = 10;
        }

        const timeframeMap = {
            '1_month': { factor: 0.3, baseScore: 45 + baseScorePenalty },
            '3_months': { factor: 0.5, baseScore: 48 + baseScorePenalty },
            '6_months': { factor: 0.7, baseScore: 52 + baseScorePenalty },
            '1_year': { factor: 0.9, baseScore: 55 + baseScorePenalty }
        };

        const config = timeframeMap[timeframe];
        const predictedScore = config.baseScore + (Math.random() * 10 - 5) * config.factor;

        let predictedLevel: 'low' | 'medium' | 'high' | 'critical';
        if (predictedScore < 20) predictedLevel = 'low';
        else if (predictedScore < 40) predictedLevel = 'medium';
        else if (predictedScore < 60) predictedLevel = 'high';
        else predictedLevel = 'critical';

        return {
            timeframe,
            predictedRiskLevel: predictedLevel,
            confidence: 0.78 + Math.random() * 0.12,
            keyDrivers: [
                'Gnosis Driver: Carbon Regulatory Vector Shift',
                'Gnosis Driver: Climate Physical Anomaly Drift',
                'Gnosis Driver: Supply Chain Resonance Fragility',
                'Gnosis Driver: Stakeholder ESG Expectation Peak'
            ],
            recommendations: [
                'Initialize Gnosis Internal Carbon Pricing Loop',
                'Forge 5T Supply Chain Verification Nodes',
                'Reinforce Climate Risk Governance Framework',
                'Optimize Transparency via 5T Trusted Ledger'
            ]
        };
    }

    /**
     * 獲取風險儀表板摘要
     */
    public async getDashboardSummary(): Promise<{
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        score: number;
        activeAlerts: number;
        criticalFactors: number;
    }> {
        const assessment = await this.getRiskAssessment();
        const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
        const criticalFactors = this.riskFactors.filter(f => f.impact >= 8 && f.probability >= 0.6).length;

        return {
            riskLevel: assessment.riskLevel,
            score: assessment.overallRiskScore,
            activeAlerts: this.alerts.length,
            criticalFactors
        };
    }
}

export const riskPredictor = OmniRiskPredictor.getInstance();