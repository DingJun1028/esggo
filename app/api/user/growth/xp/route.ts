/**
 * POST /api/user/growth/xp
 * Body: { userId, action, amount?, metadata? }
 * Awards XP, updates tier/level, returns new state
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserGrowthService, XP_REWARDS } from '@/core/services/user-growth-service';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, action, amount, metadata } = await req.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
    }

    const service = getUserGrowthService();

    // Ensure user exists
    await service.getOrCreateUser(userId);

    // Calculate XP amount
    const xpAmount = amount ?? XP_REWARDS[action] ?? 5;

    // Update streak for daily login
    if (action === 'login_daily') {
      await service.updateStreak(userId);
    }

    const result = await service.addXP(userId, xpAmount, action);

    // Check tier-based achievements
    if (result.tierChanged) {
      const tierAchievementMap: Record<string, string> = {
        sprout: 'tier_sprout',
        bloom: 'tier_bloom',
        forest: 'tier_forest',
        guardian: 'tier_guardian',
      };
      const achievementSlug = tierAchievementMap[result.newTier];
      if (achievementSlug) {
        await service.unlockAchievement(userId, achievementSlug);
      }
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
