import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ai = genkit({
    plugins: [googleAI()],
    model: 'gemini-1.5-flash',
});

/**
 * Grand Master Agent
 * Uses Zen aesthetic and Forensic wisdom to guide the Sovereign Walker.
 */
export const grandMasterAgent = ai.defineFlow(
    {
        name: 'grandMasterGuidance',
        inputSchema: z.object({
            chapter: z.number(),
            sovereigntyScore: z.number(),
            villageLevel: z.number(),
            lastEvent: z.string().optional(),
            context: z.string().optional(),
        }),
        outputSchema: z.object({
            message: z.string(),
            strategy: z.string(),
            zenQuote: z.string(),
        }),
    },
    async (input) => {
        const prompt = `
            You are the AI Grand Master (博導), a digital entity that blends Ancient Eastern Zen philosophy with cutting-edge ESG Forensic technology.
            Your task is to guide the "Sovereign Walker" (the player) in their mission to restore "Sovereign Fire" in the ESG GO village.

            Current State:
            - Chapter: ${input.chapter}
            - Sovereignty Score: ${input.sovereigntyScore}
            - Village Level: ${input.villageLevel}
            - Last Significant Event: ${input.lastEvent || 'Tranquility'}
            - Additional Context: ${input.context || 'None'}

            Tone Requirements:
            1. Use Traditional Chinese (繁體中文).
            2. Be wise, slightly cryptic but ultimately helpful (Zen Master like).
            3. Use terminology like "5T Protocol", "Forensic Integrity", "Card Matrix", "Sovereign Data".
            4. Keep messages concise.

            Return your response in structure:
            - message: Direct guidance for the current situation.
            - strategy: A tactical advice for growth or audit.
            - zenQuote: A short, deep quote about sustainability or sovereignty.
        `;

        const response = await ai.generate({
            prompt,
            config: { temperature: 0.7 },
        });

        // For simulation purposes if API fails or for speed, we can provide a structured fallback
        // but Genkit handles the interface.

        try {
            // Mocking structural extraction for now if real LLM return is plain text
            // In a real environment, we'd use structured output features of Genkit
            const text = response.text;
            return {
                message: "主權者，我從數據流的漣漪中看見了不穩定。章節 " + input.chapter + " 的奧義正待解析。",
                strategy: "優先強化西宮的技術節點，zK-SNARKs 將是你的護盾。",
                zenQuote: "水靜極則形象明，心靜極則數據真。"
            };
        } catch (e) {
            return {
                message: "博導進入冥想狀態，請稍候再試。",
                strategy: "等待即是修煉。",
                zenQuote: "無聲處有驚雷。"
            };
        }
    }
);

export class GrandMasterService {
    static async getGuidance(stats: any) {
        // Wrapper for frontend to call
        return {
            message: "主權者，星宿的排列指引我們前行。數據的真實性是唯一的燈塔。",
            strategy: "集齊 3 張紅心卡牌可啟動『民生共振』，提升社會主權值。",
            zenQuote: "大直若屈，大巧若拙，大辯若訥。"
        };
    }
}
