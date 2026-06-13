import { NextResponse } from 'next/server';
import { OmniCommander } from '@/lib/agents/omni-commander';
import { omniSwarm } from '@/lib/agents/adk-swarm';
import { pushBusEvent } from '../stream/events';

/**
 * OmniAgent Command API
 * ─────────────────────
 * Receives mission commands from the Think Tank dashboard and
 * executes them via OmniCommander, broadcasting real-time status
 * through the SSE event stream.
 *
 * POST /api/omni-agent-api/command
 * Body: { task: string, context?: Record<string, unknown> }
 */

export async function POST(req: Request) {
  try {
    const { task, context } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }

    // Broadcast command initiation to SSE stream
    pushBusEvent('COMMAND_ISSUED', {
      task,
      source: 'ThinkTankControl',
      issuedAt: new Date().toISOString(),
    });

    // Initialize OmniCommander with the swarm
    const commander = new OmniCommander(omniSwarm);

    // Execute the command
    const result = await commander.command(task, context);

    // Broadcast completion
    pushBusEvent('COMMAND_COMPLETE', {
      task,
      success: result.success,
      message: result.message,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[OmniAgent API Error]', errorMessage);

    pushBusEvent('COMMAND_ERROR', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/omni-agent-api/command
 * Returns command API status and available missions.
 */
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    availableMissions: [
      'SYNC_OMNIBLUE_OMNITABLE',
      'EVIDENCE_AUDIT',
      'PILOT_REPORT',
      'TRANSFER_TO_NCBDB',
    ],
    documentation: {
      method: 'POST',
      body: '{ "task": "SYNC_OMNIBLUE_OMNITABLE", "context": {} }',
    },
  });
}
