import { WriterAgent, AuditorAgent } from './AgentCore';
// Classified under: 信任治理層 (Trust & Governance Layer) & 認知智能層 (Cognitive Intelligence Layer)
import { ESGDataPoint, ChainedDataBlock } from '@/types/omni-report.types';
import { trustProtocolService } from './TrustProtocolService';

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 智能組件心核：稽核自癒服務 (AuditSelfHealingService)
 * --------------------------------------------------
 * [協議] 三、可計算性 (Tallyable/Calculable) - 算法邏輯
 *
 * 主要職責 (Responsibilities):
 * 1. 偵測由 Auditor Agent 標出的異常點 (Detect anomalies from Auditor Agent)
 * 2. 觸發 Writer Agent 進行敘述修正 (Trigger Writer Agent for narrative corrections)
 * 3. 確保 4+1 協議在錯誤發生時自動修復並封終態 (Ensure 4+1 Protocol auto-healing and sealing)
 */

export class AuditSelfHealingService {
  private writer: WriterAgent;
  private auditor: AuditorAgent;

  constructor() {
    this.writer = new WriterAgent();
    this.auditor = new AuditorAgent();
  }

  /**
   * 執行完整的稽核-修正迴圈流程 (Execute generate-audit-fix loop)
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

      // 1. 生成敘述 (Generate Narrative)
      const response = await this.writer.generateNarrative(indicatorId, truthData);
      currentNarrative = response.content;

      // 2. 執行稽核 (Execute Audit)
      const auditResult = await this.auditor.auditNarrative(currentNarrative, truthData);

      if (auditResult.pass) {
        omniLogger.info(LogCategory.AI, `[Self-Healing] Audit passed! Sealing data...`, {
          indicatorId,
        });

        try {
          // 3. 執行 4+1 協議存證封印 (可追蹤 & 不可篡改)
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

      // 4. 稽核失敗，進入迭代修正 (Audit failed, enter iterative correction)
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
      `超過 ${safeMaxRetries} 次重試後，未能達到 4+1 協議門檻 (Failed to reach 4+1 Protocol threshold after ${safeMaxRetries} retries)`
    );
  }
}
