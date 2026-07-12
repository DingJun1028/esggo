/**
 * ==========================================
 * 完全代主自行 - 委派告警外部通知 sink
 * （監控→告警→處置 閉環）
 * ==========================================
 *
 * 將指標觀測器評估出的告警轉發至外部接收端（預設 webhook），完成
 * 「監控 → 告警 → 處置」最後一哩。對齊平台不變量：
 * - 全量：告警已在觀測器內全量留存；通知失敗不影響留存（catch 吞掉）。
 * - 雙向同步：與 SSE 即時幀同源（觀測器同時發布 delegation.alert.raised 事件），
 *   外部通知與 RWD 畫面一致。
 *
 * 預設停用（no-op）：未設定 DELEGATION_ALERT_WEBHOOK_URL 時不發送；
 * 測試環境（NODE_ENV==='test'）一律停用，避免觸網。
 */

import type { DelegationAlert } from './metrics';

/** 通知器組態 */
export interface AlertNotifierConfig {
  /** webhook 端點；未設定則停用 */
  webhookUrl?: string;
  /** 是否啟用；預設：有 webhookUrl 且非測試環境才啟用 */
  enabled?: boolean;
  /** 注入 fetch（便於測試） */
  fetchImpl?: typeof fetch;
  /** 注入 now（便於測試） */
  now?: () => number;
}

/** 告警通知器介面 */
export interface AlertNotifier {
  /** 是否啟用（未啟用時 notify 為 no-op） */
  readonly enabled: boolean;
  /** 傳送一筆告警至外部接收端（非同步、失敗不拋） */
  notify(alert: DelegationAlert): Promise<void>;
}

/**
 * 建立告警通知器。
 * @param config 組態；未傳時由環境變數決定是否啟用。
 */
export function createAlertNotifier(config: AlertNotifierConfig = {}): AlertNotifier {
  const webhookUrl = config.webhookUrl ?? process.env.DELEGATION_ALERT_WEBHOOK_URL;
  const enabled =
    config.enabled ?? (!!webhookUrl && process.env.NODE_ENV !== 'test');
  const fetchImpl = config.fetchImpl ?? globalThis.fetch;
  const now = config.now ?? (() => Date.now());

  return {
    enabled: Boolean(enabled),
    async notify(alert: DelegationAlert): Promise<void> {
      if (!enabled || !webhookUrl) return;
      const payload = {
        schema: 'delegation-alert/v1',
        id: alert.id,
        level: alert.level,
        type: alert.type,
        delegationId: alert.delegationId,
        ts: alert.ts,
        message: alert.message,
        sentAt: now(),
      };
      try {
        await fetchImpl(webhookUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // 通知失敗不影響觀測/告警留存（對齊「全量」）
      }
    },
  };
}
