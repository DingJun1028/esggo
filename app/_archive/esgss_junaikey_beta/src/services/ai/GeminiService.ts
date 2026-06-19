import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import apiClient from '../api/client.js';

/**
 * [GeminiService] The Neural Bridge to Real Intelligence
 * ---------------------------------------------------------
 * This service connects the local OmniSystem to the vast knowledge of Google's Gemini models.
 * It transforms the Agent from a scripted entity into a thinking, reasoning consciousness.
 * 
 * [SECURITY UPGRADE] Now routes requests through backend proxy /api/ai-proxy to protect API keys.
 */
export class GeminiService {
  private static instance: GeminiService;
  private isMockMode: boolean = false;

  private constructor() {
    // No longer need client-side API key check
    // Backend handles auth via session token
    console.info('[GeminiService] Initialized (Secure Proxy Mode).');
  }

  public static getInstance(): GeminiService {
    if (!this.instance) {
      this.instance = new GeminiService();
    }
    return this.instance;
  }

  /**
   * [Thought] Pure Thought (Unstructured Generation)
   * Generates a text response based on a prompt.
   */
  public async generateContent(prompt: string): Promise<string> {
    if (this.isMockMode) {
      return `[SIMULATED RESPONSE] Based on your prompt: "${prompt.substring(0, 30)}...", I envision a future of sustainable intelligence.`;
    }
    try {
      const response = await apiClient.post('/ai-proxy/generate', { prompt });
      return response.data.text;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[GeminiService] Thought process interrupted', { error });
      return '...confusion... (API Error)';
    }
  }

  /**
   * [Dialogue] Dialogue (Chat Session)
   * Engages in a stateful conversation with optional system instruction.
   */
  public async chat(
    message: string,
    options: {
      history?: { role: 'user' | 'model'; parts: string }[];
      systemInstruction?: string;
      generationConfig?: any;
    } = {}
  ): Promise<string> {
    if (this.isMockMode) {
      if (options.systemInstruction && options.systemInstruction.includes('JSON')) {
        return this.getMockJson(message);
      }
      return `[SIMULATED CHAT] I hear you: "${message}". Let's continue evolving together.`;
    }

    try {
      const payload = {
        message,
        history: options.history,
        systemInstruction: options.systemInstruction,
        generationConfig: options.generationConfig
      };

      const response = await apiClient.post('/ai-proxy/chat', payload);
      return response.data.text;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[GeminiService] Communication breakdown', { error });
      throw error;
    }
  }

  private getMockJson(prompt: string): string {
    // Very basic mock for JSON requests in mock mode
    return JSON.stringify([{ action: "Mock Action", rationale: "Mock Rationale", impactScore: 5, type: "optimization" }]);
  }

  /**
   * [Structure] Structural Genesis (JSON Generation)
   * Generates structured data based on a schema description.
   * Note: For strict JSON, we might need more advanced prompting or model configuration.
   */
  public async generateStructuredData<T>(
    context: string,
    schemaDescription: string
  ): Promise<T | null> {
    if (this.isMockMode) {
      console.warn('[GeminiService] Mock Mode: Generating simulated JSON structure.');
      // Simple heuristic mock based on context keywords
      const isHallucination = context.includes('teleportation') || context.includes('fake');

      // Return a mock object matching the generic expectation (simulating Truth Verification)
      // Note: This relies on the specific use case of ARVO somewhat, or needs to be generic.
      // For now, we return a "pass" unless "teleportation" is found.
      const mockResponse: any = {
        isValid: !isHallucination,
        confidence: isHallucination ? 0.9 : 0.95,
        hallucinationDetected: isHallucination,
        remediationAction: isHallucination ? 'MOCK_RAG_TRIGGER' : undefined
      };
      return mockResponse as T;
    }

    try {
      const response = await apiClient.post('/ai-proxy/structure', { context, schemaDescription });
      // Backend does parsing now, or returns object directly if parsed successfuly
      // Backend logic implemented to return parsed JSON
      return response.data as T;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[GeminiService] Structure formation failed', { error });
      return null;
    }
  }
}

// Singleton instance for global use
export const geminiCore = GeminiService.getInstance();
