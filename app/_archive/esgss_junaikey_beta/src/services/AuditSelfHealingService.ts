import { WriterAgent, AuditorAgent } from './AgentCore.js';
// Classified under: Trust & Governance Layer & Cognitive Intelligence Layer
import { ESGDataPoint, ChainedDataBlock } from '../types/omni-report.types.js';
import { trustProtocolService } from './TrustProtocolService.js';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * Omni Component Heart: Audit Self-Healing Service (AuditSelfHealingService)
 * --------------------------------------------------
 * [Protocol] III. Calculability (Tallyable/Calculable) - Algorithmic Logic
 *
 * Major Responsibilities:
 * 1. Detect anomalies flagged by the Auditor Agent
 * 2. Trigger the Writer Agent for narrative corrections
 * 3. Ensure the 4 Yes + 1 No Protocol can auto-heal and ultimately lock when errors occur
 */

export class AuditSelfHealingService {
  private writer: WriterAgent;
  private auditor: AuditorAgent;

  constructor() {
    this.writer = new WriterAgent();
    this.auditor = new AuditorAgent();
  }

  /**
   * Executes the "Generate-Audit-Fix" cyclic process (Execute generate-audit-fix loop)
   */
  async executeHealingLoop(
    indicatorId: string,
    truthData: ESGDataPoint,
    maxRetries: number = 3
  ): Promise<{ finalNarrative: string; chainedBlock: ChainedDataBlock }> {
    const safeMaxRetries = Math.max(1, Math.min(10, maxRetries)); // Clamp between 1 and 10
    let attempt = 0;
    let currentNarrative = '';
    let lastFeedback = '';

    while (attempt < safeMaxRetries) {
      omniLogger.info(
        LogCategory.AI,
        `[Self-Healing] Starting attempt ${attempt + 1}/${safeMaxRetries}...`,
        { indicatorId }
      );

      // 1. Generate Narrative
      const response = await this.writer.generateNarrative(indicatorId, truthData);
      currentNarrative = response.content;

      // 2. Execute Audit
      const auditResult = await this.auditor.auditNarrative(currentNarrative, truthData);

      if (auditResult.pass) {
        omniLogger.info(LogCategory.AI, `[Self-Healing] Audit passed! Sealing data...`, {
          indicatorId,
        });

        try {
          // 3. Execute 4+1 Protocol evidence preservation (traceable & immutable)
          const auditedDP = await trustProtocolService.auditDataPoint(
            truthData,
            'GRI-Logic-Confirmed'
          );
          const sealed = await trustProtocolService.sealAndChain(auditedDP, null);

          return {
            finalNarrative: currentNarrative,
            chainedBlock: sealed,
          };
        } catch (sealError) {
          omniLogger.error(LogCategory.SECURITY, `[Self-Healing] Failed to seal data block`, {
            sealError,
            indicatorId,
          });
          throw sealError;
        }
      }

      // 4. Audit failed, enter iterative correction
      lastFeedback = auditResult.feedback;
      omniLogger.warn(
        LogCategory.AI,
        `[Self-Healing] Audit failed: ${lastFeedback}. Preparing correction...`,
        {
          attempt: attempt + 1,
          indicatorId,
        }
      );
      attempt++;
    }

    omniLogger.error(
      LogCategory.AI,
      `[Self-Healing] Failed to reach consensus after ${safeMaxRetries} retries`,
      { indicatorId }
    );
    throw new Error(
      `Failed to reach 4 Yes + 1 No Protocol threshold after ${safeMaxRetries} retries.`
    );
  }
}
