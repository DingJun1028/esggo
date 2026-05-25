import { NextRequest, NextResponse } from 'next/server';
import { createExecution, generateMockArtifact } from '../../../../../../lib/agent/orchestrator';
import { executeHermesTask } from '../../../../../../lib/hermes-gateway';
import { addExecution, addArtifact } from '../../../../../../lib/agent/store';
import type { AgentTask } from '../../../../../../lib/agent/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
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
        console.info(`Falling back to local Genkit execution for task: ${task.id}`);
        
        let content = '';
        let confidence = 0.85;
        let gaps: string[] = [];

        // [Genkit Real Integration]
        try {
          const { getHermesAI, hermesConfig, ESGArtifactSchema } = await import('@/lib/hermes.config');
          const systemInstruction = `${hermesConfig.personas.auditor}\n\n你現在是 AgentZ0，一個嚴格遵循 5T Integrity Protocol 的 ESG 稽核 AI。`;
          const prompt = `請根據以下任務詳細內容，生成一份符合 5T 標準的稽核結果。\n\n任務標題: ${task.title}\n任務類型: ${task.taskType}\n任務說明: ${task.description}`;
          const response = await (await getHermesAI()).generate({
            system: systemInstruction,
            prompt,
            output: { schema: ESGArtifactSchema }
          });

          const output = response.output();
          if (output) {
            content = output.content;
            confidence = output.confidence;
            gaps = output.gaps || [];
          } else {
            content = response.text();
          }
        } catch (genkitErr) {
          console.warn('Genkit execution failed, falling back to mock.', genkitErr);
          await new Promise(r => setTimeout(r, 1200));
          content = generateMockArtifact(task, execution).content;
        }

        execution.status = 'draft_generated';
        execution.finishedAt = new Date().toISOString();

        const artifact = generateMockArtifact(task, execution);
        artifact.content = content;
        artifact.confidence = confidence;
        execution.outputRefIds = [artifact.id];

        addExecution(execution);
        addArtifact(artifact);

        // [Phase 3] Autonomous Swarm Trigger
        // 如果信心度過低或偵測到重大缺口，自動啟動子任務委派
        if (confidence < (await import('@/lib/hermes.config').then(m => m.hermesConfig.adkOptions.swarmThreshold)) || gaps.length > 0) {
          console.log(`[Swarm Trigger] Low confidence (${confidence}) or gaps detected. Dispatching sub-task...`);
          const { dispatchSwarmHandoff } = await import('@/lib/agent/orchestrator');
          await dispatchSwarmHandoff(
            task.id, 
            'compliance_gap_analysis', 
            `自動觸發：信心度不足 (${confidence}) 或發現 ${gaps.length} 個缺口，需合規專家介入。`
          );
        }

        return NextResponse.json({ execution, artifact, ok: true });
      }
      throw e;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}