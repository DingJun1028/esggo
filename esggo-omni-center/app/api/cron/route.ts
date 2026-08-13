/**
 * GET /api/cron/status — list all cron jobs + last run time
 * POST /api/cron/run — manually trigger a job {job: 'daily-report' | 'achievement-check' | 'crawler-trigger'}
 */

import { NextRequest, NextResponse } from 'next/server';
import { jsonError, jsonResponse } from '@lib/api-utils';

/**
 * 認證守門：cron 手動觸發端點僅供內部排程或持有 CRON_SECRET 的服務呼叫。
 * 對齊倉庫令牌式慣例（參見 app/api/omni/sync/route.ts 的 GATEWAY_API_KEY 比對）。
 */
function assertCronAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get('x-cron-secret') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  // 已配置密鑰時：必須相符
  if (secret) {
    if (!provided || provided !== secret) {
      return jsonError('UNAUTHORIZED', 'Invalid or missing cron secret', 401);
    }
    return null;
  }
  // 未配置密鑰（本地/dev）：退回內部使用者上下文（由 middleware 設 x-user-id）
  if (!req.headers.get('x-user-id')) {
    return jsonError('UNAUTHORIZED', 'Authentication required', 401);
  }
  return null;
}

export async function GET() {
  return jsonResponse({
    success: true,
    data: {
      jobs: [
        { name: 'daily-report', interval: '24h', description: '每日永續觀察者日報生成' },
        { name: 'achievement-check', interval: '1h', description: '用戶成就/階級檢查' },
        { name: 'crawler-trigger', interval: '6h', description: 'ESG 爬蟲觸發' },
      ],
    },
    metadata: { timestamp: Date.now(), provider: 'cron-scheduler' },
  });
}

export async function POST(req: NextRequest) {
  const authErr = assertCronAuth(req);
  if (authErr) return authErr;
  try {
    const body = await req.json();
    const { job } = body;

    // Dynamically import to avoid server-only code issues
    const { generateDailyReportJob, checkUserAchievements } = await import('@/lib/cron-jobs');

    switch (job) {
      case 'daily-report': {
        const result = await generateDailyReportJob();
        return jsonResponse({ success: result.success, data: result });
      }
      case 'achievement-check': {
        const result = await checkUserAchievements();
        return jsonResponse(result);
      }
      default:
        return jsonError('INVALID_ACTION', `Unknown job: ${job}`);
    }
  } catch (error) {
    // 5T Transparent: 不向客戶端洩漏內部錯誤訊息
    console.error('[cron] POST failed:', error);
    return jsonError('INTERNAL_ERROR');
  }
}
