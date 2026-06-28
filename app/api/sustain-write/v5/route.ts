// app/api/sustain-write/v5/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateV5Report, reportV5ToHtml, reportV5ToMarkdown, getV5Companies } from '@/core/services/report-generator-v5';
import { generateFullV5Report, fullReportToHtml } from '@/core/services/report-generator-v5-full';

export async function GET() {
  const companies = getV5Companies();
  return NextResponse.json({ version: '5.0', companies, totalChapters: 28 });
}

export async function POST(req: NextRequest) {
  const { companyId, format = 'json', mode = 'standard', brandTone = 'professional' } = await req.json();

  if (mode === 'full') {
    const report = await generateFullV5Report(companyId, brandTone);
    if (!report) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    if (format === 'html') {
      return new NextResponse(fullReportToHtml(report), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    return NextResponse.json(report);
  }

  const report = generateV5Report(companyId);
  if (!report) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

  if (format === 'html') {
    return new NextResponse(reportV5ToHtml(report), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
  if (format === 'markdown') {
    return new NextResponse(reportV5ToMarkdown(report), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
  return NextResponse.json(report);
}
