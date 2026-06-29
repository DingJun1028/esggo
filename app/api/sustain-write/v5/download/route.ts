import { NextRequest, NextResponse } from 'next/server';
import { generateV5Report, reportV5ToHtml, reportV5ToMarkdown } from '@/core/services/report-generator-v5';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');
  const format = searchParams.get('format') || 'html';

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  try {
    const report = generateV5Report(companyId);
    if (!report) {
      return NextResponse.json({ error: 'Report could not be generated' }, { status: 404 });
    }

    if (format === 'md' || format === 'markdown') {
      const mdContent = reportV5ToMarkdown(report);
      return new NextResponse(mdContent, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="ESG_Report_${companyId}.md"`,
        },
      });
    }

    // Default to HTML
    const htmlContent = reportV5ToHtml(report);
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="ESG_Report_${companyId}.html"`,
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
