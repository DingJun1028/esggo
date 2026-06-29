/**
 * POST /api/daily-report/generate
 * Body: { date?: "YYYY-MM-DD" }
 * Generates/regenerates a daily report
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDailyReportService } from '@/core/services/daily-report-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { date } = await req.json();
    const service = getDailyReportService();

    const targetDate = date ? new Date(date) : new Date();
    const report = await service.generateReport(targetDate);

    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
