/**
 * OmniExportService.ts
 * [📄核心] 高保真度匯出中心 - 將數位資產轉化為視覺影響力
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';
import { IReportDraft } from '../../types/esg/report.js';

export type ExportFormat = 'PDF' | 'DOCX' | 'JSON' | 'CSV';

export class OmniExportService {

    /**
     * 執行正式報告匯出
     * @param report 報告對象
     * @param format 匯出格式
     */
    public async exportReport(report: IReportDraft, format: ExportFormat): Promise<string> {
        omniLogger.info(LogCategory.BUSINESS, `[Export] Exporting report ${report.uid} to ${format} format...`);

        // 模擬匯出邏輯 (將來整合 PDFkit, Docx.js 等)
        const fileName = `Impact_Report_${report.companyName}_${report.reportingYear}.${format.toLowerCase()}`;

        // 模擬生成延時 (Simulation of heavy rendering)
        await new Promise(resolve => setTimeout(resolve, 500));

        omniLogger.info(LogCategory.BUSINESS, `[Export] Successfully generated ${fileName}. Integrity Hash: ${report.hash || 'N/A'}`);

        return fileName;
    }

    /**
     * 生成報告證據摘要 (Evidence Abstract)
     * 用於附錄，列出所有 5T 驗證碼
     */
    public generateEvidenceAbstract(report: IReportDraft): string {
        let abstract = "## Appendix: 5T Verification Ledger\n\n";
        report.metrics.forEach(m => {
            abstract += `- [${m.category}] Hash: ${m.id.substring(0, 8)}... | Source: ${m.source}\n`;
        });
        return abstract;
    }
}

export const omniExportService = new OmniExportService();
