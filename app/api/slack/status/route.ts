/**
 * GET /api/slack/status
 * 回傳 Slack Gateway 設定狀態（是否有 Token）
 */
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const configured = !!(
    process.env.SLACK_BOT_TOKEN &&
    process.env.SLACK_SIGNING_SECRET &&
    process.env.SLACK_ALLOWED_USERS &&
    process.env.SLACK_HOME_CHANNEL
  );

  return NextResponse.json({
    configured,
    hasToken: !!process.env.SLACK_BOT_TOKEN,
    hasChannel: !!process.env.SLACK_HOME_CHANNEL,
    version: '1.0.0',
  });
}
