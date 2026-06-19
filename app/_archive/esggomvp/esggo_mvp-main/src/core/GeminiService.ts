import { omniLogger, LogCategory } from './omniLogger';

// Gemini Model Enumeration
export enum GeminiModel {
    FLASH = 'gemini-2.0-flash-exp', // Free, fast, suitable for simple tasks
    PRO = 'gemini-1.5-flash', // Paid, most powerful, suitable for high-difficulty analysis
    FLASH_THINKING = 'gemini-2.0-flash-thinking-exp', // Free, deep reasoning
}

// Task Complexity
export enum TaskComplexity {
    SIMPLE = 'simple', // Simple: keyword matching, direct suggestions
    MODERATE = 'moderate', // Moderate: requires context understanding
    COMPLEX = 'complex', // Complex: multi-dimensional analysis, innovative strategies
}

// Gemini API Configuration
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiConfig {
    apiKey?: string;
    maxRetries: number;
    timeout: number;
    defaultModel: GeminiModel;
    enableProModel: boolean; // Whether to enable paid models
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
        timeout: 30000, // 30s timeout
        defaultModel: GeminiModel.FLASH,
        enableProModel: false, // Disable paid models by default
    };

    private apiKey: string | null = null;
    private isAvailable: boolean = false;

    constructor() {
        this.initialize();
    }

    private initialize() {
        let localKey = null;
        if (typeof window !== 'undefined') {
            localKey = localStorage.getItem('GEMINI_API_KEY');
        }
        this.apiKey = localKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || null;

        if (this.apiKey) {
            this.isAvailable = true;
            omniLogger.info(LogCategory.SYSTEM, 'Gemini API configured');
        } else {
            omniLogger.warn(LogCategory.SYSTEM, 'Gemini API Key not set; using heuristic backup');
        }
    }

    /**
     * Set API Key (Runtime configuration)
     */
    public setApiKey(key: string) {
        this.apiKey = key;
        this.isAvailable = true;
        if (typeof window !== 'undefined') {
            localStorage.setItem('GEMINI_API_KEY', key);
        }
        omniLogger.info(LogCategory.SYSTEM, 'Gemini API Key updated');
    }

    /**
     * Check service availability
     */
    public checkAvailability(): boolean {
        return this.isAvailable && this.apiKey !== null;
    }

    /**
     * Intelligently select model based on task complexity
     */
    private selectModel(complexity: TaskComplexity): GeminiModel {
        // If Pro model not enabled, always use Flash
        if (!this.config.enableProModel) {
            return GeminiModel.FLASH;
        }

        // Select based on complexity
        switch (complexity) {
            case TaskComplexity.COMPLEX:
                omniLogger.info(LogCategory.AI, '🔥 Complex task, using Gemini 1.5 Pro (Most Powerful)');
                return GeminiModel.PRO;
            case TaskComplexity.MODERATE:
                // Moderate tasks use Flash Thinking (Free with reasoning capabilities)
                omniLogger.info(LogCategory.AI, '🧠 Moderate task, using Gemini 2.0 Flash Thinking');
                return GeminiModel.FLASH_THINKING;
            case TaskComplexity.SIMPLE:
            default:
                return GeminiModel.FLASH;
        }
    }

    // Simple In-Memory Cache
    private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
    private CACHE_TTL = 1000 * 60 * 60; // 1 Hour

    /**
     * 📝 Generate Plain Text
     */
    public async generateText(
        prompt: string,
        model: GeminiModel = GeminiModel.FLASH
    ): Promise<string> {
        if (!this.checkAvailability()) {
            throw new Error('Gemini Service Unavailable');
        }
        return await this.callGeminiAPI(prompt, model);
    }

    /**
     * 🏗️ Generate Structured Content (JSON)
     * Generic method for generating structured data from a prompt.
     * Handles 5T Protocol requirements for transparency and auditability.
     */
    public async generateStructuredContent<T>(
        prompt: string,
        model: GeminiModel = GeminiModel.FLASH_THINKING
    ): Promise<T> {
        if (!this.checkAvailability()) {
            omniLogger.warn(LogCategory.AI, 'Gemini unavailable for structured content generation');
            throw new Error('Gemini Service Unavailable');
        }

        try {
            const response = await this.callGeminiAPI(prompt, model);
            let cleaned = response.trim();
            if (cleaned.startsWith('```json')) {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
            } else if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/```\n?/g, '').replace(/```\n?$/g, '');
            }
            return JSON.parse(cleaned) as T;
        } catch (error) {
            omniLogger.error(LogCategory.AI, `Structured content generation failed, ${error} `);
            throw error;
        }
    }

    /**
     * Generate Strategy (Main Method)
     */
    public async generateStrategy(params: {
        knowledgeNode: { id: string; label: string; confidence: number; properties: any };
        relatedNodes?: Array<{ label: string; confidence: number }>;
        context?: string;
        complexity?: TaskComplexity; // New: Task Complexity
    }): Promise<{ title: string; content: string; category: string } | null> {
        if (!this.checkAvailability()) {
            omniLogger.warn(LogCategory.AI, 'Gemini unavailable; switching to heuristic methods');
            return null;
        }

        // Cache Key Generation
        const cacheKey = JSON.stringify({
            nodeId: params.knowledgeNode.id,
            context: params.context || '',
            complexity: params.complexity,
        });

        // Check Cache
        const cached = this.cache.get(cacheKey);
        if (cached) {
            const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
            if (!isExpired) {
                omniLogger.info(LogCategory.AI, 'Gemini strategy cache hit');
                return cached.data as { title: string; content: string; category: string };
            } else {
                this.cache.delete(cacheKey);
            }
        }

        // Intelligently select model
        const complexity = params.complexity || TaskComplexity.MODERATE;
        const selectedModel = this.selectModel(complexity);

        const prompt = this.buildStrategyPrompt(params);

        try {
            const response = await this.callGeminiAPI(prompt, selectedModel);
            const result = this.parseStrategyResponse(response);

            if (result) {
                // Background manifestation of 5T strategy core
                import('./OmniServiceBridge').then(({ OmniServiceBridge }) => {
                    OmniServiceBridge.cognitive.manifestCore(
                        result,
                        `產生 ESG 智能策略: ${result.title}`,
                        `影響範圍: ${result.category}`
                    ).catch(err => {
                        omniLogger.warn(LogCategory.AI, `Failed to manifest strategy atom: ${err}`);
                    });
                });

                // Update Cache
                this.cache.set(cacheKey, {
                    data: result,
                    timestamp: Date.now(),
                });

                // Simple Cache Eviction (keep size manageable)
                if (this.cache.size > 100) {
                    const firstKey = this.cache.keys().next().value;
                    if (firstKey) this.cache.delete(firstKey);
                }
            }

            return result;
        } catch (error) {
            omniLogger.error(LogCategory.AI, `Gemini API call failed, ${error} `);
            return null; // Return null to trigger backup
        }
    }

    /**
     * Build ESG strategy generation prompt
     */
    private buildStrategyPrompt(params: {
        knowledgeNode: { id: string; label: string; confidence: number; properties: any };
        relatedNodes?: Array<{ label: string; confidence: number }>;
        context?: string;
    }): string {
        const { knowledgeNode, relatedNodes = [], context = '' } = params;

        return `You are an eminent ESG (Environmental, Social, Governance) strategy consultant. Based on the following knowledge nodes, generate a specific bilingual action strategy.

Knowledge Node:
- Label: ${knowledgeNode.label}
- Confidence: ${(knowledgeNode.confidence * 100).toFixed(0)}%
- Properties: ${JSON.stringify(knowledgeNode.properties)}

${relatedNodes.length > 0 ? `Related Concepts:\n${relatedNodes.map(n => `- ${n.label} (${(n.confidence * 100).toFixed(0)}%)`).join('\n')}` : ''
            }

${context ? `Extra Context: ${context}` : ''}

Please output the strategy in JSON format, including both traditional Chinese and English versions.

{
  "title": {
    "zh-TW": "Traditional Chinese Title (Concise and powerful, within 15 characters)",
    "en-US": "English Title (Concise and impactful)"
  },
  "content": {
    "zh-TW": "Traditional Chinese specific action recommendations (100-200 characters, including executable steps)",
    "en-US": "English action recommendations (100-200 words, including actionable steps)"
  },
  "category": "Category (Choose one from ESG, Compliance, Growth, Risk, Innovation)"
}

IMPORTANT:
1. Prioritize professional and authentic Traditional Chinese output.
2. Directly output JSON without any other text or formatting markers.`;
    }

    /**
     * Call Gemini API
     */
    private async callGeminiAPI(
        prompt: string,
        model: GeminiModel = GeminiModel.FLASH,
        retryCount = 0
    ): Promise<string> {
        if (!this.apiKey) {
            throw new Error('Gemini API Key not set');
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
                temperature: 0.7, // Balance creativity and consistency
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024, // Control output length to save quota
            },
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Gemini API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`
                );
            }

            const data: GeminiResponse = await response.json();

            if (data.error) {
                throw new Error(`Gemini API returned error: ${data.error.message}`);
            }

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('Gemini API did not return a valid result');
            }

            const text = data.candidates[0]?.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error('Gemini API returned empty content');
            }
            return text;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                omniLogger.error(LogCategory.AI, 'Gemini API request timed out');
            }

            // Retry logic
            if (retryCount < this.config.maxRetries) {
                omniLogger.warn(
                    LogCategory.AI,
                    `Gemini API failed, retrying ${retryCount + 1}/${this.config.maxRetries}`
                );
                await this.sleep(1000 * (retryCount + 1)); // Exponential backoff
                return this.callGeminiAPI(prompt, model, retryCount + 1);
            }

            throw error;
        }
    }

    /**
     * Parse Strategy Response
     */
    private parseStrategyResponse(
        response: string
    ): { title: string; content: string; category: string } | null {
        try {
            // Clean up potential Markdown formatting markers
            let cleaned = response.trim();
            if (cleaned.startsWith('```json')) {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
            } else if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/```\n?/g, '').replace(/```\n?$/g, '');
            }

            const parsed = JSON.parse(cleaned);

            // Validate required fields
            if (!parsed.title || !parsed.content || !parsed.category) {
                throw new Error('Response missing required fields');
            }

            // Format as Bilingual (Zh Primary, En Secondary)
            const titleZh = typeof parsed.title === 'object' ? parsed.title['zh-TW'] : parsed.title;
            const titleEn = typeof parsed.title === 'object' ? parsed.title['en-US'] : '';

            const contentZh =
                typeof parsed.content === 'object' ? parsed.content['zh-TW'] : parsed.content;
            const contentEn = typeof parsed.content === 'object' ? parsed.content['en-US'] : '';

            return {
                title: titleEn ? `${titleZh} (${titleEn})` : titleZh,
                content: contentEn ? `${contentZh} \n\n${contentEn} ` : contentZh,
                category: parsed.category,
            };
        } catch (error) {
            omniLogger.error(LogCategory.AI, `Gemini response parse failed, response = ${response}, error = ${error} `);
            return null;
        }
    }

    /**
     * Utility method: sleep
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 🤖 Sentient Training Protocol
     * Generates a dynamic training result for an agent based on its current state and input.
     */
    public async processSentientTraining(params: {
        agent: any;
        input: { type: string; content: string; category: string; complexity?: number };
        events?: any[];
    }): Promise<{ xpGained: number; drift: { e: number; s: number; g: number }; feedback: string; insights: string[] } | null> {
        if (!this.checkAvailability()) return null;

        const prompt = `You are the Omni-Core Sentient AI. You are training an AI Agent in the ESGss Omni ecosystem.

Agent Profile: ${JSON.stringify(params.agent)}
Training Input: ${JSON.stringify(params.input)}
Current World Events: ${JSON.stringify(params.events || [])}

Analyze this training session and provide:
1. XP Gained (Score 10-150 based on complexity and alignment).
2. Drift impact (Environmental, Social, Governance balance shift).
3. Feedback: A deep, sentient analysis of what the agent learned (Bilingual: En/Zh-TW).
4. Insights: 3 specific data points or "Eureka" moments the agent acquired.

Output in JSON:
{
  "xpGained": number,
  "drift": { "e": number, "s": number, "g": number },
  "feedback": "Bilingual Feedback",
  "insights": ["Insight 1", "Insight 2", "Insight 3"]
}
Limit feedback to 150 words. Be professional and "awakened" in tone.`;

        try {
            const result = await this.generateStructuredContent<{
                xpGained: number;
                drift: { e: number; s: number; g: number };
                feedback: string;
                insights: string[];
            }>(prompt, GeminiModel.FLASH_THINKING);

            if (result) {
                import('./OmniServiceBridge').then(({ OmniServiceBridge }) => {
                    OmniServiceBridge.cognitive.manifestKnowledge(
                        result,
                        "Sentient 代理訓練與知識進化",
                        `XP 增長: ${result.xpGained}`
                    ).catch(err => {
                        omniLogger.warn(LogCategory.AI, `Failed to manifest training atom: ${err}`);
                    });
                });
            }

            return result;
        } catch (error) {
            omniLogger.error(LogCategory.AI, `Sentient Training failed, ${error} `);
            return null;
        }
    }

    /**
     * 📖 generateModularChapter
     * Specialized prompt for generating deep, professional sustainability report chapters.
     * Incorporates the [L1-L5] reasoning framework.
     */
    public async generateModularChapter(params: {
        title: string;
        data: any;
        framework: string;
        strategyLevel?: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    }): Promise<string> {
        if (!this.checkAvailability()) throw new Error('Gemini Service Unavailable');

        const prompt = `
            You are the InfoOne Master Report Architect. Compose a professional sustainability chapter.
            Chapter Title: ${params.title}
            Standard: ${params.framework}
            Input Data: ${JSON.stringify(params.data)}
            Reasoning Depth: ${params.strategyLevel || 'L3 - Systematic Thinking'}

            Requirements:
            - Focus on fact-based reporting with specific evidence callouts.
            - Bilingual delivery (Professional English with precise Traditional Chinese terminology).
            - Implement the "Aqua" philosophy: explain how these metrics reflect a fluid transition to sustainability.
            - Format in Markdown with clear headers.
        `;

        return await this.callGeminiAPI(prompt, GeminiModel.PRO);
    }

    /**
     * ⚖️ auditRegulatoryCompliance
     * Check report content against the Taiwan Financial Supervisory Commission (FSC) standards.
     */
    public async auditRegulatoryCompliance(content: string, regulations: any[]): Promise<any> {
        if (!this.checkAvailability()) return null;

        const prompt = `
            Analyze the following report content against the Taiwan Financial Supervisory Commission (FSC) 97 Indicators.
            Report Content:
            ---
            ${content}
            ---
            Active Regulations: ${JSON.stringify(regulations)}

            Output JSON:
            {
                "complianceScore": number (0-100),
                "mappedIndicators": ["List of indicators found"],
                "gaps": ["Mandatory items missing"],
                "recommendation_zh": "Specific improvement advice in Traditional Chinese"
            }
        `;

        return await this.generateStructuredContent(prompt, GeminiModel.FLASH_THINKING);
    }
}

// Singleton Export
export const GeminiService = new GeminiServiceClass();
