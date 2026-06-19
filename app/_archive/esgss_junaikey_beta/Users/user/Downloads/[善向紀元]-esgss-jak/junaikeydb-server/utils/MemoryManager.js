// File: celestial-server/utils/MemoryManager.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
class MemoryManager {
constructor(apiKey) {
if (!apiKey) throw new Error("MemoryManager requires a valid Gemini API Key");
this.genAI = new GoogleGenerativeAI(apiKey);
// 使用輕量模型執行摘要
this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// 定價參考 (需隨官方更新)
this.pricing = {
"gemini-1.5-flash": { input: 0.35, output: 1.05 }, // per 1M tokens
"gemini-1.5-pro": { input: 3.50, output: 10.50 }
};
}
/**
* 核心熵減邏輯：壓縮歷史訊息
* @param {Array} history - 原始對話陣列
* @param {number} threshold - 觸發壓縮的訊息條數 (預設 12)
*/
async optimizeHistory(history, threshold = 12) {
// 1. 若長度未達標，原樣返回
if (!history || history.length <= threshold) {
return { optimizedHistory: history, summary: null };
}
console.log(`[ENTROPY] History length (${history.length}) exceeded threshold. Compressing...`);
// 2. 切割：保留最近 4 條 (熱數據)，壓縮其餘 (冷數據)
const keepCount = 4;
const oldMessages = history.slice(0, history.length - keepCount);
const recentMessages = history.slice(history.length - keepCount);
// 3. 轉為文本供模型閱讀
const conversationText = oldMessages.map(msg => {
const text = msg.parts.map(p => p.text).join(' ');
return `${msg.role.toUpperCase()}: ${text}`;
}).join('\n');
// 4. 摘要 Prompt
const summaryPrompt = `
You are the Keeper of Memories. Compress the following conversation history into a concise "Context Summary".
RULES:
1. Keep key facts (User name, project requirements, tech stack choices).
2. Keep code context (function names, defined variables).
3. Remove small talk and greetings.
4. Use English or Traditional Chinese based on the content language.
[CONVERSATION TO COMPRESS]:
${conversationText}
`;
try {
const result = await this.model.generateContent(summaryPrompt);
const summaryText = result.response.text();
console.log(`[ENTROPY] Compression complete. Summary: ${summaryText.substring(0, 50)}...`);
// 5. 重組歷史：[系統注入的摘要] + [最近對話]
// 注意：Gemini API 的 history 格式必須是 user/model 交替
const newHistory = [
{
role: 'user',
parts: [{ text: `[SYSTEM MEMORY INJECTION]\nPREVIOUS CONTEXT SUMMARY:\n${summaryText}\n\n(Continue conversation based on this context)` }]
},
{
role: 'model',
parts: [{ text: "Acknowledged. I have absorbed the previous context." }]
},
...recentMessages
];
return { optimizedHistory: newHistory, summary: summaryText };
} catch (e) {
console.error("[ENTROPY] Compression failed, returning original history.", e);
return { optimizedHistory: history, summary: null };
}
}
/**
* 簡單的成本估算
*/
calculateCost(modelName, inputTokens, outputTokens) {
let price = this.pricing["gemini-1.5-flash"];
if (modelName.includes("pro")) price = this.pricing["gemini-1.5-pro"];
const cost = (inputTokens / 1000000 * price.input) + (outputTokens / 1000000 * price.output);
return cost.toFixed(6);
}
}
module.exports = MemoryManager;