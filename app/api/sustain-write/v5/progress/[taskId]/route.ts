/**
 * GET /api/sustain-write/v5/progress/[taskId]
 * 查詢任務進度
 */
import { NextRequest } from 'next/server';
import { getTask, cancelTask } from '@/core/services/async-task-manager';
import { jsonResponse, jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  if (!taskId) {
    return jsonError('INVALID_PARAMS', 'taskId is required', 400);
  }

  const task = await getTask(taskId);
  if (!task) {
    return jsonError('TASK_NOT_FOUND', 'Task not found', 404);
  }

  return jsonResponse(task);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const cancelled = cancelTask(taskId);

  if (!cancelled) {
    return jsonError('TASK_NOT_FOUND', 'Task not found or already completed', 404);
  }

  return jsonResponse({ taskId, status: 'cancelled' });
}
