# 手寫 AWS SigV4 對 MinIO PUT（零新依賴）

MinIO 是 S3 相容，但 Next.js server route 不想加 `@aws-sdk/client-s3`（pnpm 鎖定）。改用手寫 SigV4（Node `crypto`）。

## 關鍵點
- algorithm: `AWS4-HMAC-SHA256`
- service: `s3`, region: `us-east-1`（MinIO 預設，即使 bucket 在別區也填這個）
- 簽章鏈：`DateKey = HMAC(date, 'AWS4'+secret)` → `RegionKey = HMAC(region, DateKey)` → `ServiceKey = HMAC(service, RegionKey)` → `SigningKey = HMAC('aws4_request', ServiceKey)`
- StringToSign = `AWS4-HMAC-SHA256\n{timestampISO}\n{date}/{region}/s3/aws4_request\n{h_existing:h_canonical:...}`（canonical request hash）
- Header 必帶：`x-amz-date`、`x-amz-content-sha256`（用 payload sha256 或 `UNSIGNED-PAYLOAD`）、`Authorization`
- Content-Type 任意（如 `application/octet-stream`）

## 驗證（VPS 實證）
- `PUT http://127.0.0.1:19001/evidence-vault/test-x.txt` 帶簽章 → **HTTP 200**（MinIO 接受寫入）
- 匿名 GET 同物件 → 403 AccessDenied（預期，需帶簽章或設桶 policy 公開）
- route 回傳 `url: https://<MINIO_PUBLIC_BASE>/<key>` 給前端（VPS 設 `MINIO_PUBLIC_BASE=https://esggo.co/evidence`）

## 降級
- `MINIO_ENDPOINT` 未設 → route 回 `success:false` 或本地 blob URL fallback（不阻塞 UI 提交）。
- 簽章計算失敗 → catch 後回 502 + error 訊息，前端顯 error 狀態。
