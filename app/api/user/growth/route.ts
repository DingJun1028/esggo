/**
 * GET /api/user/growth?userId=xxx
 * Returns full user growth profile: tier, xp, achievements, tasks, subscriptions
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
    const profile = await service.getFullProfile(userId);

    if (!profile) {
      // Auto-create on first visit
      const user = await service.getOrCreateUser(userId);
      const newProfile = await service.getFullProfile(userId);
      return NextResponse.json({ success: true, profile: newProfile, created: true });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
