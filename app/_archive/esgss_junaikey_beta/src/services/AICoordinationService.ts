import { GeminiService, TaskComplexity } from './geminiService.js';
import { SnykService, type SecurityIssue, type ScanResult } from './SnykService.js';
import { OllamaService } from './OllamaService.js';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge.js';
import { omniLogger, LogCategory } from './omniLogger.js';
import { OmniNexus } from './OmniNexus.js';
import { serviceRegistry, type ServiceDefinition } from './ServiceRegistry.js';
import { riskForecastingEngine, type RiskForecast } from './RiskForecastingEngine.js';
import { smartNotificationService } from './smart-notifications.js';

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
 * AI Coordination Service: Integrates Gemini, Snyk, and Ollama
 */
class AICoordinationServiceClass {
  /**
   * Analyzes Snyk scan results and uses Gemini to generate remediation suggestions.
   */
  public async analyzeSecurityScan(scanResult: ScanResult): Promise<SecurityInsight> {
    const { summary, issues } = scanResult;

    // Prepare prompt
    const prompt = this.buildSecurityAnalysisPrompt(summary, issues);

    try {
      // Use Gemini analysis (Complex task using Pro model)
      const geminiResult = await GeminiService.generateStrategy({
        knowledgeNode: {
          id: `security-scan-${scanResult.scanDate}`,
          label: 'Security Scan Result',
          confidence: 0.95,
          properties: {
            critical: summary.critical,
            high: summary.high,
            total: summary.total,
          },
        },
        complexity: TaskComplexity.COMPLEX, // Security analysis = Complex task
        context: prompt,
      });

      if (geminiResult) {
        // Parse Gemini response
        const criticalRecommendations = this.extractRecommendations(geminiResult.content);
        const overallRisk = this.assessRisk(summary);

        // Log to knowledge graph
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
      omniLogger.warn(LogCategory.AI, 'Gemini security analysis failed, using heuristics', {
        error,
      });
    }

    // Fallback: Heuristic analysis
    return this.heuristicAnalysis(summary, issues);
  }

  /**
   * Generates detailed remediation suggestions for a single vulnerability (using Gemini + Ollama).
   */
  public async generateRemediation(issue: SecurityIssue): Promise<SecurityRemediation> {
    // 1. Use Gemini to generate remediation steps
    const geminiPrompt = `
As a security expert, provide remediation suggestions for the following vulnerability:

**Vulnerability**: ${issue.title}
**Package**: ${issue.package} @ ${issue.version}
**Severity**: ${issue.severity}
${issue.cve ? `**CVE**: ${issue.cve}` : ''}
${issue.fixedIn ? `**Fixed in**: ${issue.fixedIn}` : ''}

Please provide:
1. Vulnerability impact description (1-2 sentences)
2. Specific remediation steps (3-5 steps)
3. Preventive measures

Response format:
Impact: [Description]
Steps:
1. [...]
2. [...]
Prevention: [...]
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
      omniLogger.warn(LogCategory.AI, 'Remediation suggestion generation failed', { error });
      geminiAnalysis = `Update ${issue.package} to ${issue.fixedIn || 'latest version'}`;
      actionSteps = [`npm install ${issue.package}@${issue.fixedIn || 'latest'}`];
    }

    // 2. Use Ollama to find related knowledge
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
   * Uses Ollama semantic search for related security knowledge.
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
      omniLogger.warn(LogCategory.AI, 'Ollama semantic search failed', { error });
      return [];
    }
  }

  /**
   * Builds security analysis prompt.
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
As an ESG and security consultant, analyze the following vulnerability scan results:

**Statistics**:
- Critical: ${summary.critical}
- High: ${summary.high}
- Medium: ${summary.medium}
- Low: ${summary.low}

**Top 5 High-Risk Vulnerabilities**:
${topIssues}

Please provide:
1. Overall risk assessment (within 50 words)
2. Top 3 priority remediation suggestions
3. Long-term security strategy suggestions (1-2 sentences)

Response format (JSON):
{
  "summary": "Overall Assessment",
  "recommendations": ["Rec 1", "Rec 2", "Rec 3"],
  "strategy": "Long-term Strategy"
}
`;
  }

  /**
   * Extracts recommendations from Gemini response.
   */
  private extractRecommendations(content: string): string[] {
    try {
      // Try JSON parsing
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.recommendations || [];
      }
    } catch (e) {
      // If JSON parsing fails, use regex to extract
    }

    // Fallback: Extract numbered list
    const lines = content.split('\n');
    return lines
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);
  }

  /**
   * Extracts remediation steps.
   */
  private extractSteps(content: string): string[] {
    const lines = content.split('\n');
    const steps: string[] = [];

    for (const line of lines) {
      const match = line.match(/^(?:Steps:)?\s*(\d+)\.\s*(.+)$/);
      if (match && match[2]) {
        steps.push(match[2].trim());
      }
    }

    return steps.length > 0 ? steps : [content.substring(0, 200)];
  }

  /**
   * Assesses overall risk level.
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
   * Heuristic analysis (Fallback).
   */
  private heuristicAnalysis(summary: any, issues: SecurityIssue[]): SecurityInsight {
    const recommendations: string[] = [];

    if (summary.critical > 0) {
      recommendations.push(`Immediately fix ${summary.critical} critical vulnerabilities`);
    }
    if (summary.high > 0) {
      recommendations.push(`Prioritize addressing ${summary.high} high-risk vulnerabilities`);
    }
    recommendations.push('Regularly update dependency packages');

    return {
      summary: `Found ${summary.total} vulnerabilities, of which ${summary.critical + summary.high} need immediate attention.`,
      criticalRecommendations: recommendations,
      overallRisk: this.assessRisk(summary),
      generatedBy: 'heuristic',
    };
  }

  /**
   * Full security analysis workflow (integrating three AIs).
   */
  public async performFullSecurityAnalysis(): Promise<{
    scan: ScanResult | null;
    insight: SecurityInsight | null;
    remediations: SecurityRemediation[];
  }> {
    omniLogger.info(
      LogCategory.SECURITY,
      '🤖 Starting Three-AI Collaborative Security Analysis...'
    );

    // 1. Snyk scan
    const scan = await SnykService.quickScan();
    if (!scan) {
      return { scan: null, insight: null, remediations: [] };
    }

    // 2. Gemini overall analysis
    const insight = await this.analyzeSecurityScan(scan);

    // 3. Generate detailed remediation suggestions for the top 3 high-risk vulnerabilities (Gemini + Ollama)
    const criticalIssues = scan.issues
      .filter(i => i.severity === 'critical' || i.severity === 'high')
      .slice(0, 3);

    const remediations: SecurityRemediation[] = [];
    for (const issue of criticalIssues) {
      const remediation = await this.generateRemediation(issue);
      remediations.push(remediation);
    }

    // 4. Send Nexus notification
    OmniNexus.emit({
      id: `ai-sec-${Date.now()}`,
      source: 'security',
      priority: insight.overallRisk === 'critical' ? 'critical' : 'high',
      message: `🤖 AI Collaborative Analysis Complete: ${insight.summary}`,
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

    omniLogger.info(LogCategory.SECURITY, '✅ Three-AI Collaborative Analysis Complete', {
      totalIssues: scan.summary.total,
      remediations: remediations.length,
      aiUsed: [insight.generatedBy, 'ollama', 'snyk'],
    });

    return { scan, insight, remediations };
  }

  /**
   * 執行預測性風險分析 (Phase 25)
   */
  public async performPredictiveRiskAnalysis(evidenceHistory: any[]): Promise<RiskForecast[]> {
    omniLogger.info(LogCategory.AI, '🔮 Starting Predictive Risk Analysis...');

    const forecasts = await riskForecastingEngine.forecastRisk(evidenceHistory);

    if (forecasts.length > 0) {
      for (const forecast of forecasts) {
        if (forecast.riskLevel === 'HIGH' || forecast.riskLevel === 'CRITICAL') {
          await smartNotificationService.sendRiskAlert(forecast);
        }
      }
    }

    return forecasts;
  }

  /**
   * Maps a subtask description to the most relevant of the 24 MECE ESG services.
   */
  public async mapTaskToService(taskDescription: string): Promise<ServiceDefinition | null> {
    const services = serviceRegistry.getServices();
    const serviceList = services.map(s => `- ${s.name} (UUID: ${s.uuid}): ${s.description}`).join('\n');

    const prompt = `
      As an AI Orchestrator, map the following task to the most appropriate service from the 24 MECE ESG Service Matrix.
      
      Task: "${taskDescription}"
      
      Available Services:
      ${serviceList}
      
      Respond ONLY with the UUID of the most relevant service. If no service matches, respond with "NONE".
    `;

    try {
      const response = await GeminiService.generateStructuredContent(prompt);
      const uuid = typeof response === 'string' ? response.trim() : response.uuid;

      if (uuid && uuid !== 'NONE') {
        const service = serviceRegistry.getServiceByUuid(uuid);
        if (service) return service;
      }

      // Fallback: Heuristic logic if AI fails or doesn't find a match
      return this.matchServiceHeuristically(taskDescription);
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Task mapping AI failed, falling back to heuristic', { error });
      return this.matchServiceHeuristically(taskDescription);
    }
  }

  /**
   * Simple keyword-based heuristic for service mapping.
   */
  private matchServiceHeuristically(description: string): ServiceDefinition | null {
    const desc = description.toLowerCase();
    const services = serviceRegistry.getServices();

    if (desc.includes('carbon') || desc.includes('emission') || desc.includes('footprint')) {
      return serviceRegistry.getServiceByUuid('env-002') || null; // 碳盤存管理
    }
    if (desc.includes('check') || desc.includes('health')) {
      return serviceRegistry.getServiceByUuid('exc-001') || null; // 企業健康檢查
    }
    if (desc.includes('report') || desc.includes('document')) {
      return serviceRegistry.getServiceByUuid('gov-001') || null; // 自動化報告生成
    }
    if (desc.includes('ai') || desc.includes('agent')) {
      return serviceRegistry.getServiceByUuid('age-001') || null; // AI 代理鍛造廠
    }

    // Default: try direct name match
    return services.find(s => desc.includes(s.name.toLowerCase())) || null;
  }
}

// Singleton Export
export const aiCoordinationService = new AICoordinationServiceClass();
export default aiCoordinationService;

// Export Types
export type { SecurityRemediation, SecurityInsight };
