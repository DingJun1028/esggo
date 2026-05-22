import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ artifactId: string }> }
) {
  try {
    const body = await req.json();
    const { action, reviewNote, reviewerId } = body;

    if (!['approve', 'reject', 'request_changes'].includes(action)) {
      return NextResponse.json({ error: '無效的審核動作' }, { status: 400 });
    }

    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      request_changes: 'awaiting_review',
    };

    const { artifactId } = await params;
    return NextResponse.json({
      artifactId: artifactId,
      reviewStatus: statusMap[action],
      reviewNote,
      reviewerId: reviewerId ?? 'reviewer_001',
      reviewedAt: new Date().toISOString(),
      ok: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}