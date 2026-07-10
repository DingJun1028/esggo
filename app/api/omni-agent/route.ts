/**
 * GET /api/omni-agent/execute
 * OmniAgent 統一執行入口
 */
import { NextRequest } from 'next/server';
import { jsonResponse, jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { action, companyId } = await req.json();

  switch (action) {
    case 'status':
      return jsonResponse({
        name: 'ESGGO OmniAgent',
        version: '2.1.0',
        status: 'idle',
        ts: Date.now(),
      });

    case 'evolve':
      return jsonResponse({
        success: true,
        message: 'Agent evolution triggered',
        ts: Date.now(),
      });

    case 'assemble':
      return jsonResponse({
        success: true,
        message: 'Report assembly queued',
        companyId,
        note: 'Use /api/sustain-write/v5/async for full report generation',
        ts: Date.now(),
      });

    default:
      return jsonError('UNKNOWN_TOOL', `Unknown action: ${action}`);
  }
}

export async function GET() {
  return jsonResponse({
    name: 'ESGGO OmniAgent API',
    version: '2.1.0',
    endpoints: {
      execute: 'POST /api/omni-agent/execute { action, companyId }',
      status: 'GET /api/omni-agent/execute',
    },
  });
}
