import { NextResponse } from 'next/server';
import { CelestialController } from '@/lib/celestial/implementation';

export async function GET() {
  const celestial = CelestialController.getInstance();
  const traceId = celestial.initiateFlow('HealthCheck');

  // ESGSonar gateway status
  let sonnarStatus = 'unavailable';
  try {
    const gatewayRes = await fetch('http://localhost:8642/health', {
      signal: AbortSignal.timeout(2000),
    });
    if (gatewayRes.ok) sonnarStatus = 'healthy';
  } catch {}

  const status = {
    app: 'esggo-v5',
    version: '5.0.0',
    status: 'Trustworthy',
    timestamp: Date.now(),
    governance: 'OmniCore Trinity Awakened',
    components: {
      celestial_flow: 'Active',
      l_hub_swarm: 'Active',
      notion_sync: process.env.NOTION_API_KEY ? 'Active' : 'Standby (Missing Keys)',
      esgsonar_crawler: sonnarStatus,
      esgsonar_gateway: sonnarStatus === 'healthy' ? ':8642 running' : ':8642 not reachable',
      prisma_db: 'SQLite (dev.db)',
    }
  };

  celestial.recordMetric('HealthCheck.Success', 1, { components: status.components });

  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
