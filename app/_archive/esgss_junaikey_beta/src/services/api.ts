// API Service Layer - Frontend to Backend Communication
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, ESGData, User } from '../types.js';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for error handling and CSRF retry
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && error.response.data?.error === 'EBADCSRFTOKEN' && !originalRequest._retry) {
          originalRequest._retry = true;
          await this.getCsrfToken();
          const token = (this.client.defaults.headers.common as any)['X-CSRF-Token'];
          if (token) {
            originalRequest.headers['X-CSRF-Token'] = token;
            return this.client(originalRequest);
          }
        }

        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // CSRF Token Management
  async getCsrfToken(): Promise<string> {
    try {
      const response = await this.client.get('/auth/csrf-token');
      const token = response.data.csrfToken;
      this.client.defaults.headers.common['X-CSRF-Token'] = token;
      return token;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      return '';
    }
  }

  // ESG Data Services
  async getESGData(companyId: string): Promise<ApiResponse<ESGData>> {
    const response: AxiosResponse<ApiResponse<ESGData>> = await this.client.get(
      `/esg/${companyId}`
    );
    return response.data;
  }

  async updateESGData(companyId: string, data: Partial<ESGData>): Promise<ApiResponse<ESGData>> {
    const response: AxiosResponse<ApiResponse<ESGData>> = await this.client.put(
      `/esg/${companyId}`,
      data
    );
    return response.data;
  }

  // AI Services
  async generateInsights(data: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.post(
      '/ai/generate-insights',
      data
    );
    return response.data;
  }

  async getAIConversation(messages: any[]): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.post('/ai/conversation', {
      messages,
    });
    return response.data;
  }

  // Learning Services
  async getLearningPath(userId: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.get(
      `/learning/path/${userId}`
    );
    return response.data;
  }

  async updateLearningProgress(userId: string, progress: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.put(
      `/learning/progress/${userId}`,
      progress
    );
    return response.data;
  }

  // User Management
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get('/auth/me');
    return response.data;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response: AxiosResponse<ApiResponse<{ token: string; user: User }>> =
      await this.client.post('/auth/login', credentials);
    return response.data;
  }

  // Analytics Services
  async getAnalyticsDashboard(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.get('/analytics/dashboard');
    return response.data;
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.get('/monitoring/health');
    return response.data;
  }

  // JunAiKey Skills
  async dispatchSkill(prompt: string, context?: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.post('/skills/dispatch', {
      prompt,
      context
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
