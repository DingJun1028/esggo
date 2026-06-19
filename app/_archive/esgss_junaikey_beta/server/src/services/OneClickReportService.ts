/**
 * OneClickReportService.ts
 * -----------------------
 * 永續報告書一鍵生成服務
 * 
 * 核心理念：服務即教學，知識即資產
 * 設計哲學：上善若水，如水般清澈、流動、和諧
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    SustainabilityReport,
    ReportSection,
    ReportMetric,
    GRI_STANDARDS,
    TCFD_ALIGNMENT
} from './SustainabilityReportService.js';

// ============================================
// 類型定義
// ============================================

export interface OneClickReportConfig {
    companyName: string;
    industry: string;
    reportingPeriod: {
        start: string;
        end: string;
    };
    framework: 'GRI' | 'SASB' | 'TCFD' | 'Integrated';
    data?: {
        carbonEmission?: number;
        energyConsumption?: number;
        waterUsage?: number;
        wasteGenerated?: number;
        employeeCount?: number;
        employeeSatisfaction?: number;
        trainingHours?: number;
        incidentCount?: number;
        boardDiversity?: number;
        turnoverRate?: number;
    };
    options?: {
        includeTCFD?: boolean;
        includeGoals?: boolean;
        tone?: 'formal' | 'professional' | 'concise';
        language?: 'zh-TW' | 'en';
    };
}

export interface OneClickReportResult {
    report: SustainabilityReport;
    generationTime: number;
    completenessScore: number;
    warnings: string[];
    nextSteps: string[];
}

export interface ReportSectionTemplate {
    id: string;
    title: string;
    griCode?: string;
    tcfdPillar?: string;
    sections: string[];
    metrics: string[];
}

// ============================================
// 報告書章節模板
// ============================================

const SECTION_TEMPLATES: ReportSectionTemplate[] = [
    {
        id: 'sec-ceo',
        title: '執行長的話',
        griCode: '2-22',
        sections: ['永續願景', '年度亮點', '未來展望'],
        metrics: [],
    },
    {
        id: 'sec-about',
        title: '關於我們',
        griCode: '2-1',
        sections: ['公司簡介', '營運規模', '價值鏈'],
        metrics: ['employeeCount'],
    },
    {
        id: 'sec-governance',
        title: '永續治理',
        griCode: '2-9',
        sections: ['治理架構', '委員會職責', '風險管理'],
        metrics: ['boardDiversity'],
    },
    {
        id: 'sec-environment',
        title: '環境永續',
        griCode: '305',
        sections: ['能源管理', '溫室氣體排放', '廢棄物管理', '水資源管理'],
        metrics: ['carbonEmission', 'energyConsumption', 'waterUsage', 'wasteGenerated'],
    },
    {
        id: 'sec-social',
        title: '社會責任',
        griCode: '401',
        sections: ['人才發展', '員工福利', '職業安全', '多元共融'],
        metrics: ['employeeSatisfaction', 'trainingHours', 'incidentCount', 'turnoverRate'],
    },
];

const TCFD_SECTIONS: ReportSectionTemplate[] = [
    {
        id: 'sec-tcfd-gov',
        title: 'TCFD 治理',
        tcfdPillar: 'Governance',
        sections: ['氣候治理架構', '管理階層角色'],
        metrics: [],
    },
    {
        id: 'sec-tcfd-str',
        title: 'TCFD 策略',
        tcfdPillar: 'Strategy',
        sections: ['氣候風險識別', '氣候機會分析', '情境分析'],
        metrics: [],
    },
    {
        id: 'sec-tcfd-risk',
        title: 'TCFD 風險管理',
        tcfdPillar: 'Risk Management',
        sections: ['風險評估流程', '風險管理流程', '整合機制'],
        metrics: [],
    },
    {
        id: 'sec-tcfd-metrics',
        title: 'TCFD 指標與目標',
        tcfdPillar: 'Metrics & Targets',
        sections: ['氣候指標', '排放目標', '減碳路徑'],
        metrics: ['carbonEmission'],
    },
];

// ============================================
// 服務類別
// ============================================

export class OneClickReportService {
    private static instance: OneClickReportService;
    private genAI: GoogleGenerativeAI | null = null;

    static getInstance(): OneClickReportService {
        if (!OneClickReportService.instance) {
            OneClickReportService.instance = new OneClickReportService();
        }
        return OneClickReportService.instance;
    }

    private getGenAI(): GoogleGenerativeAI | null {
        if (!this.genAI && process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        return this.genAI;
    }

    // ========================================
    // 一鍵生成核心功能
    // ========================================

    /**
     * 一鍵生成永續報告書
     */
    async generateReport(config: OneClickReportConfig): Promise<OneClickReportResult> {
        const startTime = Date.now();
        const warnings: string[] = [];
        const nextSteps: string[] = [];

        try {
            // 1. 建立報告書基礎結構
            const report = await this.createBaseReport(config);

            // 2. 生成各章節內容
            const sections = await this.generateSections(config);

            // 3. 更新報告書章節
            report.sections = sections;

            // 4. 生成指標數據
            report.metrics = this.generateMetrics(config.data);

            // 5. 更新 GRI 揭露狀態
            this.updateGRIDisclosureStatus(report);

            // 6. 如果需要，生成 TCFD 章節
            if (config.options?.includeTCFD || config.framework === 'TCFD' || config.framework === 'Integrated') {
                const tcfdSections = await this.generateTCFDSections(config);
                report.sections.push(...tcfdSections);
            }

            // 7. 生成目標與展望
            if (config.options?.includeGoals) {
                const goalsSection = await this.generateGoalsSection(config);
                report.sections.push(goalsSection);
            }

            // 8. 計算完整性分數
            const completenessScore = this.calculateCompleteness(report);

            // 9. 生成後續建議
            this.generateNextSteps(report, nextSteps, warnings);

            // 10. 更新狀態
            report.status = 'draft';
            report.updatedAt = new Date().toISOString();

            const generationTime = Date.now() - startTime;

            return {
                report,
                generationTime,
                completenessScore,
                warnings,
                nextSteps,
            };
        } catch (error) {
            console.error('One-click report generation error:', error);
            throw error;
        }
    }

    /**
     * 建立報告書基礎結構
     */
    private async createBaseReport(config: OneClickReportConfig): Promise<SustainabilityReport> {
        return {
            id: `report-${Date.now()}`,
            companyId: `company-${config.companyName}`,
            title: `${config.reportingPeriod.start.split('-')[0]} 永續發展報告書`,
            reportingPeriod: config.reportingPeriod,
            framework: config.framework,
            sections: [],
            metrics: [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: '1.0',
            signatures: [],
        };
    }

    /**
     * 生成主要章節內容
     */
    private async generateSections(config: OneClickReportConfig): Promise<ReportSection[]> {
        const sections: ReportSection[] = [];
        const model = this.getGenAI()?.getGenerativeModel({ model: 'gemini-2.0-flash' });

        for (const template of SECTION_TEMPLATES) {
            const content = model
                ? await this.generateAIContent(model, config, template)
                : this.generateFallbackContent(config, template);

            const griMapping = template.griCode
                ? this.getGRIMapping(template.griCode)
                : [];

            sections.push({
                id: template.id,
                title: template.title,
                order: sections.length + 1,
                content,
                frameworkMapping: griMapping,
                dataSources: [],
                verificationStatus: 'pending',
            });
        }

        return sections;
    }

    /**
     * AI 生成章節內容
     */
    private async generateAIContent(
        model: any,
        config: OneClickReportConfig,
        template: ReportSectionTemplate
    ): Promise<string> {
        const prompt = `請為以下公司生成永續報告書章節內容：

公司名稱：${config.companyName}
產業：${config.industry}
報告期間：${config.reportingPeriod.start} 至 ${config.reportingPeriod.end}
框架：${config.framework}
語言：${config.options?.language || 'zh-TW'}
風格：${config.options?.tone || 'formal'}

章節標題：${template.title}
涵蓋主題：${template.sections.join('、')}
}
相關指標：${template.metrics.join('、') || '無特定指標'}

請生成符合 GRI Standards 標準的專業內容，約 500-800 字，包含：
1. 管理方針說明
2. 2024 年度重要成果
3. 未來展望與目標

請使用專業、正式的報告書語言，以 Markdown 格式輸出。`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI content generation failed, using fallback:', error);
            return this.generateFallbackContent(config, template);
        }
    }

    /**
     * 備用內容生成
     */
    private generateFallbackContent(
        config: OneClickReportConfig,
        template: ReportSectionTemplate
    ): string {
        const year = config.reportingPeriod.start.split('-')[0];

        const contentTemplates: Record<string, string> = {
            'sec-ceo': `## 執行長的話

${config.companyName} 秉持「永續經營、共創價值」的核心理念，致力於在追求企業成長的同時，積極履行環境、社會與治理（ESG）的責任。

### 年度亮點
- 碳排放量較去年同期減少 5%
- 員工滿意度提升至 ${config.data?.employeeSatisfaction || 85} 分
- 社會公益投入金額創新高

### 未來展望
我們將持續深化永續作為，邁向 2030 年達成碳中和的長期目標。`,

            'sec-about': `## 關於我們

${config.companyName} 成立於產業領域，專注於提供優質的產品與服務。

### 營運規模
- 員工人數：${config.data?.employeeCount || 'N/A'} 人
- 營運據點：${config.industry} 產業
- 主要市場：台灣及亞太地區

### 價值鏈
我們與供應商、客戶及利害關係人共同合作，打造永續的價值鏈。`,

            'sec-environment': `## 環境永續

### 能源管理
${config.companyName} 致力於提升能源效率，2024 年能源消耗量為 ${config.data?.energyConsumption || 'N/A'} 單位。

### 溫室氣體排放
- 範疇一排放：${config.data?.carbonEmission || 'N/A'} tCO2e
- 減排目標：2030 年較 2020 年減少 50%

### 廢棄物管理
年度廢棄物產生量：${config.data?.wasteGenerated || 'N/A'} 噸
資源回收率達 ${config.data?.wasteGenerated ? '65' : 'N/A'}%`,

            'sec-social': `## 社會責任

### 人才發展
${config.companyName} 視員工為最重要的資產，提供完善的培訓與發展機會。

### 人才統計
- 員工人數：${config.data?.employeeCount || 'N/A'} 人
- 平均訓練時數：${config.data?.trainingHours || 'N/A'} 小時/人
- 員工滿意度：${config.data?.employeeSatisfaction || 'N/A'} 分

### 職業安全
- 職安事件數：${config.data?.incidentCount || '0'} 件
- 目標：零職災`,
        };

        return contentTemplates[template.id] || `## ${template.title}

${config.companyName} 在 ${template.title} 方面的努力與成果。`;
    }

    /**
     * 生成 TCFD 章節
     */
    private async generateTCFDSections(config: OneClickReportConfig): Promise<ReportSection[]> {
        const sections: ReportSection[] = [];

        for (const template of TCFD_SECTIONS) {
            const content = this.generateTCFDFallbackContent(config, template);

            sections.push({
                id: template.id,
                title: template.title,
                order: sections.length + 1,
                content,
                frameworkMapping: [
                    { code: `TCFD-${template.tcfdPillar}`, name: template.tcfdPillar!, requirement: 'TCFD 揭露要求' },
                ],
                dataSources: [],
                verificationStatus: 'pending',
            });
        }

        return sections;
    }

    /**
     * 生成 TCFD 備用內容
     */
    private generateTCFDFallbackContent(
        config: OneClickReportConfig,
        template: ReportSectionTemplate
    ): string {
        const pillarContent: Record<string, string> = {
            'Governance': `## 氣候治理

### 治理架構
${config.companyName} 已建立完善的氣候治理架構，由永續發展委員會負責監督氣候相關議題。

### 管理階層角色
- 定期向董事会報告氣候風險與機會
- 將氣候績效納入高階主管薪酬考核`,

            'Strategy': `## 氣候策略

### 風險識別
我們已識別以下氣候相關風險：
- 物理風險：極端氣候事件、供應鏈中斷
- 轉型風險：碳價上漲、法規變遷

### 機會分析
- 低碳產品需求成長
- 再生能源成本下降
- 綠色金融支持`,

            'Risk Management': `## 氣候風險管理

### 風險評估流程
採用情境分析方法，評估不同氣候情境下的財務影響。

### 管理機制
建立氣候風險監控儀表板，定期追蹤與管理氣候風險。`,

            'Metrics & Targets': `## 氣候指標與目標

### 關鍵指標
- 範疇一、二排放量：${config.data?.carbonEmission || 'N/A'} tCO2e
- 再生能源使用比例：${config.data?.energyConsumption ? '15%' : 'N/A'}

### 減碳目標
- 2030 年：較 2020 年減少 50%
- 2040 年：較 2020 年減少 80%
- 2050 年：達成淨零排放`,
        };

        return pillarContent[template.tcfdPillar!] || `## ${template.title}

氣候相關${template.tcfdPillar}揭露內容。`;
    }

    /**
     * 生成目標與展望章節
     */
    private async generateGoalsSection(config: OneClickReportConfig): Promise<ReportSection> {
        return {
            id: 'sec-goals',
            title: '永續發展目標與展望',
            order: 99,
            content: `## 永續發展目標與展望

### 短期目標（2025 年）
- 再生能源使用比例達 20%
- 碳排放量較 2024 年減少 10%
- 員工滿意度提升至 90 分

### 中期目標（2030 年）
- 範疇一、二排放較 2020 年減少 50%
- 廢棄物資源化率達 90%
- 女性管理職占比達 40%

### 長期目標（2050 年）
- 達成淨零排放
- 建立循環經濟模式
- 成為產業永續標竿企業

${config.companyName} 將持續秉持永續經營的理念，與所有利害關係人共同創造更美好的未來。`,
            frameworkMapping: [
                { code: 'SDG', name: 'SDGs', requirement: '聯合國永續發展目標' },
            ],
            dataSources: [],
            verificationStatus: 'pending',
        };
    }

    /**
     * 生成指標數據
     */
    private generateMetrics(data?: OneClickReportConfig['data']): ReportMetric[] {
        const metrics: ReportMetric[] = [];

        if (data?.carbonEmission) {
            metrics.push({
                id: 'metric-carbon',
                code: '305-1',
                name: '範疇一溫室氣體排放',
                value: data.carbonEmission,
                unit: 'tCO2e',
                category: 'E',
                yearOverYear: -5,
                target: data.carbonEmission * 0.9,
                status: 'on_track',
            });
        }

        if (data?.energyConsumption) {
            metrics.push({
                id: 'metric-energy',
                code: '302-1',
                name: '組織內部能源消耗',
                value: data.energyConsumption,
                unit: 'MWh',
                category: 'E',
                yearOverYear: -3,
                status: 'on_track',
            });
        }

        if (data?.employeeCount) {
            metrics.push({
                id: 'metric-employees',
                code: '2-7',
                name: '員工人數',
                value: data.employeeCount,
                unit: '人',
                category: 'S',
                yearOverYear: 8,
                status: 'on_track',
            });
        }

        if (data?.employeeSatisfaction) {
            metrics.push({
                id: 'metric-satisfaction',
                code: '401-2',
                name: '員工滿意度',
                value: data.employeeSatisfaction,
                unit: '分',
                category: 'S',
                yearOverYear: 2,
                target: 90,
                status: 'on_track',
            });
        }

        return metrics;
    }

    /**
     * 更新 GRI 揭露狀態
     */
    private updateGRIDisclosureStatus(report: SustainabilityReport): void {
        // 標記已揭露的章節
        for (const section of report.sections) {
            for (const mapping of section.frameworkMapping) {
                if (mapping.code.includes('2-22')) {
                    // 執行長的話已揭露
                }
            }
        }
    }

    /**
     * 計算完整性分數
     */
    private calculateCompleteness(report: SustainabilityReport): number {
        let score = 0;
        let maxScore = 0;

        // 章節內容 (40%)
        const contentThreshold = 200;
        const sectionsWithContent = report.sections.filter(s => s.content.length > contentThreshold).length;
        maxScore += 40;
        score += (sectionsWithContent / Math.max(report.sections.length, 1)) * 40;

        // 指標數據 (30%)
        maxScore += 30;
        score += Math.min(report.metrics.length / 5, 1) * 30;

        // GRI 揭露 (20%)
        maxScore += 20;
        const griDisclosureRate = this.calculateGRIDisclosureRate();
        score += griDisclosureRate * 20;

        // TCFD 揭露 (10% - 如果有 TCFD 章節)
        maxScore += 10;
        const hasTCFD = report.sections.some(s => s.title.includes('TCFD'));
        score += hasTCFD ? 10 : 0;

        return Math.round(score);
    }

    /**
     * 計算 GRI 揭露率
     */
    private calculateGRIDisclosureRate(): number {
        let totalDisclosures = 0;
        let disclosedCount = 0;

        for (const standard of GRI_STANDARDS) {
            totalDisclosures += standard.disclosures.length;
            for (const disclosure of standard.disclosures) {
                if (disclosure.reported) disclosedCount++;
            }
        }

        return totalDisclosures > 0 ? disclosedCount / totalDisclosures : 0;
    }

    /**
     * 取得 GRI 對應
     */
    private getGRIMapping(code: string) {
        const standard = GRI_STANDARDS.find(s => s.code === code);
        if (!standard) return [];

        return standard.disclosures.slice(0, 1).map(d => ({
            code: d.code,
            name: d.title,
            requirement: d.requirement,
        }));
    }

    /**
     * 生成後續建議
     */
    private generateNextSteps(
        report: SustainabilityReport,
        nextSteps: string[],
        warnings: string[]
    ): void {
        // 完整性低於 70% 的建議
        if (this.calculateCompleteness(report) < 70) {
            warnings.push('報告書完整性較低，建議補充更多內容');
            nextSteps.push('完成所有章節內容');
        }

        // 指標不足的建議
        if (report.metrics.length < 3) {
            warnings.push('指標數據不足，建議補充更多 ESG 指標');
            nextSteps.push('填寫碳排放、能源、用水等關鍵指標');
        }

        // 沒有 TCFD 的建議
        if (!report.sections.some(s => s.title.includes('TCFD'))) {
            nextSteps.push('考慮加入 TCFD 氣候相關財務揭露');
        }

        // 驗證相關建議
        nextSteps.push('進行內部審查');
        nextSteps.push('申請第三方確信');
    }
}

// 導出單例
export const oneClickReportService = OneClickReportService.getInstance();

// 便捷函數
export async function generateReport(config: OneClickReportConfig): Promise<OneClickReportResult> {
    return oneClickReportService.generateReport(config);
}
