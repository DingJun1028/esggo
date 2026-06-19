// API Client Configuration
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

const isBrowser = typeof window !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const getApiBaseUrl = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      // @ts-ignore
      return import.meta.env.VITE_API_URL;
    }
    // @ts-ignore
    if (process.env.VITE_API_URL) {
      return process.env.VITE_API_URL;
    }
  } catch (e) {
    // Ignore error in non-compatible environments
  }

  // In Node.js environment (e.g. running tests), we need an absolute URL
  if (isNode) {
    return 'http://localhost:3000/api';
  }

  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - inject auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;
    if (isBrowser && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('auth_token');
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (isBrowser && typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
          break;
        case 403:
          omniLogger.error(LogCategory.SYSTEM, 'Access forbidden');
          break;
        case 404:
          omniLogger.error(LogCategory.SYSTEM, 'Resource not found');
          break;
        case 500:
          omniLogger.error(LogCategory.SYSTEM, 'Server error', { error });
          break;
        default:
          omniLogger.error(LogCategory.SYSTEM, 'API Error', { data: error.response.data });
      }
    } else if (error.request) {
      // Request made but no response
      omniLogger.error(LogCategory.SYSTEM, 'Network error - no response from server');
    } else {
      // Request setup error
      omniLogger.error(LogCategory.SYSTEM, 'Request error', { message: error.message });
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function for handling API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};
