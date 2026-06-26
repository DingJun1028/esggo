/**
 * GET /api/sustain-write/v5/progress/[taskId]
 * 查詢任務進度
 */
import { NextRequest, NextResponse } from 'next/server';
import { getTask } from '@/core/services/async-task-manager';

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } },
) {
  const { taskId } = params;

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const task = getTask(taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } },
) {
  const { taskId } = params;
  const { cancelTask } = require('@/core/services/async-task-manager');
  const cancelled = cancelTask(taskId);

  if (!cancelled) {
    return NextResponse.json({ error: 'Task not found or already completed' }, { status: 404 });
  }

  return NextResponse.json({ taskId, status: 'cancelled' });
}
