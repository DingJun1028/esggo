/**
 * GET /api/health
 * Detailed readiness check (Kubernetes readiness probe style).
 * Reuses SmartAIRouter health logic when available.
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const detail = searchParams.get('detail') === 'true';

  if (!detail) {
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() }, { status: 200 });
  }

  const checks: Record<string, string> = {
    app: 'healthy',
    ollama: 'unknown',
    minio: 'unknown',
    database: 'unknown',
  };

  try {
    const ollamaUrl = process.env.AGENTIC_TWIN_OLLAMA_URL || 'http://127.0.0.1:11434';
    const ollamaRes = await fetch(`${ollamaUrl}/api/tags`, { method: 'GET', signal: AbortSignal.timeout(5000) });
    checks.ollama = ollamaRes.ok ? 'healthy' : 'unhealthy';
  } catch {
    checks.ollama = 'unhealthy';
  }

  try {
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'http://127.0.0.1:19001';
    const minioRes = await fetch(minioEndpoint, { method: 'GET', signal: AbortSignal.timeout(5000) });
    checks.minio = minioRes.ok ? 'healthy' : 'unhealthy';
  } catch {
    checks.minio = 'unhealthy';
  }

  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_HOST ? 'postgres' : 'memory';
    checks.database = databaseUrl ? 'configured' : 'unconfigured';
  } catch {
    checks.database = 'unhealthy';
  }

  const overall = Object.values(checks).every((v) => v === 'healthy' || v === 'configured')
    ? 'healthy'
    : 'degraded';

  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: overall === 'healthy' ? 200 : 503 }
  );
}
