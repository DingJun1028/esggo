// ═══════════════════════════════════════════════════════════════
// /api/health — Unified Health Endpoint
// Uses @esggo/shared/health protocol
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { runHealthChecks } from '@esggo/shared/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await runHealthChecks();

  return NextResponse.json(health, {
    status: health.status === 'unhealthy' ? 503 : 200,
  });
}
