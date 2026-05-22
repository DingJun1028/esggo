import { NextRequest, NextResponse } from 'next/server';
import { createTask } from '../../../../lib/agent/orchestrator';
import type { AgentTaskType } from '../../../../lib/agent/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actorId, taskType, title, description, inputRefIds, skillKey } = body;

    if (!taskType || !title || !skillKey) {
      return NextResponse.json({ error: '缺少必要欄位：taskType, title, skillKey' }, { status: 400 });
    }

    const { task, policy } = createTask({
      actorId: actorId ?? 'system',
      taskType: taskType as AgentTaskType,
      title,
      description,
      inputRefIds: inputRefIds ?? [],
      skillKey,
    });

    return NextResponse.json({ task, policy, ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ tasks: [], total: 0, ok: true });
}