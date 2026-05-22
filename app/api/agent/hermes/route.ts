import { NextResponse } from 'next/server';
import { hermesAI, hermesConfig } from '../../../../lib/hermes.config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task } = body;

    if (!task) {
      return NextResponse.json({ ok: false, error: 'Task is required' }, { status: 400 });
    }

    // AgentZ0 Logic Interception
    if (hermesConfig.agentZ0Enabled) {
      console.log(`[AgentZ0] Intercepting task: ${task.title}`);
    }

    // Execute via Genkit Hermes Model
    const prompt = `As Hermes Agent, complete the following task:\nTitle: ${task.title}\nType: ${task.taskType}\nDescription: ${task.description}`;
    
    // Call the model using genkit (Mocked or real based on key availability)
    let generatedContent = '';
    try {
        const response = await hermesAI.generate({
          prompt: prompt,
        });
        generatedContent = response.text;
    } catch (e: any) {
        console.warn('Genkit generation failed, falling back to mock response.', e);
        generatedContent = `[Mock Generated Content via Hermes ADK]\n\nTask: ${task.title}\n\nThis is a generated response based on the ${task.taskType} template.`;
    }

    // Construct execution and artifact records
    const execution = {
      id: `exec_${Date.now()}`,
      taskId: task.id,
      status: 'completed',
      modelName: hermesConfig.agentName,
      auditLogId: `audit_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const artifact = {
      id: `art_${Date.now()}`,
      taskId: task.id,
      version: 1,
      content: generatedContent,
      reviewStatus: 'awaiting_review',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, execution, artifact });
  } catch (error: any) {
    console.error('Hermes Execution Error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
