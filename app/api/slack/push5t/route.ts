/**
 * POST /api/slack/push5t
 * 從 Dashboard 手動觸發 5T 報告推播至 Slack
 *
 * Body: { companyName: string, channel?: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { push5TReport } from '@/lib/slack/slack-gateway';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { companyName, channel } = await req.json() as {
      companyName?: string;
      channel?: string;
    };

    if (!companyName?.trim()) {
      return NextResponse.json({ ok: false, error: '缺少 companyName' }, { status: 400 });
    }

    // 生成模擬 5T 分數（正式環境可從 Supabase vault_omni_core 查詢）
    const scores = Array.from({ length: 5 }, () =>
      Math.floor(65 + Math.random() * 35)
    );
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
    const targetChannel = channel || process.env.SLACK_HOME_CHANNEL || '';

    await push5TReport({
      channel: targetChannel,
      companyName: companyName.trim(),
      reportDate: new Date().toLocaleDateString('zh-TW'),
      t1Truth: scores[0],
      t2Transparent: scores[1],
      t3Tangible: scores[2],
      t4Trustworthy: scores[3],
      t5Trackable: scores[4],
      overallScore,
      reportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/wiki`,
    });

    return NextResponse.json({
      ok: true,
      overallScore,
      channel: targetChannel,
      companyName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '推播失敗';
    console.error('[push5t]', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
