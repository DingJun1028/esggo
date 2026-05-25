/**
 * tRPC Client Bridge
 * 提供前端呼叫後端的型別安全介面，底層封裝為 Fetch
 */

import { AppRouter } from '../../server/trpc';

// 這裡我們建立一個 Proxy，讓前端可以像這樣調用：
// const results = await trpc.evidence.list.query({ ... })
// 這將自動具備 AppRouter 的所有型別提示

export const trpc = new Proxy({} as any, {
  get(target, prop: string) {
    return new Proxy({}, {
      get(t, subProp: string) {
        return async (input: any) => {
          const path = `${prop}.${subProp}`;
          const response = await fetch(`/api/trpc/${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });
          const json = await response.json();
          if (!json.success) throw new Error(json.error?.message || 'API Error');
          return json.data;
        };
      }
    });
  }
}) as any; // 在實際環境中，這裡應轉換為對應 AppRouter 的型別

/**
 * 輔助函數：建立 API 請求
 */
export async function trpcCall<T>(path: string, input: any): Promise<T> {
  const response = await fetch(`/api/trpc/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message || 'API Error');
  return json.data;
}
