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
import { getDelegationManager } from '../../../../../agents/complete-delegation';
import {
  CompleteDelegationAgent,
  executeCompleteDelegationTask,
} from '../../../../../agents/complete-delegation/complete-delegation-agent';

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

    const result = await executeCompleteDelegationTask(
      agent,
      intent,
      context
    );

    return NextResponse.json({
      success: result.success,
      executionId: result.executionId,
      result: result.result,
      error: result.error,
      duration: result.duration,
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
