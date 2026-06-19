import { NextRequest, NextResponse } from 'next/server';
import { createTask, executeSwarmTask } from '../../../../lib/agent/orchestrator';
import { GLOBAL_TASKS, addTask, addExecution, addArtifact } from '../../../../lib/agent/store';
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

    await addTask(task);

    // Call OmniAgent VPS Server
    let execution, artifact;
    let executionSource = 'vps';
    try {
      const vpsRes = await fetch('http://127.0.0.1:8642/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        execution = vpsData.execution;
        artifact = vpsData.artifact;
        if (execution) addExecution(execution);
        if (artifact) addArtifact(artifact);
      } else {
        const errText = await vpsRes.text();
        console.error(`[VPS] Error response: ${vpsRes.status} ${vpsRes.statusText} - ${errText}`);
        throw new Error(`VPS response not OK: ${vpsRes.status}`);
      }
    } catch (vpsErr) {
      console.warn('[VPS] OmniAgent Server unreachable or failed, falling back to local orchestrator:', vpsErr);
      executionSource = 'local';
      const localResult = await executeSwarmTask(task.id);
      execution = localResult.execution;
      artifact = localResult.artifact;
    }

    return NextResponse.json({ task, policy, execution, artifact, source: executionSource, ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    tasks: GLOBAL_TASKS, 
    total: GLOBAL_TASKS.length, 
    ok: true 
  });
}