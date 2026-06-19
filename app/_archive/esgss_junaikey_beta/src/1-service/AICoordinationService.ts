import { GeminiService, TaskComplexity } from './geminiService';
import { SnykService, type SecurityIssue, type ScanResult } from './SnykService';
import { OllamaService } from './OllamaService';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge';
import { omniLogger, LogCategory } from './omniLogger';
import { OmniNexus } from './OmniNexus';

interface SecurityRemediation {
  issueId: string;
  title: string;
  severity: string;
  geminiAnalysis: string;
  actionSteps: string[];
  relatedKnowledge: Array<{ label: string; similarity: number }>;
}

interface SecurityInsight {
  summary: string;
  criticalRecommendations: string[];
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  generatedBy: 'gemini' | 'heuristic';
}

/**
 * AI 協同服務：整合 Gemini、Snyk、Ollama
 */
class AICoordinationServiceClass {
  /**
   * 分析 Snyk 掃描結果，使用 Gemini 生成修復建議
   */
  public async analyzeSecurityScan(scanResult: ScanResult): Promise<SecurityInsight> {
    const { summary, issues } = scanResult;

    // 準備提示詞
    const prompt = this.buildSecurityAnalysisPrompt(summary, issues);

    try {
      // 使用 Gemini 分析（複雜任務，使用 Pro 模型）
      const geminiResult = await GeminiService.generateStrategy({
        knowledgeNode: {
          id: `security-scan-${scanResult.scanDate}`,
          label: '安全掃描結果',
          confidence: 0.95,
          properties: {
            critical: summary.critical,
            high: summary.high,
            total: summary.total,
          },
        },
        complexity: TaskComplexity.COMPLEX, // 安全分析 = 複雜任務
        context: prompt,
      });

      if (geminiResult) {
        // 解析 Gemini 回應
        const criticalRecommendations = this.extractRecommendations(geminiResult.content);
        const overallRisk = this.assessRisk(summary);

        // 記錄到知識圖譜
        await OmniKnowledge.submitInsight({
          id: `sec-insight-${Date.now()}`,
          type: 'security_analysis',
          content: geminiResult.content,
          sourceId: 'gemini-security',
          confidence: 0.9,
          impact: {
            metric: 'security_risk',
            value: summary.critical + summary.high,
          },
          relatedEntities: [],
          timestamp: Date.now(),
        });

        return {
          summary: geminiResult.content,
          criticalRecommendations,
          overallRisk,
          generatedBy: 'gemini',
        };
      }
    } catch (error) {
      omniLogger.warn(LogCategory.AI, 'Gemini 安全分析失敗，使用啟發式', { error });
    }

    // 備援：啟發式分析
    return this.heuristicAnalysis(summary, issues);
  }

  /**
   * 為單個漏洞生成詳細修復建議（使用 Gemini + Ollama）
   */
  public async generateRemediation(issue: SecurityIssue): Promise<SecurityRemediation> {
    // 1. 使用 Gemini 生成修復步驟
    const geminiPrompt = `
作為資安專家，為以下漏洞提供修復建議：

**漏洞**: ${issue.title}
**套件**: ${issue.package} @ ${issue.version}
**嚴重性**: ${issue.severity}
${issue.cve ? `**CVE**: ${issue.cve}` : ''}
${issue.fixedIn ? `**修復版本**: ${issue.fixedIn}` : ''}

請提供：
1. 漏洞影響說明（1-2 句）
2. 具體修復步驟（3-5 步）
3. 預防措施

回覆格式：
影響：[說明]
步驟：
1. [...]
2. [...]
預防：[...]
`;

    let geminiAnalysis = '';
    let actionSteps: string[] = [];

    try {
      const result = await GeminiService.generateStrategy({
        knowledgeNode: {
          id: issue.id,
          label: issue.title,
          confidence: 0.85,
          properties: { package: issue.package, cve: issue.cve || '' },
        },
        complexity: TaskComplexity.MODERATE,
        context: geminiPrompt,
      });

      if (result) {
        geminiAnalysis = result.content;
        actionSteps = this.extractSteps(result.content);
      }
    } catch (error) {
      omniLogger.warn(LogCategory.AI, '修復建議生成失敗', { error });
      geminiAnalysis = `更新 ${issue.package} 至 ${issue.fixedIn || '最新版本'}`;
      actionSteps = [`npm install ${issue.package}@${issue.fixedIn || 'latest'}`];
    }

    // 2. 使用 Ollama 查找相關知識
    const relatedKnowledge = await this.findRelatedSecurityKnowledge(issue);

    return {
      issueId: issue.id,
      title: issue.title,
      severity: issue.severity,
      geminiAnalysis,
      actionSteps,
      relatedKnowledge,
    };
  }

  /**
   * 使用 Ollama 語義搜索相關安全知識
   */
  private async findRelatedSecurityKnowledge(
    issue: SecurityIssue
  ): Promise<Array<{ label: string; similarity: number }>> {
    const searchQuery = `${issue.package} ${issue.cve || ''} security vulnerability`;

    try {
      const results = await OmniKnowledge.semanticSearchNodes(searchQuery, 3);
      return results.map(r => ({
        label: r.label,
        similarity: r.similarity,
      }));
    } catch (error) {
      omniLogger.warn(LogCategory.AI, 'Ollama 語義搜索失敗', { error });
      return [];
    }
  }

  /**
   * 建立安全分析提示詞
   */
  private buildSecurityAnalysisPrompt(
    summary: { critical: number; high: number; medium: number; low: number },
    issues: SecurityIssue[]
  ): string {
    const topIssues = issues
      .filter(i => i.severity === 'critical' || i.severity === 'high')
      .slice(0, 5)
      .map(i => `- ${i.title} (${i.package})`)
      .join('\n');

    return `
作為 ESG 與資安顧問，分析以下漏洞掃描結果：

**統計**：
- Critical: ${summary.critical}
- High: ${summary.high}
- Medium: ${summary.medium}
- Low: ${summary.low}

**前 5 個高危漏洞**：
${topIssues}

請提供：
1. 整體風險評估（50 字內）
2. 前 3 項優先修復建議
3. 長期安全策略建議（1-2 句）

回覆格式（JSON）：
{
  "summary": "整體評估",
  "recommendations": ["建議1", "建議2", "建議3"],
  "strategy": "長期策略"
}
`;
  }

  /**
   * 從 Gemini 回應提取建議
   */
  private extractRecommendations(content: string): string[] {
    try {
      // 嘗試 JSON 解析
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.recommendations || [];
      }
    } catch (e) {
      // JSON 解析失敗，使用正則提取
    }

    // 備援：提取帶數字的列表
    const lines = content.split('\n');
    return lines
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);
  }

  /**
   * 提取修復步驟
   */
  private extractSteps(content: string): string[] {
    const lines = content.split('\n');
    const steps: string[] = [];

    for (const line of lines) {
      const match = line.match(/^(?:步驟：)?\s*(\d+)\.\s*(.+)$/);
      if (match && match[2]) {
        steps.push(match[2].trim());
      }
    }

    return steps.length > 0 ? steps : [content.substring(0, 200)];
  }

  /**
   * 評估整體風險
   */
  private assessRisk(summary: {
    critical: number;
    high: number;
    medium: number;
  }): 'low' | 'medium' | 'high' | 'critical' {
    if (summary.critical > 0) return 'critical';
    if (summary.high > 3) return 'high';
    if (summary.high > 0 || summary.medium > 10) return 'medium';
    return 'low';
  }

  /**
   * 啟發式分析（備援）
   */
  private heuristicAnalysis(summary: any, issues: SecurityIssue[]): SecurityInsight {
    const recommendations: string[] = [];

    if (summary.critical > 0) {
      recommendations.push(`立即修復 ${summary.critical} 個嚴重漏洞`);
    }
    if (summary.high > 0) {
      recommendations.push(`優先處理 ${summary.high} 個高危漏洞`);
    }
    recommendations.push('定期更新依賴套件');

    return {
      summary: `發現 ${summary.total} 個漏洞，其中 ${summary.critical + summary.high} 個需要立即處理。`,
      criticalRecommendations: recommendations,
      overallRisk: this.assessRisk(summary),
      generatedBy: 'heuristic',
    };
  }

  /**
   * 完整安全分析流程（整合三個 AI）
   */
  public async performFullSecurityAnalysis(): Promise<{
    scan: ScanResult | null;
    insight: SecurityInsight | null;
    remediations: SecurityRemediation[];
  }> {
    omniLogger.info(LogCategory.SECURITY, '🤖 啟動三 AI 協同安全分析...');

    // 1. Snyk 掃描
    const scan = await SnykService.quickScan();
    if (!scan) {
      return { scan: null, insight: null, remediations: [] };
    }

    // 2. Gemini 整體分析
    const insight = await this.analyzeSecurityScan(scan);

    // 3. 為前 3 個高危漏洞生成詳細修復建議（Gemini + Ollama）
    const criticalIssues = scan.issues
      .filter(i => i.severity === 'critical' || i.severity === 'high')
      .slice(0, 3);

    const remediations: SecurityRemediation[] = [];
    for (const issue of criticalIssues) {
      const remediation = await this.generateRemediation(issue);
      remediations.push(remediation);
    }

    // 4. 發送 Nexus 通知
    OmniNexus.emit({
      id: `ai-sec-${Date.now()}`,
      source: 'security',
      priority: insight.overallRisk === 'critical' ? 'critical' : 'high',
      message: `🤖 AI 協同分析完成：${insight.summary}`,
      timestamp: Date.now(),
      metadata: {
        insight,
        remediationCount: remediations.length,
        relatedEntities: scan.issues.map(i => ({
          label: i.title,
          type: 'security_issue',
          id: i.id,
        })),
      },
    });

    omniLogger.info(LogCategory.SECURITY, '✅ 三 AI 協同分析完成', {
      totalIssues: scan.summary.total,
      remediations: remediations.length,
      aiUsed: [insight.generatedBy, 'ollama', 'snyk'],
    });

    return { scan, insight, remediations };
  }
}

// 單例導出
export const AICoordinationService = new AICoordinationServiceClass();

// 導出類型
export type { SecurityRemediation, SecurityInsight };
