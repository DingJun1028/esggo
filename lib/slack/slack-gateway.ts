/**
 * ESGGO 善向永續 | Slack OmniAgent Gateway
 * ─────────────────────────────────────────────────────
 * Slack Socket Mode 整合閘道 (Hermes-compatible)
 *
 * 採用 Slack Web API (REST) 模式呼叫，適用於 Next.js API Routes
 * 無需安裝 @slack/bolt (避免 Node.js 伺服器依賴衝突)
 *
 * 功能：
 *   1. 推播 5T 報告通知 (push5TReport)
 *   2. 推播 OmniAgent 任務完成摘要 (pushAgentSummary)
 *   3. 推播警報 / 合規異常 (pushAlert)
 *   4. 驗證 Slack 簽名 (verifySlackSignature)
 *   5. 解析 Slash Command 請求 (parseSlashCommand)
 */

import crypto from 'crypto';

// ─── 環境變數 ────────────────────────────────────────
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN ?? '';
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET ?? '';
const SLACK_HOME_CHANNEL = process.env.SLACK_HOME_CHANNEL ?? '';
const SLACK_ALLOWED_USERS = (process.env.SLACK_ALLOWED_USERS ?? '')
  .split(',')
  .map(u => u.trim())
  .filter(Boolean);

const SLACK_API = 'https://slack.com/api';

// ─── 型別定義 ─────────────────────────────────────────
export interface SlackPostMessagePayload {
  channel: string;
  text?: string;
  blocks?: SlackBlock[];
  thread_ts?: string;
}

export interface SlackBlock {
  type: string;
  [key: string]: unknown;
}

export interface SlackSlashCommand {
  command: string;        // e.g. "/5t"
  text: string;           // 指令後的文字
  user_id: string;        // Slack Member ID
  channel_id: string;
  response_url: string;
}

export interface Slack5TReportPayload {
  channel?: string;       // 預設使用 SLACK_HOME_CHANNEL
  companyName: string;
  reportDate: string;
  t1Truth: number;        // 0–100 分
  t2Transparent: number;
  t3Tangible: number;
  t4Trustworthy: number;
  t5Trackable: number;
  overallScore: number;
  reportUrl?: string;
  triggeredBy?: string;   // 觸發者 Slack Member ID
}

export interface SlackAlertPayload {
  channel?: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  sourceModule?: string;
  referenceId?: string;
}

// ─── 核心工具函式 ─────────────────────────────────────

/**
 * 呼叫 Slack Web API
 */
async function callSlackAPI<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  if (!SLACK_BOT_TOKEN) {
    throw new Error('[SlackGateway] SLACK_BOT_TOKEN 未設定，請在 .env 中加入。');
  }

  const res = await fetch(`${SLACK_API}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`[SlackGateway] HTTP 錯誤 ${res.status} on ${method}`);
  }

  const data = await res.json() as { ok: boolean; error?: string } & T;
  if (!data.ok) {
    throw new Error(`[SlackGateway] Slack API 錯誤: ${data.error} (method: ${method})`);
  }
  return data;
}

// ─── 1. 推播 5T 報告通知 ─────────────────────────────

/**
 * 將 5T 評分報告以 Block Kit 格式推播至 Slack 頻道
 */
export async function push5TReport(payload: Slack5TReportPayload): Promise<void> {
  const channel = payload.channel || SLACK_HOME_CHANNEL;
  if (!channel) throw new Error('[SlackGateway] 未指定推播頻道，請設定 SLACK_HOME_CHANNEL。');

  const score = payload.overallScore;
  const scoreEmoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
  const mentionText = payload.triggeredBy ? `<@${payload.triggeredBy}>` : 'OmniAgent';

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${scoreEmoji} 5T 協議報告 | ${payload.companyName}`,
        emoji: true,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `📅 ${payload.reportDate}　｜　觸發者：${mentionText}　｜　ESG GO 善向永續`,
        },
      ],
    },
    { type: 'divider' },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*T1 真 (Truth / 可溯源)*\n${_scoreBar(payload.t1Truth)} ${payload.t1Truth}分` },
        { type: 'mrkdwn', text: `*T2 善 (Transparent / 可透明)*\n${_scoreBar(payload.t2Transparent)} ${payload.t2Transparent}分` },
        { type: 'mrkdwn', text: `*T3 美 (Tangible / 可感知)*\n${_scoreBar(payload.t3Tangible)} ${payload.t3Tangible}分` },
        { type: 'mrkdwn', text: `*T4 信 (Trustworthy / 不可篡改)*\n${_scoreBar(payload.t4Trustworthy)} ${payload.t4Trustworthy}分` },
        { type: 'mrkdwn', text: `*T5 通 (Trackable / 可追蹤)*\n${_scoreBar(payload.t5Trackable)} ${payload.t5Trackable}分` },
        { type: 'mrkdwn', text: `*綜合評分*\n${scoreEmoji} *${score} / 100*` },
      ],
    },
    ...(payload.reportUrl ? [{
      type: 'actions',
      elements: [{
        type: 'button',
        text: { type: 'plain_text', text: '📄 查看完整報告', emoji: true },
        url: payload.reportUrl,
        style: 'primary',
      }],
    }] : []),
  ];

  await callSlackAPI('chat.postMessage', { channel, blocks, text: `5T 協議報告：${payload.companyName} (${score}/100)` });
}

// ─── 2. 推播 OmniAgent 任務摘要 ──────────────────────

export interface SlackAgentSummaryPayload {
  channel?: string;
  taskId: string;
  taskTitle: string;
  status: 'completed' | 'failed' | 'partial';
  duration: string;       // e.g. "3.2s"
  agentName?: string;
  resultSummary: string;
  artifacts?: string[];   // 輸出物件名稱列表
}

/**
 * 推播代理蜂群任務執行摘要
 */
export async function pushAgentSummary(payload: SlackAgentSummaryPayload): Promise<void> {
  const channel = payload.channel || SLACK_HOME_CHANNEL;
  if (!channel) throw new Error('[SlackGateway] 未指定推播頻道');

  const statusIcon = payload.status === 'completed' ? '✅' : payload.status === 'failed' ? '❌' : '⚠️';
  const agentLabel = payload.agentName || 'OmniAgent';

  const blocks: SlackBlock[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${statusIcon} *${agentLabel}* 任務完成\n*${payload.taskTitle}*`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*任務 ID:*\n\`${payload.taskId}\`` },
        { type: 'mrkdwn', text: `*耗時:*\n${payload.duration}` },
      ],
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*執行摘要:*\n${payload.resultSummary}` },
    },
    ...(payload.artifacts && payload.artifacts.length > 0 ? [{
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `📎 輸出物件：${payload.artifacts.map(a => `\`${a}\``).join(', ')}`,
      }],
    }] : []),
  ];

  await callSlackAPI('chat.postMessage', { channel, blocks, text: `${statusIcon} ${agentLabel}: ${payload.taskTitle}` });
}

// ─── 3. 推播警報 / 合規異常 ──────────────────────────

/**
 * 推播系統警報至 Slack 頻道
 */
export async function pushAlert(payload: SlackAlertPayload): Promise<void> {
  const channel = payload.channel || SLACK_HOME_CHANNEL;
  if (!channel) throw new Error('[SlackGateway] 未指定推播頻道');

  const icons = { info: 'ℹ️', warning: '⚠️', critical: '🚨' };
  const colors = { info: '#06b6d4', warning: '#f59e0b', critical: '#ef4444' };

  const blocks: SlackBlock[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${icons[payload.severity]} *[${payload.severity.toUpperCase()}] ${payload.title}*\n${payload.message}`,
      },
    },
    ...(payload.sourceModule || payload.referenceId ? [{
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: [
          payload.sourceModule && `來源模組: \`${payload.sourceModule}\``,
          payload.referenceId && `參考 ID: \`${payload.referenceId}\``,
        ].filter(Boolean).join('　｜　'),
      }],
    }] : []),
  ];

  await callSlackAPI('chat.postMessage', { channel, blocks, text: `${icons[payload.severity]} ${payload.title}` });
}

// ─── 4. 安全性：驗證 Slack 請求簽名 ─────────────────

/**
 * 驗證 Slack 傳入的請求簽名，防止偽造請求
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
export function verifySlackSignature(
  body: string,
  timestamp: string,
  signature: string
): boolean {
  if (!SLACK_SIGNING_SECRET) {
    console.warn('[SlackGateway] SLACK_SIGNING_SECRET 未設定，跳過簽名驗證（僅限開發環境）');
    return process.env.NODE_ENV === 'development';
  }

  // 防止 replay attack：timestamp 不可超過 5 分鐘
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
    return false;
  }

  const sigBase = `v0:${timestamp}:${body}`;
  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET);
  hmac.update(sigBase);
  const expected = `v0=${hmac.digest('hex')}`;

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'utf8'),
    Buffer.from(signature, 'utf8')
  );
}

// ─── 5. 解析 Slash Command ───────────────────────────

/**
 * 解析 Slack Slash Command 的 URL-encoded body
 */
export function parseSlashCommand(rawBody: string): SlackSlashCommand {
  const params = new URLSearchParams(rawBody);
  return {
    command: params.get('command') ?? '',
    text: params.get('text') ?? '',
    user_id: params.get('user_id') ?? '',
    channel_id: params.get('channel_id') ?? '',
    response_url: params.get('response_url') ?? '',
  };
}

// ─── 6. 存取控制 ─────────────────────────────────────

/**
 * 驗證使用者是否在允許名單中
 */
export function isSlackUserAllowed(userId: string): boolean {
  if (SLACK_ALLOWED_USERS.length === 0) return false; // 預設拒絕
  return SLACK_ALLOWED_USERS.includes(userId);
}

// ─── 私有輔助函式 ─────────────────────────────────────

function _scoreBar(score: number): string {
  const filled = Math.round(score / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled);
}
