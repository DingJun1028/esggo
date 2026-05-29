import { NextResponse } from 'next/server';
import { OmniCommander } from '@/lib/agents/omni-commander';
import { omniSwarm } from '@/lib/agents/adk-swarm';

export async function POST(req: Request) {
  try {
    const { task, context } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }

    // Initialize OmniCommander with the swarm
    const commander = new OmniCommander(omniSwarm);

    // Execute the command
    const result = await commander.command(task, context);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[OmniAgent API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
