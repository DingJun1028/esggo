'use server';
import ollama from 'ollama';

/**
 * 🏛️ Omni Ollama 核心工具庫
 * 負責處理所有與本地/雲端 Ollama 模型的通訊。
 */

const DEFAULT_MODEL = 'minimax-m2.5:cloud';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * 送出對話請求至 Ollama
 * @param messages 對話紀錄
 * @param model 模型名稱 (預設使用 minimax-m2.5:cloud)
 */
export async function chat(messages: ChatMessage[], model: string = DEFAULT_MODEL) {
    try {
        const response = await ollama.chat({
            model,
            messages,
        });
        return response.message.content;
    } catch (error: any) {
        console.error(`[Ollama Error] Failed to chat with model ${model}:`, error);
        throw new Error(`AI 通訊失敗: ${error.message}`);
    }
}

/**
 * 生成結構化 JSON (用於審核建議)
 * 注意：這取決於模型的具體指令遵循能力。
 */
export async function generateJSON(prompt: string, model: string = DEFAULT_MODEL) {
    const systemPrompt = "你是一個專業的 ESG 審核專家。請僅輸出 JSON 格式的內容，不要有任何其他文字。";

    try {
        const response = await ollama.chat({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            format: 'json'
        });
        return JSON.parse(response.message.content);
    } catch (error: any) {
        console.error(`[Ollama JSON Error] Failed to generate JSON with model ${model}:`, error);
        return null;
    }
}
