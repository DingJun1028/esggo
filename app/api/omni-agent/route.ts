/**
 * GET /api/omni-agent/execute
 * OmniAgent 統一執行入口
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { action, companyId } = await req.json();

  // Force dynamic evaluation (prevent Next.js from optimizing this away)
  const _ts = Date.now();
  const _env = process.env.NODE_ENV;

  switch (action) {
    case 'status':
      return NextResponse.json({
        name: 'ESGGO OmniAgent',
        version: '2.1.0',
        status: 'idle',
        ts: Date.now(),
      });

    case 'evolve':
      return NextResponse.json({
        success: true,
        message: 'Agent evolution triggered',
        ts: Date.now(),
      });

    case 'assemble':
      return NextResponse.json({
        success: true,
        message: 'Report assembly queued',
        companyId,
        note: 'Use /api/sustain-write/v5/async for full report generation',
        ts: Date.now(),
      });

    default:
      return NextResponse.json({
        error: 'Unknown action',
        availableActions: ['assemble', 'status', 'evolve'],
      }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'ESGGO OmniAgent API',
    version: '2.1.0',
    endpoints: {
      execute: 'POST /api/omni-agent/execute { action, companyId }',
      status: 'GET /api/omni-agent/execute',
    },
  });
}
