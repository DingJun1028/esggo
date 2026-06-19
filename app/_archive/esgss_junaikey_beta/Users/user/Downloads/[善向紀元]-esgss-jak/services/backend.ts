
import { logKernelEvent } from './logger';

export interface ActivityRecord {
  date: string;
  amount: number;
  factor_id?: number;
  source: string;
  memo?: string;
}

const API_BASE = 'https://api.nocodebackend.com';
const INSTANCE = '54686_esgss';

/**
 * Robust fetch utility with retry logic for transient failures and rate limits.
 */
async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<Response> {
    logKernelEvent('BACKEND', 'NOCB_FETCH', 'INFO', { url, method: options?.method || 'GET' });
    
    let lastError: any;
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (response.ok) {
                logKernelEvent('BACKEND', 'NOCB_SUCCESS', 'SUCCESS', { url, status: response.status });
                return response;
            }
            
            const isRetryable = response.status === 429 || (response.status >= 500 && response.status <= 599);
            logKernelEvent('BACKEND', 'NOCB_HTTP_ERROR', i < retries ? 'WARNING' : 'ERROR', { url, status: response.status, attempt: i + 1 });
            
            if (i < retries && isRetryable) {
                const backoff = 1000 * Math.pow(2, i);
                await new Promise(r => setTimeout(r, backoff));
                continue;
            } else if (response.status === 429) {
                throw new Error("RATE_LIMIT_EXCEEDED: Backend resources are currently saturated.");
            } else {
                return response;
            }
        } catch (err) {
            lastError = err;
            if (i < retries) {
                const backoff = 1000 * Math.pow(2, i);
                await new Promise(r => setTimeout(r, backoff));
            }
        }
    }
    throw lastError || new Error(`Network request failed to ${url}`);
}

export const BackendService = {
  async logActivity(record: ActivityRecord) {
    logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'INFO', { record });
    try {
      const response = await fetchWithRetry(`${API_BASE}/create/activity_data?Instance=${INSTANCE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'ERROR', { status: response.status });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'ERROR', { error: error.message });
      throw error;
    }
  },

  async fetchFactors() {
    logKernelEvent('BACKEND', 'FETCH_FACTORS', 'INFO');
    try {
      const response = await fetchWithRetry(`${API_BASE}/read/carbon_factors?Instance=${INSTANCE}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  }
};
