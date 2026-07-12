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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let cleanup: (() => void) | null = null;

      const send = (data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* controller 已關閉 */
        }
      };

      send({ type: 'CONNECTED', delegationId, ts: Date.now() });

      const unsub = enhancedOmniBus.subscribe(
        'external-forward',
        (ev: { payload?: unknown; hashLock?: string; ts?: number }) => {
          const payload = ev?.payload as
            | { type?: string; delegationId?: string }
            | undefined;
          if (!payload || payload.delegationId !== delegationId) return;
          if (!payload.type || !DELEGATION_EVENT_TYPES.has(payload.type)) return;
          send({
            type: payload.type,
            delegationId: payload.delegationId,
            hashLock: ev.hashLock,
            ts: ev.ts,
            payload,
          });
        }
      );

      cleanup = () => {
        if (closed) return;
        closed = true;
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
