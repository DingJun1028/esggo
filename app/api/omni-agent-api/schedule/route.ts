import { NextRequest, NextResponse } from 'next/server';
import { OmniCommander } from '@/lib/agents/omni-commander';
import { omniSwarm } from '@/lib/agents/adk-swarm';
import { pushBusEvent } from '../stream/events';
import { pushAlert } from '@/lib/slack/slack-gateway';
import { pushTelegramAlert } from '@/lib/slack/telegram-gateway';


/**
 * Scheduled Auto-Sync Endpoint
 * ──────────────────────────────
 * Cron-compatible API for automated OmniBlue ↔ OmniTable synchronization.
 * Can be triggered by Vercel Cron, external schedulers, or manual invocation.
 *
 * POST /api/omni-agent-api/schedule
 * Body: { mission: 'SYNC_OMNIBLUE_OMNITABLE' | 'EVIDENCE_AUDIT' | 'PILOT_REPORT', cronSecret?: string }
 *
 * Security: Validates CRON_SECRET header for automated triggers.
 */

const VALID_MISSIONS = [
  'SYNC_OMNIBLUE_OMNITABLE',
  'EVIDENCE_AUDIT',
  'PILOT_REPORT',
  'TRANSFER_TO_NCBDB',
  'SECURITY_SCAN',
  'DEPENDENCY_UPDATE',
  'PERFORMANCE_REPORT',
  'CLEANUP_RESOURCES',
  'CODE_QUALITY_REPORT',
] as const;

type MissionType = typeof VALID_MISSIONS[number];

export async function POST(req: NextRequest) {
  try {

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Body might be empty
    }

    const bodyMission = body ? (body as any).mission : undefined;

    const searchParams = req.nextUrl.searchParams;
    const missionParam = searchParams.get('mission');
    const mission = bodyMission || missionParam;
    const context = body ? (body as any).context : {};
    const cronSecret = body ? (body as any).cronSecret : undefined;


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

    const successMessage = `Mission ${mission} completed successfully.
${result.message || ''}`;
    await pushAlert({
      severity: 'info',
      title: 'Cron Job Completed',
      message: successMessage,
      sourceModule: 'OmniAgent-Schedule'
    }).catch(e => console.error('Slack notification failed:', e));

    await pushTelegramAlert({
      severity: 'info',
      title: 'Cron Job Completed',
      message: successMessage,
    }).catch(e => console.error('Telegram notification failed:', e));


    return NextResponse.json({
      scheduled: true,
      mission,
      ...result,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Schedule API Error]', errorMessage);


    pushBusEvent('SCHEDULE_ERROR', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    await pushAlert({
      severity: 'critical',
      title: 'Cron Job Failed',
      message: `Mission failed: ${errorMessage}`,
      sourceModule: 'OmniAgent-Schedule'
    }).catch(e => console.error('Slack error notification failed:', e));

    await pushTelegramAlert({
      severity: 'critical',
      title: 'Cron Job Failed',
      message: `Mission failed: ${errorMessage}`,
    }).catch(e => console.error('Telegram error notification failed:', e));


    return NextResponse.json(
      { error: errorMessage, scheduled: false },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mission = searchParams.get('mission');
    const authHeader = req.headers.get('Authorization');
    const cronSecret = authHeader ? authHeader.replace('Bearer ', '') : undefined;

    // Security: Validate cron secret for automated triggers
    const expectedSecret = process.env.CRON_SECRET;
    if (expectedSecret && cronSecret !== expectedSecret) {
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
      source: cronSecret ? 'cron' : 'manual',
    });

    // Execute via OmniCommander
    const commander = new OmniCommander(omniSwarm);
    const result = await commander.command(mission, {});

    // Broadcast completion
    pushBusEvent('SCHEDULE_COMPLETE', {
      mission,
      success: result.success,
      completedAt: new Date().toISOString(),
    });

    const successMessage = `Mission ${mission} completed successfully. \n${result.message || ''}`;
    await pushAlert({
      severity: 'info',
      title: 'Cron Job Completed',
      message: successMessage,
      sourceModule: 'OmniAgent-Schedule'
    }).catch(e => console.error('Slack notification failed:', e));

    await pushTelegramAlert({
      severity: 'info',
      title: 'Cron Job Completed',
      message: successMessage,
    }).catch(e => console.error('Telegram notification failed:', e));


    return NextResponse.json({
      scheduled: true,
      mission,
      ...result,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Schedule API Error]', errorMessage);

    pushBusEvent('SCHEDULE_ERROR', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    await pushAlert({
      severity: 'critical',
      title: 'Cron Job Failed',
      message: `Mission failed: ${errorMessage}`,
      sourceModule: 'OmniAgent-Schedule'
    }).catch(e => console.error('Slack error notification failed:', e));

    await pushTelegramAlert({
      severity: 'critical',
      title: 'Cron Job Failed',
      message: `Mission failed: ${errorMessage}`,
    }).catch(e => console.error('Telegram error notification failed:', e));


    return NextResponse.json(
      { error: errorMessage, scheduled: false },
      { status: 500 }
    );
  }
}
