/**
 * ==========================================
 * 完全代主自行 - 委派告警外部通知 sink 測試
 * ==========================================
 *
 * 驗證「監控→告警→處置」閉環的對外通知環節：
 * - 未啟用 / 未設定 webhook 時為 no-op（不觸網）。
 * - 啟用時以 POST + JSON 傳送正確酬載。
 * - 傳送失敗不拋出（對齊「全量」：告警留存不受影響）。
 * - 測試環境（NODE_ENV==='test'）預設停用。
 */

import { describe, it, expect, vi } from 'vitest';
import { createAlertNotifier } from '../src/agents/complete-delegation/alert-notifier';
import type { DelegationAlert } from '../src/agents/complete-delegation/metrics';

function makeAlert(over: Partial<DelegationAlert> = {}): DelegationAlert {
  return {
    id: 'al-1',
    level: 'critical',
    type: 'delegation.emergency.stop',
    delegationId: 'd1',
    ts: 1000,
    message: '授權 d1 觸發緊急停止',
    ...over,
  };
}

describe('createAlertNotifier (監控→告警→處置 閉環)', () => {
  it('is no-op when disabled (no webhookUrl)', async () => {
    const fetchImpl = vi.fn();
    const n = createAlertNotifier({ enabled: true, fetchImpl: fetchImpl as unknown as typeof fetch });
    // enabled true 但無 webhookUrl → 仍不發送
    await n.notify(makeAlert());
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('is disabled by default in test env', () => {
    const n = createAlertNotifier({ webhookUrl: 'https://hook.test/x' });
    expect(n.enabled).toBe(false);
  });

  it('POSTs JSON payload to webhook when enabled', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    const n = createAlertNotifier({
      webhookUrl: 'https://hook.test/x',
      enabled: true,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      now: () => 9999,
    });
    expect(n.enabled).toBe(true);

    await n.notify(makeAlert({ level: 'warning', type: 'delegation.anomaly.detected' }));

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://hook.test/x');
    expect(init.method).toBe('POST');
    expect(init.headers['content-type']).toBe('application/json');
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      schema: 'delegation-alert/v1',
      id: 'al-1',
      level: 'warning',
      type: 'delegation.anomaly.detected',
      delegationId: 'd1',
      ts: 1000,
      message: '授權 d1 觸發緊急停止',
      sentAt: 9999,
    });
  });

  it('does not throw when webhook fetch fails (全量留存不中斷)', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'));
    const n = createAlertNotifier({
      webhookUrl: 'https://hook.test/x',
      enabled: true,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(n.notify(makeAlert())).resolves.toBeUndefined();
  });
});
