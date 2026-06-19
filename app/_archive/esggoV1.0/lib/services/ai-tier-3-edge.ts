import { FilesetResolver, LlmInference } from "@mediapipe/tasks-genai";

let llmInference: LlmInference | null = null;
let isInitializing = false;

export const initOnDeviceModel = async (
    modelPath: string = "/models/gemma-2b-it-gpu-int4.bin",
    onProgress?: (progress: number) => void
) => {
    if (typeof window === "undefined" || llmInference) return;
    if (isInitializing) return;

    try {
        isInitializing = true;
        onProgress?.(5);
        const genai = await FilesetResolver.forGenAiTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
        );
        onProgress?.(30);

        llmInference = await LlmInference.createFromOptions(genai, {
            baseOptions: {
                modelAssetPath: modelPath,
            },
            maxTokens: 512,
            topK: 40,
            temperature: 0.8,
            randomSeed: 101,
        });
        onProgress?.(100);
        console.log("Tier 3 On-Device Edge Initialization Complete");
    } catch (e) {
        console.error("Edge WebML Failed to Init:", e);
        throw e;
    } finally {
        isInitializing = false;
    }
};

export const generateFromEdge = async (prompt: string) => {
    if (!llmInference) {
        throw new Error("Model not initialized. Ensure required .bin is present and initOnDeviceModel() was called.");
    }
    return await llmInference.generateResponse(prompt);
};
