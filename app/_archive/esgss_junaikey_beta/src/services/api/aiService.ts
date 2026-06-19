// AI Service
import apiClient, { handleApiError } from './client.js';
import { API_ENDPOINTS } from './endpoints.js';
import type { ApiResponse, AIChatRequest, AIChatResponse, AIInsight } from './types.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

class AIService {
  /**
   * Send chat message to AI
   */
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AIChatResponse>>(
        API_ENDPOINTS.AI.CHAT,
        request
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'AI chat failed');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Analyze data with AI
   */
  async analyze(data: any): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.AI.ANALYZE, { data });

      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get AI insights
   */
  async getInsights(params?: { category?: string; limit?: number }): Promise<AIInsight[]> {
    try {
      const response = await apiClient.get<ApiResponse<AIInsight[]>>(API_ENDPOINTS.AI.INSIGHTS, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Get AI insights error', { error: handleApiError(error) });
      return [];
    }
  }

  /**
   * Get AI recommendations
   */
  async getRecommendations(context?: string): Promise<string[]> {
    try {
      const response = await apiClient.post<ApiResponse<{ recommendations: string[] }>>(
        API_ENDPOINTS.AI.RECOMMENDATIONS,
        { context }
      );

      return response.data.data?.recommendations || [];
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Get AI recommendations error', {
        error: handleApiError(error),
      });
      return [];
    }
  }
}

export default new AIService();
