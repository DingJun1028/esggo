import { NextRequest, NextResponse } from 'next/server';
import { createExecution, generateMockArtifact } from '../../../../../../lib/agent/orchestrator';
import { executeHermesTask } from '../../../../../../lib/hermes-gateway';
import { addExecution, addArtifact } from '../../../../../../lib/agent/store';
import type { AgentTask } from '../../../../../../lib/agent/types';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

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

    // [Policy Guard Check]
    if (task.status === 'denied') {
      return NextResponse.json({ error: '此任務已被 Policy Guard 拒絕' }, { status: 403 });
    }

    const execution = createExecution(task);
    execution.status = 'running';
    execution.startedAt = new Date().toISOString();

    try {
      // 優先嘗試呼叫 live Gateway (VPS)
      const result = await executeHermesTask(task);
      addExecution(result.execution);
      addArtifact(result.artifact);
      return NextResponse.json({ ...result, ok: true });
    } catch (e: any) {
      if (e.message === 'HERMES_GATEWAY_UNREACHABLE') {
        console.info(`Falling back to local AI execution for task: ${task.id}`);
        
        let content = '';
        
        // [Real LLM Integration] 若有本地 Key 則嘗試直連，否則使用 Mock
        if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_key') {
          const { agentZ0Flow } = await import('@/lib/agents/agentz0');
          const query = `標題：${task.title}\n描述：${task.description || '無'}\n類型：${task.taskType}\n請生成專業的 ESG 內容。`;
          
          content = await agentZ0Flow({ query, context: task });
        } else {
          // 全 Mock Fallback
          await new Promise(r => setTimeout(r, 1200));
          content = generateMockArtifact(task, execution).content;
        }

        execution.status = 'draft_generated';
        execution.finishedAt = new Date().toISOString();

        const artifact = generateMockArtifact(task, execution);
        artifact.content = content;
        execution.outputRefIds = [artifact.id];

        addExecution(execution);
        addArtifact(artifact);

        return NextResponse.json({ execution, artifact, ok: true });
      }
      throw e;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}