/**
 * POST /api/sustain-write/v5/async
 * 啟動非同步報告生成任務
 */
import { NextRequest, NextResponse } from 'next/server';
import { createTask, startAsyncTask } from '../../../../../src/core/services/async-task-manager';

export async function POST(req: NextRequest) {
  const { companyId, format = 'json' } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  const taskId = createTask(companyId);
  startAsyncTask(taskId, companyId);

  return NextResponse.json({
    taskId,
    status: 'pending',
    message: '報告生成任務已啟動',
    progressUrl: `/api/sustain-write/v5/progress/${taskId}`,
  });
}

export async function GET() {
  return NextResponse.json({
    version: '5.0-async',
    endpoints: {
      start: 'POST /api/sustain-write/v5/async { companyId, format }',
      progress: 'GET /api/sustain-write/v5/progress/:taskId',
      cancel: 'DELETE /api/sustain-write/v5/progress/:taskId',
    },
  });
}
