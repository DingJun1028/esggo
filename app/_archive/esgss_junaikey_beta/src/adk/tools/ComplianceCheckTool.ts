/**
 * Google ADK Tool: Compliance Check Tool
 * ========================================
 * 檢查報告內容是否符合 GRI、SASB、TCFD 等框架要求
 * 提供合規性分數與改進建議
 */

import type {
  ComplianceCheckInput,
  ComplianceCheckOutput,
  ComplianceIssue,
  Framework,
  ToolResult,
} from '../types/AdkReportTypes';

export class ComplianceCheckTool {
  /**
   * 檢查合規性
   */
  async check(input: ComplianceCheckInput): Promise<ToolResult<ComplianceCheckOutput>> {
    try {
      const { content, frameworks, chapter } = input;

      const frameworkScores: Record<Framework, number> = {} as any;
      const allIssues: ComplianceIssue[] = [];
      const missingElements: string[] = [];
      const recommendations: string[] = [];

      // Check each framework
      for (const framework of frameworks) {
        const result = this.checkFramework(framework, content, chapter);
        frameworkScores[framework] = result.score;
        allIssues.push(...result.issues);
        missingElements.push(...result.missing);
        recommendations.push(...result.recommendations);
      }

      // Calculate overall score
      const scores = Object.values(frameworkScores);
      const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

      return {
        success: true,
        data: {
          overallScore,
          frameworkScores,
          missingElements: [...new Set(missingElements)],
          recommendations: [...new Set(recommendations)],
          issues: allIssues,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Compliance check failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 檢查特定框架合規性
   */
  private checkFramework(
    framework: Framework,
    content: string,
    chapter?: string
  ): {
    score: number;
    issues: ComplianceIssue[];
    missing: string[];
    recommendations: string[];
  } {
    switch (framework) {
      case 'GRI':
        return this.checkGRI(content, chapter);
      case 'SASB':
        return this.checkSASB(content, chapter);
      case 'TCFD':
        return this.checkTCFD(content, chapter);
      case 'CDP':
        return this.checkCDP(content, chapter);
      case 'ESRS':
        return this.checkESRS(content, chapter);
      default:
        return { score: 0, issues: [], missing: [], recommendations: [] };
    }
  }

  /**
   * GRI 合規性檢查
   */
  private checkGRI(content: string, chapter?: string): any {
    const issues: ComplianceIssue[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // GRI 要求檢查
    const requiredElements = [
      { keyword: 'stakeholder', name: 'Stakeholder Engagement', weight: 15 },
      { keyword: 'material', name: 'Materiality Assessment', weight: 20 },
      { keyword: 'metric\\s+\\d+', name: 'Quantitative Metrics', weight: 25 },
      { keyword: 'governance', name: 'Governance Structure', weight: 15 },
      { keyword: 'value chain|supply chain', name: 'Value Chain', weight: 15 },
      { keyword: 'target|goal', name: 'Targets & Goals', weight: 10 },
    ];

    for (const element of requiredElements) {
      const regex = new RegExp(element.keyword, 'i');
      if (!regex.test(content)) {
        score -= element.weight;
        missing.push(element.name);
        issues.push({
          framework: 'GRI',
          requirement: element.name,
          status: 'missing',
          recommendation: `Add ${element.name} section following GRI Standards`,
        });
      }
    }

    // 通用建議
    if (score < 90) {
      recommendations.push('增加利害關係人參與說明');
      recommendations.push('補充量化績效指標');
      recommendations.push('明確揭露重大性評估過程');
    }

    return { score: Math.max(0, score), issues, missing, recommendations };
  }

  /**
   * SASB 合規性檢查
   */
  private checkSASB(content: string, chapter?: string): any {
    const issues: ComplianceIssue[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // SASB 產業特定指標檢查
    const requiredElements = [
      { keyword: 'industry-specific|sector', name: 'Industry-Specific Metrics', weight: 30 },
      { keyword: 'financial.*impact|materiality', name: 'Financial Materiality', weight: 25 },
      { keyword: 'metric.*table|disclosure table', name: 'SASB Metrics Table', weight: 20 },
      { keyword: 'investor|shareholder', name: 'Investor Focus', weight: 15 },
      { keyword: 'quantitative|numeric', name: 'Quantitative Data', weight: 10 },
    ];

    for (const element of requiredElements) {
      const regex = new RegExp(element.keyword, 'i');
      if (!regex.test(content)) {
        score -= element.weight;
        missing.push(element.name);
        issues.push({
          framework: 'SASB',
          requirement: element.name,
          status: 'missing',
          recommendation: `Include ${element.name} per SASB Standards`,
        });
      }
    }

    if (score < 85) {
      recommendations.push('添加SASB產業特定指標表格');
      recommendations.push('強化財務重大性說明');
      recommendations.push('增加投資人決策相關資訊');
    }

    return { score: Math.max(0, score), issues, missing, recommendations };
  }

  /**
   * TCFD 合規性檢查
   */
  private checkTCFD(content: string, chapter?: string): any {
    const issues: ComplianceIssue[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // TCFD 四大支柱檢查
    const pillars = [
      { keyword: 'governance.*climate|board.*climate', name: 'Governance', weight: 25 },
      { keyword: 'climate.*strategy|strategy.*climate', name: 'Strategy', weight: 25 },
      { keyword: 'risk management|climate risk', name: 'Risk Management', weight: 25 },
      { keyword: 'metric.*target|KPI|indicator', name: 'Metrics and Targets', weight: 25 },
    ];

    for (const pillar of pillars) {
      const regex = new RegExp(pillar.keyword, 'i');
      if (!regex.test(content)) {
        score -= pillar.weight;
        missing.push(`TCFD ${pillar.name}`);
        issues.push({
          framework: 'TCFD',
          requirement: pillar.name,
          status: 'missing',
          recommendation: `Add TCFD ${pillar.name} disclosure`,
        });
      }
    }

    // Scenario analysis check
    if (!content.match(/scenario.*analysis|2°C|1\.5°C/i)) {
      score -= 10;
      missing.push('Climate Scenario Analysis');
      recommendations.push('添加氣候情境分析（2°C / 1.5°C）');
    }

    if (score < 90) {
      recommendations.push('完整揭露TCFD四大支柱');
      recommendations.push('增加氣候相關風險量化分析');
    }

    return { score: Math.max(0, score), issues, missing, recommendations };
  }

  /**
   * CDP 合規性檢查
   */
  private checkCDP(content: string, chapter?: string): any {
    const issues: ComplianceIssue[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const requiredElements = [
      { keyword: 'scope 1|scope 2|scope 3', name: 'Scope 1/2/3 Emissions', weight: 30 },
      { keyword: 'carbon.*reduction.*target', name: 'Carbon Reduction Target', weight: 20 },
      { keyword: 'renewable energy', name: 'Renewable Energy', weight: 15 },
      { keyword: 'water.*management', name: 'Water Management', weight: 15 },
      { keyword: 'forest.*deforestation', name: 'Forestry/Deforestation', weight: 10 },
      {
        keyword: 'third.*party.*verification|assurance',
        name: 'Third-Party Verification',
        weight: 10,
      },
    ];

    for (const element of requiredElements) {
      const regex = new RegExp(element.keyword, 'i');
      if (!regex.test(content)) {
        score -= element.weight;
        missing.push(element.name);
        issues.push({
          framework: 'CDP',
          requirement: element.name,
          status: 'missing',
          recommendation: `Include ${element.name} for CDP disclosure`,
        });
      }
    }

    if (score < 85) {
      recommendations.push('完整揭露Scope 1/2/3排放數據');
      recommendations.push('設定科學基礎減碳目標（SBTi）');
      recommendations.push('增加第三方查驗聲明');
    }

    return { score: Math.max(0, score), issues, missing, recommendations };
  }

  /**
   * ESRS 合規性檢查（歐盟CSRD）
   */
  private checkESRS(content: string, chapter?: string): any {
    const issues: ComplianceIssue[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const requiredElements = [
      { keyword: 'double materiality', name: 'Double Materiality Assessment', weight: 25 },
      { keyword: 'due diligence', name: 'Due Diligence Process', weight: 20 },
      { keyword: 'value chain impact', name: 'Value Chain Impact', weight: 20 },
      { keyword: 'transition plan', name: 'Transition Plan', weight: 20 },
      { keyword: 'ESRS.*disclosure', name: 'ESRS Disclosure Requirements', weight: 15 },
    ];

    for (const element of requiredElements) {
      const regex = new RegExp(element.keyword, 'i');
      if (!regex.test(content)) {
        score -= element.weight;
        missing.push(element.name);
        issues.push({
          framework: 'ESRS',
          requirement: element.name,
          status: 'missing',
          recommendation: `Add ${element.name} per ESRS standards`,
        });
      }
    }

    if (score < 80) {
      recommendations.push('補充雙重重大性評估說明');
      recommendations.push('詳述盡職調查流程');
      recommendations.push('揭露價值鏈影響評估');
      recommendations.push('制定氣候轉型計畫');
    }

    return { score: Math.max(0, score), issues, missing, recommendations };
  }
}

// 導出單例
export const complianceCheckTool = new ComplianceCheckTool();
