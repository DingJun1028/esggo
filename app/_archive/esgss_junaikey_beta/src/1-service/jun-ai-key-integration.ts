import axios from 'axios';
import { omniLogger, LogCategory } from './omniLogger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const CLIENT_API_KEY = import.meta.env.VITE_JUNAIKEY_API_KEY || 'your_secret_api_key';

export interface JunAiTrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  slope: number;
  volatility: number;
  forecast: number[];
  confidence: number;
  summary?: string;
  insights?: string[];
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    const nextDelay = delay * 2;
    omniLogger.warn(
      LogCategory.SYSTEM,
      `JunAiKey: Operation failed, retrying in ${delay}ms... (${retries} left)`,
      { error: err }
    );
    await new Promise(res => setTimeout(res, delay));
    return retryWithBackoff(fn, retries - 1, nextDelay);
  }
}

class JunAiKeyIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = CLIENT_API_KEY;
    this.baseUrl = API_BASE_URL;
  }

  private async castRune<T>(endpoint: string, params: any): Promise<T> {
    return retryWithBackoff(async () => {
      const response = await axios.post(`${this.baseUrl}/jun-ai-key/${endpoint}`, params, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
        transformResponse: [
          data => {
            // Ensure proper JSON parsing for UTF-8 content
            if (typeof data === 'string') {
              try {
                return JSON.parse(data);
              } catch (e) {
                return data;
              }
            }
            return data;
          },
        ],
      });
      return response.data;
    });
  }

  /**
   * 1. Fetch Rune: Retrieve content as Markdown
   */
  async fetchAsMarkdown(url: string): Promise<string> {
    return this.castRune<string>('fetch-url', { url });
  }

  /**
   * 5. Intelligence Rune: Trend Analysis (Backend AI).
   * Offloads computation to the AnalysisService.
   */
  async analyzeTrend(dataPoints: { x: number; y: number }[]): Promise<JunAiTrendAnalysis> {
    return this.castRune<JunAiTrendAnalysis>('analyze-trend', { data: dataPoints });
  }

  /**
   * 2. Verification Rune: Verify Asset Proof
   */
  async verifyAsset(uuid: string): Promise<any> {
    // Direct call to Verification API (5T Protocol)
    return retryWithBackoff(async () => {
      const response = await axios.get(`${this.baseUrl}/verification/${uuid}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
        transformResponse: [
          data => {
            // Ensure proper JSON parsing for UTF-8 content
            if (typeof data === 'string') {
              try {
                return JSON.parse(data);
              } catch (e) {
                return data;
              }
            }
            return data;
          },
        ],
      });
      return response.data; // Response wrapper { success: true, data: ... }
    });
  }
}

export const junAiKeyAPI = new JunAiKeyIntegration();
