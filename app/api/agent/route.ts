import { NextRequest, NextResponse } from 'next/server';
import { researcher, auditor, omniSwarm } from '@/lib/agents/adk-swarm';

export async function POST(req: NextRequest) {
  try {
    const { task, agentName, dataContext } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }

    let result;

    if (agentName) {
      const agent = omniSwarm.getAgent(agentName);
      if (!agent) {
        return NextResponse.json({ error: `Agent ${agentName} not found in ADK registry` }, { status: 404 });
      }
      result = await agent.run(task, dataContext);
    } else {
      // Default to researcher or swarm broadcast
      result = await researcher.run(task, dataContext);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[ADK Edge API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
