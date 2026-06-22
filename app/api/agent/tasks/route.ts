export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task, context } = body;

    // Dynamic imports — only loaded at runtime, never at build time
    const [{ createTask, executeSwarmTask }, { GLOBAL_TASKS, addTask, addExecution, addArtifact }] =
      await Promise.all([
        import('../../../../lib/agent/orchestrator'),
        import('../../../../lib/agent/store'),
      ]);

    // Swarm collaborative task
    if (task && !body.taskType) {
      const { omniSwarm } = await import('../../../../lib/agents/adk-swarm');
      const result = await omniSwarm.collaborate(task, context);
      return NextResponse.json({ success: true, result });
    }

    const { task: agentTask } = createTask({
      actorId: body.actorId ?? 'system',
      taskType: (body.taskType as any) || 'analysis',
      title: body.title || 'New Task',
      description: body.description || '',
      inputRefIds: body.inputRefIds ?? [],
      skillKey: body.skillKey,
    });

    await addTask(agentTask);

    // Standard task creation
    if (body.taskType === 'swap_defi') {
      const { SwapDeFiClient } = await import('../../../../lib/services/swap-defi-adapter');
      const transaction = body.transaction;
      const swapClient = new SwapDeFiClient();
      const swapResult = await swapClient.executeSwap(transaction);
      return NextResponse.json({ task: agentTask, result: swapResult, ok: true });
    }

    // Call OmniAgent VPS Server
    let execution, artifact;
    let executionSource = 'vps';
    try {
      const vpsRes = await fetch('http://127.0.0.1:8642/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Omni-Token': process.env.NEXT_PUBLIC_GATEWAY_KEY || 'oa_gold_2026',
        },
        body: JSON.stringify({ task: agentTask }),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        execution = vpsData.execution;
        artifact = vpsData.artifact;
        if (execution) addExecution(execution);
        if (artifact) addArtifact(artifact);
      } else {
        throw new Error(`VPS response not OK: ${vpsRes.status}`);
      }
    } catch (vpsErr) {
      console.warn(
        '[VPS] OmniAgent Server unreachable, falling back to local orchestrator:',
        vpsErr
      );
      executionSource = 'local';
      const localResult = await executeSwarmTask(agentTask.id);
      execution = localResult.execution;
      artifact = localResult.artifact;
    }

    return NextResponse.json({
      task: agentTask,
      execution,
      artifact,
      source: executionSource,
      ok: true,
    });
  } catch (err: any) {
    const message = err.message || 'unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const { GLOBAL_TASKS } = await import('../../../../lib/agent/store');
  return NextResponse.json({
    tasks: GLOBAL_TASKS,
    total: GLOBAL_TASKS.length,
    ok: true,
  });
}
