import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * 💡 Omni API Client
 * Centralized API handler enforcing the 5T Protocol.
 */

// 5T Protocol Headers
const HEADER_TRACE_ID = 'x-omni-trace-id';
const HEADER_TIMESTAMP = 'x-omni-timestamp';
const HEADER_CLIENT_ID = 'x-omni-client-id';
const HEADER_LOCALE = 'x-omni-locale';

// Default Configuration
const DEFAULT_CONFIG: AxiosRequestConfig = {
    baseURL: '/api', // Proxied to backend in development
    timeout: 30000, // 30s timeout
    headers: {
        'Content-Type': 'application/json',
        [HEADER_CLIENT_ID]: 'jun-ai-key-web-client',
    }
};

// Create Axios Instance
const apiClient: AxiosInstance = axios.create(DEFAULT_CONFIG);

/**
 * Request Interceptor - Inject 5T Headers
 */
apiClient.interceptors.request.use(
    (config) => {
        // [Traceable] Assign unique Trace ID to every request
        config.headers[HEADER_TRACE_ID] = uuidv4();

        // [Trackable] Timestamp for latency tracking
        config.headers[HEADER_TIMESTAMP] = Date.now().toString();

        // Language/Locale Context
        const storedLocale = localStorage.getItem('i18nextLng') || 'zh-TW';
        config.headers[HEADER_LOCALE] = storedLocale;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor - Standardized Error Handling
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        const errorResponse = error.response;

        // Log error with Trace ID for [Traceable] debugging
        const traceId = error.config?.headers?.[HEADER_TRACE_ID];
        console.error(`[OmniAPI] Error ${errorResponse?.status} | TraceID: ${traceId}`, error);

        // Global Error Handling (Can trigger Toasts here later)
        if (errorResponse) {
            switch (errorResponse.status) {
                case 401:
                    // Handle Unauthorized (Redirect to Login)
                    console.warn('[OmniAPI] Unauthorized - Redirecting to login...');
                    // window.location.href = '/login'; // Configurable
                    break;
                case 403:
                    // Handle Forbidden
                    console.warn('[OmniAPI] Forbidden - Access denied.');
                    break;
                case 500:
                    // Handle Server Error
                    console.error('[OmniAPI] Server Error - Backend instability detected.');
                    break;
            }
        }

        return Promise.reject(error);
    }
);

// Generic Response Type
export interface OmniResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        traceId: string;
        timestamp: number;
    };
}

/**
 * Omni API Methods
 */
export const omniApi = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<OmniResponse<T>>(url, config).then(res => res.data),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.post<OmniResponse<T>>(url, data, config).then(res => res.data),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.put<OmniResponse<T>>(url, data, config).then(res => res.data),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        apiClient.delete<OmniResponse<T>>(url, config).then(res => res.data),

    // Direct access to axios instance for advanced usage
    client: apiClient
};

export default omniApi;
