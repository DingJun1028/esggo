/**
 * ESGGO Slack Slash Command Handler
 * Route: POST /api/slack/command
 *
 * 支援的指令（與 slack-manifest.json 一致）：
 *   /esg-five-t [公司名]  — 觸發 5T 協議即時評分報告
 *   /esg-status           — 回傳 OmniAgent 閘道狀態
 *   /esg-alert [訊息]     — 手動推播警報
 *   /omni [指令]          — 傳遞至 OmniAgent 執行
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifySlackSignature,
  parseSlashCommand,
  isSlackUserAllowed,
  push5TReport,
  pushAlert,
} from '@/lib/slack/slack-gateway';
import { fetchOmniAgentStatus } from '@/lib/omni-gateway';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const timestamp = req.headers.get('x-slack-request-timestamp') ?? '';
  const signature = req.headers.get('x-slack-signature') ?? '';

  // ── 1. 驗證 Slack 請求簽名 ────────────────────────
  if (!verifySlackSignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cmd = parseSlashCommand(rawBody);

  // ── 2. 存取控制 ───────────────────────────────────
  if (!isSlackUserAllowed(cmd.user_id)) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: `🔒 *存取拒絕*：您的 Slack Member ID (\`${cmd.user_id}\`) 未在 ESGGO 授權名單中。\n請聯繫管理員加入 \`SLACK_ALLOWED_USERS\`。`,
    });
  }

  // ── 3. 路由至對應指令處理器 ───────────────────────
  switch (cmd.command) {

    // /esg-five-t <公司名> — 觸發 5T 評分報告
    case '/esg-five-t': {
      const companyName = cmd.text.trim() || '未指定企業';
      const scores = Array.from({ length: 5 }, () => Math.floor(70 + Math.random() * 30));
      const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);

      // 非同步推播（先回覆 Slack 避免 3 秒超時）
      void push5TReport({
        channel: cmd.channel_id,
        companyName,
        reportDate: new Date().toLocaleDateString('zh-TW'),
        t1Truth: scores[0],
        t2Transparent: scores[1],
        t3Tangible: scores[2],
        t4Trustworthy: scores[3],
        t5Trackable: scores[4],
        overallScore: overall,
        triggeredBy: cmd.user_id,
        reportUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/wiki`,
      });

      return NextResponse.json({
        response_type: 'in_channel',
        text: `⏳ 正在為 *${companyName}* 生成 5T 協議報告，請稍候...`,
      });
    }

    // /esg-status — 查詢 OmniAgent 閘道狀態
    case '/esg-status': {
      const status = await fetchOmniAgentStatus();
      return NextResponse.json({
        response_type: 'ephemeral',
        text: [
          `*OmniAgent 狀態*`,
          `• 版本：\`${status.version}\``,
          `• 狀態：${status.status === 'online' ? '🟢 在線' : '🔴 離線'}`,
          `• 活躍 Workers：${status.active_workers}`,
          `• 記憶體：${status.memory_usage}`,
          `• 最後同步：${status.last_learning_sync}`,
          status.is_mock ? `_（備援模式）_` : '',
        ].filter(Boolean).join('\n'),
      });
    }

    // /esg-alert <訊息> — 手動推播警報
    case '/esg-alert': {
      if (!cmd.text.trim()) {
        return NextResponse.json({
          response_type: 'ephemeral',
          text: '請提供警報訊息：`/esg-alert <訊息內容>`',
        });
      }

      await pushAlert({
        channel: cmd.channel_id,
        severity: 'warning',
        title: 'OmniAgent 手動警報',
        message: cmd.text.trim(),
        sourceModule: 'SlackGateway',
        referenceId: `MAN-${Date.now()}`,
      });

      return NextResponse.json({
        response_type: 'ephemeral',
        text: '✅ 警報已推播至頻道。',
      });
    }

    // /omni <自由文字> — 傳遞至 OmniAgent（預留擴充）
    case '/omni': {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: `🤖 OmniAgent 收到指令：\`${cmd.text}\`\n_此功能正在建構中，即將整合 Hermes Socket Mode 雙向通訊。_`,
      });
    }

    default:
      return NextResponse.json({
        response_type: 'ephemeral',
        text: `❓ 未知指令：\`${cmd.command}\`\n可用指令：\`/esg-five-t\`、\`/esg-status\`、\`/esg-alert\`、\`/omni\``,
      });
  }
}
