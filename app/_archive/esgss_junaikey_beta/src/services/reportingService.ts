import { DateTime } from '../types';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export enum ReportType {
  ANNUAL = 'annual',
  CARBON = 'carbon',
  SUSTAINABILITY = 'sustainability',
  COMPLIANCE = 'compliance',
}

export interface IEvidenceNode {
  id: string;
  sourceType: 'IOT' | 'MANUAL' | 'SYSTEM' | 'BLOCKCHAIN';
  timestamp: string;
  description: string;
  rawHash: string; // The "Immutable" proof
  verified: boolean;
}

export interface IReportConfig {
  period: string;
  language: 'zh-TW' | 'en-US';
  templateId: string;
  aiEnhanced: boolean;
}

export interface IGeneratedReport {
  reportId: string;
  config: IReportConfig;
  generatedAt: string;
  status: 'draft' | 'verified' | 'published';
  evidenceChain: IEvidenceNode[];
  downloadUrl?: string;
  integrityHash: string; // Final hash of the report
}

class ReportingService {
  private static instance: ReportingService;

  private constructor() { }

  public static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  /**
   * "Three Do's One Don't" Logic:
   * 1. Traceable: Every report item links back to evidence.
   * 2. Trackable: Operations are logged.
   * 3. Calculable: Metrics are computed precisely.
   * 4. Immutable: Hashes ensure data hasn't changed.
   */

  public async generateReport(config: IReportConfig): Promise<IGeneratedReport> {
    omniLogger.info(LogCategory.DATA, `Generating report for period: ${config.period}`, { config });

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate config
      if (!config.period || !config.templateId) {
        throw new Error('Invalid report configuration');
      }

      // Mock Evidence Chain Generation (Traceability)
      const evidenceChain: IEvidenceNode[] = [
        {
          id: 'ev-001',
          sourceType: 'IOT',
          timestamp: new Date().toISOString(),
          description: 'Smart Meter #402 - Energy Consumption',
          rawHash: '0x8f2d...3a9c',
          verified: true,
        },
        {
          id: 'ev-002',
          sourceType: 'BLOCKCHAIN',
          timestamp: new Date().toISOString(),
          description: 'Carbon Credit Token Burn #TX-9982',
          rawHash: '0x7b1e...2f4d',
          verified: true,
        },
        {
          id: 'ev-003',
          sourceType: 'SYSTEM',
          timestamp: new Date().toISOString(),
          description: 'Diversity Employment Records 2025',
          rawHash: '0x1c3d...9e9e',
          verified: true,
        },
      ];

      // "Immutable" Hash Calculation (Simplified)
      const integrityHash = `hash-${Date.now()}-${config.templateId}`;

      return {
        reportId: `rpt-${Date.now()}`,
        config,
        generatedAt: new Date().toISOString(),
        status: 'verified',
        evidenceChain,
        downloadUrl: `/api/reports/download/rpt-${Date.now()}`,
        integrityHash,
      };
    } catch (error) {
      omniLogger.error(LogCategory.DATA, 'Report generation failed', { error, config });
      // Fallback object to prevent frontend crash
      return {
        reportId: `err-${Date.now()}`,
        config,
        generatedAt: new Date().toISOString(),
        status: 'draft', // DRAFT indicates failure/incomplete
        evidenceChain: [],
        integrityHash: 'ERROR_HASH',
      };
    }
  }

  public getRecentReports(): IGeneratedReport[] {
    // Mock Data
    return [
      {
        reportId: 'rpt-1736611200000',
        config: {
          period: '2025 Q4',
          language: 'zh-TW',
          templateId: 'esg-annual',
          aiEnhanced: true,
        },
        generatedAt: '2026-01-05T10:00:00Z',
        status: 'published',
        evidenceChain: [],
        integrityHash: '0x999...111',
      },
    ];
  }

  public static destroy(): void {
    ReportingService.instance = undefined as any;
    omniLogger.info(LogCategory.SYSTEM, 'ReportingService destroyed');
  }
}

export const reportingService = ReportingService.getInstance();
