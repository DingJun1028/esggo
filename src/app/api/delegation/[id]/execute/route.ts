/**
 * ==========================================
 * 完全代主自行 - 執行任務 API 路由
 * ==========================================
 * 
 * REST API 端點 for 執行委託任務
 * 
 * 路由:
 * - POST /api/delegation/[id]/execute - 執行任務
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getDelegationManager } from '../../../../../agents/complete-delegation';
import {
  CompleteDelegationAgent,
  executeCompleteDelegationTask,
} from '../../../../../agents/complete-delegation/complete-delegation-agent';
import { secureForward } from '../../../../../core/services/omni-gateway';
import {
  DelegationEventNames,
  DelegationTopics,
} from '../../../../../types/complete-delegation';
import type { IBusEvent } from '../../../../../lib/omni-core/contracts';

/** 將執行事件封裝為可通過 omni-gateway 轉發的 IBusEvent（含 hashLock 溯源） */
function toBusEvent(
  type: string,
  topic: string,
  payload: unknown,
  source: string
): IBusEvent {
  const now = Date.now();
  return {
    uuid: randomUUID(),
    version: '1.0.0',
    timestamp: now,
    evidence: { gateway: 'omni-gateway', source },
    source_origin: source,
    topic,
    lifecycle_path: [
      { stage: 'EMERGED', timestamp: now, node: 'delegation-execute-route' },
    ],
    payload,
  };
}

// ==========================================
// POST /api/delegation/[id]/execute - 執行任務
// ==========================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Delegation ID is required' },
        { status: 400 }
      );
    }

    // 獲取請求 body
    const body = await request.json();
    const { intent, context } = body;

    if (!intent) {
      return NextResponse.json(
        { error: 'intent is required' },
        { status: 400 }
      );
    }

    // 驗證授權
    const manager = getDelegationManager();
    const delegation = await manager.getDelegation(id);

    if (!delegation) {
      return NextResponse.json(
        { error: 'Delegation not found' },
        { status: 404 }
      );
    }

    // 檢查權限
    const hasPermission = await manager.validateDelegation(id, 'execute');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions for execution' },
        { status: 403 }
      );
    }

    // 創建代理並執行任務
    const agent = new CompleteDelegationAgent(
      delegation.principalId,
      delegation
    );

    // 經由實際 gateway（omni-gateway.secureForward）轉發「執行開始」事件，取得 hashLock 溯源
    const startForward = await secureForward(
      toBusEvent(
        DelegationEventNames.DELEGATION_EXECUTION_STARTED,
        DelegationTopics.EXECUTION,
        { delegationId: id, intent },
        'api/delegation/[id]/execute'
      )
    );

    const result = await executeCompleteDelegationTask(
      agent,
      intent,
      context
    );

    // 經由實際 gateway 轉發「執行完成」事件
    const completeForward = await secureForward(
      toBusEvent(
        DelegationEventNames.DELEGATION_EXECUTION_COMPLETED,
        DelegationTopics.EXECUTION,
        {
          delegationId: id,
          executionId: result.executionId,
          success: result.success,
          error: result.error,
        },
        'api/delegation/[id]/execute'
      )
    );

    return NextResponse.json({
      success: result.success,
      executionId: result.executionId,
      result: result.result,
      error: result.error,
      duration: result.duration,
      gateway: {
        startHashLock: startForward.hashLock,
        completeHashLock: completeForward.hashLock,
      },
    });

  } catch (error) {
    console.error('[Delegation API] 執行任務失敗:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
