// ═══════════════════════════════════════════════════════════════
// /api/healthz — Lightweight Health Check (Docker/LB/CI)
// Uses @esggo/shared/health protocol (lightweight mode)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getConfig, checkConfig } from '@esggo/shared/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const config = getConfig();

  // Lightweight checks (no external calls for Docker healthcheck)
  const checks = {
    database: checkConfig('database'),
    redis: checkConfig('redis'),
    firebase: checkConfig('firebase'),
    ai: checkConfig('ai'),
  };

  // Determine overall status
  const configuredCount = Object.values(checks).filter(c => c.configured).length;
  const totalCount = Object.keys(checks).length;

  let status: 'ok' | 'degraded' | 'error';
  if (configuredCount === totalCount) {
    status = 'ok';
  } else if (configuredCount >= totalCount / 2) {
    status = 'degraded';
  } else {
    status = 'error';
  }

  const response = {
    status,
    version: '5.1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.app.nodeEnv,
    checks: Object.entries(checks).map(([name, check]) => ({
      name,
      status: check.configured ? 'ok' as const : 'warn' as const,
      message: check.configured ? undefined : `Missing: ${check.missing.join(', ')}`,
    })),
  };

  return NextResponse.json(response, {
    status: status === 'error' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}
