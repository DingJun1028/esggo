import { NextResponse } from 'next/server';
import { OmniAgentBus } from '@/lib/agents/omni-agent-bus';

export async function POST(req: Request) {
  try {
    const { action, intervalMs } = await req.json();
    const bus = OmniAgentBus.getInstance();

    if (action === 'start') {
      const ms = intervalMs || 60000;
      bus.startAutonomy(ms);
      return NextResponse.json({ status: 'success', message: `Autonomy started with interval ${ms}ms` });
    } else if (action === 'stop') {
      bus.stopAutonomy();
      return NextResponse.json({ status: 'success', message: 'Autonomy stopped' });
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid action. Use "start" or "stop".' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
