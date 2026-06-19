import { z } from "zod";
import { v7 as uuidv7 } from "uuid";

/**
 * SynthesisManager (合成器)
 * 負責將 ZKP 證跡、Genkit 文本與 Veo 影像合成「主權敘事證明 (Narrative Proof)」。
 */
export class SynthesisManager {
    private static instance: SynthesisManager;

    private constructor() { }

    public static getInstance(): SynthesisManager {
        if (!SynthesisManager.instance) {
            SynthesisManager.instance = new SynthesisManager();
        }
        return SynthesisManager.instance;
    }

    /**
     * 生成敘事證明封裝 (Generate Narrative Proof Bundle)
     */
    public async generateProof(questResult: any, context: any) {
        const id = `PROOF-${uuidv7()}`;
        console.log(`[Synthesis] Generating narrative proof for ${id}...`);

        // 1. 生成 Veo 影片提示詞 (RPG Storytelling)
        const videoPrompt = this.constructVideoPrompt(questResult);

        // 2. 構建信心熱點 (Confidence Points for Heatmap)
        const confidencePoints = this.deriveConfidencePoints(questResult);

        const proofBundle = {
            id,
            timestamp: new Date().toISOString(),
            questId: questResult.id,
            narrative: questResult.message,
            videoPrompt,
            confidencePoints,
            zkpEvidence: context.zkpProofs || {},
            mansion: context.state.lastRoutedAgent
        };

        // Award TCG card based on the proof synthesis
        try {
            const { TCGManager } = await import("./tcg-manager");
            TCGManager.awardCardFromAudit(id, 0.96, questResult.framework === 'ENVIRONMENT' ? 'ENVIRONMENT' : 'SOCIAL');
        } catch (e) {
            console.error("Failed to award TCG card:", e);
        }

        return proofBundle;
    }

    private constructVideoPrompt(result: any): string {
        // 根據結果自動生成電影級提示詞
        const theme = result.status === "success" ? "bright, hopeful, futuristic" : "dark, urgent, complex";
        return `A cinematic shot of a ${theme} ESG landscape, focus on ${result.framework || 'Sustainability'}, high resolution, photorealistic, 8k.`;
    }

    private deriveConfidencePoints(result: any) {
        // 模擬從分析結果中導出熱點位置
        return [
            {
                bbox: [10, 10, 30, 40],
                confidence: 'high' as const,
                label: "Emissions Verified",
                description: "Cross-checked against utility bills via ZKP."
            },
            {
                bbox: [50, 60, 70, 90],
                confidence: 'medium' as const,
                label: "Supply Chain Risk",
                description: "Predicted via multi-agent forensics."
            }
        ];
    }
}

export const synthesisManager = SynthesisManager.getInstance();
