import { NextRequest, NextResponse } from 'next/server';
import { omniAgent, omniSwarm } from '@/lib/agents/adk-swarm';

export async function POST(req: NextRequest) {
  try {
    const { task, agentName, dataContext, isCommand } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }

    let result;

    if (isCommand) {
      // Supreme Commander Level
      result = await omniAgent.command(task, dataContext);
    } else if (agentName) {
      // Individual Agent Level
      const agent = omniSwarm.getAgent(agentName);
      if (!agent) {
        return NextResponse.json({ error: `Agent ${agentName} not found in ADK registry` }, { status: 404 });
      }
      result = await agent.run(task, dataContext);
    } else {
      // Default to Commander reasoning
      result = await omniAgent.run(task, dataContext);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[OmniAgent Edge API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
