/**
 * DeerFlow Adapter — 研究流程框架 (本機 esggo-deerflow, nginx :2026 / gateway :8001)
 * 真連: health 探活 nginx :2026; dispatch 嘗試 POST gateway /api/chat
 * 認證: DeerFlow 2.5 開發模式需 CSRF/session, 若回 not_authenticated 則 graceful 降級
 *   (標註 "gateway 運行中, 需前端 setup 認證", 不假造研究產出)
 * 對齊 OA 框架 graceful 哲學 + 5T 鑄造
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class DeerFlowAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'deerflow';
  readonly label = 'DeerFlow Research';
  readonly runtime = 'python' as const;
  private endpoint = 'http://127.0.0.1:2026'; // nginx 入口 (HTTP 200 已驗)
  private gwHealth = 'http://127.0.0.1:2026/health'; // 或用容器 :8001/health

  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    try {
      const res = await fetch(this.endpoint, { method: 'GET' });
      const ok = res.status === 200;
      return { ok, endpoint: this.endpoint };
    } catch (e: any) {
      return { ok: false, endpoint: this.endpoint, error: e.message };
    }
  }

  async dispatch(task: OATask): Promise<{ output: string }> {
    // 真連嘗試: POST gateway /api/chat (DeerFlow 2.5 研究流程)
    try {
      const res = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma4-vision-local',
          messages: [{ role: 'user', content: task.prompt }],
          stream: false,
        }),
      });
      const text = await res.text();
      // 認證/CSRF 防護 → graceful 降級 (不假造)
      if (res.status === 403 && text.includes('CSRF')) {
        return {
          output: `[DeerFlow] gateway 運行中 (${this.endpoint}) 但需 CSRF/session 認證 — 請經前端 :2026 完成 setup。任務: ${task.prompt}`,
        };
      }
      if (res.status === 401 && text.includes('not_authenticated')) {
        return {
          output: `[DeerFlow] gateway 運行中 (${this.endpoint}) 但需登入認證 — 請經前端 :2026 完成首次 setup。任務: ${task.prompt}`,
        };
      }
      // 成功路徑 (若未來 CSRF 解決): 回真實研究產出
      try {
        const j = JSON.parse(text);
        const content = j?.messages?.[0]?.content ?? j?.response ?? text;
        return { output: `[DeerFlow] ${content}` };
      } catch {
        return { output: `[DeerFlow] ${text.slice(0, 500)}` };
      }
    } catch (e: any) {
      // 連線失敗 → graceful 標註
      return { output: `[DeerFlow] 連線失敗 (${e.message}) — gateway 可能未啟動。任務: ${task.prompt}` };
    }
  }

  async health() {
    try {
      const res = await fetch(this.endpoint, { method: 'GET' });
      if (res.status === 200) return { status: 'ok' as const, detail: `connected ${this.endpoint}` };
      return { status: 'down' as const, detail: `HTTP ${res.status}` };
    } catch (e: any) {
      return { status: 'down' as const, detail: e.message };
    }
  }
}
