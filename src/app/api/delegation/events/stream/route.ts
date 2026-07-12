/**
 * ==========================================
 * 完全代主自行 - 委派事件總線訂閱 (SSE)
 * ==========================================
 *
 * 即時推送某 delegation 的生命週期事件（經 omni-agent-bus 'external-forward'
 * 主題，含 SHA-256 hashLock 溯源）。以 monitor 權限把關（與 audit API 一致）。
 *
 * 路由:
 * - GET /api/delegation/events/stream?delegationId=xxx
 *     ?delegationId 必需；須具備該 delegation 的 monitor (或 full) 權限
 *     -> text/event-stream，斷線自動退訂
 */

import { NextRequest } from 'next/server';
import { enhancedOmniBus } from '../../../../../lib/omni-agent-bus';
import { getDelegationManager } from '../../../../../agents/complete-delegation';
import { DelegationEventNames } from '../../../../../types/complete-delegation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DELEGATION_EVENT_TYPES = new Set(Object.values(DelegationEventNames));

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const delegationId = searchParams.get('delegationId');

  if (!delegationId) {
    return new Response(JSON.stringify({ error: 'delegationId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const manager = getDelegationManager();
  const delegation = await manager.getDelegation(delegationId);
  if (!delegation) {
    return new Response(JSON.stringify({ error: 'Delegation not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 與 audit API 一致：僅 monitor / full 權限可訂閱即時事件流
  const canMonitor = await manager.validateDelegation(delegationId, 'monitor');
  if (!canMonitor) {
    return new Response(
      JSON.stringify({
        error:
          'Insufficient permissions: event stream requires monitor (or full) permission',
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 斷點續傳：客戶端（EventSource）重連時帶回 Last-Event-ID，僅回放其後的事件。
  // 另支援 ?sinceId= 查詢參數：EventSource 在全新連線（如頁面重新整理）時不會自動
  // 帶 Last-Event-ID 表頭，故由客戶端自 localStorage 讀取上次游標並以此參數續傳
  // （表頭優先於查詢參數，相容原生 EventSource 自動重連行為）。
  const lastIdHeader = request.headers.get('Last-Event-ID');
  const sinceParam = searchParams.get('sinceId');
  const sinceId =
    lastIdHeader && /^\d+$/.test(lastIdHeader)
      ? Number(lastIdHeader)
      : sinceParam && /^\d+$/.test(sinceParam)
        ? Number(sinceParam)
        : undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let cleanup: (() => void) | null = null;
      let heartbeat: ReturnType<typeof setInterval> | null = null;

      // send(data, id?)：可帶 SSE id 欄位，供客戶端 Last-Event-ID 斷點續傳
      const send = (data: unknown, id?: number) => {
        if (closed) return;
        const prefix = id != null ? `id: ${id}\n` : '';
        try {
          controller.enqueue(encoder.encode(`${prefix}data: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* controller 已關閉 */
        }
      };

      send({ type: 'CONNECTED', delegationId, ts: Date.now() });

      // 全量回放：連線先送歷史事件（catch-up），可指定 sinceId 續傳（對齊「全量」+ RWD）
      try {
        const trail = await manager.getFullEventTrail(delegationId, sinceId);
        for (const rec of trail) {
          send(
            {
              type: 'REPLAY',
              delegationId: rec.delegationId,
              hashLock: rec.hashLock,
              ts: rec.ts,
              source: rec.source,
              payload: rec.payload,
            },
            rec.id
          );
        }
        send({ type: 'REPLAY_DONE', delegationId, ts: Date.now(), count: trail.length });
      } catch {
        /* best-effort */
      }

      const unsub = enhancedOmniBus.subscribe(
        'external-forward',
        (ev: unknown) => {
          const e = ev as Record<string, unknown>;
          const raw = e.payload as Record<string, unknown> | undefined;
          // 真實事件（secureForward）封裝為 { event, payload: IBusEvent, ts }，
          // 委派 payload 位於 raw.payload；手動發布（測試）則 raw 即委派 payload。
          const delegationPayload =
            raw && typeof raw === 'object' && raw.payload && typeof raw.payload === 'object'
              ? (raw.payload as Record<string, unknown>)
              : raw;
          const hashLock =
            raw && typeof raw.hashLock === 'string'
              ? (raw.hashLock as string)
              : typeof e.hashLock === 'string'
                ? (e.hashLock as string)
                : undefined;
          // 斷點續傳游標：真實事件由 publishDelegationEvent 附 journalId 於 IBusEvent 上
          const frameId =
            raw && typeof raw.journalId === 'number' ? (raw.journalId as number) : undefined;
          const ts =
            (typeof e.ts === 'number' ? e.ts : undefined) ??
            (raw && typeof raw.ts === 'number' ? (raw.ts as number) : undefined);
          const payload = delegationPayload as
            | { type?: string; delegationId?: string }
            | undefined;
          if (!payload || payload.delegationId !== delegationId) return;
          if (!payload.type || !DELEGATION_EVENT_TYPES.has(payload.type)) return;
          send(
            {
              type: payload.type,
              delegationId: payload.delegationId,
              hashLock,
              ts,
              payload,
            },
            frameId
          );
        }
      );

      // 心跳保活：定期送 SSE 註解框，避免中間代理因閒置關閉連線（RWD / 全端穩健）
      heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          /* controller 已關閉 */
        }
      }, 25000);

      cleanup = () => {
        if (closed) return;
        closed = true;
        if (heartbeat) clearInterval(heartbeat);
        unsub();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      request.signal.addEventListener('abort', cleanup);
    },
    cancel() {
      // 斷線清理由 abort 監聽處理；此處保留佔位以符合 ReadableStream 契約
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
