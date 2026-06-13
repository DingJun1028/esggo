import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini API Key 自動輪替器 (Auto-Rotator)
 * 當遇到 429 RESOURCE_EXHAUSTED 錯誤時，自動無縫切換到下一把備用鑰匙並重試。
 */
export class GeminiRotator {
  private apiKeys: string[];
  private currentIndex: number = 0;

  constructor(keys: string[]) {
    this.apiKeys = keys.filter(k => k && k.trim() !== '');
  }

  private getCurrentKey(): string {
    if (this.apiKeys.length === 0) {
      throw new Error("必須提供至少一把有效的 Gemini API Key");
    }
    return this.apiKeys[this.currentIndex];
  }

  private rotateKey(): void {
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
  }

  public getClient(): GoogleGenerativeAI {
    return new GoogleGenerativeAI(this.getCurrentKey());
  }

  public getModel(modelName: string = "gemini-1.5-flash") {
    return this.getClient().getGenerativeModel({ model: modelName });
  }

  /**
   * 帶自動重試的模型生成 (支援 systemInstruction)
   */
  async generateContent(
    modelName: string,
    prompt: string,
    systemInstruction?: string
  ): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.apiKeys.length; attempt++) {
      const genAI = this.getClient();
      const model = systemInstruction 
        ? genAI.getGenerativeModel({ model: modelName, systemInstruction })
        : genAI.getGenerativeModel({ model: modelName });

      try {
        const result = await model.generateContent(prompt);
        return result;
      } catch (error: any) {
        lastError = error;
        
        const errorMsg = error?.message || error?.toString() || '';
        const isQuotaExhausted = 
          error?.status === 'RESOURCE_EXHAUSTED' ||
          errorMsg.includes('429') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('spending cap');

        if (isQuotaExhausted && attempt < this.apiKeys.length - 1) {
          console.warn(`[GeminiRotator] 警告: 第 ${this.currentIndex + 1} 把 API Key 額度已耗盡，正在自動切換備用鑰匙...`);
          this.rotateKey();
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError || new Error('所有備用的 Gemini API Keys 均已耗盡');
  }

  /**
   * 帶自動重試的嵌入生成
   */
  async embedContent(text: string, modelName: string = "text-embedding-004"): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.apiKeys.length; attempt++) {
      const model = this.getClient().getGenerativeModel({ model: modelName });
      
      try {
        const result = await model.embedContent(text);
        return result;
      } catch (error: any) {
        lastError = error;
        
        const errorMsg = error?.message || error?.toString() || '';
        const isQuotaExhausted = 
          error?.status === 'RESOURCE_EXHAUSTED' ||
          errorMsg.includes('429') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('spending cap');

        if (isQuotaExhausted && attempt < this.apiKeys.length - 1) {
          console.warn(`[GeminiRotator] 警告: 第 ${this.currentIndex + 1} 把 API Key 額度已耗盡，正在自動切換備用鑰匙...`);
          this.rotateKey();
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError || new Error('所有備用的 Gemini API Keys 均已耗盡');
  }
}