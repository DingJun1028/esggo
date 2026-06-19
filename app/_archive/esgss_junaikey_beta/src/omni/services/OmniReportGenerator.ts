import { truthEngine, TruthClaim, IClaim } from './OmniTruthEngine.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { EvidenceVault } from '../../services/EvidenceVault.ts';

interface ReportSection {
  title: string;
  content: string;
  claims: any[];
}

export class OmniReportGenerator {
  private static instance: OmniReportGenerator;

  private constructor() { }

  public static getInstance(): OmniReportGenerator {
    if (!OmniReportGenerator.instance) {
      OmniReportGenerator.instance = new OmniReportGenerator();
    }
    return OmniReportGenerator.instance;
  }

  public async generateReport(format: 'json' | 'text' = 'json'): Promise<string> {
    omniLogger.info(LogCategory.BUSINESS, 'Generating Omni ESG Report...', {
      service: 'OmniReportGenerator',
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
      title: 'Omni ESG Integrity Report (4 Yes + 1 No Verified)',
      timestamp: new Date().toISOString(),
      generator: 'OmniReportGenerator v1.0',
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
