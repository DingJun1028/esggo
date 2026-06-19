import { z } from "zod";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { aiCache } from "./ai-cache";
import { OmniService } from "./omni-service";
import { generateWithOnDeviceAI, initOnDeviceAI } from "./on-device-ai";

export type AITier = "Cloud" | "Local" | "Edge";

const tracer = trace.getTracer("esggo-omni-router");

export const executeOmniInference = async <T = string>(
    prompt: string,
    requestedTier: AITier = "Cloud",
    onFailover?: (fromTier: AITier, toTier: AITier) => void,
    onStream?: (chunk: string, complete: boolean) => void,
    onProgress?: (percentage: number) => void,
    signal?: AbortSignal,
    expectedSchema?: z.ZodSchema<T>
): Promise<T> => {
    // --- Cache Recognition ---
    const cacheKeyObj = { prompt, tier: requestedTier, schema: expectedSchema ? true : false };
    if (!onStream) {
        const cached = aiCache.get<T>("inference", cacheKeyObj);
        if (cached) {
            console.log("[OmniRouter] Cache Hit! Skipping inference.");
            return cached;
        }
    }

    // 解析與驗證的輔助函式
    const parseAndValidate = (text: string): T => {
        if (!expectedSchema) return text as unknown as T;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            const jsonString = jsonMatch ? jsonMatch[0] : text;
            return expectedSchema.parse(JSON.parse(jsonString));
        } catch (e) {
            console.error(`[OmniRouter] Zod Schema Validation Failed:`, e);
            throw new Error("Schema Validation Failed");
        }
    };

    const runTier = async (tierName: AITier, logic: () => Promise<T>) => {
        return await tracer.startActiveSpan(`Inference-${tierName}`, async (span) => {
            const start = Date.now();
            try {
                const result = await logic();
                span.setStatus({ code: SpanStatusCode.OK });
                return result;
            } catch (error: any) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                throw error;
            } finally {
                span.setAttribute("ai.latency_ms", Date.now() - start);
                span.end();
            }
        });
    };

    return await tracer.startActiveSpan("OmniRouter.execute", async (rootSpan) => {
        try {
            if (requestedTier === "Edge") {
                try {
                    const res = await runTier("Edge", async () => {
                        const raw = await generateWithOnDeviceAI(prompt, onStream, onProgress, signal);
                        return parseAndValidate(raw);
                    });
                    return res;
                } catch (e) {
                    if (onFailover) onFailover("Edge", "Local");
                    requestedTier = "Local";
                }
            }

            if (requestedTier === "Local") {
                try {
                    const res = await runTier("Local", async () => {
                        // Using OmniService to call the Genkit logic
                        const raw = await OmniService.callFlow("omni_analysis", { query: prompt });
                        return parseAndValidate(typeof raw === 'string' ? raw : JSON.stringify(raw));
                    });
                    return res;
                } catch (e) {
                    if (onFailover) onFailover("Local", "Cloud");
                    requestedTier = "Cloud";
                }
            }

            // Cloud processing
            const res = await runTier("Cloud", async () => {
                const raw = await OmniService.promptDirect(prompt);
                return parseAndValidate(raw);
            });

            if (!onStream) {
                aiCache.set("inference", cacheKeyObj, res);
            }

            return res;
        } finally {
            rootSpan.end();
        }
    });
};

export { initOnDeviceAI as initOnDeviceModel };
