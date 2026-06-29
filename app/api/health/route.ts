import { NextResponse } from 'next/server';
import { CelestialController } from '@/lib/celestial/implementation';

export async function GET() {
  const celestial = CelestialController.getInstance();
  const traceId = celestial.initiateFlow('HealthCheck');

  const status = {
    app: 'esggo-v5',
    version: '5.0.0',
    status: 'Trustworthy',
    timestamp: Date.now(),
    governance: 'OmniCore Trinity Awakened',
    components: {
      celestial_flow: 'Active',
      l_hub_swarm: 'Active',
      notion_sync: process.env.NOTION_API_KEY ? 'Active' : 'Standby (Missing Keys)'
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
