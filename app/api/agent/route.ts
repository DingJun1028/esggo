import { NextResponse } from 'next/server';
import { runESGMultiAgentWorkflow } from '@/lib/ai/agentz0';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Execute the ADK + Genkit + AgentZ0 Multi-Agent Workflow
    const results = await runESGMultiAgentWorkflow(topic);

    return NextResponse.json({
      success: true,
      message: 'AgentZ0 Workflow Completed',
      data: results
    });
  } catch (error: any) {
    console.error('Agent API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
