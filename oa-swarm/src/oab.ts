/**
 * OAB (OmniAgentBus) 整合層 — 雙蜂隊共享記憶 (§20)
 * 對齊: oa-shared-memory 技能 — TencentDB Agent Memory (memory.esggo.co/gateway)
 * 實戰端點: POST /v3/conversation/add (agentmemory v3 data-plane)
 * 5T 互引: Traceable(source_origin) / Trackable(lifecycle) / Trustworthy(freeze)
 */
import { readFileSync } from 'node:fs';
import { hashLock } from './protocol-5t.js';

export interface OABMessage {
  id: string;
  from: number;        // 蜂 id (01-60)
  to?: number | 'broadcast';
  channel: string;
  payload: unknown;
  ts: number;
}

export class OABClient {
  private readonly gateway: string;
  private readonly serviceId: string;
  private apiKey = '';

  constructor(opts?: { gateway?: string; serviceId?: string; keyPath?: string }) {
    this.gateway = opts?.gateway ?? process.env.OAB_GATEWAY ?? 'http://localhost:8420';
    this.serviceId = opts?.serviceId ?? process.env.OAB_SERVICE_ID ?? 'default';
    const keyPath = opts?.keyPath
      ?? process.env.OAB_KEY_PATH
      ?? '/opt/esggo/apps/tencentdb-memory/.admin-key';
    try { this.apiKey = readFileSync(keyPath, 'utf-8').trim(); } catch { /* 降級無 key */ }
    if (process.env.OAB_API_KEY) this.apiKey = process.env.OAB_API_KEY;
  }

  /** Trackable: 寫入共享記憶 (v3 conversation/add) */
  async publish(msg: OABMessage): Promise<boolean> {
    try {
      const body = JSON.stringify({
        messages: [{ role: 'user', content: JSON.stringify(hashLock(msg)) }],
      });
      const r = await fetch(`${this.gateway}/v3/conversation/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'x-tdai-service-id': this.serviceId,
        },
        body,
        signal: AbortSignal.timeout(5000),
      });
      const j = (await r.json()) as { code?: number };
      return r.ok && j.code === 0;
    } catch {
      return false; // 降級不阻塞
    }
  }

  /** Traceable: 查詢軌跡 */
  async query(last = 5): Promise<OABMessage[]> {
    try {
      const r = await fetch(`${this.gateway}/v3/conversation/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'x-tdai-service-id': this.serviceId,
        },
        body: JSON.stringify({ limit: last }),
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) return [];
      const j = (await r.json()) as { data?: { messages?: { content: string }[] } };
      return (j.data?.messages ?? []).map((m) => {
        try { return JSON.parse(m.content) as OABMessage; } catch { return null; }
      }).filter(Boolean) as OABMessage[];
    } catch {
      return [];
    }
  }
}

// 雙蜂隧道 (Cloudflare Tunnel) — 本機↔VPS 跨位協作
export class DualHiveTunnel {
  private readonly local = new OABClient({ gateway: process.env.OAB_LOCAL ?? 'http://localhost:8420' });
  private readonly vps = new OABClient({ gateway: process.env.OAB_VPS ?? 'https://memory.esggo.co/gateway' });

  async syncToVps(msg: OABMessage): Promise<boolean> { return this.vps.publish(msg); }
  async syncToLocal(msg: OABMessage): Promise<boolean> { return this.local.publish(msg); }
}
