import { NextRequest } from 'next/server';
import { AgentStep } from './lib/agent/v3-shared';

// 強制動態渲染，確保不會被 Next.js 快取
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('taskId') || 'unknown_task';

    // 1. 取得與客戶端連線生命週期綁定的 AbortSignal
    const signal = request.signal;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // 定義推播函式，將 AgentStep 轉換為 SSE 規範格式 (data: {...}\n\n)
            const sendStep = (step: AgentStep) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(step)}\n\n`));
            };

            // 2. 註冊斷線監聽器 (用於通知底層中斷大型任務)
            signal.addEventListener('abort', () => {
                console.log(`[SSE] 客戶端連線中斷，準備取消任務: ${taskId}`);
                // 實務上可以在這裡呼叫 Agent Orchestrator 的中斷方法，例如：
                // abortExecution(taskId);
            });

            try {
                // 模擬 Agent 執行流程
                // 1. PLANNING 階段
                if (signal.aborted) return; // 執行前檢查斷線狀態
                sendStep({
                    id: `step_${Date.now()}_1`,
                    agentName: 'Orchestrator',
                    status: 'PLANNING',
                    message: `正在規劃任務 [${taskId}] 的執行路徑...`,
                    timestamp: new Date().toISOString(),
                });
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // 2. EXECUTING 階段
                if (signal.aborted) return; // 跨階段前再次檢查
                sendStep({
                    id: `step_${Date.now()}_2`,
                    agentName: 'OmniAgent',
                    status: 'EXECUTING',
                    message: '調用外部 API 與讀取 RAG 知識庫中...',
                    payload: { provider: 'Google', model: 'gemini-2.0-flash' },
                    timestamp: new Date().toISOString(),
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // 3. SUCCESS 階段
                if (signal.aborted) return;
                sendStep({
                    id: `step_${Date.now()}_3`,
                    agentName: 'OmniAgent',
                    status: 'SUCCESS',
                    message: '任務執行完畢，已產生產出物。',
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                sendStep({
                    id: `step_${Date.now()}_err`,
                    agentName: 'System',
                    status: 'ERROR',
                    message: error instanceof Error ? error.message : '發生未知錯誤',
                    timestamp: new Date().toISOString(),
                });
            } finally {
                // 執行完畢後關閉串流
                // 如果是斷線，controller 可能已經處於錯誤或關閉狀態，保險起見可用 try-catch 包覆
                try { controller.close(); } catch (e) { }
            }
        },
        cancel() {
            // 3. 備用機制：當底層串流被強行取消時觸發
            console.log(`[SSE] 串流已被強行取消，清理任務 [${taskId}] 的資源。`);
        }
    });

    // 回傳標準的 SSE Headers
    // 注意：'no-transform' 是防止如 Vercel/Nginx 等中間代理層緩衝 (Buffer) 你的回應
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}