/**
 * POST /api/sustain-write/v5/async
 * 啟動非同步報告生成任務
 */
import { NextRequest, NextResponse } from 'next/server';
import { createTask, startAsyncTask, getAllTasks, getCompanyList } from '../../../../../src/core/services/async-task-manager';
import { CelestialController } from '../../../../../src/lib/celestial/implementation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { companyId } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  const celestial = new CelestialController();
  await celestial.executeCelestialFlow({
    payload: { companyId, action: 'START_ESG_REPORT' },
    origin: 'ESG_REPORT_AGENT'
  });

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
      start: 'POST /api/sustain-write/v5/async { companyId }',
      progress: 'GET /api/sustain-write/v5/progress/:taskId',
      cancel: 'DELETE /api/sustain-write/v5/progress/:taskId',
    },
    companies: getCompanyList(),
    activeTasks: getAllTasks().filter(t => t.status === 'running' || t.status === 'pending').length,
  });
}
