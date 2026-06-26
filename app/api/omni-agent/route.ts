/**
 * POST /api/omni-agent/execute
 * OmniAgent 統一執行入口
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, companyId } = await req.json();

    // Dynamic import to avoid startup issues with large repos
    const agentMod = await import('../../../src/lib/omni-agent/index');
    const reportMod = await import('../../../src/core/services/report-generator-v5');

    const agent = agentMod.OmniAgent.getInstance();

    switch (action) {
      case 'assemble': {
        if (!companyId) {
          return NextResponse.json({ error: 'companyId required' }, { status: 400 });
        }
        const report = reportMod.generateV5Report(companyId);
        if (!report) {
          return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          report: {
            companyName: report.companyName,
            totalWords: report.totalWords,
            totalChapters: report.chapters.length,
            trinityHash: report.trinityHash,
          },
        });
      }
      case 'status': {
        return NextResponse.json({ agent: { status: agent.getStatus() }, ts: Date.now() });
      }
      case 'evolve': {
        agent.reset();
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ name: 'ESGGO OmniAgent', version: '2.0.0' });
}
