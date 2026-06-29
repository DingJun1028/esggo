/**
 * GET /api/user/tasks?userId=xxx
 * Returns daily/weekly tasks with user progress
 *
 * POST /api/user/tasks/claim
 * Body: { userId, taskId }
 * Claims task reward
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserGrowthService } from '@/core/services/user-growth-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const service = getUserGrowthService();
    await service.getOrCreateUser(userId);

    const tasks = await service.getDailyTasks(userId);

    return NextResponse.json({ success: true, tasks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, taskId } = await req.json();
    if (!userId || !taskId) {
      return NextResponse.json({ error: 'userId and taskId required' }, { status: 400 });
    }

    const service = getUserGrowthService();
    const result = await service.claimTaskReward(userId, taskId);

    return NextResponse.json({ ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
