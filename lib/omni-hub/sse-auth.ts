// lib/omni-hub/sse-auth.ts
// SSE 連線認證中介層
// 驗證 token 後才能訂閱即時事件

import type { NextRequest } from 'next/server';

const SSE_TOKEN = process.env.SSE_TOKEN || 'omni-sse-secret';

export function validateSSERequest(request: NextRequest): boolean {
  // 1. 檢查 Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token === SSE_TOKEN) return true;
  }

  // 2. 檢查 query parameter token（EventSource 不支援自訂 header）
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  if (queryToken === SSE_TOKEN) return true;

  // 3. 檢查 cookie（已登入用戶）
  const cookie = request.headers.get('cookie');
  if (cookie?.includes('omni_demo_session=')) return true;
  if (cookie?.includes('next-auth.session-token=')) return true;

  // 4. 開發模式放行
  if (process.env.NODE_ENV === 'development') return true;

  return false;
}
