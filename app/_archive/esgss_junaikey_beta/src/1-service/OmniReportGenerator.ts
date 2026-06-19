import { truthEngine, TruthClaim, IClaim } from './OmniTruthEngine';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { EvidenceVault } from './EvidenceVault';
import {
  ReportStageLevel,
  IReportStage,
  SubscriptionTier,
  IComplianceCheck,
  IReportMetadata,
} from '@/types/esg/report';

interface ReportSection {
  title: string;
  content: string;
  claims: any[];
}

export class OmniReportGenerator {
  private static instance: OmniReportGenerator;
  private activeReports: Map<string, IReportMetadata> = new Map();

  private constructor() { }

  public static getInstance(): OmniReportGenerator {
    if (!OmniReportGenerator.instance) {
      OmniReportGenerator.instance = new OmniReportGenerator();
    }
    return OmniReportGenerator.instance;
  }

  /**
   * 啟動永續報告精靈 (Start Report Wizard)
   */
  public async startWizard(companyId: string, tier: SubscriptionTier = SubscriptionTier.BRONZE): Promise<IReportMetadata> {
    const report: IReportMetadata = {
      id: `report-${Date.now()}`,
      title: `${companyId} Sustainability Report 2026`,
      currentLevel: ReportStageLevel.LV1_INTRODUCTION,
      subscriptionTier: tier,
      completionPercentage: 0,
      complianceChecks: [],
      lastUpdated: new Date().toISOString(),
    };

    this.activeReports.set(report.id, report);
    omniLogger.info(LogCategory.BUSINESS, `Report Wizard started for ${companyId}`, { reportId: report.id, tier });
    return report;
  }

  /**
   * 完成階段並前進 (Complete Stage & Advance)
   */
  public async completeStage(reportId: string, level: ReportStageLevel): Promise<IReportMetadata> {
    const report = this.activeReports.get(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);

    if (report.currentLevel === level) {
      report.currentLevel = level + 1;
      report.completionPercentage = (level / 8) * 100;
      report.lastUpdated = new Date().toISOString();

      omniLogger.info(LogCategory.BUSINESS, `Report Level UP! Stage ${level} completed.`, { reportId, nextLevel: report.currentLevel });

      // If level 6, perform compliance checks
      if (level === ReportStageLevel.LV6_OPTIMIZATION) {
        await this.performComplianceChecks(report);
      }
    }

    return report;
  }

  /**
   * 執行合規檢查 (Compliance Checks)
   */
  private async performComplianceChecks(report: IReportMetadata): Promise<void> {
    const checks: IComplianceCheck[] = [
      {
        standard: 'GRI',
        score: 85,
        passed: true,
        recommendations: ['Enhance Scope 3 disclosure'],
      }
    ];

    if (report.subscriptionTier !== SubscriptionTier.BRONZE) {
      checks.push({
        standard: 'TCFD',
        score: 75,
        passed: true,
        recommendations: ['Include climate scenario analysis'],
      });
    }

    if (report.subscriptionTier === SubscriptionTier.DIAMOND) {
      checks.push({
        standard: 'SASB',
        score: 92,
        passed: true,
        recommendations: ['Refine industry-specific metrics'],
      });
    }

    report.complianceChecks = checks;
  }

  /**
   * AI 智能生成報告草稿 (AI Draft Generation)
   */
  public async generateAiDraft(reportId: string): Promise<string> {
    const report = this.activeReports.get(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);

    if (report.currentLevel < ReportStageLevel.LV5_DRAFTING) {
      throw new Error('Please complete Level 4 (Data) before drafting.');
    }

    omniLogger.info(LogCategory.BUSINESS, `AI Generating draft for report: ${reportId}`);

    // Simulate AI drafting
    await new Promise(resolve => setTimeout(resolve, 2000));

    return `[AI Draft] ${report.title}\n\nThis business is committed to ESG excellence under the ${report.subscriptionTier} tier guidelines...`;
  }

  public async generateReport(format: 'json' | 'text' = 'json', reportId?: string): Promise<string> {
    const reportMetadata = reportId ? this.activeReports.get(reportId) : null;

    omniLogger.info(LogCategory.BUSINESS, 'Generating Omni ESG Report...', {
      service: 'OmniReportGenerator',
      reportId,
    });

    const verifiedData = truthEngine.getAllVerifiedClaims();

    // Enrich data with Proofs
    const enrichedClaims = verifiedData.map(claim => {
      const isTruthClaim = (claim as any).statement !== undefined;
      const content = isTruthClaim ? (claim as TruthClaim).statement : (claim as IClaim).content;
      const id = claim.id;
      const confidence = isTruthClaim
        ? (claim as TruthClaim).confidence
        : (claim as IClaim).confidenceScore;

      // Find proof references
      const proofs: any[] = [];

      // From TruthClaim.evidence
      if (isTruthClaim && (claim as TruthClaim).evidence) {
        (claim as TruthClaim).evidence.forEach(e => {
          if (e.hash_lock) {
            const metadata = EvidenceVault.getByHash(e.hash_lock);
            if (metadata && metadata.blockchainTxHash) {
              proofs.push({
                evidenceId: metadata.id,
                hash: e.hash_lock,
                txHash: metadata.blockchainTxHash,
                blockHeight: metadata.blockHeight,
                witness: metadata.witness,
              });
            }
          }
        });
      }

      // From IClaim.evidenceVaultRefs
      if ((claim as IClaim).evidenceVaultRefs) {
        (claim as IClaim).evidenceVaultRefs?.forEach(refId => {
          const metadata = EvidenceVault.getById(refId);
          if (metadata && metadata.blockchainTxHash) {
            proofs.push({
              evidenceId: metadata.id,
              hash: metadata.fileHash,
              txHash: metadata.blockchainTxHash,
              blockHeight: metadata.blockHeight,
              witness: metadata.witness,
            });
          }
        });
      }

      return {
        id,
        content,
        confidence,
        proofs,
      };
    });

    const report = {
      title: reportMetadata ? reportMetadata.title : 'Omni ESG Integrity Report',
      timestamp: new Date().toISOString(),
      generator: 'OmniReportGenerator v2.0 (Expert AI)',
      metadata: reportMetadata,
      summary: {
        total_claims: enrichedClaims.length,
        average_confidence:
          enrichedClaims.reduce((acc, c) => acc + c.confidence, 0) / (enrichedClaims.length || 1),
        blockchain_anchored_claims: enrichedClaims.filter(c => c.proofs.length > 0).length,
      },
      sections: [
        {
          title: 'Environmental (Verified)',
          claims: enrichedClaims.filter(
            c =>
              c.content.toLowerCase().includes('environment') ||
              c.content.toLowerCase().includes('carbon') ||
              c.content.toLowerCase().includes('emissions')
          ),
        },
        {
          title: 'Social (Verified)',
          claims: enrichedClaims.filter(
            c =>
              c.content.toLowerCase().includes('social') ||
              c.content.toLowerCase().includes('labor') ||
              c.content.toLowerCase().includes('community')
          ),
        },
        {
          title: 'Governance (Verified)',
          claims: enrichedClaims.filter(
            c =>
              c.content.toLowerCase().includes('governance') ||
              c.content.toLowerCase().includes('board') ||
              c.content.toLowerCase().includes('compliance')
          ),
        },
      ],
      all_claims: enrichedClaims,
    };

    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    } else {
      // Simple text format
      let text = `=== ${report.title} ===\n`;
      text += `Generated: ${report.timestamp}\n`;
      text += `Status: Level ${reportMetadata?.currentLevel || 'Final'}\n`;
      text += `Total Claims: ${report.summary.total_claims} (Anchored: ${report.summary.blockchain_anchored_claims})\n\n`;

      report.all_claims.forEach(c => {
        text += `[${c.confidence.toFixed(2)}] ${c.content}\n`;
        if (c.proofs.length > 0) {
          text += `   > Anchored at Block #${c.proofs[0].blockHeight} (Tx: ${c.proofs[0].txHash.substring(0, 16)}...)\n`;
        }
      });
      return text;
    }
  }
}

export const reportGenerator = OmniReportGenerator.getInstance();
