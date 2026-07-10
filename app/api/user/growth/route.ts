/**
 * GET /api/user/growth?userId=xxx
 * Returns full user growth profile: tier, xp, achievements, tasks, subscriptions
 */

import { NextRequest } from 'next/server';
import { getUserGrowthService } from '@/core/services/user-growth-service';
import { jsonResponse, jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return jsonError('INVALID_PARAMS', 'userId required');
    }

    const service = getUserGrowthService();
    const profile = await service.getFullProfile(userId);

    if (!profile) {
      // Auto-create on first visit
      await service.getOrCreateUser(userId);
      const newProfile = await service.getFullProfile(userId);
      return jsonResponse({ success: true, profile: newProfile, created: true });
    }

    return jsonResponse({ success: true, profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonError('INTERNAL_ERROR', message);
  }
}
