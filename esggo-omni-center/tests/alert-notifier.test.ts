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
import {
  createAlertNotifier,
  createEmailNotifier,
  createCompositeNotifier,
  getDefaultAlertNotifier,
} from '../src/agents/complete-delegation/alert-notifier';
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

describe('createEmailNotifier (郵件通知，經閘道 webhook)', () => {
  it('is no-op when webhookUrl unset', async () => {
    const fetchImpl = vi.fn();
    const n = createEmailNotifier({ webhookUrl: '', enabled: true, fetchImpl: fetchImpl as unknown as typeof fetch });
    await n.notify(makeAlert());
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('POSTs email-shaped payload (subject/text/to/from)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    const n = createEmailNotifier({
      webhookUrl: 'https://mail.test/send',
      to: 'ops@example.com',
      from: 'alerts@example.com',
      subjectPrefix: '[ESG告警]',
      enabled: true,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      now: () => 9999,
    });
    expect(n.enabled).toBe(true);

    await n.notify(makeAlert({ level: 'critical', type: 'delegation.emergency.stop' }));

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://mail.test/send');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body.schema).toBe('delegation-alert-email/v1');
    expect(body.to).toBe('ops@example.com');
    expect(body.from).toBe('alerts@example.com');
    expect(body.subject).toBe('[ESG告警] CRITICAL · delegation.emergency.stop');
    expect(body.text).toContain('授權 d1 觸發緊急停止');
    expect(body.alert.id).toBe('al-1');
  });

  it('does not throw when email gateway fails', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('smtp down'));
    const n = createEmailNotifier({
      webhookUrl: 'https://mail.test/send',
      enabled: true,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(n.notify(makeAlert())).resolves.toBeUndefined();
  });
});

describe('createCompositeNotifier (扇出至多 sink)', () => {
  it('calls only enabled sinks; one failure does not block others', async () => {
    const ok = vi.fn().mockResolvedValue(new Response('ok'));
    const bad = vi.fn().mockRejectedValue(new Error('boom'));
    const disabled = vi.fn();
    const composite = createCompositeNotifier([
      { enabled: true, notify: ok },
      { enabled: true, notify: bad },
      { enabled: false, notify: disabled },
    ]);
    expect(composite.enabled).toBe(true);
    await composite.notify(makeAlert());
    expect(ok).toHaveBeenCalledTimes(1);
    expect(bad).toHaveBeenCalledTimes(1);
    expect(disabled).not.toHaveBeenCalled();
  });

  it('is disabled when no sink enabled', () => {
    const composite = createCompositeNotifier([{ enabled: false, notify: async () => {} }]);
    expect(composite.enabled).toBe(false);
  });
});

describe('getDefaultAlertNotifier (環境驅動)', () => {
  it('is disabled in test env (no webhook/email configured)', () => {
    const n = getDefaultAlertNotifier();
    expect(n.enabled).toBe(false);
  });
});
