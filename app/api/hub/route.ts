// app/api/hub/route.ts
// 萬能中心 API — 統一入口

import { NextRequest, NextResponse } from 'next/server';
import { OmniHub } from '@/lib/omni-hub';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  await OmniHub.init();

  switch (action) {
    case 'stats':
      return NextResponse.json(OmniHub.getStats());

    case 'facilities':
      return NextResponse.json(OmniHub.getAllFacilities());

    case 'facility': {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const facility = OmniHub.getFacility(id);
      if (!facility) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(facility);
    }

    case 'memories': {
      const agentId = searchParams.get('agentId') || undefined;
      const type = searchParams.get('type') || undefined;
      const memories = await OmniHub.getSharedMemories({ agentId, type });
      return NextResponse.json(memories || []);
    }

    case 'tasks': {
      const status = searchParams.get('status') || undefined;
      return NextResponse.json(OmniHub.getTasks({ status }));
    }

    case 'search': {
      const q = searchParams.get('q');
      if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });
      return NextResponse.json(OmniHub.memory.search(q));
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  await OmniHub.init();

  switch (action) {
    case 'register':
      await OmniHub.registerFacility(body.facility);
      return NextResponse.json({ success: true });

    case 'status': {
      const { id, status } = body;
      await OmniHub.updateFacilityStatus(id, status);
      return NextResponse.json({ success: true });
    }

    case 'memory':
      const entry = await OmniHub.shareMemory(body.entry);
      return NextResponse.json(entry);

    case 'task':
      const task = await OmniHub.createTask(body.task);
      return NextResponse.json(task);

    case 'complete': {
      const { taskId, output } = body;
      await OmniHub.completeTask(taskId, output);
      return NextResponse.json({ success: true });
    }

    case 'message':
      await OmniHub.sendMessage(body.message);
      return NextResponse.json({ success: true });

    case 'heartbeat': {
      const { agentId } = body;
      await OmniHub.heartbeat(agentId);
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
