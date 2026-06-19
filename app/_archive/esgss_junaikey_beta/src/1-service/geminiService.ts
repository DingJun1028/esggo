/// <reference types="vite/client" />
import { omniLogger, LogCategory } from './omniLogger';

// Gemini 模型枚舉
export enum GeminiModel {
  FLASH = 'gemini-2.0-flash-exp', // 免費，快速，適合簡單任務
  PRO = 'gemini-1.5-pro-latest', // 付費，最強大，適合高難度分析
  FLASH_THINKING = 'gemini-2.0-flash-thinking-exp', // 免費，深度推理
}

// 任務複雜度
export enum TaskComplexity {
  SIMPLE = 'simple', // 簡單：關鍵字匹配、直接建議
  MODERATE = 'moderate', // 中等：需要上下文理解
  COMPLEX = 'complex', // 複雜：多維度分析、創新策略
}

// Gemini API 配置
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiConfig {
  apiKey?: string;
  maxRetries: number;
  timeout: number;
  defaultModel: GeminiModel;
  enableProModel: boolean; // 是否啟用付費模型
}

interface GeminiRequest {
  contents: Array<{
    parts: Array<{ text: string }>;
    role: 'user' | 'model';
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code: number;
    message: string;
  };
}

class GeminiServiceClass {
  private config: GeminiConfig = {
    maxRetries: 3,
    timeout: 30000, // 30秒超時
    defaultModel: GeminiModel.FLASH,
    enableProModel: false, // 預設禁用付費模型
  };

  private apiKey: string | null = null;
  private isAvailable: boolean = false;
  private cache: Map<string, any> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // 優先從環境變數讀取 API Key (Supports Vite 'import.meta.env' and Node 'process.env')
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
      }
    } catch (e) {
      // Ignore error if import.meta is not available
    }

    if (!this.apiKey && typeof process !== 'undefined' && process.env) {
      this.apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || null;
    }

    if (this.apiKey) {
      this.isAvailable = true;
      omniLogger.info(LogCategory.SYSTEM, 'Gemini API 已配置 (Active)');
    } else {
      omniLogger.warn(LogCategory.SYSTEM, 'Gemini API Key 未設置 (Missing VITE_GEMINI_API_KEY)');
    }
  }

  /**
   * 設置 API Key（運行時配置）
   */
  public setApiKey(key: string) {
    this.apiKey = key;
    this.isAvailable = true;
    omniLogger.info(LogCategory.SYSTEM, 'Gemini API Key 已更新');
  }

  /**
   * 檢查服務是否可用
   */
  public checkAvailability(): boolean {
    return this.isAvailable && this.apiKey !== null;
  }

  /**
   * 根據任務複雜度智能選擇模型
   */
  private selectModel(complexity: TaskComplexity): GeminiModel {
    // 未啟用 Pro 模型，一律使用 Flash
    if (!this.config.enableProModel) {
      return GeminiModel.FLASH;
    }

    // 根據複雜度選擇
    switch (complexity) {
      case TaskComplexity.COMPLEX:
        omniLogger.info(LogCategory.AI, '🧠 複雜任務，使用 Gemini 1.5 Pro（最強模型）');
        return GeminiModel.PRO;
      case TaskComplexity.MODERATE:
        // 中等難度使用 Flash Thinking（免費但有推理能力）
        omniLogger.info(LogCategory.AI, '💭 中等任務，使用 Gemini 2.0 Flash Thinking');
        return GeminiModel.FLASH_THINKING;
      case TaskComplexity.SIMPLE:
      default:
        return GeminiModel.FLASH;
    }
  }

  /**
   * 生成策略（主要方法）
   */
  public async generateStrategy(params: {
    knowledgeNode: { id: string; label: string; confidence: number; properties: any };
    relatedNodes?: Array<{ label: string; confidence: number }>;
    context?: string;
    complexity?: TaskComplexity; // 新增：任務複雜度
  }): Promise<{ title: string; content: string; category: string } | null> {
    const cacheKey = `strategy_${params.knowledgeNode.id}_${params.complexity || 'moderate'}`;
    if (this.cache.has(cacheKey)) {
      omniLogger.info(LogCategory.AI, `Cache Hit: ${cacheKey}`);
      return this.cache.get(cacheKey);
    }

    if (!this.checkAvailability()) {
      omniLogger.warn(LogCategory.AI, 'Gemini 不可用，將使用啟發式方法');
      return null;
    }

    // 智能選擇模型
    const complexity = params.complexity || TaskComplexity.MODERATE;
    const selectedModel = this.selectModel(complexity);

    const prompt = this.buildStrategyPrompt(params);

    try {
      const response = await this.callGeminiAPI(prompt, selectedModel);
      const result = this.parseStrategyResponse(response);
      if (result) {
        this.cache.set(cacheKey, result);
      }
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Gemini API 調用失敗', { error });
      return null; // 返回 null 觸發備援
    }
  }

  /**
   * 奧秘對話請求 (Omni Ask)
   */
  public async ask(
    prompt: string,
    complexity: TaskComplexity = TaskComplexity.SIMPLE
  ): Promise<string | null> {
    if (!this.checkAvailability()) return null;

    const selectedModel = this.selectModel(complexity);
    try {
      return await this.callGeminiAPI(prompt, selectedModel);
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Gemini Ask 失敗', { error });
      return null;
    }
  }

  /**
   * 構建 ESG 策略生成提示
   */
  private buildStrategyPrompt(params: {
    knowledgeNode: { id: string; label: string; confidence: number; properties: any };
    relatedNodes?: Array<{ label: string; confidence: number }>;
    context?: string;
  }): string {
    const { knowledgeNode, relatedNodes = [], context = '' } = params;

    return `你是一位卓越的 ESG（環境、社會、治理）戰略顧問。根據以下知識節點，生成一個具體的雙語行動策略。
You are an eminent ESG (Environmental, Social, Governance) strategy consultant. Based on the following knowledge nodes, generate a specific bilingual action strategy.

**知識節點 (Knowledge Node)**：
- 標籤 (Label)：${knowledgeNode.label}
- 信心度 (Confidence)：${(knowledgeNode.confidence * 100).toFixed(0)}%
- 屬性 (Properties)：${JSON.stringify(knowledgeNode.properties)}

${relatedNodes.length > 0 ? `**相關概念 (Related Concepts)**：\n${relatedNodes.map(n => `- ${n.label} (${(n.confidence * 100).toFixed(0)}%)`).join('\n')}` : ''}

${context ? `**額外脈絡 (Extra Context)**：${context}` : ''}

請以 JSON 格式輸出策略，需包含繁體中文與英文。
Please output the strategy in JSON format, including both Traditional Chinese and English.

{
  "title": {
    "zh-TW": "繁體中文標題 (簡潔有力，15字內)",
    "en-US": "English Title (Concise and impactful)"
  },
  "content": {
    "zh-TW": "繁體中文具體行動建議 (100-200字，包含可執行步驟)",
    "en-US": "English action recommendations (100-200 words, including actionable steps)"
  },
  "category": "分類 (Category) (從 ESG, Compliance, Growth, Risk, Innovation 中選一個)"
}

**重要 (IMPORTANT)**：
1. 優先確保繁體中文輸出的專業性與地道性。 (Prioritize the professionalism of Traditional Chinese output.)
2. 直接輸出 JSON，不要包含任何其他文字或格式標記。 (Directly output JSON without any other text or markers.)`;
  }

  /**
   * 調用 Gemini API
   */
  private async callGeminiAPI(
    prompt: string,
    model: GeminiModel = GeminiModel.FLASH,
    retryCount = 0
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key 未設置');
    }

    const url = `${GEMINI_API_ENDPOINT}/${model}:generateContent?key=${this.apiKey}`;

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [{ text: prompt }],
          role: 'user',
        },
      ],
      generationConfig: {
        temperature: 0.7, // 平衡創意與一致性
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024, // 控制輸出長度以節省配額
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Gemini API 錯誤 ${response.status}: ${errorData.error?.message || '未知錯誤'}`
        );
      }

      const data: GeminiResponse = await response.json();

      if (data.error) {
        throw new Error(`Gemini API 返回錯誤: ${data.error.message}`);
      }

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('Gemini API 未返回有效結果');
      }

      const text = data.candidates[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini API 返回的內容為空');
      }
      return text;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        omniLogger.error(LogCategory.AI, 'Gemini API 請求超時');
      }

      // 重試邏輯
      if (retryCount < this.config.maxRetries) {
        omniLogger.warn(
          LogCategory.AI,
          `Gemini API 失敗，重試 ${retryCount + 1}/${this.config.maxRetries}`
        );
        await this.sleep(1000 * (retryCount + 1)); // 指數退避
        return this.callGeminiAPI(prompt, model, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * 解析策略回應
   */
  private parseStrategyResponse(
    response: string
  ): { title: string; content: string; category: string } | null {
    try {
      // 清理可能的 Markdown 格式標記
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }

      const parsed = JSON.parse(cleaned);

      // 驗證必要欄位
      if (!parsed.title || !parsed.content || !parsed.category) {
        throw new Error('回應缺少必要欄位');
      }

      // Format as Bilingual (Zh Primary, En Secondary)
      const titleZh = typeof parsed.title === 'object' ? parsed.title['zh-TW'] : parsed.title;
      const titleEn = typeof parsed.title === 'object' ? parsed.title['en-US'] : '';

      const contentZh =
        typeof parsed.content === 'object' ? parsed.content['zh-TW'] : parsed.content;
      const contentEn = typeof parsed.content === 'object' ? parsed.content['en-US'] : '';

      return {
        title: titleEn ? `${titleZh} (${titleEn})` : titleZh,
        content: contentEn ? `${contentZh}\n\n${contentEn}` : contentZh,
        category: parsed.category,
      };
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Gemini 回應解析失敗', { response, error });
      return null;
    }
  }

  /**
   * 工具方法：延遲
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 單例導出
export const GeminiService = new GeminiServiceClass();
