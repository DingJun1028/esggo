/**
 * ==========================================
 * 完全代主自行 - 委派事件指標觀測器測試
 * ==========================================
 *
 * 驗證「監控/分析消費者」對齊平台不變量：
 * - 全域：訂閱同一 omni-agent-bus（enhancedOmniBus）單例。
 * - 全量：聚合所有委派事件（不抽樣、不截斷），非委派事件被忽略。
 * - 雙向同步：server 推送與 client 回寫進入同一總線，觀測器一視同仁聚合。
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { enhancedOmniBus } from '../src/lib/omni-agent-bus';
import {
  getDelegationMetrics,
  resetDelegationMetrics,
  type DelegationAlert,
} from '../src/agents/complete-delegation/metrics';
import { GET as metricsGET } from '../src/app/api/delegation/metrics/route';
import { createCompleteDelegationAgent } from '../src/agents/complete-delegation';
import type { NextRequest } from 'next/server';

/** 模擬 secureForward 在總線上發布的真實委派事件形狀 */
function publishReal(type: string, delegationId: string, ts: number): void {
  enhancedOmniBus.publish('external-forward', {
    event: 'external-forward',
    payload: {
      uuid: `ev-${delegationId}-${ts}`,
      topic: 'external-forward',
      payload: { type, delegationId },
      hashLock: `lock-${delegationId}-${ts}`,
    },
    ts,
  });
}

describe('DelegationMetrics observer (監控/分析消費者)', () => {
  beforeEach(() => {
    resetDelegationMetrics();
  });

  it('aggregates delegation events from the bus (full-volume, no sampling)', () => {
    const m = getDelegationMetrics();
    const now = Date.now();

    publishReal('delegation.created', 'd1', now);
    publishReal('delegation.created', 'd1', now + 1);
    publishReal('delegation.terminated', 'd2', now + 2);
    // 非委派事件應被忽略
    enhancedOmniBus.publish('external-forward', {
      event: 'external-forward',
      payload: { type: 'other.event', delegationId: 'x' },
      ts: now + 3,
    });

    const snap = m.getSnapshot();
    expect(snap.total).toBe(3);
    expect(snap.byType['delegation.created']).toBe(2);
    expect(snap.byType['delegation.terminated']).toBe(1);
    expect(snap.activeDelegations).toBe(2);
    expect(snap.lastSeenAt).toBe(now + 2);
  });

  it('tracks per-delegation metrics separately', () => {
    const m = getDelegationMetrics();
    const now = Date.now();

    publishReal('delegation.created', 'd1', now);
    publishReal('delegation.validated', 'd1', now + 1);
    publishReal('delegation.execution.completed', 'd2', now + 2);

    expect(m.getDelegationSnapshot('d1').total).toBe(2);
    expect(m.getDelegationSnapshot('d1').byType['delegation.created']).toBe(1);
    expect(m.getDelegationSnapshot('d1').byType['delegation.validated']).toBe(1);
    expect(m.getDelegationSnapshot('d2').total).toBe(1);
    // 不存在的 delegation 回傳空指標
    expect(m.getDelegationSnapshot('nope').total).toBe(0);
  });

  it('raises alerts for emergency.stop / anomaly.detected and threshold', () => {
    const m = getDelegationMetrics();
    m.setThresholds({ delegationEventCount: 3 });
    const now = Date.now();

    // 閾值：d1 達 3 筆觸發 warning
    publishReal('delegation.created', 'd1', now);
    publishReal('delegation.validated', 'd1', now + 1);
    publishReal('delegation.execution.completed', 'd1', now + 2);
    // 訊號事件
    publishReal('delegation.anomaly.detected', 'd2', now + 3);
    publishReal('delegation.emergency.stop', 'd3', now + 4);

    const snap = m.getSnapshot();
    expect(snap.alerts.length).toBe(3); // 閾值 + anomaly + emergency
    const levels = snap.alerts.map((a) => a.level);
    expect(levels).toContain('critical');
    expect(levels).toContain('warning');
    expect(
      snap.alerts.some(
        (a) => a.type === 'delegation.emergency.stop' && a.level === 'critical'
      )
    ).toBe(true);
    // per-delegation 告警隔離
    expect(m.getDelegationSnapshot('d1').alerts.length).toBe(1);
    expect(
      m.getDelegationSnapshot('d2').alerts.some((a) => a.type === 'delegation.anomaly.detected')
    ).toBe(true);
    expect(m.getDelegationSnapshot('d3').alerts.some((a) => a.level === 'critical')).toBe(true);
  });
});

describe('GET /api/delegation/metrics', () => {
  beforeEach(() => {
    resetDelegationMetrics();
  });

  it('returns global aggregate without delegationId (200, no identifiers leaked)', async () => {
    getDelegationMetrics(); // 先建立訂閱，確保後續事件被觀測
    const now = Date.now();
    publishReal('delegation.created', 'd1', now);
    publishReal('delegation.terminated', 'd2', now + 1);

    const req = {
      url: 'http://localhost/api/delegation/metrics',
    } as unknown as NextRequest;

    const res = await metricsGET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.total).toBe(2);
    expect(body.activeDelegations).toBe(2);
    // 全球聚合不暴露 delegation 識別碼
    expect(body.byDelegation).toBeUndefined();
  });

  it('rejects unknown delegation (404)', async () => {
    const req = {
      url: 'http://localhost/api/delegation/metrics?delegationId=does-not-exist',
    } as unknown as NextRequest;

    const res = await metricsGET(req);
    expect(res.status).toBe(404);
  });

  it('rejects without monitor permission (403)', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'metrics-user-no-monitor',
      permissions: ['read'],
    });
    const delegationId = agent.delegationScope.delegationId;

    const req = {
      url: `http://localhost/api/delegation/metrics?delegationId=${delegationId}`,
    } as unknown as NextRequest;

    const res = await metricsGET(req);
    expect(res.status).toBe(403);
  });

  it('returns delegation metrics with monitor permission (200)', async () => {
    const agent = await createCompleteDelegationAgent({
      principalId: 'metrics-user-monitor',
      permissions: ['monitor', 'full'],
    });
    const delegationId = agent.delegationScope.delegationId;
    getDelegationMetrics(); // 先建立訂閱，確保後續事件被觀測
    // 注意：createCompleteDelegationAgent 會非同步發布 delegation.created，
    // 故本測試僅發布 delegation.validated（agent 不會發此類型）以做精確斷言。
    const now = Date.now();
    publishReal('delegation.validated', delegationId, now);

    const req = {
      url: `http://localhost/api/delegation/metrics?delegationId=${delegationId}`,
    } as unknown as NextRequest;

    const res = await metricsGET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.delegationId).toBe(delegationId);
    // agent 建立會非同步發布事件，故以 >= 驗證「本測試發布的事件確實被觀測」
    expect(body.byType['delegation.validated']).toBeGreaterThanOrEqual(1);
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it('includes alerts in global response', async () => {
    getDelegationMetrics(); // 先建立訂閱
    const now = Date.now();
    publishReal('delegation.emergency.stop', 'd-alert', now);

    const req = {
      url: 'http://localhost/api/delegation/metrics',
    } as unknown as NextRequest;

    const res = await metricsGET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.alerts)).toBe(true);
    expect(
      body.alerts.some(
        (a: { level: string; type: string }) =>
          a.level === 'critical' && a.type === 'delegation.emergency.stop'
      )
    ).toBe(true);
  });
});

describe('alert dispatch (監控→告警→處置 閉環)', () => {
  beforeEach(() => {
    resetDelegationMetrics();
  });

  it('notifies external sink and publishes alert event on raise', () => {
    const m = getDelegationMetrics();
    const notified: DelegationAlert[] = [];
    m.setNotifier({
      enabled: true,
      notify: async (a) => {
        notified.push(a);
      },
    });
    const published: DelegationAlert[] = [];
    m.setAlertPublisher((a) => {
      published.push(a);
    });

    const now = Date.now();
    publishReal('delegation.emergency.stop', 'd1', now);

    expect(notified.length).toBe(1);
    expect(notified[0].level).toBe('critical');
    expect(notified[0].type).toBe('delegation.emergency.stop');
    expect(notified[0].delegationId).toBe('d1');
    // 同一筆告警同時發布為 bus 事件（SSE 即時可見）
    expect(published.length).toBe(1);
    expect(published[0].id).toBe(notified[0].id);
  });

  it('does not re-ingest delegation.alert.raised (no self-loop)', () => {
    const m = getDelegationMetrics();
    m.setAlertPublisher(() => {}); // 避免真實發布副作用
    const before = m.getSnapshot().total;

    // 觀測器自身發布的告警事件回流至總線
    enhancedOmniBus.publish('external-forward', {
      event: 'external-forward',
      payload: { type: 'delegation.alert.raised', delegationId: 'd1', level: 'critical' },
      ts: Date.now(),
    });

    // 不回灌觀測計數、不重複產生告警
    expect(m.getSnapshot().total).toBe(before);
    expect(m.getSnapshot().alerts.length).toBe(0);
  });
});
