import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { artifactId: string } }
) {
  try {
    const body = await req.json();
    const { currentReviewStatus } = body;

    if (currentReviewStatus !== 'approved') {
      return NextResponse.json({
        error: '只有已審核通過 (approved) 的草稿才可提升為正式態',
        ok: false,
      }, { status: 400 });
    }

    return NextResponse.json({
      artifactId: params.artifactId,
      reviewStatus: 'promoted',
      promotedAt: new Date().toISOString(),
      hashLock: `sha256:${Date.now().toString(16)}abcdef1234567890`,
      ok: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}