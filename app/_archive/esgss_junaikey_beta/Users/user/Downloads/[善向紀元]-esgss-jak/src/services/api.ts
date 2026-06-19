// API Service Layer - Frontend to Backend Communication
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { APIResponse, ESGData, User } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ESG Data Services
  async getESGData(companyId: string): Promise<APIResponse<ESGData>> {
    const response: AxiosResponse<APIResponse<ESGData>> =
      await this.client.get(`/esg/${companyId}`);
    return response.data;
  }

  async updateESGData(companyId: string, data: Partial<ESGData>): Promise<APIResponse<ESGData>> {
    const response: AxiosResponse<APIResponse<ESGData>> =
      await this.client.put(`/esg/${companyId}`, data);
    return response.data;
  }

  // AI Services
  async generateInsights(data: any): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> =
      await this.client.post('/ai/generate-insights', data);
    return response.data;
  }

  async getAIConversation(messages: any[]): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> =
      await this.client.post('/ai/conversation', { messages });
    return response.data;
  }

  // Learning Services
  async getLearningPath(userId: string): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> =
      await this.client.get(`/learning/path/${userId}`);
    return response.data;
  }

  async updateLearningProgress(userId: string, progress: any): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> =
      await this.client.put(`/learning/progress/${userId}`, progress);
    return response.data;
  }

  // User Management
  async getCurrentUser(): Promise<APIResponse<User>> {
    const response: AxiosResponse<APIResponse<User>> =
      await this.client.get('/auth/me');
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<APIResponse<{ token: string; user: User }>> {
    const response: AxiosResponse<APIResponse<{ token: string; user: User }>> =
      await this.client.post('/auth/login', credentials);
    return response.data;
  }

  // Analytics Services
  async getAnalyticsDashboard(): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> =
      await this.client.get('/analytics/dashboard');
    return response.data;
  }

  async getSystemHealth(): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> =
      await this.client.get('/monitoring/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;