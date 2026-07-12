/**
 * ==========================================
 * 統一發布原語（深貫廣通 · 全域事件總線單一來源）
 * ==========================================
 *
 * 所有子系統經由此處將事件轉發至 `omni-agent-bus`（`enhancedOmniBus`）：
 * 計算 SHA-256 `hashLock` 溯源，並於指定 topic 發布。委派子系統的
 * `publishDelegationEvent` 與 `omni-gateway.secureForward` 皆委託於此，
 * 確保「全域」不變量——無論何種事件，都走同一條帶 hashLock 的發布路徑，
 * 便於監控 / 分析元件統一訂閱（`external-forward`）。
 */

import { createHash } from 'crypto';
import { enhancedOmniBus } from './omni-agent-bus';
import type { IBusEvent } from './omni-core/contracts';

/**
 * 將事件發布至 omni-agent-bus（含 SHA-256 hashLock 溯源）。
 * @returns 計算出的 hashLock（64 hex）
 */
export function publishBusEvent(topic: string, event: IBusEvent): { hashLock: string } {
  const hashLock = createHash('sha256').update(JSON.stringify(event)).digest('hex');
  enhancedOmniBus.publish(topic, { ...event, hashLock } as IBusEvent);
  return { hashLock };
}
