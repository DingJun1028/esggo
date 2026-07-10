/**
 * GET /api/cron/status — list all cron jobs + last run time
 * POST /api/cron/run — manually trigger a job {job: 'daily-report' | 'achievement-check' | 'crawler-trigger'}
 */

import { jsonError, jsonResponse } from '@/lib/api-utils';

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

export async function POST(req: Request) {
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
    return jsonError('INTERNAL_ERROR', (error as Error).message);
  }
}
