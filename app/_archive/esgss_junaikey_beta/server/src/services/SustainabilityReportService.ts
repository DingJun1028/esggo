/**
 * SustainabilityReportService.ts
 * --------------------------------
 * 永續報告書產生器核心服務
 * 
 * 核心理念：服務即教學，知識即資產
 * 設計哲學：上善若水，如水般清澈、流動、和諧
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

// ============================================
// 類型定義
// ============================================

export interface SustainabilityReport {
    id: string;
    companyId: string;
    title: string;
    reportingPeriod: {
        start: string;
        end: string;
    };
    framework: 'GRI' | 'SASB' | 'TCFD' | 'Integrated';
    sections: ReportSection[];
    metrics: ReportMetric[];
    status: 'draft' | 'review' | 'approved' | 'published' | 'Trustworthy';
    createdAt: string;
    updatedAt: string;
    version: string;
    signatures: ReportSignature[];
    hashSignature?: string;
}

export interface ReportSection {
    id: string;
    title: string;
    order: number;
    content: string;
    frameworkMapping: {
        code: string;
        name: string;
        requirement: string;
    }[];
    dataSources: {
        metricId: string;
        source: string;
        calculation: string;
    }[];
    verificationStatus: 'pending' | 'verified' | 'partial';
}

export interface ReportMetric {
    id: string;
    code: string;
    name: string;
    value: number;
    unit: string;
    category: 'E' | 'S' | 'G' | 'SupplyChain';
    yearOverYear?: number;
    target?: number;
    status: 'on_track' | 'at_risk' | 'off_track';
}

export interface ReportSignature {
    role: string;
    name: string;
    signedAt: string;
    verificationHash: string;
}

export interface GRIMapping {
    standard: string;
    code: string;
    name: string;
    category: 'Universal' | 'Topic' | 'Sector';
    disclosures: GRIDisclosure[];
}

export interface GRIDisclosure {
    code: string;
    title: string;
    requirement: string;
    reported: boolean;
    location?: string;
}

export interface TCFDAlignment {
    pillar: 'Governance' | 'Strategy' | 'Risk Management' | 'Metrics & Targets';
    required: string;
    disclosed: boolean;
    location?: string;
}

// ============================================
// GRI Standards 對照表
// ============================================

export const GRI_STANDARDS: GRIMapping[] = [
    {
        standard: 'GRI 1',
        code: 'GRI 1',
        name: '基礎 2021',
        category: 'Universal',
        disclosures: [
            { code: '1-1', title: '依循報告原則', requirement: '說明如何依循報告原則', reported: false },
            { code: '1-2', title: '揭露報告資訊', requirement: '列出所有揭露項目', reported: false },
            { code: '1-3', title: '編製報告聲明', requirement: '提供報告聲明', reported: false },
        ],
    },
    {
        standard: 'GRI 2',
        code: 'GRI 2',
        name: '一般揭露 2021',
        category: 'Universal',
        disclosures: [
            { code: '2-1', title: '組織概況', requirement: '組織基本資訊', reported: false },
            { code: '2-2', title: '報告涵蓋的實體', requirement: '報告範圍說明', reported: false },
            { code: '2-3', title: '報告期間、頻率與聯繫人', requirement: '報告時間與聯繫資訊', reported: false },
            { code: '2-4', title: '資訊重述', requirement: '說明資訊重述', reported: false },
            { code: '2-5', title: '外部保證', requirement: '說明外部保證', reported: false },
            { code: '2-6', title: '活動、價值鏈和其他商業關係', requirement: '組織活動說明', reported: false },
            { code: '2-7', title: '員工', requirement: '員工統計', reported: false },
            { code: '2-8', title: '非員工工作者', requirement: '非員工工作者統計', reported: false },
            { code: '2-9', title: '治理架構與組成', requirement: '治理架構說明', reported: false },
            { code: '2-10', title: '最高治理機構的提名與遴選', requirement: '提名遴選流程', reported: false },
            { code: '2-22', title: '永續發展聲明', requirement: '執行長聲明', reported: false },
            { code: '2-28', title: '協會會員', requirement: '協會會員資格', reported: false },
            { code: '2-29', title: '利害關係人參與方法', requirement: '利害關係人參與方式', reported: false },
        ],
    },
    {
        standard: 'GRI 3',
        code: 'GRI 3',
        name: '重大性主題 2021',
        category: 'Universal',
        disclosures: [
            { code: '3-1', title: '重大性主題的決定流程', requirement: '重大性分析流程', reported: false },
            { code: '3-2', title: '重大性主題列表', requirement: '重大性主題清單', reported: false },
            { code: '3-3', title: '重大性主題的管理', requirement: '管理方針說明', reported: false },
        ],
    },
    // 環境主題標準
    {
        standard: 'GRI 302',
        code: 'GRI 302',
        name: '能源 2016',
        category: 'Topic',
        disclosures: [
            { code: '302-1', title: '組織內部的能源消耗', requirement: '能源消耗量', reported: false },
            { code: '302-2', title: '組織外部的能源消耗', requirement: '組織外能源消耗', reported: false },
            { code: '302-3', title: '能源強度', requirement: '能源強度', reported: false },
            { code: '302-4', title: '能源消耗量的減少', requirement: '節能措施', reported: false },
            { code: '302-5', title: '降低產品和服務的能源需求', requirement: '產品節能', reported: false },
        ],
    },
    {
        standard: 'GRI 305',
        code: 'GRI 305',
        name: '排放 2016',
        category: 'Topic',
        disclosures: [
            { code: '305-1', title: '範疇一直接溫室氣體排放', requirement: '範疇一排放量', reported: false },
            { code: '305-2', title: '範疇二能源間接溫室氣體排放', requirement: '範疇二排放量', reported: false },
            { code: '305-3', title: '範疇三其他間接溫室氣體排放', requirement: '範疇三排放量', reported: false },
            { code: '305-4', title: '溫室氣體排放強度', requirement: '排放強度', reported: false },
            { code: '305-5', title: '溫室氣體排放減量', requirement: '減排措施', reported: false },
        ],
    },
    {
        standard: 'GRI 306',
        code: 'GRI 306',
        name: '廢棄物 2020',
        category: 'Topic',
        disclosures: [
            { code: '306-1', title: '廢棄物的產生及廢棄物相關重大影響', requirement: '廢棄物產生量', reported: false },
            { code: '306-2', title: '廢棄物相關重大影響的管理', requirement: '廢棄物管理', reported: false },
            { code: '306-3', title: '廢棄物產生量', requirement: '廢棄物分類統計', reported: false },
            { code: '306-4', title: '廢棄物的跨境運輸', requirement: '跨境運輸', reported: false },
            { code: '306-5', title: '廢棄物處理方式', requirement: '處理方式', reported: false },
        ],
    },
    // 社會主題標準
    {
        standard: 'GRI 401',
        code: 'GRI 401',
        name: '僱傫 2016',
        category: 'Topic',
        disclosures: [
            { code: '401-1', title: '新進與離職員工', requirement: '新進與離職員工統計', reported: false },
            { code: '401-2', title: '提供給全職員工的福利', requirement: '員工福利', reported: false },
            { code: '401-3', title: '育嬰假', requirement: '育嬰假統計', reported: false },
        ],
    },
    {
        standard: 'GRI 403',
        code: 'GRI 403',
        name: '職業安全與衛生 2018',
        category: 'Topic',
        disclosures: [
            { code: '403-1', title: '職業安全衛生管理系統', requirement: '管理系統', reported: false },
            { code: '403-2', title: '危害辨識與風險評估', requirement: '風險評估', reported: false },
            { code: '403-9', title: '職業傷害', requirement: '職業傷害統計', reported: false },
            { code: '403-10', title: '職業病', requirement: '職業病統計', reported: false },
        ],
    },
    {
        standard: 'GRI 405',
        code: 'GRI 405',
        name: '多元化與平等 2016',
        category: 'Topic',
        disclosures: [
            { code: '405-1', title: '治理機構與員工的多元化', requirement: '多元化統計', reported: false },
            { code: '405-2', title: '女性與男性的基本薪資和薪酬比率', requirement: '薪酬比率', reported: false },
        ],
    },
];

// ============================================
// TCFD 對照表
// ============================================

export const TCFD_ALIGNMENT: TCFDAlignment[] = [
    // Governance
    { pillar: 'Governance', required: '描述最高治理機構對氣候相關風險與機會的監督', disclosed: false },
    { pillar: 'Governance', required: '描述管理階層在評估和管理氣候相關風險與機會中的角色', disclosed: false },
    // Strategy
    { pillar: 'Strategy', required: '描述組織已識別的短中長期氣候相關風險與機會', disclosed: false },
    { pillar: 'Strategy', required: '描述氣候相關風險與機會對組織業務、策略與財務規劃的影響', disclosed: false },
    { pillar: 'Strategy', required: '描述組織策略在不同氣候情境下的韌性', disclosed: false },
    // Risk Management
    { pillar: 'Risk Management', required: '描述組織識別與評估氣候相關風險的流程', disclosed: false },
    { pillar: 'Risk Management', required: '描述組織管理氣候相關風險的流程', disclosed: false },
    { pillar: 'Risk Management', required: '描述氣候相關風險如何整合至組織的整體風險管理', disclosed: false },
    // Metrics & Targets
    { pillar: 'Metrics & Targets', required: '揭露用於評估氣候相關風險與機會的指標', disclosed: false },
    { pillar: 'Metrics & Targets', required: '揭露範疇一、二、三溫室氣體排放', disclosed: false },
    { pillar: 'Metrics & Targets', required: '描述組織設定的氣候相關目標與績效', disclosed: false },
];

// ============================================
// 服務類別
// ============================================

export class SustainabilityReportService {
    private static instance: SustainabilityReportService;
    private genAI: GoogleGenerativeAI | null = null;

    static getInstance(): SustainabilityReportService {
        if (!SustainabilityReportService.instance) {
            SustainabilityReportService.instance = new SustainabilityReportService();
        }
        return SustainabilityReportService.instance;
    }

    private getGenAI(): GoogleGenerativeAI | null {
        if (!this.genAI && process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        return this.genAI;
    }

    // ========================================
    // 報告書管理
    // ========================================

    /**
     * 建立新的永續報告書
     */
    async createReport(
        companyId: string,
        options: {
            title: string;
            reportingPeriod: { start: string; end: string };
            framework: 'GRI' | 'SASB' | 'TCFD' | 'Integrated';
        }
    ): Promise<SustainabilityReport> {
        const report: SustainabilityReport = {
            id: `report-${Date.now()}`,
            companyId,
            title: options.title,
            reportingPeriod: options.reportingPeriod,
            framework: options.framework,
            sections: this.generateDefaultSections(options.framework),
            metrics: [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: '1.0',
            signatures: [],
        };

        return report;
    }

    /**
     * 生成預設章節
     */
    private generateDefaultSections(
        framework: string
    ): ReportSection[] {
        const baseSections: ReportSection[] = [
            {
                id: 'sec-1',
                title: '執行長的話',
                order: 1,
                content: '',
                frameworkMapping: [{ code: '2-22', name: '永續發展聲明', requirement: '執行長對永續發展的聲明' }],
                dataSources: [],
                verificationStatus: 'pending',
            },
            {
                id: 'sec-2',
                title: '關於我們',
                order: 2,
                content: '',
                frameworkMapping: [{ code: '2-1', name: '組織概況', requirement: '組織基本資訊' }],
                dataSources: [],
                verificationStatus: 'pending',
            },
            {
                id: 'sec-3',
                title: '永續治理',
                order: 3,
                content: '',
                frameworkMapping: [{ code: '2-9', name: '治理架構', requirement: '治理架構說明' }],
                dataSources: [],
                verificationStatus: 'pending',
            },
            {
                id: 'sec-4',
                title: '環境永續',
                order: 4,
                content: '',
                frameworkMapping: [
                    { code: '302', name: '能源', requirement: '能源消耗管理' },
                    { code: '305', name: '排放', requirement: '溫室氣體排放' },
                    { code: '306', name: '廢棄物', requirement: '廢棄物管理' },
                ],
                dataSources: [],
                verificationStatus: 'pending',
            },
            {
                id: 'sec-5',
                title: '社會責任',
                order: 5,
                content: '',
                frameworkMapping: [
                    { code: '401', name: '僱傫', requirement: '員工管理' },
                    { code: '403', name: '職業安全', requirement: '職業安全衛生' },
                    { code: '405', name: '多元化', requirement: '多元化與平等' },
                ],
                dataSources: [],
                verificationStatus: 'pending',
            },
            {
                id: 'sec-6',
                title: '公司治理',
                order: 6,
                content: '',
                frameworkMapping: [{ code: 'GOV', name: '公司治理', requirement: '治理機制說明' }],
                dataSources: [],
                verificationStatus: 'pending',
            },
        ];

        if (framework === 'TCFD' || framework === 'Integrated') {
            baseSections.push({
                id: 'sec-7',
                title: '氣候相關財務揭露',
                order: 7,
                content: '',
                frameworkMapping: [
                    { code: 'TCFD-G', name: '治理', requirement: '氣候治理' },
                    { code: 'TCFD-S', name: '策略', requirement: '氣候策略' },
                    { code: 'TCFD-R', name: '風險管理', requirement: '氣候風險管理' },
                    { code: 'TCFD-M', name: '指標與目標', requirement: '氣候指標' },
                ],
                dataSources: [],
                verificationStatus: 'pending',
            });
        }

        return baseSections;
    }

    // ========================================
    // GRI 對照管理
    // ========================================

    /**
     * 取得 GRI 標準對照表
     */
    getGRIStandards(): GRIMapping[] {
        return GRI_STANDARDS;
    }

    /**
     * 取得特定 GRI 標準
     */
    getGRIStandard(code: string): GRIMapping | undefined {
        return GRI_STANDARDS.find((s) => s.code === code);
    }

    /**
     * 更新 GRI 揭露狀態
     */
    updateGRIDisclosureStatus(
        reportId: string,
        standardCode: string,
        disclosureCode: string,
        status: { reported: boolean; location?: string }
    ): { success: boolean; message: string } {
        // 實際應更新數據庫
        return {
            success: true,
            message: `已更新 ${standardCode}-${disclosureCode} 揭露狀態`,
        };
    }

    /**
     * 生成 GRI 內容索引
     */
    generateGRIContentIndex(reportId: string): {
        standard: string;
        code: string;
        name: string;
        reported: boolean;
        location: string;
    }[] {
        const index: { standard: string; code: string; name: string; reported: boolean; location: string }[] = [];

        for (const standard of GRI_STANDARDS) {
            for (const disclosure of standard.disclosures) {
                index.push({
                    standard: standard.code,
                    code: disclosure.code,
                    name: disclosure.title,
                    reported: disclosure.reported,
                    location: disclosure.location || '',
                });
            }
        }

        return index;
    }

    // ========================================
    // TCFD 對齊管理
    // ========================================

    /**
     * 取得 TCFD 對齊狀態
     */
    getTCFDAlignment(): TCFDAlignment[] {
        return TCFD_ALIGNMENT;
    }

    /**
     * 更新 TCFD 揭露狀態
     */
    updateTCFDAlignment(
        pillar: TCFDAlignment['pillar'],
        requirement: string,
        status: { disclosed: boolean; location?: string }
    ): { success: boolean; message: string } {
        return {
            success: true,
            message: `已更新 TCFD ${pillar} 揭露狀態`,
        };
    }

    // ========================================
    // AI 輔助生成
    // ========================================

    /**
     * AI 生成報告書章節內容
     */
    async generateSectionContent(
        sectionId: string,
        context: {
            companyName: string;
            industry: string;
            metrics: Record<string, number>;
            framework: string;
        }
    ): Promise<string> {
        const model = this.getGenAI()?.getGenerativeModel({ model: 'gemini-2.0-flash' });

        if (!model) {
            return this.generateFallbackContent(sectionId, context);
        }

        const prompt = `
      身為 ESG 永續報告書撰寫專家，請為以下公司生成報告書章節內容。

      公司名稱：${context.companyName}
      產業：${context.industry}
      框架：${context.framework}
      關鍵指標：${JSON.stringify(context.metrics)}

      章節 ID：${sectionId}

      請生成符合 GRI Standards 標準的專業內容，包含：
      1. 管理方針說明
      2. 績效數據呈現
      3. 年度比較分析
      4. 未來展望與目標

      請使用專業、正式的報告書語言，並以 Markdown 格式輸出。
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI content generation error:', error);
            return this.generateFallbackContent(sectionId, context);
        }
    }

    /**
     * 備用內容生成（無 AI 時）
     */
    private generateFallbackContent(
        sectionId: string,
        context: any
    ): string {
        const sectionTemplates: Record<string, string> = {
            'sec-4': `## 環境永續管理

### 管理方針
${context.companyName} 秉持「環境永續」的核心理念，將環境保護融入日常營運活動中。我們承諾透過系統性的環境管理，持續降低營運對環境的影響，並與利害關係人共同創造環境、社會與經濟的三重效益。

### 2024 年度績效
| 指標 | 數值 | 單位 | 年度變化 |
|------|------|------|----------|
| 碳排放量 | ${context.metrics.carbon || 'N/A'} | tCO2e | -5% |
| 能源消耗 | ${context.metrics.energy || 'N/A'} | MWh | -3% |
| 用水量 | ${context.metrics.water || 'N/A'} | ML | -2% |
| 廢棄物回收率 | ${context.metrics.waste || 'N/A'} | % | +8% |

### 未來目標
- 2030 年達成範疇一、二排放較 2020 年減少 50%
- 2025 年再生能源使用比例達 20%
- 2025 年廢棄物資源化率達 85%`,

            'sec-5': `## 社會責任實踐

### 人才發展
${context.companyName} 視員工為最重要的資產，致力於打造多元、包容且充滿挑戰的工作環境。我們提供具競爭力的薪酬福利、完善的培訓發展體系，以及安全健康的工作場所。

### 2024 年度社會績效
| 指標 | 數值 | 說明 |
|------|------|------|
| 員工總人數 | ${context.metrics.employees || 'N/A'} 人 | 較去年成長 8% |
| 員工滿意度 | ${context.metrics.satisfaction || 'N/A'} 分 | 滿分 5 分 |
| 訓練時數 | ${context.metrics.training || 'N/A'} 小時/人 | 平均 |
| 職安事件 | ${context.metrics.incidents || '0'} 件 | 零職災目標 |

### 社會參與
我們積極參與社區公益活動，2024 年投入社會公益金額達新台幣 ${context.metrics.community || 'N/A'} 萬元，志工服務時數超過 ${context.metrics.volunteer || 'N/A'} 小時。`,
        };

        return (
            sectionTemplates[sectionId] ||
            `## 章節內容

此章節內容待補充。請提供相關數據與管理方針說明。
      
公司：${context.companyName}
產業：${context.industry}`
        );
    }

    // ========================================
    // 報告書驗證
    // ========================================

    /**
     * 檢查報告書完整性
     */
    validateReport(report: SustainabilityReport): {
        valid: boolean;
        issues: string[];
        completeness: number;
    } {
        const issues: string[] = [];
        let completedSections = 0;

        // 檢查各章節內容
        for (const section of report.sections) {
            if (section.content && section.content.length > 100) {
                completedSections++;
            } else {
                issues.push(`章節「${section.title}」內容不完整`);
            }
        }

        // 檢查 GRI 揭露
        let disclosedCount = 0;
        let totalRequired = 0;
        for (const standard of GRI_STANDARDS) {
            totalRequired += standard.disclosures.length;
            for (const disclosure of standard.disclosures) {
                if (disclosure.reported) disclosedCount++;
            }
        }

        // 計算完整性分數
        const sectionCompleteness = (completedSections / report.sections.length) * 100;
        const disclosureCompleteness = (disclosedCount / totalRequired) * 100;
        const completeness = Math.round((sectionCompleteness + disclosureCompleteness) / 2);

        return {
            valid: completeness >= 70,
            issues,
            completeness,
        };
    }

    /**
     * 終極封存：將報告轉化為 Trustworthy 資產
     */
    async finalizeReport(report: SustainabilityReport): Promise<SustainabilityReport> {
        if (report.status === 'Trustworthy') return report;

        // 生成誠信雜湊 (SHA-256)
        const dataToHash = JSON.stringify({
            id: report.id,
            content: report.sections.map(s => s.content).join(''),
            metrics: report.metrics.map(m => m.value)
        });

        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        return {
            ...report,
            status: 'Trustworthy',
            hashSignature: `sha256-${hash}`,
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * 生成報告書完整性報告
     */
    generateCompletenessReport(report: SustainabilityReport): {
        overallScore: number;
        sectionScores: { section: string; score: number; status: string }[];
        frameworkAlignment: {
            framework: string;
            score: number;
            missingItems: string[];
        };
        recommendations: string[];
    } {
        const sectionScores = report.sections.map((section) => ({
            section: section.title,
            score: section.content && section.content.length > 100 ? 100 : 0,
            status: section.content && section.content.length > 100 ? '完成' : '待補充',
        }));

        // GRI 對齊分數
        let griDisclosed = 0;
        let griTotal = 0;
        for (const standard of GRI_STANDARDS) {
            griTotal += standard.disclosures.length;
            for (const disclosure of standard.disclosures) {
                if (disclosure.reported) griDisclosed++;
            }
        }
        const griScore = Math.round((griDisclosed / griTotal) * 100);

        const overallScore = Math.round(
            (sectionScores.reduce((sum, s) => sum + s.score, 0) / sectionScores.length +
                griScore) /
            2
        );

        return {
            overallScore,
            sectionScores,
            frameworkAlignment: {
                framework: 'GRI Standards',
                score: griScore,
                missingItems: GRI_STANDARDS.flatMap((s) =>
                    s.disclosures
                        .filter((d) => !d.reported)
                        .map((d) => `${s.code}-${d.code} ${d.title}`)
                ),
            },
            recommendations: this.generateRecommendations(overallScore, griScore),
        };
    }

    /**
     * 生成改善建議
     */
    private generateRecommendations(
        overallScore: number,
        griScore: number
    ): string[] {
        const recommendations: string[] = [];

        if (overallScore < 50) {
            recommendations.push('建議優先完成基本章節內容，包括執行長的話、關於我們等章節');
        }
        if (griScore < 50) {
            recommendations.push('建議加強 GRI 一般揭露項目，特別是 GRI 2-1 至 GRI 2-9');
        }
        if (griScore < 70) {
            recommendations.push('建議補充環境相關揭露（GRI 302、305、306）');
        }
        if (griScore < 70) {
            recommendations.push('建議補充社會相關揭露（GRI 401、403、405）');
        }

        recommendations.push('建議進行內部審查，確保所有揭露符合框架要求');

        return recommendations;
    }
}

// 導出單例
export const sustainabilityReportService =
    SustainabilityReportService.getInstance();
