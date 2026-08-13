/**
 * Pattern 4 輔助型別 — API Gateway 請求/回應 (避免與 bus.ts 全域型別衝突)
 */
export interface APIRequest {
  clientId: string;
  path: string;
  body?: string;
  headers?: Record<string, string>;
  handler?: () => Promise<unknown> | unknown;
}

export interface APIResponse {
  status: number;
  body: unknown;
  cached: boolean;
  hashLock: string;
}
