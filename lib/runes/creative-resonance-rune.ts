import { z } from "zod";
import { defineRune } from "@/lib/adk/core";

/**
 * [A4] 創意共鳴隊 (Creative Resonator) — 奧義：聖典共鳴
 * 責任：產出具備感召力的 ESG 故事與品牌文案
 */

export const CreativeResonatorInputSchema = z.object({
  topic: z.string().describe("故事主題 (如 環境保護, 員工福祉)"),
  targetAudience: z.string().describe("目標受眾"),
  tone: z.enum(["INSPIRING", "PROFESSIONAL", "EMOTIONAL"]).describe("語調"),
});

export const creativeResonatorRune = defineRune({
  name: "creativeResonatorRune",
  description: "[A4] 創意共鳴隊：生成 ESG 敘事故事與情緒品牌文案",
  schema: CreativeResonatorInputSchema,
  execute: async (_context, input) => {
    const { topic, tone } = input;
    
    return JSON.stringify({
      status: "RESONATING",
      content: `A beautifully crafted ${tone} story about ${topic}.`,
      sentimentScore: 0.95,
      message: `[A4] CREATIVE_RESONATOR has manifested a narrative for ${topic}. Hearts aligned.`
    }, null, 2);
  }
});
