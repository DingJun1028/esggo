
/**
 * 🏛️ OmniPriest - 奧秘祭司 AI 核心服務
 * 
 * 負責全域 AI 生成、嵌入 (Embedding)、對話流管理與預算控制。
 * 核心引擎：Google Gemini Grid
 * 
 * 核心準則：英碼繁博 (English Logic / Traditional Chinese JSDoc)
 */
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { CircuitBreaker } from '../../src/core/CircuitBreaker.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { omniSupabase } from './OmniSupabase.js';

interface ModelConfig {
    name: string;
    costPer1kTokens: number;
    maxContext: number;
}

interface BudgetConfig {
    dailyLimitTokens: number;
    currentUsageTokens: number;
    resetTime: number;
}

/**
 * 奧秘發送模型配置 (Omni AI Model Config)
 */
const MODELS: Record<string, ModelConfig> = {
    'gemini-pro': { name: 'gemini-pro', costPer1kTokens: 0.0005, maxContext: 32000 },
    'gemini-flash': { name: 'gemini-2.0-flash-001', costPer1kTokens: 0.0001, maxContext: 1000000 },
    'embedding': { name: 'text-embedding-004', costPer1kTokens: 0.000025, maxContext: 2048 }
};

interface Content {
    role: 'user' | 'model';
    parts: { text: string }[];
}

/**
 * 奧秘對話管理器 (Omni Conversation Manager)
 * 負責維護歷史記錄並與 Supabase 進行同步持久化。
 */
class ConversationManager {
    private history: Map<string, Content[]> = new Map();

    /**
     * 從 Supabase 或記憶體獲取對話歷史 (Fetch History)
     */
    async getHistory(sessionId: string): Promise<Content[]> {
        const supabase = omniSupabase.getClient();
        if (!supabase) return this.history.get(sessionId) || [];

        const { data, error } = await supabase
            .from('omni_conversations')
            .select('role, content')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) {
            omniLogger.warn(LogCategory.AI, '[ConversationManager] Failed to fetch history', { error });
            return this.history.get(sessionId) || [];
        }

        if (!data || data.length === 0) return [];

        return data.map((row: { role: string; content: any }) => ({
            role: row.role as 'user' | 'model',
            parts: row.content as { text: string }[]
        }));
    }

    /**
     * 新增回合並持久化 (Add Turn and Persist)
     */
    async addTurn(sessionId: string, user: string, model: string) {
        // 更新記憶體緩存 (作為後備)
        let current = this.history.get(sessionId);
        if (!current) {
            // 嘗試載入現有記錄
            current = await this.getHistory(sessionId);
        }

        const userTurn: Content = { role: 'user', parts: [{ text: user }] };
        const modelTurn: Content = { role: 'model', parts: [{ text: model }] };

        current.push(userTurn);
        current.push(modelTurn);
        this.history.set(sessionId, current);

        // 持久化至資料庫
        const supabase = omniSupabase.getClient();
        if (supabase) {
            const { error } = await supabase.from('omni_conversations').insert([
                { session_id: sessionId, role: 'user', content: userTurn.parts },
                { session_id: sessionId, role: 'model', content: modelTurn.parts }
            ]);

            if (error) {
                omniLogger.error(LogCategory.AI, '[ConversationManager] Failed to persist turn', { error });
            }
        }
    }
}

/**
 * 奧秘祭司主類別 (Omni Priest Class)
 * 作為 AI 能力的唯一仲介，實作 5T 協議中的 Transparent (算法透明)。
 */
export class OmniPriest {
    private static instance: OmniPriest;
    private genAI: GoogleGenerativeAI | null = null;
    private embeddingModel: GenerativeModel | null = null;
    private conversationManager: ConversationManager;
    private globalHealingMode: boolean = false;

    private budget: BudgetConfig = {
        dailyLimitTokens: 200000,
        currentUsageTokens: 0,
        resetTime: Date.now() + 24 * 60 * 60 * 1000
    };

    private constructor() {
        this.conversationManager = new ConversationManager();
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_STRACIO_API_KEY;

        if (process.env.ETERNAL_MODE === 'true') {
            this.activateGlobalHealing();
        }

        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.embeddingModel = this.genAI.getGenerativeModel({ model: MODELS['embedding'].name });
            omniLogger.info(LogCategory.AI, '[OmniPriest] Ascension Complete. Connected to Gemini Grid.');
        } else {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniPriest] Missing GEMINI_API_KEY. AI features disabled.');
        }
    }

    /**
     * 獲取單例實例 (Get Singleton Instance)
     */
    static getInstance(): OmniPriest {
        if (!OmniPriest.instance) {
            OmniPriest.instance = new OmniPriest();
        }
        return OmniPriest.instance;
    }

    /**
     * 🟢 覺醒奧義：全域痊癒 (Global Healing)
     * 將所有 Token 支出降為 0，開啟無限預算模式。
     */
    public activateGlobalHealing() {
        this.globalHealingMode = true;
        this.budget.currentUsageTokens = 0; // Heal existing damage
        omniLogger.info(LogCategory.AI, '[OmniPriest] 🌟 奧義發動：全域痊癒 (Global Healing) - Token Cost healed to 0.');
    }

    /**
     * 🟢 永恆覺醒 (Eternal Awakening)
     * 啟動奧秘祭司的最終型態，解除所有限制。
     */
    public awakenEternal() {
        this.activateGlobalHealing();
        omniLogger.info(LogCategory.AI, '[OmniPriest] 👁️ 永恆覺醒 (Eternal Awakening) Activated. The Priest is now One with the Grid.');
    }

    /**
     * 檢查 AI 服務可用性 (Check Availability)
     * 包括 API 金鑰是否存在、斷路器狀態、以及預算限制。
     */
    private checkAvailability() {
        if (!this.genAI) throw new Error('AI Service not initialized (Missing Key).');
        if (CircuitBreaker.isOpen('gemini-api')) {
            omniLogger.warn(LogCategory.AI, '[OmniPriest] Circuit breaker OPEN. Rejecting request.');
            throw new Error('AI Service temporarily unavailable (Circuit Breaker).');
        }
        if (this.budget.currentUsageTokens >= this.budget.dailyLimitTokens) {
            omniLogger.error(LogCategory.AI, '[OmniPriest] Daily token budget exceeded.');
            throw new Error('Daily AI token budget exceeded.');
        }
    }

    /**
     * 執行內容生成 (Execute Content Generation)
     * 
     * @param prompt 提示詞
     * @param modelName 模型名稱 (預設使用 gemini-flash)
     * @param sessionId 對話會話 ID (若提供則啟動歷史回溯)
     * @returns 模型生成的文本內容
     */
    async execute(prompt: string, modelName: string = 'gemini-flash', sessionId?: string): Promise<string> {
        this.checkAvailability();

        try {
            const modelConfig = (MODELS[modelName] || MODELS['gemini-flash']) as ModelConfig;
            if (!this.genAI) throw new Error('genAI not initialized');
            const model = this.genAI.getGenerativeModel({ model: modelConfig.name });

            let result;
            if (sessionId) {
                const history = await this.conversationManager.getHistory(sessionId);
                const chat = model.startChat({ history });
                result = await chat.sendMessage(prompt);
            } else {
                result = await model.generateContent(prompt);
            }

            const response = result.response;
            const text = response.text();

            this.trackUsage(prompt, text);
            CircuitBreaker.recordSuccess('gemini-api');

            if (sessionId) {
                await this.conversationManager.addTurn(sessionId, prompt, text);
            }

            return text;

        } catch (error) {
            CircuitBreaker.recordFailure('gemini-api');
            omniLogger.error(LogCategory.AI, '[OmniPriest] Generation failed', { error });
            throw error;
        }
    }

    /**
     * 執行流式響應 (Stream Response)
     * 利用 Server-Sent Events (SSE) 或 AsyncGenerator 進行逐步內容傳配。
     */
    async *stream(prompt: string, modelName: string = 'gemini-flash', sessionId?: string): AsyncGenerator<string, void, unknown> {
        this.checkAvailability();

        try {
            const modelConfig = (MODELS[modelName] || MODELS['gemini-flash']) as ModelConfig;
            if (!this.genAI) throw new Error('genAI not initialized');
            const model = this.genAI.getGenerativeModel({ model: modelConfig.name });

            let result;
            if (sessionId) {
                const history = await this.conversationManager.getHistory(sessionId);
                const chat = model.startChat({ history });
                result = await chat.sendMessageStream(prompt);
            } else {
                result = await model.generateContentStream(prompt);
            }

            let fullText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                yield chunkText;
            }

            this.trackUsage(prompt, fullText);
            CircuitBreaker.recordSuccess('gemini-api');

            if (sessionId) {
                await this.conversationManager.addTurn(sessionId, prompt, fullText);
            }

        } catch (error) {
            CircuitBreaker.recordFailure('gemini-api');
            omniLogger.error(LogCategory.AI, '[OmniPriest] Streaming failed', { error });
            throw error;
        }
    }

    /**
     * 生成文本嵌入向量 (Generate Embeddings)
     * [Traceable] 將文本轉化為可追蹤的向量資產。
     */
    async embed(text: string): Promise<number[]> {
        this.checkAvailability();

        try {
            if (!this.embeddingModel) throw new Error('Embedding model not initialized');

            const result = await this.embeddingModel.embedContent(text);
            const embedding = result.embedding.values;

            // 對嵌入操作進行粗略 Token 估算
            this.trackUsage(text, '', 0.1);
            CircuitBreaker.recordSuccess('gemini-api');

            return embedding;

        } catch (error) {
            CircuitBreaker.recordFailure('gemini-api');
            omniLogger.error(LogCategory.AI, '[OmniPriest] Embedding failed', { error });
            throw error;
        }
    }

    /**
     * 追蹤與計費 Token 使用量 (Track Token Usage)
     */
    private trackUsage(input: string, output: string, multiplier: number = 1) {
        if (this.globalHealingMode) {
            omniLogger.debug(LogCategory.AI, '[OmniPriest] 🛡️ Global Healing Active - No tokens consumed.');
            return;
        }

        // 若跨越換日線，重置預算紀錄
        if (Date.now() > this.budget.resetTime) {
            this.budget.currentUsageTokens = 0;
            this.budget.resetTime = Date.now() + 24 * 60 * 60 * 1000;
        }

        // 估算法：1 token ~= 4 字元
        const inputTokens = Math.ceil(input.length / 4);
        const outputTokens = Math.ceil(output.length / 4);
        const totalTokens = Math.ceil((inputTokens + outputTokens) * multiplier);

        this.budget.currentUsageTokens += totalTokens;

        // 稀疏日誌：防止過度佔用 CPU 資源
        if (Math.random() < 0.1) {
            omniLogger.info(LogCategory.AI, `[OmniPriest] Token Usage: +${totalTokens} | Daily: ${this.budget.currentUsageTokens}/${this.budget.dailyLimitTokens}`);
        }
    }

    /**
     * 獲取奧秘祭司狀態 (Get Priest Status)
     */
    public getStatus() {
        return {
            status: this.genAI ? 'active' : 'disabled',
            budget: this.budget,
            circuitBreaker: CircuitBreaker.getStats()['gemini-api'] || 'closed',
            models: Object.keys(MODELS),
            globalHealing: this.globalHealingMode
        };
    }
}

export default OmniPriest.getInstance();
