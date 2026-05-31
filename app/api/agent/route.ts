import { NextRequest, NextResponse } from 'next/server';
import { omniAgent, omniSwarm, esgResearcher, esgAuditor, esgStrategist, esgConsultant } from '@/lib/agents/adk-swarm';

// Agent mapping for individual queries
const AGENT_MAP: Record<string, any> = {
  'ESG_Researcher': esgResearcher,
  'ESG_Auditor': esgAuditor,
  'ESG_Strategist': esgStrategist,
  'ESG_Consultant': esgConsultant,
};

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
      // Individual Agent Level - use mapped agents
      const agent = AGENT_MAP[agentName];
      if (!agent) {
        return NextResponse.json({ error: `Agent ${agentName} not found in ADK registry` }, { status: 404 });
      }
      result = await agent.run(task, dataContext);
    } else {
      // Default to Commander reasoning
      result = await omniAgent.run(task, dataContext);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    console.error('[OmniAgent Edge API] Error:', error);
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}
