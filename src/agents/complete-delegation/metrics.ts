/**
 * ==========================================
 * 完全代主自行 - 委派事件指標觀測器（監控/分析消費者）
 * ==========================================
 *
 * 將統一發布的完全代主自行事件接入「實際監控/分析消費者」：
 * 訂閱 omni-agent-bus 的 'external-forward' 主題，對委派生命週期事件
 * 進行全量聚合（不抽樣、不截斷），提供全域與 per-delegation 的指標快照。
 *
 * 對齊平台不變量：
 * - 全域：與其他子系統共用同一事件總線（enhancedOmniBus），無孤島。
 * - 全量：觀測所有委派事件（無 ring-buffer 截斷、無取樣）。
 * - 雙向同步：與 client 經 POST /api/delegation/events 回寫進入同一總線，
 *   觀測器一視同仁地聚合 server 推送與 client 回寫的事件。
 */

import { enhancedOmniBus } from '../../lib/omni-agent-bus';
import { DelegationEventNames } from '../../types/complete-delegation';

/** 委派事件類型集合（含 AUTHORIZATION / DECISION / REPORTING / EXECUTION 主題） */
const DELEGATION_EVENT_TYPES = new Set(Object.values(DelegationEventNames));

/** 單一 delegation 的聚合指標 */
export interface DelegationMetric {
  total: number;
  byType: Record<string, number>;
  lastSeenAt: number | null;
}

/** 全域指標快照 */
export interface DelegationMetricsSnapshot {
  /** 觀測器啟動時間 */
  startedAt: number;
  /** 最近一次觀測到的委派事件時間戳（null 表示尚無事件） */
  lastSeenAt: number | null;
  /** 全域總事件數（全量，不截斷） */
  total: number;
  /** 按事件類型聚合的計數 */
  byType: Record<string, number>;
  /** 曾出現過事件的 delegation 數（不含識別碼，最小暴露） */
  activeDelegations: number;
}

/**
 * 委派事件指標觀測器（單例）。
 *
 * 於首次取得實例時訂閱總線；對非委派事件（type 不在 DelegationEventNames）
 * 一律忽略，避免污染指標。聚合結果保存在記憶體（程序級），對齊「全量」
 * 不變量——不丟棄、不抽樣。跨程序持久化由 unified journal 負責（見 events.ts）。
 */
class DelegationMetrics {
  private _byType: Record<string, number> = {};
  private _byDelegation: Map<string, DelegationMetric> = new Map();
  private _total = 0;
  private _lastSeenAt: number | null = null;
  private readonly _startedAt = Date.now();
  private _unsub: (() => void) | null = null;

  constructor() {
    this.ensureSubscribed();
  }

  /** 惰性訂閱總線（僅一次） */
  private ensureSubscribed(): void {
    if (this._unsub) return;
    this._unsub = enhancedOmniBus.subscribe('external-forward', (ev) => {
      this.ingest(ev as Record<string, unknown>);
    });
  }

  /** 解析並聚合一筆總線事件 */
  private ingest(ev: Record<string, unknown>): void {
    // 真實事件（secureForward）封裝為 { event, payload: IBusEvent, ts }，
    // 委派 payload 位於 payload.payload；手動/測試發布則 payload 即委派 payload。
    const raw = ev.payload as Record<string, unknown> | undefined;
    const delegationPayload =
      raw && typeof raw === 'object' && raw.payload && typeof raw.payload === 'object'
        ? (raw.payload as Record<string, unknown>)
        : raw;
    if (!delegationPayload || typeof delegationPayload !== 'object') return;

    const type = delegationPayload.type;
    if (typeof type !== 'string' || !DELEGATION_EVENT_TYPES.has(type)) return;

    const delegationId =
      typeof delegationPayload.delegationId === 'string'
        ? (delegationPayload.delegationId as string)
        : '';

    this._byType[type] = (this._byType[type] ?? 0) + 1;
    this._total++;

    if (delegationId) {
      let metric = this._byDelegation.get(delegationId);
      if (!metric) {
        metric = { total: 0, byType: {}, lastSeenAt: null };
        this._byDelegation.set(delegationId, metric);
      }
      metric.total++;
      metric.byType[type] = (metric.byType[type] ?? 0) + 1;
    }

    const ts =
      typeof ev.ts === 'number'
        ? (ev.ts as number)
        : typeof raw?.ts === 'number'
          ? (raw.ts as number)
          : Date.now();
    this._lastSeenAt = ts;
    if (delegationId) {
      const metric = this._byDelegation.get(delegationId);
      if (metric) metric.lastSeenAt = ts;
    }
  }

  /** 取得全域指標快照（不可變副本） */
  getSnapshot(): DelegationMetricsSnapshot {
    return {
      startedAt: this._startedAt,
      lastSeenAt: this._lastSeenAt,
      total: this._total,
      byType: { ...this._byType },
      activeDelegations: this._byDelegation.size,
    };
  }

  /** 取得單一 delegation 的指標快照（不存在時回傳空指標） */
  getDelegationSnapshot(delegationId: string): DelegationMetric {
    const metric = this._byDelegation.get(delegationId);
    return metric
      ? { total: metric.total, byType: { ...metric.byType }, lastSeenAt: metric.lastSeenAt }
      : { total: 0, byType: {}, lastSeenAt: null };
  }

  /** 清空所有聚合（用於測試或重啟觀測） */
  reset(): void {
    this._byType = {};
    this._byDelegation.clear();
    this._total = 0;
    this._lastSeenAt = null;
  }

  /** 解除總線訂閱（釋放資源） */
  dispose(): void {
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
  }
}

let _instance: DelegationMetrics | null = null;

/** 取得指標觀測器單例（首次呼叫即訂閱總線） */
export function getDelegationMetrics(): DelegationMetrics {
  if (!_instance) {
    _instance = new DelegationMetrics();
  }
  return _instance;
}

/** 重置指標觀測器（用於測試：先解除舊訂閱再釋放） */
export function resetDelegationMetrics(): void {
  if (_instance) {
    _instance.dispose();
    _instance = null;
  }
}
