import { jsonResponse } from '@lib/api-utils';
import { CelestialController } from '@/lib/celestial/implementation';
import { getRedisHealth } from '@lib/redis/client';
import os from 'os';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'metrics') {
    const cpu = os.loadavg()[0];
    const mem = process.memoryUsage();
    const now = new Date().toISOString();
    const body = `# HELP esggo_up Service is up.
# TYPE esggo_up gauge
esggo_up{service="esggo-core"} 1

# HELP esggo_process_memory_bytes Node memory usage for esggo-core.
# TYPE esggo_process_memory_bytes gauge
esggo_process_memory_bytes{type="rss"} ${mem.rss}
esggo_process_memory_bytes{type="heapTotal"} ${mem.heapTotal}
esggo_process_memory_bytes{type="heapUsed"} ${mem.heapUsed}

# HELP esggo_build_info Build information.
# TYPE esggo_build_info gauge
esggo_build_info{timestamp="${now}"} 1
`;
    return new NextResponse(body, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; version=0.0.4' },
    });
  }

  const celestial = CelestialController.getInstance();
  celestial.initiateFlow('HealthCheck');
  const startTime = Date.now();

  let redisStatus: { connected: boolean; provider: string; keys: number; info?: string } = { connected: false, provider: 'unknown', keys: 0 };
  try { redisStatus = await getRedisHealth(); } catch (e) { redisStatus = { connected: false, provider: 'error', keys: 0, info: (e as Error).message }; }

  let agnesStatus = 'unavailable';
  try { agnesStatus = (!!process.env.OPENROUTER_API_KEY || !!process.env.GROQ_API_KEY) ? 'configured' : 'missing_keys'; } catch { agnesStatus = 'error'; }

  let firebaseStatus = 'unavailable';
  try { firebaseStatus = (!!process.env.FIREBASE_SERVICE_ACCOUNT_JSON || !!(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID)) ? 'configured' : 'missing_config'; } catch { firebaseStatus = 'error'; }

  let sonnarStatus = 'unavailable';
  try { const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8642'; const gatewayRes = await fetch(`${gatewayUrl}/health`, { signal: AbortSignal.timeout(2000) }); if (gatewayRes.ok) sonnarStatus = 'healthy'; } catch {}

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
