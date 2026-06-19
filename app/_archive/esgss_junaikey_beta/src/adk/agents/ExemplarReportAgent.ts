/**
 * Google ADK Agent: Exemplar Report Agent
 * =========================================
 * 主 Agent 定義
 * 使用 Google ADK 框架生成千頁ESG報告
 */

import { reportGenerationWorkflow } from '../workflows/ReportGenerationWorkflow';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import type { ReportConfig, FinalReport } from '../types/AdkReportTypes';

export class ExemplarReportAgent {
  private workflow: typeof reportGenerationWorkflow;

  constructor() {
    this.workflow = reportGenerationWorkflow;
  }

  /**
   * 執行報告生成
   */
  async generateReport(config: ReportConfig): Promise<FinalReport> {
    const startTime = Date.now();
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ═'.repeat(70));
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] 🧞 EXEMPLAR REPORT GENERATION AGENT (Google ADK)');
    const report = await this.workflow.execute(config);

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ═'.repeat(70));
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] 🎉 REPORT GENERATION COMPLETED');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ═'.repeat(70));
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `📊 Quality Metrics:` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Overall Quality: ${report.quality.overall}/100` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Data Quality: ${report.quality.dataQuality.overall}/100` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Compliance Score: ${report.quality.complianceScore}/100` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Narrative Quality: ${report.quality.narrativeQuality}/100` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Completeness: ${report.quality.completeness}/100` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `📄 Report Details:` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Title: ${report.metadata.title}` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Pages: ${report.assembly.pageCount}` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   File Size: ${(report.assembly.fileSize / 1024 / 1024).toFixed(2)} MB` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `   Location: ${report.assembly.reportPath}` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] Info', { data: `⏱️  Time Elapsed: ${elapsedTime}s` });
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ═'.repeat(70));
    omniLogger.info(LogCategory.AGENT, '[ExemplarReportAgent] ');

    return report;
  } catch(error: unknown) {
    omniLogger.error(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.error(LogCategory.AGENT, '[ExemplarReportAgent] ❌ REPORT GENERATION FAILED');
    omniLogger.error(LogCategory.AGENT, '[ExemplarReportAgent] ═'.repeat(70));
    omniLogger.error(LogCategory.AGENT, '[ExemplarReportAgent] ');
    omniLogger.error(LogCategory.AGENT, '[ExemplarReportAgent] Error', { error: `Error: ${error instanceof Error ? error.message : String(error)}` });
    omniLogger.error(LogCategory.AGENT, '[ExemplarReportAgent] ');
    throw error;
  }
  /**
   * 獲取 Agent 當前狀態
   */
  getState() {
    return this.workflow.getState();
  }
}

// 導出單例
export const exemplarReportAgent = new ExemplarReportAgent();
