import { NextRequest, NextResponse } from 'next/server';
import { createExecution, generateMockArtifact } from '../../../../../../lib/agent/orchestrator';
import type { AgentTask } from '../../../../../../lib/agent/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const body = await req.json();
    const { task } = body as { task: AgentTask };

    if (!task) {
      return NextResponse.json({ error: '缺少 task payload' }, { status: 400 });
    }

    const execution = createExecution(task);
    execution.status = 'running';

    await new Promise(r => setTimeout(r, 800));

    execution.status = 'draft_generated';
    execution.startedAt = new Date(Date.now() - 800).toISOString();
    execution.finishedAt = new Date().toISOString();

    const artifact = generateMockArtifact(task, execution);
    execution.outputRefIds = [artifact.id];

    return NextResponse.json({ execution, artifact, ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}