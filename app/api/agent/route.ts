import { NextRequest, NextResponse } from 'next/server';
import { esgResearchAgent } from '@/lib/ai/agentz0';

export async function POST(req: NextRequest) {
  try {
    const { task, dataContext } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }

    // Call our agent from edge function
    const result = await esgResearchAgent.runTask(task, dataContext);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Edge API Agent] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
