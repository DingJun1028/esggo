/**
 * POST /api/omni-agent/execute
 * OmniAgent 統一執行入口
 * 外部（Gateway/Telegram）可透過此端點觸發 5T 報告組裝
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { action, companyId } = await req.json();

  // Lazy import to avoid loading 22MB repository at module init
  const { OmniAgent } = await import('@/lib/omni-agent/index');
  const { generateV5Report } = await import('@/core/services/report-generator-v5');

  const agent = OmniAgent.getInstance();

  switch (action) {
    case 'assemble': {
      if (!companyId) {
        return NextResponse.json({ error: 'companyId required' }, { status: 400 });
      }
      const report = generateV5Report(companyId);
      if (!report) {
        return NextResponse.json({ error: 'Company not found or no data' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        report: {
          companyName: report.companyName,
          totalWords: report.totalWords,
          totalChapters: report.chapters.length,
          trinityHash: report.trinityHash,
          fiveTStatus: report.fiveTStatus,
        },
      });
    }

    case 'status': {
      return NextResponse.json({
        agent: { status: agent.getStatus() },
        timestamp: Date.now(),
      });
    }

    case 'evolve': {
      agent.reset();
      return NextResponse.json({
        success: true,
        message: 'Agent evolution triggered',
        status: agent.getStatus(),
      });
    }

    default: {
      return NextResponse.json({
        error: 'Unknown action',
        availableActions: ['assemble', 'status', 'evolve'],
      }, { status: 400 });
    }
  }
}

export async function GET() {
  const { OmniAgent } = await import('@/lib/omni-agent/index');
  return NextResponse.json({
    name: 'ESGGO OmniAgent API',
    version: '2.0.0',
    status: OmniAgent.getInstance().getStatus(),
    endpoints: {
      execute: 'POST /api/omni-agent/execute { action, companyId }',
      status: 'GET /api/omni-agent/execute',
    },
  });
}
