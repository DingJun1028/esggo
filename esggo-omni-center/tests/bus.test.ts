/**
 * ==========================================
 * 統一發布原語測試（深貫廣通 · 全域事件總線單一來源）
 * ==========================================
 *
 * 驗證 `publishBusEvent` 為所有子系統的統一發布入口：
 * - 計算 SHA-256 hashLock 溯源；
 * - 於指定 topic 發布至 omni-agent-bus（enhancedOmniBus）。
 */

import { describe, it, expect } from 'vitest';
import { enhancedOmniBus } from '../src/lib/omni-agent-bus';
import { publishBusEvent } from '../src/lib/bus';
import type { IBusEvent } from '../src/lib/omni-core/contracts';

describe('publishBusEvent (統一發布原語)', () => {
  it('emits to bus with SHA-256 hashLock', () => {
    const received: IBusEvent[] = [];
    const unsub = enhancedOmniBus.subscribe('external-forward', (ev) =>
      received.push(ev as IBusEvent)
    );

    const event = {
      event: 'external-forward',
      payload: { type: 'delegation.created', delegationId: 'd1' },
      ts: 1700000000000,
    } as unknown as IBusEvent;

    const { hashLock } = publishBusEvent('external-forward', event);

    expect(hashLock).toMatch(/^[0-9a-f]{64}$/);
    expect(received.length).toBe(1);
    expect((received[0] as Record<string, unknown>).hashLock).toBe(hashLock);
    unsub();
  });

  it('does not emit to unrelated topics', () => {
    const received: IBusEvent[] = [];
    const unsub = enhancedOmniBus.subscribe('other-topic', (ev) =>
      received.push(ev as IBusEvent)
    );
    publishBusEvent('external-forward', {
      event: 'external-forward',
      payload: { type: 'x' },
      ts: Date.now(),
    } as unknown as IBusEvent);
    expect(received.length).toBe(0);
    unsub();
  });
});
