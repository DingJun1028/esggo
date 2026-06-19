import { FilesetResolver, LlmInference } from "@mediapipe/tasks-genai";

// Tier 3: Edge & On-Device Processing (Gemma 4 Mobile Optimized)
// 用於前端瀏覽器直接推論，使用最新的 Gemma 4 系列達成極致隱私與 128K 上下文。

let llmInference: LlmInference | null = null;

export const initOnDeviceAI = async (
    modelAssetUrl: string = "/models/gemma-4-e2b-it-gpu-int4.bin",
    onProgress?: (percentage: number) => void,
    signal?: AbortSignal | null
) => {
    if (llmInference) return llmInference;

    try {
        const cacheName = "esggo-edge-models";
        const cache = await caches.open(cacheName);
        let modelBlob: Blob;

        // 檢查快取中是否已經有該模型
        const cachedResponse = await cache.match(modelAssetUrl);

        if (cachedResponse) {
            console.log("Model found in cache, skipping download.");
            modelBlob = await cachedResponse.blob();
            if (onProgress) onProgress(100); // 快取載入瞬間完成
        } else {
            console.log("Model not found in cache, starting download...");
            // 1. 透過 fetch 與 ReadableStream 手動下載模型權重，以捕捉進度
            const response = await fetch(modelAssetUrl, { signal: signal ?? null });
            if (!response.ok) throw new Error("Failed to fetch local model");

            const contentLength = response.headers.get("content-length");
            const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
            let loadedBytes = 0;

            const reader = response.body?.getReader();
            const chunks: Uint8Array[] = [];

            if (reader && totalBytes > 0) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                        chunks.push(value);
                        loadedBytes += value.length;
                        if (onProgress) onProgress((loadedBytes / totalBytes) * 100);
                    }
                }
            }

            // 將下載的資料組合為 Blob
            modelBlob = new Blob(chunks as unknown as BlobPart[]);
            // 存入 Cache API 供下次使用 (避免浪費頻寬)
            await cache.put(modelAssetUrl, new Response(modelBlob));
        }

        // 產生供 MediaPipe 讀取的本地 URL
        const modelAssetPath = URL.createObjectURL(modelBlob);

        // 2. 載入 WebAssembly 依賴檔案
        const genai = await FilesetResolver.forGenAiTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
        );

        // 3. 建立 LLM 推論實例，指定剛剛建立好的虛擬路徑
        llmInference = await LlmInference.createFromOptions(genai, {
            baseOptions: { modelAssetPath },
        });

        return llmInference;
    } catch (error) {
        console.error("Failed to initialize On-Device AI:", error);
        throw error;
    }
};

export const generateWithOnDeviceAI = async (
    prompt: string,
    onStream?: (partialResult: string, complete: boolean) => void,
    onProgress?: (percentage: number) => void,
    signal?: AbortSignal
) => {
    if (!llmInference) {
        await initOnDeviceAI("/models/gemma-4-e2b-it-gpu-int4.bin", onProgress, signal);
    }

    // 如果有傳入 onStream 回呼，則啟用串流模式
    if (onStream) {
        return new Promise<string>((resolve, reject) => {
            let fullResponse = "";
            try {
                llmInference!.generateResponse(prompt, (partial, complete) => {
                    fullResponse += partial;
                    onStream(partial, complete);
                    if (complete) resolve(fullResponse);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    return await llmInference!.generateResponse(prompt);
};