/**
 * GET /api/sustain-write/v5/progress/[taskId]
 * 查詢任務進度
 */
import { NextRequest, NextResponse } from 'next/server';
import { getTask, cancelTask } from '@/core/services/async-task-manager';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const task = await getTask(taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const cancelled = cancelTask(taskId);

  if (!cancelled) {
    return NextResponse.json({ error: 'Task not found or already completed' }, { status: 404 });
  }

  return NextResponse.json({ taskId, status: 'cancelled' });
}
