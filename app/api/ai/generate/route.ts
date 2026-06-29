// ============================================================
// AI Report Generation API
// POST /api/ai/generate
// GET  /api/ai/generate (usage info)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { generateAIReport, ReportRequest, ReportSection } from '../../../../src/core/ai/report-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;  // 2 min timeout

const VALID_SECTIONS: ReportSection[] = [
  'executive_summary', 'climate_strategy', 'carbon_roadmap',
  'social_impact', 'governance', 'risk_assessment',
  'opportunities', 'kpi_dashboard', 'stakeholder_engagement',
  'supply_chain',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, industry, year, sections, language, data } = body as ReportRequest;

    // Validate required fields
    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'companyName is required' },
        { status: 400 }
      );
    }
    if (!industry) {
      return NextResponse.json(
        { success: false, error: 'industry is required' },
        { status: 400 }
      );
    }

    // Validate sections
    const requestedSections: ReportSection[] = sections || [
      'executive_summary', 'climate_strategy', 'carbon_roadmap',
      'social_impact', 'governance',
    ];

    for (const s of requestedSections) {
      if (!VALID_SECTIONS.includes(s)) {
        return NextResponse.json(
          { success: false, error: `Invalid section: ${s}. Valid: ${VALID_SECTIONS.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Generate report
    const result = await generateAIReport({
      companyName,
      industry,
      year: year || '2024',
      sections: requestedSections,
      language: language || 'zh-TW',
      data,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        reportId: null,
        companyName,
        sections: result.sections.map(s => ({
          id: s.id,
          title: s.title,
          content: s.content,
          wordCount: s.wordCount,
          model: s.model,
          duration: s.duration,
        })),
        metadata: result.metadata,
      },
    });
  } catch (error: any) {
    console.error('[AI Report API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      usage: 'POST JSON with { companyName, industry, year?, sections?, language?, data? }',
      sections: VALID_SECTIONS,
      models: 'OpenRouter :free tier (round-robin: Gemma, Llama, Qwen)',
      rateLimit: '200 req/day (OpenRouter free tier)',
      content: 'Report data is generated progressively. Returns when all sections complete.',
    },
  });
}
