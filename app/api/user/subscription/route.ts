/**
 * POST /api/user/subscription
 * Body: { userId, subType, targetId, action: 'subscribe' | 'unsubscribe' | 'toggle' }
 * Toggles user subscription to a data source, company, or keyword
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserGrowthService } from '@/core/services/user-growth-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId, subType, targetId, action = 'toggle' } = await req.json();
    if (!userId || !subType || !targetId) {
      return NextResponse.json({ error: 'userId, subType, targetId required' }, { status: 400 });
    }

    const service = getUserGrowthService();
    await service.getOrCreateUser(userId);

    const result = await service.toggleSubscription(userId, subType, targetId);

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
