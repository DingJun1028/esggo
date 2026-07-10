/**
 * ESGGO C版專業永續報告 — SSE API
 */

import { NextRequest, NextResponse } from 'next/server';
import { assembleCVersionReport, reportToHtml, reportToMarkdown, getAvailableCompanies } from '@/lib/sustain-write';
import { jsonResponse, jsonError } from '@/lib/api-utils';
import type { ReportChapter } from '@/lib/sustain-write/omni-tag';

interface CVersionReport {
  companyId: string;
  companyName: string;
  version: string;
  totalWords: number;
  fiveTStatus?: string;
  chapters: ReportChapter[];
  generatedAt: string;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  return jsonResponse({
    success: true,
    companies: getAvailableCompanies(),
    version: 'C版 v3.7',
    protocol: '5T 真善美信通',
    omniTag: 'enabled',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, format = 'html' } = body;

    if (!companyId) {
      return jsonError('INVALID_PARAMS', '缺少 companyId 參數', 400);
    }

    const report = assembleCVersionReport(companyId) as CVersionReport | null;

    if (!report) {
      return NextResponse.json(
        { success: false, error: '找不到公司或無填答資料', companyId },
        { status: 404 }
      );
    }

    if (format === 'markdown') {
      return jsonResponse({
        success: true,
        report: {
          companyId: report.companyId,
          companyName: report.companyName,
          totalWords: report.totalWords,
          fiveTStatus: report.fiveTStatus,
          chapters: report.chapters.map((ch: ReportChapter) => ({
            id: ch.id,
            title: ch.title,
            fiveTGate: ch.fiveTGate,
            wordCount: ch.wordCount,
            content: ch.content,
          })),
          generatedAt: report.generatedAt,
        },
        markdown: reportToMarkdown(report),
      });
    }

    return jsonResponse({
      success: true,
      report: {
        companyId: report.companyId,
        companyName: report.companyName,
        totalWords: report.totalWords,
        fiveTStatus: report.fiveTStatus,
        chapters: report.chapters.map((ch: ReportChapter) => ({
          id: ch.id,
          title: ch.title,
          fiveTGate: ch.fiveTGate,
          wordCount: ch.wordCount,
          content: ch.content,
        })),
        generatedAt: report.generatedAt,
      },
      html: reportToHtml(report),
    });
  } catch (error) {
    return jsonError('INTERNAL_ERROR', (error as Error).message || '報告生成失敗', 500);
  }
}
