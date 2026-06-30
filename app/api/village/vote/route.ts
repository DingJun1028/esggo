import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { CelestialController } from '@/lib/celestial/implementation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { projectId, userId, amount, tenantId = 'default_tenant' } = await req.json();

    if (!projectId || !userId || !amount || amount <= 0) {
      return NextResponse.json({ error: '無效的請求參數' }, { status: 400 });
    }

    const rl = await rateLimit(`vote_${tenantId}_${userId}`, 5, 60);
    if (!rl.success) {
      return NextResponse.json({ error: '投票頻率過高，請稍後再試' }, { status: 429 });
    }

    const cost = amount * amount * 10;
    const power = amount * 10;

    const { adminDb } = await import('@/lib/firebase-admin');
    const projectRef = adminDb.collection('village_projects').doc(projectId);
    const memberRef = adminDb.collection('village_members').doc(userId);
    const activityRef = adminDb.collection('village_activities').doc();

    await adminDb.runTransaction(async (t: any) => {
      const projectDoc = (await t.get(projectRef)) as any;
      const memberDoc = (await t.get(memberRef)) as any;

      if (!projectDoc.exists) throw new Error('專案不存在');
      if (!memberDoc.exists) throw new Error('會員不存在');

      const projectData = projectDoc.data() as { current_points: number; title: string; [key: string]: unknown };
      const memberData = memberDoc.data() as { points: number; name: string; [key: string]: unknown };

      if ((memberData?.points || 0) < cost) {
        throw new Error('您的 PTS 點數不足');
      }

      // 1. Deduct points from user
      t.update(memberRef, {
        points: (memberData?.points || 0) - cost
      });

      // 2. Add points to project
      t.update(projectRef, {
        current_points: (projectData?.current_points || 0) + power
      });

      // 3. Log the activity for transparency (5T)
      const activityData = {
        projectId,
        userId,
        amount,
        cost,
        power,
        message: `${memberData?.name || '某個村民'} 向「${projectData?.title || '專案'}」投了 ${amount} 票 (花費 ${cost} PTS)`,
        created_at: new Date().toISOString()
      };

      const celestial = new CelestialController();
      const purifiedData = await celestial.executeCelestialFlow({
        payload: activityData,
        origin: 'VILLAGE_VOTE'
      });

      // Write the purified and sealed data to Firestore
      t.set(activityRef, { ...activityData, uuid: purifiedData?.uuid, sealTimestamp: purifiedData?.sealTimestamp });
    });

    return NextResponse.json({ 
      success: true, 
      message: '投票成功，ZKP 憑證已更新',
      cost,
      power
    });
  } catch (error: any) {
    console.error('Village Vote Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
