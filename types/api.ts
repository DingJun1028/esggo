/**
 * ESG GO | Standard API Response Structure
 * Implements 5T Integrity Protocol at the interface level.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    integrity_tag?: string; // T1..T5
    hash_lock?: string;
    trace_id: string;
  };
}

export type ApiResult<T> = Promise<ApiResponse<T>>;
