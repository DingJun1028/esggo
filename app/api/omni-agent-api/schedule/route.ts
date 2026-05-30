import { NextRequest, NextResponse } from 'next/server';
import { OmniCommander } from '@/lib/agents/omni-commander';
import { omniSwarm } from '@/lib/agents/adk-swarm';
import { pushBusEvent } from '../stream/route';

/**
 * Scheduled Auto-Sync Endpoint
 * ──────────────────────────────
 * Cron-compatible API for automated BlueCC ↔ AITable synchronization.
 * Can be triggered by Vercel Cron, external schedulers, or manual invocation.
 *
 * POST /api/omni-agent-api/schedule
 * Body: { mission: 'SYNC_BLUECC_AITABLE' | 'EVIDENCE_AUDIT' | 'PILOT_REPORT', cronSecret?: string }
 *
 * Security: Validates CRON_SECRET header for automated triggers.
 */

const VALID_MISSIONS = [
  'SYNC_BLUECC_AITABLE',
  'EVIDENCE_AUDIT',
  'PILOT_REPORT',
  'TRANSFER_TO_NCBDB',
] as const;

type MissionType = typeof VALID_MISSIONS[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mission, context, cronSecret } = body as {
      mission?: string;
      context?: Record<string, unknown>;
      cronSecret?: string;
    };

    // Security: Validate cron secret for automated triggers
    const expectedSecret = process.env.CRON_SECRET;
    const headerSecret = req.headers.get('x-cron-secret');
    if (expectedSecret && headerSecret !== expectedSecret && cronSecret !== expectedSecret) {
      // Allow manual triggers without secret in dev mode
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized: Invalid cron secret' }, { status: 401 });
      }
    }

    if (!mission || !VALID_MISSIONS.includes(mission as MissionType)) {
      return NextResponse.json(
        {
          error: `Invalid mission. Valid missions: ${VALID_MISSIONS.join(', ')}`,
          validMissions: VALID_MISSIONS,
        },
        { status: 400 }
      );
    }

    // Broadcast schedule event
    pushBusEvent('SCHEDULE_TRIGGERED', {
      mission,
      triggeredAt: new Date().toISOString(),
      source: headerSecret ? 'cron' : 'manual',
    });

    // Execute via OmniCommander
    const commander = new OmniCommander(omniSwarm);
    const result = await commander.command(mission, context);

    // Broadcast completion
    pushBusEvent('SCHEDULE_COMPLETE', {
      mission,
      success: result.success,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      scheduled: true,
      mission,
      ...result,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Schedule API Error]', errorMessage);

    pushBusEvent('SCHEDULE_ERROR', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: errorMessage, scheduled: false },
      { status: 500 }
    );
  }
}

/**
 * GET /api/omni-agent-api/schedule
 * Returns available missions and schedule status.
 */
export async function GET() {
  return NextResponse.json({
    availableMissions: VALID_MISSIONS,
    cronConfigured: !!process.env.CRON_SECRET,
    status: 'ready',
    documentation: {
      endpoint: 'POST /api/omni-agent-api/schedule',
      headers: { 'x-cron-secret': 'Your CRON_SECRET env variable' },
      body: '{ "mission": "SYNC_BLUECC_AITABLE", "context": {} }',
    },
  });
}
