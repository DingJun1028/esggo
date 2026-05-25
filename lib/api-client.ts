/**
 * ESG GO | Strongly Typed API Client
 * Wraps all backend calls with Bi-directional TypeScript safety.
 */

import { 
  ApiResponse, 
  SealRequestPayload, 
  VerifyRequestPayload, 
  HermesVisionResult, 
  HermesMetricExtraction 
} from '@/types/omni-core';

async function fetcher<T>(url: string, body: any): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.content || `API Error: ${res.status}`);
  }
  
  return res.json();
}

export const omniApiClient = {
  // OmniCore APIs
  seal: (payload: SealRequestPayload) => 
    fetcher<any>('/api/omnicore/seal', payload),
    
  verify: (payload: VerifyRequestPayload) => 
    fetcher<{ isValid: boolean }>('/api/omnicore/verify', payload),

  // Hermes APIs
  scanVision: (fileId: string, fileType?: string) => 
    fetcher<HermesVisionResult>('/api/hermes/vision', { fileId, fileType }),
    
  extractMetrics: (fileId: string) => 
    fetcher<HermesMetricExtraction>('/api/hermes/alchemy', { fileId }),
};
