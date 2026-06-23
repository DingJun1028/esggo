# ESGGO API

## 總覽

本文件說明 ESGGO 平台 API 使用方式與對接要點，並提供 ESL App 可直接複用的客戶端程式碼範例。

-規格文件：`openapi.yaml`
-主要端點前綴：`/api`
-授權方式：沿用專案現有認證流程；`openapi.yaml` 以 bearer scheme 記錄對接位置。

## 使用方式

1. 以 `fetch('/api/...', ...)` 直接呼叫 Next.js Route Handler。
2. 參考 `openapi.yaml` 中定義的 request/response schema 組裝 payload。
3. 錯誤格式：`{ success: false, error: { message, code?, details? } }`

## 快速開始

```bash
curl -s http://localhost:3000/api/status
curl -s http://localhost:3000/api/dashboard/stats
```

## React / Next.js API Client

```tsx
// lib/esggo-api-client.ts
type ApiResponse<T> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: { message: string; code?: string; details?: unknown } };

export const apiFetch = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? '';
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  const text = await res.text();
  let payload: ApiResponse<T> | null = null;
  try {
    payload = (text ? JSON.parse(text) : null) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!res.ok || !payload?.success) {
    const message = payload?.error?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return payload;
};
```

## 常用端點

- `GET /api/dashboard/stats`
- `GET /api/environmental/insights`
- `POST /api/environmental/insights`
- `GET /api/vault`
- `POST /api/vault/seal`
- `POST /api/vault/verify`
- `POST /api/ai/generate`
- `POST /api/compliance/gap-analysis`
- `POST /api/digital-twin/simulate`
- `GET /api/audit/logs`

## 變更紀錄

- v1.0.0 — 初版端點總表與 schema。
