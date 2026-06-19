import { geminiModel } from './client.js';
import { supabaseAdmin } from '@/lib/supabase/server.js';

export class ReportGenerator {
    /**
     * 生成永續報告
     */
    async generateReport(params: {
        year: number;
        type: 'GRI' | 'TCFD' | 'ISO-14064';
        sections?: string[];
    }): Promise<string> {
        // 1. 從 Evidence Vault 取得數據
        const startTime = new Date(`${params.year}-01-01`).getTime();
        const endTime = new Date(`${params.year}-12-31`).getTime();

        const { data: evidenceList } = await supabaseAdmin
            .from('evidence_vault')
            .select('*')
            .eq('lifecycle_stage', 'verified')
            .gte('timestamp', startTime)
            .lte('timestamp', endTime);

        if (!evidenceList || evidenceList.length === 0) {
            throw new Error(`${params.year} 年無可用數據`);
        }

        // 2. 整理數據摘要
        const dataSummary = this.summarizeData(evidenceList);

        // 3. 建立 Prompt
        const prompt = this.buildPrompt(params.type, params.year, dataSummary, params.sections);

        // 4. 呼叫 Gemini API
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    }

    /**
     * 整理數據摘要
     */
    private summarizeData(evidenceList: any[]): string {
        const summary = {
            totalRecords: evidenceList.length,
            scope1: 0,
            scope2: 0,
            scope3: 0,
            totalEmissions: 0,
            energyConsumption: 0,
            wasteGenerated: 0,
        };

        evidenceList.forEach((evidence) => {
            const { formula, impact_metric } = evidence;
            const value = impact_metric?.value || 0;

            if (formula.includes('Scope1')) {
                summary.scope1 += value;
            } else if (formula.includes('Scope2')) {
                summary.scope2 += value;
            } else if (formula.includes('Scope3')) {
                summary.scope3 += value;
            }

            summary.totalEmissions += value;
        });

        return JSON.stringify(summary, null, 2);
    }

    /**
     * 建立 AI Prompt
     */
    private buildPrompt(
        type: string,
        year: number,
        dataSummary: string,
        sections?: string[]
    ): string {
        const basePrompt = `
你是一位專業的永續報告書撰寫專家，請根據以下數據生成 ${year} 年度的 ${type} 永續報告。

# 數據摘要
${dataSummary}

# 報告要求
- 格式：Markdown
- 語言：繁體中文
- 風格：專業、客觀、數據驅動
- 篇幅：約 2000-3000 字

# 必須包含章節
${sections ? sections.join('\n') : this.getDefaultSections(type)}

# 特別注意
1. 所有數據必須基於提供的「數據摘要」
2. 不要編造或推測數據
3. 提供具體的改善建議
4. 符合 ${type} 標準要求

請開始生成報告：
`;

        return basePrompt;
    }

    /**
     * 取得預設章節
     */
    private getDefaultSections(type: string): string {
        const sections = {
            GRI: `
1. 組織概況
2. 永續策略與治理
3. 重大性議題分析
4. 環境績效（能源、排放、廢棄物）
5. 社會績效（員工、社區）
6. 經濟績效
7. 未來目標與承諾
`,
            TCFD: `
1. 治理（Governance）
2. 策略（Strategy）
3. 風險管理（Risk Management）
4. 指標與目標（Metrics and Targets）
`,
            'ISO-14064': `
1. 組織邊界
2. 溫室氣體排放清冊（範疇一、二、三）
3. 排放量化方法
4. 數據品質管理
5. 減量目標與行動方案
`,
        };

        return (sections as any)[type] || (sections as any).GRI;
    }

    /**
     * 合規檢查
     */
    async checkCompliance(reportContent: string, standard: 'GRI' | 'TCFD' | 'ISO-14064'): Promise<{
        score: number;
        missingItems: string[];
        suggestions: string[];
    }> {
        const prompt = `
你是一位永續報告審查專家，請檢查以下報告是否符合 ${standard} 標準。

# 報告內容
${reportContent}

# 審查要求
請以 JSON 格式回應，包含：
{
  "score": 0-100 的分數,
  "missingItems": ["缺少的項目1", "缺少的項目2"],
  "suggestions": ["改善建議1", "改善建議2"]
}

回應（純 JSON，不要加任何其他文字）：
`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 解析 JSON
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('解析 AI 回應失敗:', error);
        }

        return {
            score: 0,
            missingItems: ['AI 回應格式錯誤'],
            suggestions: ['請重新生成報告'],
        };
    }
}

export const reportGenerator = new ReportGenerator();
