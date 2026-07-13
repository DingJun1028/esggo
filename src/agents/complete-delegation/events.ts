/**
 * ==========================================
 * 完全代主自行 - 事件總線發布（深貫廣通）
 * ==========================================
 *
 * 統一封裝經 omni-gateway.secureForward 將授權生命週期 / 決策 / 回報 / 執行
 * 事件轉發至 omni-agent-bus（含 SHA-256 hashLock 溯源）。
 *
 * 由單一來源發布，確保無論經 API 或直呼叫用都能被監控 / 分析元件訂閱：
 * - CompleteDelegationManager  -> AUTHORIZATION 主題（CREATED / VALIDATED / TERMINATED）
 * - AutonomousDecisionEngine   -> DECISION 主題（DECISION_MADE）、REPORTING（DECISION_REPORTED）
 * - CompleteDelegationAgent    -> REPORTING 主題（DECISION_REPORTED）
 * - 執行路由                   -> EXECUTION 主題（EXECUTION_STARTED / COMPLETED）
 */

import { randomUUID } from 'crypto';
import { secureForward } from '../../core/services/omni-gateway';
import type { IBusEvent } from '../../lib/omni-core/contracts';
import { getDefaultJournal } from './journal';

/**
 * 發布一筆完全代主自行事件至 omni-agent-bus。
 * 採 fire-and-forget：內部捕錯，發布失敗不影響主流程（觀測性不應阻断業務）。
 */
export async function publishDelegationEvent(
  type: string,
  topic: string,
  payload: Record<string, unknown>,
  source: string
): Promise<{ status: string; hashLock: string }> {
  const now = Date.now();
  const event: IBusEvent = {
    uuid: randomUUID(),
    version: '1.0.0',
    timestamp: now,
    evidence: { gateway: 'omni-gateway', source },
    source_origin: source,
    topic,
    lifecycle_path: [
      { stage: 'EMERGED', timestamp: now, node: 'complete-delegation' },
    ],
    payload: { type, ...payload },
  };

  try {
    const { hashLock } = await secureForward(event);
    // 全量事件持久化（對齊「全量」不變量；best-effort，失敗不影響主流程）
    // 同一份 JSONL（與審計共用）並分配單調序號 id，供 SSE Last-Event-ID 斷點續傳
    try {
      const journalId = getDefaultJournal().append({
        kind: 'event',
        type,
        delegationId: (payload.delegationId as string) ?? '',
        topic,
        hashLock,
        ts: now,
        source,
        payload: { type, ...payload },
      });
      // 將序號附回 bus 事件，供 SSE 即時幀帶 id（斷點續傳游標）
      (event as Record<string, unknown>).journalId = journalId;
    } catch {
      /* best-effort */
    }
    return { status: 'ok', hashLock };
  } catch (err) {
    console.error('[delegation-events] publish failed:', err);
    return { status: 'error', hashLock: '' };
  }
}
