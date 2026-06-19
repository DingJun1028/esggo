import { useState, useCallback, useRef } from 'react';
import { executeOmniInference, AITier } from '@/lib/services/omni-ai-router';
import { toast } from 'sonner';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '@/lib/firebase';

export function useOmniInference(defaultTier: AITier = 'Cloud') {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [text, setText] = useState("");
    const [activeTier, setActiveTier] = useState<AITier>(defaultTier);
    const [edgeProgress, setEdgeProgress] = useState<number>(0);

    // 用於追蹤中斷操作的 Ref
    const abortControllerRef = useRef<AbortController | null>(null);

    const abort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
            setEdgeProgress(0);
            toast.info("已取消生成", { description: "生成程序已中斷。" });
        }
    }, []);

    const generate = useCallback(async (prompt: string, overrideTier?: AITier) => {
        setIsLoading(true);
        setError(null);
        setText(""); // 重置生成的內容
        setEdgeProgress(0); // 重置進度條

        const targetTier = overrideTier || activeTier;
        let hasStreamed = false;
        let hasToastedProgress = false;

        // 建立新的 Abort 信號，用於此次生成
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const result = await executeOmniInference(
                prompt,
                targetTier,
                // 處理 Failover 事件
                (fromTier, toTier) => {
                    if (signal.aborted) return; // 若已取消則阻斷
                    setActiveTier(toTier);
                    toast.warning(`自動故障轉移 (Failover)`, {
                        description: `無法連線至 ${fromTier} AI，已為您切換至 ${toTier} 繼續生成。`,
                        duration: 4000,
                    });

                    // 將 Failover 事件記錄至 Firebase Analytics
                    try {
                        const analytics = getAnalytics(app);
                        logEvent(analytics, 'ai_tier_failover', {
                            from_tier: fromTier,
                            to_tier: toTier
                        });
                    } catch (analyticsErr) { /* 忽略 Analytics 尚未初始化或被阻擋的錯誤 */ }
                },
                // 處理 Streaming 輸出
                (chunk, complete) => {
                    if (signal.aborted) return; // 軟中斷：忽略後續傳來的 token
                    hasStreamed = true;
                    if (!complete) {
                        setText(prev => prev + chunk);
                    }
                },
                // 處理 Edge 模型下載進度
                (progress) => {
                    if (signal.aborted) return; // 軟中斷：不再更新進度
                    setEdgeProgress(progress);

                    // 當進度達到 100% 且尚未提示過時，顯示成功 Toast
                    if (progress >= 100 && !hasToastedProgress) {
                        hasToastedProgress = true;
                        toast.success("Edge 模型就緒", { description: "設備端推論引擎已成功載入。" });
                    }
                },
                signal // 將 AbortSignal 傳遞給底層路由以支援 Hard Abort
            );

            if (signal.aborted) return;

            // 如果遇到沒有支援 Streaming 或很快就完成的情況，做最終保底更新
            if (!hasStreamed && result) setText(result);

            return result;
        } catch (err: any) {
            if (signal.aborted) return; // 忽略因為取消或中斷產生的錯誤
            setError(err);
            throw err;
        } finally {
            if (!signal.aborted) {
                setIsLoading(false);
                setEdgeProgress(0); // 完成後重置進度
            }
        }
    }, [activeTier]);

    return { generate, abort, text, isLoading, error, activeTier, setActiveTier, edgeProgress };
}