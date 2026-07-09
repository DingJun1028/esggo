// app/api/omni/sync/route.ts
// ============================================================================
// ESGGO (Next.ts) <-> OmniAgent 雙向同步 — 串聯點
//   本路由讓 Next 應用推送自身狀態視圖給同步引擎 (apps/gateway/sync)。
//   認證：X-Omni-Token（與 v3 網關一致，requireAuth）。
//   僅接受 POST /api/omni/sync（ESGGO 自身狀態），不暴露拓撲給匿名者。
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';

const SYNC_URL = process.env.OMNI_SYNC_URL || 'http://127.0.0.1:8650';
const TOKEN = process.env.OMNI_KEY || process.env.GATEWAY_API_KEY || '';

interface AgentStateLite {
  agentId: string;
  name: string;
  host: string;
  channel: string;
  capabilities: string[];
  status: string;
  registeredAt: number;
  lastHeartbeat: number;
}

interface ESGGOStateLite {
  appVersion: string;
  buildId: string | null;
  activeWorkers: number;
  agents: AgentStateLite[];
  lastSyncAt: number;
}

/** 手動守衛（避免相依根 workspace 的 zod；Next 路由本身已有 TS 型別） */
function isAgent(v: unknown): v is AgentStateLite {
  if (typeof v !== 'object' || v === null) return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.agentId === 'string' &&
    typeof a.name === 'string' &&
    typeof a.host === 'string' &&
    typeof a.channel === 'string' &&
    Array.isArray(a.capabilities) &&
    typeof a.status === 'string' &&
    typeof a.registeredAt === 'number' &&
    typeof a.lastHeartbeat === 'number'
  );
}

function isESGGOState(v: unknown): v is ESGGOStateLite {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.appVersion === 'string' &&
    (s.buildId === null || typeof s.buildId === 'string') &&
    typeof s.activeWorkers === 'number' &&
    Array.isArray(s.agents) &&
    s.agents.every(isAgent) &&
    typeof s.lastSyncAt === 'number'
  );
}

export async function POST(req: NextRequest) {
  // 來源驗證：僅允許來自同步引擎或內部服務
  const t = (req.headers.get('x-omni-token') || '').replace('Bearer ', '');
  if (!TOKEN || !t || t !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  if (!isESGGOState(body)) {
    return NextResponse.json({ error: 'invalid esggo state envelope' }, { status: 400 });
  }

  // 轉發給同步引擎（loopback :8650）
  try {
    const r = await fetch(`${SYNC_URL}/sync/esggo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Omni-Token': TOKEN },
      body: JSON.stringify({
        v: 1,
        from: 'esggo',
        to: 'omni',
        kind: 'state',
        seq: 0,
        ts: Date.now(),
        payload: body,
        originId: `esggo-next-${process.env.VPS_IP || 'local'}`,
      }),
    });
    if (!r.ok) return NextResponse.json({ error: 'sync engine rejected' }, { status: 502 });
    return NextResponse.json({ status: 'synced' });
  } catch {
    return NextResponse.json({ error: 'sync engine unreachable' }, { status: 503 });
  }
}

// 公開健康（不含拓撲）
export async function GET() {
  return NextResponse.json({ status: 'online', bridge: 'esggo<->omni', endpoint: '/api/omni/sync' });
}
