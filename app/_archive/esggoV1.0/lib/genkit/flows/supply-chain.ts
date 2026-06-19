import { z } from "genkit";
import { ai } from "../genkit";

export const supplyChainFlow = ai.defineFlow(
    {
        name: "supplyChainFlow",
        inputSchema: z.object({
            analytics: z.any(),
            riskInsights: z.array(z.string()),
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const { analytics, riskInsights } = input;

        const prompt = `
            你是一位專業的 ESG 供應鏈顧問 (Supply Chain Architect)。
            根據下方的供應鏈數據，請生成一份「減碳與緩解計畫」：
            
            供應鏈概況:
            - 總排放量: ${analytics.totalScope3Emissions} tCO2e
            - 高風險供應商數量: ${analytics.highRiskCount}
            - 碳排最高地區: ${analytics.topEmittingRegion}
            - 數據信心度: 88.4%
            
            風險預警訊息:
            ${riskInsights.join("\n")}
            
            計畫要求:
            1. 針對高排地區提出具體的緩解建議。
            2. 針對高風險供應商提出稽核計畫。
            3. 使用專業、冷靜且具備 5T 協議精神的語氣。
            4. 內容請限制在 150 字以內，並以「🛡️ [Omni Manager]」開頭。
        `;

        const { text } = await ai.generate({
            prompt: prompt,
        });

        return text;
    }
);
