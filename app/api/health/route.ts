import { jsonResponse } from '@/lib/api-utils';
import { CelestialController } from '@/lib/celestial/implementation';
import { getRedisHealth } from '@lib/redis/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const celestial = CelestialController.getInstance();
  celestial.initiateFlow('HealthCheck');
  const startTime = Date.now();

  // ── Redis Check ──
  let redisStatus: { connected: boolean; provider: string; keys: number; info?: string } = { connected: false, provider: 'unknown', keys: 0 };
  try {
    redisStatus = await getRedisHealth();
  } catch (e) {
    redisStatus = { connected: false, provider: 'error', keys: 0, info: (e as Error).message };
  }

  // ── AGNES API Check ──
  let agnesStatus = 'unavailable';
  try {
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;
    agnesStatus = (hasOpenRouter || hasGroq) ? 'configured' : 'missing_keys';
  } catch {
    agnesStatus = 'error';
  }

  // ── Firebase Admin Check ──
  let firebaseStatus = 'unavailable';
  try {
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const hasProjectId = !!(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
    firebaseStatus = (hasServiceAccount || hasProjectId) ? 'configured' : 'missing_config';
  } catch {
    firebaseStatus = 'error';
  }

  // ── ESGSonar Gateway Check ──
  let sonnarStatus = 'unavailable';
  try {
    const gatewayRes = await fetch('http://localhost:8642/health', {
      signal: AbortSignal.timeout(2000),
    });
    if (gatewayRes.ok) sonnarStatus = 'healthy';
  } catch {}

  // ── Compute overall status ──
  const elapsed = Date.now() - startTime;
  const allComponents = {
    redis: redisStatus.connected ? 'healthy' : `fallback (${redisStatus.provider})`,
    agnes_api: agnesStatus,
    firebase_admin: firebaseStatus,
    celestial_flow: 'active',
    esgsonar_gateway: sonnarStatus === 'healthy' ? 'healthy' : 'unavailable',
  };

  const isHealthy = redisStatus.connected && agnesStatus === 'configured' && firebaseStatus === 'configured';

  celestial.recordMetric('HealthCheck.Success', 1, { components: allComponents });

  return jsonResponse({
    app: 'esggo-v5',
    version: '5.1.0',
    status: isHealthy ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    responseMs: elapsed,
    components: allComponents,
  }, 200);
}
