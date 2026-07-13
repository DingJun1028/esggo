// ============================================================
// Agent Thought Stream — Demo Publisher
// app/api/agent/[id]/thought/demo/route.ts
// POST /api/agent/<id>/thought/demo
// 發布數段示範思考到 OmniAgentBus 思考流頻道 omni://agent/<id>/thought，
// 供前端「一代理 思考」面板即時觀察（模型不吐思考時也能演示串流）。
// ============================================================
import { publishThought } from '@/lib/bus';

export const dynamic = 'force-dynamic';

const SAMPLE_THOUGHTS = [
  '解析用戶意圖：辨識為 ESG 永續報告撰寫任務，需對齊 GRI 準則與 SASB 產業框架。',
  '檢索相關證據：自 NCB 提取去年度碳排基線、減量成效與水資源循環數據。',
  '推論標籤配對：將「太陽能板」對應至 Environmental / Renewable Energy 支柱。',
  '風險評估：供應鏈範疇三排放揭露完整性不足，建議補強盡職調查。',
  '綜合結論：產出結構化建議並附 5T hashLock 溯源憑證，交付可審計報告。',
];

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/agent\/([^/]+)\/thought\/demo/);
  const agentId = match ? decodeURIComponent(match[1]) : 'gemma4-local';
  const runId = `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  for (let i = 0; i < SAMPLE_THOUGHTS.length; i++) {
    // 錯開發布，模擬真實推理的逐步流式節奏
    await new Promise((r) => setTimeout(r, 450));
    publishThought({ agentId, runId, step: i + 1, content: SAMPLE_THOUGHTS[i] });
  }

  return Response.json({ ok: true, agentId, runId, count: SAMPLE_THOUGHTS.length });
}
