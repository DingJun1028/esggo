// ESG Data Service
import apiClient, { handleApiError } from './client.js';
import { API_ENDPOINTS } from './endpoints.js';
import type { ApiResponse, ESGMetric, ESGReport, ESGCalculateRequest } from './types.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

class ESGService {
  /**
   * Get ESG metrics
   */
  async getMetrics(params?: {
    category?: 'environmental' | 'social' | 'governance';
    startDate?: string;
    endDate?: string;
  }): Promise<ESGMetric[]> {
    try {
      const response = await apiClient.get<ApiResponse<ESGMetric[]>>(API_ENDPOINTS.ESG.METRICS, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      omniLogger.error(LogCategory.ESG, 'Get ESG metrics error', { error: handleApiError(error) });
      return [];
    }
  }

  /**
   * Calculate ESG score
   */
  async calculateScore(data: ESGCalculateRequest): Promise<ESGReport | null> {
    try {
      const response = await apiClient.post<ApiResponse<ESGReport>>(
        API_ENDPOINTS.ESG.CALCULATE,
        data
      );

      return response.data.data || null;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get ESG reports
   */
  async getReports(params?: { limit?: number; offset?: number }): Promise<ESGReport[]> {
    try {
      const response = await apiClient.get<ApiResponse<ESGReport[]>>(API_ENDPOINTS.ESG.REPORTS, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      omniLogger.error(LogCategory.ESG, 'Get ESG reports error', { error: handleApiError(error) });
      return [];
    }
  }

  /**
   * Get specific ESG report by ID
   */
  async getReportById(id: string): Promise<ESGReport | null> {
    try {
      const response = await apiClient.get<ApiResponse<ESGReport>>(
        API_ENDPOINTS.ESG.REPORT_BY_ID(id)
      );

      return response.data.data || null;
    } catch (error) {
      omniLogger.error(LogCategory.ESG, 'Get ESG report error', { error: handleApiError(error) });
      return null;
    }
  }

  /**
   * Get real-time ESG telemetry data
   */
  async getTelemetry(): Promise<{
    carbonScore: number;
    powerUsage: number;
    socialImpact: number;
    compliance: number;
  }> {
    try {
      const metrics = await this.getMetrics();

      // Process metrics to get telemetry data
      const carbonMetrics = metrics.filter(m => m.category === 'environmental');
      const socialMetrics = metrics.filter(m => m.category === 'social');
      const governanceMetrics = metrics.filter(m => m.category === 'governance');

      return {
        carbonScore: carbonMetrics[0]?.value || 0,
        powerUsage: carbonMetrics[1]?.value || 0,
        socialImpact: socialMetrics[0]?.value || 0,
        compliance: governanceMetrics[0]?.value || 0,
      };
    } catch (error) {
      omniLogger.error(LogCategory.ESG, 'Get telemetry error', { error });
      return {
        carbonScore: 0,
        powerUsage: 0,
        socialImpact: 0,
        compliance: 0,
      };
    }
  }
}

export default new ESGService();
