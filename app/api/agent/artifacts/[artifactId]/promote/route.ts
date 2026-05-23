import { NextRequest, NextResponse } from 'next/server';
import { promoteToTrustLayer } from '../../../../../../lib/agent/orchestrator';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ artifactId: string }> }
) {
  try {
    const { artifactId } = await params;
    const body = await req.json();
    const { currentReviewStatus, actorId } = body;

    if (currentReviewStatus !== 'approved') {
      return NextResponse.json({
        error: '只有已審核通過 (approved) 的草稿才可提升為正式態',
        ok: false,
      }, { status: 400 });
    }

    // 深貫廣通：呼叫實時雜湊鎖定引擎
    const seal = await promoteToTrustLayer(artifactId, actorId || 'user_001');

    return NextResponse.json({
      artifactId: artifactId,
      reviewStatus: 'promoted',
      promotedAt: seal.timestamp,
      hashLock: seal.hash,
      ok: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}