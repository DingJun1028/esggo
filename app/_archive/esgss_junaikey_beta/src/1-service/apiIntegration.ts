// API Integration Service - M9 System Architecture Module
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { authService } from './auth';

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Service Class
export class ApiIntegrationService {
  private static instance: ApiIntegrationService;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL || '/api/v1';

  private constructor() {}

  static getInstance(): ApiIntegrationService {
    if (!ApiIntegrationService.instance) {
      ApiIntegrationService.instance = new ApiIntegrationService();
    }
    return ApiIntegrationService.instance;
  }

  // GET Request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, { method: 'GET' });
  }

  // POST Request
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT Request
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE Request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, { method: 'DELETE' });
  }

  // Private Implementation
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return `${this.baseUrl}${endpoint}${queryString}`;
  }

  private async request<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
    const start = Date.now();
    try {
      const headers = await this.getHeaders();
      const response = await fetch(url, { ...options, headers });

      const duration = Date.now() - start;
      omniLogger.info(LogCategory.API, `API Request: ${options.method} ${url}`, {
        duration,
        status: response.status,
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data, statusCode: response.status };
      } else {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        omniLogger.warn(LogCategory.API, `API Error: ${response.status}`, {
          url,
          error: errorData,
        });
        return {
          success: false,
          error: errorData.message || 'Request failed',
          statusCode: response.status,
        };
      }
    } catch (error) {
      const duration = Date.now() - start;
      const message = error instanceof Error ? error.message : 'Network error';
      omniLogger.error(LogCategory.API, `API Network Error`, { url, error, duration });
      return { success: false, error: message };
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = authService.currentState.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    return headers;
  }
}

export const apiIntegrationService = ApiIntegrationService.getInstance();
